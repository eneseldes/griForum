/**
 * Merkezi loglama sistemi. Geliştirme ortamında console'a yazdırır,
 * production ortamında loglama servisine gönderilebilir.
 * 
 * Fonksiyonlar:
 * - logError: Hata mesajlarını loglar (console.error)
 * - logWarning: Uyarı mesajlarını loglar (console.warn)
 * - logInfo: Bilgi mesajlarını loglar (console.log)
 * 
 * Özellikler:
 * - Sadece development ortamında çalışır (production'da sessiz)
 * - Merkezi loglama yönetimi sağlar
 * - Production'da loglama servisine entegre edilebilir
 */

const isDevelopment = import.meta.env.DEV;

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

export const logWarning = (message, data = null) => {
  if (isDevelopment) {
    if (data) {
      console.warn(message, data);
    } else {
      console.warn(message);
    }
  }
};

export const logInfo = (message, data = null) => {
  if (isDevelopment) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

