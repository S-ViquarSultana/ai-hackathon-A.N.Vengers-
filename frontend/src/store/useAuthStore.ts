import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';

interface User {
  id: string;
  name: string;
  email: string;
  skills: string[];
  interests: string[];
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Convert Supabase user to our User type
        const userData: User = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || 'User',
          skills: data.user.user_metadata?.skills || [],
          interests: data.user.user_metadata?.interests || []
        };
        set({ user: userData });
      },
      signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Initialize new user data
        const userData: User = {
          id: data.user!.id,
          email: data.user!.email!,
          name: 'New User',
          skills: [],
          interests: []
        };
        set({ user: userData });
      },
      signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);