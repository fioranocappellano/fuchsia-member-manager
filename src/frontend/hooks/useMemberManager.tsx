
import { useState, useEffect } from 'react';
import { Member } from '@/frontend/types/api';
import { membersApi } from '@/backend/api';
import { useToast } from '@/frontend/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing members in the admin panel
 */
export const useMemberManager = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load members on initial mount
  useEffect(() => {
    fetchMembers();
    
    // Set up real-time subscription for changes
    const subscription = supabase
      .channel('public:members')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        fetchMembers();
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch all members from API
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await membersApi.getAll();
      setMembers(data);
    } catch (err: any) {
      console.error('Error fetching members:', err);
      setError(err.message || 'Failed to load members');
      toast({
        title: 'Error loading members',
        description: err.message || 'There was a problem loading the members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new member
  const createMember = async (member: Omit<Member, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      await membersApi.create(member);
      toast({
        title: 'Success',
        description: 'Member created successfully',
      });
      await fetchMembers();
    } catch (err: any) {
      console.error('Error creating member:', err);
      toast({
        title: 'Error creating member',
        description: err.message || 'There was a problem creating the member',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing member
  const updateMember = async (member: Partial<Member> & { id: string }) => {
    try {
      setLoading(true);
      await membersApi.update(member.id, member);
      toast({
        title: 'Success',
        description: 'Member updated successfully',
      });
      await fetchMembers();
    } catch (err: any) {
      console.error('Error updating member:', err);
      toast({
        title: 'Error updating member',
        description: err.message || 'There was a problem updating the member',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a member
  const deleteMember = async (id: string) => {
    try {
      setLoading(true);
      await membersApi.delete(id);
      toast({
        title: 'Success',
        description: 'Member deleted successfully',
      });
      await fetchMembers();
    } catch (err: any) {
      console.error('Error deleting member:', err);
      toast({
        title: 'Error deleting member',
        description: err.message || 'There was a problem deleting the member',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update member position
  const updatePosition = async (id: string, direction: 'up' | 'down') => {
    try {
      setLoading(true);
      await membersApi.updatePosition(id, direction);
      toast({
        title: 'Success',
        description: 'Member position updated successfully',
      });
      await fetchMembers();
    } catch (err: any) {
      console.error('Error updating member position:', err);
      toast({
        title: 'Error updating position',
        description: err.message || 'There was a problem updating the member position',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    members,
    loading,
    error,
    createMember,
    updateMember,
    deleteMember,
    updatePosition,
    refresh: fetchMembers
  };
};
