import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Trash2, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildBasketEnquiryMessage, buildWhatsAppUrl } from '../shared/whatsapp';
import { validateEnquiryInput } from '../shared/validation';
import { SeoHead } from '../components/SeoHead';

export const EnquiryPage: React.FC = () => {
  const {
    lang,
    t,
    settings,
    products,
    basket,
    addToBasket,
    removeFromBasket,
    updateBasketQuantity,
    clearBasket,
  } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Agra');
  const [message, setMessage] = useState('');
  const [quickProductSlug, setQuickProductSlug] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleQuickAdd = () => {
    const prod = products.find((p) => p.slug === quickProductSlug);
    if (!prod) return;
    addToBasket({
      productId: prod.id,
      slug: prod.slug,
      nameHi: prod.nameHi,
      nameEn: prod.nameEn,
      variantName: prod.variants[0]
        ? lang === 'hi'
          ? prod.variants[0].nameHi
          : prod.variants[0].nameEn
        : undefined,
      quantityNote: '',
    });
    setQuickProductSlug('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const payload = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim(),
      message: message.trim(),
      items: basket,
    };

    const validationErrors = validateEnquiryInput(payload);
    if (validationErrors.length > 0) {
      setErrorMsg(validationErrors[0]);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { enquiry?: { referenceCode: string }; error?: string };
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not submit enquiry.');
        return;
      }
      setSubmittedRef(data.enquiry?.referenceCode || 'KAB-CONFIRMED');
      clearBasket();
      setCustomerName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch {
      setErrorMsg(
        lang === 'hi'
          ? 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें या WhatsApp से संपर्क करें।'
          : 'Network error. Please retry or reach out on WhatsApp.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = buildWhatsAppUrl(
    buildBasketEnquiryMessage(basket, lang, message),
    settings.whatsappNumber
  );

  return (
    <>
      <SeoHead
        title={`${t.nav.enquiry} — ${lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}`}
        description={
          lang === 'hi'
            ? 'कन्हैया औषधि भंडार, आगरा के उत्पादों की कीमत, उपलब्धता और पैकेजिंग के लिए प्रत्यक्ष पूछताछ फ़ॉर्म।'
            : 'Submit a product enquiry to Kanhaiya Aushadhi Bhandar, Agra for pricing, availability, and packaging.'
        }
        canonicalPath="/enquiry"
      />

      <section className="bg-[#0D3021] text-[#F8F3E7] py-12 border-b border-[#C5A15B]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="text-xs font-semibold text-[#C5A15B]">
            {lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">{t.nav.enquiry}</h1>
          <p className="text-sm sm:text-base text-[#F8F3E7]/80 max-w-2xl">
            {lang === 'hi'
              ? 'आप वेबसाइट फ़ॉर्म के माध्यम से अपनी पूछताछ दर्ज कर सकते हैं या सीधे WhatsApp संदेश भेज सकते हैं। यह ऑनलाइन ऑर्डर चेकआउट नहीं है।'
              : 'Submit your product enquiry directly to our store or send your list via WhatsApp. Please note this is an enquiry request, not an online payment checkout.'}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {submittedRef ? (
          <div className="bg-white border border-[#C5A15B] p-8 sm:p-10 space-y-4">
            <div className="flex items-center gap-3 text-[#174D35]">
              <CheckCircle2 className="w-7 h-7 shrink-0" aria-hidden="true" />
              <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
                {lang === 'hi' ? 'आपकी पूछताछ सफलतापूर्वक दर्ज हो गई है' : 'Your Enquiry Has Been Recorded'}
              </h2>
            </div>
            <p className="text-sm text-[#0D3021]/85">
              {lang === 'hi' ? 'पूछताछ संदर्भ संख्या: ' : 'Enquiry Reference Code: '}
              <strong className="font-mono text-[#174D35]">{submittedRef}</strong>
            </p>
            <p className="text-sm text-[#0D3021]/75 leading-relaxed">
              {lang === 'hi'
                ? 'कन्हैया औषधि भंडार की टीम उपलब्धता, पैकेजिंग और कीमत की जानकारी के साथ आपसे संपर्क करेगी। तत्काल संपर्क हेतु आप +91 9012429042 पर कॉल कर सकते हैं।'
                : 'Our team at Kanhaiya Aushadhi Bhandar will review your enquiry and follow up with availability, packaging, and pricing details. For urgent store enquiries, call +91 9012429042.'}
            </p>
            <div className="pt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSubmittedRef(null)}
                className="py-2.5 px-5 text-xs font-semibold bg-[#174D35] text-[#F8F3E7]"
              >
                {lang === 'hi' ? 'नई पूछताछ भेजें' : 'Submit Another Enquiry'}
              </button>
              <Link
                to="/products"
                className="py-2.5 px-5 text-xs font-semibold border border-[#174D35] text-[#174D35]"
              >
                {t.actions.exploreProducts}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="lg:col-span-7 bg-white border border-[#0D3021]/12 p-6 sm:p-8 space-y-5"
              noValidate
            >
              <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
                {lang === 'hi' ? 'ग्राहक विवरण एवं संदेश' : 'Customer Details & Enquiry'}
              </h2>

              {errorMsg && (
                <div role="alert" className="p-3.5 bg-red-50 border border-red-200 text-sm text-red-800">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enq-name" className="block text-xs font-semibold text-[#0D3021] mb-1.5">
                    {lang === 'hi' ? 'आपका नाम *' : 'Your Name *'}
                  </label>
                  <input
                    id="enq-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={lang === 'hi' ? 'पूरा नाम लिखें' : 'Full name'}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F3E7]/50 border border-[#0D3021]/15 focus:border-[#174D35]"
                  />
                </div>
                <div>
                  <label htmlFor="enq-phone" className="block text-xs font-semibold text-[#0D3021] mb-1.5">
                    {lang === 'hi' ? 'मोबाइल नंबर *' : 'Phone / WhatsApp Number *'}
                  </label>
                  <input
                    id="enq-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXXXXXXX"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F3E7]/50 border border-[#0D3021]/15 focus:border-[#174D35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enq-email" className="block text-xs font-semibold text-[#0D3021] mb-1.5">
                    {lang === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'}
                  </label>
                  <input
                    id="enq-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F3E7]/50 border border-[#0D3021]/15 focus:border-[#174D35]"
                  />
                </div>
                <div>
                  <label htmlFor="enq-city" className="block text-xs font-semibold text-[#0D3021] mb-1.5">
                    {lang === 'hi' ? 'शहर / क्षेत्र' : 'City / Area'}
                  </label>
                  <input
                    id="enq-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F3E7]/50 border border-[#0D3021]/15 focus:border-[#174D35]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="enq-msg" className="block text-xs font-semibold text-[#0D3021] mb-1.5">
                  {lang === 'hi' ? 'पूछताछ संदेश / आवश्यक उत्पाद विवरण' : 'Enquiry Message / Product Notes'}
                </label>
                <textarea
                  id="enq-msg"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    lang === 'hi'
                      ? 'कृपया वांछित जड़ी-बूटी, रूप (साबुत/चूर्ण) एवं अनुमानित मात्रा लिखें...'
                      : 'Specify herbs, preferred forms (whole/powder), and approximate quantity...'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F8F3E7]/50 border border-[#0D3021]/15 focus:border-[#174D35]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 px-5 text-sm font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] disabled:opacity-60 transition-colors"
                >
                  {submitting
                    ? lang === 'hi'
                      ? 'भेजा जा रहा है...'
                      : 'Submitting...'
                    : t.actions.submitEnquiryForm}
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-semibold border border-[#174D35] text-[#174D35] hover:bg-[#F8F3E7] transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>{t.actions.whatsappEnquiry}</span>
                </a>
              </div>
            </form>

            {/* Right: Selected Products Basket */}
            <div className="lg:col-span-5 bg-white border border-[#0D3021]/12 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-[#0D3021]">
                {t.actions.enquiryBasket} ({basket.length})
              </h2>

              <div className="flex gap-2">
                <label htmlFor="quick-add-product" className="sr-only">
                  Add product to enquiry
                </label>
                <select
                  id="quick-add-product"
                  value={quickProductSlug}
                  onChange={(e) => setQuickProductSlug(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[#F8F3E7]/60 border border-[#0D3021]/15"
                >
                  <option value="">
                    {lang === 'hi' ? 'सूची से उत्पाद जोड़ें...' : 'Add a catalogue product...'}
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {lang === 'hi' ? `${p.nameHi} (${p.nameEn})` : `${p.nameEn} (${p.nameHi})`}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  disabled={!quickProductSlug}
                  aria-label="Add selected product"
                  className="px-3 py-2 bg-[#174D35] text-[#F8F3E7] text-xs font-semibold disabled:opacity-40 inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{lang === 'hi' ? 'जोड़ें' : 'Add'}</span>
                </button>
              </div>

              {basket.length === 0 ? (
                <p className="text-xs text-[#0D3021]/65 py-4 border-t border-[#0D3021]/8">
                  {lang === 'hi'
                    ? 'अभी कोई उत्पाद चयनित नहीं है। आप ऊपर से उत्पाद जोड़ सकते हैं या सीधे संदेश लिखकर पूछताछ भेज सकते हैं।'
                    : 'No products selected yet. Add items above or write your requirements in the enquiry message.'}
                </p>
              ) : (
                <ul className="divide-y divide-[#0D3021]/10 border-t border-[#0D3021]/10">
                  {basket.map((item) => {
                    const key = `${item.productId}::${item.variantName || ''}`;
                    return (
                      <li key={key} className="py-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-[#0D3021]">
                              {lang === 'hi' ? item.nameHi : item.nameEn}
                            </p>
                            {item.variantName && (
                              <p className="text-xs text-[#708B45]">{item.variantName}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromBasket(item.productId, item.variantName)}
                            aria-label={`Remove ${item.nameEn}`}
                            className="p-1 text-[#0D3021]/55 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.quantityNote}
                          onChange={(e) =>
                            updateBasketQuantity(item.productId, item.variantName, e.target.value)
                          }
                          placeholder={lang === 'hi' ? 'मात्रा (जैसे 250g)' : 'Quantity note (e.g. 250g)'}
                          className="w-full px-2.5 py-1.5 text-xs bg-[#F8F3E7]/60 border border-[#0D3021]/12"
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};
