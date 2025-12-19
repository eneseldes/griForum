/**
 * Main Application Component
 * 
 * Uygulamanın ana component'i. Router yapılandırması, route tanımlamaları
 * ve global component'lerin (Navbar, Footer, ToastContainer) yerleşimini yönetir.
 * Ayrıca test kullanıcısı ile hızlı giriş/çıkış için yardımcı buton içerir.
 */

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import CreatePostPage from "./pages/CreatePostPage/CreatePostPage";
import EditPostPage from "./pages/EditPostPage/EditPostPage";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import PostDetailPage from "./pages/PostDetailPage/PostDetailPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import TestBackend from "./pages/TestBackend/TestBackend";

import "./App.scss";
import { API_BASE_URL } from "./constants/config";
import ToastContainer from "./components/ToastContainer/ToastContainer";
import { logError } from "./utils/logger";
import { showError } from "./utils/toast";

function App() {
  // Test kullanıcısı için basit login state
  const [isTestLoggedIn, setIsTestLoggedIn] = useState(false);
  const [testAuthLoading, setTestAuthLoading] = useState(false);

  // Sayfa ilk açıldığında localStorage'da token varsa logged in kabul et
  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      setIsTestLoggedIn(true);
    }
  }, []);

  // Test kullanıcısı ile login ol
  const loginWithTestUser = async () => {
    try {
      setTestAuthLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@test.com",
          password: "test123",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        logError("Test login hatası:", data);
        showError(data?.message || "Test kullanıcısı ile giriş yapılamadı.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsTestLoggedIn(true);
      } else {
        showError("Sunucudan token alınamadı.");
      }
    } catch (error) {
      logError("Test login isteği hatası:", error);
      showError("Test kullanıcısı ile giriş yapılırken bir hata oluştu.");
    } finally {
      setTestAuthLoading(false);
    }
  };

  const handleToggleAuth = () => {
    if (isTestLoggedIn) {
      // Çıkış
      localStorage.removeItem("token");
      setIsTestLoggedIn(false);
    } else {
      // Giriş
      loginWithTestUser();
    }
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/edit-post/:postId" element={<EditPostPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/test" element={<TestBackend />} />
      </Routes>
      <Footer />
      <ToastContainer />

      {/* Ekranın sol altındaki küçük test giriş/çıkış butonu */}
      <button
        type="button"
        onClick={handleToggleAuth}
        style={{
          position: "fixed",
          bottom: "16px",
          left: "16px",
          padding: "6px 10px",
          fontSize: "11px",
          borderRadius: "999px",
          border: "none",
          backgroundColor: "#222",
          color: "#fff",
          opacity: 0.7,
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        {testAuthLoading
          ? "İşleniyor..."
          : isTestLoggedIn
          ? "Çıkış yap (Test)"
          : "Giriş yap (Test)"}
      </button>
    </BrowserRouter>
  );
}

export default App;
