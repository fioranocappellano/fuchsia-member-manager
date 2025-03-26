
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "@/frontend/types/api";

export const useMemberManager = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [reordering, setReordering] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("position", { ascending: true });

      if (error) {
        throw error;
      }
      setMembers(data || []);
    } catch (error: any) {
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
    
    // Set up real-time subscription for changes
    const subscription = supabase
      .channel("members-changes")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "members",
      }, () => {
        fetchMembers();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleEdit = (member: Member) => {
    setEditingMember(member);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        const { error } = await supabase
          .from("members")
          .delete()
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Member deleted",
          description: "The member has been deleted successfully",
        });

        // Refresh the list after deletion
        fetchMembers();
      } catch (error: any) {
        console.error("Error deleting member:", error);
        toast({
          title: "Error deleting member",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async (values: any) => {
    const achievementsArray = Array.isArray(values.achievements) 
      ? values.achievements 
      : values.achievements
          .split("\n")
          .map((a: string) => a.trim())
          .filter((a: string) => a);

    try {
      const { error } = await supabase
        .from("members")
        .update({
          name: values.name,
          image: values.image,
          role: values.role,
          join_date: values.join_date,
          achievements: achievementsArray,
          smogon: values.smogon || null,
        })
        .eq("id", editingMember!.id);

      if (error) throw error;

      toast({
        title: "Member updated",
        description: "The member has been updated successfully",
      });

      setEditingMember(null);
      fetchMembers();
    } catch (error: any) {
      console.error("Error updating member:", error);
      toast({
        title: "Error updating member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async (values: any) => {
    try {
      // Get the count of current members for positioning
      const { count, error: countError } = await supabase
        .from("members")
        .select("*", { count: "exact" });

      if (countError) throw countError;
      
      const position = (count || 0) + 1;
      
      const achievementsArray = Array.isArray(values.achievements) 
        ? values.achievements 
        : values.achievements
            .split("\n")
            .map((a: string) => a.trim())
            .filter((a: string) => a);
      
      const { error } = await supabase
        .from("members")
        .insert({
          name: values.name,
          image: values.image,
          role: values.role,
          join_date: values.join_date,
          achievements: achievementsArray,
          smogon: values.smogon || null,
          position,
        });

      if (error) throw error;

      toast({
        title: "Member added",
        description: "The member has been added successfully",
      });

      setDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      console.error("Error adding member:", error);
      toast({
        title: "Error adding member",
        description: error.message,
        variant: "destructive",
      });
    }
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
      const currentIndex = members.findIndex(member => member.id === id);
      if (
        (direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === members.length - 1)
      ) {
        return;
      }

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Get the two members we're swapping
      const member1 = members[currentIndex];
      const member2 = members[newIndex];
      
      // Swap their positions
      const tempPosition = member1.position;

      // Update first member's position
      const { error: error1 } = await supabase
        .from("members")
        .update({ position: member2.position })
        .eq("id", member1.id);
        
      if (error1) throw error1;
      
      // Update second member's position
      const { error: error2 } = await supabase
        .from("members")
        .update({ position: tempPosition })
        .eq("id", member2.id);
        
      if (error2) throw error2;
      
      // Refresh the members to get the updated order
      fetchMembers();
      
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
    members,
    loading,
    editingMember,
    reordering,
    dialogOpen,
    setDialogOpen,
    fetchMembers,
    handleEdit,
    handleDelete,
    handleUpdate,
    handleAddMember,
    toggleReordering,
    moveItem,
    setEditingMember
  };
};
