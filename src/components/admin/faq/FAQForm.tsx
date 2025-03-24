
import React from "react";
import { FAQ, NewFAQ } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";

interface FAQFormProps {
  editingFaq: FAQ | null;
  newFaq: NewFAQ;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onChange: (values: Partial<NewFAQ>) => void;
}

const FAQForm: React.FC<FAQFormProps> = ({
  editingFaq,
  newFaq,
  isSubmitting,
  onCancel,
  onSubmit,
  onChange
}) => {
  const faq = editingFaq || newFaq;
  
  return (
    <div className="grid gap-5 py-4">
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="question_it" className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
            Question (Italian)
          </Label>
          <Input
            id="question_it"
            value={faq.question_it}
            onChange={(e) => onChange({ question_it: e.target.value })}
            className="bg-black/60 backdrop-blur-sm border-white/10 text-white shadow-inner shadow-black/20 focus-visible:ring-[#D946EF]"
            placeholder="Inserisci la domanda in italiano"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="question_en" className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
            Question (English)
          </Label>
          <Input
            id="question_en"
            value={faq.question_en}
            onChange={(e) => onChange({ question_en: e.target.value })}
            className="bg-black/60 backdrop-blur-sm border-white/10 text-white shadow-inner shadow-black/20 focus-visible:ring-[#D946EF]"
            placeholder="Enter question in English"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="answer_it" className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
            Answer (Italian) - Markdown
          </Label>
          <Textarea
            id="answer_it"
            rows={8}
            value={faq.answer_it}
            onChange={(e) => onChange({ answer_it: e.target.value })}
            placeholder="Supporta la formattazione markdown"
            className="min-h-[180px] bg-black/60 backdrop-blur-sm border-white/10 text-white shadow-inner shadow-black/20 focus-visible:ring-[#D946EF]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="answer_en" className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
            Answer (English) - Markdown
          </Label>
          <Textarea
            id="answer_en"
            rows={8}
            value={faq.answer_en}
            onChange={(e) => onChange({ answer_en: e.target.value })}
            placeholder="Supports markdown formatting"
            className="min-h-[180px] bg-black/60 backdrop-blur-sm border-white/10 text-white shadow-inner shadow-black/20 focus-visible:ring-[#D946EF]"
          />
        </div>
      </div>
      {!editingFaq && (
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="position" className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
              Position
            </Label>
            <Input
              id="position"
              type="number"
              value={faq.position}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                onChange({ position: value });
              }}
              className="bg-black/60 backdrop-blur-sm border-white/10 text-white shadow-inner shadow-black/20 focus-visible:ring-[#D946EF]"
            />
          </div>
          <div className="flex items-center space-x-2 pt-8">
            <Switch
              id="is_active"
              checked={faq.is_active}
              onCheckedChange={(checked) => onChange({ is_active: checked })}
              className="data-[state=checked]:bg-[#D946EF]"
            />
            <Label htmlFor="is_active" className="text-white">Active</Label>
          </div>
        </div>
      )}
      {editingFaq && (
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            id="is_active"
            checked={faq.is_active}
            onCheckedChange={(checked) => onChange({ is_active: checked })}
            className="data-[state=checked]:bg-[#D946EF]"
          />
          <Label htmlFor="is_active" className="text-white">Active</Label>
        </div>
      )}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} 
          className="border-[#D946EF]/50 text-[#D946EF] hover:bg-[#D946EF]/10">
          Cancel
        </Button>
        <Button 
          type="button" 
          className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white shadow-md shadow-[#D946EF]/20 hover:shadow-lg transition-all duration-200"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editingFaq ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>{editingFaq ? "Update FAQ" : "Add FAQ"}</>
          )}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default FAQForm;
