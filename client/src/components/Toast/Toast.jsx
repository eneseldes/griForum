/**
 * Toast Component
 * 
 * Toast notification component'i. Kullanıcıya bilgi, başarı, hata veya uyarı mesajları gösterir.
 * Belirli bir süre sonra otomatik olarak kapanır veya kullanıcı tıklayarak kapatabilir.
 */

import { useEffect } from "react";
import "./Toast.scss";

function Toast({ message, type = "info", isVisible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast--${type}`} onClick={onClose}>
      <div className="toast__content">
        <span className="toast__message">{message}</span>
        <button className="toast__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;

