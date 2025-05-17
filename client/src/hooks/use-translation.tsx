import { useContext, useState, useEffect } from "react";
import { I18nContext, I18nContextType, Language, defaultLanguage, getTranslation } from "@/lib/i18n";

// Hook to use translations
export function useTranslation() {
  const context = useContext(I18nContext);
  
  if (!context) {
    // Fallback if used outside provider
    const [language, setLanguage] = useState<Language>(
      localStorage.getItem("language") as Language || defaultLanguage
    );
    
    useEffect(() => {
      localStorage.setItem("language", language);
    }, [language]);
    
    const t = (key: string, params?: Record<string, string>) => 
      getTranslation(language, key, params);
    
    return { language, setLanguage, t };
  }
  
  return context;
}

// Provider component
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    localStorage.getItem("language") as Language || defaultLanguage
  );
  
  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    setLanguageState(lang);
    document.documentElement.lang = lang;
  };
  
  const t = (key: string, params?: Record<string, string>) => 
    getTranslation(language, key, params);
  
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  
  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}
