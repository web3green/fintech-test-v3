import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSiteTexts } from '@/services/siteTextsService';

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'en' || savedLang === 'ru') ? savedLang : 'en';
  });

  const { getTextByKey, isHydrated } = useSiteTexts();

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const text = getTextByKey(key);
    if (text) {
      return text.content[language];
    }
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      isLoading: !isHydrated 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
