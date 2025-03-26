
import { motion } from "framer-motion";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Button } from "@/frontend/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const { translations } = useLanguage();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section id="top" className="min-h-screen flex flex-col justify-center relative text-white overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0 bg-jf-dark">
        <div className="absolute inset-0 bg-gradient-to-b from-jf-blue/20 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-jf-dark to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 pt-28 pb-20 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight max-w-5xl"
          >
            {translations.heroTitle}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl"
          >
            {translations.heroDescription}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Button 
              onClick={() => scrollToSection('community')}
              className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white px-8 py-6 text-lg"
              size="lg"
            >
              {translations.learnMore}
            </Button>
            <Button 
              onClick={() => scrollToSection('top-players')}
              variant="outline" 
              className="bg-transparent border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
              size="lg"
            >
              {translations.ourPlayers}
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-sm text-gray-400 mb-2">{translations.scrollForMore}</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
