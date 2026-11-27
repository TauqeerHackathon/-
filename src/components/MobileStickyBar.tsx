import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildBasketEnquiryMessage, buildGeneralEnquiryMessage, buildWhatsAppUrl } from '../shared/whatsapp';

export const MobileStickyBar: React.FC = () => {
  const { lang, t, settings, basket } = useApp();

  const message =
    basket.length > 0 ? buildBasketEnquiryMessage(basket, lang) : buildGeneralEnquiryMessage(lang);
  const whatsappUrl = buildWhatsAppUrl(message, settings.whatsappNumber);

  return (
    <div
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-[#0D3021] border-t border-[#C5A15B]/40 grid grid-cols-2"
      aria-label="Quick contact bar"
    >
      <a
        href={`tel:${settings.phoneRaw}`}
        className="flex items-center justify-center gap-2 text-xs font-semibold text-[#F8F3E7] border-r border-[#F8F3E7]/15 active:bg-[#174D35]"
      >
        <Phone className="w-4 h-4 text-[#C5A15B] shrink-0" aria-hidden="true" />
        <span className="whitespace-nowrap">{t.actions.callNow}</span>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-xs font-semibold bg-[#174D35] text-[#F8F3E7] active:bg-[#0D3021]"
      >
        <MessageCircle className="w-4 h-4 text-[#C5A15B] shrink-0" aria-hidden="true" />
        <span className="whitespace-nowrap">
          {basket.length > 0
            ? `${lang === 'hi' ? 'WhatsApp सूची' : 'WhatsApp Basket'} (${basket.length})`
            : lang === 'hi'
              ? 'WhatsApp पूछताछ'
              : 'WhatsApp Enquiry'}
        </span>
      </a>
    </div>
  );
};
