import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_ARTICLES } from '../shared/articlesData';
import { OFFICIAL_PRODUCTS } from '../shared/catalogueData';
import { INITIAL_CATEGORIES } from '../shared/categories';
import { INITIAL_FAQS, INITIAL_GALLERY, OFFICIAL_SETTINGS } from '../shared/defaults';
import { TRANSLATIONS, type TranslationStrings } from '../shared/translations';
import type {
  Article,
  BootstrapPayload,
  BusinessSettings,
  Category,
  EnquiryBasketItem,
  FaqItem,
  GalleryItem,
  Language,
  Product,
} from '../shared/types';

interface AppContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationStrings;
  settings: BusinessSettings;
  categories: Category[];
  products: Product[];
  articles: Article[];
  gallery: GalleryItem[];
  faqs: FaqItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
  basket: EnquiryBasketItem[];
  addToBasket: (item: EnquiryBasketItem) => void;
  updateBasketQuantity: (productId: string, variantName: string | undefined, quantityNote: string) => void;
  removeFromBasket: (productId: string, variantName?: string) => void;
  clearBasket: () => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isBasketOpen: boolean;
  setBasketOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('hi');
  const [settings, setSettings] = useState<BusinessSettings>(OFFICIAL_SETTINGS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(OFFICIAL_PRODUCTS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [loading, setLoading] = useState<boolean>(true);
  const [basket, setBasket] = useState<EnquiryBasketItem[]>([]);
  const [isSearchOpen, setSearchOpen] = useState<boolean>(false);
  const [isBasketOpen, setBasketOpen] = useState<boolean>(false);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    document.documentElement.lang = next;
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === 'hi' ? 'en' : 'hi';
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (!res.ok) throw new Error('Failed to load catalogue');
      const data = (await res.json()) as BootstrapPayload;
      if (data.settings) setSettings(data.settings);
      if (Array.isArray(data.categories) && data.categories.length > 0) setCategories(data.categories);
      if (Array.isArray(data.products) && data.products.length > 0) setProducts(data.products);
      if (Array.isArray(data.articles)) setArticles(data.articles);
      if (Array.isArray(data.gallery)) setGallery(data.gallery);
      if (Array.isArray(data.faqs)) setFaqs(data.faqs);
    } catch {
      // Fallback safely to embedded official catalogue if offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = 'hi';
    void refreshData();
  }, [refreshData]);

  // Keyboard shortcut Cmd/Ctrl+K for bilingual search overlay
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setBasketOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const addToBasket = useCallback((item: EnquiryBasketItem) => {
    setBasket((prev) => {
      const idx = prev.findIndex(
        (b) => b.productId === item.productId && (b.variantName || '') === (item.variantName || '')
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantityNote: item.quantityNote || next[idx].quantityNote,
        };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const updateBasketQuantity = useCallback(
    (productId: string, variantName: string | undefined, quantityNote: string) => {
      setBasket((prev) =>
        prev.map((item) =>
          item.productId === productId && (item.variantName || '') === (variantName || '')
            ? { ...item, quantityNote }
            : item
        )
      );
    },
    []
  );

  const removeFromBasket = useCallback((productId: string, variantName?: string) => {
    setBasket((prev) =>
      prev.filter((item) => !(item.productId === productId && (item.variantName || '') === (variantName || '')))
    );
  }, []);

  const clearBasket = useCallback(() => setBasket([]), []);

  const value = useMemo<AppContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: TRANSLATIONS[lang],
      settings,
      categories,
      products,
      articles,
      gallery,
      faqs,
      loading,
      refreshData,
      basket,
      addToBasket,
      updateBasketQuantity,
      removeFromBasket,
      clearBasket,
      isSearchOpen,
      setSearchOpen,
      isBasketOpen,
      setBasketOpen,
    }),
    [
      lang,
      setLang,
      toggleLang,
      settings,
      categories,
      products,
      articles,
      gallery,
      faqs,
      loading,
      refreshData,
      basket,
      addToBasket,
      updateBasketQuantity,
      removeFromBasket,
      clearBasket,
      isSearchOpen,
      isBasketOpen,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
