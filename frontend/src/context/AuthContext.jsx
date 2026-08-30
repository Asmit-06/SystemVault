import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('systemvault_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('systemvault_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch updated user info from /api/auth/me
  const refreshUserProfile = useCallback(async () => {
    if (!localStorage.getItem('systemvault_token')) {
      setUser(null);
      setIsLoading(false);
      return null;
    }
    try {
      const userData = await authService.getMe();
      setUser(userData);
      localStorage.setItem('systemvault_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshUserProfile();
    } else {
      setIsLoading(false);
    }

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [token, refreshUserProfile]);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.accessToken) {
      localStorage.setItem('systemvault_token', data.accessToken);
      setToken(data.accessToken);
      
      try {
        const fullUser = await authService.getMe();
        setUser(fullUser);
        localStorage.setItem('systemvault_user', JSON.stringify(fullUser));
        return fullUser;
      } catch {
        const fallbackUser = {
          _id: data._id,
          name: data.username || data.name || email.split('@')[0],
          email: data.email,
        };
        setUser(fallbackUser);
        localStorage.setItem('systemvault_user', JSON.stringify(fallbackUser));
        return fallbackUser;
      }
    }
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register({ name, email, password });
    if (data.accessToken) {
      localStorage.setItem('systemvault_token', data.accessToken);
      setToken(data.accessToken);
      
      try {
        const fullUser = await authService.getMe();
        setUser(fullUser);
        localStorage.setItem('systemvault_user', JSON.stringify(fullUser));
        return fullUser;
      } catch {
        const fallbackUser = {
          _id: data._id,
          name: data.username || name,
          email: data.email,
        };
        setUser(fallbackUser);
        localStorage.setItem('systemvault_user', JSON.stringify(fallbackUser));
        return fallbackUser;
      }
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('systemvault_token');
    localStorage.removeItem('systemvault_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

