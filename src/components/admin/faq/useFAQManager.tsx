import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { FAQ, NewFAQ } from "@/frontend/types/api";
import { faqsApi } from "@/backend/api";
import { moveItemUp, moveItemDown } from "@/lib/utils";

export const useFAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFaq, setNewFaq] = useState<NewFAQ>({
    question_it: "",
    question_en: "",
    answer_it: "",
    answer_en: "",
    position: 0,
    is_active: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await faqsApi.getAll();
      setFaqs(data || []);
    } catch (error: any) {
      console.error("Error fetching FAQs:", error);
      toast({
        title: "Error",
        description: "Failed to load FAQs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleAddFaq = async () => {
    try {
      setIsSubmitting(true);
      
      if (!newFaq.question_it || !newFaq.question_en || !newFaq.answer_it || !newFaq.answer_en) {
        toast({
          title: "Validation Error",
          description: "All fields are required",
          variant: "destructive",
        });
        return;
      }

      // Determine the next position
      const nextPosition = faqs.length > 0 
        ? Math.max(...faqs.map(faq => faq.position)) + 1 
        : 0;
      
      const faqToAdd = {
        ...newFaq,
        position: nextPosition
      };

      await faqsApi.create(faqToAdd);

      toast({
        title: "Success",
        description: "FAQ added successfully",
      });
      
      setNewFaq({
        question_it: "",
        question_en: "",
        answer_it: "",
        answer_en: "",
        position: 0,
        is_active: true,
      });
      
      setDialogOpen(false);
      fetchFAQs();
    } catch (error: any) {
      console.error("Error adding FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add FAQ",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFaq = async () => {
    try {
      setIsSubmitting(true);
      
      if (!editingFaq) return;
      
      // Keep the original position when updating
      await faqsApi.update(editingFaq.id, {
        question_it: editingFaq.question_it,
        question_en: editingFaq.question_en,
        answer_it: editingFaq.answer_it,
        answer_en: editingFaq.answer_en,
        is_active: editingFaq.is_active,
        // Don't update position to maintain order
      });

      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
      
      setEditingFaq(null);
      setDialogOpen(false);
      fetchFAQs();
    } catch (error: any) {
      console.error("Error updating FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update FAQ",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await faqsApi.delete(id);

      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
      
      fetchFAQs();
    } catch (error: any) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete FAQ",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      await faqsApi.update(id, { is_active: !is_active });

      toast({
        title: "Success",
        description: `FAQ ${is_active ? "deactivated" : "activated"} successfully`,
      });
      
      fetchFAQs();
    } catch (error: any) {
      console.error("Error toggling FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update FAQ",
        variant: "destructive",
      });
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    
    try {
      const updatedFaqs = moveItemUp([...faqs], index);
      const faqToUpdate = updatedFaqs[index - 1];
      const prevFaq = updatedFaqs[index];
      
      await faqsApi.swapPositions(faqToUpdate, prevFaq);
      
      fetchFAQs();
    } catch (error: any) {
      console.error("Error moving FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reorder FAQ",
        variant: "destructive",
      });
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index >= faqs.length - 1) return;
    
    try {
      const updatedFaqs = moveItemDown([...faqs], index);
      const faqToUpdate = updatedFaqs[index + 1];
      const nextFaq = updatedFaqs[index];
      
      await faqsApi.swapPositions(faqToUpdate, nextFaq);
      
      fetchFAQs();
    } catch (error: any) {
      console.error("Error moving FAQ:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reorder FAQ",
        variant: "destructive",
      });
    }
  };

  const handleSetNewFaq = (values: Partial<NewFAQ>) => {
    setNewFaq(prev => ({
      ...prev,
      ...values
    }));
  };

  const handleSetEditingFaq = (values: Partial<FAQ>) => {
    if (editingFaq) {
      setEditingFaq({
        ...editingFaq,
        ...values
      });
    }
  };

  return {
    faqs,
    loading,
    newFaq,
    dialogOpen,
    editingFaq,
    isSubmitting,
    setDialogOpen,
    setNewFaq: handleSetNewFaq,
    setEditingFaq: handleSetEditingFaq,
    initEditingFaq: (faq: FAQ | null) => setEditingFaq(faq),
    fetchFAQs,
    handleAddFaq,
    handleEditFaq,
    handleDeleteFaq,
    handleToggleActive,
    handleMoveUp,
    handleMoveDown
  };
};
