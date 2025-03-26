
import { useState, useEffect } from 'react';
import { useToast } from '@/frontend/hooks/use-toast';
import { Game } from '@/frontend/types/api';
import { gamesApi } from '@/backend/api/games';

export const useGameManager = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await gamesApi.getAll();
      setGames(data);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch games');
      toast({
        title: 'Error fetching games',
        description: err.message || 'Something went wrong',
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
      setLoading(true);
      
      // Ensure players is a string
      if (typeof gameData.players !== 'string') {
        gameData.players = String(gameData.players);
      }
      
      // Calculate position if not provided
      if (!gameData.position) {
        gameData.position = games.length + 1;
      }
      
      await gamesApi.create(gameData);
      
      toast({
        title: 'Game created',
        description: 'The game was created successfully',
      });
      
      await fetchGames();
      return true;
    } catch (err: any) {
      toast({
        title: 'Error creating game',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateGame = async (gameData: Partial<Game> & { id: string }) => {
    try {
      setLoading(true);
      
      // Ensure players is a string
      if (typeof gameData.players !== 'string' && gameData.players !== undefined) {
        gameData.players = String(gameData.players);
      }
      
      await gamesApi.update(gameData.id, gameData);
      
      toast({
        title: 'Game updated',
        description: 'The game was updated successfully',
      });
      
      await fetchGames();
      return true;
    } catch (err: any) {
      toast({
        title: 'Error updating game',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteGame = async (id: string) => {
    try {
      setLoading(true);
      
      await gamesApi.delete(id);
      
      toast({
        title: 'Game deleted',
        description: 'The game was deleted successfully',
      });
      
      await fetchGames();
    } catch (err: any) {
      toast({
        title: 'Error deleting game',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePosition = async (id: string, direction: 'up' | 'down') => {
    try {
      setLoading(true);
      
      await gamesApi.updatePosition(id, direction);
      
      await fetchGames();
    } catch (err: any) {
      toast({
        title: 'Error changing position',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
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
    createGame,
    updateGame,
    deleteGame,
    updatePosition,
    refresh: fetchGames
  };
};
