
import { supabase } from '@/integrations/supabase/client';
import { Game } from '@/frontend/types/api';

/**
 * Games API module for managing game data
 */
export const gamesApi = {
  /**
   * Retrieve all games
   */
  getAll: async (): Promise<Game[]> => {
    try {
      const { data, error } = await supabase
        .from('best_games')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      
      return data as Game[];
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  },

  /**
   * Get a single game by ID
   */
  getById: async (id: string): Promise<Game> => {
    try {
      const { data, error } = await supabase
        .from('best_games')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data as Game;
    } catch (error) {
      console.error(`Error fetching game with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new game
   */
  create: async (gameData: Omit<Game, 'id' | 'created_at'>): Promise<Game> => {
    try {
      const { data, error } = await supabase
        .from('best_games')
        .insert(gameData)
        .select()
        .single();

      if (error) throw error;
      
      return data as Game;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  },

  /**
   * Update an existing game
   */
  update: async (id: string, gameData: Partial<Game>): Promise<Game> => {
    try {
      const { data, error } = await supabase
        .from('best_games')
        .update(gameData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return data as Game;
    } catch (error) {
      console.error(`Error updating game with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a game
   */
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('best_games')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting game with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update game position for reordering
   */
  updatePosition: async (id: string, direction: 'up' | 'down'): Promise<void> => {
    try {
      // Get all games to determine current positions
      const { data: games } = await supabase
        .from('best_games')
        .select('id, position')
        .order('position', { ascending: true });

      if (!games) return;

      // Find the current game and its index
      const gameIndex = games.findIndex(game => game.id === id);
      if (gameIndex === -1) return;

      // Determine target index based on direction
      const targetIndex = direction === 'up' 
        ? Math.max(0, gameIndex - 1) 
        : Math.min(games.length - 1, gameIndex + 1);

      // If already at extremes, do nothing
      if (targetIndex === gameIndex) return;

      // Get the current and target games
      const currentGame = games[gameIndex];
      const targetGame = games[targetIndex];

      // Swap positions
      await supabase
        .from('best_games')
        .update({ position: targetGame.position })
        .eq('id', currentGame.id);

      await supabase
        .from('best_games')
        .update({ position: currentGame.position })
        .eq('id', targetGame.id);

    } catch (error) {
      console.error(`Error updating game position for ID ${id}:`, error);
      throw error;
    }
  }
};
