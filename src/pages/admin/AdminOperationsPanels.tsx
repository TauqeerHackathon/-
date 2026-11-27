import React, { useState } from 'react';
import type { ActivityLog, BusinessSettings, Enquiry } from '../../shared/types';
import { adminFetch } from './AdminApi';

interface EnquiriesProps {
  token: string;
  enquiries: Enquiry[];
  onRefresh: () => Promise<void>;
}

export const AdminEnquiriesPanel: React.FC<EnquiriesProps> = ({ token, enquiries, onRefresh }) => {
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');

  const handleUpdate = async (enq: Enquiry, status: Enquiry['status']) => {
    try {
      await adminFetch(`/api/admin/enquiries/${enq.id}`, token, {
        method: 'PATCH',
        body: JSON.stringify({
          status,
          followUpNotes: notesDraft[enq.id] ?? enq.followUpNotes,
        }),
      });
      await onRefresh();
      setMsg(`Updated ${enq.referenceCode}.`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
          Enquiry Manager ({enquiries.length})
        </h2>
        <p className="text-xs text-[#0D3021]/65 mt-0.5">
          Only genuine enquiries submitted via the website Enquiry Form are stored here. Direct WhatsApp chats are handled in WhatsApp Business and are not auto-synced.
        </p>
      </div>

      {msg && (
        <p className="text-xs font-medium text-[#174D35] bg-white border border-[#C5A15B]/50 px-4 py-2.5">
          {msg}
        </p>
      )}

      {enquiries.length === 0 ? (
        <div className="bg-white border border-[#0D3021]/10 p-10 text-center text-sm text-[#0D3021]/70">
          No customer enquiries submitted through the website form yet.
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div key={enq.id} className="bg-white border border-[#0D3021]/12 p-5 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0D3021]/8 pb-2.5">
                <div>
                  <span className="font-mono font-semibold text-[#174D35]">{enq.referenceCode}</span>
                  <span className="mx-2 text-[#0D3021]/30">·</span>
                  <span className="font-semibold text-[#0D3021]">{enq.customerName}</span>
                  <span className="mx-2 text-[#0D3021]/30">·</span>
                  <span className="tabular-nums">{enq.phone}</span>
                  {enq.city && <span className="text-[#0D3021]/65"> ({enq.city})</span>}
                </div>
                <span className="text-[#0D3021]/60 tabular-nums">
                  {new Date(enq.createdAt).toLocaleString()}
                </span>
              </div>

              {enq.items.length > 0 && (
                <div>
                  <p className="font-semibold text-[#0D3021] mb-1">Enquired Products:</p>
                  <ul className="list-disc pl-5 space-y-0.5 text-[#0D3021]/85">
                    {enq.items.map((item, idx) => (
                      <li key={idx}>
                        {item.nameHi} ({item.nameEn})
                        {item.variantName ? ` — ${item.variantName}` : ''}
                        {item.quantityNote ? ` [${item.quantityNote}]` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {enq.message && (
                <p className="text-[#0D3021]/85 bg-[#F8F3E7]/60 p-3 border border-[#0D3021]/8">
                  {enq.message}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <input
                  type="text"
                  value={notesDraft[enq.id] ?? enq.followUpNotes}
                  onChange={(e) => setNotesDraft({ ...notesDraft, [enq.id]: e.target.value })}
                  placeholder="Follow-up notes..."
                  className="flex-1 px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
                />
                <select
                  value={enq.status}
                  onChange={(e) => handleUpdate(enq, e.target.value as Enquiry['status'])}
                  className="px-3 py-2 bg-white border border-[#0D3021]/20 font-semibold"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleUpdate(enq, enq.status)}
                  className="px-4 py-2 bg-[#174D35] text-[#F8F3E7] font-semibold"
                >
                  Save Note
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface SettingsProps {
  token: string;
  settings: BusinessSettings;
  logs: ActivityLog[];
  onRefresh: () => Promise<void>;
}

export const AdminSettingsPanel: React.FC<SettingsProps> = ({ token, settings, logs, onRefresh }) => {
  const [draft, setDraft] = useState<BusinessSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await adminFetch('/api/admin/settings', token, {
        method: 'PUT',
        body: JSON.stringify(draft),
      });
      await onRefresh();
      setMsg('Business, Social & SEO settings saved.');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="space-y-6 text-xs">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#0D3021]">
            Business, Social & Analytics Settings
          </h2>
          <p className="text-xs text-[#0D3021]/65 mt-0.5">
            Official logo artwork is protected and cannot be modified. Social media links remain hidden on the public site until official URLs are entered below.
          </p>
        </div>

        {msg && (
          <p className="font-medium text-[#174D35] bg-white border border-[#C5A15B]/50 px-4 py-2.5">
            {msg}
          </p>
        )}

        <div className="bg-white border border-[#0D3021]/10 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Contact Person</label>
            <input
              type="text"
              value={draft.contactPerson}
              onChange={(e) => setDraft({ ...draft, contactPerson: e.target.value })}
              className="w-full px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone Display</label>
            <input
              type="text"
              value={draft.phoneDisplay}
              onChange={(e) => setDraft({ ...draft, phoneDisplay: e.target.value })}
              className="w-full px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Store Hours (Hindi)</label>
            <input
              type="text"
              value={draft.businessHoursHi}
              onChange={(e) => setDraft({ ...draft, businessHoursHi: e.target.value })}
              className="w-full px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Store Hours (English)</label>
            <input
              type="text"
              value={draft.businessHoursEn}
              onChange={(e) => setDraft({ ...draft, businessHoursEn: e.target.value })}
              className="w-full px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Verified Google Maps Store URL (https://...)</label>
            <input
              type="url"
              value={draft.verifiedMapUrl}
              onChange={(e) => setDraft({ ...draft, verifiedMapUrl: e.target.value })}
              placeholder="Leave empty until exact verified store coordinates are confirmed"
              className="w-full px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white border border-[#0D3021]/10 p-5 space-y-3">
          <p className="font-semibold text-[#0D3021]">Official Social Links (Hidden Until Provided)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="url"
              value={draft.socialLinks.facebook}
              onChange={(e) =>
                setDraft({ ...draft, socialLinks: { ...draft.socialLinks, facebook: e.target.value } })
              }
              placeholder="Facebook Page URL (https://...)"
              className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
            <input
              type="url"
              value={draft.socialLinks.instagram}
              onChange={(e) =>
                setDraft({ ...draft, socialLinks: { ...draft.socialLinks, instagram: e.target.value } })
              }
              placeholder="Instagram Profile URL (https://...)"
              className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
            <input
              type="url"
              value={draft.socialLinks.youtube}
              onChange={(e) =>
                setDraft({ ...draft, socialLinks: { ...draft.socialLinks, youtube: e.target.value } })
              }
              placeholder="YouTube Channel URL (https://...)"
              className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
            <input
              type="url"
              value={draft.socialLinks.googleBusiness}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  socialLinks: { ...draft.socialLinks, googleBusiness: e.target.value },
                })
              }
              placeholder="Google Business Profile URL (https://...)"
              className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
          </div>
        </div>

        {/* Analytics Readiness (Disabled by Default) */}
        <div className="bg-white border border-[#0D3021]/10 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[#0D3021]">
              Analytics & Tag Configuration (Disabled Until Admin Approval)
            </p>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.analytics.enabled}
                onChange={(e) =>
                  setDraft({ ...draft, analytics: { ...draft.analytics, enabled: e.target.checked } })
                }
                className="accent-[#174D35]"
              />
              <span>Enable Approved Tracking</span>
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={draft.analytics.ga4MeasurementId}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  analytics: { ...draft.analytics, ga4MeasurementId: e.target.value },
                })
              }
              placeholder="GA4 Measurement ID (G-XXXXXXXXXX)"
              className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
            <input
              type="text"
              value={draft.analytics.gtmContainerId}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  analytics: { ...draft.analytics, gtmContainerId: e.target.value },
                })
              }
              placeholder="GTM Container ID (GTM-XXXXXXX)"
              className="px-3 py-2 bg-[#F8F3E7]/50 border border-[#0D3021]/15"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-[#174D35] text-[#F8F3E7] font-semibold hover:bg-[#0D3021]"
        >
          {saving ? 'Saving Settings...' : 'Save Settings'}
        </button>
      </form>

      {/* Activity Log */}
      <div className="bg-white border border-[#0D3021]/10 p-5 space-y-3 text-xs">
        <h3 className="text-sm font-semibold text-[#0D3021]">Recent Admin Activity Log</h3>
        <div className="divide-y divide-[#0D3021]/8 max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-[#0D3021]/60 py-2">No admin actions recorded yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="py-2 flex items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-[#174D35]">{log.action}</span>
                  <span className="mx-1.5 text-[#0D3021]/30">·</span>
                  <span className="text-[#0D3021]/85">{log.summary}</span>
                </div>
                <span className="text-[#0D3021]/55 tabular-nums whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
