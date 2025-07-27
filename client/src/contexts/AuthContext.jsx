import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Crée le contexte
const AuthContext = createContext();

// Hook pratique pour consommer le contexte
export const useAuth = () => useContext(AuthContext);

// Fournisseur global
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  // Fonction de login
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await fetchUser(res.data.token);
    } catch (error) {
      throw error;
    }
  };

  // Fonction logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Récupère les infos utilisateur
  const fetchUser = React.useCallback(
    async (authToken = token) => {
      if (!authToken) return;
      try {
        const res = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        logout(); 
      }
    },
    [token] 
  );

  // Chargement initial si token présent
  useEffect(() => {
    if (token) fetchUser(token).finally(() => setLoading(false));
    else setLoading(false);
  }, [token, fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
