
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default AddMemberForm;
