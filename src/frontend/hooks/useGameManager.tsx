import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Game, GameFormData } from "@/frontend/types/api";
import { gamesApi } from "@/backend/api";

export const useGameManager = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gamesApi.getAll();
      setGames(data || []);
    } catch (err: any) {
      console.error("Error fetching games:", err);
      setError(err.message || "Failed to load games");
      toast({
        title: "Error",
        description: err.message || "Failed to load games",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const createGame = async (gameData: GameFormData) => {
    try {
      setLoading(true);
      setError(null);
      await gamesApi.create(gameData);
      toast({
        title: "Success",
        description: "Game created successfully",
      });
      fetchGames();
    } catch (err: any) {
      console.error("Error creating game:", err);
      setError(err.message || "Failed to create game");
      toast({
        title: "Error",
        description: err.message || "Failed to create game",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGame = async (gameData: Game) => {
    try {
      setLoading(true);
      setError(null);
      await gamesApi.update(gameData.id, gameData);
      toast({
        title: "Success",
        description: "Game updated successfully",
      });
      fetchGames();
    } catch (err: any) {
      console.error("Error updating game:", err);
      setError(err.message || "Failed to update game");
      toast({
        title: "Error",
        description: err.message || "Failed to update game",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteGame = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await gamesApi.delete(id);
      toast({
        title: "Success",
        description: "Game deleted successfully",
      });
      fetchGames();
    } catch (err: any) {
      console.error("Error deleting game:", err);
      setError(err.message || "Failed to delete game");
      toast({
        title: "Error",
        description: err.message || "Failed to delete game",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePosition = async (id: string, direction: 'up' | 'down') => {
    try {
      setLoading(true);
      setError(null);
      await gamesApi.updatePosition(id, direction);
      fetchGames();
    } catch (err: any) {
      console.error("Error updating game position:", err);
      setError(err.message || "Failed to update game position");
      toast({
        title: "Error",
        description: err.message || "Failed to update game position",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchGames();
  };

  return {
    games,
    loading,
    error,
    createGame,
    updateGame,
    deleteGame,
    updatePosition,
    refresh
  };
};
