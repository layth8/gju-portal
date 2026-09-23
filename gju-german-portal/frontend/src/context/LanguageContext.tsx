import React, { createContext, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

export type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();

  const currentLang = (i18n.language?.startsWith("ar") ? "ar" : "en") as Language;
  const isRTL = currentLang === "ar";

  useEffect(() => {
    localStorage.setItem("gju-language", currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [currentLang, isRTL]);

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === "en" ? "ar" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language: currentLang,
        setLanguage,
        toggleLanguage,
        isRTL,
        t: (key: string, options?: any) => t(key, options) as string,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
