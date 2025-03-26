import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/frontend/types/api';

type AuthContextType = {
  user: User | null;
  isLoading: boolean; // Add this property
  signUp: (email: string, password: string) => Promise<{ user: User; error: any }>;
  signIn: (email: string, password: string) => Promise<{ user: User; error: any }>;
  signOut: () => Promise<{ error: any }>;
  requestPasswordReset: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  isAdmin: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
      }
      setIsLoading(false);
    };

    getSession();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user) {
      setUser(data.user);
    }

    return { user: data.user as User, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user) {
      setUser(data.user);
    }

    return { user: data.user as User, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    return { error };
  };

  const requestPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (data.user) {
      setUser(data.user);
    }
    return { error };
  };

  const isAdmin = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    requestPasswordReset,
    updatePassword,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
