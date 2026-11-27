import type { EnquiryBasketItem, Language, Product } from './types';

export const DEFAULT_WHATSAPP_NUMBER = '919012429042';

export function buildWhatsAppUrl(message: string, phoneNumber = DEFAULT_WHATSAPP_NUMBER): string {
  const cleanedPhone = phoneNumber.replace(/[^\d]/g, '') || DEFAULT_WHATSAPP_NUMBER;
  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
}

export function buildSingleProductEnquiryMessage(
  product: Pick<Product, 'nameHi' | 'nameEn'>,
  lang: Language,
  variantName?: string,
  quantityNote?: string
): string {
  const variantSuffix = variantName ? ` (${variantName})` : '';
  const qtySuffixHi = quantityNote?.trim() ? ` अनुमानित मात्रा: ${quantityNote.trim()}।` : '';
  const qtySuffixEn = quantityNote?.trim() ? ` Requested quantity: ${quantityNote.trim()}.` : '';

  if (lang === 'en') {
    return `Namaskar, I would like to enquire about the price, availability, and packaging of ${product.nameEn} (${product.nameHi})${variantSuffix} at Kanhaiya Aushadhi Bhandar.${qtySuffixEn}`;
  }

  return `नमस्कार, मुझे कन्हैया औषधि भंडार के ${product.nameHi}${variantSuffix} उत्पाद की कीमत, उपलब्धता एवं पैकेजिंग की जानकारी चाहिए।${qtySuffixHi}`;
}

export function buildBasketEnquiryMessage(
  items: EnquiryBasketItem[],
  lang: Language,
  customerNote?: string
): string {
  if (items.length === 0) {
    return buildGeneralEnquiryMessage(lang);
  }

  const lines = items.map((item, idx) => {
    const label = lang === 'en' ? `${item.nameEn} (${item.nameHi})` : item.nameHi;
    const variant = item.variantName ? ` — ${item.variantName}` : '';
    const qty = item.quantityNote.trim() ? ` [${item.quantityNote.trim()}]` : '';
    return `${idx + 1}. ${label}${variant}${qty}`;
  });

  if (lang === 'en') {
    const extra = customerNote?.trim() ? `\nNote: ${customerNote.trim()}` : '';
    return `Namaskar, I would like to enquire about price, availability, and packaging for the following products from Kanhaiya Aushadhi Bhandar:\n${lines.join('\n')}${extra}`;
  }

  const extra = customerNote?.trim() ? `\nअतिरिक्त विवरण: ${customerNote.trim()}` : '';
  return `नमस्कार, मुझे कन्हैया औषधि भंडार के निम्नलिखित उत्पादों की कीमत, उपलब्धता एवं पैकेजिंग की जानकारी चाहिए:\n${lines.join('\n')}${extra}`;
}

export function buildGeneralEnquiryMessage(lang: Language): string {
  if (lang === 'en') {
    return 'Namaskar, I would like to enquire about traditional herbs and pansari products at Kanhaiya Aushadhi Bhandar, Kheria Mod Chauraha, Agra.';
  }
  return 'नमस्कार, मुझे कन्हैया औषधि भंडार (खेरिया मोड़ चौराहा, आगरा) के उत्पादों की उपलब्धता एवं जानकारी चाहिए।';
}
