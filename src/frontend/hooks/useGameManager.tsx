
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Game, GameFormData } from '@/frontend/types/api';
import { gamesApi } from '@/backend/api';

/**
 * Hook for managing games in the admin panel
 */
export const useGameManager = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await gamesApi.getAll();
      setGames(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching games:', err);
      setError(err.message || 'Failed to load games');
      toast({
        id: crypto.randomUUID(),
        title: 'Error',
        description: err.message || 'Failed to load games',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const createGame = async (gameData: Omit<Game, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await gamesApi.create(gameData);
      toast({
        id: crypto.randomUUID(),
        title: 'Success',
        description: 'Game created successfully',
      });
      await fetchGames();
    } catch (err: any) {
      console.error('Error creating game:', err);
      toast({
        id: crypto.randomUUID(),
        title: 'Error',
        description: err.message || 'Failed to create game',
        variant: 'destructive',
      });
    }
  };

  const updateGame = async (gameData: Partial<Game> & { id: string }) => {
    try {
      await gamesApi.update(gameData.id, gameData);
      toast({
        id: crypto.randomUUID(),
        title: 'Success',
        description: 'Game updated successfully',
      });
      await fetchGames();
    } catch (err: any) {
      console.error('Error updating game:', err);
      toast({
        id: crypto.randomUUID(),
        title: 'Error',
        description: err.message || 'Failed to update game',
        variant: 'destructive',
      });
    }
  };

  const deleteGame = async (id: string) => {
    try {
      await gamesApi.delete(id);
      toast({
        id: crypto.randomUUID(),
        title: 'Success',
        description: 'Game deleted successfully',
      });
      await fetchGames();
    } catch (err: any) {
      console.error('Error deleting game:', err);
      toast({
        id: crypto.randomUUID(),
        title: 'Error',
        description: err.message || 'Failed to delete game',
        variant: 'destructive',
      });
    }
  };

  const updatePosition = async (id: string, direction: 'up' | 'down') => {
    try {
      await gamesApi.updatePosition(id, direction);
      await fetchGames();
    } catch (err: any) {
      console.error('Error updating game position:', err);
      toast({
        id: crypto.randomUUID(),
        title: 'Error',
        description: err.message || 'Failed to update game position',
        variant: 'destructive',
      });
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
    refresh: fetchGames,
  };
};
