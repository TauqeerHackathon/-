import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  BookOpen,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ILLUSTRATIVE_ASSETS } from '../shared/categories';
import { buildGeneralEnquiryMessage, buildWhatsAppUrl } from '../shared/whatsapp';
import { sanitizeExternalUrl } from '../shared/validation';
import { ProductCard } from '../components/ProductCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SeoHead } from '../components/SeoHead';

export const HomePage: React.FC = () => {
  const { lang, t, settings, categories, products, articles, setSearchOpen } = useApp();

  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured && p.publicationStatus === 'published').slice(0, 12),
    [products]
  );

  const visibleCategories = useMemo(
    () => categories.filter((c) => c.slug !== 'all-products').slice(0, 8),
    [categories]
  );

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      for (const slug of p.categories) {
        map.set(slug, (map.get(slug) ?? 0) + 1);
      }
    }
    return map;
  }, [products]);

  const publishedArticles = useMemo(
    () => articles.filter((a) => a.status === 'published').slice(0, 3),
    [articles]
  );

  const previewDraftTopics = useMemo(() => articles.slice(0, 6), [articles]);

  const whatsappUrl = buildWhatsAppUrl(buildGeneralEnquiryMessage(lang), settings.whatsappNumber);
  const verifiedMap = sanitizeExternalUrl(settings.verifiedMapUrl);
  const directionsUrl =
    verifiedMap ||
    'https://www.google.com/maps/search/?api=1&query=Kheria+Mod+Chauraha+Agra+Uttar+Pradesh';

  const varietyGroups = [
    {
      slug: 'ayurvedic-herbs',
      titleHi: 'पारंपरिक जड़ी-बूटियां',
      titleEn: 'Traditional Herbs',
      descHi: 'अश्वगंधा, गिलोय, शतावरी, मुलेठी, हरड़, आंवला, बहेड़ा, ब्राह्मी एवं अर्जुन छाल।',
      descEn: 'Ashwagandha, Giloy, Shatavari, Mulethi, Harad, Amla, Baheda, Brahmi & Arjun Bark.',
      image: ILLUSTRATIVE_ASSETS.herbsRoots,
    },
    {
      slug: 'traditional-indian-spices',
      titleHi: 'देसी भारतीय मसाले',
      titleEn: 'Indian Spices',
      descHi: 'अजवाइन, सौंफ, जीरा, शाह जीरा, काली मिर्च, लौंग, इलायची, दालचीनी, सोंठ एवं हींग।',
      descEn: 'Ajwain, Saunf, Jeera, Shah Jeera, Black Pepper, Clove, Cardamom, Cinnamon & Hing.',
      image: ILLUSTRATIVE_ASSETS.spices,
    },
    {
      slug: 'nutritional-seeds',
      titleHi: 'पौष्टिक बीज',
      titleEn: 'Nutritional Seeds',
      descHi: 'अलसी, चिया, कद्दू के बीज, खरबूज मगज, तरबूज मगज, खसखस एवं तिल।',
      descEn: 'Flaxseeds, Chia, Pumpkin Seeds, Melon Kernels, Poppy Seeds & Sesame Seeds.',
      image: ILLUSTRATIVE_ASSETS.seedsDryFruits,
    },
    {
      slug: 'dry-fruits',
      titleHi: 'सूखे मेवे',
      titleEn: 'Dry Fruits',
      descHi: 'मखाना, छुहारा, अंजीर, बीज वाला मुनक्का एवं केसर।',
      descEn: 'Makhana, Dry Dates (Chhuhara), Dried Figs (Anjeer), Seeded Munakka & Kesar.',
      image: ILLUSTRATIVE_ASSETS.seedsDryFruits,
    },
    {
      slug: 'natural-hair-care',
      titleHi: 'प्राकृतिक केश एवं त्वचा देखभाल',
      titleEn: 'Natural Hair & Skin Care',
      descHi: 'रीठा, शिकाकाई, भृंगराज, मेहंदी पत्ती, मुल्तानी मिट्टी, चंदन एवं गुलाब पत्ती।',
      descEn: 'Reetha, Shikakai, Bhringraj, Henna Leaf, Multani Mitti, Sandalwood & Rose Petals.',
      image: ILLUSTRATIVE_ASSETS.hairSkinPooja,
    },
    {
      slug: 'pooja-havan-materials',
      titleHi: 'पारंपरिक पूजा एवं हवन सामग्री',
      titleEn: 'Traditional Pooja Materials',
      descHi: 'हवन सामग्री, भीमसेनी कपूर, लोबान, भैंसा गूगल, जटामांसी, जौ, कमल गट्टा व रुद्राक्ष।',
      descEn: 'Havan Samagri, Bhimseni Kapur, Loban, Guggul, Jatamansi, Jau, Kamal Gatta & Rudraksh.',
      image: ILLUSTRATIVE_ASSETS.hairSkinPooja,
    },
  ];

  return (
    <>
      <SeoHead
        title={
          lang === 'hi'
            ? `${settings.brandNameHi} | ${settings.brandNameEn} — आगरा`
            : `${settings.brandNameEn} — Traditional Herbs & Pansari Store, Agra`
        }
        description={settings.seoDefaultDescription}
        canonicalPath="/"
      />

      {/* SECTION 2 — HERO BANNER */}
      <section className="bg-[#0D3021] text-[#F8F3E7] border-b border-[#C5A15B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Editorial Copy Column */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={settings.logoUrl}
                  alt={`${settings.brandNameHi} — ${settings.brandNameEn}`}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain shrink-0 bg-[#F8F3E7] rounded-full p-0.5"
                />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-[#C5A15B]">
                    {lang === 'hi' ? settings.traditionalIdentityHi : settings.traditionalIdentityEn}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-[#F8F3E7] mt-0.5">
                    {lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}
                  </p>
                  <p className="text-xs text-[#F8F3E7]/70 mt-0.5">
                    {lang === 'hi' ? settings.addressHi : settings.addressEn}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F8F3E7] leading-[1.18] tracking-tight">
                  {lang === 'hi' ? settings.heroHeadingHi : settings.heroHeadingEn}
                </h1>
                <p className="text-base sm:text-lg font-medium text-[#C5A15B] leading-snug">
                  {lang === 'hi' ? settings.heroSubheadingHi : settings.heroSubheadingEn}
                </p>
                <p className="text-sm sm:text-base text-[#F8F3E7]/85 leading-relaxed max-w-xl">
                  {lang === 'hi' ? settings.heroDescriptionHi : settings.heroDescriptionEn}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-semibold bg-[#C5A15B] text-[#0D3021] hover:bg-[#d4b370] transition-colors whitespace-nowrap"
                >
                  <span>{t.actions.exploreProducts}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-semibold border border-[#F8F3E7]/35 text-[#F8F3E7] hover:bg-[#174D35] transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A15B] shrink-0" aria-hidden="true" />
                  <span>{t.actions.whatsappEnquiry}</span>
                </a>
              </div>

              {/* Quick Bilingual Search Bar */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-full max-w-xl flex items-center gap-3 px-4 py-3 bg-[#174D35]/70 border border-[#C5A15B]/30 text-left text-sm text-[#F8F3E7]/75 hover:border-[#C5A15B] transition-colors"
              >
                <Search className="w-4 h-4 text-[#C5A15B] shrink-0" aria-hidden="true" />
                <span className="truncate">{t.actions.searchPlaceholder}</span>
              </button>
            </div>

            {/* Editorial Visual Column */}
            <div className="lg:col-span-6 flex flex-col">
              <figure className="relative flex-1 min-h-[260px] lg:min-h-[420px] border border-[#C5A15B]/35 overflow-hidden bg-[#174D35]">
                <img
                  src={ILLUSTRATIVE_ASSETS.hero}
                  alt={
                    lang === 'hi'
                      ? 'पारंपरिक भारतीय जड़ी-बूटियां, जड़ें, साबुत मसाले और पीतल का खरल (सांकेतिक संपादकीय चित्र)'
                      : 'Illustrative editorial flatlay of traditional Indian herbs, dried roots, spices, and brass mortar'
                  }
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0D3021]/90 via-[#0D3021]/55 to-transparent px-4 py-3 text-[11px] text-[#F8F3E7]/90">
                  {t.labels.illustrativeImageNote}
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Factual Catalogue Reference Strip (Full-Width Row Below Hero Split) */}
          <div className="mt-10 pt-6 border-t border-[#F8F3E7]/15 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-2xl font-serif font-semibold text-[#C5A15B] tabular-nums">
                {products.length}
              </p>
              <p className="text-xs text-[#F8F3E7]/75 mt-1">{t.labels.productsCount}</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-semibold text-[#C5A15B] tabular-nums">
                {categories.length}
              </p>
              <p className="text-xs text-[#F8F3E7]/75 mt-1">{t.labels.categoriesCount}</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-semibold text-[#C5A15B] tabular-nums">35</p>
              <p className="text-xs text-[#F8F3E7]/75 mt-1">{t.labels.pdfGroupsCount}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F8F3E7] tabular-nums">{settings.phoneDisplay}</p>
              <p className="text-xs text-[#F8F3E7]/75 mt-1">
                {settings.contactPerson} · {lang === 'hi' ? 'आगरा' : 'Agra'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — EXPLORE PRODUCT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0D3021]">
              {t.home.categoriesTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#0D3021]/75">{t.home.categoriesSubtitle}</p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#174D35] hover:text-[#0D3021] whitespace-nowrap shrink-0"
          >
            <span>{t.actions.viewAllCategories}</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCategories.map((cat) => {
            const count = categoryCounts.get(cat.slug) ?? 0;
            return (
              <Link
                key={cat.slug}
                to={`/categories/${cat.slug}`}
                className="group bg-white border border-[#0D3021]/10 overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#C5A15B]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#E9E1D2] border-b border-[#0D3021]/8">
                  <img
                    src={cat.image}
                    alt={`${cat.nameHi} — ${cat.nameEn}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="text-xs text-[#708B45] tabular-nums">
                    {count} {lang === 'hi' ? 'उत्पाद' : 'items'}
                  </div>
                  <h3 className="mt-1.5 text-base font-semibold text-[#0D3021] group-hover:text-[#174D35] transition-colors">
                    {lang === 'hi' ? cat.nameHi : cat.nameEn}
                  </h3>
                  <p className="text-xs text-[#0D3021]/60 mt-0.5">
                    {lang === 'hi' ? cat.nameEn : cat.nameHi}
                  </p>
                  <p className="mt-2.5 text-xs text-[#0D3021]/75 line-clamp-2 leading-relaxed">
                    {lang === 'hi' ? cat.descriptionHi : cat.descriptionEn}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 4 — FEATURED PRODUCTS */}
      <section className="bg-[#E9E1D2]/55 border-y border-[#0D3021]/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2 max-w-2xl">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0D3021]">
                {t.home.featuredTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#0D3021]/75">{t.home.featuredSubtitle}</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#174D35] hover:text-[#0D3021] whitespace-nowrap shrink-0"
            >
              <span>{t.actions.viewAllProducts}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — OUR TRADITIONAL IDENTITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white border border-[#C5A15B]/40 p-8 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <img
              src={settings.logoUrl}
              alt={`${settings.brandNameHi} Official Emblem`}
              className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
            />
          </div>

          <div className="lg:col-span-8 space-y-4">
            <p className="text-xs font-semibold tracking-wider text-[#708B45]">
              {t.home.identityKicker}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0D3021]">
              {settings.brandNameHi}
            </h2>
            <p className="text-lg font-semibold text-[#174D35]">
              {settings.traditionalIdentityHi}
            </p>
            <p className="text-sm sm:text-base text-[#0D3021]/80 leading-relaxed max-w-3xl">
              {lang === 'hi' ? settings.aboutIntroHi : settings.aboutIntroEn}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 py-2.5 px-5 text-xs font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] transition-colors"
              >
                <span>{t.nav.about}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                to="/enquiry"
                className="inline-flex items-center gap-2 py-2.5 px-5 text-xs font-semibold border border-[#174D35]/30 text-[#174D35] hover:bg-[#F8F3E7] transition-colors"
              >
                <span>{t.nav.enquiry}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — PRODUCT VARIETY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="space-y-2 max-w-2xl mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0D3021]">
            {t.home.varietyTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#0D3021]/75">{t.home.varietySubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {varietyGroups.map((item, index) => (
            <Link
              key={item.slug}
              to={`/categories/${item.slug}`}
              className="group bg-white border border-[#0D3021]/10 p-6 flex flex-col justify-between gap-4 hover:border-[#C5A15B] transition-colors"
            >
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#C5A15B] tabular-nums">0{index + 1}.</p>
                <h3 className="text-lg font-semibold text-[#0D3021] group-hover:text-[#174D35] transition-colors">
                  {lang === 'hi' ? item.titleHi : item.titleEn}
                </h3>
                <p className="text-sm text-[#0D3021]/75 leading-relaxed">
                  {lang === 'hi' ? item.descHi : item.descEn}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174D35]">
                <span>{t.actions.viewDetails}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 7 — HERBAL KNOWLEDGE CENTRE */}
      <section className="bg-[#0D3021] text-[#F8F3E7] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2 max-w-2xl">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F8F3E7]">
                {t.home.knowledgeTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#F8F3E7]/80">{t.home.knowledgeSubtitle}</p>
            </div>
            <Link
              to="/knowledge"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C5A15B] hover:underline whitespace-nowrap shrink-0"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>{lang === 'hi' ? 'ज्ञान केंद्र देखें' : 'Open Knowledge Centre'}</span>
            </Link>
          </div>

          {publishedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publishedArticles.map((art) => (
                <Link
                  key={art.id}
                  to={`/knowledge/${art.slug}`}
                  className="bg-[#174D35]/60 border border-[#C5A15B]/30 p-6 flex flex-col justify-between hover:border-[#C5A15B] transition-colors"
                >
                  <div className="space-y-2.5">
                    <p className="text-xs text-[#C5A15B]">
                      {lang === 'hi' ? art.categoryHi : art.categoryEn}
                    </p>
                    <h3 className="text-lg font-semibold text-[#F8F3E7] leading-snug">
                      {lang === 'hi' ? art.titleHi : art.titleEn}
                    </h3>
                    <p className="text-sm text-[#F8F3E7]/75 line-clamp-3">
                      {lang === 'hi' ? art.excerptHi : art.excerptEn}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A15B]">
                    <span>{lang === 'hi' ? 'लेख पढ़ें' : 'Read Article'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {previewDraftTopics.map((topic, idx) => (
                <Link
                  key={topic.id}
                  to="/knowledge"
                  className="bg-[#174D35]/45 border border-[#F8F3E7]/15 p-5 space-y-2 hover:border-[#C5A15B]/60 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-[#C5A15B]">
                    <span>{lang === 'hi' ? topic.categoryHi : topic.categoryEn}</span>
                    <span className="tabular-nums text-[#F8F3E7]/65">
                      {lang === 'hi' ? 'समीक्षा प्रतीक्षारत' : 'Editorial Review Pending'}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#F8F3E7] leading-snug">
                    {String(idx + 1).padStart(2, '0')}. {lang === 'hi' ? topic.titleHi : topic.titleEn}
                  </h3>
                  <p className="text-xs text-[#F8F3E7]/75 leading-relaxed line-clamp-2">
                    {lang === 'hi' ? topic.excerptHi : topic.excerptEn}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 8 — WHY VISIT OUR STORE? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-2 max-w-2xl mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0D3021]">
            {t.home.whyVisitTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#0D3021]/75">{t.home.whyVisitSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.home.whyVisitItems.map((item, idx) => (
            <div key={item.title} className="bg-white border border-[#0D3021]/10 p-6 space-y-2">
              <p className="text-xs font-semibold text-[#C5A15B] tabular-nums">0{idx + 1}</p>
              <h3 className="text-base font-semibold text-[#0D3021]">{item.title}</h3>
              <p className="text-sm text-[#0D3021]/75 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9 — VISIT OUR STORE */}
      <section className="bg-[#E9E1D2]/60 border-t border-[#0D3021]/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="bg-white border border-[#C5A15B]/40 p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-semibold text-[#708B45] tracking-wide">
                {t.home.visitStoreTitle}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0D3021]">
                {settings.brandNameHi}
              </h2>
              <p className="text-base font-medium text-[#174D35]">
                {settings.traditionalIdentityHi}
              </p>

              <div className="space-y-2 text-sm text-[#0D3021]/85 pt-2">
                <p className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#174D35] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{lang === 'hi' ? settings.addressHi : settings.addressEn}</span>
                </p>
                <p>
                  <span className="text-[#0D3021]/65">{t.labels.contactPerson}: </span>
                  <span className="font-semibold text-[#0D3021]">{settings.contactPerson}</span>
                </p>
                <p>
                  <span className="text-[#0D3021]/65">{lang === 'hi' ? 'फ़ोन: ' : 'Phone: '}</span>
                  <a
                    href={`tel:${settings.phoneRaw}`}
                    className="font-semibold text-[#174D35] hover:underline tabular-nums"
                  >
                    {settings.phoneDisplay}
                  </a>
                </p>
                <p className="text-xs text-[#0D3021]/65">
                  {lang === 'hi' ? settings.businessHoursHi : settings.businessHoursEn}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <a
                href={`tel:${settings.phoneRaw}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C5A15B]" aria-hidden="true" />
                <span>
                  {t.actions.callNow} ({settings.phoneDisplay})
                </span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-semibold border border-[#174D35] text-[#174D35] hover:bg-[#F8F3E7] transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>{t.actions.whatsappEnquiry}</span>
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-medium bg-[#F8F3E7] border border-[#0D3021]/15 text-[#0D3021] hover:border-[#C5A15B] transition-colors"
              >
                <MapPin className="w-4 h-4 text-[#174D35]" aria-hidden="true" />
                <span>{t.actions.getDirections}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-65" aria-hidden="true" />
              </a>

              {!verifiedMap && (
                <p className="text-[11px] text-[#0D3021]/60 leading-snug">
                  {t.labels.mapPendingNote}
                </p>
              )}
            </div>
          </div>

          <DisclaimerBanner />
        </div>
      </section>
    </>
  );
};
