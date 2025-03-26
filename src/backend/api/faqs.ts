
import { supabase } from "@/integrations/supabase/client";
import { FAQ, NewFAQ } from "@/frontend/types/api";

/**
 * API methods for interacting with FAQs in the database
 */
export const faqsApi = {
  /**
   * Fetches all FAQs from the database
   */
  getAll: async (): Promise<FAQ[]> => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("position", { ascending: true });

      if (error) {
        throw error;
      }

      return data as FAQ[];
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      throw error;
    }
  },

  /**
   * Fetches all active FAQs from the database
   */
  getAllActive: async (): Promise<FAQ[]> => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true });

      if (error) {
        throw error;
      }

      return data as FAQ[];
    } catch (error) {
      console.error("Error fetching active FAQs:", error);
      throw error;
    }
  },
  
  /**
   * Fetches all FAQs for admin purposes
   */
  getAllForAdmin: async (): Promise<FAQ[]> => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("position", { ascending: true });

      if (error) {
        throw error;
      }

      return data as FAQ[];
    } catch (error) {
      console.error("Error fetching FAQs for admin:", error);
      throw error;
    }
  },

  /**
   * Fetches a single FAQ by ID
   */
  getById: async (id: string): Promise<FAQ> => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      return data as FAQ;
    } catch (error) {
      console.error(`Error fetching FAQ with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new FAQ
   */
  create: async (faqData: NewFAQ): Promise<FAQ> => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .insert([faqData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as FAQ;
    } catch (error) {
      console.error("Error creating FAQ:", error);
      throw error;
    }
  },

  /**
   * Updates an existing FAQ
   */
  update: async (id: string, faqData: Partial<FAQ>): Promise<FAQ> => {
    try {
      const { data, error } = await supabase
        .from("faqs")
        .update(faqData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as FAQ;
    } catch (error) {
      console.error(`Error updating FAQ with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a FAQ
   */
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("faqs")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting FAQ with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Updates the position of a FAQ (move up or down)
   */
  updatePosition: async (id: string, direction: 'up' | 'down'): Promise<void> => {
    try {
      // First, get all FAQs to determine the current positions
      const { data: faqs, error: fetchError } = await supabase
        .from("faqs")
        .select("id, position")
        .order("position", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Find the current FAQ and its position
      const faqIndex = faqs.findIndex(faq => faq.id === id);
      if (faqIndex === -1) {
        throw new Error("FAQ not found");
      }

      // Determine the swap index based on direction
      let swapIndex;
      if (direction === 'up' && faqIndex > 0) {
        swapIndex = faqIndex - 1;
      } else if (direction === 'down' && faqIndex < faqs.length - 1) {
        swapIndex = faqIndex + 1;
      } else {
        // Already at the top or bottom
        return;
      }

      // Swap positions
      const currentPos = faqs[faqIndex].position;
      const swapPos = faqs[swapIndex].position;
      const swapId = faqs[swapIndex].id;

      // Update both FAQs' positions
      const { error: updateError1 } = await supabase
        .from("faqs")
        .update({ position: swapPos })
        .eq("id", id);

      if (updateError1) throw updateError1;

      const { error: updateError2 } = await supabase
        .from("faqs")
        .update({ position: currentPos })
        .eq("id", swapId);

      if (updateError2) throw updateError2;
    } catch (error) {
      console.error("Error updating FAQ position:", error);
      throw error;
    }
  },

  /**
   * Swaps the positions of two FAQs
   */
  swapPositions: async (faq1: FAQ, faq2: FAQ): Promise<void> => {
    try {
      await Promise.all([
        supabase.from("faqs").update({ position: faq2.position }).eq("id", faq1.id),
        supabase.from("faqs").update({ position: faq1.position }).eq("id", faq2.id)
      ]);
    } catch (error) {
      console.error("Error swapping FAQ positions:", error);
      throw error;
    }
  }
};
