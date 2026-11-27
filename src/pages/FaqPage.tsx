import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SeoHead } from '../components/SeoHead';

export const FaqPage: React.FC = () => {
  const { lang, t, settings, faqs } = useApp();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: lang === 'hi' ? f.questionHi : f.questionEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: lang === 'hi' ? f.answerHi : f.answerEn,
      },
    })),
  };

  return (
    <>
      <SeoHead
        title={`${t.nav.faq} — ${lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}`}
        description={
          lang === 'hi'
            ? 'कन्हैया औषधि भंडार, आगरा के उत्पादों, पूछताछ प्रक्रिया और स्टोर संपर्क से जुड़े सामान्य प्रश्न।'
            : 'Frequently asked questions about Kanhaiya Aushadhi Bhandar, Agra — catalogue items, enquiries, and store contact.'
        }
        canonicalPath="/faq"
        jsonLd={faqJsonLd}
      />

      <section className="bg-[#0D3021] text-[#F8F3E7] py-12 border-b border-[#C5A15B]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="text-xs font-semibold text-[#C5A15B]">
            {lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">{t.nav.faq}</h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="divide-y divide-[#0D3021]/10 border border-[#0D3021]/10 bg-white">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-[#F8F3E7]/50 transition-colors"
                >
                  <span className="text-base font-semibold text-[#0D3021]">
                    {lang === 'hi' ? faq.questionHi : faq.questionEn}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#174D35] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-[#0D3021]/80 leading-relaxed">
                    {lang === 'hi' ? faq.answerHi : faq.answerEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DisclaimerBanner />
      </section>
    </>
  );
};
