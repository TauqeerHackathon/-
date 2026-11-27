import test from 'node:test';
import assert from 'node:assert/strict';
import { OFFICIAL_PRODUCTS, PDF_EXPECTED_GROUP_IDS } from './catalogueData';
import { INITIAL_CATEGORIES } from './categories';
import { INITIAL_ARTICLES } from './articlesData';
import { filterAndSearchProducts } from './search';
import {
  buildBasketEnquiryMessage,
  buildSingleProductEnquiryMessage,
  buildWhatsAppUrl,
} from './whatsapp';
import {
  previewBulkImport,
  productsToCsv,
  reconcileProductsAgainstPdf,
  sanitizeExternalUrl,
  validateEnquiryInput,
} from './validation';

test('PDF reconciliation verifies all 35 source groups, zero duplicates, and canonical Jatamansi', () => {
  const summary = reconcileProductsAgainstPdf(OFFICIAL_PRODUCTS);
  assert.equal(summary.passed, true);
  assert.equal(summary.missingPdfGroups.length, 0);
  assert.equal(summary.duplicateSlugs.length, 0);
  assert.equal(summary.duplicateIds.length, 0);
  assert.equal(summary.totalPdfGroupsExpected, PDF_EXPECTED_GROUP_IDS.length);
  assert.equal(summary.totalCanonicalProducts, 111);

  const jatamansi = OFFICIAL_PRODUCTS.filter((p) => p.slug === 'jatamansi');
  assert.equal(jatamansi.length, 1);
  const groups = jatamansi[0].pdfSources.map((s) => s.groupId).sort();
  assert.deepEqual(groups, ['A16', 'C07']);
});

test('all 12 requested featured products are flagged featured in official catalogue', () => {
  const featuredSlugs = new Set(OFFICIAL_PRODUCTS.filter((p) => p.featured).map((p) => p.slug));
  const expected = [
    'ashwagandha',
    'giloy',
    'safed-shatavari',
    'mulethi',
    'sukha-amla',
    'baheda',
    'arjun-ki-chaal',
    'brahmi',
    'gond-katira',
    'safed-musli',
    'kesar',
    'shikakai',
  ];
  for (const slug of expected) {
    assert.equal(featuredSlugs.has(slug), true, `Expected ${slug} to be featured`);
  }
});

test('mineral and high-caution pansari products carry proper safety tiers', () => {
  const mineralSlugs = [
    'chot-sajji-sajji-khar',
    'suhaga',
    'safed-fitkari',
    'lal-fitkari',
    'nausadar',
    'yavakshar',
    'bhimseni-kapur',
  ];
  for (const slug of mineralSlugs) {
    const prod = OFFICIAL_PRODUCTS.find((p) => p.slug === slug);
    assert.ok(prod, `Missing ${slug}`);
    assert.equal(prod.safetyTier, 'mineral_chemical');
  }
  const suranjan = OFFICIAL_PRODUCTS.find((p) => p.slug === 'suranjan');
  assert.equal(suranjan?.safetyTier, 'caution_herb');
});

test('all 12 initial knowledge articles stay in draft pending expert review', () => {
  assert.equal(INITIAL_ARTICLES.length, 12);
  for (const art of INITIAL_ARTICLES) {
    assert.equal(art.status, 'draft');
    assert.equal(art.reviewStatus, 'pending_expert_review');
  }
});

test('bilingual search supports Devanagari, English, Roman Hindi, variants, and typos', () => {
  const resTypo = filterAndSearchProducts(OFFICIAL_PRODUCTS, { query: 'Aswagandha' }, INITIAL_CATEGORIES);
  assert.equal(resTypo[0]?.slug, 'ashwagandha');

  const resHindi = filterAndSearchProducts(OFFICIAL_PRODUCTS, { query: 'गोंद कतीरा' }, INITIAL_CATEGORIES);
  assert.equal(resHindi[0]?.slug, 'gond-katira');

  const resVariant = filterAndSearchProducts(OFFICIAL_PRODUCTS, { query: 'नागौरी जड़' }, INITIAL_CATEGORIES);
  assert.equal(resVariant[0]?.slug, 'ashwagandha');

  const resIsabgol = filterAndSearchProducts(OFFICIAL_PRODUCTS, { query: 'Isabgol' }, INITIAL_CATEGORIES);
  assert.equal(resIsabgol[0]?.slug, 'isabgol-bhusi');

  const resHarad = filterAndSearchProducts(OFFICIAL_PRODUCTS, { query: 'हरड़' }, INITIAL_CATEGORIES);
  assert.ok(resHarad.some((p) => p.slug === 'chhoti-harad'));
  assert.ok(resHarad.some((p) => p.slug === 'badi-harad'));

  const resCategory = filterAndSearchProducts(
    OFFICIAL_PRODUCTS,
    { categorySlug: 'triphala-ingredients' },
    INITIAL_CATEGORIES
  );
  assert.equal(resCategory.length, 4);
});

test('WhatsApp message and click-to-chat URL formatting match official store number', () => {
  const msgHi = buildSingleProductEnquiryMessage({ nameHi: 'अश्वगंधा', nameEn: 'Ashwagandha' }, 'hi');
  assert.equal(
    msgHi,
    'नमस्कार, मुझे कन्हैया औषधि भंडार के अश्वगंधा उत्पाद की कीमत, उपलब्धता एवं पैकेजिंग की जानकारी चाहिए।'
  );
  const url = buildWhatsAppUrl(msgHi);
  assert.ok(url.startsWith('https://wa.me/919012429042?text='));

  const basketMsg = buildBasketEnquiryMessage(
    [
      {
        productId: 'kab-a08-ashwagandha',
        slug: 'ashwagandha',
        nameHi: 'अश्वगंधा',
        nameEn: 'Ashwagandha',
        variantName: 'नागौरी जड़',
        quantityNote: '250g',
      },
    ],
    'en'
  );
  assert.ok(basketMsg.includes('Ashwagandha'));
  assert.ok(basketMsg.includes('250g'));
});

test('URL sanitization blocks unsafe schemes and enquiry/CSV validators work accurately', () => {
  assert.equal(sanitizeExternalUrl('javascript:alert(1)'), '');
  assert.equal(sanitizeExternalUrl('data:text/html,<h1>hi</h1>'), '');
  assert.equal(sanitizeExternalUrl('https://maps.google.com/?q=Agra'), 'https://maps.google.com/?q=Agra');
  assert.equal(sanitizeExternalUrl('/uploads/photo.jpg'), '/uploads/photo.jpg');

  const errors = validateEnquiryInput({ customerName: 'A', phone: '123', message: '' });
  assert.equal(errors.length, 3);

  const ok = validateEnquiryInput({
    customerName: 'Ramesh Sharma',
    phone: '9876543210',
    message: 'Need Ashwagandha Nagauri root',
  });
  assert.equal(ok.length, 0);

  const csv = productsToCsv(OFFICIAL_PRODUCTS.slice(0, 3));
  const preview = previewBulkImport(csv, 'csv', new Set(['chhoti-harad']));
  assert.equal(preview.errors.length, 0);
  assert.equal(preview.validRows.length, 3);
  assert.equal(preview.validRows[0].isDuplicate, true);
  assert.equal(preview.validRows[1].isDuplicate, false);
});
