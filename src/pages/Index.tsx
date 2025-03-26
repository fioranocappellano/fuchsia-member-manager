
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import Hero from "@/components/Hero";
import Community from "@/components/Community";
import TopMembers from "@/components/TopMembers";
import Footer from "@/components/Footer";
import JudgmentFleetBanner from "@/components/JudgmentFleetBanner";

const Index = () => {
  const { translations } = useLanguage();
  
  return (
    <>
      <Helmet>
        <title>Judgment Fleet | Elite Pokémon Team</title>
        <meta 
          name="description" 
          content="Il meglio del Competitivo Pokemon Italiano."
        />
      </Helmet>
      
      <JudgmentFleetBanner />
      
      <main>
        <Hero />
        <Community />
        <TopMembers />
      </main>
      <Footer />
    </>
  );
};

export default Index;
