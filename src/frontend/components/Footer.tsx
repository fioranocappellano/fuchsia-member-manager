
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Twitter, ExternalLink } from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

const Footer = () => {
  const { translations } = useLanguage();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <footer className="bg-jf-gray/90 border-t border-white/10 pt-16 pb-8 text-white/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {/* Company/Brand */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">
              Judgment<span className="text-[#D946EF]">Fleet</span>
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {translations.footerTagline}
            </p>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com/JudgmentFleet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <Twitter className="h-5 w-5 text-[#D946EF]" />
              </a>
            </div>
          </div>
          
          {/* Links - Site */}
          <div>
            <h4 className="text-white font-semibold mb-4">{translations.siteLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="#top" 
                  className="text-white/70 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('top');
                  }}
                >
                  {translations.home}
                </a>
              </li>
              <li>
                <a 
                  href="#community" 
                  className="text-white/70 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('community');
                  }}
                >
                  {translations.community}
                </a>
              </li>
              <li>
                <a 
                  href="#top-players" 
                  className="text-white/70 hover:text-white transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('top-players');
                  }}
                >
                  {translations.players}
                </a>
              </li>
              <li>
                <Link 
                  to="/best-games" 
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {translations.bestGames}
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {translations.faq}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">{translations.usefulResources}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://play.pokemonshowdown.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors inline-flex items-center"
                >
                  Pokémon Showdown
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.smogon.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors inline-flex items-center"
                >
                  Smogon
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.serebii.net/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors inline-flex items-center"
                >
                  Serebii
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://pikalytics.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors inline-flex items-center"
                >
                  Pikalytics
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/@PokemonSV" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors inline-flex items-center"
                >
                  Official Pokémon Channel
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Links - Community */}
          <div>
            <h4 className="text-white font-semibold mb-4">{translations.communityLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://discord.gg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors inline-flex items-center"
                >
                  Discord
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://twitter.com/JudgmentFleet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors inline-flex items-center"
                >
                  Twitter
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors inline-flex items-center"
                >
                  YouTube
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom - Copyright */}
        <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          <p>© {currentYear} Judgment Fleet. {translations.allRightsReserved}</p>
          <p className="mt-1">{translations.footerDisclaimer}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
