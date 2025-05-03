import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useSiteTexts } from '@/services/siteTextsService'; // Remove zustand import
import { databaseService } from '@/services/databaseService'; // Import databaseService
import { TextBlock } from '@/services/databaseService'; // Import TextBlock type from databaseService

type Language = 'en' | 'ru';

// Type for the texts stored in state (key-value dictionary)
type TextMap = Record<string, Pick<TextBlock, 'value_en' | 'value_ru'>>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
  texts: TextMap; // Expose texts if needed elsewhere, though 't' is primary
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language');
    return (savedLang === 'en' || savedLang === 'ru') ? savedLang : 'en';
  });
  
  // State for storing fetched texts as a dictionary
  const [texts, setTexts] = useState<TextMap>({});
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load texts from the database on component mount
  useEffect(() => {
    const loadTexts = async () => {
      setIsLoading(true);
      try {
        const allTextsArray = await databaseService.getAllSiteTexts();
        // Convert array to a dictionary for easier lookup
        const textsMap = allTextsArray.reduce<TextMap>((acc, text) => {
          if (text.key) {
            acc[text.key] = { value_en: text.value_en, value_ru: text.value_ru };
          }
          return acc;
        }, {});
        setTexts(textsMap);
        console.log(`[LanguageContext] Loaded ${Object.keys(textsMap).length} texts.`);
      } catch (error) {
        console.error("[LanguageContext] Failed to load site texts:", error);
        // Keep the state empty or handle error appropriately
      } finally {
        setIsLoading(false);
      }
    };

    loadTexts();
  }, []); // Empty dependency array means run only once on mount

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Updated translation function using the state dictionary
  const t = useCallback((key: string, fallback?: string): string => {
    if (isLoading) {
      // Return placeholder or key during load
      // console.log(`[t] Loading, returning fallback/key for: ${key}`);
      return fallback ?? key;
    }
    const textBlock = texts[key];
    
    // Enhanced check: Ensure textBlock exists AND has the required value
    if (textBlock) {
      const value = language === 'en' ? textBlock.value_en : textBlock.value_ru;
      // Check if the specific language value exists and is not null/undefined
      if (value !== null && value !== undefined) {
          return value;
      } else {
          // If specific language value is missing, try the other language as a fallback
          const fallbackValue = language === 'en' ? textBlock.value_ru : textBlock.value_en;
          if (fallbackValue !== null && fallbackValue !== undefined) {
              // console.warn(`[t] Translation for key '${key}' in '${language}' missing, using fallback language.`);
              return fallbackValue;
          }
      }
    }
    
    // If textBlock doesn't exist, or neither language value exists
    // console.warn(`[t] Translation completely missing for key: ${key}. Returning fallback/key.`);
    return fallback ?? key; // Return fallback or key if not found or empty
  }, [language, texts, isLoading]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      isLoading, // Use the new loading state
      texts // Provide the texts dictionary
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
