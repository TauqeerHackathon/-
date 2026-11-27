import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noIndex?: boolean;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath,
  noIndex = false,
  ogImage,
  jsonLd,
}) => {
  const { settings } = useApp();

  useEffect(() => {
    document.title = title;
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${canonicalPath ?? window.location.pathname}`;
    const resolvedOgImage = ogImage
      ? ogImage.startsWith('http')
        ? ogImage
        : `${origin}${ogImage}`
      : `${origin}${settings.logoUrl}`;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noIndex ? 'noindex, follow' : 'index, follow');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', resolvedOgImage);
    upsertMeta('property', 'og:site_name', settings.brandNameEn);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', resolvedOgImage);

    let canonicalEl = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    const scriptId = 'kab-structured-data';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const baseOrganization = {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'Store'],
      name: settings.brandNameEn,
      alternateName: [settings.brandNameHi, settings.traditionalIdentityHi],
      description: settings.seoDefaultDescription,
      url: origin,
      logo: `${origin}${settings.logoUrl}`,
      image: `${origin}${settings.logoUrl}`,
      telephone: settings.phoneDisplay,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Kheria Mod Chauraha',
        addressLocality: 'Agra',
        addressRegion: 'Uttar Pradesh',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: settings.phoneDisplay,
        name: settings.contactPerson,
        availableLanguage: ['Hindi', 'English'],
      },
    };

    const payload = jsonLd
      ? Array.isArray(jsonLd)
        ? [baseOrganization, ...jsonLd]
        : [baseOrganization, jsonLd]
      : baseOrganization;

    scriptEl.textContent = JSON.stringify(payload).replace(/</g, '\\u003c');
  }, [title, description, canonicalPath, noIndex, ogImage, jsonLd, settings]);

  return null;
};
