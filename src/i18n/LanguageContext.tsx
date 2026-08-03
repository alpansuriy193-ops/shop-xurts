import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import type { Dictionary, Language, TranslationMap } from "./dict/types";
import { home } from "./dict/home";
import { catalog } from "./dict/catalog";
import { product } from "./dict/product";
import { checkout } from "./dict/checkout";
import { account } from "./dict/account";
import { about } from "./dict/about";

export type { Language };

const common: Dictionary = {
  id: {
    collections: "Koleksi", shopAll: "Belanja Semua", about: "Tentang Kami", search: "Cari produk",
    wishlist: "Favorit", item: "produk", items: "produk", wishlistEmpty: "Daftar favoritmu masih kosong",
    wishlistDescription: "Simpan barang favorit dari parfum, fashion, sepatu, aksesoris, hingga elektronik untuk dilihat lagi nanti.",
    browseProducts: "Lihat Produk", continueShopping: "Lanjut Belanja", shoppingBag: "Tas Belanja", language: "Bahasa",
    freeShipping: "Gratis ongkir ke seluruh dunia untuk pesanan di atas $500",
    discount: "Pakai kode XURTS10 — diskon 10% untuk semua kategori",
    newUser: "Pengguna baru? Kode NEWUSER20 potongan 20% di pesanan pertama",
    dismissAnnouncement: "Tutup pengumuman", stayConnected: "Tetap Terhubung", yourEmail: "Email kamu",
    explore: "Jelajahi", ourStory: "Cerita Kami", support: "Bantuan", shippingReturns: "Pengiriman & Pengembalian",
    careGuide: "Panduan Perawatan", contact: "Kontak", rightsReserved: "Hak cipta dilindungi.",
    privacy: "Kebijakan Privasi", terms: "Syarat Layanan", cookies: "Kebijakan Cookie",
    footerDescription: "Parfum, fashion, sepatu, aksesoris, dan elektronik pilihan untuk gaya hidup modern.",
  },
  en: {
    collections: "Collections", shopAll: "Shop All", about: "About", search: "Search products",
    wishlist: "Wishlist", item: "item", items: "items", wishlistEmpty: "Your wishlist is empty",
    wishlistDescription: "Save your favorite perfumes, fashion, shoes, accessories, and electronics to view later.",
    browseProducts: "Browse Products", continueShopping: "Continue Shopping", shoppingBag: "Shopping Bag", language: "Language",
    freeShipping: "Free worldwide shipping on orders over $500", discount: "Use code XURTS10 — 10% off every category",
    newUser: "New here? Use NEWUSER20 for 20% off your first order", dismissAnnouncement: "Dismiss announcement",
    stayConnected: "Stay Connected", yourEmail: "Your email", explore: "Explore", ourStory: "Our Story",
    support: "Support", shippingReturns: "Shipping & Returns", careGuide: "Care Guide", contact: "Contact",
    rightsReserved: "All rights reserved.", privacy: "Privacy Policy", terms: "Terms of Service", cookies: "Cookie Policy",
    footerDescription: "Selected perfumes, fashion, shoes, accessories, and electronics for modern living.",
  },
  zh: {
    collections: "系列", shopAll: "选购全部", about: "关于我们", search: "搜索商品", wishlist: "心愿单", item: "件商品", items: "件商品",
    wishlistEmpty: "你的心愿单还是空的", wishlistDescription: "收藏心仪的香水、时尚单品、鞋履、配饰和电子产品，方便稍后查看。",
    browseProducts: "浏览商品", continueShopping: "继续购物", shoppingBag: "购物袋", language: "语言",
    freeShipping: "订单满 $500 全球免运费", discount: "使用代码 XURTS10，全品类享 9 折优惠",
    newUser: "新用户？首单使用 NEWUSER20 立减 20%", dismissAnnouncement: "关闭公告", stayConnected: "保持联系",
    yourEmail: "你的邮箱", explore: "探索", ourStory: "我们的故事", support: "支持", shippingReturns: "配送与退货",
    careGuide: "护理指南", contact: "联系我们", rightsReserved: "版权所有。", privacy: "隐私政策", terms: "服务条款",
    cookies: "Cookie 政策", footerDescription: "为现代生活精心挑选的香水、时尚单品、鞋履、配饰和电子产品。",
  },
  ru: {
    collections: "Коллекции", shopAll: "Все товары", about: "О нас", search: "Поиск товаров", wishlist: "Избранное", item: "товар", items: "товаров",
    wishlistEmpty: "Ваш список избранного пуст", wishlistDescription: "Сохраняйте любимые ароматы, одежду, обувь, аксессуары и электронику, чтобы вернуться к ним позже.",
    browseProducts: "Смотреть товары", continueShopping: "Продолжить покупки", shoppingBag: "Корзина", language: "Язык",
    freeShipping: "Бесплатная доставка по всему миру для заказов от $500", discount: "Используйте код XURTS10 — скидка 10% на все категории",
    newUser: "Впервые у нас? Код NEWUSER20 даст скидку 20% на первый заказ", dismissAnnouncement: "Закрыть объявление",
    stayConnected: "Оставайтесь на связи", yourEmail: "Ваш email", explore: "Обзор", ourStory: "Наша история",
    support: "Поддержка", shippingReturns: "Доставка и возврат", careGuide: "Уход", contact: "Контакты",
    rightsReserved: "Все права защищены.", privacy: "Политика конфиденциальности", terms: "Условия обслуживания",
    cookies: "Политика cookie", footerDescription: "Отборные ароматы, одежда, обувь, аксессуары и электроника для современного образа жизни.",
  },
};

const dictionaries: Dictionary[] = [common, home, catalog, product, checkout, account, about];

const merge = (language: Language): TranslationMap =>
  Object.assign({}, ...dictionaries.map((dictionary) => dictionary[language] ?? {}));

const translations: Record<Language, TranslationMap> = {
  id: merge("id"),
  en: merge("en"),
  zh: merge("zh"),
  ru: merge("ru"),
};

const labels: Record<Language, string> = { id: "Indonesia", en: "English", zh: "中文", ru: "Русский" };
const STORAGE_KEY = "xurts_language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  languageLabel: (language: Language) => string;
};
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem(STORAGE_KEY) as Language) || "id");
  useEffect(() => { localStorage.setItem(STORAGE_KEY, language); document.documentElement.lang = language; }, [language]);
  const t = (key: string, vars?: Record<string, string | number>) => {
    const template = translations[language][key] || translations.en[key] || key;
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match
    );
  };
  return <LanguageContext.Provider value={{ language, setLanguage, t, languageLabel: (value) => labels[value] }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
};
