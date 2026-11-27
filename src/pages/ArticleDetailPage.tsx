import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SeoHead } from '../components/SeoHead';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, settings, articles, products } = useApp();

  const article = useMemo(
    () => articles.find((a) => a.slug === slug && a.status === 'published'),
    [articles, slug]
  );

  if (!article) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
        <h1 className="font-serif text-3xl font-semibold text-[#0D3021]">
          {lang === 'hi' ? 'लेख अभी प्रकाशित नहीं हुआ है' : 'Article Not Published Yet'}
        </h1>
        <p className="text-sm text-[#0D3021]/75">
          {lang === 'hi'
            ? 'यह लेख समीक्षाधीन हो सकता है या उपलब्ध नहीं है।'
            : 'This article may still be undergoing editorial review or is unavailable.'}
        </p>
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-2 py-3 px-5 text-sm font-semibold bg-[#174D35] text-[#F8F3E7]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{t.nav.knowledge}</span>
        </Link>
      </section>
    );
  }

  const related = products.filter((p) => article.relatedProductSlugs.includes(p.slug));
  const title = lang === 'hi' ? article.titleHi : article.titleEn;
  const paragraphs = (lang === 'hi' ? article.contentHi : article.contentEn)
    .split(/\n\n+/)
    .filter(Boolean);

  return (
    <>
      <SeoHead
        title={article.seoTitle || `${title} — ${settings.brandNameEn}`}
        description={article.metaDescription || (lang === 'hi' ? article.excerptHi : article.excerptEn)}
        canonicalPath={`/knowledge/${article.slug}`}
        ogImage={article.coverImage || undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          dateModified: article.updatedAt,
          publisher: {
            '@type': 'Organization',
            name: settings.brandNameEn,
          },
        }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-8">
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174D35] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.nav.knowledge}</span>
        </Link>

        <header className="space-y-3 border-b border-[#0D3021]/10 pb-6">
          <div className="flex items-center gap-2 text-xs text-[#708B45]">
            <span>{lang === 'hi' ? article.categoryHi : article.categoryEn}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{article.updatedAt.slice(0, 10)}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#0D3021] leading-tight">
            {title}
          </h1>
          <p className="text-base text-[#0D3021]/75 leading-relaxed">
            {lang === 'hi' ? article.excerptHi : article.excerptEn}
          </p>
        </header>

        {article.coverImage && (
          <div className="aspect-[16/9] bg-[#E9E1D2] border border-[#0D3021]/10 overflow-hidden">
            <img
              src={article.coverImage}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="space-y-5 text-base text-[#0D3021]/90 leading-relaxed">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {article.references.length > 0 && (
          <section className="bg-white border border-[#0D3021]/10 p-5 space-y-2">
            <h2 className="text-sm font-semibold text-[#174D35]">
              {lang === 'hi' ? 'संदर्भ एवं समीक्षा स्थिति' : 'References & Review Notes'}
            </h2>
            <ul className="list-disc pl-5 text-xs text-[#0D3021]/75 space-y-1">
              {article.references.map((ref) => (
                <li key={ref}>{ref}</li>
              ))}
            </ul>
          </section>
        )}

        <DisclaimerBanner />

        {related.length > 0 && (
          <section className="pt-6 space-y-5">
            <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
              {lang === 'hi' ? 'लेख से संबंधित उत्पाद' : 'Products Referenced in This Article'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
};
