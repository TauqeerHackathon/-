import { PDF_EXPECTED_GROUP_IDS } from './catalogueData';
import type { Product } from './types';

export function sanitizeExternalUrl(raw: string | null | undefined): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('/')) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export interface EnquirySubmissionInput {
  customerName: string;
  phone: string;
  email?: string;
  city?: string;
  message?: string;
  items?: Array<{
    productId: string;
    slug: string;
    nameHi: string;
    nameEn: string;
    variantName?: string;
    quantityNote?: string;
  }>;
}

export function validateEnquiryInput(input: EnquirySubmissionInput): string[] {
  const errors: string[] = [];
  if (!input.customerName || input.customerName.trim().length < 2) {
    errors.push('Customer name must be at least 2 characters.');
  }
  const digits = (input.phone || '').replace(/[^\d]/g, '');
  if (digits.length < 10 || digits.length > 15) {
    errors.push('Please enter a valid 10-to-15 digit phone number.');
  }
  if (input.email && input.email.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.email.trim())) {
      errors.push('Please enter a valid email address.');
    }
  }
  const hasMessage = Boolean(input.message && input.message.trim().length >= 3);
  const hasItems = Boolean(input.items && input.items.length > 0);
  if (!hasMessage && !hasItems) {
    errors.push('Please select at least one product or enter your enquiry message.');
  }
  return errors;
}

export interface ReconciliationSummary {
  totalCanonicalProducts: number;
  totalPdfGroupsExpected: number;
  coveredPdfGroups: string[];
  missingPdfGroups: string[];
  duplicateSlugs: string[];
  duplicateIds: string[];
  multiSourceProducts: Array<{ id: string; nameHi: string; groups: string[] }>;
  verificationPendingCount: number;
  mineralCautionCount: number;
  passed: boolean;
}

export function reconcileProductsAgainstPdf(products: Product[]): ReconciliationSummary {
  const coveredSet = new Set<string>();
  const slugCounts = new Map<string, number>();
  const idCounts = new Map<string, number>();
  const multiSourceProducts: Array<{ id: string; nameHi: string; groups: string[] }> = [];

  for (const p of products) {
    slugCounts.set(p.slug, (slugCounts.get(p.slug) ?? 0) + 1);
    idCounts.set(p.id, (idCounts.get(p.id) ?? 0) + 1);
    const groups = Array.from(new Set(p.pdfSources.map((s) => s.groupId)));
    for (const g of groups) coveredSet.add(g);
    if (groups.length > 1) {
      multiSourceProducts.push({ id: p.id, nameHi: p.nameHi, groups });
    }
  }

  const missingPdfGroups = PDF_EXPECTED_GROUP_IDS.filter((g) => !coveredSet.has(g));
  const duplicateSlugs = Array.from(slugCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([slug]) => slug);
  const duplicateIds = Array.from(idCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([id]) => id);

  const verificationPendingCount = products.filter((p) => p.botanicalStatus !== 'verified').length;
  const mineralCautionCount = products.filter((p) => p.safetyTier === 'mineral_chemical').length;

  return {
    totalCanonicalProducts: products.length,
    totalPdfGroupsExpected: PDF_EXPECTED_GROUP_IDS.length,
    coveredPdfGroups: Array.from(coveredSet).sort(),
    missingPdfGroups,
    duplicateSlugs,
    duplicateIds,
    multiSourceProducts,
    verificationPendingCount,
    mineralCautionCount,
    passed: missingPdfGroups.length === 0 && duplicateSlugs.length === 0 && duplicateIds.length === 0,
  };
}

export function productsToCsv(products: Product[]): string {
  const headers = [
    'id',
    'slug',
    'originalPdfName',
    'nameHi',
    'nameEn',
    'primaryCategory',
    'categories',
    'pdfGroups',
    'variants',
    'productForm',
    'botanicalStatus',
    'safetyTier',
    'priceDisplay',
    'stockStatus',
    'featured',
    'publicationStatus',
  ];

  const escapeCell = (val: unknown): string => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = products.map((p) => [
    p.id,
    p.slug,
    p.originalPdfName,
    p.nameHi,
    p.nameEn,
    p.primaryCategory,
    p.categories.join('|'),
    Array.from(new Set(p.pdfSources.map((s) => `${s.section}:${s.groupId}`))).join('|'),
    p.variants.map((v) => `${v.nameHi} (${v.nameEn})`).join('|'),
    p.productForm,
    p.botanicalStatus,
    p.safetyTier,
    p.priceDisplay,
    p.stockStatus,
    p.featured ? 'true' : 'false',
    p.publicationStatus,
  ]);

  return [headers.join(','), ...rows.map((r) => r.map(escapeCell).join(','))].join('\n');
}

export interface BulkImportPreview {
  validRows: Array<{
    nameHi: string;
    nameEn: string;
    slug: string;
    primaryCategory: string;
    productForm: string;
    priceDisplay: string;
    isDuplicate: boolean;
  }>;
  errors: string[];
}

export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export function previewBulkImport(
  rawText: string,
  format: 'json' | 'csv',
  existingSlugs: Set<string>
): BulkImportPreview {
  const validRows: BulkImportPreview['validRows'] = [];
  const errors: string[] = [];

  if (!rawText.trim()) {
    return { validRows, errors: ['Import payload is empty.'] };
  }

  if (format === 'json') {
    try {
      const parsed = JSON.parse(rawText);
      const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.products) ? parsed.products : null;
      if (!list) {
        return { validRows, errors: ['JSON must be an array of products or an object with a "products" array.'] };
      }
      list.forEach((item: Record<string, unknown>, idx: number) => {
        const nameHi = String(item.nameHi ?? '').trim();
        const nameEn = String(item.nameEn ?? '').trim();
        if (!nameHi || !nameEn) {
          errors.push(`Row ${idx + 1}: Missing required nameHi or nameEn.`);
          return;
        }
        const slug = String(item.slug ?? '').trim() || slugify(nameEn);
        validRows.push({
          nameHi,
          nameEn,
          slug,
          primaryCategory: String(item.primaryCategory ?? 'ayurvedic-herbs').trim(),
          productForm: String(item.productForm ?? 'Raw Botanical').trim(),
          priceDisplay: String(item.priceDisplay ?? 'Contact for Price').trim(),
          isDuplicate: existingSlugs.has(slug),
        });
      });
    } catch {
      errors.push('Invalid JSON syntax.');
    }
    return { validRows, errors };
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return { validRows, errors: ['CSV must include a header row and at least one data row.'] };
  }

  const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const idxNameHi = header.indexOf('namehi');
  const idxNameEn = header.indexOf('nameen');
  const idxSlug = header.indexOf('slug');
  const idxCategory = header.indexOf('primarycategory');
  const idxForm = header.indexOf('productform');
  const idxPrice = header.indexOf('pricedisplay');

  if (idxNameHi === -1 || idxNameEn === -1) {
    return { validRows, errors: ['CSV header must contain "nameHi" and "nameEn" columns.'] };
  }

  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseCsvLine(lines[i]);
    const nameHi = (cols[idxNameHi] ?? '').trim();
    const nameEn = (cols[idxNameEn] ?? '').trim();
    if (!nameHi || !nameEn) {
      errors.push(`CSV line ${i + 1}: Missing nameHi or nameEn.`);
      continue;
    }
    const slug = (idxSlug >= 0 ? cols[idxSlug] : '').trim() || slugify(nameEn);
    validRows.push({
      nameHi,
      nameEn,
      slug,
      primaryCategory: (idxCategory >= 0 ? cols[idxCategory] : '').trim() || 'ayurvedic-herbs',
      productForm: (idxForm >= 0 ? cols[idxForm] : '').trim() || 'Raw Botanical',
      priceDisplay: (idxPrice >= 0 ? cols[idxPrice] : '').trim() || 'Contact for Price',
      isDuplicate: existingSlugs.has(slug),
    });
  }

  return { validRows, errors };
}
