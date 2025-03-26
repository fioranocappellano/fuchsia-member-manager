
import { useLanguage } from "@/contexts/LanguageContext";

const JudgmentFleetBanner = () => {
  const { translations } = useLanguage();
  
  return (
    <div className="bg-[#D946EF]/10 text-center py-2 px-4">
      <p className="text-sm text-white">
        {translations.judgmentFleetBanner || 'Welcome to Judgment Fleet - Elite Pokémon Tournament Team'}
      </p>
    </div>
  );
};

export default JudgmentFleetBanner;
