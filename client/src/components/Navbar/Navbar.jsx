import "./Navbar.scss";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link ve yönlendirme için
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Kullanıcı var mı yok mu?
  const navigate = useNavigate();

  // 1. Sayfa yüklendiğinde kullanıcı giriş yapmış mı kontrol et
  useEffect(() => {
    const user = localStorage.getItem("user"); // Login sayfasında kaydettiğimiz veri
    if (user) {
      setCurrentUser(JSON.parse(user)); // Varsa state'e at
    }
  }, []);

  // 2. Çıkış Yapma Fonksiyonu
  const handleLogout = () => {
    // Hafızayı temizle
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // State'i sıfırla
    setCurrentUser(null);
    
    // Anasayfaya veya Login sayfasına at
    navigate("/login");
  };

  return (
    <div className="navbar">
      {/* SOL TARA - LOGO */}
      <div className="navbar__left">
        <Link to="/" className="logo-link">
          <div className="logo">Logo</div>
        </Link>
      </div>

      {/* SAĞ TARAF - MENÜ */}
      <div className="navbar__right">
        <div className={`navbar__right__menu ${menuOpen ? "__show-menu" : ""}`}>
          <ul>
            {/* Herkese görünen linkler */}
            <li><a href="#"><FaSearch /></a></li>
            <li><Link to="/">Home</Link></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>

            {/* --- BURASI DİNAMİK KISIM --- */}
            
            {currentUser ? (
              // A) KULLANICI GİRİŞ YAPMIŞSA BUNLARI GÖSTER
              <>
                <li>
                  <Link to="/write" className="write-link">Write</Link>
                </li>
                <li>
                   {/* Kullanıcı Adı */}
                  <span style={{ fontWeight: "bold" }}>{currentUser.username}</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">Logout</button>
                </li>
              </>
            ) : (
              // B) GİRİŞ YAPMAMIŞSA BUNLARI GÖSTER
              <>
                <li>
                  <Link to="/login">Sign In</Link>
                </li>
                <div className="navbar__right__getStarted">
                  <Link to="/register">Get Started</Link>
                </div>
              </>
            )}
            
          </ul>
        </div>  

        {/* Hamburger Menü Butonu */}
        <button
          className="navbar__right__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </div>
  );
}

export default Navbar;