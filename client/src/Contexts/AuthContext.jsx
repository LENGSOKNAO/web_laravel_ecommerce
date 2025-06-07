// src/Contexts/AuthContext.jsx
import React, { createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Replace with real auth logic if available
  const user = { email: "user@example.com" }; // Ensure this matches API data
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);