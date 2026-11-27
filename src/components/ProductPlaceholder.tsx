import React from 'react';
import { useApp } from '../context/AppContext';

interface ProductPlaceholderProps {
  nameHi: string;
  nameEn: string;
  sectionCode?: string;
  compact?: boolean;
}

export const ProductPlaceholder: React.FC<ProductPlaceholderProps> = ({
  nameHi,
  nameEn,
  sectionCode,
  compact = false,
}) => {
  const { settings, t, lang } = useApp();

  return (
    <div className="relative w-full h-full bg-[#EFE8DA] flex flex-col items-center justify-center p-5 text-center select-none overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-3 border border-[#C5A15B]/35 pointer-events-none"
      />
      <img
        src={settings.logoUrl}
        alt={settings.brandNameEn}
        className={`${compact ? 'w-14 h-14' : 'w-20 h-20'} object-contain opacity-90 mb-3`}
        loading="lazy"
      />
      <p className="text-xs font-medium tracking-wide text-[#174D35] line-clamp-1 max-w-[90%]">
        {lang === 'hi' ? nameHi : nameEn}
      </p>
      <p className="mt-1 text-[11px] text-[#0D3021]/65 max-w-[85%] leading-snug">
        {t.labels.authenticPhotoPending}
      </p>
      {sectionCode && (
        <span className="mt-2 text-[10px] tracking-wider text-[#708B45] tabular-nums">
          {sectionCode}
        </span>
      )}
    </div>
  );
};
