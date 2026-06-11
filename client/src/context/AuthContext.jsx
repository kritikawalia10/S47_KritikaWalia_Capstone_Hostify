import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token) => {
    localStorage.setItem('hostify_token', token);
    try {
      const decoded = jwtDecode(token);
      setUser({
        token,
        userId: decoded.userId || decoded.sub,
        role: decoded.role || 'user',
        name: decoded.name || decoded.email
      });
    } catch (e) {
      console.error('Invalid token format', e);
    }
  };

  const logout = () => {
    localStorage.removeItem('hostify_token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('hostify_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          token,
          userId: decoded.userId || decoded.sub,
          role: decoded.role || 'user',
          name: decoded.name || decoded.email
        });
      } catch (e) {
        console.error('Failed to parse saved token', e);
        localStorage.removeItem('hostify_token');
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
