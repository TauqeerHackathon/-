export type Language = 'hi' | 'en';

export type BotanicalVerificationStatus = 'verified' | 'pending' | 'ambiguous';
export type PublicationStatus = 'published' | 'draft';
export type StockStatus = 'confirm_availability' | 'in_stock' | 'limited' | 'out_of_stock';
export type ProductSafetyTier = 'standard' | 'caution_herb' | 'mineral_chemical' | 'non_consumable';

export interface PdfSourceRef {
  section: 'A' | 'B' | 'C';
  sectionTitleHi: string;
  sectionTitleEn: string;
  page: 1 | 2;
  groupId: string;
  originalText: string;
}

export interface ProductVariant {
  id: string;
  nameHi: string;
  nameEn: string;
  form: string;
  priceText?: string;
  stockStatus?: StockStatus;
}

export interface Product {
  id: string;
  slug: string;
  originalPdfName: string;
  nameHi: string;
  nameEn: string;
  alternativeNamesHi: string[];
  alternativeNamesEn: string[];
  searchAliases: string[];
  primaryCategory: string;
  categories: string[];
  pdfSources: PdfSourceRef[];
  variants: ProductVariant[];
  botanicalName: string | null;
  botanicalStatus: BotanicalVerificationStatus;
  safetyTier: ProductSafetyTier;
  regulatoryNote: string;
  descriptionHi: string;
  descriptionEn: string;
  traditionalUsesHi: string;
  traditionalUsesEn: string;
  evidenceNoteHi: string;
  evidenceNoteEn: string;
  productForm: string;
  images: string[];
  packagingImages: string[];
  packSizes: string[];
  priceDisplay: string;
  stockStatus: StockStatus;
  safetyInfoHi: string;
  safetyInfoEn: string;
  storageInfoHi: string;
  storageInfoEn: string;
  seoTitleHi: string;
  seoTitleEn: string;
  metaDescriptionHi: string;
  metaDescriptionEn: string;
  featured: boolean;
  publicationStatus: PublicationStatus;
  indexable: boolean;
  updatedAt: string;
}

export interface Category {
  slug: string;
  nameHi: string;
  nameEn: string;
  descriptionHi: string;
  descriptionEn: string;
  image: string;
  imageIsIllustrative: boolean;
  displayOrder: number;
  pdfSections: ('A' | 'B' | 'C')[];
}

export interface Article {
  id: string;
  slug: string;
  titleHi: string;
  titleEn: string;
  excerptHi: string;
  excerptEn: string;
  contentHi: string;
  contentEn: string;
  categoryHi: string;
  categoryEn: string;
  coverImage: string | null;
  relatedProductSlugs: string[];
  references: string[];
  evidenceDisclaimerHi: string;
  evidenceDisclaimerEn: string;
  seoTitle: string;
  metaDescription: string;
  status: PublicationStatus;
  reviewStatus: 'pending_expert_review' | 'reviewed';
  scheduledAt: string | null;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: 'store' | 'product' | 'packaging' | 'illustrative' | 'video';
  imageUrl: string;
  altHi: string;
  altEn: string;
  isIllustrative: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface EnquiryItem {
  productId: string;
  slug: string;
  nameHi: string;
  nameEn: string;
  variantName?: string;
  quantityNote: string;
}

export interface Enquiry {
  id: string;
  referenceCode: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  items: EnquiryItem[];
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  followUpNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface FaqItem {
  id: string;
  questionHi: string;
  questionEn: string;
  answerHi: string;
  answerEn: string;
  displayOrder: number;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  googleBusiness: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  ga4MeasurementId: string;
  gtmContainerId: string;
  googleSiteVerification: string;
  metaPixelId: string;
}

export interface BusinessSettings {
  brandNameHi: string;
  brandNameEn: string;
  traditionalIdentityHi: string;
  traditionalIdentityEn: string;
  taglineHi: string;
  taglineEn: string;
  addressHi: string;
  addressEn: string;
  contactPerson: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappNumber: string;
  logoUrl: string;
  verifiedMapUrl: string;
  businessHoursHi: string;
  businessHoursEn: string;
  aboutIntroHi: string;
  aboutIntroEn: string;
  heroHeadingHi: string;
  heroHeadingEn: string;
  heroSubheadingHi: string;
  heroSubheadingEn: string;
  heroDescriptionHi: string;
  heroDescriptionEn: string;
  maintenanceMode: boolean;
  ecommerceEnabled: boolean;
  socialLinks: SocialLinks;
  analytics: AnalyticsConfig;
  developerAttribution: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  createdAt: string;
}

export interface EnquiryBasketItem {
  productId: string;
  slug: string;
  nameHi: string;
  nameEn: string;
  variantName?: string;
  quantityNote: string;
}

export interface BootstrapPayload {
  settings: BusinessSettings;
  categories: Category[];
  products: Product[];
  articles: Article[];
  gallery: GalleryItem[];
  faqs: FaqItem[];
}
