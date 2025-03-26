
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import Hero from "@/frontend/components/Hero";
import Community from "@/frontend/components/Community";
import TopMembers from "@/frontend/components/TopMembers";
import Footer from "@/frontend/components/Footer";
import JudgmentFleetBanner from "@/frontend/components/JudgmentFleetBanner";

const Index = () => {
  const location = useLocation();
  const { translations } = useLanguage();
  
  // Handle scroll to section if coming from other page with state
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      // Clear the state so we don't scroll again on subsequent renders
      window.history.replaceState({}, '');
    }
  }, [location.state]);
  
  return (
    <>
      <Helmet>
        <title>Judgment Fleet | Elite Pokémon Team</title>
        <meta 
          name="description" 
          content="Il meglio del Competitivo Pokemon Italiano."
        />
      </Helmet>
      
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
