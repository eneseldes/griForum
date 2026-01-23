/**
 * API hatalarını merkezi olarak yöneten fonksiyonlar.
 * 401 (Unauthorized) hatalarında otomatik olarak login sayfasına yönlendirme yapar
 * ve kullanıcıya toast notification ile hata mesajı gösterir.
 * 
 * Fonksiyonlar:
 * - handleApiError: API hatasını işler, 401'de login'e yönlendirir, toast gösterir
 * - getErrorMessage: API hatasından mesaj çıkarır, 401'de login'e yönlendirir
 * 
 * Kullanım:
 * - Tüm API çağrılarında catch bloklarında kullanılır
 * - Hata yönetimini merkezileştirir, kod tekrarını önler
 */

import { logError } from "./logger";
import { showError } from "./toast";

export const handleApiError = (error, navigate, defaultMessage = "An error occurred. Please try again.") => {
  logError("API Error:", error);

  // 401 Unauthorized - redirect to login
  if (error.status === 401) {
    if (navigate) {
      navigate("/login");
    }
    return;
  }

  // Get error message
  const errorMessage = error.data?.message || error.message || defaultMessage;

  // Show error to user using toast notification
  showError(errorMessage);
};

export const getErrorMessage = (error, navigate, defaultMessage = "An error occurred. Please try again.") => {
  if (error.status === 401 && navigate) {
    navigate("/login");
    return "Please login to continue.";
  }

  return error.data?.message || error.message || defaultMessage;
};

