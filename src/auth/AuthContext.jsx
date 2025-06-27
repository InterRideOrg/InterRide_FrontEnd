import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Usuario inicia como null
  const [user, setUser] = useState(null);

  // Login real: recibe datos del backend
  const login = (userData) => {
    setUser(userData);
    // Opcional: localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout real
  const logout = () => {
    setUser(null);
    // Opcional: localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);