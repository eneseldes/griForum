/**
 * Main Application Component
 * 
 * Uygulamanın ana component'i. Router yapılandırması, route tanımlamaları
 * ve global component'lerin (Navbar, Footer, ToastContainer) yerleşimini yönetir.
 * Ayrıca test kullanıcısı ile hızlı giriş/çıkış için yardımcı buton içerir.
 */

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute/AdminProtectedRoute";
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
import ToastContainer from "./components/ToastContainer/ToastContainer";
import { AuthProvider } from "./contexts/AuthContext";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" 
  || location.pathname === "/register"
  || location.pathname === "/create-post";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/edit-post/:postId" element={<EditPostPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Route>

        <Route path="/test" element={<TestBackend />} />
      </Routes>
      {!isAuthPage && <Footer />}
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
