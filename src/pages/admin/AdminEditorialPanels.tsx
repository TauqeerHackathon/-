import React, { useState } from 'react';
import { Plus, Upload, Trash2, Edit3, X } from 'lucide-react';
import type { Article, FaqItem, GalleryItem } from '../../shared/types';
import { adminFetch, uploadAdminImage } from './AdminApi';

interface ArticlesProps {
  token: string;
  articles: Article[];
  onRefresh: () => Promise<void>;
}

export const AdminArticlesPanel: React.FC<ArticlesProps> = ({ token, articles, onRefresh }) => {
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const openNew = () => {
    setIsNew(true);
    setEditing({
      titleHi: '',
      titleEn: '',
      excerptHi: '',
      excerptEn: '',
      contentHi: '',
      contentEn: '',
      categoryHi: 'जड़ी-बूटी ज्ञान',
      categoryEn: 'Herbal Guide',
      references: [],
      status: 'draft',
      reviewStatus: 'pending_expert_review',
    });
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      const url = await uploadAdminImage(token, file);
      setEditing({ ...editing, coverImage: url });
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Cover upload failed');
    } finally {
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMsg('');
    try {
      if (isNew) {
        await adminFetch('/api/admin/articles', token, {
          method: 'POST',
          body: JSON.stringify(editing),
        });
      } else if (editing.id) {
        await adminFetch(`/api/admin/articles/${editing.id}`, token, {
          method: 'PUT',
          body: JSON.stringify(editing),
        });
      }
      await onRefresh();
      setEditing(null);
      setMsg('Article saved. Sitemap automatically synchronized.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const toggleArticleStatus = async (art: Article) => {
    const nextStatus = art.status === 'published' ? 'draft' : 'published';
    try {
      await adminFetch(`/api/admin/articles/${art.id}`, token, {
        method: 'PUT',
        body: JSON.stringify({
          status: nextStatus,
          reviewStatus: nextStatus === 'published' ? 'reviewed' : art.reviewStatus,
        }),
      });
      await onRefresh();
      setMsg(`Updated "${art.titleEn}" to ${nextStatus}. Sitemap updated.`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
            Herbal Knowledge & Blog Studio ({articles.length})
          </h2>
          <p className="text-xs text-[#0D3021]/65 mt-0.5">
            All 12 initial articles remain in draft until facts, evidence limitations, safety notes, and authoritative citations are verified.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#174D35] text-[#F8F3E7] whitespace-nowrap"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>New Article</span>
        </button>
      </div>

      {msg && (
        <p className="text-xs font-medium text-[#174D35] bg-white border border-[#C5A15B]/50 px-4 py-2.5">
          {msg}
        </p>
      )}

      <div className="bg-white border border-[#0D3021]/10 divide-y divide-[#0D3021]/8 text-xs">
        {articles.map((art) => (
          <div key={art.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-semibold text-[#0D3021]">{art.titleHi}</p>
              <p className="text-[#0D3021]/65">{art.titleEn}</p>
              <p className="text-[11px] text-[#708B45]">
                {art.categoryEn} · Review: {art.reviewStatus} · Updated {art.updatedAt.slice(0, 10)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => toggleArticleStatus(art)}
                className={`px-3 py-1.5 font-semibold border ${
                  art.status === 'published'
                    ? 'bg-[#174D35] text-[#F8F3E7] border-[#174D35]'
                    : 'bg-[#F8F3E7] text-[#0D3021] border-[#0D3021]/20'
                }`}
              >
                {art.status === 'published' ? 'Published' : 'Draft — Publish'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsNew(false);
                  setEditing({ ...art });
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#0D3021]/15 text-[#174D35] font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-[#0D3021]/65 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSave}
            className="w-full max-w-3xl bg-[#F8F3E7] border border-[#C5A15B] max-h-[90vh] flex flex-col overflow-hidden text-xs"
          >
            <div className="px-6 py-4 bg-[#0D3021] text-[#F8F3E7] flex items-center justify-between">
              <h3 className="text-base font-semibold">{isNew ? 'New Knowledge Article' : 'Edit Article'}</h3>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close editor">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Hindi Title *</label>
                  <input
                    required
                    type="text"
                    value={editing.titleHi || ''}
                    onChange={(e) => setEditing({ ...editing, titleHi: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">English Title *</label>
                  <input
                    required
                    type="text"
                    value={editing.titleEn || ''}
                    onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Publication Status</label>
                  <select
                    value={editing.status || 'draft'}
                    onChange={(e) =>
                      setEditing({ ...editing, status: e.target.value as 'draft' | 'published' })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                  >
                    <option value="draft">Draft (Not Indexed)</option>
                    <option value="published">Published (Live & Sitemap Synced)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Cover Image Upload</label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#0D3021]/20 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{editing.coverImage ? 'Replace Cover Image' : 'Upload Cover Image'}</span>
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="sr-only" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Hindi Content</label>
                <textarea
                  rows={4}
                  value={editing.contentHi || ''}
                  onChange={(e) => setEditing({ ...editing, contentHi: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">English Content</label>
                <textarea
                  rows={4}
                  value={editing.contentEn || ''}
                  onChange={(e) => setEditing({ ...editing, contentEn: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Authoritative References (one per line)</label>
                <textarea
                  rows={2}
                  value={(editing.references ?? []).join('\n')}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      references: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#0D3021]/20"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-[#0D3021]/10 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border border-[#0D3021]/20">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-[#174D35] text-[#F8F3E7] font-semibold">
                {saving ? 'Saving...' : 'Save Article'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

interface GalleryProps {
  token: string;
  gallery: GalleryItem[];
  onRefresh: () => Promise<void>;
}

export const AdminGalleryPanel: React.FC<GalleryProps> = ({ token, gallery, onRefresh }) => {
  const [titleHi, setTitleHi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('store');
  const [isIllustrative, setIsIllustrative] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleUploadAndAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg('');
    try {
      const imageUrl = await uploadAdminImage(token, file);
      await adminFetch('/api/admin/gallery', token, {
        method: 'POST',
        body: JSON.stringify({
          titleHi: titleHi.trim() || 'कन्हैया औषधि भंडार चित्र',
          titleEn: titleEn.trim() || 'Kanhaiya Aushadhi Bhandar Photo',
          category,
          imageUrl,
          isIllustrative,
        }),
      });
      setTitleHi('');
      setTitleEn('');
      await onRefresh();
      setMsg('Photograph added to Gallery.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    await adminFetch(`/api/admin/gallery/${id}`, token, { method: 'DELETE' });
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
          Gallery Manager ({gallery.length})
        </h2>
        <p className="text-xs text-[#0D3021]/65 mt-0.5">
          Upload authentic store, product, and packaging photographs. Always label illustrative imagery clearly.
        </p>
      </div>

      {msg && (
        <p className="text-xs font-medium text-[#174D35] bg-white border border-[#C5A15B]/50 px-4 py-2.5">
          {msg}
        </p>
      )}

      <div className="bg-white border border-[#0D3021]/10 p-5 space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={titleHi}
            onChange={(e) => setTitleHi(e.target.value)}
            placeholder="Hindi Title / Alt text"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
          <input
            type="text"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="English Title / Alt text"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as GalleryItem['category'])}
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          >
            <option value="store">Authentic Store Photo</option>
            <option value="product">Authentic Product Photo</option>
            <option value="packaging">Authentic Packaging Photo</option>
            <option value="illustrative">Illustrative Editorial</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isIllustrative}
              onChange={(e) => setIsIllustrative(e.target.checked)}
              className="accent-[#174D35]"
            />
            <span>Mark as Illustrative Promotional Visual</span>
          </label>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#174D35] text-[#F8F3E7] font-semibold cursor-pointer">
            <Upload className="w-4 h-4" aria-hidden="true" />
            <span>{uploading ? 'Uploading...' : 'Select & Upload Photo'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleUploadAndAdd}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="bg-white border border-[#0D3021]/10 overflow-hidden text-xs">
            <div className="aspect-[4/3] bg-[#E9E1D2]">
              <img src={item.imageUrl} alt={item.altEn} className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[#0D3021]">{item.titleHi}</p>
                <p className="text-[#708B45] mt-0.5">
                  {item.category} · {item.isIllustrative ? 'Illustrative' : 'Authentic'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                aria-label={`Delete ${item.titleEn}`}
                className="p-1.5 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface FaqProps {
  token: string;
  faqs: FaqItem[];
  onRefresh: () => Promise<void>;
}

export const AdminFaqsPanel: React.FC<FaqProps> = ({ token, faqs, onRefresh }) => {
  const [questionHi, setQuestionHi] = useState('');
  const [questionEn, setQuestionEn] = useState('');
  const [answerHi, setAnswerHi] = useState('');
  const [answerEn, setAnswerEn] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminFetch('/api/admin/faqs', token, {
      method: 'POST',
      body: JSON.stringify({ questionHi, questionEn, answerHi, answerEn, displayOrder: faqs.length + 1 }),
    });
    setQuestionHi('');
    setQuestionEn('');
    setAnswerHi('');
    setAnswerEn('');
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
        Content & FAQ Manager ({faqs.length})
      </h2>

      <form onSubmit={handleAdd} className="bg-white border border-[#0D3021]/10 p-5 space-y-3 text-xs">
        <p className="font-semibold text-[#0D3021]">Add New FAQ</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            value={questionHi}
            onChange={(e) => setQuestionHi(e.target.value)}
            placeholder="Question (Hindi) *"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
          <input
            required
            value={questionEn}
            onChange={(e) => setQuestionEn(e.target.value)}
            placeholder="Question (English) *"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
          <textarea
            rows={2}
            value={answerHi}
            onChange={(e) => setAnswerHi(e.target.value)}
            placeholder="Answer (Hindi)"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
          <textarea
            rows={2}
            value={answerEn}
            onChange={(e) => setAnswerEn(e.target.value)}
            placeholder="Answer (English)"
            className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-[#174D35] text-[#F8F3E7] font-semibold">
          Save FAQ
        </button>
      </form>

      <div className="bg-white border border-[#0D3021]/10 divide-y divide-[#0D3021]/8 text-xs">
        {faqs.map((f) => (
          <div key={f.id} className="p-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-[#0D3021]">{f.questionHi}</p>
              <p className="text-[#0D3021]/70">{f.questionEn}</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await adminFetch(`/api/admin/faqs/${f.id}`, token, { method: 'DELETE' });
                await onRefresh();
              }}
              aria-label={`Delete FAQ ${f.questionEn}`}
              className="p-1.5 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
