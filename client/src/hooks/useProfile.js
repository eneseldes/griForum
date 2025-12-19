/**
 * useProfile Hook
 * 
 * Kullanıcı profil verilerini yöneten hook. Kullanıcı bilgilerini
 * fetch eder ve profil güncelleme işlemini yönetir.
 * Not: Post listeleri için usePosts hook'unu kullanın (type: 'my' veya 'liked')
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { handleApiError } from "../utils/errorHandler";
import { showError, showSuccess } from "../utils/toast";

export function useProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await userService.getMe();
        setUser(userData);
      } catch (error) {
        handleApiError(error, navigate, "Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const updateProfile = async (username, password) => {
    if (!username.trim()) {
      showError("Username cannot be empty");
      return false;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        username: username.trim(),
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      const response = await userService.updateProfile(payload);
      
      if (response) {
        setUser(response.user || response);
        showSuccess("Profil başarıyla güncellendi!");
        return true;
      }
      return false;
    } catch (error) {
      handleApiError(error, navigate, "Failed to update profile. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { user, isLoading, isSubmitting, updateProfile };
}

export default useProfile;

