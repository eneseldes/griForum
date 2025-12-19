/**
 * useAuth Hook
 * 
 * Authentication state yönetimi. Login durumunu takip eder.
 */

import { useState, useEffect } from "react";
import { getUserIdFromToken } from "../api/client";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const userId = getUserIdFromToken();
      setIsLoggedIn(!!userId);
    };

    checkLoginStatus();

    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkLoginStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    const handleCustomStorageChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener("tokenChanged", handleCustomStorageChange);

    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenChanged", handleCustomStorageChange);
      clearInterval(interval);
    };
  }, []);

  return isLoggedIn;
}

export default useAuth;

