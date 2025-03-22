
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, Gamepad2, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddGameForm from "./forms/AddGameForm";

const GameManager = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState(null);
  const [editFormat, setEditFormat] = useState("");
  const [editPhase, setEditPhase] = useState("");
  const [editTournament, setEditTournament] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editReplayUrl, setEditReplayUrl] = useState("");
  const [editPlayers, setEditPlayers] = useState("");
  const [editDescriptionEn, setEditDescriptionEn] = useState("");
  const [editDescriptionIt, setEditDescriptionIt] = useState("");
  const { toast } = useToast();

  const fetchGames = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('best_games')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
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

  const handleEdit = (game) => {
    setEditingGame(game);
    setEditFormat(game.format);
    setEditPhase(game.phase);
    setEditTournament(game.tournament);
    setEditImageUrl(game.image_url);
    setEditReplayUrl(game.replay_url);
    setEditPlayers(game.players);
    setEditDescriptionEn(game.description_en);
    setEditDescriptionIt(game.description_it);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        const { error } = await supabase
          .from('best_games')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Game deleted",
          description: "The game has been deleted successfully",
        });

        setGames(games.filter(game => game.id !== id));
      } catch (error) {
        console.error("Error deleting game:", error);
        toast({
          title: "Error deleting game",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('best_games')
        .update({
          format: editFormat,
          phase: editPhase,
          tournament: editTournament,
          image_url: editImageUrl,
          replay_url: editReplayUrl,
          players: editPlayers,
          description_en: editDescriptionEn,
          description_it: editDescriptionIt,
        })
        .eq('id', editingGame.id)
        .select();

      if (error) throw error;

      toast({
        title: "Game updated",
        description: "The game has been updated successfully",
      });

      setGames(games.map(g => g.id === editingGame.id ? data[0] : g));
      setEditingGame(null);
    } catch (error) {
      console.error("Error updating game:", error);
      toast({
        title: "Error updating game",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddGame = (newGame) => {
    setGames([newGame, ...games]);
    fetchGames();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gamepad2 size={20} className="text-[#D946EF]" /> Best Games Management
        </h2>
        <Button className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white">
          <Plus size={18} /> Add Game
        </Button>
      </div>
      
      <AddGameForm onAddGame={handleAddGame} />
      
      <h2 className="text-xl font-bold mb-4 text-white/90">Current Best Games</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D946EF]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {games.map((game) => (
            <Card key={game.id} className="border border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <img 
                      src={game.image_url} 
                      alt={game.players} 
                      className="w-full h-auto rounded-lg object-cover max-h-[200px] border border-white/10" 
                    />
                  </div>
                  <div className="w-full md:w-2/3">
                    {editingGame && editingGame.id === game.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Format</label>
                            <input
                              type="text"
                              className="enhanced-input"
                              value={editFormat}
                              onChange={(e) => setEditFormat(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="form-label">Phase</label>
                            <input
                              type="text"
                              className="enhanced-input"
                              value={editPhase}
                              onChange={(e) => setEditPhase(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Tournament</label>
                          <input
                            type="text"
                            className="enhanced-input"
                            value={editTournament}
                            onChange={(e) => setEditTournament(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="form-label">Image URL</label>
                            <input
                              type="text"
                              className="enhanced-input"
                              value={editImageUrl}
                              onChange={(e) => setEditImageUrl(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="form-label">Replay URL</label>
                            <input
                              type="text"
                              className="enhanced-input"
                              value={editReplayUrl}
                              onChange={(e) => setEditReplayUrl(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Players</label>
                          <input
                            type="text"
                            className="enhanced-input"
                            value={editPlayers}
                            onChange={(e) => setEditPlayers(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="form-label">Description (English)</label>
                          <textarea
                            className="enhanced-textarea min-h-[100px]"
                            value={editDescriptionEn}
                            onChange={(e) => setEditDescriptionEn(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="form-label">Description (Italian)</label>
                          <textarea
                            className="enhanced-textarea min-h-[100px]"
                            value={editDescriptionIt}
                            onChange={(e) => setEditDescriptionIt(e.target.value)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleUpdate} className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white">
                            <Save size={16} /> Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingGame(null)}
                            className="border-white/10 hover:bg-white/5 text-white"
                          >
                            <X size={16} /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="status-badge bg-blue-500/20 text-blue-300 border border-blue-500/30">{game.format}</span>
                          <span className="status-badge bg-purple-500/20 text-purple-300 border border-purple-500/30">{game.phase}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{game.players}</h3>
                        <p className="text-[#D946EF] text-sm mb-3">{game.tournament}</p>
                        <div className="mb-4">
                          <h4 className="font-semibold mb-1 text-white/80">Description (EN):</h4>
                          <p className="text-sm text-gray-300">{game.description_en}</p>
                        </div>
                        <div className="mb-4">
                          <h4 className="font-semibold mb-1 text-white/80">Description (IT):</h4>
                          <p className="text-sm text-gray-300">{game.description_it}</p>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button 
                            onClick={() => handleEdit(game)}
                            className="bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/20 text-white"
                          >
                            <Edit size={16} /> Edit
                          </Button>
                          <Button 
                            onClick={() => handleDelete(game.id)}
                            className="bg-red-500/70 hover:bg-red-500/80 text-white"
                          >
                            <Trash2 size={16} /> Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameManager;
