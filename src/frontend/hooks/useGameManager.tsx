
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Game } from "@/frontend/types/api";
import { gamesApi } from "@/backend/api";

export const useGameManager = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [reordering, setReordering] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchGames = async () => {
    try {
      setLoading(true);
      const fetchedGames = await gamesApi.getAll();
      setGames(fetchedGames);
    } catch (error: any) {
      console.error("Error fetching games:", error);
      toast({
        title: "Error fetching games",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleEdit = (game: Game) => {
    setEditingGame(game);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        await gamesApi.delete(id);

        toast({
          title: "Game deleted",
          description: "The game has been deleted successfully",
        });

        // Refresh the list after deletion
        fetchGames();
      } catch (error: any) {
        console.error("Error deleting game:", error);
        toast({
          title: "Error deleting game",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      const updatedGame = await gamesApi.update(editingGame!.id, {
        tournament: values.tournament,
        phase: values.phase,
        format: values.format,
        players: values.players,
        description_it: values.description_it,
        description_en: values.description_en,
        image_url: values.image_url,
        replay_url: values.replay_url,
        position: editingGame!.position
      });

      toast({
        title: "Game updated",
        description: "The game has been updated successfully",
      });

      setGames(games.map(g => g.id === editingGame!.id ? updatedGame : g));
      setEditingGame(null);
    } catch (error: any) {
      console.error("Error updating game:", error);
      toast({
        title: "Error updating game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddGame = () => {
    // Refresh all games to get the correct order
    fetchGames();
  };

  const toggleReordering = () => {
    setReordering(!reordering);
    // Close dialog when reordering
    if (!reordering) {
      setDialogOpen(false);
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = games.findIndex(game => game.id === id);
      if (
        (direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === games.length - 1)
      ) {
        return;
      }

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Get the two games we're swapping
      const game1 = games[currentIndex];
      const game2 = games[newIndex];
      
      // Swap their positions
      const tempPosition = game1.position;
      game1.position = game2.position;
      game2.position = tempPosition;
      
      // Update both games with swapped positions
      await gamesApi.swapPositions(game1, game2);
      
      // Refresh the games to get the updated order
      fetchGames();
      
    } catch (error: any) {
      console.error("Error updating position:", error);
      toast({
        title: "Error updating position",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    games,
    loading,
    editingGame,
    reordering,
    dialogOpen,
    setDialogOpen,
    fetchGames,
    handleEdit,
    handleDelete,
    handleUpdate,
    handleAddGame,
    toggleReordering,
    moveItem,
    setEditingGame
  };
};
