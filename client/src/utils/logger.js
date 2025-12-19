/**
 * Centralized logging utility
 * In production, console.error can be disabled or sent to a logging service
 */

const isDevelopment = import.meta.env.DEV;

/**
 * Log error messages
 * @param {string} message - Error message
 * @param {Error|object} error - Error object or additional data
 */
export const logError = (message, error = null) => {
  if (isDevelopment) {
    if (error) {
      console.error(message, error);
    } else {
      console.error(message);
    }
  }
  // In production, you could send errors to a logging service
  // Example: sendToLoggingService(message, error);
};

/**
 * Log warning messages
 * @param {string} message - Warning message
 * @param {object} data - Additional data
 */
export const logWarning = (message, data = null) => {
  if (isDevelopment) {
    if (data) {
      console.warn(message, data);
    } else {
      console.warn(message);
    }
  }
};

/**
 * Log info messages
 * @param {string} message - Info message
 * @param {object} data - Additional data
 */
export const logInfo = (message, data = null) => {
  if (isDevelopment) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

