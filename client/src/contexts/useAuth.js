/**
 * useAuth Hook
 * 
 * AuthContext'e erişim sağlar.
 * 
 * @returns {Object} - { user, isLoggedIn, isLoading, login, register, logout, refreshUser }
 * 
 * Kullanım:
 * - Component'lerde authentication state'ine erişmek için
 * - Örnek: const { user, isLoggedIn, login } = useAuth();
 */

import { useContext } from "react";
import { AuthContext } from "./authContext";

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  
  return context;
}

