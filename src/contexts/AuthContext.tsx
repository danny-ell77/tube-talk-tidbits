import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { sendPasswordResetEmail, updatePassword } from '@/services/authService';
import { getAnonymousId } from '@/lib/utils';
import {Database} from "@/integrations/supabase/types";

export type UserData = {
  /**
   * @property {string | null} id - The unique identifier for the user. Its used as a base check to know if the user is authenticated.
   */
  id: string | null;
  email: string;
  name: string;
  isPremium: boolean;
  credits: number;
  isAnonymous?: boolean;
  /**
   * @property {string | null} anonId -  For anonymous users, this will be the ID from localStorage
   * This is optional and only applicable for anonymous users.
   */
  anonId?: string;
} | null;

type UserProfile = {
  userId: string;
  anonUserId: string;
  credits: number;
  referrer: UserData['id'] | null;
  timezone: string;
}

type AuthContextType = {
  session: Session | null;
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  updateCredits: (newCredits: number) => void;
  getOrCreateProfile: (userId: string | null) => Promise<UserProfile | null>;
  loading: boolean;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserData>(null);
  const [loading, setLoading] = useState(true);

  // Clean up auth state for consistency
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .or(
        `user_id.eq.${userId},anon_user_id.eq.${userId}`
      )
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return {
      userId: profile.user_id,
      anonUserId: profile.anon_user_id,
      credits: profile.credits,
      referrer: profile.referrer,
      timezone: profile.timezone,
    };
  };

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);

      
      
      if (session?.user) {
        setTimeout(async () => {
          let profile: UserProfile | null = null;
          try {
            if (event === 'SIGNED_IN') {
              profile = await getOrCreateProfile(session.user.id);
              localStorage.removeItem('anonymousId');
            } else if (event === 'SIGNED_OUT') {
              profile = await createProfile(null);
            }

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.email?.split('@')[0] || 'User',
              isPremium: false,
              credits: profile?.credits || 0,
            });
          } catch (error) {
            console.error('Error setting up user profile:', error);
            setUser(null);
          }
        }, 0);
      } else {
        setUser(null);
      }
    });

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        
        if (data.session?.user) {
          const profile = await getOrCreateProfile(data.session.user.id);
          
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.email?.split('@')[0] || 'User',
            credits: profile?.credits || 0,
            isPremium: false,
          });
        } else {
          setUser(null);
          getOrCreateProfile(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
        getOrCreateProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) throw error;
      toast.success('Registration successful! Please check your email to confirm your account.');
    } catch (error) {
      console.error('Error signing up:', error.message);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) throw error;
      
      // Clear local user data
      localStorage.removeItem('user');
      setUser(null);
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Failed to sign out');
      
      // Force sign out on error
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await sendPasswordResetEmail(email);
      
      if (error) throw error;
      
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update password method - used after reset
  const updateUserPassword = async (newPassword: string) => {
    try {
      setLoading(true);
      const { error } = await updatePassword(newPassword);
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Update credits in user state (called when credits are updated via API)
  const updateCredits = (newCredits: number) => {
    if (user?.id) {
      setUser({
        ...user,
        credits: newCredits
      });
    }
  };


  const createProfile = async (userId: string | null = null): Promise<UserProfile | null> => {
    const BASE_URL = 'https://sdmcnnyuiyzmazdakglz.supabase.co/functions/v1/clever-service';
    let data;
    try {
      data = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_APP_SUPABASE_PUBLISHABLE_KEY}`,
          Apikey: `${import.meta.env.VITE_APP_SUPABASE_PUBLISHABLE_KEY}`,
          credentials: 'include',
        },
        body: JSON.stringify({
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          userId,
          anonUserId: getAnonymousId(),
        }),
      });
      const anonUser = await data.json();
      localStorage.setItem("anonymousId",  anonUser.profile.anon_user_id);

      return {
        userId: anonUser.user_id,
        anonUserId: anonUser.anon_user_id,
        credits: anonUser.credits,
        referrer: anonUser.referrer,
        timezone: anonUser.timezone,
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  // Get or create an anonymous user
  const getOrCreateProfile = async (userId: string | null): Promise<UserProfile | null> => {
    console.log('Getting or creating user profile...');
    try {
      // setLoading(true);

      const storedId = getAnonymousId();
      if (!userId && !storedId) {
        // If no userId and no stored anonymous ID, create a new anon profile
        return await createProfile(null);
      }

      let profile = await fetchUserProfile(userId || storedId);
      
      // Maybe the IDs are wrong, so we attempt creating a new profile
      if (!profile) {
        profile = await createProfile(userId);
      }

      return profile;

    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      throw error;
    } finally {
      // setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      setUser,
      signIn, 
      signUp, 
      signOut, 
      resetPassword, 
      updateUserPassword, 
      updateCredits,
      getOrCreateProfile,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
