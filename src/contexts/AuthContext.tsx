import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { sendPasswordResetEmail, updatePassword } from '@/services/authService';
import { getAnonymousId } from '@/lib/utils';

type UserData = {
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
  refreshUserData: () => Promise<void>;
  getOrCreateProfile: () => Promise<UserData>;
  loading: boolean;
  showSignupModal: boolean;
  setShowSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const START_CREDITS = 3; // Initial credits for anonymous users

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserData>(null);
  const [loading, setLoading] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);

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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .or(
          `user_id.eq.${userId},anon_user_id.eq.${userId}`
        )
        .setHeader('x-anon-user-id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      
      if (session?.user) {
        // Use setTimeout to prevent potential deadlocks
        setTimeout(async () => {
          try {
            const profile = await fetchUserProfile(session.user.id);
            
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
          const profile = await fetchUserProfile(data.session.user.id);
          
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.email?.split('@')[0] || 'User',
            credits: profile?.credits || 0,
            isPremium: false,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
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
      
      // Clean up existing state first
      cleanupAuthState();
      
      // Try to sign out globally first to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success('Logged in successfully!');
    } catch (error: any) {
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
      
      // Clean up existing state first
      cleanupAuthState();
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
      
      toast.success('Registration successful! Please check your email to confirm your account.');
    } catch (error: any) {
      console.error('Error signing up:', error);
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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

  // Refresh user data including credits
  const refreshUserData = async () => {
    try {
      if (!user?.id) return;
      
      const profile = await fetchUserProfile(user.id);
      
      if (profile) {
        setUser({
          ...user,
          isPremium: false,
          credits: profile.credits || 0,
        });
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const createProfile = async (): Promise<UserData> => {
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
        }),
      });
    } catch (error) {
      console.error('Error creating anonymous user:', error);
      throw error;
    }
    const { profile } = await data.json();

    return {
      id: null,
      email: 'anonymous@user',
      name: 'Guest User',
      isPremium: false,
      credits: START_CREDITS,
      isAnonymous: true,
      anonId: profile.anon_user_id,
    };
  }

  // Get or create an anonymous user
  const getOrCreateProfile = async (): Promise<UserData> => {
    try {
      setLoading(true);

      if (user?.id) {
        return user;
      }
      
      const storedId = getAnonymousId();

      let anonProfile = await fetchUserProfile(storedId);
      
      if (!anonProfile) {
        const anonUser = await createProfile();
        localStorage.setItem("anonymousId", anonUser.anonId);
      }

    } catch (error) {
      console.error('Error in getOrCreateProfile:', error);
      throw error;
    } finally {
      setLoading(false);
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
      refreshUserData,
      getOrCreateProfile,
      loading,
      showSignupModal,
      setShowSignupModal
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
