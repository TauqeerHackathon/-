import React, { useMemo, useState } from 'react';
import { Plus, Search, Edit3, Trash2, Upload, Star, X } from 'lucide-react';
import type {
  BotanicalVerificationStatus,
  Category,
  Product,
  ProductSafetyTier,
  StockStatus,
} from '../../shared/types';
import { adminFetch, uploadAdminImage } from './AdminApi';

interface Props {
  token: string;
  products: Product[];
  categories: Category[];
  onRefresh: () => Promise<void>;
}

const EMPTY_FORM: Partial<Product> = {
  nameHi: '',
  nameEn: '',
  slug: '',
  originalPdfName: '',
  primaryCategory: 'ayurvedic-herbs',
  categories: ['ayurvedic-herbs'],
  productForm: 'Raw Botanical',
  botanicalName: '',
  botanicalStatus: 'pending',
  safetyTier: 'standard',
  priceDisplay: 'Contact for Price',
  stockStatus: 'confirm_availability',
  packSizes: [],
  descriptionHi: '',
  descriptionEn: '',
  traditionalUsesHi: '',
  traditionalUsesEn: '',
  safetyInfoHi: '',
  safetyInfoEn: '',
  storageInfoHi: '',
  storageInfoEn: '',
  featured: false,
  publicationStatus: 'published',
  indexable: false,
  images: [],
  variants: [],
};

export const AdminProductsPanel: React.FC<Props> = ({ token, products, categories, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [packSizeInput, setPackSizeInput] = useState('');
  const [variantHi, setVariantHi] = useState('');
  const [variantEn, setVariantEn] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (filterCat !== 'all' && !p.categories.includes(filterCat)) return false;
      if (!q) return true;
      return (
        p.nameHi.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.pdfSources.some((s) => s.groupId.toLowerCase().includes(q))
      );
    });
  }, [products, search, filterCat]);

  const openNew = () => {
    setIsNew(true);
    setEditing({ ...EMPTY_FORM });
    setPackSizeInput('');
    setStatusMessage('');
  };

  const openEdit = (product: Product) => {
    setIsNew(false);
    setEditing({ ...product });
    setPackSizeInput(product.packSizes.join(', '));
    setStatusMessage('');
  };

  const toggleFeatured = async (prod: Product) => {
    try {
      await adminFetch(`/api/admin/products/${prod.id}`, token, {
        method: 'PUT',
        body: JSON.stringify({ featured: !prod.featured }),
      });
      await onRefresh();
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Failed to toggle featured');
    }
  };

  const togglePublish = async (prod: Product) => {
    const nextStatus = prod.publicationStatus === 'published' ? 'draft' : 'published';
    try {
      await adminFetch(`/api/admin/products/${prod.id}`, token, {
        method: 'PUT',
        body: JSON.stringify({ publicationStatus: nextStatus }),
      });
      await onRefresh();
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async (prod: Product) => {
    try {
      await adminFetch(`/api/admin/products/${prod.id}`, token, { method: 'DELETE' });
      await onRefresh();
      setStatusMessage(`Deleted ${prod.nameEn}.`);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    setStatusMessage('');
    try {
      const url = await uploadAdminImage(token, file);
      setEditing({ ...editing, images: [...(editing.images ?? []), url] });
      setStatusMessage('Authentic product image uploaded.');
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setStatusMessage('');
    const packSizes = packSizeInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...editing,
      packSizes,
      botanicalName: editing.botanicalName?.trim() || null,
    };

    try {
      if (isNew) {
        await adminFetch('/api/admin/products', token, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } else if (editing.id) {
        await adminFetch(`/api/admin/products/${editing.id}`, token, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      await onRefresh();
      setEditing(null);
      setStatusMessage('Product saved successfully.');
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategoryOnEdit = (slug: string) => {
    if (!editing) return;
    const current = new Set(editing.categories ?? []);
    if (current.has(slug)) {
      if (current.size > 1) current.delete(slug);
    } else {
      current.add(slug);
    }
    const list = Array.from(current);
    setEditing({
      ...editing,
      categories: list,
      primaryCategory: list.includes(editing.primaryCategory || '') ? editing.primaryCategory : list[0],
    });
  };

  const addVariantToEdit = () => {
    if (!editing || !variantHi.trim() || !variantEn.trim()) return;
    const next = [
      ...(editing.variants ?? []),
      {
        id: `var-${Date.now()}`,
        nameHi: variantHi.trim(),
        nameEn: variantEn.trim(),
        form: editing.productForm || 'Variant',
        priceText: 'Contact for Price',
        stockStatus: 'confirm_availability' as StockStatus,
      },
    ];
    setEditing({ ...editing, variants: next });
    setVariantHi('');
    setVariantEn('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
            Product Manager ({products.length})
          </h2>
          <p className="text-xs text-[#0D3021]/65 mt-0.5">
            Manage official PDF items, upload authentic photos, set featured status, and verify botanical metadata.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 py-2.5 px-4 text-xs font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] whitespace-nowrap"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Product</span>
        </button>
      </div>

      {statusMessage && (
        <p className="text-xs font-medium text-[#174D35] bg-white border border-[#C5A15B]/50 px-4 py-2.5">
          {statusMessage}
        </p>
      )}

      {/* Search & Category Filter */}
      <div className="bg-white border border-[#0D3021]/10 p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#174D35] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by Hindi name, English name, slug, or PDF group (e.g. A08)..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#F8F3E7]/60 border border-[#0D3021]/15"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-2 text-sm bg-[#F8F3E7]/60 border border-[#0D3021]/15"
        >
          <option value="all">All Categories</option>
          {categories
            .filter((c) => c.slug !== 'all-products')
            .map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nameEn}
              </option>
            ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white border border-[#0D3021]/10 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0D3021] text-[#F8F3E7]">
              <th className="py-3 px-4 font-semibold">PDF Ref</th>
              <th className="py-3 px-4 font-semibold">Product (Hindi / English)</th>
              <th className="py-3 px-4 font-semibold">Forms / Price</th>
              <th className="py-3 px-4 font-semibold">Verification</th>
              <th className="py-3 px-4 font-semibold">Featured</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0D3021]/8">
            {filtered.map((prod) => (
              <tr key={prod.id} className="hover:bg-[#F8F3E7]/50">
                <td className="py-3 px-4 tabular-nums text-[#708B45] font-medium whitespace-nowrap">
                  {prod.pdfSources.length > 0
                    ? prod.pdfSources.map((s) => s.groupId).join(', ')
                    : 'Custom'}
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-[#0D3021]">{prod.nameHi}</p>
                  <p className="text-[#0D3021]/65">{prod.nameEn}</p>
                </td>
                <td className="py-3 px-4 text-[#0D3021]/80">
                  <p>{prod.productForm}</p>
                  <p className="text-[#174D35] font-medium">{prod.priceDisplay}</p>
                </td>
                <td className="py-3 px-4 text-[#0D3021]/75 whitespace-nowrap">
                  {prod.botanicalStatus} · {prod.images.length} img
                </td>
                <td className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => toggleFeatured(prod)}
                    aria-label={`Toggle featured for ${prod.nameEn}`}
                    className={`inline-flex items-center gap-1 px-2 py-1 border text-[11px] font-medium ${
                      prod.featured
                        ? 'bg-[#C5A15B]/25 border-[#C5A15B] text-[#0D3021]'
                        : 'border-[#0D3021]/15 text-[#0D3021]/60'
                    }`}
                  >
                    <Star className="w-3 h-3" aria-hidden="true" />
                    <span>{prod.featured ? 'Featured' : 'Standard'}</span>
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => togglePublish(prod)}
                    className={`px-2 py-1 border text-[11px] font-medium ${
                      prod.publicationStatus === 'published'
                        ? 'bg-[#174D35]/10 border-[#174D35]/30 text-[#174D35]'
                        : 'bg-[#E9E1D2] border-[#0D3021]/20 text-[#0D3021]/70'
                    }`}
                  >
                    {prod.publicationStatus}
                  </button>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => openEdit(prod)}
                    aria-label={`Edit ${prod.nameEn}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[#174D35] hover:bg-[#E9E1D2]/60 font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(prod)}
                    aria-label={`Delete ${prod.nameEn}`}
                    className="inline-flex items-center gap-1 px-2 py-1.5 text-red-700 hover:bg-red-50 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Edit / Create Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-[#0D3021]/65 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={isNew ? 'Add Product' : 'Edit Product'}
        >
          <form
            onSubmit={handleSave}
            className="w-full max-w-3xl bg-[#F8F3E7] border border-[#C5A15B] max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="px-6 py-4 bg-[#0D3021] text-[#F8F3E7] flex items-center justify-between">
              <h3 className="text-base font-semibold">
                {isNew ? 'Add New Product' : `Edit Product: ${editing.nameEn}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close product editor"
                className="p-1 text-[#F8F3E7] hover:text-[#C5A15B]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0D3021] mb-1">Hindi Name *</label>
                  <input
                    required
                    type="text"
                    value={editing.nameHi || ''}
                    onChange={(e) => setEditing({ ...editing, nameHi: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0D3021] mb-1">English Name *</label>
                  <input
                    required
                    type="text"
                    value={editing.nameEn || ''}
                    onChange={(e) => setEditing({ ...editing, nameEn: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0D3021] mb-1">Price Display</label>
                  <input
                    type="text"
                    value={editing.priceDisplay || ''}
                    onChange={(e) => setEditing({ ...editing, priceDisplay: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0D3021] mb-1">Availability Status</label>
                  <select
                    value={editing.stockStatus || 'confirm_availability'}
                    onChange={(e) => setEditing({ ...editing, stockStatus: e.target.value as StockStatus })}
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  >
                    <option value="confirm_availability">Confirm Availability</option>
                    <option value="in_stock">In Stock</option>
                    <option value="limited">Limited Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0D3021] mb-1">Botanical Name (if verified)</label>
                  <input
                    type="text"
                    value={editing.botanicalName || ''}
                    onChange={(e) => setEditing({ ...editing, botanicalName: e.target.value })}
                    placeholder="Leave empty if pending verification"
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0D3021] mb-1">Botanical Verification</label>
                  <select
                    value={editing.botanicalStatus || 'pending'}
                    onChange={(e) =>
                      setEditing({ ...editing, botanicalStatus: e.target.value as BotanicalVerificationStatus })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  >
                    <option value="pending">Verification Pending</option>
                    <option value="ambiguous">Ambiguous / Regional Check Needed</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0D3021] mb-1">Safety Classification</label>
                  <select
                    value={editing.safetyTier || 'standard'}
                    onChange={(e) => setEditing({ ...editing, safetyTier: e.target.value as ProductSafetyTier })}
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  >
                    <option value="standard">Standard Herb / Spice / Food</option>
                    <option value="caution_herb">Caution Herb (Professional Advice)</option>
                    <option value="mineral_chemical">Traditional Mineral / Chemical</option>
                    <option value="non_consumable">External / Pooja / Non-Consumable</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#0D3021] mb-1">Pack Sizes (comma separated)</label>
                  <input
                    type="text"
                    value={packSizeInput}
                    onChange={(e) => setPackSizeInput(e.target.value)}
                    placeholder="e.g. 100g, 250g, 500g"
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  />
                </div>
              </div>

              {/* Multi-Category Assignment */}
              <div>
                <p className="font-semibold text-[#0D3021] mb-1.5">Assigned Categories</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white border border-[#0D3021]/15 p-3">
                  {categories
                    .filter((c) => c.slug !== 'all-products')
                    .map((cat) => (
                      <label key={cat.slug} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(editing.categories ?? []).includes(cat.slug)}
                          onChange={() => toggleCategoryOnEdit(cat.slug)}
                          className="accent-[#174D35]"
                        />
                        <span className="truncate">{cat.nameEn}</span>
                      </label>
                    ))}
                </div>
              </div>

              {/* Variants */}
              <div className="bg-white border border-[#0D3021]/15 p-3 space-y-2">
                <p className="font-semibold text-[#0D3021]">Product Variants ({(editing.variants ?? []).length})</p>
                <div className="flex flex-wrap gap-2">
                  {(editing.variants ?? []).map((v) => (
                    <span
                      key={v.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F8F3E7] border border-[#0D3021]/15"
                    >
                      <span>{v.nameHi} ({v.nameEn})</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            variants: (editing.variants ?? []).filter((item) => item.id !== v.id),
                          })
                        }
                        aria-label={`Remove variant ${v.nameEn}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <input
                    type="text"
                    value={variantHi}
                    onChange={(e) => setVariantHi(e.target.value)}
                    placeholder="Variant Hindi (e.g. चूर्ण)"
                    className="px-2.5 py-1.5 border border-[#0D3021]/20 bg-[#F8F3E7]/50"
                  />
                  <input
                    type="text"
                    value={variantEn}
                    onChange={(e) => setVariantEn(e.target.value)}
                    placeholder="Variant English (e.g. Powder)"
                    className="px-2.5 py-1.5 border border-[#0D3021]/20 bg-[#F8F3E7]/50"
                  />
                  <button
                    type="button"
                    onClick={addVariantToEdit}
                    className="px-3 py-1.5 bg-[#174D35] text-[#F8F3E7] font-semibold"
                  >
                    Add Variant
                  </button>
                </div>
              </div>

              {/* Real Image Upload */}
              <div className="bg-white border border-[#0D3021]/15 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[#0D3021]">Authentic Product Photos</p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#174D35] text-[#F8F3E7] cursor-pointer font-semibold">
                    <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
                {(editing.images ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {(editing.images ?? []).map((url) => (
                      <div key={url} className="relative w-20 h-20 border border-[#0D3021]/15">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              images: (editing.images ?? []).filter((u) => u !== url),
                            })
                          }
                          aria-label="Remove uploaded image"
                          className="absolute top-0.5 right-0.5 bg-[#0D3021] text-white p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0D3021] mb-1">Description (Hindi)</label>
                  <textarea
                    rows={3}
                    value={editing.descriptionHi || ''}
                    onChange={(e) => setEditing({ ...editing, descriptionHi: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0D3021] mb-1">Description (English)</label>
                  <textarea
                    rows={3}
                    value={editing.descriptionEn || ''}
                    onChange={(e) => setEditing({ ...editing, descriptionEn: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.featured)}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="accent-[#174D35]"
                  />
                  <span className="font-semibold">Featured on Homepage</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.indexable)}
                    onChange={(e) => setEditing({ ...editing, indexable: e.target.checked })}
                    className="accent-[#174D35]"
                  />
                  <span className="font-semibold">SEO Indexable (include in sitemap.xml)</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#0D3021]/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-xs font-semibold border border-[#0D3021]/20 text-[#0D3021]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
