import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeoHead } from '../components/SeoHead';

export const CategoriesPage: React.FC = () => {
  const { lang, t, settings, categories, products } = useApp();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set('all-products', products.length);
    for (const p of products) {
      for (const slug of p.categories) {
        map.set(slug, (map.get(slug) ?? 0) + 1);
      }
    }
    return map;
  }, [products]);

  return (
    <>
      <SeoHead
        title={`${t.nav.categories} — ${lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}`}
        description={t.home.categoriesSubtitle}
        canonicalPath="/categories"
      />

      <section className="bg-[#0D3021] text-[#F8F3E7] py-12 border-b border-[#C5A15B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="text-xs font-semibold text-[#C5A15B]">
            {lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">
            {t.nav.categories}
          </h1>
          <p className="text-sm sm:text-base text-[#F8F3E7]/80 max-w-2xl">
            {t.home.categoriesSubtitle}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs text-[#0D3021]/65 mb-6">{t.labels.illustrativeImageNote}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = counts.get(cat.slug) ?? 0;
            const target = cat.slug === 'all-products' ? '/products' : `/categories/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                to={target}
                className="group bg-white border border-[#0D3021]/10 overflow-hidden flex flex-col hover:border-[#C5A15B] transition-colors"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#E9E1D2] border-b border-[#0D3021]/8">
                  <img
                    src={cat.image}
                    alt={`${cat.nameHi} — ${cat.nameEn}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-[#708B45] tabular-nums">
                    <span>
                      {count} {lang === 'hi' ? 'उत्पाद' : 'products'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      PDF {cat.pdfSections.join(', ')}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-[#0D3021] group-hover:text-[#174D35] transition-colors">
                    {lang === 'hi' ? cat.nameHi : cat.nameEn}
                  </h2>
                  <p className="text-xs text-[#0D3021]/60 mt-0.5">
                    {lang === 'hi' ? cat.nameEn : cat.nameHi}
                  </p>
                  <p className="mt-3 text-sm text-[#0D3021]/75 leading-relaxed flex-1">
                    {lang === 'hi' ? cat.descriptionHi : cat.descriptionEn}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#174D35]">
                    <span>{lang === 'hi' ? 'श्रेणी देखें' : 'Browse category'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
};
