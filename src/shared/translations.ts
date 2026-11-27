import type { Language } from './types';

export interface TranslationStrings {
  nav: {
    home: string;
    about: string;
    products: string;
    knowledge: string;
    gallery: string;
    contact: string;
    categories: string;
    faq: string;
    enquiry: string;
    admin: string;
  };
  actions: {
    exploreProducts: string;
    whatsappEnquiry: string;
    callNow: string;
    getDirections: string;
    searchPlaceholder: string;
    searchButton: string;
    viewDetails: string;
    addToBasket: string;
    addedToBasket: string;
    enquiryBasket: string;
    sendWhatsAppBasket: string;
    submitEnquiryForm: string;
    clearFilters: string;
    viewAllCategories: string;
    viewAllProducts: string;
    shareProduct: string;
    copiedLink: string;
  };
  labels: {
    pricePending: string;
    availabilityConfirm: string;
    availabilityInStock: string;
    availabilityLimited: string;
    availabilityOutOfStock: string;
    packagingContact: string;
    botanicalPending: string;
    botanicalAmbiguous: string;
    botanicalVerified: string;
    pdfSourceRef: string;
    availableForms: string;
    traditionalUses: string;
    evidenceLimitations: string;
    importantPrecautions: string;
    storageGuidance: string;
    relatedProducts: string;
    authenticPhotoPending: string;
    illustrativeImageNote: string;
    contactPerson: string;
    storeLocation: string;
    storeTimings: string;
    mapPendingNote: string;
    productsCount: string;
    categoriesCount: string;
    pdfGroupsCount: string;
    mineralCautionHeading: string;
    nonConsumableHeading: string;
  };
  home: {
    categoriesTitle: string;
    categoriesSubtitle: string;
    featuredTitle: string;
    featuredSubtitle: string;
    identityKicker: string;
    identityTitle: string;
    varietyTitle: string;
    varietySubtitle: string;
    knowledgeTitle: string;
    knowledgeSubtitle: string;
    whyVisitTitle: string;
    whyVisitSubtitle: string;
    whyVisitItems: Array<{ title: string; body: string }>;
    visitStoreTitle: string;
    visitStoreSubtitle: string;
  };
  disclaimer: {
    heading: string;
    text: string;
  };
  footer: {
    categoriesHeading: string;
    quickLinksHeading: string;
    contactHeading: string;
    legalHeading: string;
    privacyPolicy: string;
    termsConditions: string;
    medicalDisclaimer: string;
    rightsReserved: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  hi: {
    nav: {
      home: 'होम',
      about: 'हमारे बारे में',
      products: 'हमारे उत्पाद',
      knowledge: 'जड़ी-बूटी ज्ञान',
      gallery: 'गैलरी',
      contact: 'संपर्क',
      categories: 'उत्पाद श्रेणियां',
      faq: 'सामान्य प्रश्न',
      enquiry: 'उत्पाद पूछताछ',
      admin: 'एडमिन',
    },
    actions: {
      exploreProducts: 'हमारे उत्पाद देखें',
      whatsappEnquiry: 'WhatsApp पर संपर्क करें',
      callNow: 'अभी कॉल करें',
      getDirections: 'दिशा-निर्देश प्राप्त करें',
      searchPlaceholder: 'जड़ी-बूटी, मसाला या बीज खोजें (जैसे: अश्वगंधा, Ashwagandha, गिलोय, मुलेठी)...',
      searchButton: 'खोजें',
      viewDetails: 'विवरण देखें',
      addToBasket: 'पूछताछ सूची में जोड़ें',
      addedToBasket: 'सूची में जोड़ा गया',
      enquiryBasket: 'पूछताछ सूची',
      sendWhatsAppBasket: 'WhatsApp पर सूची भेजें',
      submitEnquiryForm: 'वेबसाइट पूछताछ फ़ॉर्म भरें',
      clearFilters: 'फ़िल्टर हटाएं',
      viewAllCategories: 'सभी 14 श्रेणियां देखें',
      viewAllProducts: 'संपूर्ण उत्पाद सूची देखें',
      shareProduct: 'साझा करें',
      copiedLink: 'लिंक कॉपी हो गया',
    },
    labels: {
      pricePending: 'मूल्य हेतु संपर्क करें',
      availabilityConfirm: 'उपलब्धता की पुष्टि करें',
      availabilityInStock: 'स्टॉक में उपलब्ध',
      availabilityLimited: 'सीमित उपलब्धता',
      availabilityOutOfStock: 'वर्तमान में अनुपलब्ध',
      packagingContact: 'पैकेजिंग हेतु स्टोर से संपर्क करें',
      botanicalPending: 'वानस्पतिक नाम सत्यापन प्रतीक्षारत',
      botanicalAmbiguous: 'क्षेत्रीय प्रजाति सत्यापन प्रतीक्षारत',
      botanicalVerified: 'सत्यापित वानस्पतिक नाम',
      pdfSourceRef: 'आधिकारिक सूची संदर्भ',
      availableForms: 'उपलब्ध रूप / किस्में',
      traditionalUses: 'पारंपरिक संदर्भ',
      evidenceLimitations: 'प्रमाण एवं शैक्षणिक सीमाएं',
      importantPrecautions: 'महत्वपूर्ण सावधानियां',
      storageGuidance: 'भंडारण निर्देश',
      relatedProducts: 'संबंधित उत्पाद',
      authenticPhotoPending: 'उत्पाद का वास्तविक चित्र प्रतीक्षारत',
      illustrativeImageNote: 'सांकेतिक संपादकीय चित्र (वास्तविक उत्पाद पैकेजिंग नहीं)',
      contactPerson: 'संपर्क व्यक्ति',
      storeLocation: 'स्टोर का पता',
      storeTimings: 'स्टोर समय',
      mapPendingNote: 'सटीक Google Maps लोकेशन पिन सत्यापन के उपरांत जोड़ा जाएगा।',
      productsCount: 'आधिकारिक उत्पाद',
      categoriesCount: 'उत्पाद श्रेणियां',
      pdfGroupsCount: 'आधिकारिक सूची समूह',
      mineralCautionHeading: 'पारंपरिक पंसारी खनिज / रासायनिक सामग्री — विशेष सावधानी आवश्यक',
      nonConsumableHeading: 'बाह्य / केश-त्वचा / पूजा-हवन सामग्री सूचना',
    },
    home: {
      categoriesTitle: 'उत्पाद श्रेणियां देखें',
      categoriesSubtitle: 'आधिकारिक पंसारी सूचीपत्र के अनुसार सुव्यवस्थित 14 ग्राहक-अनुकूल श्रेणियां।',
      featuredTitle: 'प्रमुख एवं चयनित उत्पाद',
      featuredSubtitle: 'कन्हैया औषधि भंडार की आधिकारिक सूची से प्रमुख जड़ी-बूटियां, जड़ें, गोंद, मेवे और केश देखभाल सामग्री।',
      identityKicker: 'हमारी पारंपरिक पहचान',
      identityTitle: 'कन्हैया औषधि भंडार — वैद्य सूरजभान पंसारी कागारौल वाले',
      varietyTitle: 'विविध पारंपरिक श्रृंखला',
      varietySubtitle: 'दैनिक रसोई मसालों से लेकर विशेष जड़ी-बूटियों, पौष्टिक बीजों और पूजा-हवन सामग्री तक।',
      knowledgeTitle: 'जड़ी-बूटी ज्ञान केंद्र',
      knowledgeSubtitle: 'जड़ी-बूटियों की पहचान, पारंपरिक संदर्भ, सुरक्षित भंडारण और महत्वपूर्ण सावधानियों हेतु समर्पित शैक्षणिक मंच।',
      whyVisitTitle: 'हमारे स्टोर पर क्यों आएं?',
      whyVisitSubtitle: 'तथ्यात्मक जानकारी और प्रत्यक्ष पंसारी संपर्क पर आधारित सेवा।',
      whyVisitItems: [
        {
          title: 'पारंपरिक जड़ी-बूटियों की विस्तृत श्रृंखला',
          body: 'प्रमुख जड़ी-बूटियां, जड़ें, छाल, चूर्ण और त्रिफला सामग्री एक ही आधिकारिक सूचीपत्र में।',
        },
        {
          title: 'विभिन्न सूचीबद्ध उत्पाद रूप',
          body: 'सूची के अनुसार साबुत, कली, छिलका, सूखी डंडी, लकड़ी, डली एवं चूर्ण रूपों की जानकारी।',
        },
        {
          title: 'देसी मसाले एवं पंसारी सामग्री',
          body: 'साबुत भारतीय मसाले, पौष्टिक बीज, सूखे मेवे, प्राकृतिक गोंद और पूजा-हवन सामग्री।',
        },
        {
          title: 'प्रत्यक्ष उत्पाद पूछताछ सुविधा',
          body: 'कीमत, वर्तमान स्टॉक और पैकेजिंग के लिए सीधे फ़ोन, WhatsApp या वेबसाइट फ़ॉर्म द्वारा संपर्क।',
        },
        {
          title: 'आगरा में सुविधाजनक स्थानीय संपर्क',
          body: 'खेरिया मोड़ चौराहा, आगरा में प्रत्यक्ष स्टोर संपर्क (Dr. Mohit Gupta — +91 9012429042)।',
        },
      ],
      visitStoreTitle: 'हमारे स्टोर पर पधारें',
      visitStoreSubtitle: 'उत्पाद की उपलब्धता, किस्म और पैकेजिंग की पुष्टि हेतु सीधे संपर्क करें।',
    },
    disclaimer: {
      heading: 'स्वास्थ्य एवं हर्बल जानकारी अस्वीकरण',
      text: 'यह जानकारी सामान्य शैक्षणिक एवं पारंपरिक उपयोग की जानकारी के उद्देश्य से प्रदान की गई है। किसी विशेष रोग, चिकित्सीय आवश्यकता या औषधि के सेवन के लिए योग्य चिकित्सक या वैद्य से परामर्श अवश्य लें।',
    },
    footer: {
      categoriesHeading: 'प्रमुख श्रेणियां',
      quickLinksHeading: 'त्वरित लिंक',
      contactHeading: 'संपर्क विवरण',
      legalHeading: 'नीतियां एवं अस्वीकरण',
      privacyPolicy: 'गोपनीयता नीति',
      termsConditions: 'नियम एवं शर्तें',
      medicalDisclaimer: 'चिकित्सीय एवं हर्बल अस्वीकरण',
      rightsReserved: 'सर्वाधिकार सुरक्षित।',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      products: 'Our Products',
      knowledge: 'Herbal Knowledge',
      gallery: 'Gallery',
      contact: 'Contact',
      categories: 'Product Categories',
      faq: 'FAQ',
      enquiry: 'Product Enquiry',
      admin: 'Admin',
    },
    actions: {
      exploreProducts: 'Explore Our Products',
      whatsappEnquiry: 'Contact on WhatsApp',
      callNow: 'Call Now',
      getDirections: 'Get Directions',
      searchPlaceholder: 'Search herbs, spices, or seeds (e.g. Ashwagandha, अश्वगंधा, Giloy, Mulethi)...',
      searchButton: 'Search',
      viewDetails: 'View Details',
      addToBasket: 'Add to Enquiry Basket',
      addedToBasket: 'Added to Basket',
      enquiryBasket: 'Enquiry Basket',
      sendWhatsAppBasket: 'Send Basket on WhatsApp',
      submitEnquiryForm: 'Submit Website Enquiry',
      clearFilters: 'Clear Filters',
      viewAllCategories: 'Explore All 14 Categories',
      viewAllProducts: 'Browse Complete Catalogue',
      shareProduct: 'Share',
      copiedLink: 'Link Copied',
    },
    labels: {
      pricePending: 'Contact for Price',
      availabilityConfirm: 'Confirm Availability',
      availabilityInStock: 'In Stock',
      availabilityLimited: 'Limited Stock',
      availabilityOutOfStock: 'Currently Out of Stock',
      packagingContact: 'Contact Store for Packaging',
      botanicalPending: 'Botanical Name: Verification Pending',
      botanicalAmbiguous: 'Regional Species Verification Pending',
      botanicalVerified: 'Verified Botanical Name',
      pdfSourceRef: 'Official Catalogue Reference',
      availableForms: 'Listed Forms & Variants',
      traditionalUses: 'Traditional Context',
      evidenceLimitations: 'Evidence & Reference Limitations',
      importantPrecautions: 'Important Precautions',
      storageGuidance: 'Storage Guidance',
      relatedProducts: 'Related Products',
      authenticPhotoPending: 'Authentic Product Photo Pending',
      illustrativeImageNote: 'Illustrative Editorial Visual (Not Actual Product Packaging)',
      contactPerson: 'Contact Person',
      storeLocation: 'Store Location',
      storeTimings: 'Store Timings',
      mapPendingNote: 'Exact Google Maps store pin will be embedded once coordinates are verified.',
      productsCount: 'Official Products',
      categoriesCount: 'Product Categories',
      pdfGroupsCount: 'Official Source Groups',
      mineralCautionHeading: 'Traditional Pansari Mineral / Chemical Material — Heightened Caution',
      nonConsumableHeading: 'External / Hair-Skin / Pooja-Havan Usage Notice',
    },
    home: {
      categoriesTitle: 'Explore Product Categories',
      categoriesSubtitle: 'Fourteen customer-friendly collections mapped directly to our official store stock list.',
      featuredTitle: 'Featured Products',
      featuredSubtitle: 'Selected traditional herbs, roots, natural gums, dry fruits, and hair-care botanicals from the official catalogue.',
      identityKicker: 'Our Traditional Identity',
      identityTitle: 'Kanhaiya Aushadhi Bhandar — Vaidya Surajbhan Pansari Kagarol Wale',
      varietyTitle: 'Breadth of Traditional Offerings',
      varietySubtitle: 'From whole culinary Indian spices and nutritional seeds to medicinal raw herbs and pooja-havan essentials.',
      knowledgeTitle: 'Herbal Knowledge Centre',
      knowledgeSubtitle: 'Educational guides on herb identification, traditional context, safe storage, and evidence-aware precautions.',
      whyVisitTitle: 'Why Visit Our Store?',
      whyVisitSubtitle: 'Factual highlights rooted in direct local pansari service and transparent enquiries.',
      whyVisitItems: [
        {
          title: 'Wide Range of Traditional Herbal Ingredients',
          body: 'Raw medicinal herbs, dried roots, barks, husks, and classical Triphala components in one official catalogue.',
        },
        {
          title: 'Multiple Listed Product Forms',
          body: 'Catalogue entries clearly note whole, pieces (kali), peel (chilka), dried stem, stick, lump, and powder forms.',
        },
        {
          title: 'Indian Spices & Pansari Essentials',
          body: 'Whole spices, nutritional seeds, dry fruits, traditional natural gums, hair-skin botanicals, and pooja materials.',
        },
        {
          title: 'Direct Product Enquiries',
          body: 'Enquire directly via WhatsApp, phone, or our website enquiry basket for current pricing and pack sizes.',
        },
        {
          title: 'Convenient Local Agra Store Contact',
          body: 'Located at Kheria Mod Chauraha, Agra with direct store assistance from Dr. Mohit Gupta (+91 9012429042).',
        },
      ],
      visitStoreTitle: 'Visit Our Store',
      visitStoreSubtitle: 'Reach out directly to confirm live availability, forms, and packaging options.',
    },
    disclaimer: {
      heading: 'Medical & Herbal Information Disclaimer',
      text: 'The information provided on this website is intended for general educational purposes and information about traditional uses. It is not a substitute for professional medical advice, diagnosis or treatment. Consult a qualified healthcare professional before using any medicinal ingredient.',
    },
    footer: {
      categoriesHeading: 'Product Categories',
      quickLinksHeading: 'Quick Links',
      contactHeading: 'Contact Details',
      legalHeading: 'Policies & Disclaimer',
      privacyPolicy: 'Privacy Policy',
      termsConditions: 'Terms & Conditions',
      medicalDisclaimer: 'Medical & Herbal Disclaimer',
      rightsReserved: 'All rights reserved.',
    },
  },
};
