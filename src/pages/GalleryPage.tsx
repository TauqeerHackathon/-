import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { GalleryItem } from '../shared/types';
import { SeoHead } from '../components/SeoHead';

export const GalleryPage: React.FC = () => {
  const { lang, t, settings, gallery } = useApp();
  const [filter, setFilter] = useState<'all' | GalleryItem['category']>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? gallery : gallery.filter((g) => g.category === filter)),
    [gallery, filter]
  );

  const tabs: Array<{ id: 'all' | GalleryItem['category']; hi: string; en: string }> = [
    { id: 'all', hi: 'सभी', en: 'All' },
    { id: 'store', hi: 'स्टोर चित्र', en: 'Store Photos' },
    { id: 'product', hi: 'उत्पाद चित्र', en: 'Product Photos' },
    { id: 'packaging', hi: 'पैकेजिंग', en: 'Packaging' },
    { id: 'illustrative', hi: 'सांकेतिक संपादकीय', en: 'Illustrative Editorial' },
  ];

  return (
    <>
      <SeoHead
        title={`${t.nav.gallery} — ${lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}`}
        description={
          lang === 'hi'
            ? 'कन्हैया औषधि भंडार की फोटो गैलरी — वास्तविक स्टोर, उत्पाद एवं सांकेतिक संपादकीय चित्र।'
            : 'Photo gallery of Kanhaiya Aushadhi Bhandar, clearly distinguishing authentic store/product photos from illustrative editorial visuals.'
        }
        canonicalPath="/gallery"
      />

      <section className="bg-[#0D3021] text-[#F8F3E7] py-12 border-b border-[#C5A15B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="text-xs font-semibold text-[#C5A15B]">
            {lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">{t.nav.gallery}</h1>
          <p className="text-sm sm:text-base text-[#F8F3E7]/80 max-w-2xl">
            {lang === 'hi'
              ? 'हम वास्तविक स्टोर/उत्पाद तस्वीरों और सांकेतिक संपादकीय चित्रों के बीच स्पष्ट अंतर बनाए रखते हैं।'
              : 'We maintain clear visual transparency between authentic uploaded store/product photographs and illustrative editorial imagery.'}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#0D3021]/10 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              aria-pressed={filter === tab.id}
              className={`px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-[#174D35] text-[#F8F3E7]'
                  : 'bg-white border border-[#0D3021]/15 text-[#0D3021] hover:border-[#C5A15B]'
              }`}
            >
              {lang === 'hi' ? tab.hi : tab.en}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-[#0D3021]/10 p-12 text-center space-y-2">
            <p className="text-base font-semibold text-[#0D3021]">
              {lang === 'hi' ? 'इस श्रेणी में अभी वास्तविक चित्र अपलोड नहीं किए गए हैं।' : 'No authentic photographs uploaded in this category yet.'}
            </p>
            <p className="text-sm text-[#0D3021]/70">
              {lang === 'hi'
                ? 'स्टोर एडमिन "Gallery Manager" के माध्यम से वास्तविक स्टोर, उत्पाद और पैकेजिंग चित्र जोड़ सकते हैं।'
                : 'Store administrators can upload authentic store, product, and packaging photos via the Admin Gallery Manager.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <figure key={item.id} className="bg-white border border-[#0D3021]/10 overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-[#E9E1D2] border-b border-[#0D3021]/8 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={lang === 'hi' ? item.altHi : item.altEn}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <figcaption className="p-4 space-y-1">
                  <p className="text-sm font-semibold text-[#0D3021]">
                    {lang === 'hi' ? item.titleHi : item.titleEn}
                  </p>
                  <p className="text-xs text-[#708B45]">
                    {item.isIllustrative
                      ? t.labels.illustrativeImageNote
                      : lang === 'hi'
                        ? 'वास्तविक अपलोड किया गया चित्र'
                        : 'Authentic Store / Product Photograph'}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
};
