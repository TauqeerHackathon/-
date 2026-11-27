import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { filterAndSearchProducts, getDistinctProductForms } from '../shared/search';
import type { StockStatus } from '../shared/types';
import { ProductCard } from '../components/ProductCard';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SeoHead } from '../components/SeoHead';

export const ProductsPage: React.FC = () => {
  const { slug: routeCategorySlug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang, t, settings, products, categories } = useApp();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(routeCategorySlug || 'all-products');
  const [selectedForm, setSelectedForm] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [stockFilter, setStockFilter] = useState<StockStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'alpha_asc' | 'alpha_desc'>('default');

  useEffect(() => {
    setSelectedCategory(routeCategorySlug || 'all-products');
  }, [routeCategorySlug]);

  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null) setQuery(qParam);
  }, [searchParams]);

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === selectedCategory),
    [categories, selectedCategory]
  );

  const distinctForms = useMemo(() => getDistinctProductForms(products), [products]);

  const filteredProducts = useMemo(
    () =>
      filterAndSearchProducts(
        products,
        {
          query,
          categorySlug: selectedCategory,
          productForm: selectedForm,
          featuredOnly,
          stockStatus: stockFilter,
          sort: sortOrder,
          lang,
        },
        categories
      ),
    [products, categories, query, selectedCategory, selectedForm, featuredOnly, stockFilter, sortOrder, lang]
  );

  const hasActiveFilters =
    Boolean(query.trim()) ||
    selectedCategory !== 'all-products' ||
    selectedForm !== 'all' ||
    featuredOnly ||
    stockFilter !== 'all' ||
    sortOrder !== 'default';

  const clearAll = () => {
    setQuery('');
    setSelectedCategory(routeCategorySlug || 'all-products');
    setSelectedForm('all');
    setFeaturedOnly(false);
    setStockFilter('all');
    setSortOrder('default');
    if (searchParams.get('q')) {
      setSearchParams({});
    }
  };

  const pageHeading =
    activeCategory && activeCategory.slug !== 'all-products'
      ? lang === 'hi'
        ? activeCategory.nameHi
        : activeCategory.nameEn
      : lang === 'hi'
        ? 'संपूर्ण आधिकारिक उत्पाद सूची'
        : 'Complete Official Product Catalogue';

  const pageDescription =
    activeCategory && activeCategory.slug !== 'all-products'
      ? lang === 'hi'
        ? activeCategory.descriptionHi
        : activeCategory.descriptionEn
      : lang === 'hi'
        ? 'कन्हैया औषधि भंडार की आधिकारिक सूची के सभी 111 प्रमाणिक उत्पाद — जड़ी-बूटियां, जड़ें, मसाले, बीज, मेवे, गोंद एवं पूजा सामग्री।'
        : 'All 111 canonical products from the official Kanhaiya Aushadhi Bhandar stock list — herbs, roots, spices, seeds, dry fruits, gums, and pooja materials.';

  return (
    <>
      <SeoHead
        title={`${pageHeading} — ${lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}`}
        description={pageDescription}
        canonicalPath={routeCategorySlug ? `/categories/${routeCategorySlug}` : '/products'}
      />

      <section className="bg-[#0D3021] text-[#F8F3E7] py-12 border-b border-[#C5A15B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3">
          <nav aria-label="Breadcrumb" className="text-xs text-[#F8F3E7]/70 flex items-center gap-2">
            <Link to="/" className="hover:text-[#C5A15B]">{t.nav.home}</Link>
            <span aria-hidden="true">/</span>
            <Link to="/categories" className="hover:text-[#C5A15B]">{t.nav.categories}</Link>
            {routeCategorySlug && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-[#C5A15B]">{pageHeading}</span>
              </>
            )}
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">{pageHeading}</h1>
          <p className="text-sm sm:text-base text-[#F8F3E7]/80 max-w-3xl">{pageDescription}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Filter & Search Toolbar */}
        <div className="bg-white border border-[#0D3021]/12 p-5 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Bilingual Search Input */}
            <div className="lg:col-span-5 relative">
              <label htmlFor="catalogue-search" className="sr-only">
                {t.actions.searchButton}
              </label>
              <Search
                className="w-4 h-4 text-[#174D35] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="catalogue-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.actions.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F8F3E7]/60 border border-[#0D3021]/15 focus:border-[#174D35] focus:outline-none"
              />
            </div>

            {/* Category Dropdown */}
            <div className="lg:col-span-3">
              <label htmlFor="filter-category" className="sr-only">
                {t.nav.categories}
              </label>
              <select
                id="filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-[#F8F3E7]/60 border border-[#0D3021]/15 focus:border-[#174D35]"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {lang === 'hi' ? c.nameHi : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Form Filter */}
            <div className="lg:col-span-2">
              <label htmlFor="filter-form" className="sr-only">
                {t.labels.availableForms}
              </label>
              <select
                id="filter-form"
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-[#F8F3E7]/60 border border-[#0D3021]/15 focus:border-[#174D35]"
              >
                <option value="all">{lang === 'hi' ? 'सभी रूप' : 'All Forms'}</option>
                {distinctForms.map((form) => (
                  <option key={form} value={form}>
                    {form}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:col-span-2">
              <label htmlFor="filter-sort" className="sr-only">
                Sort
              </label>
              <select
                id="filter-sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'default' | 'alpha_asc' | 'alpha_desc')}
                className="w-full px-3 py-2.5 text-sm bg-[#F8F3E7]/60 border border-[#0D3021]/15 focus:border-[#174D35]"
              >
                <option value="default">{lang === 'hi' ? 'आधिकारिक क्रम' : 'Official Order'}</option>
                <option value="alpha_asc">{lang === 'hi' ? 'वर्णानुक्रम (A–Z / अ–ज्ञ)' : 'Alphabetical (A–Z)'}</option>
                <option value="alpha_desc">{lang === 'hi' ? 'विपरीत क्रम (Z–A)' : 'Alphabetical (Z–A)'}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#0D3021]/8 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer text-[#0D3021]">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="accent-[#174D35] w-4 h-4"
                />
                <span>{lang === 'hi' ? 'केवल चयनित उत्पाद' : 'Featured only'}</span>
              </label>

              <div className="inline-flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#708B45]" aria-hidden="true" />
                <label htmlFor="filter-stock" className="text-[#0D3021]/75">
                  {lang === 'hi' ? 'उपलब्धता:' : 'Availability:'}
                </label>
                <select
                  id="filter-stock"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as StockStatus | 'all')}
                  className="bg-transparent border-b border-[#0D3021]/25 py-0.5 text-[#0D3021] font-medium focus:outline-none"
                >
                  <option value="all">{lang === 'hi' ? 'सभी' : 'All'}</option>
                  <option value="confirm_availability">{t.labels.availabilityConfirm}</option>
                  <option value="in_stock">{t.labels.availabilityInStock}</option>
                  <option value="limited">{t.labels.availabilityLimited}</option>
                  <option value="out_of_stock">{t.labels.availabilityOutOfStock}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[#0D3021]/75 tabular-nums font-medium">
                {filteredProducts.length} {lang === 'hi' ? 'उत्पाद प्रदर्शित' : 'products shown'}
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 text-[#174D35] font-semibold hover:underline"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.actions.clearFilters}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid or Clear Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#0D3021]/10 py-16 px-6 text-center space-y-3">
            <h2 className="text-lg font-semibold text-[#0D3021]">
              {lang === 'hi' ? 'आपकी खोज से मेल खाने वाला कोई उत्पाद नहीं मिला।' : 'No matching products found.'}
            </h2>
            <p className="text-sm text-[#0D3021]/70 max-w-md mx-auto">
              {lang === 'hi'
                ? 'कृपया फ़िल्टर बदलें, हिन्दी या रोमन हिन्दी वर्तनी आज़माएं, अथवा वांछित सामग्री के लिए सीधे पूछताछ करें।'
                : 'Try adjusting your filters, searching in Hindi or Roman Hindi, or send a direct store enquiry.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={clearAll}
                className="py-2.5 px-5 text-xs font-semibold bg-[#174D35] text-[#F8F3E7]"
              >
                {t.actions.clearFilters}
              </button>
              <Link
                to="/enquiry"
                className="py-2.5 px-5 text-xs font-semibold border border-[#174D35] text-[#174D35]"
              >
                {t.nav.enquiry}
              </Link>
            </div>
          </div>
        ) : (
          <div
            data-testid="products-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <DisclaimerBanner />
      </section>
    </>
  );
};
