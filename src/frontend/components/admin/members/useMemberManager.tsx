
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Member } from '@/frontend/types/api';
import { membersApi } from '@/backend/api';

/**
 * Hook for managing team members
 */
export const useMemberManager = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await membersApi.getAll();
      setMembers(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching members:', err);
      setError(err.message || 'Failed to load members');
      toast({
        id: crypto.randomUUID(),
        title: 'Error',
        description: err.message || 'Failed to load team members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const createMember = async (memberData: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await membersApi.create(memberData);
      toast({
        id: crypto.randomUUID(),
        title: 'Success',
        description: 'Member added successfully',
      });
      await fetchMembers();
    } catch (err: any) {
      console.error('Error creating member:', err);
      toast({
        id: crypto.randomUUID(),
        title: 'Error',
        description: err.message || 'Failed to add team member',
        variant: 'destructive',
      });
    }
  };

  const updateMember = async (memberData: Partial<Member> & { id: string }) => {
    try {
      await membersApi.update(memberData.id, memberData);
      toast({
        id: crypto.randomUUID(),
        title: 'Success',
        description: 'Member updated successfully',
      });
      await fetchMembers();
    } catch (err: any) {
      console.error('Error updating member:', err);
      toast({
        id: crypto.randomUUID(),
        title: 'Error',
        description: err.message || 'Failed to update team member',
        variant: 'destructive',
      });
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await membersApi.delete(id);
      toast({
        id: crypto.randomUUID(),
        title: 'Success',
        description: 'Member deleted successfully',
      });
      await fetchMembers();
    } catch (err: any) {
      console.error('Error deleting member:', err);
      toast({
        id: crypto.randomUUID(),
        title: 'Error',
        description: err.message || 'Failed to delete team member',
        variant: 'destructive',
      });
    }
  };

  const changePosition = async (id: string, direction: 'up' | 'down') => {
    try {
      if (!id) return;
      
      // Make sure we have position data
      const member = members.find(m => m.id === id);
      if (!member || member.position === undefined) return;
      
      await membersApi.updatePosition(id, direction);
      await fetchMembers();
    } catch (err: any) {
      console.error('Error updating member position:', err);
      toast({
        id: crypto.randomUUID(),
        title: 'Error',
        description: err.message || 'Failed to update member position',
        variant: 'destructive',
      });
    }
  };

  return {
    members,
    loading,
    error,
    createMember,
    updateMember,
    deleteMember,
    changePosition,
    refresh: fetchMembers,
  };
};
