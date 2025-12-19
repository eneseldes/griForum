/**
 * Error Handling Utilities
 * 
 * API hatalarını merkezi olarak yöneten fonksiyonlar.
 * 401 hatalarında otomatik login sayfasına yönlendirme yapar
 * ve kullanıcıya toast notification ile hata mesajı gösterir.
 */

import { logError } from "./logger";
import { showError } from "./toast";

/**
 * Centralized error handling utility
 * @param {Error} error - Error object from API
 * @param {Function} navigate - React Router navigate function
 * @param {string} defaultMessage - Default error message
 */
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

/**
 * Handle API error and return error message
 * @param {Error} error - Error object from API
 * @param {Function} navigate - React Router navigate function
 * @param {string} defaultMessage - Default error message
 * @returns {string} Error message
 */
export const getErrorMessage = (error, navigate, defaultMessage = "An error occurred. Please try again.") => {
  if (error.status === 401 && navigate) {
    navigate("/login");
    return "Please login to continue.";
  }

  return error.data?.message || error.message || defaultMessage;
};

