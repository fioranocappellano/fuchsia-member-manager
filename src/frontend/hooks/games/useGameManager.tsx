
import { useState, useEffect } from 'react';
import { Game } from '@/frontend/types/api';
import { gamesApi } from '@/backend/api';
import { useToast } from '@/frontend/hooks/use-toast';

/**
 * Hook for managing games in the admin panel
 */
export const useGameManager = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load games on initial mount
  useEffect(() => {
    fetchGames();
  }, []);

  // Fetch all games from API
  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gamesApi.getAll();
      setGames(data);
    } catch (err: any) {
      console.error('Error fetching games:', err);
      setError(err.message || 'Failed to load games');
      toast({
        title: 'Error loading games',
        description: err.message || 'There was a problem loading the games',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new game
  const createGame = async (game: Omit<Game, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      await gamesApi.create(game);
      toast({
        title: 'Success',
        description: 'Game created successfully',
      });
      await fetchGames();
    } catch (err: any) {
      console.error('Error creating game:', err);
      toast({
        title: 'Error creating game',
        description: err.message || 'There was a problem creating the game',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing game
  const updateGame = async (game: Partial<Game> & { id: string }) => {
    try {
      setLoading(true);
      await gamesApi.update(game.id, game);
      toast({
        title: 'Success',
        description: 'Game updated successfully',
      });
      await fetchGames();
    } catch (err: any) {
      console.error('Error updating game:', err);
      toast({
        title: 'Error updating game',
        description: err.message || 'There was a problem updating the game',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a game
  const deleteGame = async (id: string) => {
    try {
      setLoading(true);
      await gamesApi.delete(id);
      toast({
        title: 'Success',
        description: 'Game deleted successfully',
      });
      await fetchGames();
    } catch (err: any) {
      console.error('Error deleting game:', err);
      toast({
        title: 'Error deleting game',
        description: err.message || 'There was a problem deleting the game',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update game position
  const updatePosition = async (id: string, direction: 'up' | 'down') => {
    try {
      setLoading(true);
      await gamesApi.updatePosition(id, direction);
      toast({
        title: 'Success',
        description: 'Game position updated successfully',
      });
      await fetchGames();
    } catch (err: any) {
      console.error('Error updating game position:', err);
      toast({
        title: 'Error updating position',
        description: err.message || 'There was a problem updating the game position',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    games,
    loading,
    error,
    createGame,
    updateGame,
    deleteGame,
    updatePosition,
    refresh: fetchGames
  };
};
