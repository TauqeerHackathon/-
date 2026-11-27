import React, { useMemo, useState } from 'react';
import { Download, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Category, Product } from '../../shared/types';
import { previewBulkImport, type ReconciliationSummary } from '../../shared/validation';
import { adminFetch } from './AdminApi';

interface CategoriesProps {
  token: string;
  categories: Category[];
  onRefresh: () => Promise<void>;
}

export const AdminCategoriesPanel: React.FC<CategoriesProps> = ({ token, categories, onRefresh }) => {
  const [nameHi, setNameHi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descHi, setDescHi] = useState('');
  const [descEn, setDescEn] = useState('');
  const [displayOrder, setDisplayOrder] = useState(15);
  const [msg, setMsg] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      await adminFetch('/api/admin/categories', token, {
        method: 'POST',
        body: JSON.stringify({
          nameHi,
          nameEn,
          descriptionHi: descHi,
          descriptionEn: descEn,
          displayOrder,
        }),
      });
      setNameHi('');
      setNameEn('');
      setDescHi('');
      setDescEn('');
      await onRefresh();
      setMsg('Category saved.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  const handleReorder = async (cat: Category, nextOrder: number) => {
    try {
      await adminFetch(`/api/admin/categories/${cat.slug}`, token, {
        method: 'PUT',
        body: JSON.stringify({ displayOrder: nextOrder }),
      });
      await onRefresh();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
          Category Manager ({categories.length})
        </h2>
        <p className="text-xs text-[#0D3021]/65 mt-0.5">
          Manage bilingual product categories, descriptions, and storefront display order.
        </p>
      </div>

      {msg && (
        <p className="text-xs font-medium text-[#174D35] bg-white border border-[#C5A15B]/50 px-4 py-2.5">
          {msg}
        </p>
      )}

      <form onSubmit={handleCreate} className="bg-white border border-[#0D3021]/10 p-5 space-y-3 text-xs">
        <p className="font-semibold text-[#0D3021]">Add / Update Category</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            required
            type="text"
            value={nameHi}
            onChange={(e) => setNameHi(e.target.value)}
            placeholder="Hindi Category Name *"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
          <input
            required
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="English Category Name *"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            placeholder="Display Order"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={descHi}
            onChange={(e) => setDescHi(e.target.value)}
            placeholder="Hindi description"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
          <input
            type="text"
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            placeholder="English description"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-[#174D35] text-[#F8F3E7] font-semibold">
          Save Category
        </button>
      </form>

      <div className="bg-white border border-[#0D3021]/10 divide-y divide-[#0D3021]/8 text-xs">
        {categories.map((cat) => (
          <div key={cat.slug} className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#0D3021]">
                {cat.nameHi} · {cat.nameEn}
              </p>
              <p className="text-[#0D3021]/65 mt-0.5">
                /{cat.slug} · PDF Sections: {cat.pdfSections.join(', ')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[#0D3021]/60">Order:</label>
              <input
                type="number"
                defaultValue={cat.displayOrder}
                onBlur={(e) => handleReorder(cat, Number(e.target.value))}
                className="w-16 px-2 py-1 border border-[#0D3021]/20 text-center tabular-nums"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BulkProps {
  token: string;
  products: Product[];
  reconciliation: ReconciliationSummary;
  onRefresh: () => Promise<void>;
}

export const AdminBulkToolsPanel: React.FC<BulkProps> = ({
  token,
  products,
  reconciliation,
  onRefresh,
}) => {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [payload, setPayload] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [importing, setImporting] = useState(false);

  const existingSlugs = useMemo(() => new Set(products.map((p) => p.slug)), [products]);
  const preview = useMemo(
    () => (payload.trim() ? previewBulkImport(payload, format, existingSlugs) : null),
    [payload, format, existingSlugs]
  );

  const downloadAuthenticated = async (url: string, filename: string) => {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const handleImport = async () => {
    setImporting(true);
    setStatusMsg('');
    try {
      const res = await adminFetch<{ importedCount: number; skippedCount: number }>(
        '/api/admin/import',
        token,
        {
          method: 'POST',
          body: JSON.stringify({ format, payload, skipDuplicates: true }),
        }
      );
      setStatusMsg(
        `Imported ${res.importedCount} product(s) as draft; skipped ${res.skippedCount} duplicate(s).`
      );
      setPayload('');
      await onRefresh();
    } catch (err) {
      setStatusMsg(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
          Bulk Import / Export & PDF Reconciliation
        </h2>
        <p className="text-xs text-[#0D3021]/65 mt-0.5">
          Export master catalogue, validate CSV/JSON imports with duplicate detection, download full backups, and verify PDF source coverage.
        </p>
      </div>

      {/* Exports & Backup */}
      <div className="bg-white border border-[#0D3021]/10 p-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => downloadAuthenticated('/api/admin/export/csv', 'kanhaiya-products.csv')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#174D35] text-[#F8F3E7]"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Export Master CSV</span>
        </button>
        <button
          type="button"
          onClick={() => downloadAuthenticated('/api/admin/export/json', 'kanhaiya-products.json')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border border-[#174D35] text-[#174D35]"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Export Master JSON</span>
        </button>
        <button
          type="button"
          onClick={() => downloadAuthenticated('/api/admin/backup', 'kanhaiya-full-backup.json')}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#0D3021] text-[#F8F3E7]"
        >
          <Download className="w-4 h-4 text-[#C5A15B]" aria-hidden="true" />
          <span>Download Full Database Backup</span>
        </button>
      </div>

      {/* PDF Source Reconciliation Summary */}
      <div className="bg-white border border-[#C5A15B]/50 p-5 space-y-3 text-xs">
        <div className="flex items-center gap-2">
          {reconciliation.passed ? (
            <CheckCircle2 className="w-5 h-5 text-[#174D35]" aria-hidden="true" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-700" aria-hidden="true" />
          )}
          <h3 className="text-sm font-semibold text-[#0D3021]">
            Official PDF Catalogue Reconciliation: {reconciliation.passed ? 'PASSED' : 'ATTENTION REQUIRED'}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 tabular-nums">
          <div>
            <p className="text-[#0D3021]/60">Canonical Products</p>
            <p className="text-lg font-semibold text-[#174D35]">{reconciliation.totalCanonicalProducts}</p>
          </div>
          <div>
            <p className="text-[#0D3021]/60">PDF Groups Covered</p>
            <p className="text-lg font-semibold text-[#174D35]">
              {reconciliation.coveredPdfGroups.length} / {reconciliation.totalPdfGroupsExpected}
            </p>
          </div>
          <div>
            <p className="text-[#0D3021]/60">Duplicate Slugs</p>
            <p className="text-lg font-semibold text-[#0D3021]">{reconciliation.duplicateSlugs.length}</p>
          </div>
          <div>
            <p className="text-[#0D3021]/60">Mineral Caution Items</p>
            <p className="text-lg font-semibold text-[#8C4A1C]">{reconciliation.mineralCautionCount}</p>
          </div>
        </div>
        {reconciliation.multiSourceProducts.length > 0 && (
          <p className="text-[#0D3021]/75">
            Canonical multi-section products deduplicated:{' '}
            {reconciliation.multiSourceProducts
              .map((m) => `${m.nameHi} (${m.groups.join(' + ')})`)
              .join(', ')}
          </p>
        )}
      </div>

      {/* Bulk Import Preview & Validation */}
      <div className="bg-white border border-[#0D3021]/10 p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#0D3021]">Validated Bulk Import (CSV / JSON)</h3>
          <div className="inline-flex border border-[#0D3021]/20">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`px-3 py-1.5 font-semibold ${format === 'csv' ? 'bg-[#174D35] text-[#F8F3E7]' : ''}`}
            >
              CSV
            </button>
            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`px-3 py-1.5 font-semibold ${format === 'json' ? 'bg-[#174D35] text-[#F8F3E7]' : ''}`}
            >
              JSON
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder={
            format === 'csv'
              ? 'nameHi,nameEn,primaryCategory,productForm\nतुलसी बीज,Tulsi Seeds,ayurvedic-herbs,Whole Seeds'
              : '[{"nameHi":"तुलसी बीज","nameEn":"Tulsi Seeds","primaryCategory":"ayurvedic-herbs"}]'
          }
          className="w-full p-3 font-mono bg-[#F8F3E7]/60 border border-[#0D3021]/15"
        />

        {statusMsg && <p className="font-medium text-[#174D35]">{statusMsg}</p>}

        {preview && (
          <div className="bg-[#F8F3E7] border border-[#0D3021]/12 p-4 space-y-2">
            <p className="font-semibold text-[#0D3021]">
              Import Preview: {preview.validRows.length} valid row(s), {preview.errors.length} error(s)
            </p>
            {preview.errors.map((err) => (
              <p key={err} className="text-red-700">{err}</p>
            ))}
            {preview.validRows.slice(0, 5).map((row) => (
              <p key={row.slug} className="text-[#0D3021]/80">
                {row.nameHi} ({row.nameEn}) — {row.isDuplicate ? 'Duplicate (will skip)' : 'New Draft'}
              </p>
            ))}
          </div>
        )}

        <button
          type="button"
          disabled={importing || !preview || preview.errors.length > 0 || preview.validRows.length === 0}
          onClick={handleImport}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#174D35] text-[#F8F3E7] font-semibold disabled:opacity-45"
        >
          <Upload className="w-4 h-4" aria-hidden="true" />
          <span>{importing ? 'Importing...' : 'Commit Validated Import (As Draft)'}</span>
        </button>
      </div>
    </div>
  );
};
