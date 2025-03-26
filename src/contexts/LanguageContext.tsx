
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

    // Update the URL to include the locale
    const newPathname = `/${locale}${location.pathname}`;
    navigate(newPathname, { replace: true });
  }, [locale, navigate, location]);

  return (
    <LanguageContext.Provider value={{ locale, translations, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
