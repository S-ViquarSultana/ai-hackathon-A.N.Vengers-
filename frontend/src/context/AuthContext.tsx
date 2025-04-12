import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
//  import { useToast } from '../components/ui/toast';

interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.username || '',
        });
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
   // const { showToast } = useToast(); // ✅ Safe: called only on function run
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      setUser({
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.username || '',
      });

      //showToast('Successfully signed in', 'success');
    } catch (error) {
      //showToast(error instanceof Error ? error.message : 'Sign in failed', 'error');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    //const { showToast } = useToast(); // ✅ Safe here too
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: name },
        },
      });
      if (error) throw error;

      setUser({
        id: data.user?.id || '',
        email: data.user?.email || '',
        name,
      });

      //showToast('Successfully signed up', 'success');
    } catch (error) {
      //showToast(error instanceof Error ? error.message : 'Sign up failed', 'error');
      throw error;
    }
  };

  const signOut = async () => {
    //const { showToast } = useToast(); // ✅ Safe again
    await supabase.auth.signOut();
    setUser(null);
    //showToast('Signed out successfully', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
