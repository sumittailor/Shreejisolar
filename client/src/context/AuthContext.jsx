import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as apiLogin, checkAdminAuth } from '../services/api';

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      if (token) {
        try {
          const userData = await checkAdminAuth(token);
          setUser(userData);
        } catch (err) {
          console.warn('Auth token expired or invalid');
          logout();
        }
      }
      setLoading(false);
    }
    verify();
  }, [token]);

  const login = async (username, password) => {
    const data = await apiLogin(username, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('admin_token', data.token);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('admin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
