
import React from "react";
import { FAQ } from "./types";
import { HelpCircle, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FAQCard from "./FAQCard";

interface FAQListProps {
  faqs: FAQ[];
  loading: boolean;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, is_active: boolean) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onAddFirstFAQ: () => void;
}

const FAQList: React.FC<FAQListProps> = ({
  faqs,
  loading,
  onEdit,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
  onAddFirstFAQ
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#D946EF]" />
          <p className="text-gray-400">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
        <HelpCircle className="h-12 w-12 text-[#D946EF]/50 mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2 text-white">No FAQs Found</h3>
        <p className="text-gray-500 mb-6">Add your first FAQ using the button above.</p>
        <Button 
          className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white shadow-md shadow-[#D946EF]/20 hover:shadow-lg transition-all duration-200"
          onClick={onAddFirstFAQ}
        >
          <Plus className="mr-2 h-4 w-4" /> Add First FAQ
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <FAQCard
          key={faq.id}
          faq={faq}
          index={index}
          faqsLength={faqs.length}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      ))}
    </div>
  );
};

export default FAQList;
