import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, ExternalLink, Clock, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildGeneralEnquiryMessage, buildWhatsAppUrl } from '../shared/whatsapp';
import { sanitizeExternalUrl } from '../shared/validation';
import { SeoHead } from '../components/SeoHead';

export const ContactPage: React.FC = () => {
  const { lang, t, settings } = useApp();
  const whatsappUrl = buildWhatsAppUrl(buildGeneralEnquiryMessage(lang), settings.whatsappNumber);
  const verifiedMap = sanitizeExternalUrl(settings.verifiedMapUrl);
  const directionsUrl =
    verifiedMap ||
    'https://www.google.com/maps/search/?api=1&query=Kheria+Mod+Chauraha+Agra+Uttar+Pradesh';

  return (
    <>
      <SeoHead
        title={`${t.nav.contact} — ${lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}`}
        description={`${settings.brandNameEn} (${settings.traditionalIdentityHi}), ${settings.addressEn}. Contact ${settings.contactPerson} at ${settings.phoneDisplay}.`}
        canonicalPath="/contact"
      />

      <section className="bg-[#0D3021] text-[#F8F3E7] py-12 border-b border-[#C5A15B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="text-xs font-semibold text-[#C5A15B]">{settings.traditionalIdentityHi}</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">{t.nav.contact}</h1>
          <p className="text-sm sm:text-base text-[#F8F3E7]/80 max-w-2xl">
            {t.home.visitStoreSubtitle}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white border border-[#C5A15B]/45 p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-[#0D3021]/10 pb-5">
            <img
              src={settings.logoUrl}
              alt={settings.brandNameEn}
              className="w-16 h-16 object-contain shrink-0"
            />
            <div>
              <h2 className="text-xl font-bold text-[#0D3021]">{settings.brandNameHi}</h2>
              <p className="text-sm text-[#174D35] font-medium">{settings.traditionalIdentityHi}</p>
              <p className="text-xs text-[#0D3021]/65">{settings.brandNameEn}</p>
            </div>
          </div>

          <dl className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#174D35] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <dt className="text-xs font-semibold text-[#708B45]">{t.labels.storeLocation}</dt>
                <dd className="text-[#0D3021] font-medium mt-0.5">{settings.addressHi}</dd>
                <dd className="text-xs text-[#0D3021]/70">{settings.addressEn}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-[#174D35] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <dt className="text-xs font-semibold text-[#708B45]">{t.labels.contactPerson}</dt>
                <dd className="text-[#0D3021] font-medium mt-0.5">{settings.contactPerson}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#174D35] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <dt className="text-xs font-semibold text-[#708B45]">
                  {lang === 'hi' ? 'फ़ोन एवं WhatsApp' : 'Phone & WhatsApp'}
                </dt>
                <dd className="mt-0.5">
                  <a
                    href={`tel:${settings.phoneRaw}`}
                    className="text-base font-semibold text-[#174D35] hover:underline tabular-nums"
                  >
                    {settings.phoneDisplay}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#174D35] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <dt className="text-xs font-semibold text-[#708B45]">{t.labels.storeTimings}</dt>
                <dd className="text-[#0D3021]/80 mt-0.5">
                  {lang === 'hi' ? settings.businessHoursHi : settings.businessHoursEn}
                </dd>
              </div>
            </div>
          </dl>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${settings.phoneRaw}`}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#C5A15B]" aria-hidden="true" />
              <span>{t.actions.callNow}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold border border-[#174D35] text-[#174D35] hover:bg-[#F8F3E7] transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>{t.actions.whatsappEnquiry}</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {/* Verified Location / Pending Map Pin */}
          <div className="bg-white border border-[#0D3021]/12 p-8 space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
              {lang === 'hi' ? 'स्टोर लोकेशन एवं दिशा-निर्देश' : 'Store Location & Directions'}
            </h2>
            <p className="text-sm text-[#0D3021]/80 leading-relaxed">
              {lang === 'hi'
                ? 'खेरिया मोड़ चौराहा, आगरा, उत्तर प्रदेश, भारत।'
                : 'Kheria Mod Chauraha, Agra, Uttar Pradesh, India.'}
            </p>
            {!verifiedMap && (
              <p className="text-xs text-[#708B45] bg-[#F8F3E7] border border-[#C5A15B]/35 p-3.5">
                {t.labels.mapPendingNote}
              </p>
            )}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3 px-5 text-sm font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#C5A15B]" aria-hidden="true" />
              <span>{t.actions.getDirections}</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="bg-[#E9E1D2]/60 border border-[#0D3021]/10 p-8 space-y-3">
            <h2 className="text-lg font-semibold text-[#0D3021]">
              {lang === 'hi' ? 'उत्पादों की लिखित पूछताछ भेजना चाहते हैं?' : 'Need a Written Multi-Product Enquiry?'}
            </h2>
            <p className="text-sm text-[#0D3021]/75 leading-relaxed">
              {lang === 'hi'
                ? 'यदि आपको कई जड़ी-बूटियों, मसालों या पंसारी उत्पादों की कीमत और पैकेजिंग की जानकारी चाहिए, तो हमारा उत्पाद पूछताछ फ़ॉर्म उपयोग करें।'
                : 'Use our Product Enquiry Form to submit your list of herbs, spices, or pansari products directly to the store team.'}
            </p>
            <Link
              to="/enquiry"
              className="inline-flex items-center gap-2 py-2.5 px-5 text-xs font-semibold bg-[#0D3021] text-[#F8F3E7]"
            >
              <span>{t.actions.submitEnquiryForm}</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
