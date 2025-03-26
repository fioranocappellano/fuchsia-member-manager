
import { useState, useEffect } from 'react';
import { useToast } from '@/frontend/hooks/use-toast';
import { Member } from '@/frontend/types/api';
import { membersApi } from '@/backend/api/members';

export const useMemberManager = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await membersApi.getAll();
      setMembers(data);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch members');
      toast({
        title: 'Error fetching members',
        description: err.message || 'Something went wrong',
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
      setLoading(true);
      
      // Calculate position if not provided
      if (!memberData.position) {
        memberData.position = members.length + 1;
      }
      
      await membersApi.create(memberData);
      
      toast({
        title: 'Member created',
        description: 'The member was created successfully',
      });
      
      await fetchMembers();
      return true;
    } catch (err: any) {
      toast({
        title: 'Error creating member',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (memberData: Partial<Member> & { id: string }) => {
    try {
      setLoading(true);
      
      await membersApi.update(memberData.id, memberData);
      
      toast({
        title: 'Member updated',
        description: 'The member was updated successfully',
      });
      
      await fetchMembers();
      return true;
    } catch (err: any) {
      toast({
        title: 'Error updating member',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      setLoading(true);
      
      await membersApi.delete(id);
      
      toast({
        title: 'Member deleted',
        description: 'The member was deleted successfully',
      });
      
      await fetchMembers();
    } catch (err: any) {
      toast({
        title: 'Error deleting member',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const changePosition = async (id: string, direction: 'up' | 'down') => {
    try {
      setLoading(true);
      
      await membersApi.updatePosition(id, direction);
      
      await fetchMembers();
    } catch (err: any) {
      toast({
        title: 'Error changing position',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
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
    createMember,
    updateMember,
    deleteMember,
    changePosition,
    refresh: fetchMembers
  };
};
