
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Button } from "@/frontend/components/ui/button";
import { ArrowRight } from "lucide-react";
import JudgmentFleetBanner from "@/frontend/components/JudgmentFleetBanner";

const Index = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Judgment Fleet | Elite Pokémon Team</title>
        <meta 
          name="description" 
          content={translations.siteDescription} 
        />
      </Helmet>
      
      <JudgmentFleetBanner />
      
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">
          {translations.welcomeMessage}
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          {translations.siteDescription}
        </p>
        
        <Button 
          onClick={() => navigate('/home')}
          size="lg"
          className="bg-[#D946EF] hover:bg-[#D946EF]/90 px-8 py-6 text-lg"
        >
          {translations.enterSite}
          <ArrowRight className="ml-2" />
        </Button>
      </main>
    </>
  );
};

export default Index;
