import React, { useState, useEffect } from "react";
import { faqsApi } from "@/backend/api";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

const FAQDisplay = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { translations, language } = useLanguage();

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await faqsApi.getActive(); // Changed from getAllActive to getActive
      setFaqs(data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setError("Failed to load FAQs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <section id="faq" className="py-16 px-4 md:px-6 relative z-10 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-display font-bold mb-4"
            >
              {translations.faqSection}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 max-w-2xl mx-auto"
            >
              {translations.faqDescription}
            </motion.p>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <AccordionItem type="single" value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <Skeleton className="h-5 w-full" />
                </AccordionTrigger>
                <AccordionContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </AccordionContent>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="faq" className="py-16 px-4 md:px-6 relative z-10 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {translations.faqSection}
            </h2>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-16 px-4 md:px-6 relative z-10 overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {translations.faqSection} <span className="text-[#D946EF]">{translations.faqSection}</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">{translations.faqDescription}</p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={faq.id}>
              <AccordionTrigger className="font-medium text-white/90">{language === 'it' ? faq.question_it : faq.question_en}</AccordionTrigger>
              <AccordionContent className="text-gray-400">
                {language === 'it' ? faq.answer_it : faq.answer_en}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQDisplay;
