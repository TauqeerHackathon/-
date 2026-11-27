import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { filterAndSearchProducts } from '../shared/search';

const QUICK_SEARCH_TERMS = [
  { hi: 'अश्वगंधा', en: 'Ashwagandha' },
  { hi: 'गिलोय', en: 'Giloy' },
  { hi: 'मुलेठी', en: 'Mulethi' },
  { hi: 'हरड़', en: 'Harad' },
  { hi: 'गोंद कतीरा', en: 'Gond Katira' },
  { hi: 'इसबगोल', en: 'Isabgol' },
];

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setSearchOpen, products, categories, lang, t } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return filterAndSearchProducts(products, { query, lang }, categories).slice(0, 12);
  }, [products, categories, query, lang]);

  if (!isSearchOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0D3021]/65 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-16 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={t.actions.searchButton}
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#F8F3E7] border border-[#C5A15B]/50 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-4 sm:px-5 py-4 bg-white border-b border-[#0D3021]/10">
          <Search className="w-5 h-5 text-[#174D35] shrink-0" aria-hidden="true" />
          <label htmlFor="global-herbal-search" className="sr-only">
            {t.actions.searchButton}
          </label>
          <input
            id="global-herbal-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.actions.searchPlaceholder}
            className="flex-1 bg-transparent text-base text-[#0D3021] placeholder:text-[#0D3021]/45 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="p-1.5 text-[#0D3021]/60 hover:text-[#0D3021]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="p-2 text-[#0D3021] hover:bg-[#F8F3E7]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </form>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-[#708B45] tracking-wide">
                {lang === 'hi' ? 'लोकप्रिय खोजें (हिन्दी / English / Roman Hindi)' : 'Popular Searches (Hindi / English / Roman Hindi)'}
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SEARCH_TERMS.map((term) => (
                  <button
                    key={term.en}
                    type="button"
                    onClick={() => setQuery(lang === 'hi' ? term.hi : term.en)}
                    className="px-3 py-2 text-sm bg-white border border-[#0D3021]/12 text-[#0D3021] hover:border-[#C5A15B] hover:text-[#174D35] transition-colors"
                  >
                    {lang === 'hi' ? `${term.hi} / ${term.en}` : `${term.en} / ${term.hi}`}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-base font-semibold text-[#0D3021]">
                {lang === 'hi' ? `"${query}" के लिए कोई उत्पाद नहीं मिला` : `No products matched "${query}"`}
              </p>
              <p className="text-sm text-[#0D3021]/70">
                {lang === 'hi'
                  ? 'कृपया वर्तनी जांचें, हिन्दी या अंग्रेज़ी नाम से खोजें, अथवा सीधे स्टोर पर पूछताछ करें।'
                  : 'Try searching by Hindi name, Roman Hindi spelling, or browse all categories.'}
              </p>
              <div className="pt-3">
                <Link
                  to="/enquiry"
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex items-center gap-2 py-2.5 px-4 text-xs font-semibold bg-[#174D35] text-[#F8F3E7]"
                >
                  <span>{t.nav.enquiry}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#0D3021]/65 pb-2 border-b border-[#0D3021]/10">
                <span className="tabular-nums">
                  {results.length} {lang === 'hi' ? 'सुझाव मिले' : 'matching items'}
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-[#174D35] font-semibold hover:underline"
                >
                  {lang === 'hi' ? 'सभी परिणाम देखें →' : 'View all results →'}
                </button>
              </div>
              <ul className="divide-y divide-[#0D3021]/8">
                {results.map((prod) => (
                  <li key={prod.id}>
                    <Link
                      to={`/products/${prod.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-white transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0D3021] truncate">
                          {lang === 'hi' ? prod.nameHi : prod.nameEn}
                        </p>
                        <p className="text-xs text-[#0D3021]/65 truncate">
                          {lang === 'hi' ? prod.nameEn : prod.nameHi}
                          {prod.variants.length > 0
                            ? ` · ${prod.variants.map((v) => (lang === 'hi' ? v.nameHi : v.nameEn)).join(', ')}`
                            : ''}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#C5A15B] shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
