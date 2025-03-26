
import { supabase } from "@/integrations/supabase/client";
import { Game } from "@/frontend/types/api";

/**
 * Recupera tutti i giochi ordinati per posizione
 * @returns Lista di tutti i giochi ordinati per posizione
 */
export const getAll = async (): Promise<Game[]> => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching games:", error);
    throw error;
  }

  return data || [];
};

/**
 * Recupera un gioco specifico tramite ID
 * @param id ID del gioco da recuperare
 * @returns Dettagli del gioco richiesto
 */
export const getById = async (id: string): Promise<Game> => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching game ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Crea un nuovo gioco
 * @param game Dati del nuovo gioco da creare
 * @returns Il gioco creato con l'ID generato
 */
export const create = async (game: Omit<Game, "id" | "created_at" | "updated_at">): Promise<Game> => {
  const { data, error } = await supabase
    .from("games")
    .insert(game)
    .select()
    .single();

  if (error) {
    console.error("Error creating game:", error);
    throw error;
  }

  return data;
};

/**
 * Aggiorna un gioco esistente
 * @param id ID del gioco da aggiornare
 * @param game Dati aggiornati del gioco
 * @returns Il gioco aggiornato
 */
export const update = async (id: string, game: Partial<Game>): Promise<Game> => {
  const { data, error } = await supabase
    .from("games")
    .update(game)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating game ${id}:`, error);
    throw error;
  }

  return data;
};

/**
 * Elimina un gioco
 * @param id ID del gioco da eliminare
 * @returns true se l'eliminazione è avvenuta con successo
 */
export const delete_ = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("games")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting game ${id}:`, error);
    throw error;
  }

  return true;
};

/**
 * Scambia la posizione di due giochi per il riordinamento
 * @param game1 Primo gioco da scambiare
 * @param game2 Secondo gioco da scambiare
 * @returns true se lo scambio è avvenuto con successo
 */
export const swapPositions = async (game1: Game, game2: Game): Promise<boolean> => {
  try {
    // Aggiorna il primo gioco
    await supabase
      .from("games")
      .update({ position: game1.position })
      .eq("id", game1.id);

    // Aggiorna il secondo gioco
    await supabase
      .from("games")
      .update({ position: game2.position })
      .eq("id", game2.id);

    return true;
  } catch (error) {
    console.error("Error swapping game positions:", error);
    throw error;
  }
};

export const gamesApi = {
  getAll,
  getById,
  create,
  update,
  delete: delete_,
  swapPositions
};
