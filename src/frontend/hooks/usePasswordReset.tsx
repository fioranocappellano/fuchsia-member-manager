
import { useState } from 'react';
import { useToast } from '@/frontend/hooks/use-toast';
import { authApi } from '@/backend/api';

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      const result = await authApi.resetPassword(email);
      
      if (result.success) {
        toast({
          title: "Password reset email sent",
          description: "Check your email for a link to reset your password",
        });
      }
      
      return result;
    } catch (error: any) {
      console.error("Error sending password reset:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
      
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading
  };
}
