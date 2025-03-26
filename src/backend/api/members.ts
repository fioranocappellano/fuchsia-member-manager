
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/frontend/types/api";

// Funzioni per la gestione dei membri del team

/**
 * Recupera tutti i membri ordinati per posizione
 * @returns Lista di tutti i membri ordinati per posizione
 */
export const getAll = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching members:", error);
    throw error;
  }

  return data || [];
};

/**
 * Recupera un membro specifico tramite ID
 * @param id ID del membro da recuperare
 * @returns Dettagli del membro richiesto
 */
export const getById = async (id: string): Promise<Member> => {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching member ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Crea un nuovo membro
 * @param member Dati del nuovo membro da creare
 * @returns Il membro creato con l'ID generato
 */
export const create = async (member: Omit<Member, "id">): Promise<Member> => {
  const { data, error } = await supabase
    .from("members")
    .insert(member)
    .select()
    .single();

  if (error) {
    console.error("Error creating member:", error);
    throw error;
  }

  return data;
};

/**
 * Aggiorna un membro esistente
 * @param id ID del membro da aggiornare
 * @param member Dati aggiornati del membro
 * @returns Il membro aggiornato
 */
export const update = async (id: string, member: Partial<Member>): Promise<Member> => {
  const { data, error } = await supabase
    .from("members")
    .update(member)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating member ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Elimina un membro
 * @param id ID del membro da eliminare
 * @returns true se l'eliminazione è avvenuta con successo
 */
export const delete_ = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting member ${id}:`, error);
    throw error;
  }

  return true;
};

/**
 * Scambia la posizione di due membri per il riordinamento
 * @param member1 Primo membro da scambiare
 * @param member2 Secondo membro da scambiare
 * @returns true se lo scambio è avvenuto con successo
 */
export const swapPositions = async (member1: Member, member2: Member): Promise<boolean> => {
  try {
    // Aggiorna il primo membro
    await supabase
      .from("members")
      .update({ position: member1.position })
      .eq("id", member1.id);

    // Aggiorna il secondo membro
    await supabase
      .from("members")
      .update({ position: member2.position })
      .eq("id", member2.id);

    return true;
  } catch (error) {
    console.error("Error swapping member positions:", error);
    throw error;
  }
};

export const membersApi = {
  getAll,
  getById,
  create,
  update,
  delete: delete_,
  swapPositions
};
