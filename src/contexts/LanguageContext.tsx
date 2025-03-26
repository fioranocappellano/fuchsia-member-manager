
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { it } from "../locales/it";
import { en } from "../locales/en";

interface LanguageContextProps {
  locale: string;
  translations: any;
  setLocale: (locale: string) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  locale: "en",
  translations: en,
  setLocale: () => {},
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState(localStorage.getItem("locale") || "en");
  const [translations, setTranslations] = useState(locale === "it" ? it : en);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("locale", locale);
    setTranslations(locale === "it" ? it : en);
    
    // Update the document's lang attribute
    document.documentElement.lang = locale;

    // Only update URL if we're ready to navigate
    if (navigate && location) {
      try {
        // Get the current path without the locale prefix if any
        let currentPath = location.pathname;
        if (currentPath.startsWith(`/${locale}/`)) {
          currentPath = currentPath.substring(locale.length + 1);
        } else if (currentPath === `/${locale}`) {
          currentPath = '/';
        }
        
        // Build the new path with the locale
        const newPathname = currentPath === '/' ? `/${locale}` : `/${locale}${currentPath}`;
        navigate(newPathname, { replace: true });
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  }, [locale, navigate, location]);

  return (
    <LanguageContext.Provider value={{ locale, translations, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
