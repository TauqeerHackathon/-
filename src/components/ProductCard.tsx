import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, ArrowUpRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Product } from '../shared/types';
import { ProductPlaceholder } from './ProductPlaceholder';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { lang, t, categories, addToBasket } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  const primaryCat = categories.find((c) => c.slug === product.primaryCategory);
  const primaryTitle = lang === 'hi' ? product.nameHi : product.nameEn;
  const secondaryTitle = lang === 'hi' ? product.nameEn : product.nameHi;
  const primaryGroup = product.pdfSources[0]?.groupId;
  const hasAuthenticImage = product.images.length > 0;

  const availabilityLabel =
    product.stockStatus === 'in_stock'
      ? t.labels.availabilityInStock
      : product.stockStatus === 'limited'
        ? t.labels.availabilityLimited
        : product.stockStatus === 'out_of_stock'
          ? t.labels.availabilityOutOfStock
          : t.labels.availabilityConfirm;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToBasket({
      productId: product.id,
      slug: product.slug,
      nameHi: product.nameHi,
      nameEn: product.nameEn,
      variantName: product.variants[0]
        ? lang === 'hi'
          ? product.variants[0].nameHi
          : product.variants[0].nameEn
        : undefined,
      quantityNote: '',
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <article className="group bg-white border border-[#0D3021]/10 flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#C5A15B]/70">
      <Link
        to={`/products/${product.slug}`}
        className="block aspect-[4/3] w-full overflow-hidden bg-[#EFE8DA] border-b border-[#0D3021]/8"
        aria-label={primaryTitle}
      >
        {hasAuthenticImage ? (
          <img
            src={product.images[0]}
            alt={`${product.nameHi} — ${product.nameEn}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <ProductPlaceholder
            nameHi={product.nameHi}
            nameEn={product.nameEn}
            sectionCode={primaryGroup ? `PDF ${primaryGroup}` : undefined}
            compact
          />
        )}
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-[#708B45] min-w-0">
          <span className="truncate">
            {primaryCat ? (lang === 'hi' ? primaryCat.nameHi : primaryCat.nameEn) : product.productForm}
          </span>
          {product.variants.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="whitespace-nowrap shrink-0 tabular-nums">
                {product.variants.length} {lang === 'hi' ? 'रूप' : 'forms'}
              </span>
            </>
          )}
        </div>

        <h3 className="mt-2 text-lg font-semibold text-[#0D3021] leading-snug">
          <Link
            to={`/products/${product.slug}`}
            className="hover:text-[#174D35] transition-colors focus-visible:underline"
          >
            {primaryTitle}
          </Link>
        </h3>
        <p className="text-sm text-[#0D3021]/65 mt-0.5 line-clamp-1">{secondaryTitle}</p>

        {product.variants.length > 0 && (
          <p className="mt-2.5 text-xs text-[#0D3021]/75 line-clamp-1">
            {product.variants.map((v) => (lang === 'hi' ? v.nameHi : v.nameEn)).join(' · ')}
          </p>
        )}

        {product.safetyTier === 'mineral_chemical' && (
          <p className="mt-2 text-xs font-medium text-[#8C4A1C]">
            {lang === 'hi'
              ? 'विशेष पंसारी खनिज — विशेषज्ञ सत्यापन आवश्यक'
              : 'Traditional pansari mineral — caution & verification required'}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-[#0D3021]/8 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 text-xs text-[#0D3021]/70">
            <span className="font-medium text-[#174D35]">
              {product.priceDisplay === 'Contact for Price' ? t.labels.pricePending : product.priceDisplay}
            </span>
            <span className="truncate">{availabilityLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/products/${product.slug}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] transition-colors whitespace-nowrap"
            >
              <span>{t.actions.viewDetails}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={`${t.actions.addToBasket} — ${primaryTitle}`}
              className="inline-flex items-center justify-center gap-1 py-2.5 px-3 text-xs font-medium border border-[#174D35]/25 text-[#174D35] hover:bg-[#F8F3E7] transition-colors whitespace-nowrap shrink-0"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{lang === 'hi' ? 'जुड़ा' : 'Added'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{lang === 'hi' ? 'सूची' : 'Basket'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
