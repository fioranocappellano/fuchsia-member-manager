import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import FAQManager from "../components/admin/FAQManager";
import FooterResourceManager from "../components/admin/FooterResourceManager";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Plus, Save, X, Edit, Trash2, Users, Shield, Award, Gamepad2, HelpCircle, Link2, Layout, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "../components/Navbar";

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
    <Card className="admin-card mb-6">
      <CardHeader className="admin-card-header">
        <CardTitle className="admin-card-title">
          <Plus size={18} /> Add New Team Member
        </CardTitle>
      </CardHeader>
      <CardContent className="admin-card-content">
        <form onSubmit={handleSubmit} className="admin-form space-y-4">
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter member name"
            />
          </div>
          <div>
            <label>Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              placeholder="Enter image URL"
            />
          </div>
          <div>
            <label>Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              placeholder="Enter role"
            />
          </div>
          <div>
            <label>Join Date</label>
            <input
              type="text"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              placeholder="e.g. September 2015"
            />
          </div>
          <div>
            <label>Achievements (one per line)</label>
            <textarea
              className="min-h-[120px]"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              placeholder="Enter each achievement on a new line"
              required
            />
          </div>
          <Button type="submit" className="w-full add-button">
            <Plus size={16} /> Add Member
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
          <Award size={20} className="text-jf-purple" /> Team Members Management
        </h2>
        <Button className="add-button">
          <Plus size={18} /> Add Member
        </Button>
      </div>
      
      <AddMemberForm onAddMember={handleAddMember} />
      
      <h2 className="text-xl font-bold mb-4 text-white/90">Current Team Members</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jf-purple"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {members.map((member) => (
            <Card key={member.id} className="member-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/4 flex justify-center">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="admin-avatar" 
                    />
                  </div>
                  <div className="w-full md:w-3/4">
                    {editingMember && editingMember.id === member.id ? (
                      <div className="admin-form space-y-4">
                        <div>
                          <label>Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label>Image URL</label>
                          <input
                            type="text"
                            value={editImage}
                            onChange={(e) => setEditImage(e.target.value)}
                          />
                        </div>
                        <div>
                          <label>Role</label>
                          <input
                            type="text"
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                          />
                        </div>
                        <div>
                          <label>Join Date</label>
                          <input
                            type="text"
                            value={editJoinDate}
                            onChange={(e) => setEditJoinDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label>Achievements (one per line)</label>
                          <textarea
                            className="min-h-[120px]"
                            value={editAchievements}
                            onChange={(e) => setEditAchievements(e.target.value)}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleUpdate} className="admin-button-primary">
                            <Save size={16} /> Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingMember(null)}
                            className="admin-button-secondary"
                          >
                            <X size={16} /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="member-name">{member.name}</h3>
                        <p className="member-role">{member.role}</p>
                        {member.join_date && (
                          <p className="member-meta">Joined: {member.join_date}</p>
                        )}
                        <h4 className="font-semibold mb-2 text-white/80">Achievements:</h4>
                        <ul className="member-achievements">
                          {member.achievements.map((achievement, idx) => (
                            <li key={idx} className="text-gray-300">• {achievement}</li>
                          ))}
                        </ul>
                        <div className="flex space-x-2 mt-4">
                          <Button 
                            onClick={() => handleEdit(member)}
                            className="edit-button"
                          >
                            <Edit size={16} /> Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={() => handleDelete(member.id)}
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

      if (error) throw error;

      toast({
        title: isCurrentlyActive ? "Admin deactivated" : "Admin activated",
        description: isCurrentlyActive 
          ? "The admin has been deactivated successfully"
          : "The admin has been activated successfully",
      });

      fetchAdmins();
    } catch (error) {
      console.error("Error updating admin status:", error);
      toast({
        title: "Error updating admin",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (id === firstAdmin) {
      toast({
        title: "Cannot delete first admin",
        description: "The first registered admin cannot be deleted for security reasons",
        variant: "destructive",
      });
      return;
    }
    
    if (id === user?.id) {
      toast({
        title: "Cannot delete yourself",
        description: "You cannot remove your own admin privileges",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const { error } = await supabase
          .from('admins')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Admin deleted",
          description: "The admin has been deleted successfully",
        });

        fetchAdmins();
      } catch (error) {
        console.error("Error deleting admin:", error);
        toast({
          title: "Error deleting admin",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield size={20} className="text-jf-purple" /> Admin Management
        </h2>
      </div>
      
      <Card className="admin-card mb-6">
        <CardHeader className="admin-card-header">
          <CardTitle className="admin-card-title">
            <Plus size={18} /> Add New Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="admin-card-content">
          <div className="flex gap-2">
            <Input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 bg-black/50 border-white/10 text-white"
            />
            <Button onClick={handleAddAdmin} className="add-button">
              <Plus size={16} /> Add Admin
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Note: The user must already have an account in the system
          </p>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-bold mb-4 text-white/90">Current Admins</h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jf-purple"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {admins.length === 0 ? (
            <Card className="admin-card">
              <CardContent className="admin-card-content">
                <p className="text-center py-8 text-gray-400">No admins found</p>
              </CardContent>
            </Card>
          ) : (
            admins.map((admin) => (
              <Card key={admin.id} className="admin-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{admin.email}</h3>
                      <p className="text-sm text-gray-400">ID: {admin.id}</p>
                      <div className="mt-1">
                        {admin.is_active ? (
                          <span className="status-badge status-active">
                            Active
                          </span>
                        ) : (
                          <span className="status-badge status-inactive">
                            Inactive
                          </span>
                        )}
                        {admin.id === firstAdmin && (
                          <span className="status-badge bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-2">
                            Primary Admin
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleAdminStatus(admin.id, admin.is_active)}
                        className={admin.is_active ? "bg-white/10 hover:bg-white/15 text-white" : "bg-green-500/20 hover:bg-green-500/30 text-green-300"}
                        disabled={admin.id === firstAdmin}
                      >
                        {admin.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="delete-button"
                        disabled={admin.id === user?.id || admin.id === firstAdmin}
                      >
                        <Trash2 size={16} /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <h2 className="text-xl font-bold my-6 text-white/90">Registered Users</h2>
      <Card className="admin-card">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-black/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Admin Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => {
                const isAdmin = admins.some(admin => admin.id === user.id && admin.is_active);
                const isPrimaryAdmin = user.id === firstAdmin;
                return (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-sm text-white">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{user.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isAdmin && isPrimaryAdmin ? (
                        <span className="status-badge bg-amber-500/20 text-amber-300 border border-amber-500/30">Primary Admin</span>
                      ) : isAdmin ? (
                        <span className="status-badge status-active">Admin</span>
                      ) : (
                        <span className="status-badge bg-gray-500/20 text-gray-300 border border-gray-500/30">User</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [adminStatus, setAdminStatus] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('id', user.id)
          .eq('is_active', true)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        setAdminStatus(!!data);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "Failed to verify admin permissions",
          variant: "destructive",
        });
      } finally {
        setCheckingAdmin(false);
      }
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user, toast]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Errore durante il logout",
        description: "Si è verificato un problema durante il logout",
        variant: "destructive",
      });
    }
  };

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jf-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jf-purple"></div>
      </div>
    );
  }

  if (!adminStatus) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-jf-dark">
          <div className="text-center text-white bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-xl">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="mb-6">You do not have permission to access this area.</p>
            <Button onClick={() => navigate("/")} className="bg-jf-purple hover:bg-jf-purple/90">Return to Home</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-container pt-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="admin-dashboard-header">
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="admin-logout-button"
              >
                <LogOut size={16} /> Logout
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")} 
                className="bg-black/30 border-white/10 text-white hover:bg-white/10"
              >
                Back to Site
              </Button>
            </div>
          </div>

          <Tabs defaultValue="members" className="w-full">
            <TabsList className="admin-tabs-header">
              <TabsTrigger value="members" className="admin-tabs-trigger">
                <Award size={16} className="mr-2" /> Team Members
              </TabsTrigger>
              <TabsTrigger value="games" className="admin-tabs-trigger">
                <Gamepad2 size={16} className="mr-2" /> Best Games
              </TabsTrigger>
              <TabsTrigger value="faqs" className="admin-tabs-trigger">
                <HelpCircle size={16} className="mr-2" /> FAQs
              </TabsTrigger>
              <TabsTrigger value="resources" className="admin-tabs-trigger">
                <Link2 size={16} className="mr-2" /> Resources
              </TabsTrigger>
              <TabsTrigger value="admins" className="admin-tabs-trigger">
                <Shield size={16} className="mr-2" /> Users & Admins
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="members" className="mt-6">
              <MemberManager />
            </TabsContent>
            
            <TabsContent value="games" className="mt-6">
              <GameManager />
            </TabsContent>
            
            <TabsContent value="faqs" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <HelpCircle size={20} className="text-jf-purple" /> FAQ Management
                </h2>
              </div>
              <FAQManager />
            </TabsContent>
            
            <TabsContent value="resources" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Link2 size={20} className="text-jf-purple" /> Resources Management
                </h2>
              </div>
              <FooterResourceManager />
            </TabsContent>
            
            <TabsContent value="admins" className="mt-6">
              <AdminManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
