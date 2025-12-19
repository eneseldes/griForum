import "./RegisterPage.scss";
import { FaCheckCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigate ,Link} from "react-router-dom";
import React, { useState } from "react";
function RegisterPage() {
  const navigate = useNavigate();

  // 1. INPUT VERİLERİNİ TUTAN STATE (Hook)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // 2. Inputa yazılanı hafızaya kaydeden fonksiyon
  const handleChange = (e) => {
    // e.target.id (örneğin "email") hangisiyse onun değerini güncelle
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 3. Kayıt başarılı olursa ne yapalım?
  const handleSuccess = (data) => {
    alert("Kayıt Başarılı! Giriş yapabilirsiniz.");
    navigate("/login"); // Login sayfasına at
  };

  return (
    <div className="main">
      <div className="title">
        <h1>Sign Up</h1>
      </div>

      <div className="username-section">
        <form action="">
          <div className="username-form">
            <label for="username-label">Username</label>
            <input
              type="text"
              id="username" // State'teki isimle (username) aynı olmalı
              placeholder="Kullanıcı Adı"
              value={formData.username}
              onChange={handleChange}W
            />
          </div>
        </form>
      </div>

      <div className="email-section">
        <form action="">
          <div className="email-form">
            <label for="signup-email">Email</label>
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
            <label for="signup-password">Create a password</label>
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
            <label for="signup-password">Confirm password</label>
            <input
              type="password"
              id="password"
              placeholder="Şifre"
              value={formData.password}
              onChange={handleChange}
            />
            <FaEyeSlash className="pass-icon" />
            <FaEye className="pass-icon" />
          </div>
        </form>
      </div>

      <div className="button-section">
        
        <CustomButton
          label="Sign Up" // Buton yazısı
          path="/auth/register" // Backend adresi (base url hariç)
          method="POST" // Veri gönderme tipi
          body={formData} // Gönderilecek paket (username, email, password)
          onSuccess={handleSuccess} // Başarılı olursa çalışacak fonksiyon
          onError={(err) => alert("Hata: " + err)} // Hata olursa
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
