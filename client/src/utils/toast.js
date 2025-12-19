/**
 * Toast notification utility
 * Manages toast state globally
 */

let toastState = {
  message: "",
  type: "info",
  isVisible: false,
};

let listeners = [];

/**
 * Subscribe to toast state changes
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export const subscribe = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
};

/**
 * Notify all listeners of toast state change
 */
const notify = () => {
  listeners.forEach((listener) => listener(toastState));
};

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type: "info", "success", "error", "warning"
 * @param {number} duration - Duration in milliseconds (0 = no auto-close)
 */
export const showToast = (message, type = "info", duration = 3000) => {
  toastState = {
    message,
    type,
    isVisible: true,
    duration,
  };
  notify();
};

/**
 * Hide toast notification
 */
export const hideToast = () => {
  toastState = {
    ...toastState,
    isVisible: false,
  };
  notify();
};

/**
 * Show success toast
 */
export const showSuccess = (message, duration = 3000) => {
  showToast(message, "success", duration);
};

/**
 * Show error toast
 */
export const showError = (message, duration = 3000) => {
  showToast(message, "error", duration);
};

/**
 * Show warning toast
 */
export const showWarning = (message, duration = 3000) => {
  showToast(message, "warning", duration);
};

/**
 * Show info toast
 */
export const showInfo = (message, duration = 3000) => {
  showToast(message, "info", duration);
};

