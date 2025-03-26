
import React from "react";
import { FAQ } from "@/frontend/types/api";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Edit, Trash2, EyeOff, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FAQListProps {
  faqs: FAQ[];
  loading: boolean;
  reordering: boolean;
  onEdit: (faq: FAQ) => void;
  onDelete: (id: string) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  onMoveItem?: (index: number, direction: 'up' | 'down') => void;
  moveItem?: (index: number, direction: 'up' | 'down') => void;
}

const FAQList: React.FC<FAQListProps> = ({
  faqs,
  loading,
  reordering,
  onEdit,
  onDelete,
  onToggleActive,
  onMoveItem,
  moveItem
}) => {
  const handleMove = moveItem || onMoveItem || (() => {});

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D946EF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <Card key={faq.id} className="bg-black/30 border-white/10 overflow-hidden shadow-lg">
          <CardContent className="p-4">
            <div className="mb-1 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-white">
                    {faq.question_en}
                  </h3>
                  <Badge 
                    variant={faq.is_active ? "default" : "outline"}
                    className={`ml-2 ${faq.is_active ? 'bg-green-600' : 'text-gray-400 border-gray-400'}`}
                  >
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-400 italic mt-1">
                  {faq.question_it}
                </div>
              </div>
              
              {reordering && (
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 rounded-full bg-blue-900/30 hover:bg-blue-800/50"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === faqs.length - 1}
                    className="h-8 w-8 rounded-full bg-blue-900/30 hover:bg-blue-800/50"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-[#D946EF] mb-1">Answer (EN):</div>
                <div className="text-sm text-gray-300 line-clamp-3">{faq.answer_en}</div>
              </div>
              <div>
                <div className="text-xs text-[#D946EF] mb-1">Risposta (IT):</div>
                <div className="text-sm text-gray-300 line-clamp-3">{faq.answer_it}</div>
              </div>
            </div>
          </CardContent>
          
          {!reordering && (
            <CardFooter className="bg-black/20 p-3 flex justify-end space-x-2">
              {onToggleActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleActive(faq.id, faq.is_active)}
                  className="text-gray-300 hover:text-white"
                >
                  {faq.is_active ? (
                    <EyeOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1" />
                  )}
                  {faq.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(faq)}
                className="text-blue-400 hover:text-blue-300"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(faq.id)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default FAQList;
