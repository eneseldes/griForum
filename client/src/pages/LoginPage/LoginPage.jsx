import "./LoginPage.scss";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import CustomButton from "../../components/CustomButton/CustomButton";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link'i de ekledim

function LoginPage() {
  const navigate = useNavigate();

  // 1. INPUT VERİLERİ
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 2. VERİ YAKALAMA
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 3. GİRİŞ BAŞARILI
  const handleLoginSuccess = (data) => {
    console.log("Giriş Başarılı:", data);

    // Token ve User'ı kaydet
    // authController login yanıt yapısına göre: [cite: 109-117]
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Anasayfaya git ve yenile
    window.location.href = "/";
  };

  // 4. GİRİŞ HATALI
  const handleLoginError = (error) => {
    alert("Giriş başarısız: " + error);
  };

  return (
    <div className="main">
      <div className="title">
        <h1>Log in</h1>
      </div>

      <div className="email-section">
        {/* Form etiketine gerek yok, div yeterli */}
        <label htmlFor="email">Email</label>
        <div className="email-form">
          <input
            type="email"
            id="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
          <FaCheckCircle className="input-icon" />
        </div>
      </div>

      <div className="password-section">
        <div className="password-form">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="******"
            value={formData.password}
            onChange={handleChange}
          />
          <FaEyeSlash className="pass-icon" />
          <FaEye className="pass-icon" />
        </div>

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>
      </div>

      <div className="button-section">
        {/* DÜZELTİLMİŞ CUSTOM BUTTON */}
        <CustomButton
          label="Login"
          path="/auth/login"              // Backend Login Rotası
          method="POST"                   // Veri gönderme tipi
          body={formData}                 // Email ve Şifre paketi
          onSuccess={handleLoginSuccess}  // Başarılı olursa çalışacak fonk.
          onError={handleLoginError}      // Hata olursa çalışacak fonk.
        />
      </div>

      <p>
        Don't have an account?{" "}
        <span className="bold-text">
          {/* Sayfa yenilenmeden geçiş için Link kullan */}
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </div>
  );
}

export default LoginPage;