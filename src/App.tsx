import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchOverlay } from './components/SearchOverlay';
import { EnquiryBasketDrawer } from './components/EnquiryBasketDrawer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { KnowledgePage } from './pages/KnowledgePage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { FaqPage } from './pages/FaqPage';
import { EnquiryPage } from './pages/EnquiryPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppShell: React.FC = () => {
  const { loading, settings } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3E7] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <img
          src={settings.logoUrl}
          alt={settings.brandNameEn}
          className="w-24 h-24 object-contain"
        />
        <div className="space-y-1">
          <p className="text-lg font-bold text-[#0D3021]">{settings.brandNameHi}</p>
          <p className="text-xs text-[#708B45]">{settings.taglineHi}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3E7] text-[#0D3021]">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<ProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/knowledge/:slug" element={<ArticleDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/enquiry" element={<EnquiryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
          <Route path="/terms-and-conditions" element={<LegalPage type="terms" />} />
          <Route path="/disclaimer" element={<LegalPage type="disclaimer" />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <SearchOverlay />
      <EnquiryBasketDrawer />
      <MobileStickyBar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}
