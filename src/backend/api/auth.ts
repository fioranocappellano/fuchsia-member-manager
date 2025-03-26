
import { supabase } from "@/integrations/supabase/client";

/**
 * Effettua il login di un utente
 * @param email Email dell'utente
 * @param password Password dell'utente
 * @returns Oggetto con informazioni sul successo del login e l'utente
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error during sign in:", error);
    throw error;
  }

  return { 
    success: true, 
    user: data.user, 
    session: data.session 
  };
};

/**
 * Effettua il logout dell'utente corrente
 * @returns Oggetto con informazioni sul successo del logout
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error during sign out:", error);
    throw error;
  }

  return { success: true };
};

/**
 * Verifica se l'utente corrente è un amministratore
 * @param userId ID dell'utente da verificare
 * @returns true se l'utente è un amministratore
 */
export const checkIsAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 è il codice per "no rows returned"
      console.error("Error checking admin status:", error);
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error("Error in checkIsAdmin:", error);
    return false;
  }
};

/**
 * Invia un'email per il reset della password
 * @param email Email dell'utente che richiede il reset della password
 * @returns Oggetto con informazioni sul successo dell'invio
 */
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error("Error sending password reset:", error);
    throw error;
  }

  return { success: true };
};

/**
 * Aggiorna la password dell'utente
 * @param newPassword Nuova password da impostare
 * @returns Oggetto con informazioni sul successo dell'aggiornamento
 */
export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("Error updating password:", error);
    throw error;
  }

  return { success: true, user: data.user };
};

/**
 * Ottiene l'utente corrente dalla sessione
 * @returns L'utente corrente o null se non autenticato
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("Error getting current user:", error);
    return null;
  }
  
  return data.user;
};

export const authApi = {
  signIn,
  signOut,
  checkIsAdmin,
  resetPassword,
  updatePassword,
  getCurrentUser
};
