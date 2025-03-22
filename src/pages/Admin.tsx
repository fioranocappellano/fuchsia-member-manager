import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import FAQManager from "@/components/admin/FAQManager";
import FooterResourceManager from "@/components/admin/FooterResourceManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, Save, X, Edit, Trash2, Users, Shield, Award, Gamepad2, HelpCircle, Link2, Layout, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const AddMemberForm = ({ onAddMember }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [achievements, setAchievements] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const achievementsArray = achievements
        .split("\n")
        .map((a) => a.trim())
        .filter((a) => a);

      const { data, error } = await supabase.from("members").insert({
        name,
        image,
        role,
        join_date: joinDate,
        achievements: achievementsArray,
      }).select();

      if (error) throw error;

      toast({
        title: "Member added",
        description: "The member has been added successfully",
      });

      setName("");
      setImage("");
      setRole("");
      setJoinDate("");
      setAchievements("");

      if (onAddMember && data) {
        onAddMember(data[0]);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast({
        title: "Error adding member",
        description: error.message || "There was a problem adding the member",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-xl mb-8 overflow-hidden transition-all duration-300 hover:shadow-[#D946EF]/10">
      <CardHeader className="bg-gradient-to-r from-[#D946EF]/20 to-transparent border-b border-white/10 px-6 py-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Plus size={18} className="text-[#D946EF]" /> Add New Team Member
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter member name"
                className="enhanced-input w-full"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                placeholder="Enter image URL"
                className="enhanced-input w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                placeholder="Enter role"
                className="enhanced-input w-full"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Join Date</label>
              <input
                type="text"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                placeholder="e.g. September 2015"
                className="enhanced-input w-full"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Achievements (one per line)</label>
            <textarea
              className="enhanced-textarea w-full"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="Enter each achievement on a new line"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#D946EF] hover:bg-[#D946EF]/90 text-white font-medium py-3 rounded-lg shadow-lg shadow-[#D946EF]/20 flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-xl hover:shadow-[#D946EF]/30"
          >
            <Plus size={18} />
            <span>Add Member</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const MemberManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editJoinDate, setEditJoinDate] = useState("");
  const [editAchievements, setEditAchievements] = useState("");
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error fetching members",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEdit = (member) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditImage(member.image);
    setEditRole(member.role);
    setEditJoinDate(member.join_date || "");
    setEditAchievements(member.achievements.join("\n"));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        const { error } = await supabase
          .from('members')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Member deleted",
          description: "The member has been deleted successfully",
        });

        setMembers(members.filter(member => member.id !== id));
      } catch (error) {
        console.error("Error deleting member:", error);
        toast({
          title: "Error deleting member",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const achievementsArray = editAchievements
        .split("\n")
        .map((a) => a.trim())
        .filter((a) => a);

      const { data, error } = await supabase
        .from('members')
        .update({
          name: editName,
          image: editImage,
          role: editRole,
          join_date: editJoinDate,
          achievements: achievementsArray,
        })
        .eq('id', editingMember.id)
        .select();

      if (error) throw error;

      toast({
        title: "Member updated",
        description: "The member has been updated successfully",
      });

      setMembers(members.map(m => m.id === editingMember.id ? data[0] : m));
      setEditingMember(null);
    } catch (error) {
      console.error("Error updating member:", error);
      toast({
        title: "Error updating member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddMember = (newMember) => {
    setMembers([...members, newMember]);
    fetchMembers();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award size={24} className="text-[#D946EF]" /> Team Members Management
        </h2>
        <Button className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-[#D946EF]/20 transition-all duration-300">
          <Plus size={18} className="mr-2" /> Add Member
        </Button>
      </div>
      
      <AddMemberForm onAddMember={handleAddMember} />
      
      <h2 className="text-xl font-bold mb-4 text-white/90 mt-8">Current Team Members</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D946EF]"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {members.map((member) => (
            <Card key={member.id} className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg hover:shadow-[#D946EF]/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/4 flex justify-center">
                    <div className="w-24 h-24 overflow-hidden rounded-lg border-2 border-[#D946EF]/30 shadow-lg">
                      <AspectRatio ratio={1} className="bg-black/40">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  </div>
                  <div className="w-full md:w-3/4">
                    {editingMember && editingMember.id === member.id ? (
                      <div className="space-y-4">
                        <div className="form-group">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="enhanced-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Image URL</label>
                          <input
                            type="text"
                            className="enhanced-input"
                            value={editImage}
                            onChange={(e) => setEditImage(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Role</label>
                          <input
                            type="text"
                            className="enhanced-input"
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Join Date</label>
                          <input
                            type="text"
                            className="enhanced-input"
                            value={editJoinDate}
                            onChange={(e) => setEditJoinDate(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Achievements (one per line)</label>
                          <textarea
                            className="enhanced-textarea"
                            value={editAchievements}
                            onChange={(e) => setEditAchievements(e.target.value)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleUpdate} className="bg-[#D946EF] hover:bg-[#D946EF]/90 text-white">
                            <Save size={16} className="mr-1.5" /> Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingMember(null)}
                            className="border-white/10 hover:bg-white/5 text-white"
                          >
                            <X size={16} className="mr-1.5" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-[#D946EF] text-sm mb-2">{member.role}</p>
                        <p className="text-xs text-gray-400 mb-3">Joined: {member.join_date}</p>
                        <h4 className="font-semibold mb-2 text-white/80">Achievements:</h4>
                        <ul className="space-y-1 text-sm">
                          {member.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-gray-300">• {achievement}</li>
                          ))}
                        </ul>
                        <div className="flex space-x-2 mt-4">
                          <Button 
                            onClick={() => handleEdit(member)}
                            className="bg-black/30 hover:bg-black/50 border border-white/10 hover:border-white/20 text-white transition-all duration-200"
                          >
                            <Edit size={16} className="mr-1.5" /> Edit
                          </Button>
                          <Button 
                            onClick={() => handleDelete(member.id)}
                            className="bg-red-500/70 hover:bg-red-500/80 text-white transition-all duration-200"
                          >
                            <Trash2 size={16} className="mr-1.5" /> Delete
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
    <Card className="admin-card mb-6">
      <CardHeader className="admin-card-header">
        <CardTitle className="admin-card-title">
          <Plus size={18} /> Add New Best Game
        </CardTitle>
      </CardHeader>
      <CardContent className="admin-card-content">
        <form onSubmit={handleSubmit} className="admin-form space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Format</label>
              <input
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                required
                placeholder="e.g. VGC 2023"
              />
            </div>
            <div>
              <label>Phase</label>
              <input
                type="text"
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                required
                placeholder="e.g. Finals"
              />
            </div>
          </div>
          <div>
            <label>Tournament</label>
            <input
              type="text"
              value={tournament}
              onChange={(e) => setTournament(e.target.value)}
              required
              placeholder="Tournament name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <label>Replay URL</label>
              <input
                type="text"
                value={replayUrl}
                onChange={(e) => setReplayUrl(e.target.value)}
                required
                placeholder="Enter replay URL"
              />
            </div>
          </div>
          <div>
            <label>Players</label>
            <input
              type="text"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              required
              placeholder="e.g. Player 1 vs Player 2"
            />
          </div>
          <div>
            <label>Description (English)</label>
            <textarea
              className="min-h-[100px]"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              required
              placeholder="Enter description in English"
            />
          </div>
          <div>
            <label>Description (Italian)</label>
            <textarea
              className="min-h-[100px]"
              value={descriptionIt}
              onChange={(e) => setDescriptionIt(e.target.value)}
              required
              placeholder="Enter description in Italian"
            />
          </div>
          <Button type="submit" className="w-full add-button">
            <Plus size={16} /> Add Game
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

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
          <Gamepad2 size={20} className="text-jf-purple" /> Best Games Management
        </h2>
        <Button className="add-button">
          <Plus size={18} /> Add Game
        </Button>
      </div>
      
      <AddGameForm onAddGame={handleAddGame} />
      
      <h2 className="text-xl font-bold mb-4 text-white/90">Current Best Games</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jf-purple"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {games.map((game) => (
            <Card key={game.id} className="admin-card">
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
                      <div className="admin-form space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label>Format</label>
                            <input
                              type="text"
                              value={editFormat}
                              onChange={(e) => setEditFormat(e.target.value)}
                            />
                          </div>
                          <div>
                            <label>Phase</label>
                            <input
                              type="text"
                              value={editPhase}
                              onChange={(e) => setEditPhase(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label>Tournament</label>
                          <input
                            type="text"
                            value={editTournament}
                            onChange={(e) => setEditTournament(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label>Image URL</label>
                            <input
                              type="text"
                              value={editImageUrl}
                              onChange={(e) => setEditImageUrl(e.target.value)}
                            />
                          </div>
                          <div>
                            <label>Replay URL</label>
                            <input
                              type="text"
                              value={editReplayUrl}
                              onChange={(e) => setEditReplayUrl(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <label>Players</label>
                          <input
                            type="text"
                            value={editPlayers}
                            onChange={(e) => setEditPlayers(e.target.value)}
                          />
                        </div>
                        <div>
                          <label>Description (English)</label>
                          <textarea
                            className="min-h-[100px]"
                            value={editDescriptionEn}
                            onChange={(e) => setEditDescriptionEn(e.target.value)}
                          />
                        </div>
                        <div>
                          <label>Description (Italian)</label>
                          <textarea
                            className="min-h-[100px]"
                            value={editDescriptionIt}
                            onChange={(e) => setEditDescriptionIt(e.target.value)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleUpdate} className="admin-button-primary">
                            <Save size={16} /> Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingGame(null)}
                            className="admin-button-secondary"
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
                        <h3 className="member-name mb-2">{game.players}</h3>
                        <p className="text-jf-purple text-sm mb-3">{game.tournament}</p>
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
                            className="edit-button"
                          >
                            <Edit size={16} /> Edit
                          </Button>
                          <Button 
                            onClick={() => handleDelete(game.id)}
                            className="delete-button"
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

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const [firstAdmin, setFirstAdmin] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setAdmins(data || []);
      
      if (data && data.length > 0) {
        setFirstAdmin(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast({
        title: "Error fetching admins",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        if (user) {
          setUsers([{
            id: user.id,
            email: user.email,
            created_at: user.created_at,
          }]);
        }
        return;
      }
      
      setUsers(data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
  }, []);

  const handleAddAdmin = async () => {
    if (!newAdminEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const matchedUser = users.find(u => u.email === newAdminEmail);
      
      if (!matchedUser) {
        toast({
          title: "User not found",
          description: "No user with that email exists in the system",
          variant: "destructive",
        });
        return;
      }

      const isAlreadyAdmin = admins.some(admin => admin.id === matchedUser.id);
      
      if (isAlreadyAdmin) {
        toast({
          title: "Already an admin",
          description: "This user is already an admin",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('admins')
        .insert({
          id: matchedUser.id,
          email: matchedUser.email,
          is_active: true
        })
        .select();

      if (error) throw error;

      toast({
        title: "Admin added",
        description: "The admin has been added successfully",
      });

      setNewAdminEmail("");
      fetchAdmins();
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        title: "Error adding admin",
        description: error.message || "There was a problem adding the admin",
        variant: "destructive",
      });
    }
  };

  const handleToggleAdminStatus = async (id, isCurrentlyActive) => {
    if (id === firstAdmin) {
      toast({
        title: "Cannot deactivate first admin",
        description: "The first registered admin cannot be deactivated for security reasons",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('admins')
        .update({ is_active: !isCurrentlyActive })
        .eq('id', id);

      if
