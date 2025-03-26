
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/frontend/types/api";

/**
 * Fetches all team members from the database
 */
export const getAll = async (): Promise<Member[]> => {
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
};

/**
 * Fetches a single team member by ID
 */
export const getById = async (id: string): Promise<Member> => {
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
};

/**
 * Creates a new team member
 */
export const create = async (memberData: Omit<Member, "id">): Promise<Member> => {
  try {
    // Ensure member has required fields
    const member = {
      ...memberData,
      achievements: memberData.achievements || [],
    };

    const { data, error } = await supabase
      .from("members")
      .insert([member])
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
};

/**
 * Updates an existing team member
 */
export const update = async (id: string, memberData: Partial<Member>): Promise<Member> => {
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
};

/**
 * Deletes a team member
 */
export const deleteMember = async (id: string): Promise<void> => {
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
};

/**
 * Swaps the positions of two team members
 */
export const swapPositions = async (member1: Member, member2: Member): Promise<void> => {
  try {
    // Swap positions
    const pos1 = member1.position;
    const pos2 = member2.position;
    
    const { error: error1 } = await supabase
      .from("members")
      .update({ position: pos2 })
      .eq("id", member1.id);
      
    if (error1) throw error1;
    
    const { error: error2 } = await supabase
      .from("members")
      .update({ position: pos1 })
      .eq("id", member2.id);
      
    if (error2) throw error2;
    
  } catch (error) {
    console.error("Error swapping member positions:", error);
    throw error;
  }
};
