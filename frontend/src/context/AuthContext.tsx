import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

interface User {
  _id: string;
  username: string;
  email: string;
  interests: string[];
  skills: string[];
  name?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setCurrentUser({
        _id: user.id,
        username: '', // Note: Clerk's useUser hook does not provide a username property
        email: user.primaryEmailAddress?.emailAddress || '',
        interests: [],
        skills: [], // Note: Clerk's useUser hook does not provide an interests property
        name: user.fullName || '',
        image: user.imageUrl || '',
      });
    } else if (isLoaded && !user) {
      setCurrentUser(null);
    }
  }, [isLoaded, user]);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated: !!currentUser,
        isLoading: !isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
