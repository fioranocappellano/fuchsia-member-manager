
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/frontend/hooks/use-toast';

/**
 * Hook for password reset functionality
 */
export function usePasswordReset() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const resetPassword = async (email: string): Promise<{ success: boolean }> => {
    try {
      setLoading(true);
      
      // Validate email
      if (!email || !email.includes('@')) {
        toast({
          title: 'Invalid Email',
          description: 'Please enter a valid email address',
          variant: 'destructive',
        });
        return { success: false };
      }
      
      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for the password reset link',
      });
      
      return { success: true };
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      toast({
        title: 'Password Reset Failed',
        description: error.message || 'An error occurred while sending the password reset email',
        variant: 'destructive',
      });
      
      return { success: false };
      
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean }> => {
    try {
      setLoading(true);
      
      // Validate password
      if (!newPassword || newPassword.length < 6) {
        toast({
          title: 'Invalid Password',
          description: 'Password must be at least 6 characters long',
          variant: 'destructive',
        });
        return { success: false };
      }
      
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated',
      });
      
      return { success: true };
      
    } catch (error: any) {
      console.error('Password update error:', error);
      
      toast({
        title: 'Password Update Failed',
        description: error.message || 'An error occurred while updating your password',
        variant: 'destructive',
      });
      
      return { success: false };
      
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPassword,
    updatePassword,
    loading,
  };
}
