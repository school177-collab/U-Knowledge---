import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, signIn, logOut } from '../lib/firebase';
import { getUserProfile, createUserProfile } from '../services/db';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        console.log("Auth State Changed:", firebaseUser?.uid);
        setUser(firebaseUser);
        if (firebaseUser) {
          let userProfile = await getUserProfile(firebaseUser.uid);
          if (!userProfile) {
            console.log("Creating new profile for:", firebaseUser.uid);
            const newProfile: Partial<UserProfile> = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Guest',
              photoURL: firebaseUser.photoURL || '',
              role: 'student'
            };
            await createUserProfile(newProfile);
            userProfile = await getUserProfile(firebaseUser.uid);
          }
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    await signIn();
  };

  const logout = async () => {
    await logOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
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
