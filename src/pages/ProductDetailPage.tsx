import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MessageCircle,
  Plus,
  Check,
  Share2,
  AlertTriangle,
  Phone,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildSingleProductEnquiryMessage, buildWhatsAppUrl } from '../shared/whatsapp';
import { ProductPlaceholder } from '../components/ProductPlaceholder';
import { ProductCard } from '../components/ProductCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SeoHead } from '../components/SeoHead';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, settings, products, categories, addToBasket, setBasketOpen } = useApp();

  const product = useMemo(() => products.find((p) => p.slug === slug), [products, slug]);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantityNote, setQuantityNote] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!product) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-semibold text-[#0D3021]">
          {lang === 'hi' ? 'उत्पाद नहीं मिला' : 'Product Not Found'}
        </h1>
        <p className="text-sm text-[#0D3021]/75">
          {lang === 'hi'
            ? 'यह उत्पाद उपलब्ध नहीं है या इसका पता बदल गया है।'
            : 'This product could not be found in the published catalogue.'}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 py-3 px-5 text-sm font-semibold bg-[#174D35] text-[#F8F3E7]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t.actions.viewAllProducts}</span>
        </Link>
      </section>
    );
  }

  const primaryTitle = lang === 'hi' ? product.nameHi : product.nameEn;
  const secondaryTitle = lang === 'hi' ? product.nameEn : product.nameHi;
  const activeVariant = product.variants[selectedVariantIdx];
  const activeVariantLabel = activeVariant
    ? lang === 'hi'
      ? activeVariant.nameHi
      : activeVariant.nameEn
    : undefined;

  const productCategories = categories.filter((c) => product.categories.includes(c.slug));
  const primaryCat = categories.find((c) => c.slug === product.primaryCategory);

  const allPhotos = [...product.images, ...product.packagingImages];

  const whatsappMessage = buildSingleProductEnquiryMessage(
    product,
    lang,
    activeVariantLabel,
    quantityNote
  );
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage, settings.whatsappNumber);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.primaryCategory === product.primaryCategory)
    .slice(0, 4);

  const availabilityLabel =
    product.stockStatus === 'in_stock'
      ? t.labels.availabilityInStock
      : product.stockStatus === 'limited'
        ? t.labels.availabilityLimited
        : product.stockStatus === 'out_of_stock'
          ? t.labels.availabilityOutOfStock
          : t.labels.availabilityConfirm;

  const botanicalDisplay =
    product.botanicalStatus === 'verified' && product.botanicalName
      ? product.botanicalName
      : product.botanicalStatus === 'ambiguous'
        ? t.labels.botanicalAmbiguous
        : t.labels.botanicalPending;

  const handleAddToBasket = () => {
    addToBasket({
      productId: product.id,
      slug: product.slug,
      nameHi: product.nameHi,
      nameEn: product.nameEn,
      variantName: activeVariantLabel,
      quantityNote: quantityNote.trim(),
    });
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedFeedback(true);
        window.setTimeout(() => setCopiedFeedback(false), 2000);
      } catch {
        // Ignore clipboard denial
      }
    }
  };

  const productJsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${product.nameEn} (${product.nameHi})`,
      description: lang === 'hi' ? product.descriptionHi : product.descriptionEn,
      category: primaryCat ? primaryCat.nameEn : product.primaryCategory,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: settings.brandNameEn,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Products', item: `${window.location.origin}/products` },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.nameEn,
          item: `${window.location.origin}/products/${product.slug}`,
        },
      ],
    },
  ];

  return (
    <>
      <SeoHead
        title={lang === 'hi' ? product.seoTitleHi : product.seoTitleEn}
        description={lang === 'hi' ? product.metaDescriptionHi : product.metaDescriptionEn}
        canonicalPath={`/products/${product.slug}`}
        noIndex={!product.indexable}
        ogImage={allPhotos[0]}
        jsonLd={productJsonLd}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-[#0D3021]/70 flex flex-wrap items-center gap-2">
          <Link to="/" className="hover:text-[#174D35]">{t.nav.home}</Link>
          <span aria-hidden="true">/</span>
          <Link to="/products" className="hover:text-[#174D35]">{t.nav.products}</Link>
          {primaryCat && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/categories/${primaryCat.slug}`} className="hover:text-[#174D35]">
                {lang === 'hi' ? primaryCat.nameHi : primaryCat.nameEn}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-[#0D3021] font-medium">{primaryTitle}</span>
        </nav>

        {/* Main 2-Column PDP Module */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Product Image Gallery / Branded Neutral Placeholder */}
          <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-24">
            <div className="aspect-[4/3] w-full bg-[#EFE8DA] border border-[#0D3021]/12 overflow-hidden">
              {allPhotos.length > 0 ? (
                <img
                  src={allPhotos[activeImageIdx] || allPhotos[0]}
                  alt={`${product.nameHi} — ${product.nameEn}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <ProductPlaceholder
                  nameHi={product.nameHi}
                  nameEn={product.nameEn}
                  sectionCode={product.pdfSources.map((s) => `${s.section}:${s.groupId}`).join(' · ')}
                />
              )}
            </div>

            {allPhotos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allPhotos.map((src, idx) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`aspect-square border overflow-hidden ${
                      idx === activeImageIdx ? 'border-[#174D35] ring-1 ring-[#174D35]' : 'border-[#0D3021]/15'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Contiguous Product Information & Enquiry Module */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2 border-b border-[#0D3021]/10 pb-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#708B45]">
                {productCategories.map((cat, idx) => (
                  <React.Fragment key={cat.slug}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <Link to={`/categories/${cat.slug}`} className="hover:underline">
                      {lang === 'hi' ? cat.nameHi : cat.nameEn}
                    </Link>
                  </React.Fragment>
                ))}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0D3021] leading-tight">
                {primaryTitle}
              </h1>
              <p className="text-lg text-[#174D35] font-medium">{secondaryTitle}</p>

              {(product.alternativeNamesHi.length > 0 || product.alternativeNamesEn.length > 0) && (
                <p className="text-xs text-[#0D3021]/70">
                  <span className="font-medium">
                    {lang === 'hi' ? 'अन्य प्रचलित नाम: ' : 'Also known as: '}
                  </span>
                  {(lang === 'hi'
                    ? [...product.alternativeNamesHi, ...product.alternativeNamesEn]
                    : [...product.alternativeNamesEn, ...product.alternativeNamesHi]
                  ).join(' · ')}
                </p>
              )}
            </div>

            {/* Heightened Safety Notice for Mineral / Chemical / Non-Consumable Items */}
            {(product.safetyTier === 'mineral_chemical' || product.safetyTier === 'non_consumable') && (
              <div
                role="alert"
                className="bg-[#FDF4E7] border border-[#C5A15B] p-4 flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-[#8C4A1C] shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#8C4A1C]">
                    {product.safetyTier === 'mineral_chemical'
                      ? t.labels.mineralCautionHeading
                      : t.labels.nonConsumableHeading}
                  </p>
                  <p className="text-sm text-[#0D3021]/90 leading-relaxed">
                    {lang === 'hi' ? product.safetyInfoHi : product.safetyInfoEn}
                  </p>
                </div>
              </div>
            )}

            {/* Factual Commercial Status Grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-[#0D3021]/10 p-5 text-sm">
              <div>
                <dt className="text-xs text-[#0D3021]/60">{lang === 'hi' ? 'मूल्य' : 'Price'}</dt>
                <dd className="font-semibold text-[#174D35] mt-0.5">
                  {product.priceDisplay === 'Contact for Price' ? t.labels.pricePending : product.priceDisplay}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#0D3021]/60">{lang === 'hi' ? 'उपलब्धता' : 'Availability'}</dt>
                <dd className="font-semibold text-[#0D3021] mt-0.5">{availabilityLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#0D3021]/60">{lang === 'hi' ? 'पैकेजिंग / पैक साइज' : 'Packaging'}</dt>
                <dd className="text-[#0D3021] mt-0.5">
                  {product.packSizes.length > 0 ? product.packSizes.join(' · ') : t.labels.packagingContact}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#0D3021]/60">{lang === 'hi' ? 'वानस्पतिक नाम' : 'Botanical Name'}</dt>
                <dd className="text-[#0D3021] italic mt-0.5">{botanicalDisplay}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#0D3021]/60">{lang === 'hi' ? 'उत्पाद रूप' : 'Product Form'}</dt>
                <dd className="text-[#0D3021] mt-0.5">{product.productForm}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#0D3021]/60">{t.labels.pdfSourceRef}</dt>
                <dd className="text-[#0D3021] mt-0.5 tabular-nums">
                  {product.pdfSources.length > 0
                    ? product.pdfSources
                        .map((s) => `${lang === 'hi' ? 'पृष्ठ' : 'Page'} ${s.page} · ${s.groupId}`)
                        .join(' / ')
                    : lang === 'hi'
                      ? 'प्रशासन द्वारा जोड़ा गया'
                      : 'Admin Catalogue Entry'}
                </dd>
              </div>
            </dl>

            {/* Variant Selector when PDF lists explicit variants */}
            {product.variants.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs font-semibold text-[#0D3021]">{t.labels.availableForms}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariantIdx(idx)}
                      aria-pressed={idx === selectedVariantIdx}
                      className={`px-4 py-2.5 text-sm font-medium border transition-colors whitespace-nowrap ${
                        idx === selectedVariantIdx
                          ? 'bg-[#174D35] text-[#F8F3E7] border-[#174D35]'
                          : 'bg-white text-[#0D3021] border-[#0D3021]/20 hover:border-[#C5A15B]'
                      }`}
                    >
                      {lang === 'hi'
                        ? `${variant.nameHi} (${variant.nameEn})`
                        : `${variant.nameEn} (${variant.nameHi})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Quantity Enquiry Note + Action Buttons */}
            <div className="bg-white border border-[#C5A15B]/40 p-5 space-y-4">
              <div>
                <label htmlFor="pdp-qty-note" className="block text-xs font-medium text-[#0D3021]/75 mb-1.5">
                  {lang === 'hi'
                    ? 'अनुमानित मात्रा (वैकल्पिक — पूछताछ संदेश में शामिल होगी)'
                    : 'Requested Quantity Note (Optional — included in your enquiry)'}
                </label>
                <input
                  id="pdp-qty-note"
                  type="text"
                  value={quantityNote}
                  onChange={(e) => setQuantityNote(e.target.value)}
                  placeholder={lang === 'hi' ? 'जैसे: 100 ग्राम, 250 ग्राम, 1 किग्रा' : 'e.g. 100g, 250g, 1 kg'}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F3E7]/60 border border-[#0D3021]/15 focus:border-[#174D35] focus:outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A15B] shrink-0" aria-hidden="true" />
                  <span>{t.actions.whatsappEnquiry}</span>
                </a>

                <button
                  type="button"
                  onClick={handleAddToBasket}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-semibold border border-[#174D35] text-[#174D35] hover:bg-[#F8F3E7] transition-colors whitespace-nowrap"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{t.actions.addedToBasket}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{t.actions.addToBasket}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#0D3021]/8 text-xs">
                <a
                  href={`tel:${settings.phoneRaw}`}
                  className="inline-flex items-center gap-1.5 text-[#174D35] font-medium hover:underline tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {t.actions.callNow}: {settings.phoneDisplay}
                  </span>
                </a>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setBasketOpen(true)}
                    className="text-[#174D35] font-medium hover:underline"
                  >
                    {t.actions.enquiryBasket}
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1 text-[#0D3021]/70 hover:text-[#174D35]"
                  >
                    <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{copiedFeedback ? t.actions.copiedLink : t.actions.shareProduct}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details, Traditional Uses, Evidence Limitations, Safety & Storage */}
            <div className="space-y-6 pt-2">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[#0D3021]">
                  {lang === 'hi' ? 'उत्पाद परिचय' : 'Product Introduction'}
                </h2>
                <p className="text-sm sm:text-base text-[#0D3021]/85 leading-relaxed">
                  {lang === 'hi' ? product.descriptionHi : product.descriptionEn}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#0D3021]/10 p-5 space-y-2">
                  <h3 className="text-sm font-semibold text-[#174D35]">{t.labels.traditionalUses}</h3>
                  <p className="text-sm text-[#0D3021]/80 leading-relaxed">
                    {lang === 'hi' ? product.traditionalUsesHi : product.traditionalUsesEn}
                  </p>
                </div>

                <div className="bg-white border border-[#0D3021]/10 p-5 space-y-2">
                  <h3 className="text-sm font-semibold text-[#174D35]">{t.labels.evidenceLimitations}</h3>
                  <p className="text-sm text-[#0D3021]/80 leading-relaxed">
                    {lang === 'hi' ? product.evidenceNoteHi : product.evidenceNoteEn}
                  </p>
                </div>

                <div className="bg-white border border-[#0D3021]/10 p-5 space-y-2">
                  <h3 className="text-sm font-semibold text-[#174D35]">{t.labels.importantPrecautions}</h3>
                  <p className="text-sm text-[#0D3021]/80 leading-relaxed">
                    {lang === 'hi' ? product.safetyInfoHi : product.safetyInfoEn}
                  </p>
                </div>

                <div className="bg-white border border-[#0D3021]/10 p-5 space-y-2">
                  <h3 className="text-sm font-semibold text-[#174D35]">{t.labels.storageGuidance}</h3>
                  <p className="text-sm text-[#0D3021]/80 leading-relaxed">
                    {lang === 'hi' ? product.storageInfoHi : product.storageInfoEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DisclaimerBanner />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6 pt-4">
            <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
              {t.labels.relatedProducts}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};
