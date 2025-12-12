import { FaGithub } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";

import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__row">
        <div className="footer__left">
          <div className="title title--small">griForum</div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Perspiciatis, itaque! Totam tenetur expedita, eveniet at velit
            excepturi ipsam inventore facilis esse obcaecati laborum porro minus
            natus consectetur exercitationem quidem aspernatur odio nobis quod
            hic eos. Eveniet id omnis similique magni alias beatae quidem
            quisquam, voluptatibus ratione delectus, odio libero dicta.
          </p>
        </div>
        <div className="footer__links-container">
          <div className="title title--small">Quick Links</div>
          <div className="footer__links">
            <a href="" className="footer__link">
              Home
            </a>
            <a href="" className="footer__link">
              About
            </a>
            <a href="" className="footer__link">
              Write
            </a>
            <a href="" className="footer__link">
              Contact
            </a>
          </div>
        </div>
        <div className="footer__socials-container">
          <p>Follow us on:</p>
          <div className="footer__socials">
            <a href="" className="footer__social-link">
              <GrInstagram className="footer__social-icon" />
            </a>
            <a href="" className="footer__social-link">
              <FaGithub className="footer__social-icon"/>
            </a>
          </div>
        </div>
      </div>
      <div className="copyrights">
        Copyright 2025 by Gridea. All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
