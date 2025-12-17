import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
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

function App() {
  // Test kullanıcısı için basit login state
  const [isTestLoggedIn, setIsTestLoggedIn] = useState(true);

  // Test token'ını localStorage'da yönet
  useEffect(() => {
    const TEST_TOKEN_VALUE = "TEST_USER_TOKEN";

    if (isTestLoggedIn) {
      localStorage.setItem("token", TEST_TOKEN_VALUE);
    } else {
      localStorage.removeItem("token");
    }
  }, [isTestLoggedIn]);

  const handleToggleAuth = () => {
    setIsTestLoggedIn((prev) => !prev);
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
        <Route path="/edit-post" element={<EditPostPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/test" element={<TestBackend />} />
      </Routes>
      <Footer />

      {/* Ekranın sol altındaki küçük test login/logout butonu */}
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
        {isTestLoggedIn ? "Çıkış yap (Test)" : "Giriş yap (Test)"}
      </button>
    </BrowserRouter>
  );
}

export default App;
