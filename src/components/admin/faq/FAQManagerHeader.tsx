
import React from "react";
import { HelpCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { NewFAQ } from "./types";

interface FAQManagerHeaderProps {
  setNewFaq: (faq: NewFAQ) => void;
  setDialogOpen: (open: boolean) => void;
  faqsLength: number;
}

const FAQManagerHeader: React.FC<FAQManagerHeaderProps> = ({
  setNewFaq,
  setDialogOpen,
  faqsLength
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="h-7 w-7 text-[#D946EF]" /> FAQ Management
        </h2>
        <p className="text-muted-foreground mt-1">Manage frequently asked questions</p>
      </div>
      <DialogTrigger asChild>
        <Button 
          className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white font-medium shadow-md shadow-[#D946EF]/20 hover:shadow-lg hover:shadow-[#D946EF]/30 transition-all duration-200"
          onClick={() => {
            setNewFaq({
              question_it: "",
              question_en: "",
              answer_it: "",
              answer_en: "",
              position: faqsLength,
              is_active: true,
            });
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add FAQ
        </Button>
      </DialogTrigger>
    </div>
  );
};

export default FAQManagerHeader;
