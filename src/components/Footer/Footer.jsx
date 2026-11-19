import React from "react";
import "./Footer.css";
import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaChevronRight,
  FaCertificate,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "About Us", to: "/about" },
    { label: "Courses", to: "/courses" },
    { label: "Student Portal", to: "/downloads" },
    { label: "News & Updates", to: "/blog" },
    { label: "Contact Us", to: "/contact" },
  ];

  const accreditors = [
    { label: "HELB", href: "https://www.helb.co.ke" },
    { label: "CDACC", href: "https://www.cdacc.ac.ke" },
    { label: "KUCCPS", href: "https://www.kuccps.ac.ke" },
    { label: "KNEC", href: "https://www.knec.ac.ke" },
    { label: "TVETA", href: "https://www.tveta.go.ke" },
    { label: "KNQA", href: "https://www.knqa.go.ke" },
  ];

  const socials = [
    { icon: <FaFacebookF />, href: "https://www.facebook.com", label: "Facebook" },
    { icon: <FaTwitter />, href: "https://www.twitter.com", label: "Twitter" },
    { icon: <FaLinkedinIn />, href: "https://www.linkedin.com", label: "LinkedIn" },
    { icon: <FaInstagram />, href: "https://www.instagram.com", label: "Instagram" },
    { icon: <FaYoutube />, href: "https://www.youtube.com", label: "YouTube" },
  ];

  return (
    <footer className="footer">

      {/* ── Top wave divider ── */}
      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

      <div className="footer-body">
        <div className="footer-container">

          {/* ── Brand ── */}
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <img src={logo} alt="Ngeria TVC Logo" />
            </div>
            <p className="footer-brand__desc">
              Ngeria Technical Training Institute is a public TVET institution
              offering Diploma, Certificate, and Artisan-level programmes. Located
              10 km from Ngeria Market Center, Uasin Gishu County.
            </p>
            <div className="footer-badge">
              <span><FaCertificate /> ISO 9001:2015 Certified</span>
            </div>
            {/* Socials */}
            <div className="footer-social">
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="footer-social__link">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="footer-col">
            <h4 className="footer-col__title">Quick Links</h4>
            <ul className="footer-col__list">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="footer-col__link">
                    <FaChevronRight className="footer-col__arrow" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Accreditors ── */}
          <div className="footer-col">
            <h4 className="footer-col__title">Accreditors & Partners</h4>
            <ul className="footer-col__list">
              {accreditors.map((l, i) => (
                <li key={i}>
                  <a href={l.href} target="_blank" rel="noreferrer" className="footer-col__link">
                    <FaChevronRight className="footer-col__arrow" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className="footer-col">
            <h4 className="footer-col__title">Get In Touch</h4>
            <ul className="footer-contact__list">
              <li>
                <span className="footer-contact__icon"><FaMapMarkerAlt /></span>
                <span>P.O. Box 413 – 50310, Uasin Gishu County, Kenya</span>
              </li>
              <li>
                <span className="footer-contact__icon"><FaPhoneAlt /></span>
                <a href="tel:+25470792 604748">0792 604748</a>
              </li>
              <li>
                <span className="footer-contact__icon"><FaEnvelope /></span>
                <a href="mailto:ngeriatechnical@gmail.com">ngeriatechnical@gmail.com</a>
              </li>
            </ul>

            {/* CTA */}
            <Link to="/contact" className="footer-cta">
              Send Us a Message
            </Link>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <p>© {year} Ngeria Technical Training Institute. All rights reserved.</p>
        <p>Designed & Built by Techfric Kenya<a href="techfric.co.ke" className="footer-bottom__credit"></a></p>
      </div>

    </footer>
  );
};

export default Footer;