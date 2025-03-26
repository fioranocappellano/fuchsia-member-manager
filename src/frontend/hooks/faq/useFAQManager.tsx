
import { useState, useEffect } from "react";
import { useToast } from "@/frontend/hooks/use-toast";
import { FAQ, NewFAQ } from "@/frontend/types/api";
import { faqsApi } from "@/backend/api";

export const useFAQManager = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [reordering, setReordering] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const fetchedFaqs = await faqsApi.getAll();
      setFaqs(fetchedFaqs);
    } catch (error: any) {
      console.error("Error fetching FAQs:", error);
      toast({
        id: crypto.randomUUID(),
        title: "Error fetching FAQs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await faqsApi.delete(id);

        toast({
          id: crypto.randomUUID(),
          title: "FAQ deleted",
          description: "The FAQ has been deleted successfully",
        });

        fetchFaqs();
      } catch (error: any) {
        console.error("Error deleting FAQ:", error);
        toast({
          id: crypto.randomUUID(),
          title: "Error deleting FAQ",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async (values: NewFAQ) => {
    try {
      const updatedFaq = await faqsApi.update(editingFaq!.id, values);

      toast({
        id: crypto.randomUUID(),
        title: "FAQ updated",
        description: "The FAQ has been updated successfully",
      });

      setFaqs(faqs.map(f => f.id === editingFaq!.id ? updatedFaq : f));
      setEditingFaq(null);
    } catch (error: any) {
      console.error("Error updating FAQ:", error);
      toast({
        id: crypto.randomUUID(),
        title: "Error updating FAQ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const faq = faqs.find(f => f.id === id);
      if (!faq) return;

      const updatedFaq = await faqsApi.update(id, {
        is_active: !isActive
      });

      toast({
        id: crypto.randomUUID(),
        title: isActive ? "FAQ deactivated" : "FAQ activated",
        description: `The FAQ is now ${isActive ? 'hidden' : 'visible'} on the site`
      });

      setFaqs(faqs.map(f => f.id === id ? updatedFaq : f));
    } catch (error: any) {
      console.error("Error toggling FAQ visibility:", error);
      toast({
        id: crypto.randomUUID(),
        title: "Error updating FAQ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddFaq = async (newFaqData: NewFAQ) => {
    try {
      await faqsApi.create(newFaqData);
      toast({
        id: crypto.randomUUID(),
        title: "FAQ added",
        description: "The FAQ has been added successfully"
      });
      fetchFaqs();
    } catch (error: any) {
      console.error("Error adding FAQ:", error);
      toast({
        id: crypto.randomUUID(),
        title: "Error adding FAQ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleReordering = () => {
    setReordering(!reordering);
    if (!reordering) {
      setDialogOpen(false);
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    try {
      await faqsApi.updatePosition(id, direction);
      // Refresh the FAQs after updating position
      fetchFaqs();
    } catch (error: any) {
      console.error("Error updating position:", error);
      toast({
        id: crypto.randomUUID(),
        title: "Error updating position",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    faqs,
    loading,
    editingFaq,
    reordering,
    dialogOpen,
    setDialogOpen,
    fetchFaqs,
    handleEdit,
    handleDelete,
    handleUpdate,
    handleToggleActive,
    handleAddFaq,
    toggleReordering,
    moveItem,
    setEditingFaq
  };
};
