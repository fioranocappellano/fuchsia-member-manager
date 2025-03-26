
import { motion } from 'framer-motion';
import { useLanguage } from '@/frontend/contexts/LanguageContext';

const JudgmentFleetBanner = () => {
  const { translations } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-[#0f1729] to-[#111827] pt-24 pb-16 text-center">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-display font-bold mb-6 text-white"
        >
          Judgment<span className="text-[#D946EF]">Fleet</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto"
        >
          {translations.teamBanner}
        </motion.p>

        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute top-12 right-[10%] w-24 h-24 rounded-full bg-[#D946EF]/30 blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-12 left-[10%] w-32 h-32 rounded-full bg-blue-500/30 blur-3xl"
        />
      </div>
    </div>
  );
};

export default JudgmentFleetBanner;
