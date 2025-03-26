
import { useState, useEffect } from 'react';
import { useToast } from '@/frontend/hooks/use-toast';
import { Member } from '@/frontend/types/api';
import { membersApi } from '@/backend/api';

/**
 * Hook for managing team members
 */
export function useMemberManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  // Load members on mount
  useEffect(() => {
    loadMembers();
  }, []);

  /**
   * Load all members from the API
   */
  const loadMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await membersApi.getAll();
      setMembers(data);
    } catch (err: any) {
      console.error('Error loading members:', err);
      setError(err.message || 'Failed to load members');
      toast({
        title: 'Error',
        description: 'Failed to load members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new member
   */
  const addMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      setLoading(true);
      setError('');
      
      const newMember = await membersApi.create(memberData);
      
      setMembers(prevMembers => [...prevMembers, newMember]);
      
      toast({
        title: 'Success',
        description: 'Member added successfully',
      });
      
      return newMember;
    } catch (err: any) {
      console.error('Error adding member:', err);
      setError(err.message || 'Failed to add member');
      toast({
        title: 'Error',
        description: 'Failed to add member',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing member
   */
  const updateMember = async (id: string, memberData: Partial<Member>) => {
    try {
      setLoading(true);
      setError('');
      
      const updatedMember = await membersApi.update(id, memberData);
      
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === id ? updatedMember : member
        )
      );
      
      if (selectedMember?.id === id) {
        setSelectedMember(updatedMember);
      }
      
      toast({
        title: 'Success',
        description: 'Member updated successfully',
      });
      
      return updatedMember;
    } catch (err: any) {
      console.error('Error updating member:', err);
      setError(err.message || 'Failed to update member');
      toast({
        title: 'Error',
        description: 'Failed to update member',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a member
   */
  const deleteMember = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      
      await membersApi.deleteMember(id);
      
      setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
      
      if (selectedMember?.id === id) {
        setSelectedMember(null);
      }
      
      toast({
        title: 'Success',
        description: 'Member deleted successfully',
      });
    } catch (err: any) {
      console.error('Error deleting member:', err);
      setError(err.message || 'Failed to delete member');
      toast({
        title: 'Error',
        description: 'Failed to delete member',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change the position of a member
   */
  const changePosition = async (id: string, direction: 'up' | 'down') => {
    try {
      setLoading(true);
      setError('');
      
      // Find the current member and the one to swap with
      const memberIndex = members.findIndex(m => m.id === id);
      if (memberIndex === -1) {
        throw new Error('Member not found');
      }
      
      let targetIndex;
      if (direction === 'up' && memberIndex > 0) {
        targetIndex = memberIndex - 1;
      } else if (direction === 'down' && memberIndex < members.length - 1) {
        targetIndex = memberIndex + 1;
      } else {
        // Already at the top or bottom
        setLoading(false);
        return;
      }
      
      const member1 = members[memberIndex];
      const member2 = members[targetIndex];
      
      // Swap positions using the API
      await membersApi.swapPositions(member1, member2);
      
      // Reload members to get the updated positions
      await loadMembers();
      
      toast({
        title: 'Success',
        description: `Member moved ${direction} successfully`,
      });
    } catch (err: any) {
      console.error('Error changing member position:', err);
      setError(err.message || 'Failed to change member position');
      toast({
        title: 'Error',
        description: 'Failed to change member position',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    members,
    selectedMember,
    setSelectedMember,
    loading,
    error,
    loadMembers,
    addMember,
    updateMember,
    deleteMember,
    changePosition,
  };
}
