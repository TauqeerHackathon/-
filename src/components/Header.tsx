import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, Phone, MessageCircle, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildGeneralEnquiryMessage, buildWhatsAppUrl } from '../shared/whatsapp';

export const Header: React.FC = () => {
  const { lang, setLang, t, settings, basket, setSearchOpen, setBasketOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const whatsappHref = buildWhatsAppUrl(buildGeneralEnquiryMessage(lang), settings.whatsappNumber);

  const navItems = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/about', label: t.nav.about },
    { to: '/products', label: t.nav.products },
    { to: '/knowledge', label: t.nav.knowledge },
    { to: '/gallery', label: t.nav.gallery },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <>
      {/* Slim non-sticky utility bar on desktop for store location, phone, and language controls */}
      <div className="hidden lg:block bg-[#0D3021] text-[#F8F3E7]/90 border-b border-[#C5A15B]/25">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 min-w-0">
            <span className="truncate">
              {lang === 'hi' ? settings.addressHi : settings.addressEn}
            </span>
            <span aria-hidden="true" className="text-[#C5A15B]">·</span>
            <span className="whitespace-nowrap shrink-0">{settings.contactPerson}</span>
            <span aria-hidden="true" className="text-[#C5A15B]">·</span>
            <a
              href={`tel:${settings.phoneRaw}`}
              className="inline-flex items-center gap-1.5 text-[#F8F3E7] hover:text-[#C5A15B] transition-colors whitespace-nowrap shrink-0 tabular-nums"
            >
              <Phone className="w-3 h-3" aria-hidden="true" />
              <span>{settings.phoneDisplay}</span>
            </a>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setBasketOpen(true)}
              className="inline-flex items-center gap-1.5 hover:text-[#C5A15B] transition-colors whitespace-nowrap shrink-0"
              aria-label={t.actions.enquiryBasket}
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {t.actions.enquiryBasket} ({basket.length})
              </span>
            </button>

            <span aria-hidden="true" className="text-[#C5A15B]/50">|</span>

            <div className="inline-flex items-center gap-1" role="group" aria-label="Language switcher">
              <Globe className="w-3.5 h-3.5 text-[#C5A15B] mr-1" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLang('hi')}
                aria-pressed={lang === 'hi'}
                className={`px-1.5 py-0.5 text-xs transition-colors whitespace-nowrap ${
                  lang === 'hi' ? 'text-[#C5A15B] font-semibold underline underline-offset-4' : 'text-[#F8F3E7]/75 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <span aria-hidden="true" className="text-[#F8F3E7]/40">/</span>
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`px-1.5 py-0.5 text-xs transition-colors whitespace-nowrap ${
                  lang === 'en' ? 'text-[#C5A15B] font-semibold underline underline-offset-4' : 'text-[#F8F3E7]/75 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main sticky 3-zone header */}
      <header className="sticky top-0 z-40 bg-[#F8F3E7]/95 backdrop-blur-sm border-b border-[#0D3021]/12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 lg:h-[72px] flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Brand with unaltered official logo */}
          <Link
            to="/"
            className="flex items-center gap-3 min-w-0 shrink-0 focus-visible:outline-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src={settings.logoUrl}
              alt={`${settings.brandNameHi} — ${settings.brandNameEn}`}
              className="h-11 w-11 sm:h-12 sm:w-12 object-contain shrink-0"
            />
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#0D3021] whitespace-nowrap truncate max-w-[175px] sm:max-w-none">
              {lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}
            </span>
          </Link>

          {/* Zone 2: Clean single-line navigation */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    isActive
                      ? 'text-[#174D35] border-[#C5A15B]'
                      : 'text-[#0D3021]/80 border-transparent hover:text-[#174D35] hover:border-[#C5A15B]/50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Primary actions (Search + WhatsApp on desktop; compact utility + menu on mobile) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t.actions.searchButton}
              className="inline-flex items-center justify-center w-10 h-10 text-[#0D3021] hover:text-[#174D35] hover:bg-[#E9E1D2]/70 transition-colors"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Mobile language toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="lg:hidden inline-flex items-center justify-center px-2.5 h-10 text-xs font-semibold text-[#174D35] border border-[#174D35]/20 hover:bg-[#E9E1D2]/60 whitespace-nowrap"
              aria-label={lang === 'hi' ? 'Switch language to English' : 'भाषा हिन्दी में बदलें'}
            >
              {lang === 'hi' ? 'EN' : 'हिन्दी'}
            </button>

            {/* Mobile basket button */}
            <button
              type="button"
              onClick={() => setBasketOpen(true)}
              aria-label={`${t.actions.enquiryBasket} (${basket.length})`}
              className="lg:hidden relative inline-flex items-center justify-center w-10 h-10 text-[#0D3021] hover:bg-[#E9E1D2]/70"
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {basket.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-[#174D35] text-[#F8F3E7] text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {basket.length}
                </span>
              )}
            </button>

            {/* Primary Desktop CTA */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-2 py-2.5 px-4 text-xs font-semibold bg-[#174D35] text-[#F8F3E7] hover:bg-[#0D3021] transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-[#C5A15B] shrink-0" aria-hidden="true" />
              <span>{t.actions.whatsappEnquiry}</span>
            </a>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-[#0D3021] hover:bg-[#E9E1D2]/70"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-[#0D3021]/60"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-[#F8F3E7] shadow-xl flex flex-col overflow-y-auto">
            <div className="p-5 border-b border-[#0D3021]/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={settings.logoUrl}
                  alt={settings.brandNameEn}
                  className="h-12 w-12 object-contain shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0D3021] truncate">
                    {lang === 'hi' ? settings.brandNameHi : settings.brandNameEn}
                  </p>
                  <p className="text-xs text-[#708B45] truncate">
                    {lang === 'hi' ? settings.traditionalIdentityHi : settings.traditionalIdentityEn}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="w-10 h-10 inline-flex items-center justify-center text-[#0D3021]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="p-5 flex flex-col gap-1">
              {[
                ...navItems,
                { to: '/categories', label: t.nav.categories },
                { to: '/faq', label: t.nav.faq },
                { to: '/enquiry', label: t.nav.enquiry },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-3 text-base font-medium border-b border-[#0D3021]/8 transition-colors ${
                      isActive ? 'text-[#174D35] bg-[#E9E1D2]/60' : 'text-[#0D3021]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto p-5 bg-[#E9E1D2]/50 border-t border-[#0D3021]/10 space-y-3">
              <div className="text-xs text-[#0D3021]/80 space-y-1">
                <p className="font-semibold text-[#0D3021]">{settings.contactPerson}</p>
                <p>{lang === 'hi' ? settings.addressHi : settings.addressEn}</p>
                <a
                  href={`tel:${settings.phoneRaw}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#174D35] pt-1 tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{settings.phoneDisplay}</span>
                </a>
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold bg-[#174D35] text-[#F8F3E7]"
              >
                <MessageCircle className="w-4 h-4 text-[#C5A15B]" aria-hidden="true" />
                <span>{t.actions.whatsappEnquiry}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
