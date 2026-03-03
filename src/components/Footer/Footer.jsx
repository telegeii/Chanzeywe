import React from "react";
import "./Footer.css";
import logo from "../../assets/Logo.png"; // adjust path

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo + About */}
        <div className="footer-brand">
          <img src={logo} alt="RIAT Logo" className="footer-logo" />
          <p>
            Chanzeywe TVC is a public TVET institution
            offering Technical and Business Courses at Diploma, Certificate and Artisan levels. 
            We are situated in Vihiga Constituency, Vihiga County, 1 km from Mahanga Market.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">HELB</a></li>
            <li><a href="#">CDACC</a></li>
            <li><a href="#">KUCCPS</a></li>
            <li><a href="#">KNEC</a></li>
            <li><a href="#">TVETA</a></li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p><i className="fas fa-map-marker-alt"></i>  P.O. Box 413 – 50310 Vihiga</p>
          <p><i className="fas fa-phone-alt"></i>  +254 740 932 743</p>
          <p><i className="fas fa-envelope"></i>  chanzeywetvc@gmail.com</p>

          {/* Social Links */}
          <div className="footer-social">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>
          © {year}  Chanzeywe | ISO 9001:2015 Certified
        </p>
        <p className="designer">
          Designed by : <strong>Techfic Limited Company</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;