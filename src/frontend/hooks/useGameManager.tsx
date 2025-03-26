
import { useState, useEffect } from 'react';
import { useToast } from '@/frontend/hooks/use-toast';
import { Game } from '@/frontend/types/api';
import { gamesApi } from '@/backend/api';

/**
 * Hook for managing games
 */
export function useGameManager() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  // Load games on mount
  useEffect(() => {
    loadGames();
  }, []);

  /**
   * Load all games from the API
   */
  const loadGames = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await gamesApi.getAll();
      setGames(data);
    } catch (err: any) {
      console.error('Error loading games:', err);
      setError(err.message || 'Failed to load games');
      toast({
        title: 'Error',
        description: 'Failed to load games',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new game
   */
  const addGame = async (gameData: Omit<Game, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      setError('');
      
      const newGame = await gamesApi.create(gameData);
      
      setGames(prevGames => [...prevGames, newGame]);
      
      toast({
        title: 'Success',
        description: 'Game added successfully',
      });
      
      return newGame;
    } catch (err: any) {
      console.error('Error adding game:', err);
      setError(err.message || 'Failed to add game');
      toast({
        title: 'Error',
        description: 'Failed to add game',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing game
   */
  const updateGame = async (id: string, gameData: Partial<Game>) => {
    try {
      setLoading(true);
      setError('');
      
      const updatedGame = await gamesApi.update(id, gameData);
      
      setGames(prevGames => 
        prevGames.map(game => 
          game.id === id ? updatedGame : game
        )
      );
      
      if (selectedGame?.id === id) {
        setSelectedGame(updatedGame);
      }
      
      toast({
        title: 'Success',
        description: 'Game updated successfully',
      });
      
      return updatedGame;
    } catch (err: any) {
      console.error('Error updating game:', err);
      setError(err.message || 'Failed to update game');
      toast({
        title: 'Error',
        description: 'Failed to update game',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a game
   */
  const deleteGame = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      
      await gamesApi.deleteGame(id);
      
      setGames(prevGames => prevGames.filter(game => game.id !== id));
      
      if (selectedGame?.id === id) {
        setSelectedGame(null);
      }
      
      toast({
        title: 'Success',
        description: 'Game deleted successfully',
      });
    } catch (err: any) {
      console.error('Error deleting game:', err);
      setError(err.message || 'Failed to delete game');
      toast({
        title: 'Error',
        description: 'Failed to delete game',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change the position of a game
   */
  const changePosition = async (id: string, direction: 'up' | 'down') => {
    try {
      setLoading(true);
      setError('');
      
      await gamesApi.updatePosition(id, direction);
      
      // Reload games to get the updated positions
      await loadGames();
      
      toast({
        title: 'Success',
        description: `Game moved ${direction} successfully`,
      });
    } catch (err: any) {
      console.error('Error changing game position:', err);
      setError(err.message || 'Failed to change game position');
      toast({
        title: 'Error',
        description: 'Failed to change game position',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    games,
    selectedGame,
    setSelectedGame,
    loading,
    error,
    loadGames,
    addGame,
    updateGame,
    deleteGame,
    changePosition,
  };
}
