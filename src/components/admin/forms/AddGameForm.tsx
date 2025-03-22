
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddGameForm = ({ onAddGame }) => {
  const [format, setFormat] = useState("");
  const [phase, setPhase] = useState("");
  const [tournament, setTournament] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [replayUrl, setReplayUrl] = useState("");
  const [players, setPlayers] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionIt, setDescriptionIt] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from("best_games").insert({
        format,
        phase,
        tournament,
        image_url: imageUrl,
        replay_url: replayUrl,
        players,
        description_en: descriptionEn,
        description_it: descriptionIt,
      }).select();

      if (error) throw error;

      toast({
        title: "Game added",
        description: "The game has been added successfully",
      });

      setFormat("");
      setPhase("");
      setTournament("");
      setImageUrl("");
      setReplayUrl("");
      setPlayers("");
      setDescriptionEn("");
      setDescriptionIt("");

      if (onAddGame && data) {
        onAddGame(data[0]);
      }
    } catch (error) {
      console.error("Error adding game:", error);
      toast({
        title: "Error adding game",
        description: error.message || "There was a problem adding the game",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm mb-6">
      <CardHeader className="bg-gradient-to-r from-[#D946EF]/20 to-transparent border-b border-white/10 px-6 py-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Plus size={18} className="text-[#D946EF]" /> Add New Best Game
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Format</label>
              <input
                type="text"
                className="enhanced-input"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                required
                placeholder="e.g. VGC 2023"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phase</label>
              <input
                type="text"
                className="enhanced-input"
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                required
                placeholder="e.g. Finals"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tournament</label>
            <input
              type="text"
              className="enhanced-input"
              value={tournament}
              onChange={(e) => setTournament(e.target.value)}
              required
              placeholder="Tournament name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="enhanced-input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                placeholder="Enter image URL"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Replay URL</label>
              <input
                type="text"
                className="enhanced-input"
                value={replayUrl}
                onChange={(e) => setReplayUrl(e.target.value)}
                required
                placeholder="Enter replay URL"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Players</label>
            <input
              type="text"
              className="enhanced-input"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              required
              placeholder="e.g. Player 1 vs Player 2"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (English)</label>
            <textarea
              className="enhanced-textarea min-h-[100px]"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              required
              placeholder="Enter description in English"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Italian)</label>
            <textarea
              className="enhanced-textarea min-h-[100px]"
              value={descriptionIt}
              onChange={(e) => setDescriptionIt(e.target.value)}
              required
              placeholder="Enter description in Italian"
            />
          </div>
          <Button type="submit" className="w-full bg-[#D946EF] hover:bg-[#D946EF]/90 text-white">
            <Plus size={16} className="mr-1.5" /> Add Game
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddGameForm;
