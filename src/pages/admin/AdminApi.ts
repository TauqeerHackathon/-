import type {
  ActivityLog,
  Article,
  BusinessSettings,
  Category,
  Enquiry,
  FaqItem,
  GalleryItem,
  Product,
} from '../../shared/types';
import type { ReconciliationSummary } from '../../shared/validation';

export interface AdminOverviewResponse {
  stats: {
    totalProducts: number;
    publishedProducts: number;
    draftProducts: number;
    verificationPending: number;
    categoriesCount: number;
    enquiriesCount: number;
    newEnquiriesCount: number;
    articlesCount: number;
    publishedArticlesCount: number;
    galleryCount: number;
  };
  reconciliation: ReconciliationSummary;
  products: Product[];
  categories: Category[];
  articles: Article[];
  gallery: GalleryItem[];
  enquiries: Enquiry[];
  faqs: FaqItem[];
  settings: BusinessSettings;
  logs: ActivityLog[];
}

export async function adminFetch<T>(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(url, { ...options, headers });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function uploadAdminImage(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await adminFetch<{ url: string }>('/api/admin/upload', token, {
    method: 'POST',
    body: formData,
  });
  return res.url;
}
