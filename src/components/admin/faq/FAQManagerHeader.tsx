
import React from "react";
import { HelpCircle, Plus, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NewFAQ } from "@/frontend/types/api";
import AddFAQForm from "../forms/AddFAQForm";

interface FAQManagerHeaderProps {
  onAddFAQ?: () => void;
  reordering: boolean;
  setDialogOpen: (open: boolean) => void;
  toggleReordering: () => void;
  handleAddFAQ?: () => Promise<void>;
}

const FAQManagerHeader: React.FC<FAQManagerHeaderProps> = ({
  onAddFAQ,
  reordering,
  setDialogOpen,
  toggleReordering,
  handleAddFAQ,
}) => {
  const handleAddClick = handleAddFAQ || onAddFAQ || (() => {});

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <HelpCircle size={24} className="text-[#D946EF]" /> FAQ Management
      </h2>
      <div className="flex gap-3">
        <Button 
          className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white font-medium shadow-md shadow-[#D946EF]/20 hover:shadow-lg hover:shadow-[#D946EF]/30 transition-all duration-200"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add FAQ
        </Button>
        <Button 
          onClick={toggleReordering}
          className={`${reordering ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black/30 hover:bg-black/50'} 
            border border-white/10 text-white transition-all duration-200`}
        >
          <ArrowDownUp className="mr-2 h-4 w-4" />
          {reordering ? 'Done Reordering' : 'Reorder FAQs'}
        </Button>
      </div>
    </div>
  );
};

export default FAQManagerHeader;
