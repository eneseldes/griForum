/**
 * Kullanıcı profil verilerini yöneten hook.
 * Kullanıcı bilgilerini fetch eder ve profil güncelleme işlemini yönetir.
 *
 * Özellikler:
 * - Kullanıcı bilgilerini otomatik yükleme (AuthContext üzerinden)
 * - Profil güncelleme (username, password)
 * - Form validasyonu
 * - Hata yönetimi
 *
 * Döndürdüğü Değerler:
 * - user: Kullanıcı objesi
 * - isLoading: Yükleniyor mu? (boolean)
 * - isSubmitting: Gönderiliyor mu? (boolean)
 * - updateProfile: Profil güncelleme fonksiyonu
 *
 * Kullanım:
 * - ProfilePage component'inde kullanılır
 * - Örnek: const { user, isLoading, updateProfile } = useProfile();
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import { handleApiError } from "../../utils/errorHandler";
import { showError, showSuccess } from "../../utils/toast";
import { useAuth } from "../../contexts/useAuth";

export function useProfile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // User bilgisini yeniden yükle
        refreshUser();
        showSuccess("Profil başarıyla güncellendi!");
        return true;
      }
      return false;
    } catch (error) {
      handleApiError(
        error,
        navigate,
        "Failed to update profile. Please try again."
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { user, isLoading: false, isSubmitting, updateProfile };
}

export default useProfile;


