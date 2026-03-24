import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import axios from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const { data } = await axios.post('/auth/verify', { idToken });
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    sessionStorage.removeItem('hasSeenWelcome');
    await signOut(auth);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!user?.firebaseUid) return;
    try {
      const { data } = await axios.get(`/auth/me?uid=${user.firebaseUid}`);
      setUser(data.user);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const { data } = await axios.post('/auth/verify', { idToken });
          setUser(data.user);
        } catch (error) {
          console.error("Auth sync failed:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const adminLogin = async (email, password) => {
    try {
      const { data } = await axios.post('/admin/login', { email, password });
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Admin login failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginWithGoogle, adminLogin, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
