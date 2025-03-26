
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Member } from "@/types/api";
import { membersApi } from "@/services/api";

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
      const fetchedMembers = await membersApi.getAll();
      setMembers(fetchedMembers);
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
  }, []);

  const handleEdit = (member: Member) => {
    setEditingMember(member);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await membersApi.delete(id);

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
    const achievementsArray = values.achievements
      .split("\n")
      .map((a: string) => a.trim())
      .filter((a: string) => a);

    try {
      const updatedMember = await membersApi.update(editingMember!.id, {
        name: values.name,
        image: values.image,
        role: values.role,
        join_date: values.joinDate,
        achievements: achievementsArray,
        smogon: values.smogon || null,
        position: editingMember!.position
      });

      toast({
        title: "Member updated",
        description: "The member has been updated successfully",
      });

      setMembers(members.map(m => m.id === editingMember!.id ? updatedMember : m));
      setEditingMember(null);
    } catch (error: any) {
      console.error("Error updating member:", error);
      toast({
        title: "Error updating member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddMember = () => {
    // Refresh all members to get the correct order
    fetchMembers();
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
      member1.position = member2.position;
      member2.position = tempPosition;
      
      // Update both members with swapped positions
      await membersApi.swapPositions(member1, member2);
      
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
