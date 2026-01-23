import "./LoginPage.scss";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import CustomButton from "../../components/CustomButton/CustomButton";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { showError, showSuccess } from "../../utils/toast";

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Input değişikliklerini yakala
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Login işlemi
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      showError("Email ve şifre gereklidir");
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      showSuccess("Giriş başarılı!");
      navigate("/");
    } else {
      showError(result.message || "Giriş başarısız");
    }
  };

  return (
    <div className="main">
      <div className="title">
        <h1>Log in</h1>
      </div>

      <div className="email-section">
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
        <CustomButton
          label={isLoading ? "Giriş yapılıyor..." : "Login"}
          onClick={handleLogin}
          disabled={isLoading}
          loading={isLoading}
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