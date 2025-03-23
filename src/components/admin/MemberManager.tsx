
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Award, Edit, Plus, Save, Trash2, X, User, Calendar, ListChecks, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import AddMemberForm from "./forms/AddMemberForm";

const MemberManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const { toast } = useToast();
  
  const editForm = useForm({
    defaultValues: {
      name: "",
      image: "",
      role: "",
      joinDate: "",
      achievements: ""
    }
  });

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
    editForm.reset({
      name: member.name,
      image: member.image,
      role: member.role,
      joinDate: member.join_date || "",
      achievements: member.achievements.join("\n")
    });
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

  const handleUpdate = async (values) => {
    try {
      const achievementsArray = values.achievements
        .split("\n")
        .map((a) => a.trim())
        .filter((a) => a);

      const { data, error } = await supabase
        .from('members')
        .update({
          name: values.name,
          image: values.image,
          role: values.role,
          join_date: values.joinDate,
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
                        <Form {...editForm}>
                          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={editForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                      <User size={14} className="text-[#D946EF]" /> Nome
                                    </FormLabel>
                                    <FormControl>
                                      <Input 
                                        {...field} 
                                        required 
                                        placeholder="Inserisci nome del membro" 
                                        className="bg-black/60 border-white/10 text-white"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="image"
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
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={editForm.control}
                                name="role"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-300">
                                      Ruolo
                                    </FormLabel>
                                    <FormControl>
                                      <Input 
                                        {...field} 
                                        required 
                                        placeholder="Inserisci ruolo" 
                                        className="bg-black/60 border-white/10 text-white"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="joinDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                      <Calendar size={14} className="text-[#D946EF]" /> Data Ingresso
                                    </FormLabel>
                                    <FormControl>
                                      <Input 
                                        {...field} 
                                        placeholder="es. Settembre 2015" 
                                        className="bg-black/60 border-white/10 text-white"
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={editForm.control}
                              name="achievements"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                                    <ListChecks size={14} className="text-[#D946EF]" /> Risultati (uno per riga)
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      {...field} 
                                      required 
                                      placeholder="Inserisci ogni risultato su una nuova riga" 
                                      className="min-h-[120px] bg-black/60 border-white/10 text-white"
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
                                onClick={() => setEditingMember(null)}
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

export default MemberManager;
