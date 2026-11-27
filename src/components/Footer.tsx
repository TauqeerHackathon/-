import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildGeneralEnquiryMessage, buildWhatsAppUrl } from '../shared/whatsapp';
import { sanitizeExternalUrl } from '../shared/validation';

export const Footer: React.FC = () => {
  const { lang, t, settings, categories } = useApp();
  const whatsappHref = buildWhatsAppUrl(buildGeneralEnquiryMessage(lang), settings.whatsappNumber);

  const featuredFooterCategories = categories.filter((c) => c.slug !== 'all-products').slice(0, 7);

  // Only display social links once authentic verified URLs are configured in Admin Settings
  const verifiedSocials = [
    { label: 'Facebook', url: sanitizeExternalUrl(settings.socialLinks.facebook) },
    { label: 'Instagram', url: sanitizeExternalUrl(settings.socialLinks.instagram) },
    { label: 'YouTube', url: sanitizeExternalUrl(settings.socialLinks.youtube) },
    { label: 'Google Business Profile', url: sanitizeExternalUrl(settings.socialLinks.googleBusiness) },
  ].filter((s) => Boolean(s.url));

  return (
    <footer className="bg-[#0D3021] text-[#F8F3E7] border-t border-[#C5A15B]/30 pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={settings.logoUrl}
                alt={`${settings.brandNameHi} — ${settings.brandNameEn}`}
                className="h-16 w-16 object-contain shrink-0 bg-[#F8F3E7] rounded-full p-0.5"
              />
              <div>
                <p className="text-xl font-bold text-[#F8F3E7] leading-tight">
                  {settings.brandNameHi}
                </p>
                <p className="text-sm text-[#C5A15B] font-medium mt-0.5">
                  {settings.brandNameEn}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#F8F3E7]/85 font-medium">
              {lang === 'hi' ? settings.traditionalIdentityHi : settings.traditionalIdentityEn}
            </p>
            <p className="text-sm text-[#F8F3E7]/75 leading-relaxed">
              {lang === 'hi' ? settings.taglineHi : settings.taglineEn}
            </p>

            {verifiedSocials.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#C5A15B]">
                {verifiedSocials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-sm font-semibold text-[#C5A15B] tracking-wide">
              {t.footer.categoriesHeading}
            </h2>
            <ul className="space-y-2 text-sm text-[#F8F3E7]/80">
              {featuredFooterCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/categories/${cat.slug}`}
                    className="hover:text-[#C5A15B] transition-colors"
                  >
                    {lang === 'hi' ? cat.nameHi : cat.nameEn}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/categories"
                  className="text-[#C5A15B] hover:underline font-medium"
                >
                  {t.actions.viewAllCategories}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold text-[#C5A15B] tracking-wide">
              {t.footer.quickLinksHeading}
            </h2>
            <ul className="space-y-2 text-sm text-[#F8F3E7]/80">
              <li><Link to="/" className="hover:text-[#C5A15B] transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/about" className="hover:text-[#C5A15B] transition-colors">{t.nav.about}</Link></li>
              <li><Link to="/products" className="hover:text-[#C5A15B] transition-colors">{t.nav.products}</Link></li>
              <li><Link to="/knowledge" className="hover:text-[#C5A15B] transition-colors">{t.nav.knowledge}</Link></li>
              <li><Link to="/gallery" className="hover:text-[#C5A15B] transition-colors">{t.nav.gallery}</Link></li>
              <li><Link to="/faq" className="hover:text-[#C5A15B] transition-colors">{t.nav.faq}</Link></li>
              <li><Link to="/enquiry" className="hover:text-[#C5A15B] transition-colors">{t.nav.enquiry}</Link></li>
              <li><Link to="/contact" className="hover:text-[#C5A15B] transition-colors">{t.nav.contact}</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-sm font-semibold text-[#C5A15B] tracking-wide">
              {t.footer.contactHeading}
            </h2>
            <div className="space-y-3 text-sm text-[#F8F3E7]/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A15B] shrink-0 mt-1" aria-hidden="true" />
                <span>{lang === 'hi' ? settings.addressHi : settings.addressEn}</span>
              </div>
              <p className="text-[#F8F3E7]/90">
                <span className="text-[#F8F3E7]/65">{t.labels.contactPerson}: </span>
                <span className="font-medium">{settings.contactPerson}</span>
              </p>
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex items-center gap-2 text-[#F8F3E7] hover:text-[#C5A15B] font-medium tabular-nums"
              >
                <Phone className="w-4 h-4 text-[#C5A15B]" aria-hidden="true" />
                <span>{settings.phoneDisplay}</span>
              </a>
              <div className="pt-1">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-2.5 px-4 text-xs font-semibold bg-[#174D35] border border-[#C5A15B]/45 text-[#F8F3E7] hover:bg-[#174D35]/80 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A15B]" aria-hidden="true" />
                  <span>{t.actions.whatsappEnquiry}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Attribution Bar */}
        <div className="mt-12 pt-6 border-t border-[#F8F3E7]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#F8F3E7]/70">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy-policy" className="hover:text-[#C5A15B] transition-colors">
              {t.footer.privacyPolicy}
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms-and-conditions" className="hover:text-[#C5A15B] transition-colors">
              {t.footer.termsConditions}
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/disclaimer" className="hover:text-[#C5A15B] transition-colors">
              {t.footer.medicalDisclaimer}
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="hover:text-[#C5A15B] transition-colors">
              {t.nav.admin}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              © {new Date().getFullYear()} {settings.brandNameEn}. {t.footer.rightsReserved}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[#C5A15B]">{settings.developerAttribution}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
