// AuthContext.js

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // Perform authentication logic (check credentials, set tokens, etc.)
    // For simplicity, setting isAuthenticated to true in this example.
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Perform logout logic (clear tokens, reset state, etc.)
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
