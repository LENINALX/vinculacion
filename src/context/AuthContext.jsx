import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await authService.getUserProfile(userId);
      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }, []);

  // ✅ 1. Declaramos checkUser primero, y con useCallback
  const checkUser = useCallback(async () => {
    try {
      const { user: currentUser } = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadUserProfile(currentUser.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }, [loadUserProfile]); // sin dependencias → estable entre renders

  // ✅ 2. Ahora useEffect puede usar checkUser sin warnings
  useEffect(() => {
    checkUser();

    const { data: authListener } = authService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [checkUser, loadUserProfile]);

  const signUp = async (userData) => {
    try {
      const { data, error } = await authService.signUp(userData);
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error) throw error;
      setUser(data.user);
      await loadUserProfile(data.user.id);
      return { success: true, data };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      setUser(null);
      setUserProfile(null);
      return { success: true };
    } catch (error) {
      console.error('Error in signOut:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await authService.updateProfile(user.id, updates);
      if (error) throw error;
      setUserProfile(data);
      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: userProfile?.user_type === 'admin',
    isArtist: userProfile?.user_type === 'artist',
    isClient: userProfile?.user_type === 'client'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
