import React, { useCallback, useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileSpreadsheet,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SeoHead } from '../../components/SeoHead';
import { adminFetch, type AdminOverviewResponse } from './AdminApi';
import { AdminProductsPanel } from './AdminProductsPanel';
import { AdminBulkToolsPanel, AdminCategoriesPanel } from './AdminCatalogTools';
import { AdminArticlesPanel, AdminFaqsPanel, AdminGalleryPanel } from './AdminEditorialPanels';
import { AdminEnquiriesPanel, AdminSettingsPanel } from './AdminOperationsPanels';

type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'bulk'
  | 'articles'
  | 'gallery'
  | 'faqs'
  | 'enquiries'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const { settings: publicSettings, refreshData } = useApp();

  // Bearer token held strictly in React JS memory (never localStorage or sessionStorage)
  const [token, setToken] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<{
    loaded: boolean;
    needsFirstRunSetup: boolean;
    configuredViaEnv: boolean;
  }>({ loaded: false, needsFirstRunSetup: false, configuredViaEnv: false });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/auth/status');
      const data = (await res.json()) as {
        needsFirstRunSetup: boolean;
        configuredViaEnv: boolean;
      };
      setAuthStatus({
        loaded: true,
        needsFirstRunSetup: Boolean(data.needsFirstRunSetup),
        configuredViaEnv: Boolean(data.configuredViaEnv),
      });
    } catch {
      setAuthStatus({ loaded: true, needsFirstRunSetup: false, configuredViaEnv: false });
    }
  }, []);

  useEffect(() => {
    void checkAuthStatus();
  }, [checkAuthStatus]);

  const loadOverview = useCallback(
    async (activeToken: string) => {
      setLoadingOverview(true);
      try {
        const data = await adminFetch<AdminOverviewResponse>('/api/admin/overview', activeToken);
        setOverview(data);
        await refreshData();
      } catch (err) {
        if (err instanceof Error && err.message.includes('401')) {
          setToken(null);
        }
      } finally {
        setLoadingOverview(false);
      }
    },
    [refreshData]
  );

  useEffect(() => {
    if (token) {
      void loadOverview(token);
    }
  }, [token, loadOverview]);

  const handleFirstRunSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (password.length < 8) {
      setAuthError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Setup failed.');
        return;
      }
      setPassword('');
      setConfirmPassword('');
      setAuthStatus((prev) => ({ ...prev, needsFirstRunSetup: false }));
      setToken(data.token);
    } catch {
      setAuthError('Unable to reach authentication server.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Invalid administrator password.');
        return;
      }
      setPassword('');
      setToken(data.token);
    } catch {
      setAuthError('Unable to reach authentication server.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setToken(null);
    setOverview(null);
  };

  if (!token) {
    return (
      <>
        <SeoHead
          title={`Admin Dashboard — ${publicSettings.brandNameEn}`}
          description="Protected administrator console for Kanhaiya Aushadhi Bhandar."
          canonicalPath="/admin"
          noIndex
        />
        <section className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white border border-[#C5A15B]/50 p-8 space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <img
                src={publicSettings.logoUrl}
                alt={publicSettings.brandNameEn}
                className="w-20 h-20 object-contain"
              />
              <h1 className="font-serif text-2xl font-semibold text-[#0D3021]">
                {authStatus.needsFirstRunSetup ? 'First-Run Admin Setup' : 'Administrator Sign In'}
              </h1>
              <p className="text-xs text-[#0D3021]/70">
                {authStatus.needsFirstRunSetup
                  ? 'Set your initial administrator password to secure the Kanhaiya Aushadhi Bhandar dashboard. You can also configure ADMIN_PASSWORD in environment secrets.'
                  : 'Protected store management console for Kanhaiya Aushadhi Bhandar.'}
              </p>
            </div>

            {authError && (
              <div role="alert" className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">
                {authError}
              </div>
            )}

            {!authStatus.loaded ? (
              <p className="text-center text-xs text-[#0D3021]/60 py-4">Checking server security state...</p>
            ) : authStatus.needsFirstRunSetup ? (
              <form onSubmit={handleFirstRunSetup} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="admin-setup-pass" className="block font-semibold text-[#0D3021] mb-1">
                    Create Admin Password (min 8 chars)
                  </label>
                  <input
                    id="admin-setup-pass"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F3E7]/60 border border-[#0D3021]/20"
                  />
                </div>
                <div>
                  <label htmlFor="admin-setup-confirm" className="block font-semibold text-[#0D3021] mb-1">
                    Confirm Admin Password
                  </label>
                  <input
                    id="admin-setup-confirm"
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F3E7]/60 border border-[#0D3021]/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3 bg-[#174D35] text-[#F8F3E7] font-semibold hover:bg-[#0D3021] disabled:opacity-60"
                >
                  {authSubmitting ? 'Securing Account...' : 'Claim Admin Access'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="admin-login-pass" className="block font-semibold text-[#0D3021] mb-1">
                    Administrator Password
                  </label>
                  <input
                    id="admin-login-pass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8F3E7]/60 border border-[#0D3021]/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3 bg-[#174D35] text-[#F8F3E7] font-semibold hover:bg-[#0D3021] disabled:opacity-60"
                >
                  {authSubmitting ? 'Verifying...' : 'Sign In'}
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-[#0D3021]/10 flex items-center gap-2 text-[11px] text-[#708B45]">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Server-side scrypt hashing · In-memory Bearer session · Rate-limited</span>
            </div>
          </div>
        </section>
      </>
    );
  }

  const navTabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', label: 'Categories', icon: <FolderTree className="w-4 h-4" /> },
    { id: 'bulk', label: 'Import / Export', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'articles', label: 'Knowledge Studio', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'faqs', label: 'Content & FAQs', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'enquiries', label: 'Enquiries', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & Logs', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleRefresh = async () => {
    if (token) await loadOverview(token);
  };

  return (
    <>
      <SeoHead
        title={`Admin Dashboard — ${publicSettings.brandNameEn}`}
        description="Store administration dashboard."
        canonicalPath="/admin"
        noIndex
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 shrink-0 bg-[#0D3021] text-[#F8F3E7] border border-[#C5A15B]/30">
            <div className="p-4 border-b border-[#F8F3E7]/15 flex items-center gap-3">
              <img
                src={publicSettings.logoUrl}
                alt={publicSettings.brandNameEn}
                className="w-10 h-10 object-contain bg-[#F8F3E7] rounded-full p-0.5 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">Admin Console</p>
                <p className="text-[11px] text-[#C5A15B] truncate">{publicSettings.brandNameEn}</p>
              </div>
            </div>

            <nav aria-label="Admin sections" className="p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#174D35] text-[#C5A15B]'
                      : 'text-[#F8F3E7]/80 hover:bg-[#174D35]/50 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-2 border-t border-[#F8F3E7]/15">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-[#F8F3E7]/75 hover:text-[#C5A15B]"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Workspace */}
          <div className="flex-1 min-w-0 w-full">
            {loadingOverview && !overview ? (
              <div className="bg-white border border-[#0D3021]/10 p-12 text-center text-sm text-[#0D3021]/70">
                Loading administrator workspace...
              </div>
            ) : !overview ? null : (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h1 className="font-serif text-3xl font-semibold text-[#0D3021]">
                        Store Overview
                      </h1>
                      <p className="text-xs text-[#0D3021]/65 mt-0.5">
                        Live SQLite-backed catalogue, editorial, gallery, and customer enquiry metrics.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tabular-nums">
                      {[
                        { label: 'Total Catalogue Products', value: overview.stats.totalProducts },
                        { label: 'Published Products', value: overview.stats.publishedProducts },
                        { label: 'Draft Products', value: overview.stats.draftProducts },
                        { label: 'Verification Pending', value: overview.stats.verificationPending },
                        { label: 'Product Categories', value: overview.stats.categoriesCount },
                        { label: 'Website Enquiries', value: overview.stats.enquiriesCount },
                        { label: 'Knowledge Articles', value: overview.stats.articlesCount },
                        { label: 'Gallery Images', value: overview.stats.galleryCount },
                      ].map((kpi) => (
                        <div key={kpi.label} className="bg-white border border-[#0D3021]/10 p-5">
                          <p className="text-xs text-[#0D3021]/65">{kpi.label}</p>
                          <p className="text-2xl font-serif font-semibold text-[#174D35] mt-1">
                            {kpi.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white border border-[#C5A15B]/45 p-5 space-y-2 text-xs">
                      <p className="font-semibold text-[#0D3021]">
                        PDF Catalogue Verification: {overview.reconciliation.passed ? 'All 35 PDF Source Groups Verified' : 'Review Needed'}
                      </p>
                      <p className="text-[#0D3021]/75">
                        Canonical records: {overview.reconciliation.totalCanonicalProducts} · PDF Groups Covered:{' '}
                        {overview.reconciliation.coveredPdfGroups.length}/{overview.reconciliation.totalPdfGroupsExpected} ·
                        Mineral/Chemical Caution Items: {overview.reconciliation.mineralCautionCount}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'products' && (
                  <AdminProductsPanel
                    token={token}
                    products={overview.products}
                    categories={overview.categories}
                    onRefresh={handleRefresh}
                  />
                )}

                {activeTab === 'categories' && (
                  <AdminCategoriesPanel
                    token={token}
                    categories={overview.categories}
                    onRefresh={handleRefresh}
                  />
                )}

                {activeTab === 'bulk' && (
                  <AdminBulkToolsPanel
                    token={token}
                    products={overview.products}
                    reconciliation={overview.reconciliation}
                    onRefresh={handleRefresh}
                  />
                )}

                {activeTab === 'articles' && (
                  <AdminArticlesPanel
                    token={token}
                    articles={overview.articles}
                    onRefresh={handleRefresh}
                  />
                )}

                {activeTab === 'gallery' && (
                  <AdminGalleryPanel
                    token={token}
                    gallery={overview.gallery}
                    onRefresh={handleRefresh}
                  />
                )}

                {activeTab === 'faqs' && (
                  <AdminFaqsPanel
                    token={token}
                    faqs={overview.faqs}
                    onRefresh={handleRefresh}
                  />
                )}

                {activeTab === 'enquiries' && (
                  <AdminEnquiriesPanel
                    token={token}
                    enquiries={overview.enquiries}
                    onRefresh={handleRefresh}
                  />
                )}

                {activeTab === 'settings' && (
                  <AdminSettingsPanel
                    token={token}
                    settings={overview.settings}
                    logs={overview.logs}
                    onRefresh={handleRefresh}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
