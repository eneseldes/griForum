import { useState, useEffect } from "react";
import { getUserIdFromToken } from "../shared";

/**
 * Hook for managing authentication state
 * Tracks login status and updates when token changes
 * @returns {boolean} isLoggedIn - Whether user is logged in
 */
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userId = getUserIdFromToken();
      setIsLoggedIn(!!userId);
    };

    // İlk kontrol
    checkLoginStatus();

    // localStorage değişikliklerini dinle (farklı tab'lar için)
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkLoginStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom event için listener (aynı tab'da token değişiklikleri için)
    const handleCustomStorageChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener("tokenChanged", handleCustomStorageChange);

    // Periyodik kontrol (aynı tab'da token değişikliklerini yakalamak için)
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenChanged", handleCustomStorageChange);
      clearInterval(interval);
    };
  }, []);

  return isLoggedIn;
}

