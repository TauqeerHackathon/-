import type { Category, Language, Product, StockStatus } from './types';

export interface SearchFilterOptions {
  query?: string;
  categorySlug?: string;
  productForm?: string;
  featuredOnly?: boolean;
  stockStatus?: StockStatus | 'all';
  sort?: 'default' | 'alpha_asc' | 'alpha_desc';
  lang?: Language;
  includeDrafts?: boolean;
}

export function normalizeSearchText(input: string): string {
  return input
    .normalize('NFC')
    .toLowerCase()
    .replace(/[—–\-_/(),.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);

  for (let j = 0; j <= b.length; j += 1) {
    prev[j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j += 1) {
      prev[j] = curr[j];
    }
  }
  return prev[b.length];
}

export function scoreProductMatch(
  product: Product,
  rawQuery: string,
  categoriesBySlug?: Map<string, Category>
): number {
  const q = normalizeSearchText(rawQuery);
  if (!q) return 1;

  const variantTokens = product.variants.flatMap((v) => [v.nameHi, v.nameEn, v.form]);
  const categoryTokens = categoriesBySlug
    ? product.categories.flatMap((slug) => {
        const cat = categoriesBySlug.get(slug);
        return cat ? [cat.nameHi, cat.nameEn] : [];
      })
    : [];

  const fields = [
    { text: normalizeSearchText(product.nameHi), weight: 100 },
    { text: normalizeSearchText(product.nameEn), weight: 95 },
    { text: normalizeSearchText(product.originalPdfName), weight: 90 },
    ...product.alternativeNamesHi.map((t) => ({ text: normalizeSearchText(t), weight: 85 })),
    ...product.alternativeNamesEn.map((t) => ({ text: normalizeSearchText(t), weight: 80 })),
    ...product.searchAliases.map((t) => ({ text: normalizeSearchText(t), weight: 78 })),
    ...variantTokens.map((t) => ({ text: normalizeSearchText(t), weight: 70 })),
    ...(product.botanicalName
      ? [{ text: normalizeSearchText(product.botanicalName), weight: 75 }]
      : []),
    ...categoryTokens.map((t) => ({ text: normalizeSearchText(t), weight: 50 })),
  ].filter((f) => f.text.length > 0);

  let bestScore = 0;

  for (const field of fields) {
    if (field.text === q) {
      bestScore = Math.max(bestScore, field.weight + 40);
    } else if (field.text.startsWith(q)) {
      bestScore = Math.max(bestScore, field.weight + 25);
    } else if (field.text.includes(q)) {
      bestScore = Math.max(bestScore, field.weight + 12);
    }
  }

  if (bestScore > 0) return bestScore;

  // Token-level & typo-tolerant matching (e.g. "Aswagandha" -> "Ashwagandha", "Choti Harad" -> "Chhoti Harad")
  const queryTokens = q.split(' ').filter((t) => t.length >= 2);
  if (queryTokens.length === 0) return 0;

  const candidateWords = Array.from(
    new Set(fields.flatMap((f) => f.text.split(' ')).filter((w) => w.length >= 2))
  );

  let matchedTokens = 0;
  let tokenScoreSum = 0;

  for (const qToken of queryTokens) {
    let bestTokenScore = 0;
    const maxDist = qToken.length >= 7 ? 2 : qToken.length >= 4 ? 1 : 0;

    for (const word of candidateWords) {
      if (word === qToken) {
        bestTokenScore = Math.max(bestTokenScore, 60);
        break;
      }
      if (word.startsWith(qToken) || qToken.startsWith(word)) {
        bestTokenScore = Math.max(bestTokenScore, 48);
        continue;
      }
      if (maxDist > 0 && Math.abs(word.length - qToken.length) <= maxDist) {
        const dist = levenshteinDistance(qToken, word);
        if (dist <= maxDist) {
          bestTokenScore = Math.max(bestTokenScore, dist === 1 ? 42 : 30);
        }
      }
    }

    if (bestTokenScore > 0) {
      matchedTokens += 1;
      tokenScoreSum += bestTokenScore;
    }
  }

  if (matchedTokens === queryTokens.length) {
    return Math.round(tokenScoreSum / queryTokens.length);
  }
  return 0;
}

export function filterAndSearchProducts(
  products: Product[],
  options: SearchFilterOptions,
  categories?: Category[]
): Product[] {
  const categoriesBySlug = categories ? new Map(categories.map((c) => [c.slug, c])) : undefined;
  const lang = options.lang ?? 'hi';

  const filtered = products
    .filter((p) => (options.includeDrafts ? true : p.publicationStatus === 'published'))
    .filter((p) => {
      if (!options.categorySlug || options.categorySlug === 'all-products') return true;
      return p.categories.includes(options.categorySlug);
    })
    .filter((p) => {
      if (!options.productForm || options.productForm === 'all') return true;
      const needle = options.productForm.toLowerCase();
      return (
        p.productForm.toLowerCase().includes(needle) ||
        p.variants.some((v) => v.form.toLowerCase().includes(needle))
      );
    })
    .filter((p) => (options.featuredOnly ? p.featured : true))
    .filter((p) => {
      if (!options.stockStatus || options.stockStatus === 'all') return true;
      return p.stockStatus === options.stockStatus;
    });

  const q = options.query?.trim() ?? '';
  const scored = filtered
    .map((product) => ({
      product,
      score: q ? scoreProductMatch(product, q, categoriesBySlug) : 1,
    }))
    .filter((entry) => entry.score > 0);

  if (options.sort === 'alpha_asc') {
    scored.sort((a, b) =>
      lang === 'hi'
        ? a.product.nameHi.localeCompare(b.product.nameHi, 'hi')
        : a.product.nameEn.localeCompare(b.product.nameEn, 'en')
    );
  } else if (options.sort === 'alpha_desc') {
    scored.sort((a, b) =>
      lang === 'hi'
        ? b.product.nameHi.localeCompare(a.product.nameHi, 'hi')
        : b.product.nameEn.localeCompare(a.product.nameEn, 'en')
    );
  } else if (q) {
    scored.sort((a, b) => b.score - a.score);
  }

  return scored.map((entry) => entry.product);
}

export function getDistinctProductForms(products: Product[]): string[] {
  const forms = new Set<string>();
  for (const p of products) {
    if (p.productForm.trim()) forms.add(p.productForm.trim());
  }
  return Array.from(forms).sort((a, b) => a.localeCompare(b));
}
