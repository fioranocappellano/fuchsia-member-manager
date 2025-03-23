
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, Gamepad2, Plus, Save, Trash2, X, Link2, Image, Users, Info, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import AddGameForm from "./forms/AddGameForm";

const GameManager = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState(null);
  const [reordering, setReordering] = useState(false);
  const { toast } = useToast();
  
  const editForm = useForm({
    defaultValues: {
      format: "",
      phase: "",
      tournament: "",
      imageUrl: "",
      replayUrl: "",
      players: "",
      descriptionEn: "",
      descriptionIt: ""
    }
  });

  const fetchGames = async () => {
    try {
      setLoading(true);
      // Use only id-based ordering for now until position field is added to DB
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
    editForm.reset({
      format: game.format,
      phase: game.phase,
      tournament: game.tournament,
      imageUrl: game.image_url,
      replayUrl: game.replay_url,
      players: game.players,
      descriptionEn: game.description_en,
      descriptionIt: game.description_it
    });
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

  const handleUpdate = async (values) => {
    try {
      const { data, error } = await supabase
        .from('best_games')
        .update({
          format: values.format,
          phase: values.phase,
          tournament: values.tournament,
          image_url: values.imageUrl,
          replay_url: values.replayUrl,
          players: values.players,
          description_en: values.descriptionEn,
          description_it: values.descriptionIt,
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

  const toggleReordering = () => {
    setReordering(!reordering);
  };

  const moveItem = async (id, direction) => {
    const currentIndex = games.findIndex(game => game.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === games.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newGames = [...games];
    
    // Just swap the array positions for now
    [newGames[currentIndex], newGames[newIndex]] = [newGames[newIndex], newGames[currentIndex]];
    
    try {
      // Get the complete data for both games
      const game1 = games[currentIndex];
      const game2 = games[newIndex];
      
      // Update the first game
      const { error: error1 } = await supabase
        .from('best_games')
        .update({
          format: game1.format,
          phase: game1.phase,
          tournament: game1.tournament,
          image_url: game1.image_url,
          replay_url: game1.replay_url,
          players: game1.players,
          description_en: game1.description_en,
          description_it: game1.description_it,
          // Add position if/when you add it to your database
        })
        .eq('id', game1.id);
        
      if (error1) throw error1;
      
      // Update the second game
      const { error: error2 } = await supabase
        .from('best_games')
        .update({
          format: game2.format,
          phase: game2.phase,
          tournament: game2.tournament,
          image_url: game2.image_url,
          replay_url: game2.replay_url,
          players: game2.players,
          description_en: game2.description_en,
          description_it: game2.description_it,
          // Add position if/when you add it to your database
        })
        .eq('id', game2.id);
        
      if (error2) throw error2;

      // Update local state for immediate UI update
      setGames(newGames);
    } catch (error) {
      console.error("Error updating position:", error);
      toast({
        title: "Error updating position",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gamepad2 size={20} className="text-[#D946EF]" /> Best Games Management
        </h2>
        <div className="flex gap-3">
          <Button 
            onClick={toggleReordering}
            className={`${reordering ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black/30 hover:bg-black/50'} 
              border border-white/10 text-white transition-all duration-200`}
          >
            {reordering ? 'Done Reordering' : 'Reorder Games'}
          </Button>
          <Button className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white">
            <Plus size={18} /> Add Game
          </Button>
        </div>
      </div>
      
      {!reordering && <AddGameForm onAddGame={handleAddGame} />}
      
      <h2 className="text-xl font-bold mb-4 text-white/90">
        {reordering ? 'Drag or use arrows to reorder games' : 'Current Best Games'}
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D946EF]"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {games.map((game) => (
            <Card key={game.id} className={`border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 ${reordering ? 'border-blue-500/30' : 'hover:shadow-lg hover:shadow-[#D946EF]/5'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {reordering && (
                    <div className="absolute right-4 top-4 flex flex-col gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveItem(game.id, 'up')}
                        disabled={games.indexOf(game) === 0}
                        className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      >
                        <ArrowUp size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => moveItem(game.id, 'down')}
                        disabled={games.indexOf(game) === games.length - 1}
                        className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      >
                        <ArrowDown size={16} />
                      </Button>
                    </div>
                  )}
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
                        <Form {...editForm}>
                          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={editForm.control}
                                name="format"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-300">
                                      Formato
                                    </FormLabel>
                                    <FormControl>
                                      <Input 
                                        {...field} 
                                        required 
                                        placeholder="es. VGC 2023" 
                                        className="bg-black/60 border-white/10 text-white"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="phase"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-300">
                                      Fase
                                    </FormLabel>
                                    <FormControl>
                                      <Input 
                                        {...field} 
                                        required 
                                        placeholder="es. Finali" 
                                        className="bg-black/60 border-white/10 text-white"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={editForm.control}
                              name="tournament"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                    <Info size={14} className="text-[#D946EF]" /> Torneo
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      required 
                                      placeholder="Nome del torneo" 
                                      className="bg-black/60 border-white/10 text-white"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={editForm.control}
                                name="imageUrl"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                      <Image size={14} className="text-[#D946EF]" /> URL Immagine
                                    </FormLabel>
                                    <FormControl>
                                      <Input 
                                        {...field} 
                                        required 
                                        placeholder="Inserisci URL immagine" 
                                        className="bg-black/60 border-white/10 text-white"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="replayUrl"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                      <Link2 size={14} className="text-[#D946EF]" /> URL Replay
                                    </FormLabel>
                                    <FormControl>
                                      <Input 
                                        {...field} 
                                        required 
                                        placeholder="Inserisci URL replay" 
                                        className="bg-black/60 border-white/10 text-white"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={editForm.control}
                              name="players"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                    <Users size={14} className="text-[#D946EF]" /> Giocatori
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      {...field} 
                                      required 
                                      placeholder="es. Giocatore 1 vs Giocatore 2" 
                                      className="bg-black/60 border-white/10 text-white"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={editForm.control}
                              name="descriptionEn"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-300">
                                    Descrizione (Inglese)
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      required 
                                      placeholder="Inserisci descrizione in inglese" 
                                      className="min-h-[100px] bg-black/60 border-white/10 text-white"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={editForm.control}
                              name="descriptionIt"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-300">
                                    Descrizione (Italiano)
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      required 
                                      placeholder="Inserisci descrizione in italiano" 
                                      className="min-h-[100px] bg-black/60 border-white/10 text-white"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex space-x-2 pt-2">
                              <Button 
                                type="submit" 
                                className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white flex items-center gap-2"
                              >
                                <Save size={16} /> Salva Modifiche
                              </Button>
                              <Button 
                                type="button"
                                variant="outline" 
                                onClick={() => setEditingGame(null)}
                                className="border-white/10 bg-black/20 hover:bg-white/5 text-white flex items-center gap-2"
                              >
                                <X size={16} /> Annulla
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </div>
                    ) : (
                      <div>
                        {reordering && (
                          <div className="mb-3 inline-block bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded text-xs font-medium">
                            Position: {games.indexOf(game) + 1}
                          </div>
                        )}
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
                        {!reordering && (
                          <div className="flex space-x-2 mt-4">
                            <Button 
                              onClick={() => handleEdit(game)}
                              className="bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/20 text-white"
                            >
                              <Edit size={16} className="mr-1.5" /> Edit
                            </Button>
                            <Button 
                              onClick={() => handleDelete(game.id)}
                              className="bg-red-500/70 hover:bg-red-500/80 text-white"
                            >
                              <Trash2 size={16} className="mr-1.5" /> Delete
                            </Button>
                          </div>
                        )}
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
