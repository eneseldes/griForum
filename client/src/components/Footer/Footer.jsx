import { FaGithub } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";

import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
        <div className="subtitle">griForum</div>
        <p className="footer__description">
          AYBÜ BİLTEK web geliştirme takımı Gridea tarafından geliştirilmiştir.
        </p>
        <div className="footer__socials">
          <a href="" className="footer__social-link">
            <GrInstagram className="footer__social-icon" />
          </a>
          <a href="" className="footer__social-link">
            <FaGithub className="footer__social-icon" />
          </a>
        </div>
    </footer>
  );
}

export default Footer;
