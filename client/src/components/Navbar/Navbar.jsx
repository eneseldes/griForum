/**
 * Navbar Component
 * 
 * Uygulamanın ana navigasyon çubuğu. Logo, menü linkleri (Contact, About, Write, Profile/Sign In)
 * ve mobil hamburger menü içerir. Kullanıcı giriş durumuna göre "Sign In" veya "Profile" linki gösterir.
 */

import "./Navbar.scss";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../../features/user";
import { navigateWithAuth } from "../../utils/navigationUtils";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = useAuth();

  const handleWrite = (e) => {
    e.preventDefault();
    navigateWithAuth(navigate, "/create-post", "/login");
  };

  const handleContact = (e) => {
    e.preventDefault();
    // Footer'a scroll yap
    const footer = document.querySelector('.footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="navbar">
      {/* SOL TARA - LOGO */}
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">griForum</Link>
      </div>

      {/* SAĞ TARAF - MENÜ */}
      <div className="navbar__right">
        <div className={`navbar__right__menu ${menuOpen ? "__show-menu" : ""}`}>
          <ul>
            <li>
              <a href="" onClick={handleContact}>Contact</a>
            </li>
            <li>
              <a href="">About</a>
            </li>
            <li>
              <a href="" onClick={handleWrite}>Write</a>
            </li>
            <li>
              {isLoggedIn ? (
                <a href="/profile">Profile</a>
              ) : (
                <a href="/login">Sign In</a>
              )}
            </li>
          </ul>

          <div className="navbar__right__seeus">
            <a className="custom-button" href="https://www.google.com/" target="_blank">Learn About Us</a>
          </div>
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