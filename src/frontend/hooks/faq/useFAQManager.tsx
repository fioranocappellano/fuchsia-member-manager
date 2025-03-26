
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
      const fetchedFaqs = await faqsApi.getAllForAdmin();
      setFaqs(fetchedFaqs);
    } catch (error: any) {
      console.error("Error fetching FAQs:", error);
      toast({
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
          title: "FAQ deleted",
          description: "The FAQ has been deleted successfully",
        });

        fetchFaqs();
      } catch (error: any) {
        console.error("Error deleting FAQ:", error);
        toast({
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
        title: "FAQ updated",
        description: "The FAQ has been updated successfully",
      });

      setFaqs(faqs.map(f => f.id === editingFaq!.id ? updatedFaq : f));
      setEditingFaq(null);
    } catch (error: any) {
      console.error("Error updating FAQ:", error);
      toast({
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
        title: isActive ? "FAQ deactivated" : "FAQ activated",
        description: `The FAQ is now ${isActive ? 'hidden' : 'visible'} on the site`
      });

      setFaqs(faqs.map(f => f.id === id ? updatedFaq : f));
    } catch (error: any) {
      console.error("Error toggling FAQ visibility:", error);
      toast({
        title: "Error updating FAQ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddFaq = () => {
    fetchFaqs();
  };

  const toggleReordering = () => {
    setReordering(!reordering);
    if (!reordering) {
      setDialogOpen(false);
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = faqs.findIndex(faq => faq.id === id);
      if (
        (direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === faqs.length - 1)
      ) {
        return;
      }

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Get the two faqs we're swapping
      const faq1 = faqs[currentIndex];
      const faq2 = faqs[newIndex];
      
      // Swap their positions
      const tempPosition = faq1.position;
      faq1.position = faq2.position;
      faq2.position = tempPosition;
      
      // Update both faqs with swapped positions
      await faqsApi.swapPositions(faq1, faq2);
      
      // Refresh the faqs to get the updated order
      fetchFaqs();
      
    } catch (error: any) {
      console.error("Error updating position:", error);
      toast({
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
