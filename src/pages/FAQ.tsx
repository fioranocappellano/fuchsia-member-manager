
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import { Twitter } from "lucide-react";
import FAQDisplay from "../components/FAQDisplay";

const FAQ = () => {
  const [visible, setVisible] = useState(false);
  const { translations, locale } = useLanguage();

  useEffect(() => {
    // Always scroll to top when mounting
    window.scrollTo(0, 0);
  }, [locale]);

  return (
    <div className="min-h-screen bg-jf-dark text-white relative">
      <Navbar />
      <main className="container mx-auto px-4 py-24 md:py-32">
        <FAQDisplay />
        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">{translations.otherQuestions}</p>
          <Button 
            className="bg-[#D946EF] hover:bg-[#D946EF]/90"
            onClick={() => window.open('https://twitter.com/JudgmentFleet', '_blank')}
          >
            <Twitter size={18} className="mr-2" />
            {translations.contactTwitter}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
