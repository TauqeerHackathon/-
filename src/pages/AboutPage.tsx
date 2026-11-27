import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildGeneralEnquiryMessage, buildWhatsAppUrl } from '../shared/whatsapp';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SeoHead } from '../components/SeoHead';

const OFFICIAL_BUSINESS_CATEGORIES = [
  { hi: 'पारंपरिक हर्बल उत्पाद', en: 'Traditional herbal products' },
  { hi: 'आयुर्वेदिक कच्ची सामग्री', en: 'Ayurvedic raw ingredients' },
  { hi: 'सूखी औषधीय जड़ी-बूटियां', en: 'Dried medicinal herbs' },
  { hi: 'औषधीय जड़ें एवं चूर्ण', en: 'Herbal roots and powders' },
  { hi: 'पारंपरिक भारतीय मसाले', en: 'Traditional Indian spices' },
  { hi: 'पौष्टिक बीज', en: 'Nutritional seeds' },
  { hi: 'सूखे मेवे', en: 'Dry fruits' },
  { hi: 'पारंपरिक गोंद', en: 'Traditional gums' },
  { hi: 'प्राकृतिक केश देखभाल सामग्री', en: 'Natural hair care ingredients' },
  { hi: 'प्राकृतिक त्वचा देखभाल सामग्री', en: 'Natural skin care ingredients' },
  { hi: 'मौसमी काढ़ा सामग्री', en: 'Seasonal kadha ingredients' },
  { hi: 'पूजा एवं हवन सामग्री', en: 'Pooja and havan materials' },
  { hi: 'पारंपरिक पंसारी उत्पाद', en: 'Traditional pansari products' },
];

export const AboutPage: React.FC = () => {
  const { lang, t, settings, products, categories } = useApp();
  const whatsappUrl = buildWhatsAppUrl(buildGeneralEnquiryMessage(lang), settings.whatsappNumber);

  return (
    <>
      <SeoHead
        title={`${t.nav.about} — ${lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}`}
        description={lang === 'hi' ? settings.aboutIntroHi : settings.aboutIntroEn}
        canonicalPath="/about"
      />

      <section className="bg-[#0D3021] text-[#F8F3E7] py-14 border-b border-[#C5A15B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold text-[#C5A15B] tracking-wide">
            {t.home.identityKicker}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-2">
            {settings.brandNameHi}
          </h1>
          <p className="text-lg text-[#C5A15B] mt-1 font-medium">
            {settings.traditionalIdentityHi}
          </p>
          <p className="text-sm text-[#F8F3E7]/80 mt-2">
            {settings.brandNameEn} · {lang === 'hi' ? settings.taglineHi : settings.taglineEn}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 bg-white border border-[#C5A15B]/40 p-8 flex flex-col items-center text-center space-y-4">
            <img
              src={settings.logoUrl}
              alt={`${settings.brandNameHi} — ${settings.brandNameEn}`}
              className="w-48 h-48 object-contain"
            />
            <div className="space-y-1 pt-2 border-t border-[#0D3021]/10 w-full">
              <p className="text-base font-bold text-[#0D3021]">{settings.brandNameHi}</p>
              <p className="text-xs text-[#708B45] font-medium">{settings.traditionalIdentityHi}</p>
              <p className="text-xs text-[#0D3021]/70 pt-2">
                {lang === 'hi' ? settings.addressHi : settings.addressEn}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0D3021]">
                {lang === 'hi' ? 'आगरा में पारंपरिक पंसारी एवं जड़ी-बूटी केंद्र' : 'Traditional Pansari & Raw Herbal Store in Agra'}
              </h2>
              <p className="text-base text-[#0D3021]/85 leading-relaxed">
                {lang === 'hi' ? settings.aboutIntroHi : settings.aboutIntroEn}
              </p>
              <p className="text-sm text-[#0D3021]/75 leading-relaxed">
                {lang === 'hi'
                  ? 'हम इस डिजिटल मंच पर केवल आधिकारिक सूची में सम्मिलित उत्पादों और सत्यापित व्यावसायिक विवरणों को प्रस्तुत करते हैं। किसी भी उत्पाद की वर्तमान उपलब्धता, रूप, पैकेजिंग एवं मूल्य के लिए ग्राहक सीधे स्टोर से संपर्क कर सकते हैं।'
                  : 'This digital platform faithfully represents the official Kanhaiya Aushadhi Bhandar store catalogue and verified business details. Customers can enquire directly with the store for live availability, product forms, packaging sizes, and current rates.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white border border-[#0D3021]/10 p-5">
                <p className="text-2xl font-serif font-semibold text-[#174D35] tabular-nums">
                  {products.length}
                </p>
                <p className="text-xs text-[#0D3021]/70 mt-1">{t.labels.productsCount}</p>
              </div>
              <div className="bg-white border border-[#0D3021]/10 p-5">
                <p className="text-2xl font-serif font-semibold text-[#174D35] tabular-nums">
                  {categories.length}
                </p>
                <p className="text-xs text-[#0D3021]/70 mt-1">{t.labels.categoriesCount}</p>
              </div>
              <div className="bg-white border border-[#0D3021]/10 p-5">
                <p className="text-sm font-semibold text-[#174D35]">{settings.contactPerson}</p>
                <p className="text-xs text-[#0D3021]/70 mt-1 tabular-nums">{settings.phoneDisplay}</p>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-[#0D3021] mb-4">
                {lang === 'hi' ? 'प्रमुख उत्पाद क्षेत्र' : 'Official Business Categories'}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm text-[#0D3021]/85">
                {OFFICIAL_BUSINESS_CATEGORIES.map((item, idx) => (
                  <li key={item.en} className="flex items-baseline gap-2.5 py-1 border-b border-[#0D3021]/8">
                    <span className="text-xs text-[#C5A15B] font-semibold tabular-nums">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span>{lang === 'hi' ? item.hi : item.en}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 py-3 px-5 text-sm font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] transition-colors"
              >
                <span>{t.actions.exploreProducts}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-5 text-sm font-semibold border border-[#174D35] text-[#174D35] hover:bg-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>{t.actions.whatsappEnquiry}</span>
              </a>
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex items-center gap-2 py-3 px-5 text-sm font-medium bg-white border border-[#0D3021]/15 text-[#0D3021]"
              >
                <Phone className="w-4 h-4 text-[#174D35]" aria-hidden="true" />
                <span className="tabular-nums">{settings.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#0D3021]/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#174D35] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-[#0D3021]">
                {lang === 'hi' ? settings.addressHi : settings.addressEn}
              </p>
              <p className="text-xs text-[#0D3021]/65 mt-0.5">
                {lang === 'hi' ? settings.businessHoursHi : settings.businessHoursEn}
              </p>
            </div>
          </div>
          <Link to="/contact" className="text-sm font-semibold text-[#174D35] hover:underline whitespace-nowrap">
            {t.nav.contact} →
          </Link>
        </div>

        <DisclaimerBanner />
      </section>
    </>
  );
};
