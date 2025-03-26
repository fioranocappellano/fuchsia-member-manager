
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Game } from "@/frontend/types/api";

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
      const { data, error } = await supabase
        .from("best_games")
        .select("*")
        .order("position", { ascending: true });

      if (error) throw error;
      
      // Ensure all games have required properties
      const processedGames = (data || []).map(game => ({
        ...game,
        winner: game.winner || "", // Add winner property if it doesn't exist
        updated_at: game.updated_at || game.created_at || new Date().toISOString()
      })) as Game[];
      
      setGames(processedGames);
    } catch (error: any) {
      console.error("Error fetching games:", error);
      toast({
        id: crypto.randomUUID(),
        title: "Error fetching games",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up a subscription for real-time updates
  useEffect(() => {
    fetchGames();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel("best_games-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "best_games" }, () => {
        fetchGames();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleEdit = (game: Game) => {
    setEditingGame(game);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        const { error } = await supabase
          .from("best_games")
          .delete()
          .eq("id", id);

        if (error) throw error;
        toast({
          id: crypto.randomUUID(),
          title: "Game deleted",
          description: "The game has been deleted successfully",
        });
        fetchGames();
      } catch (error: any) {
        console.error("Error deleting game:", error);
        toast({
          id: crypto.randomUUID(),
          title: "Error deleting game",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      const { error } = await supabase
        .from("best_games")
        .update({
          tournament: values.tournament,
          phase: values.phase,
          format: values.format,
          players: values.players,
          winner: values.winner || "",
          replay_url: values.replay_url,
          image_url: values.image_url || null,
          description_en: values.description_en,
          description_it: values.description_it,
        })
        .eq("id", editingGame!.id);

      if (error) throw error;
      toast({
        id: crypto.randomUUID(),
        title: "Game updated",
        description: "The game has been updated successfully",
      });
      setEditingGame(null);
      fetchGames();
    } catch (error: any) {
      console.error("Error updating game:", error);
      toast({
        id: crypto.randomUUID(),
        title: "Error updating game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddGame = async (values: any) => {
    try {
      const { count, error: countError } = await supabase
        .from("best_games")
        .select("*", { count: "exact" });

      if (countError) throw countError;
      
      const position = (count || 0) + 1;
      
      const { error } = await supabase
        .from("best_games")
        .insert({
          tournament: values.tournament || "",
          phase: values.phase || "",
          format: values.format || "",
          players: values.players || "",
          winner: values.winner || "",
          replay_url: values.replay_url || "",
          image_url: values.image_url || null,
          description_en: values.description_en || "",
          description_it: values.description_it || "",
          position,
        });

      if (error) throw error;
      toast({
        id: crypto.randomUUID(),
        title: "Game added",
        description: "The game has been added successfully",
      });
      setDialogOpen(false);
      fetchGames();
    } catch (error: any) {
      console.error("Error adding game:", error);
      toast({
        id: crypto.randomUUID(),
        title: "Error adding game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleReordering = () => {
    setReordering(!reordering);
    setDialogOpen(false);
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    try {
      // Find current game and its index
      const gameIndex = games.findIndex(game => game.id === id);
      if (gameIndex === -1) return;
      
      // Determine swap direction
      const newIndex = direction === 'up' ? gameIndex - 1 : gameIndex + 1;
      
      // Check if move is possible
      if (newIndex < 0 || newIndex >= games.length) return;
      
      // Get the two games we're swapping
      const game1 = games[gameIndex];
      const game2 = games[newIndex];
      
      // Swap positions
      const tempPosition = game1.position;
      
      // Update both games' positions in the database
      const { error: error1 } = await supabase
        .from("best_games")
        .update({ position: game2.position })
        .eq("id", game1.id);
        
      if (error1) throw error1;
      
      const { error: error2 } = await supabase
        .from("best_games")
        .update({ position: tempPosition })
        .eq("id", game2.id);
        
      if (error2) throw error2;
      
      // Refresh games list
      fetchGames();
    } catch (error: any) {
      console.error("Error moving game:", error);
      toast({
        id: crypto.randomUUID(),
        title: "Error moving game",
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
    handleEdit,
    handleDelete,
    handleUpdate,
    handleAddGame,
    toggleReordering,
    moveItem,
    setEditingGame,
    fetchGames
  };
};
