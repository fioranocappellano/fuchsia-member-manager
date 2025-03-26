
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/frontend/types/api";

/**
 * API methods for interacting with members in the database
 */
export const membersApi = {
  /**
   * Fetches all members from the database
   */
  getAll: async (): Promise<Member[]> => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("position", { ascending: true });

      if (error) {
        throw error;
      }

      return data as Member[];
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  },

  /**
   * Fetches a member by ID
   */
  getById: async (id: string): Promise<Member> => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      return data as Member;
    } catch (error) {
      console.error(`Error fetching member with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new member
   */
  create: async (memberData: Omit<Member, "id" | "created_at" | "updated_at">): Promise<Member> => {
    try {
      // Make sure achievements is an array if not provided
      const dataToInsert = {
        ...memberData,
        achievements: memberData.achievements || []
      };
      
      const { data, error } = await supabase
        .from("members")
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Member;
    } catch (error) {
      console.error("Error creating member:", error);
      throw error;
    }
  },

  /**
   * Updates an existing member
   */
  update: async (id: string, memberData: Partial<Member>): Promise<Member> => {
    try {
      const { data, error } = await supabase
        .from("members")
        .update(memberData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as Member;
    } catch (error) {
      console.error(`Error updating member with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletes a member
   */
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting member with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Updates the position of a member (move up or down)
   */
  updatePosition: async (id: string, direction: 'up' | 'down'): Promise<void> => {
    try {
      // First, get all members to determine the current positions
      const { data: members, error: fetchError } = await supabase
        .from("members")
        .select("id, position")
        .order("position", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Find the current member and its position
      const memberIndex = members.findIndex(member => member.id === id);
      if (memberIndex === -1) {
        throw new Error("Member not found");
      }

      // Determine the swap index based on direction
      let swapIndex;
      if (direction === 'up' && memberIndex > 0) {
        swapIndex = memberIndex - 1;
      } else if (direction === 'down' && memberIndex < members.length - 1) {
        swapIndex = memberIndex + 1;
      } else {
        // Already at the top or bottom
        return;
      }

      // Swap positions
      const currentPos = members[memberIndex].position;
      const swapPos = members[swapIndex].position;
      const swapId = members[swapIndex].id;

      // Update both members' positions
      const { error: updateError1 } = await supabase
        .from("members")
        .update({ position: swapPos })
        .eq("id", id);

      if (updateError1) throw updateError1;

      const { error: updateError2 } = await supabase
        .from("members")
        .update({ position: currentPos })
        .eq("id", swapId);

      if (updateError2) throw updateError2;
    } catch (error) {
      console.error("Error updating member position:", error);
      throw error;
    }
  },

  /**
   * Helper method to swap positions of two members
   */
  swapPositions: async (member1: { id: string, position: number }, member2: { id: string, position: number }): Promise<void> => {
    try {
      // Update first member
      const { error: error1 } = await supabase
        .from("members")
        .update({ position: member2.position })
        .eq("id", member1.id);

      if (error1) throw error1;

      // Update second member
      const { error: error2 } = await supabase
        .from("members")
        .update({ position: member1.position })
        .eq("id", member2.id);

      if (error2) throw error2;
    } catch (error) {
      console.error("Error swapping member positions:", error);
      throw error;
    }
  }
};
