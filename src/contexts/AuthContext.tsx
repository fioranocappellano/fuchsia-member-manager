
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { User } from "@/frontend/types/api";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/frontend/hooks/use-toast";
import { authApi } from "@/backend/api";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => false,
  updatePassword: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check current auth state on mount and setup auth listener
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        
        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { user: authUser } = session;
          
          if (authUser) {
            // Check if user is admin
            const adminStatus = await authApi.isAdmin();
            
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              role: adminStatus ? 'admin' : 'user',
            });
            
            setIsAdmin(adminStatus);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const adminStatus = await authApi.isAdmin();
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: adminStatus ? 'admin' : 'user',
          });
          
          setIsAdmin(adminStatus);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in user
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user: authUser } = await authApi.signIn(email, password);
      
      if (authUser) {
        const adminStatus = await authApi.isAdmin();
        
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          role: adminStatus ? 'admin' : 'user',
        });
        
        setIsAdmin(adminStatus);
        
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: 'Sign in failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      setIsLoading(true);
      await authApi.signOut();
      setUser(null);
      setIsAdmin(false);
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: 'Sign out failed',
        description: error.message || 'There was a problem signing out',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await authApi.resetPassword(email);
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for a password reset link.',
      });
      return true;
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Password reset failed',
        description: error.message || 'There was a problem resetting your password',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    try {
      await authApi.updatePassword(password);
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
      return true;
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Password update failed',
        description: error.message || 'There was a problem updating your password',
        variant: 'destructive',
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
