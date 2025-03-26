import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FAQ, NewFAQ } from "./types";
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
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
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

    // Set up real-time listener
    const subscription = supabase
      .channel("faqs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "faqs" },
        () => {
          fetchFAQs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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

      const { error } = await supabase.from("faqs").insert([faqToAdd]);

      if (error) throw error;

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
      const { error } = await supabase
        .from("faqs")
        .update({
          question_it: editingFaq.question_it,
          question_en: editingFaq.question_en,
          answer_it: editingFaq.answer_it,
          answer_en: editingFaq.answer_en,
          is_active: editingFaq.is_active,
          // Don't update position to maintain order
        })
        .eq("id", editingFaq.id);

      if (error) throw error;

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
      const { error } = await supabase.from("faqs").delete().eq("id", id);

      if (error) throw error;

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
      const { error } = await supabase
        .from("faqs")
        .update({ is_active: !is_active })
        .eq("id", id);

      if (error) throw error;

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
      
      await Promise.all([
        supabase.from("faqs").update({ position: faqToUpdate.position }).eq("id", faqToUpdate.id),
        supabase.from("faqs").update({ position: prevFaq.position }).eq("id", prevFaq.id)
      ]);
      
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
      
      await Promise.all([
        supabase.from("faqs").update({ position: faqToUpdate.position }).eq("id", faqToUpdate.id),
        supabase.from("faqs").update({ position: nextFaq.position }).eq("id", nextFaq.id)
      ]);
      
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
    initEditingFaq: (faq: FAQ) => setEditingFaq(faq),
    fetchFAQs,
    handleAddFaq,
    handleEditFaq,
    handleDeleteFaq,
    handleToggleActive,
    handleMoveUp,
    handleMoveDown
  };
};
