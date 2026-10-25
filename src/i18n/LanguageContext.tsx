import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  translations,
  Translations,
  translateStatus,
  translateCategory,
  translateRole
} from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  translateStatus: (status: string) => string;
  translateCategory: (cat: string) => string;
  translateRole: (role: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('smartwaste_lang') as Language;
    return saved === 'kn' || saved === 'hi' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('smartwaste_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    translateStatus: (status: string) => translateStatus(status, language),
    translateCategory: (cat: string) => translateCategory(cat, language),
    translateRole: (role: string) => translateRole(role, language)
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
