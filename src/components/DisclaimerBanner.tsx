import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  const { t } = useApp();

  return (
    <aside
      aria-label={t.disclaimer.heading}
      className={`bg-[#E9E1D2]/70 border border-[#C5A15B]/45 ${compact ? 'p-4' : 'p-6'}`}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#174D35] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-[#0D3021]">
            {t.disclaimer.heading}
          </p>
          <p className="text-sm text-[#0D3021]/85 leading-relaxed">{t.disclaimer.text}</p>
        </div>
      </div>
    </aside>
  );
};
