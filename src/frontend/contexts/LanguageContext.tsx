
import { useLanguage as useOriginalLanguage } from "@/contexts/LanguageContext";

/**
 * Re-exports the original language context for frontend components
 */
export const useLanguage = useOriginalLanguage;
export { LanguageProvider } from "@/contexts/LanguageContext";
