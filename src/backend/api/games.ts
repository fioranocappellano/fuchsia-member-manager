
import { supabase } from "@/integrations/supabase/client";
import { Game } from "@/frontend/types/api";

/**
 * Fetch all games from the database
 */
export const getAll = async (): Promise<Game[]> => {
  try {
    const { data, error } = await supabase
      .from("best_games")
      .select("*")
      .order("position", { ascending: true });

    if (error) {
      throw error;
    }

    return data as Game[];
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};

/**
 * Fetch a single game by ID
 */
export const getById = async (id: string): Promise<Game> => {
  try {
    const { data, error } = await supabase
      .from("best_games")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data as Game;
  } catch (error) {
    console.error(`Error fetching game with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new game
 */
export const create = async (gameData: Omit<Game, "id" | "created_at">): Promise<Game> => {
  try {
    const { data, error } = await supabase
      .from("best_games")
      .insert([gameData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Game;
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
};

/**
 * Update an existing game
 */
export const update = async (id: string, gameData: Partial<Game>): Promise<Game> => {
  try {
    const { data, error } = await supabase
      .from("best_games")
      .update(gameData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Game;
  } catch (error) {
    console.error(`Error updating game with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a game
 */
export const deleteGame = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("best_games")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting game with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update the position of a game (move up or down)
 */
export const updatePosition = async (id: string, direction: 'up' | 'down'): Promise<void> => {
  try {
    // First, get all games to determine the current positions
    const { data: games, error: fetchError } = await supabase
      .from("best_games")
      .select("id, position")
      .order("position", { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    // Find the current game and its position
    const gameIndex = games.findIndex(game => game.id === id);
    if (gameIndex === -1) {
      throw new Error("Game not found");
    }

    // Determine the swap index based on direction
    let swapIndex;
    if (direction === 'up' && gameIndex > 0) {
      swapIndex = gameIndex - 1;
    } else if (direction === 'down' && gameIndex < games.length - 1) {
      swapIndex = gameIndex + 1;
    } else {
      // Already at the top or bottom
      return;
    }

    // Swap positions
    const currentPos = games[gameIndex].position;
    const swapPos = games[swapIndex].position;
    const swapId = games[swapIndex].id;

    // Update both games' positions
    const { error: updateError1 } = await supabase
      .from("best_games")
      .update({ position: swapPos })
      .eq("id", id);

    if (updateError1) throw updateError1;

    const { error: updateError2 } = await supabase
      .from("best_games")
      .update({ position: currentPos })
      .eq("id", swapId);

    if (updateError2) throw updateError2;
  } catch (error) {
    console.error("Error updating game position:", error);
    throw error;
  }
};
