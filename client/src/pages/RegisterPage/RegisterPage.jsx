import "./RegisterPage.scss";
import { FaCheckCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../../contexts/useAuth";
import { showError, showSuccess } from "../../utils/toast";

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Input değişikliklerini yakala
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Register işlemi
  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      showError("Tüm alanlar gereklidir");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError("Şifreler eşleşmiyor");
      return;
    }

    const result = await register(formData.email, formData.username, formData.password);
    
    if (result.success) {
      showSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate("/login");
    } else {
      showError(result.message || "Kayıt başarısız");
    }
  };

  return (
    <div className="main">
      <div className="title">
        <h1>Sign Up</h1>
      </div>

      <div className="username-section">
        <form action="">
          <div className="username-form">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username" // State'teki isimle (username) aynı olmalı
              placeholder="Kullanıcı Adı"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>

      <div className="email-section">
        <form action="">
          <div className="email-form">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <FaCheckCircle className="input-icon" />
          </div>
        </form>
      </div>

      <div className="password-section">
        {/*
          pasword form ve forgot password 
        */}

        <form action="">
          <div className="password-form">
            <label htmlFor="password">Create a password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <FaEyeSlash className="pass-icon" />
            <FaEye className="pass-icon" />
          </div>
        </form>
      </div>

      <div className="password-section">
        <form action="">
          <div className="password-form">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Şifre Tekrar"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <FaEyeSlash className="pass-icon" />
            <FaEye className="pass-icon" />
          </div>
        </form>
      </div>

      <div className="button-section">
        <CustomButton
          label={isLoading ? "Kayıt yapılıyor..." : "Sign Up"}
          onClick={handleRegister}
          disabled={isLoading}
          loading={isLoading}
        />
      </div>
      <p>
        Already have an account?{" "}
        <span className="bold-text">
          {" "}
          <Link to="/login">Log in</Link>
        </span>
      </p>
    </div>
  );
}

export default RegisterPage;
