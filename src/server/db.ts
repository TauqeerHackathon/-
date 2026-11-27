import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { OFFICIAL_PRODUCTS } from '../shared/catalogueData';
import { INITIAL_CATEGORIES } from '../shared/categories';
import { INITIAL_ARTICLES } from '../shared/articlesData';
import { INITIAL_FAQS, INITIAL_GALLERY, OFFICIAL_SETTINGS } from '../shared/defaults';
import type {
  ActivityLog,
  Article,
  BusinessSettings,
  Category,
  Enquiry,
  FaqItem,
  GalleryItem,
  Product,
} from '../shared/types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'kanhaiya.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    data TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0,
    publication_status TEXT NOT NULL DEFAULT 'published',
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    display_order INTEGER NOT NULL DEFAULT 0,
    data TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS gallery_items (
    id TEXT PRIMARY KEY,
    display_order INTEGER NOT NULL DEFAULT 0,
    data TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS faqs (
    id TEXT PRIMARY KEY,
    display_order INTEGER NOT NULL DEFAULT 0,
    data TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    reference_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    data TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_auth (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

function seedIfEmpty(): void {
  const productCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number }).count;
  if (productCount === 0) {
    const insertProduct = db.prepare(
      'INSERT INTO products (id, slug, data, featured, publication_status, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const tx = db.transaction((items: Product[]) => {
      for (const item of items) {
        insertProduct.run(
          item.id,
          item.slug,
          JSON.stringify(item),
          item.featured ? 1 : 0,
          item.publicationStatus,
          item.updatedAt
        );
      }
    });
    tx(OFFICIAL_PRODUCTS);
  }

  const categoryCount = (db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number }).count;
  if (categoryCount === 0) {
    const insertCat = db.prepare('INSERT INTO categories (slug, display_order, data) VALUES (?, ?, ?)');
    const tx = db.transaction((items: Category[]) => {
      for (const item of items) {
        insertCat.run(item.slug, item.displayOrder, JSON.stringify(item));
      }
    });
    tx(INITIAL_CATEGORIES);
  }

  const articleCount = (db.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number }).count;
  if (articleCount === 0) {
    const insertArticle = db.prepare(
      'INSERT INTO articles (id, slug, status, data, updated_at) VALUES (?, ?, ?, ?, ?)'
    );
    const tx = db.transaction((items: Article[]) => {
      for (const item of items) {
        insertArticle.run(item.id, item.slug, item.status, JSON.stringify(item), item.updatedAt);
      }
    });
    tx(INITIAL_ARTICLES);
  }

  const galleryCount = (db.prepare('SELECT COUNT(*) as count FROM gallery_items').get() as { count: number }).count;
  if (galleryCount === 0) {
    const insertGal = db.prepare('INSERT INTO gallery_items (id, display_order, data) VALUES (?, ?, ?)');
    const tx = db.transaction((items: GalleryItem[]) => {
      for (const item of items) {
        insertGal.run(item.id, item.displayOrder, JSON.stringify(item));
      }
    });
    tx(INITIAL_GALLERY);
  }

  const faqCount = (db.prepare('SELECT COUNT(*) as count FROM faqs').get() as { count: number }).count;
  if (faqCount === 0) {
    const insertFaq = db.prepare('INSERT INTO faqs (id, display_order, data) VALUES (?, ?, ?)');
    const tx = db.transaction((items: FaqItem[]) => {
      for (const item of items) {
        insertFaq.run(item.id, item.displayOrder, JSON.stringify(item));
      }
    });
    tx(INITIAL_FAQS);
  }

  const settingsRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('business') as
    | { value: string }
    | undefined;
  if (!settingsRow) {
    const initialSettings: BusinessSettings = {
      ...OFFICIAL_SETTINGS,
      verifiedMapUrl: process.env.VERIFIED_MAP_URL || '',
      analytics: {
        ...OFFICIAL_SETTINGS.analytics,
        ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || '',
        gtmContainerId: process.env.GTM_CONTAINER_ID || '',
        googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
        metaPixelId: process.env.META_PIXEL_ID || '',
      },
    };
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('business', JSON.stringify(initialSettings));
  }
}

seedIfEmpty();

export function logActivity(action: string, entityType: string, entityId: string, summary: string): void {
  db.prepare(
    'INSERT INTO activity_logs (action, entity_type, entity_id, summary, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(action, entityType, entityId, summary, new Date().toISOString());
}

export function getActivityLogs(limit = 100): ActivityLog[] {
  const rows = db
    .prepare('SELECT id, action, entity_type, entity_id, summary, created_at FROM activity_logs ORDER BY id DESC LIMIT ?')
    .all(limit) as Array<{
    id: number;
    action: string;
    entity_type: string;
    entity_id: string;
    summary: string;
    created_at: string;
  }>;
  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    entityType: r.entity_type,
    entityId: r.entity_id,
    summary: r.summary,
    createdAt: r.created_at,
  }));
}

export function getAllProducts(includeDrafts = false): Product[] {
  const rows = includeDrafts
    ? (db.prepare('SELECT data FROM products ORDER BY rowid ASC').all() as Array<{ data: string }>)
    : (db
        .prepare("SELECT data FROM products WHERE publication_status = 'published' ORDER BY rowid ASC")
        .all() as Array<{ data: string }>);
  return rows.map((r) => JSON.parse(r.data) as Product);
}

export function getProductBySlug(slug: string, includeDrafts = false): Product | null {
  const row = includeDrafts
    ? (db.prepare('SELECT data FROM products WHERE slug = ?').get(slug) as { data: string } | undefined)
    : (db
        .prepare("SELECT data FROM products WHERE slug = ? AND publication_status = 'published'")
        .get(slug) as { data: string } | undefined);
  return row ? (JSON.parse(row.data) as Product) : null;
}

export function saveProduct(product: Product): void {
  const updated: Product = { ...product, updatedAt: new Date().toISOString() };
  db.prepare(
    `INSERT INTO products (id, slug, data, featured, publication_status, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       slug = excluded.slug,
       data = excluded.data,
       featured = excluded.featured,
       publication_status = excluded.publication_status,
       updated_at = excluded.updated_at`
  ).run(
    updated.id,
    updated.slug,
    JSON.stringify(updated),
    updated.featured ? 1 : 0,
    updated.publicationStatus,
    updated.updatedAt
  );
}

export function deleteProduct(id: string): boolean {
  const info = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return info.changes > 0;
}

export function getAllCategories(): Category[] {
  const rows = db.prepare('SELECT data FROM categories ORDER BY display_order ASC, slug ASC').all() as Array<{
    data: string;
  }>;
  return rows.map((r) => JSON.parse(r.data) as Category);
}

export function saveCategory(category: Category): void {
  db.prepare(
    `INSERT INTO categories (slug, display_order, data)
     VALUES (?, ?, ?)
     ON CONFLICT(slug) DO UPDATE SET
       display_order = excluded.display_order,
       data = excluded.data`
  ).run(category.slug, category.displayOrder, JSON.stringify(category));
}

export function deleteCategory(slug: string): boolean {
  const info = db.prepare('DELETE FROM categories WHERE slug = ?').run(slug);
  return info.changes > 0;
}

export function getAllArticles(includeDrafts = false): Article[] {
  const rows = includeDrafts
    ? (db.prepare('SELECT data FROM articles ORDER BY rowid ASC').all() as Array<{ data: string }>)
    : (db
        .prepare("SELECT data FROM articles WHERE status = 'published' ORDER BY updated_at DESC")
        .all() as Array<{ data: string }>);
  return rows.map((r) => JSON.parse(r.data) as Article);
}

export function saveArticle(article: Article): void {
  const updated: Article = { ...article, updatedAt: new Date().toISOString() };
  db.prepare(
    `INSERT INTO articles (id, slug, status, data, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       slug = excluded.slug,
       status = excluded.status,
       data = excluded.data,
       updated_at = excluded.updated_at`
  ).run(updated.id, updated.slug, updated.status, JSON.stringify(updated), updated.updatedAt);
}

export function deleteArticle(id: string): boolean {
  const info = db.prepare('DELETE FROM articles WHERE id = ?').run(id);
  return info.changes > 0;
}

export function getAllGalleryItems(): GalleryItem[] {
  const rows = db.prepare('SELECT data FROM gallery_items ORDER BY display_order ASC, rowid DESC').all() as Array<{
    data: string;
  }>;
  return rows.map((r) => JSON.parse(r.data) as GalleryItem);
}

export function saveGalleryItem(item: GalleryItem): void {
  db.prepare(
    `INSERT INTO gallery_items (id, display_order, data)
     VALUES (?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       display_order = excluded.display_order,
       data = excluded.data`
  ).run(item.id, item.displayOrder, JSON.stringify(item));
}

export function deleteGalleryItem(id: string): boolean {
  const info = db.prepare('DELETE FROM gallery_items WHERE id = ?').run(id);
  return info.changes > 0;
}

export function getAllFaqs(): FaqItem[] {
  const rows = db.prepare('SELECT data FROM faqs ORDER BY display_order ASC, rowid ASC').all() as Array<{
    data: string;
  }>;
  return rows.map((r) => JSON.parse(r.data) as FaqItem);
}

export function saveFaq(faq: FaqItem): void {
  db.prepare(
    `INSERT INTO faqs (id, display_order, data)
     VALUES (?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       display_order = excluded.display_order,
       data = excluded.data`
  ).run(faq.id, faq.displayOrder, JSON.stringify(faq));
}

export function deleteFaq(id: string): boolean {
  const info = db.prepare('DELETE FROM faqs WHERE id = ?').run(id);
  return info.changes > 0;
}

export function getAllEnquiries(): Enquiry[] {
  const rows = db.prepare('SELECT data FROM enquiries ORDER BY created_at DESC').all() as Array<{
    data: string;
  }>;
  return rows.map((r) => JSON.parse(r.data) as Enquiry);
}

export function saveEnquiry(enquiry: Enquiry): void {
  db.prepare(
    `INSERT INTO enquiries (id, reference_code, status, data, created_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       status = excluded.status,
       data = excluded.data`
  ).run(enquiry.id, enquiry.referenceCode, enquiry.status, JSON.stringify(enquiry), enquiry.createdAt);
}

export function getBusinessSettings(): BusinessSettings {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('business') as
    | { value: string }
    | undefined;
  if (!row) return OFFICIAL_SETTINGS;
  return { ...OFFICIAL_SETTINGS, ...(JSON.parse(row.value) as Partial<BusinessSettings>) };
}

export function saveBusinessSettings(settings: BusinessSettings): void {
  db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run('business', JSON.stringify(settings));
}

export function getAdminAuthRow(): { password_hash: string; salt: string; created_at: string } | undefined {
  return db.prepare('SELECT password_hash, salt, created_at FROM admin_auth WHERE id = 1').get() as
    | { password_hash: string; salt: string; created_at: string }
    | undefined;
}

export function claimInitialAdminPassword(passwordHash: string, salt: string): boolean {
  const existing = getAdminAuthRow();
  if (existing) return false;
  db.prepare('INSERT INTO admin_auth (id, password_hash, salt, created_at) VALUES (1, ?, ?, ?)').run(
    passwordHash,
    salt,
    new Date().toISOString()
  );
  return true;
}

export function createFullBackup(): Record<string, unknown> {
  return {
    exportedAt: new Date().toISOString(),
    brand: 'Kanhaiya Aushadhi Bhandar',
    settings: getBusinessSettings(),
    categories: getAllCategories(),
    products: getAllProducts(true),
    articles: getAllArticles(true),
    gallery: getAllGalleryItems(),
    faqs: getAllFaqs(),
  };
}

export function restoreFromBackup(payload: {
  settings?: BusinessSettings;
  categories?: Category[];
  products?: Product[];
  articles?: Article[];
  gallery?: GalleryItem[];
  faqs?: FaqItem[];
}): void {
  const tx = db.transaction(() => {
    if (payload.settings) {
      saveBusinessSettings(payload.settings);
    }
    if (Array.isArray(payload.categories) && payload.categories.length > 0) {
      db.prepare('DELETE FROM categories').run();
      for (const cat of payload.categories) saveCategory(cat);
    }
    if (Array.isArray(payload.products) && payload.products.length > 0) {
      db.prepare('DELETE FROM products').run();
      for (const prod of payload.products) saveProduct(prod);
    }
    if (Array.isArray(payload.articles)) {
      db.prepare('DELETE FROM articles').run();
      for (const art of payload.articles) saveArticle(art);
    }
    if (Array.isArray(payload.gallery)) {
      db.prepare('DELETE FROM gallery_items').run();
      for (const g of payload.gallery) saveGalleryItem(g);
    }
    if (Array.isArray(payload.faqs)) {
      db.prepare('DELETE FROM faqs').run();
      for (const f of payload.faqs) saveFaq(f);
    }
  });
  tx();
}
