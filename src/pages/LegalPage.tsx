import React from 'react';
import { useApp } from '../context/AppContext';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { SeoHead } from '../components/SeoHead';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { lang, t, settings } = useApp();

  const meta = {
    privacy: {
      path: '/privacy-policy',
      titleHi: 'गोपनीयता नीति',
      titleEn: 'Privacy Policy',
    },
    terms: {
      path: '/terms-and-conditions',
      titleHi: 'नियम एवं शर्तें',
      titleEn: 'Terms & Conditions',
    },
    disclaimer: {
      path: '/disclaimer',
      titleHi: 'चिकित्सीय एवं हर्बल जानकारी अस्वीकरण',
      titleEn: 'Medical & Herbal Information Disclaimer',
    },
  }[type];

  const heading = lang === 'hi' ? meta.titleHi : meta.titleEn;

  return (
    <>
      <SeoHead
        title={`${heading} — ${lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}`}
        description={`${heading} — ${settings.brandNameEn}, Agra.`}
        canonicalPath={meta.path}
      />

      <section className="bg-[#0D3021] text-[#F8F3E7] py-12 border-b border-[#C5A15B]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="text-xs font-semibold text-[#C5A15B]">
            {lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">{heading}</h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6 text-sm sm:text-base text-[#0D3021]/85 leading-relaxed">
        {type === 'disclaimer' && (
          <>
            <DisclaimerBanner />
            <div className="bg-white border border-[#0D3021]/10 p-6 sm:p-8 space-y-4">
              <p>
                {lang === 'hi'
                  ? '1. सामान्य शैक्षणिक उद्देश्य: कन्हैया औषधि भंडार की वेबसाइट पर प्रस्तुत उत्पाद विवरण, पारंपरिक संदर्भ एवं ज्ञान केंद्र की सामग्री केवल सामान्य शैक्षणिक जानकारी के लिए है। यह किसी रोग के निदान, उपचार या चिकित्सकीय परामर्श का विकल्प नहीं है।'
                  : '1. General Educational Purpose: Product descriptions, traditional references, and Herbal Knowledge Centre content on this website are solely for general educational information and do not constitute medical advice, diagnosis, or treatment.'}
              </p>
              <p>
                {lang === 'hi'
                  ? '2. कोई गारंटीकृत रोग उपचार दावा नहीं: किसी भी जड़ी-बूटी या पंसारी सामग्री को किसी रोग के निश्चित इलाज, 100% सुरक्षित या बिना किसी दुष्प्रभाव के रूप में प्रस्तुत नहीं किया जाता।'
                  : '2. No Guaranteed Medical Claims: No herb, spice, or pansari product on this website is marketed as a guaranteed cure, permanent disease treatment, or risk-free remedy.'}
              </p>
              <p>
                {lang === 'hi'
                  ? '3. विशेष खनिज एवं अखाद्य सामग्री: आधिकारिक सूची में शामिल कुछ सामग्री (जैसे नौसादर, सुहागा, फिटकरी, सज्जी खार, यवक्षार, गेरू, कपूर, हवन सामग्री आदि) पारंपरिक पंसारी खनिज या बाह्य/पूजा उपयोग की सामग्री हैं। इन्हें सामान्य खाद्य वस्तु न मानें और बिना विशेषज्ञ मार्गदर्शन के उपयोग न करें।'
                  : '3. Traditional Minerals & Non-Consumable Materials: Certain items listed in the official pansari catalogue (including Nausadar, Suhaga, Fitkari, Sajji Khar, Yavakshar, Geru, Kapur, and Havan Samagri) are mineral/chemical or external/ritual materials. Do not assume edibility or self-use without qualified supervision.'}
              </p>
              <p>
                {lang === 'hi'
                  ? '4. वानस्पतिक सत्यापन: जहाँ किसी उत्पाद का वानस्पतिक नाम या विवरण "सत्यापन प्रतीक्षारत" दर्शाया गया है, वहाँ क्षेत्रीय व्यापारिक नाम की आधिकारिक पुष्टि शेष है।'
                  : '4. Botanical Verification: Where a product displays "Verification Pending", formal botanical verification of the regional trade name is in progress.'}
              </p>
            </div>
          </>
        )}

        {type === 'privacy' && (
          <div className="bg-white border border-[#0D3021]/10 p-6 sm:p-8 space-y-4">
            <p>
              {lang === 'hi'
                ? 'कन्हैया औषधि भंडार आपकी गोपनीयता का सम्मान करता है। जब आप हमारी वेबसाइट के उत्पाद पूछताछ फ़ॉर्म के माध्यम से अपना नाम, फ़ोन नंबर, ईमेल, शहर या उत्पाद सूची भेजते हैं, तो उस जानकारी का उपयोग केवल आपकी पूछताछ का उत्तर देने के लिए किया जाता है।'
                : 'Kanhaiya Aushadhi Bhandar respects your privacy. Information submitted through our website enquiry form (name, phone number, optional email, city, and product enquiry notes) is used solely to respond to your enquiry.'}
            </p>
            <p>
              {lang === 'hi'
                ? 'हम आपके व्यक्तिगत संपर्क विवरण को किसी तृतीय-पक्ष विज्ञापन नेटवर्क के साथ साझा नहीं करते और किसी भी संवेदनशील स्वास्थ्य जानकारी को एनालिटिक्स प्लेटफॉर्म पर नहीं भेजते।'
                : 'We do not sell customer contact details or transmit personal contact or sensitive health information to third-party advertising networks.'}
            </p>
            <p>
              {lang === 'hi'
                ? 'WhatsApp पूछताछ बटन पर क्लिक करने पर आप अपनी स्वेच्छा से WhatsApp ऐप/वेब पर जाते हैं; वेबसाइट आपकी सहमति के बिना कोई संदेश स्वचालित रूप से नहीं भेजती।'
                : 'Clicking a WhatsApp enquiry link opens WhatsApp with a pre-filled draft message only upon your direct action; messages are never sent automatically.'}
            </p>
            <p>
              {lang === 'hi'
                ? `गोपनीयता से जुड़े किसी भी प्रश्न के लिए संपर्क करें: ${settings.contactPerson} (${settings.phoneDisplay}), ${settings.addressHi}।`
                : `For any privacy questions, contact ${settings.contactPerson} (${settings.phoneDisplay}), ${settings.addressEn}.`}
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="bg-white border border-[#0D3021]/10 p-6 sm:p-8 space-y-4">
            <p>
              {lang === 'hi'
                ? '1. कैटलॉग एवं पूछताछ प्लेटफॉर्म: यह वेबसाइट वर्तमान में एक आधिकारिक उत्पाद कैटलॉग एवं प्रत्यक्ष पूछताछ प्लेटफॉर्म है। किसी भी उत्पाद का सूचीबद्ध होना उसके वर्तमान स्टॉक या निश्चित मूल्य की गारंटी नहीं है।'
                : '1. Catalogue & Enquiry Platform: This website currently serves as an official product catalogue and enquiry platform. Listing of an item does not constitute a binding offer, guaranteed stock availability, or fixed online price.'}
            </p>
            <p>
              {lang === 'hi'
                ? '2. मूल्य, पैकेजिंग एवं उपलब्धता: सभी दरें, पैक साइज एवं उपलब्धता स्टोर द्वारा प्रत्यक्ष पुष्टि के अधीन हैं।'
                : '2. Pricing, Packaging & Availability: All prices, pack sizes, and stock availability are confirmed directly by the store upon enquiry.'}
            </p>
            <p>
              {lang === 'hi'
                ? '3. चित्र नीति: उत्पाद पृष्ठों पर जहां वास्तविक चित्र उपलब्ध नहीं हैं, वहां तटस्थ ब्रांडेड प्लेसहोल्डर दिखाया जाता है। संपादकीय श्रेणियों में प्रयुक्त सांकेतिक चित्र वास्तविक पैकेजिंग नहीं दर्शाते।'
                : '3. Imagery Policy: Neutral branded placeholders are used where authentic product photographs are pending. Illustrative editorial imagery is clearly labeled and does not represent branded packaging.'}
            </p>
            <p>
              {lang === 'hi'
                ? `4. अधिकार क्षेत्र: सभी व्यावसायिक विवरण ${settings.brandNameHi}, ${settings.addressHi} से संबंधित हैं।`
                : `4. Store Identity: All store listings pertain to ${settings.brandNameEn}, ${settings.addressEn}.`}
            </p>
          </div>
        )}
      </section>
    </>
  );
};
