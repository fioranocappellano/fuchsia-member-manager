
import { supabase } from "@/integrations/supabase/client";
import { FAQ, NewFAQ } from "@/frontend/types/api";

/**
 * Recupera tutte le FAQ attive ordinate per posizione
 * @returns Lista di tutte le FAQ attive ordinate per posizione
 */
export const getAll = async (): Promise<FAQ[]> => {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }

  return data || [];
};

/**
 * Recupera tutte le FAQ (attive e non attive) per gestione admin
 * @returns Lista di tutte le FAQ ordinate per posizione
 */
export const getAllForAdmin = async (): Promise<FAQ[]> => {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching FAQs for admin:", error);
    throw error;
  }

  return data || [];
};

/**
 * Recupera una FAQ specifica tramite ID
 * @param id ID della FAQ da recuperare
 * @returns Dettagli della FAQ richiesta
 */
export const getById = async (id: string): Promise<FAQ> => {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching FAQ ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Crea una nuova FAQ
 * @param faq Dati della nuova FAQ da creare
 * @returns La FAQ creata con l'ID generato
 */
export const create = async (faq: NewFAQ): Promise<FAQ> => {
  const { data, error } = await supabase
    .from("faqs")
    .insert(faq)
    .select()
    .single();

  if (error) {
    console.error("Error creating FAQ:", error);
    throw error;
  }

  return data;
};

/**
 * Aggiorna una FAQ esistente
 * @param id ID della FAQ da aggiornare
 * @param faq Dati aggiornati della FAQ
 * @returns La FAQ aggiornata
 */
export const update = async (id: string, faq: Partial<FAQ>): Promise<FAQ> => {
  const { data, error } = await supabase
    .from("faqs")
    .update(faq)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating FAQ ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Elimina una FAQ
 * @param id ID della FAQ da eliminare
 * @returns true se l'eliminazione è avvenuta con successo
 */
export const delete_ = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting FAQ ${id}:`, error);
    throw error;
  }

  return true;
};

/**
 * Scambia la posizione di due FAQ per il riordinamento
 * @param faq1 Prima FAQ da scambiare
 * @param faq2 Seconda FAQ da scambiare
 * @returns true se lo scambio è avvenuto con successo
 */
export const swapPositions = async (faq1: FAQ, faq2: FAQ): Promise<boolean> => {
  try {
    // Aggiorna la prima FAQ
    await supabase
      .from("faqs")
      .update({ position: faq1.position })
      .eq("id", faq1.id);

    // Aggiorna la seconda FAQ
    await supabase
      .from("faqs")
      .update({ position: faq2.position })
      .eq("id", faq2.id);

    return true;
  } catch (error) {
    console.error("Error swapping FAQ positions:", error);
    throw error;
  }
};

export const faqsApi = {
  getAll,
  getAllForAdmin,
  getById,
  create,
  update,
  delete: delete_,
  swapPositions
};
