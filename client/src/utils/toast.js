/**
 * Toast notification'larını merkezi olarak yöneten utility.
 * Observer pattern kullanarak global state yönetimi sağlar.
 * 
 * Özellikler:
 * - Global toast state yönetimi
 * - Observer pattern ile component'lere bildirim
 * - Farklı toast tipleri (info, success, error, warning)
 * - Otomatik kapanma süresi ayarlanabilir
 * 
 * Fonksiyonlar:
 * - subscribe: Toast state değişikliklerini dinlemek için
 * - showToast: Genel toast gösterme fonksiyonu
 * - hideToast: Toast'u gizleme fonksiyonu
 * - showSuccess: Başarı mesajı gösterme (kısayol)
 * - showError: Hata mesajı gösterme (kısayol)
 * - showWarning: Uyarı mesajı gösterme (kısayol)
 * - showInfo: Bilgi mesajı gösterme (kısayol)
 * 
 * Kullanım:
 * - Tüm component'lerden toast göstermek için
 * - Örnek: showSuccess("İşlem başarılı!");
 */

// Global toast state - tüm uygulama için tek bir state
let toastState = {
  message: "",
  type: "info",
  isVisible: false,
};

// Observer pattern: State değişikliklerini dinleyen callback'ler
let listeners = [];

export const subscribe = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
};

const notify = () => {
  listeners.forEach((listener) => listener(toastState));
};

export const showToast = (message, type = "info", duration = 3000) => {
  toastState = {
    message,
    type,
    isVisible: true,
    duration,
  };
  notify();
};

export const hideToast = () => {
  toastState = {
    ...toastState,
    isVisible: false,
  };
  notify();
};

export const showSuccess = (message, duration = 3000) => {
  showToast(message, "success", duration);
};

export const showError = (message, duration = 3000) => {
  showToast(message, "error", duration);
};

export const showWarning = (message, duration = 3000) => {
  showToast(message, "warning", duration);
};

export const showInfo = (message, duration = 3000) => {
  showToast(message, "info", duration);
};