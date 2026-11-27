import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SeoHead } from '../components/SeoHead';

export const KnowledgePage: React.FC = () => {
  const { lang, t, settings, articles } = useApp();

  const published = useMemo(() => articles.filter((a) => a.status === 'published'), [articles]);
  const draftQueue = useMemo(() => articles.filter((a) => a.status !== 'published'), [articles]);

  return (
    <>
      <SeoHead
        title={`${t.nav.knowledge} — ${lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}`}
        description={t.home.knowledgeSubtitle}
        canonicalPath="/knowledge"
      />

      <section className="bg-[#0D3021] text-[#F8F3E7] py-12 border-b border-[#C5A15B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="text-xs font-semibold text-[#C5A15B]">
            {lang === 'hi' ? 'शैक्षणिक एवं पारंपरिक संदर्भ मंच' : 'Educational & Traditional Reference Platform'}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">{t.nav.knowledge}</h1>
          <p className="text-sm sm:text-base text-[#F8F3E7]/80 max-w-3xl">
            {t.home.knowledgeSubtitle}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <DisclaimerBanner />

        {/* Published & Reviewed Articles */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#0D3021]/10 pb-3">
            <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
              {lang === 'hi' ? 'प्रकाशित एवं समीक्षित लेख' : 'Published & Reviewed Articles'}
            </h2>
            <span className="text-xs text-[#708B45] tabular-nums">
              {published.length} {lang === 'hi' ? 'प्रकाशित' : 'published'}
            </span>
          </div>

          {published.length === 0 ? (
            <div className="bg-white border border-[#0D3021]/10 p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-[#174D35]">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
                <h3 className="text-base font-semibold text-[#0D3021]">
                  {lang === 'hi'
                    ? 'सभी संपादकीय लेख विशेषज्ञ समीक्षा प्रक्रिया में हैं'
                    : 'Editorial Articles Are Currently Under Fact & Safety Review'}
                </h3>
              </div>
              <p className="text-sm text-[#0D3021]/80 leading-relaxed max-w-3xl">
                {lang === 'hi'
                  ? 'स्वास्थ्य जानकारी की सटीकता और विश्वसनीयता सुनिश्चित करने के लिए कन्हैया औषधि भंडार के सभी ज्ञान केंद्र लेख तथ्य, प्रमाण, सुरक्षा निर्देश एवं आधिकारिक संदर्भों की समीक्षा के बाद ही प्रकाशित किए जाते हैं। एडमिन डैशबोर्ड के "Herbal Knowledge Studio" से समीक्षित लेखों को प्रकाशित किया जा सकता है।'
                  : 'To uphold factual accuracy and health-information compliance, all Herbal Knowledge Centre articles remain in draft until their botanical facts, traditional-vs-evidence distinctions, safety precautions, and authoritative references are reviewed. Reviewed articles can be published directly from the Admin Herbal Knowledge Studio.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {published.map((art) => (
                <article
                  key={art.id}
                  className="bg-white border border-[#0D3021]/10 flex flex-col overflow-hidden hover:border-[#C5A15B] transition-colors"
                >
                  {art.coverImage && (
                    <div className="aspect-[16/10] bg-[#E9E1D2] border-b border-[#0D3021]/8 overflow-hidden">
                      <img
                        src={art.coverImage}
                        alt={lang === 'hi' ? art.titleHi : art.titleEn}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-[#708B45]">
                      <span>{lang === 'hi' ? art.categoryHi : art.categoryEn}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{art.updatedAt.slice(0, 10)}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-[#0D3021] leading-snug">
                      <Link to={`/knowledge/${art.slug}`} className="hover:text-[#174D35]">
                        {lang === 'hi' ? art.titleHi : art.titleEn}
                      </Link>
                    </h3>
                    <p className="mt-2.5 text-sm text-[#0D3021]/75 leading-relaxed flex-1">
                      {lang === 'hi' ? art.excerptHi : art.excerptEn}
                    </p>
                    <Link
                      to={`/knowledge/${art.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#174D35] hover:underline"
                    >
                      <span>{lang === 'hi' ? 'पूरा लेख पढ़ें' : 'Read full article'}</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Transparent Draft / Review Queue */}
        {draftQueue.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#0D3021]/10 pb-3">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
                  {lang === 'hi' ? 'समीक्षाधीन संपादकीय विषय सूची' : 'Upcoming Editorial Topics Under Expert Review'}
                </h2>
                <p className="text-xs text-[#0D3021]/65 mt-1">
                  {lang === 'hi'
                    ? 'ये विषय प्रमाणिक संदर्भों (AYUSH / Pharmacopoeia) और सुरक्षा समीक्षा की प्रतीक्षा में ड्राफ्ट स्थिति में सुरक्षित रखे गए हैं।'
                    : 'These topics are intentionally held in draft pending citation verification (Ministry of AYUSH / PCIM&H / Pharmacopoeias) and safety review.'}
                </p>
              </div>
              <span className="text-xs text-[#708B45] tabular-nums whitespace-nowrap">
                {draftQueue.length} {lang === 'hi' ? 'विषय समीक्षाधीन' : 'topics in review'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {draftQueue.map((item, idx) => (
                <div key={item.id} className="bg-white border border-[#0D3021]/10 p-5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-xs text-[#708B45]">
                    <span>{lang === 'hi' ? item.categoryHi : item.categoryEn}</span>
                    <span className="inline-flex items-center gap-1 text-[#0D3021]/60 whitespace-nowrap">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      <span>{lang === 'hi' ? 'ड्राफ्ट' : 'Draft'}</span>
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0D3021] leading-snug">
                    {String(idx + 1).padStart(2, '0')}. {lang === 'hi' ? item.titleHi : item.titleEn}
                  </h3>
                  <p className="text-xs text-[#0D3021]/75 leading-relaxed">
                    {lang === 'hi' ? item.excerptHi : item.excerptEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};
