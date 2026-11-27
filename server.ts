import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  createRateLimiter,
  getAdminAuthStatus,
  issueAdminToken,
  requireAdmin,
  revokeAdminToken,
  setupInitialAdmin,
  verifyAdminPassword,
} from './src/server/auth';
import {
  createFullBackup,
  deleteArticle,
  deleteCategory,
  deleteFaq,
  deleteGalleryItem,
  deleteProduct,
  getActivityLogs,
  getAllArticles,
  getAllCategories,
  getAllEnquiries,
  getAllFaqs,
  getAllGalleryItems,
  getAllProducts,
  getBusinessSettings,
  getProductBySlug,
  logActivity,
  restoreFromBackup,
  saveArticle,
  saveBusinessSettings,
  saveCategory,
  saveEnquiry,
  saveFaq,
  saveGalleryItem,
  saveProduct,
} from './src/server/db';
import type { Article, BusinessSettings, Category, Enquiry, FaqItem, GalleryItem, Product } from './src/shared/types';
import {
  previewBulkImport,
  productsToCsv,
  reconcileProductsAgainstPdf,
  sanitizeExternalUrl,
  slugify,
  validateEnquiryInput,
} from './src/shared/validation';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';
const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/avif', '.avif'],
]);

function hasValidImageMagicBytes(buffer: Buffer, mime: string): boolean {
  if (buffer.length < 12) return false;
  if (mime === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mime === 'image/png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (mime === 'image/webp') {
    return (
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    );
  }
  if (mime === 'image/avif') {
    return buffer.subarray(4, 8).toString('ascii') === 'ftyp';
  }
  return false;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, WebP, or AVIF images are allowed.'));
      return;
    }
    cb(null, true);
  },
});

async function startServer(): Promise<void> {
  const app = express();
  app.set('trust proxy', 1);

  // Baseline security headers (compatible with AI Studio preview iframe — no X-Frame-Options: DENY)
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
  });

  app.use(express.json({ limit: '4mb' }));

  // Serve uploaded authentic product/store photos safely with cache headers
  app.use(
    '/uploads',
    express.static(UPLOAD_DIR, {
      maxAge: '7d',
      dotfiles: 'deny',
      index: false,
    })
  );

  // =========================================================================
  // SEO: Dynamic XML Sitemap & Robots.txt
  // =========================================================================
  app.get('/robots.txt', (req, res) => {
    const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const body = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /api/',
      '',
      `Sitemap: ${baseUrl}/sitemap.xml`,
    ].join('\n');
    res.type('text/plain').send(body);
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const today = new Date().toISOString().slice(0, 10);

    const staticPaths = [
      '/',
      '/about',
      '/products',
      '/categories',
      '/knowledge',
      '/gallery',
      '/faq',
      '/enquiry',
      '/contact',
      '/privacy-policy',
      '/terms-and-conditions',
      '/disclaimer',
    ];

    const categories = getAllCategories();
    const publishedIndexableProducts = getAllProducts(false).filter((p) => p.indexable);
    const publishedArticles = getAllArticles(false);

    const urls: Array<{ loc: string; lastmod: string; priority: string }> = [
      ...staticPaths.map((p) => ({
        loc: `${baseUrl}${p}`,
        lastmod: today,
        priority: p === '/' ? '1.0' : '0.8',
      })),
      ...categories.map((c) => ({
        loc: `${baseUrl}/categories/${encodeURIComponent(c.slug)}`,
        lastmod: today,
        priority: '0.7',
      })),
      ...publishedIndexableProducts.map((p) => ({
        loc: `${baseUrl}/products/${encodeURIComponent(p.slug)}`,
        lastmod: p.updatedAt.slice(0, 10),
        priority: '0.7',
      })),
      ...publishedArticles.map((a) => ({
        loc: `${baseUrl}/knowledge/${encodeURIComponent(a.slug)}`,
        lastmod: a.updatedAt.slice(0, 10),
        priority: '0.6',
      })),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(
        (u) =>
          `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.priority}</priority></url>`
      ),
      '</urlset>',
    ].join('\n');

    res.type('application/xml').send(xml);
  });

  // =========================================================================
  // PUBLIC APIs
  // =========================================================================
  app.get('/api/bootstrap', (_req, res) => {
    const settings = getBusinessSettings();
    const categories = getAllCategories();
    const products = getAllProducts(false);
    const articles = getAllArticles(true).map((a) => ({
      ...a,
      // Expose draft topics as metadata only so Knowledge Centre can show transparent review queue without publishing unreviewed body copy
      contentHi: a.status === 'published' ? a.contentHi : '',
      contentEn: a.status === 'published' ? a.contentEn : '',
    }));
    const gallery = getAllGalleryItems();
    const faqs = getAllFaqs();
    res.json({ settings, categories, products, articles, gallery, faqs });
  });

  app.get('/api/products', (_req, res) => {
    res.json({ products: getAllProducts(false) });
  });

  app.get('/api/products/:slug', (req, res) => {
    const prod = getProductBySlug(req.params.slug, false);
    if (!prod) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    res.json({ product: prod });
  });

  app.get('/api/categories', (_req, res) => {
    res.json({ categories: getAllCategories() });
  });

  app.get('/api/articles', (_req, res) => {
    res.json({ articles: getAllArticles(false) });
  });

  app.get('/api/gallery', (_req, res) => {
    res.json({ gallery: getAllGalleryItems() });
  });

  app.get('/api/faqs', (_req, res) => {
    res.json({ faqs: getAllFaqs() });
  });

  const enquiryLimiter = createRateLimiter('enquiry', 15, 10 * 60 * 1000);
  app.post('/api/enquiries', enquiryLimiter, (req, res) => {
    const body = req.body ?? {};
    const errors = validateEnquiryInput(body);
    if (errors.length > 0) {
      res.status(400).json({ error: errors[0], errors });
      return;
    }

    const now = new Date().toISOString();
    const id = `enq-${crypto.randomUUID().slice(0, 8)}`;
    const referenceCode = `KAB-${new Date().getFullYear()}-${crypto.randomInt(1000, 9999)}`;
    const enquiry: Enquiry = {
      id,
      referenceCode,
      customerName: String(body.customerName).trim().slice(0, 120),
      phone: String(body.phone).trim().slice(0, 24),
      email: String(body.email || '').trim().slice(0, 120),
      city: String(body.city || '').trim().slice(0, 80),
      message: String(body.message || '').trim().slice(0, 1500),
      items: Array.isArray(body.items)
        ? body.items.slice(0, 30).map((item: Record<string, unknown>) => ({
            productId: String(item.productId || '').slice(0, 80),
            slug: String(item.slug || '').slice(0, 80),
            nameHi: String(item.nameHi || '').slice(0, 120),
            nameEn: String(item.nameEn || '').slice(0, 120),
            variantName: item.variantName ? String(item.variantName).slice(0, 80) : undefined,
            quantityNote: String(item.quantityNote || '').slice(0, 80),
          }))
        : [],
      status: 'new',
      followUpNotes: '',
      createdAt: now,
      updatedAt: now,
    };

    saveEnquiry(enquiry);
    res.status(201).json({ enquiry });
  });

  // =========================================================================
  // ADMIN AUTHENTICATION ROUTES
  // =========================================================================
  const authLimiter = createRateLimiter('admin_auth', 20, 10 * 60 * 1000);

  app.get('/api/admin/auth/status', (_req, res) => {
    res.json(getAdminAuthStatus());
  });

  app.post('/api/admin/auth/setup', authLimiter, (req, res) => {
    const password = String(req.body?.password || '');
    const result = setupInitialAdmin(password);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    logActivity('admin_setup', 'auth', 'admin', 'Initial administrator password configured.');
    const session = issueAdminToken();
    res.status(201).json(session);
  });

  app.post('/api/admin/auth/login', authLimiter, (req, res) => {
    const password = String(req.body?.password || '');
    if (!verifyAdminPassword(password)) {
      res.status(401).json({ error: 'Invalid administrator password.' });
      return;
    }
    const session = issueAdminToken();
    logActivity('admin_login', 'auth', 'admin', 'Administrator signed in.');
    res.json(session);
  });

  app.post('/api/admin/auth/logout', requireAdmin, (req, res) => {
    const token = (req.headers.authorization || '').slice(7).trim();
    revokeAdminToken(token);
    res.json({ ok: true });
  });

  // =========================================================================
  // PROTECTED ADMIN ROUTES
  // =========================================================================
  app.get('/api/admin/overview', requireAdmin, (_req, res) => {
    const products = getAllProducts(true);
    const categories = getAllCategories();
    const articles = getAllArticles(true);
    const gallery = getAllGalleryItems();
    const enquiries = getAllEnquiries();
    const faqs = getAllFaqs();
    const settings = getBusinessSettings();
    const logs = getActivityLogs(80);
    const reconciliation = reconcileProductsAgainstPdf(products);

    res.json({
      stats: {
        totalProducts: products.length,
        publishedProducts: products.filter((p) => p.publicationStatus === 'published').length,
        draftProducts: products.filter((p) => p.publicationStatus === 'draft').length,
        verificationPending: products.filter((p) => p.botanicalStatus !== 'verified').length,
        categoriesCount: categories.length,
        enquiriesCount: enquiries.length,
        newEnquiriesCount: enquiries.filter((e) => e.status === 'new').length,
        articlesCount: articles.length,
        publishedArticlesCount: articles.filter((a) => a.status === 'published').length,
        galleryCount: gallery.length,
      },
      reconciliation,
      products,
      categories,
      articles,
      gallery,
      enquiries,
      faqs,
      settings,
      logs,
    });
  });

  // Product CRUD
  app.post('/api/admin/products', requireAdmin, (req, res) => {
    const body = req.body as Partial<Product>;
    const nameHi = String(body.nameHi || '').trim();
    const nameEn = String(body.nameEn || '').trim();
    if (!nameHi || !nameEn) {
      res.status(400).json({ error: 'Both Hindi name and English name are required.' });
      return;
    }
    const slug = slugify(String(body.slug || nameEn)) || `product-${Date.now()}`;
    if (getProductBySlug(slug, true)) {
      res.status(409).json({ error: `A product with slug "${slug}" already exists.` });
      return;
    }
    const now = new Date().toISOString();
    const product: Product = {
      id: body.id?.trim() || `kab-custom-${crypto.randomUUID().slice(0, 8)}`,
      slug,
      originalPdfName: String(body.originalPdfName || `${nameHi} (Admin Added)`).trim(),
      nameHi,
      nameEn,
      alternativeNamesHi: Array.isArray(body.alternativeNamesHi) ? body.alternativeNamesHi : [],
      alternativeNamesEn: Array.isArray(body.alternativeNamesEn) ? body.alternativeNamesEn : [],
      searchAliases: Array.isArray(body.searchAliases) ? body.searchAliases : [nameHi, nameEn],
      primaryCategory: String(body.primaryCategory || 'ayurvedic-herbs'),
      categories: Array.isArray(body.categories) && body.categories.length > 0
        ? body.categories
        : [String(body.primaryCategory || 'ayurvedic-herbs')],
      pdfSources: Array.isArray(body.pdfSources) ? body.pdfSources : [],
      variants: Array.isArray(body.variants) ? body.variants : [],
      botanicalName: body.botanicalName ? String(body.botanicalName).trim() : null,
      botanicalStatus: body.botanicalStatus || 'pending',
      safetyTier: body.safetyTier || 'standard',
      regulatoryNote: String(body.regulatoryNote || 'Pending Review'),
      descriptionHi: String(body.descriptionHi || 'विवरण समीक्षा प्रतीक्षारत।'),
      descriptionEn: String(body.descriptionEn || 'Product details pending review.'),
      traditionalUsesHi: String(body.traditionalUsesHi || 'समीक्षा प्रतीक्षारत।'),
      traditionalUsesEn: String(body.traditionalUsesEn || 'Pending review.'),
      evidenceNoteHi: String(
        body.evidenceNoteHi || 'पारंपरिक संदर्भ केवल शैक्षणिक उद्देश्य हेतु है; नैदानिक दावा नहीं किया जाता।'
      ),
      evidenceNoteEn: String(
        body.evidenceNoteEn || 'Traditional context is for educational reference only; no clinical claim is made.'
      ),
      productForm: String(body.productForm || 'Raw Botanical'),
      images: Array.isArray(body.images) ? body.images.map((u) => sanitizeExternalUrl(u)).filter(Boolean) : [],
      packagingImages: Array.isArray(body.packagingImages)
        ? body.packagingImages.map((u) => sanitizeExternalUrl(u)).filter(Boolean)
        : [],
      packSizes: Array.isArray(body.packSizes) ? body.packSizes : [],
      priceDisplay: String(body.priceDisplay || 'Contact for Price'),
      stockStatus: body.stockStatus || 'confirm_availability',
      safetyInfoHi: String(body.safetyInfoHi || 'उपयोग से पूर्व योग्य वैद्य या चिकित्सक से परामर्श लें।'),
      safetyInfoEn: String(body.safetyInfoEn || 'Consult a qualified healthcare practitioner before use.'),
      storageInfoHi: String(body.storageInfoHi || 'स्वच्छ एवं सूखे स्थान पर वायुरोधी पात्र में रखें।'),
      storageInfoEn: String(body.storageInfoEn || 'Store in a clean, dry airtight container.'),
      seoTitleHi: String(body.seoTitleHi || `${nameHi} — कन्हैया औषधि भंडार, आगरा`),
      seoTitleEn: String(body.seoTitleEn || `${nameEn} — Kanhaiya Aushadhi Bhandar, Agra`),
      metaDescriptionHi: String(body.metaDescriptionHi || ''),
      metaDescriptionEn: String(body.metaDescriptionEn || ''),
      featured: Boolean(body.featured),
      publicationStatus: body.publicationStatus === 'draft' ? 'draft' : 'published',
      indexable: Boolean(body.indexable),
      updatedAt: now,
    };

    saveProduct(product);
    logActivity('create', 'product', product.id, `Created product ${product.nameEn} (${product.nameHi}).`);
    res.status(201).json({ product });
  });

  app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
    const existing = getAllProducts(true).find((p) => p.id === req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    const patch = req.body as Partial<Product>;
    const updated: Product = {
      ...existing,
      ...patch,
      id: existing.id,
      slug: patch.slug ? slugify(patch.slug) || existing.slug : existing.slug,
      images: Array.isArray(patch.images)
        ? patch.images.map((u) => sanitizeExternalUrl(u)).filter(Boolean)
        : existing.images,
      packagingImages: Array.isArray(patch.packagingImages)
        ? patch.packagingImages.map((u) => sanitizeExternalUrl(u)).filter(Boolean)
        : existing.packagingImages,
      updatedAt: new Date().toISOString(),
    };
    saveProduct(updated);
    logActivity('update', 'product', updated.id, `Updated product ${updated.nameEn}.`);
    res.json({ product: updated });
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
    const deleted = deleteProduct(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    logActivity('delete', 'product', req.params.id, `Deleted product ${req.params.id}.`);
    res.json({ ok: true });
  });

  // Category CRUD
  app.post('/api/admin/categories', requireAdmin, (req, res) => {
    const body = req.body as Partial<Category>;
    const nameHi = String(body.nameHi || '').trim();
    const nameEn = String(body.nameEn || '').trim();
    if (!nameHi || !nameEn) {
      res.status(400).json({ error: 'Category Hindi and English names are required.' });
      return;
    }
    const slug = slugify(String(body.slug || nameEn));
    const category: Category = {
      slug,
      nameHi,
      nameEn,
      descriptionHi: String(body.descriptionHi || ''),
      descriptionEn: String(body.descriptionEn || ''),
      image: sanitizeExternalUrl(body.image) || '/src/assets/images/cat_herbs_roots_1795764796520.jpg',
      imageIsIllustrative: body.imageIsIllustrative ?? true,
      displayOrder: Number(body.displayOrder ?? 99),
      pdfSections: Array.isArray(body.pdfSections) ? body.pdfSections : ['A'],
    };
    saveCategory(category);
    logActivity('save', 'category', category.slug, `Saved category ${category.nameEn}.`);
    res.status(201).json({ category });
  });

  app.put('/api/admin/categories/:slug', requireAdmin, (req, res) => {
    const existing = getAllCategories().find((c) => c.slug === req.params.slug);
    if (!existing) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }
    const patch = req.body as Partial<Category>;
    const updated: Category = {
      ...existing,
      ...patch,
      slug: existing.slug,
      image: patch.image ? sanitizeExternalUrl(patch.image) || existing.image : existing.image,
    };
    saveCategory(updated);
    logActivity('update', 'category', updated.slug, `Updated category ${updated.nameEn}.`);
    res.json({ category: updated });
  });

  app.delete('/api/admin/categories/:slug', requireAdmin, (req, res) => {
    if (req.params.slug === 'all-products') {
      res.status(400).json({ error: 'Cannot delete the All Products category.' });
      return;
    }
    deleteCategory(req.params.slug);
    logActivity('delete', 'category', req.params.slug, `Deleted category ${req.params.slug}.`);
    res.json({ ok: true });
  });

  // Article Studio CRUD
  app.post('/api/admin/articles', requireAdmin, (req, res) => {
    const body = req.body as Partial<Article>;
    const titleHi = String(body.titleHi || '').trim();
    const titleEn = String(body.titleEn || '').trim();
    if (!titleHi || !titleEn) {
      res.status(400).json({ error: 'Article Hindi and English titles are required.' });
      return;
    }
    const article: Article = {
      id: body.id || `art-${crypto.randomUUID().slice(0, 8)}`,
      slug: slugify(String(body.slug || titleEn)) || `article-${Date.now()}`,
      titleHi,
      titleEn,
      excerptHi: String(body.excerptHi || ''),
      excerptEn: String(body.excerptEn || ''),
      contentHi: String(body.contentHi || ''),
      contentEn: String(body.contentEn || ''),
      categoryHi: String(body.categoryHi || 'जड़ी-बूटी ज्ञान'),
      categoryEn: String(body.categoryEn || 'Herbal Guide'),
      coverImage: body.coverImage ? sanitizeExternalUrl(body.coverImage) || null : null,
      relatedProductSlugs: Array.isArray(body.relatedProductSlugs) ? body.relatedProductSlugs : [],
      references: Array.isArray(body.references) ? body.references : [],
      evidenceDisclaimerHi: String(
        body.evidenceDisclaimerHi ||
          'यह जानकारी सामान्य शैक्षणिक एवं पारंपरिक उपयोग के उद्देश्य से है। किसी विशेष रोग हेतु योग्य चिकित्सक से परामर्श लें।'
      ),
      evidenceDisclaimerEn: String(
        body.evidenceDisclaimerEn ||
          'This article is for general educational reference only. Consult a qualified healthcare professional before using any medicinal ingredient.'
      ),
      seoTitle: String(body.seoTitle || titleHi),
      metaDescription: String(body.metaDescription || ''),
      status: body.status === 'published' ? 'published' : 'draft',
      reviewStatus: body.reviewStatus === 'reviewed' ? 'reviewed' : 'pending_expert_review',
      scheduledAt: body.scheduledAt || null,
      updatedAt: new Date().toISOString(),
    };
    saveArticle(article);
    logActivity('save', 'article', article.id, `Saved article "${article.titleEn}" (${article.status}).`);
    res.status(201).json({ article });
  });

  app.put('/api/admin/articles/:id', requireAdmin, (req, res) => {
    const existing = getAllArticles(true).find((a) => a.id === req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Article not found.' });
      return;
    }
    const patch = req.body as Partial<Article>;
    const updated: Article = {
      ...existing,
      ...patch,
      id: existing.id,
      coverImage:
        patch.coverImage !== undefined
          ? patch.coverImage
            ? sanitizeExternalUrl(patch.coverImage) || null
            : null
          : existing.coverImage,
      updatedAt: new Date().toISOString(),
    };
    saveArticle(updated);
    logActivity('update', 'article', updated.id, `Updated article "${updated.titleEn}" (${updated.status}).`);
    res.json({ article: updated });
  });

  app.delete('/api/admin/articles/:id', requireAdmin, (req, res) => {
    deleteArticle(req.params.id);
    logActivity('delete', 'article', req.params.id, `Deleted article ${req.params.id}.`);
    res.json({ ok: true });
  });

  // Gallery CRUD
  app.post('/api/admin/gallery', requireAdmin, (req, res) => {
    const body = req.body as Partial<GalleryItem>;
    const imageUrl = sanitizeExternalUrl(body.imageUrl);
    if (!imageUrl) {
      res.status(400).json({ error: 'Valid image URL is required.' });
      return;
    }
    const item: GalleryItem = {
      id: body.id || `gal-${crypto.randomUUID().slice(0, 8)}`,
      titleHi: String(body.titleHi || 'स्टोर चित्र'),
      titleEn: String(body.titleEn || 'Store Photo'),
      category: body.category || 'store',
      imageUrl,
      altHi: String(body.altHi || body.titleHi || 'कन्हैया औषधि भंडार'),
      altEn: String(body.altEn || body.titleEn || 'Kanhaiya Aushadhi Bhandar'),
      isIllustrative: Boolean(body.isIllustrative),
      displayOrder: Number(body.displayOrder ?? 10),
      createdAt: new Date().toISOString(),
    };
    saveGalleryItem(item);
    logActivity('create', 'gallery', item.id, `Added gallery item "${item.titleEn}".`);
    res.status(201).json({ item });
  });

  app.delete('/api/admin/gallery/:id', requireAdmin, (req, res) => {
    deleteGalleryItem(req.params.id);
    logActivity('delete', 'gallery', req.params.id, `Deleted gallery item ${req.params.id}.`);
    res.json({ ok: true });
  });

  // FAQ CRUD
  app.post('/api/admin/faqs', requireAdmin, (req, res) => {
    const body = req.body as Partial<FaqItem>;
    if (!body.questionHi || !body.questionEn) {
      res.status(400).json({ error: 'Both Hindi and English questions are required.' });
      return;
    }
    const faq: FaqItem = {
      id: body.id || `faq-${crypto.randomUUID().slice(0, 6)}`,
      questionHi: String(body.questionHi).trim(),
      questionEn: String(body.questionEn).trim(),
      answerHi: String(body.answerHi || '').trim(),
      answerEn: String(body.answerEn || '').trim(),
      displayOrder: Number(body.displayOrder ?? 20),
    };
    saveFaq(faq);
    logActivity('save', 'faq', faq.id, `Saved FAQ "${faq.questionEn}".`);
    res.status(201).json({ faq });
  });

  app.delete('/api/admin/faqs/:id', requireAdmin, (req, res) => {
    deleteFaq(req.params.id);
    logActivity('delete', 'faq', req.params.id, `Deleted FAQ ${req.params.id}.`);
    res.json({ ok: true });
  });

  // Enquiry Manager
  app.patch('/api/admin/enquiries/:id', requireAdmin, (req, res) => {
    const existing = getAllEnquiries().find((e) => e.id === req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }
    const updated: Enquiry = {
      ...existing,
      status: req.body?.status || existing.status,
      followUpNotes:
        req.body?.followUpNotes !== undefined ? String(req.body.followUpNotes).slice(0, 1500) : existing.followUpNotes,
      updatedAt: new Date().toISOString(),
    };
    saveEnquiry(updated);
    logActivity('update', 'enquiry', updated.referenceCode, `Updated enquiry ${updated.referenceCode} to ${updated.status}.`);
    res.json({ enquiry: updated });
  });

  // Business Settings
  app.put('/api/admin/settings', requireAdmin, (req, res) => {
    const current = getBusinessSettings();
    const patch = req.body as Partial<BusinessSettings>;
    const updated: BusinessSettings = {
      ...current,
      ...patch,
      logoUrl: current.logoUrl, // Strict brand logo protection: official logo cannot be altered arbitrarily
      verifiedMapUrl: patch.verifiedMapUrl !== undefined ? sanitizeExternalUrl(patch.verifiedMapUrl) : current.verifiedMapUrl,
      socialLinks: {
        facebook: sanitizeExternalUrl(patch.socialLinks?.facebook ?? current.socialLinks.facebook),
        instagram: sanitizeExternalUrl(patch.socialLinks?.instagram ?? current.socialLinks.instagram),
        youtube: sanitizeExternalUrl(patch.socialLinks?.youtube ?? current.socialLinks.youtube),
        googleBusiness: sanitizeExternalUrl(patch.socialLinks?.googleBusiness ?? current.socialLinks.googleBusiness),
      },
      analytics: {
        ...current.analytics,
        ...(patch.analytics ?? {}),
      },
    };
    saveBusinessSettings(updated);
    logActivity('update', 'settings', 'business', 'Updated business and SEO settings.');
    res.json({ settings: updated });
  });

  // Secure Image Upload
  app.post('/api/admin/upload', requireAdmin, (req, res) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : 'Upload failed.' });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: 'No image file provided.' });
        return;
      }
      const ext = ALLOWED_MIME.get(req.file.mimetype);
      if (!ext || !hasValidImageMagicBytes(req.file.buffer, req.file.mimetype)) {
        res.status(400).json({ error: 'Uploaded file failed image signature verification.' });
        return;
      }
      const safeFilename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
      const resolvedDest = path.resolve(UPLOAD_DIR, safeFilename);
      if (!resolvedDest.startsWith(UPLOAD_DIR + path.sep)) {
        res.status(400).json({ error: 'Invalid upload destination path.' });
        return;
      }
      fs.writeFileSync(resolvedDest, req.file.buffer);
      const url = `/uploads/${safeFilename}`;
      logActivity('upload', 'media', safeFilename, `Uploaded verified image ${safeFilename}.`);
      res.status(201).json({ url, filename: safeFilename });
    });
  });

  // Bulk Export / Import & Backup / Restore
  app.get('/api/admin/export/:format', requireAdmin, (req, res) => {
    const products = getAllProducts(true);
    if (req.params.format === 'csv') {
      const csv = productsToCsv(products);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="kanhaiya-products.csv"');
      res.send(csv);
      return;
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="kanhaiya-products.json"');
    res.send(JSON.stringify({ exportedAt: new Date().toISOString(), products }, null, 2));
  });

  app.post('/api/admin/import', requireAdmin, (req, res) => {
    const format = req.body?.format === 'csv' ? 'csv' : 'json';
    const rawText = String(req.body?.payload || '');
    const skipDuplicates = req.body?.skipDuplicates !== false;
    const existing = getAllProducts(true);
    const existingSlugs = new Set(existing.map((p) => p.slug));
    const preview = previewBulkImport(rawText, format, existingSlugs);

    if (preview.errors.length > 0) {
      res.status(400).json({ error: 'Import validation failed.', errors: preview.errors, preview });
      return;
    }

    let importedCount = 0;
    let skippedCount = 0;

    for (const row of preview.validRows) {
      if (row.isDuplicate && skipDuplicates) {
        skippedCount += 1;
        continue;
      }
      const now = new Date().toISOString();
      const prod: Product = {
        id: `kab-import-${crypto.randomUUID().slice(0, 8)}`,
        slug: row.slug,
        originalPdfName: `${row.nameHi} (Bulk Import)`,
        nameHi: row.nameHi,
        nameEn: row.nameEn,
        alternativeNamesHi: [],
        alternativeNamesEn: [],
        searchAliases: [row.nameHi, row.nameEn],
        primaryCategory: row.primaryCategory,
        categories: [row.primaryCategory],
        pdfSources: [],
        variants: [],
        botanicalName: null,
        botanicalStatus: 'pending',
        safetyTier: 'standard',
        regulatoryNote: 'Pending Review',
        descriptionHi: 'बल्क इम्पोर्ट द्वारा जोड़ा गया — विवरण समीक्षा प्रतीक्षारत।',
        descriptionEn: 'Added via bulk import — details pending review.',
        traditionalUsesHi: 'समीक्षा प्रतीक्षारत।',
        traditionalUsesEn: 'Pending review.',
        evidenceNoteHi: 'पारंपरिक संदर्भ केवल शैक्षणिक उद्देश्य हेतु है।',
        evidenceNoteEn: 'Traditional reference only; no clinical claim.',
        productForm: row.productForm,
        images: [],
        packagingImages: [],
        packSizes: [],
        priceDisplay: row.priceDisplay || 'Contact for Price',
        stockStatus: 'confirm_availability',
        safetyInfoHi: 'उपयोग से पूर्व योग्य वैद्य या चिकित्सक से परामर्श लें।',
        safetyInfoEn: 'Consult a qualified practitioner before use.',
        storageInfoHi: 'स्वच्छ एवं सूखे स्थान पर सुरक्षित रखें।',
        storageInfoEn: 'Store in a clean, dry airtight container.',
        seoTitleHi: `${row.nameHi} — कन्हैया औषधि भंडार`,
        seoTitleEn: `${row.nameEn} — Kanhaiya Aushadhi Bhandar`,
        metaDescriptionHi: '',
        metaDescriptionEn: '',
        featured: false,
        publicationStatus: 'draft',
        indexable: false,
        updatedAt: now,
      };
      saveProduct(prod);
      importedCount += 1;
    }

    logActivity('import', 'product', 'bulk', `Bulk imported ${importedCount} products (${skippedCount} duplicates skipped).`);
    res.json({ importedCount, skippedCount });
  });

  app.get('/api/admin/backup', requireAdmin, (_req, res) => {
    const backup = createFullBackup();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="kanhaiya-full-backup.json"');
    res.send(JSON.stringify(backup, null, 2));
  });

  app.post('/api/admin/restore', requireAdmin, (req, res) => {
    const payload = req.body;
    if (!payload || typeof payload !== 'object' || !Array.isArray(payload.products)) {
      res.status(400).json({ error: 'Invalid backup payload. Must contain products array.' });
      return;
    }
    restoreFromBackup(payload);
    logActivity('restore', 'system', 'backup', `Restored database snapshot with ${payload.products.length} products.`);
    res.json({ ok: true, restoredProducts: payload.products.length });
  });

  // =========================================================================
  // VITE DEV MIDDLEWARE / PRODUCTION STATIC SERVING
  // =========================================================================
  if (!IS_PROD) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir, { maxAge: '1d' }));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kanhaiya Aushadhi Bhandar server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
