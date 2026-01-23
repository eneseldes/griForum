/**
 * Authentication Context (AuthContext.jsx)
 * 
 * Authentication state'ini merkezi olarak yöneten React Context.
 * Kullanıcı bilgilerini /users/me endpoint'inden çeker ve cache'ler.
 * 
 * Özellikler:
 * - User state yönetimi
 * - Login/logout fonksiyonları
 * - Token yönetimi
 * - Otomatik user bilgisi yükleme
 * 
 * Kullanım:
 * - App.jsx'te AuthProvider ile sarmalanır
 * - Component'lerde useAuth hook'u ile erişilir
 * - Örnek: const { user, isLoggedIn, login, logout } = useAuth();
 */

import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import { logError } from "../utils/logger";
import { AuthContext } from "./authContext";

/**
 * AuthProvider Component
 * 
 * Authentication state'ini yönetir ve tüm child component'lere sağlar.
 * 
 * @param {ReactNode} children - Provider içindeki component'ler
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Token'dan user bilgisini yükleme fonksiyonu
   * 
   * localStorage'da token varsa /users/me endpoint'inden user bilgisini çeker.
   */
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userData = await userService.getMe();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      // Token geçersizse veya hata varsa
      logError("Error loading user:", error);
      if (error.status === 401) {
        // Token geçersiz, temizle
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * İlk yüklemede ve token değişikliklerinde user bilgisini yükle
   */
  useEffect(() => {
    loadUser();

    // localStorage değişikliklerini dinle
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        loadUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom tokenChanged event'ini dinle
    const handleCustomStorageChange = () => {
      loadUser();
    };
    
    window.addEventListener("tokenChanged", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenChanged", handleCustomStorageChange);
    };
  }, [loadUser]);

  /**
   * Login Fonksiyonu
   * 
   * Email ve şifre ile giriş yapar, token'ı kaydeder ve user bilgisini yükler.
   * 
   * @param {string} email - Kullanıcı email adresi
   * @param {string} password - Kullanıcı şifresi
   * @returns {Promise<Object>} - { success: boolean, message?: string }
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      if (response.token) {
        localStorage.setItem("token", response.token);
        // Custom event dispatch et (diğer tab'lar için)
        window.dispatchEvent(new Event("tokenChanged"));
        // User bilgisini yükle
        await loadUser();
        return { success: true, user: response.user };
      } else {
        return { success: false, message: "Token alınamadı" };
      }
    } catch (error) {
      logError("Login error:", error);
      return { 
        success: false, 
        message: error.message || "Giriş yapılamadı" 
      };
    }
  }, [loadUser]);

  /**
   * Register Fonksiyonu
   * 
   * Yeni kullanıcı kaydı oluşturur, token'ı kaydeder ve user bilgisini yükler.
   * 
   * @param {string} email - Kullanıcı email adresi
   * @param {string} username - Kullanıcı adı
   * @param {string} password - Kullanıcı şifresi
   * @returns {Promise<Object>} - { success: boolean, message?: string }
   */
  const register = useCallback(async (email, username, password) => {
    try {
      const response = await authService.register(email, username, password);
      
      if (response.token) {
        localStorage.setItem("token", response.token);
        // Custom event dispatch et
        window.dispatchEvent(new Event("tokenChanged"));
        // User bilgisini yükle
        await loadUser();
        return { success: true, user: response.user };
      } else {
        return { success: false, message: "Token alınamadı" };
      }
    } catch (error) {
      logError("Register error:", error);
      return { 
        success: false, 
        message: error.message || "Kayıt yapılamadı" 
      };
    }
  }, [loadUser]);

  /**
   * Logout Fonksiyonu
   * 
   * Token'ı siler ve user state'ini temizler.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    // Custom event dispatch et
    window.dispatchEvent(new Event("tokenChanged"));
  }, []);

  /**
   * User bilgisini yeniden yükleme fonksiyonu
   * 
   * Manuel olarak user bilgisini güncellemek için kullanılır.
   */
  const refreshUser = useCallback(() => {
    loadUser();
  }, [loadUser]);

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

