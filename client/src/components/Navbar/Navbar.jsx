import "./Navbar.scss";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">
          griForum
        </Link>
      </div>
      <div className="navbar__right">
        <div className={`navbar__right__menu${menuOpen ? " show-menu" : ""}`}>
          <ul className="navbar-links">
            <li className="navbar-link-item">
              <a
                className="navbar-link"
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/create-post");
                }}
              >
                Write
              </a>
            </li>
            <li className="navbar-link-item">
              {isLoggedIn ? (
                <a className="navbar-link" href="/profile">
                  Profile
                </a>
              ) : (
                <a className="navbar-link" href="/login">
                  Sign In
                </a>
              )}
            </li>
          </ul>
          <a
            className="custom-button"
            href="https://www.google.com/"
            target="_blank"
          >
            Learn About Us
          </a>
          {isLoggedIn && (
            <button
              className="navbar__logout"
              onClick={() => {
                logout();
                navigate("/");
              }}
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          )}
          <button
            className="navbar__right__close"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaTimes />
          </button>
        </div>
        <button
          className="navbar__right__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
