
import React from 'react';
import { useLanguage } from '@/frontend/contexts/LanguageContext';

/**
 * Banner component for the Judgment Fleet team
 * Displays at the top of the landing page
 */
const JudgmentFleetBanner: React.FC = () => {
  const { translations } = useLanguage();
  
  return (
    <div className="bg-[#7209B7]/80 backdrop-blur-sm border-b border-white/10 py-2 text-center text-white">
      <p className="text-sm font-medium">
        {translations.judgmentFleetBanner || 'Welcome to Judgment Fleet - Elite Pokémon Tournament Team'}
      </p>
    </div>
  );
};

export default JudgmentFleetBanner;
