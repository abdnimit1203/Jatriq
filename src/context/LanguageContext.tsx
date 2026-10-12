import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, BilingualText } from '../types';
import { siteConfig } from '../config/siteConfig';
import { en } from '../locales/en';
import { bn } from '../locales/bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
  formatNumber: (n: number | string) => string;
  formatPrice: (amount: number) => string;
  getText: (bilingual: BilingualText | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('jatriq_preferred_language');
      if (saved === 'bn' || saved === 'en') {
        return saved;
      }
    } catch {
      // localStorage may fail in restricted sandboxes
    }
    return siteConfig.defaultLanguage;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('jatriq_preferred_language', lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const formatNumber = (n: number | string): string => {
    const str = String(n);
    if (language === 'en') return str;
    return str.replace(/[0-9]/g, (w) => banglaDigits[parseInt(w, 10)]);
  };

  const formatPrice = (amount: number): string => {
    const formatted = amount.toLocaleString('en-US');
    if (language === 'bn') {
      const bnPrice = formatted.replace(/[0-9]/g, (w) => banglaDigits[parseInt(w, 10)]);
      return `${siteConfig.currency.symbol} ${bnPrice}`;
    }
    return `${siteConfig.currency.symbol} ${formatted}`;
  };

  const getText = (bilingual: BilingualText | undefined): string => {
    if (!bilingual) return '';
    return language === 'bn' ? bilingual.bn : bilingual.en;
  };

  const t = language === 'bn' ? bn : en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatNumber,
        formatPrice,
        getText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
