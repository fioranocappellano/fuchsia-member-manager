
import React from "react";
import { FAQ } from "./types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowUp, ArrowDown, PenSquare, Trash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface FAQCardProps {
  faq: FAQ;
  index: number;
  faqsLength: number;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, is_active: boolean) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

const FAQCard: React.FC<FAQCardProps> = ({
  faq,
  index,
  faqsLength,
  onEdit,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown
}) => {
  return (
    <Card key={faq.id} className={`border ${!faq.is_active ? "border-white/5 bg-black/40" : "border-white/10 bg-black/60"} backdrop-blur-sm hover:shadow-md hover:shadow-[#D946EF]/5 transition-all duration-300`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg text-white group-hover:text-white transition-colors">
                {faq.question_en}
              </CardTitle>
              {!faq.is_active && (
                <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                  Inactive
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1 text-gray-400">
              Position: {faq.position}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#D946EF]/10"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMoveDown(index)}
              disabled={index === faqsLength - 1}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#D946EF]/10"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Switch
              id={`active-${faq.id}`}
              checked={faq.is_active}
              onCheckedChange={() => onToggleActive(faq.id, faq.is_active)}
              className="data-[state=checked]:bg-[#D946EF]"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(faq)}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#D946EF]/10"
            >
              <PenSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(faq.id)}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-red-500/20"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-1 pb-4">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm font-medium text-[#D946EF] mb-1">Domanda:</p>
            <p className="text-sm text-gray-300">{faq.question_it}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#D946EF] mb-1">Risposta:</p>
            <p className="text-sm text-gray-300 line-clamp-2">
              {faq.answer_it.length > 100 ? `${faq.answer_it.substring(0, 100)}...` : faq.answer_it}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FAQCard;
