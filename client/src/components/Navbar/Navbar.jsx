import "./Navbar.scss";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FaBars } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // containera padding atanmış unutma onu kullanabilrisin title ksımı için

    <div className="navbar">
      <div className="navbar__left">
        <div>Logo</div>
      </div>

      <div className="navbar__right">
        <div className={`navbar__right__menu ${menuOpen ? " __show-menu" : ""}`}>
          <ul>
            <li>
              <a href="">
                <FaSearch />
              </a>
            </li>

            {/* <li>
                <a href="">
                  <CiSearch />
                </a>
              </li> */}

            <li>
              <a href="">Contact</a>
            </li>
            <li>
              <a href="">About</a>
            </li>
            <li>
              <a href="">Write</a>
            </li>
            <li>
              <a href="">Sign In</a>
            </li>
          </ul>

          <div className="navbar__right__getStarted">
            <a href="">Get Started</a>
          </div>

        </div>  

        {/* show-menu right:0 !important;
                  hamburger menu imageı gibi bir de çarpı imageı bbul menu açılınca çarpı güzksün tıklayınca yine aynı şekilde setMenuOpen(!setMenu) yaz 
               */}
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
