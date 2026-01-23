import { useState, useEffect } from "react";
import Toast from "../Toast/Toast";
import { subscribe, hideToast } from "../../utils/toast";

function ToastContainer() {
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    isVisible: false,
    duration: 3000,
  });

  useEffect(() => {
    const unsubscribe = subscribe((newToast) => {
      setToast(newToast);
    });
    return unsubscribe;
  }, []);

  return (
    <Toast
      message={toast.message}
      type={toast.type}
      isVisible={toast.isVisible}
      onClose={hideToast}
      duration={toast.duration}
    />
  );
}

export default ToastContainer;

