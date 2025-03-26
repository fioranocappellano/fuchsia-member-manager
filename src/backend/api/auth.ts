
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/frontend/types/api";

/**
 * API methods for authentication
 */
export const authApi = {
  /**
   * Sign up a new user
   */
  signUp: async (email: string, password: string): Promise<{ user: User | null; error: any }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user as User, error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { user: null, error };
    }
  },

  /**
   * Sign in a user
   */
  signIn: async (email: string, password: string): Promise<{ user: User | null; error: any }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user as User, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { user: null, error };
    }
  },

  /**
   * Sign out the current user
   */
  signOut: async (): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error signing out:", error);
      return { error };
    }
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<{ user: User | null; error: any }> => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user: data.user as User, error: null };
    } catch (error) {
      console.error("Error getting current user:", error);
      return { user: null, error };
    }
  },

  /**
   * Check if a user is an admin
   */
  checkIsAdmin: async (userId: string): Promise<{ isAdmin: boolean; error: any }> => {
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("id", userId)
        .eq("is_active", true)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is the error code for no rows returned
        throw error;
      }

      return { isAdmin: !!data, error: null };
    } catch (error) {
      console.error("Error checking admin status:", error);
      return { isAdmin: false, error };
    }
  },

  /**
   * Reset password for email
   */
  resetPassword: async (email: string, redirectTo?: string): Promise<{ error: any }> => {
    try {
      const options = redirectTo ? { redirectTo } : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, options);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { error };
    }
  },

  /**
   * Update user password
   */
  updatePassword: async (password: string): Promise<{ error: any }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error updating password:", error);
      return { error };
    }
  }
};
