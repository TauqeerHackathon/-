import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, MessageCircle, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildBasketEnquiryMessage, buildWhatsAppUrl } from '../shared/whatsapp';

export const EnquiryBasketDrawer: React.FC = () => {
  const {
    isBasketOpen,
    setBasketOpen,
    basket,
    updateBasketQuantity,
    removeFromBasket,
    clearBasket,
    lang,
    t,
    settings,
  } = useApp();

  if (!isBasketOpen) return null;

  const whatsappUrl = buildWhatsAppUrl(buildBasketEnquiryMessage(basket, lang), settings.whatsappNumber);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0D3021]/60 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={t.actions.enquiryBasket}
      onClick={() => setBasketOpen(false)}
    >
      <div
        className="w-full max-w-md bg-[#F8F3E7] h-full flex flex-col shadow-2xl border-l border-[#C5A15B]/40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-[#0D3021] text-[#F8F3E7] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {t.actions.enquiryBasket} ({basket.length})
            </h2>
            <p className="text-xs text-[#F8F3E7]/75 mt-0.5">
              {lang === 'hi'
                ? 'कीमत, उपलब्धता एवं पैकेजिंग की एक साथ पूछताछ करें'
                : 'Enquire together for pricing, availability & packaging'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBasketOpen(false)}
            aria-label="Close enquiry basket"
            className="w-10 h-10 inline-flex items-center justify-center text-[#F8F3E7] hover:text-[#C5A15B]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {basket.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="text-base font-medium text-[#0D3021]">
                {lang === 'hi' ? 'आपकी पूछताछ सूची अभी खाली है।' : 'Your enquiry basket is currently empty.'}
              </p>
              <p className="text-sm text-[#0D3021]/70">
                {lang === 'hi'
                  ? 'उत्पाद जोड़ें और सीधे WhatsApp या फ़ॉर्म के माध्यम से पूछताछ भेजें।'
                  : 'Add products from the catalogue to send a combined WhatsApp or website enquiry.'}
              </p>
              <Link
                to="/products"
                onClick={() => setBasketOpen(false)}
                className="inline-block mt-2 py-2.5 px-5 text-xs font-semibold bg-[#174D35] text-[#F8F3E7]"
              >
                {t.actions.exploreProducts}
              </Link>
            </div>
          ) : (
            basket.map((item) => {
              const key = `${item.productId}::${item.variantName || ''}`;
              return (
                <div key={key} className="bg-white border border-[#0D3021]/10 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/products/${item.slug}`}
                        onClick={() => setBasketOpen(false)}
                        className="text-sm font-semibold text-[#0D3021] hover:text-[#174D35]"
                      >
                        {lang === 'hi' ? item.nameHi : item.nameEn}
                      </Link>
                      <p className="text-xs text-[#0D3021]/65">
                        {lang === 'hi' ? item.nameEn : item.nameHi}
                        {item.variantName ? ` · ${item.variantName}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromBasket(item.productId, item.variantName)}
                      aria-label={`Remove ${item.nameEn}`}
                      className="p-1.5 text-[#0D3021]/55 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div>
                    <label htmlFor={`qty-${key}`} className="block text-[11px] font-medium text-[#0D3021]/70 mb-1">
                      {lang === 'hi' ? 'अनुमानित मात्रा (वैकल्पिक, जैसे: 250g / 1 kg)' : 'Requested quantity note (optional, e.g. 250g / 1 kg)'}
                    </label>
                    <input
                      id={`qty-${key}`}
                      type="text"
                      value={item.quantityNote}
                      onChange={(e) => updateBasketQuantity(item.productId, item.variantName, e.target.value)}
                      placeholder={lang === 'hi' ? 'जैसे: 250 ग्राम' : 'e.g. 250g'}
                      className="w-full px-3 py-2 text-sm bg-[#F8F3E7]/60 border border-[#0D3021]/15 focus:border-[#174D35] focus:outline-none"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {basket.length > 0 && (
          <div className="p-5 bg-white border-t border-[#0D3021]/12 space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#C5A15B]" aria-hidden="true" />
              <span>{t.actions.sendWhatsAppBasket}</span>
            </a>

            <Link
              to="/enquiry"
              onClick={() => setBasketOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold border border-[#174D35] text-[#174D35] hover:bg-[#F8F3E7] transition-colors"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>{t.actions.submitEnquiryForm}</span>
            </Link>

            <button
              type="button"
              onClick={clearBasket}
              className="w-full py-2 text-xs text-[#0D3021]/65 hover:text-red-700"
            >
              {lang === 'hi' ? 'सूची खाली करें' : 'Clear basket'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
