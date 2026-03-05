import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../assets/Logo.png";
import "../Style/Nav.css";

const navItems = [
  { label: "Home", path: "/" },
  {
    label: "Explore",
    children: [
      { label: "About Us", path: "/about" },
      { label: "Contact Us", path: "/contact" },
      { label: "Service Charter", path: "/charter" },
      { label: "Report Corruption", path: "/corruption" },
    ],
  },
  {
    label: "Academics",
    children: [
      { label: "Courses", path: "/courses" },
      { label: "Joining Instruction", path: "/instruction" },
    ],
  },
  {
    label: "Departments",
    children: [
      { label: "Computing & Informatics", path: "/computing" },
      { label: "Building & Civil Engineering", path: "/building" },
      { label: "Electrical Engineering", path: "/electrical" },
      { label: "Liberal Studies", path: "/liberal" },
      { label: "Hospitality", path: "/hospitality" },
      { label: "Agriculture & Environmental Studies", path: "/agriculture" },
    ],
  },
  {
    label: "Student",
    children: [
      { label: "Student Portal", path: "/student-portal" },
      { label: "Downloads", path: "/downloads" },
    ],
  },
  {
    label: "Advert",
    children: [
      { label: "Vacancies", path: "/career" },
      { label: "Tenders", path: "/tender" },
    ],
  },
  { label: "News", path: "/blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileExpanded(null);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
        <header className={`nav-header${scrolled ? " nav-header--scrolled" : ""}`} ref={navRef}>
          {/* Top accent bar */}
      <div className="nav-topbar">
      <div className="nav-topbar__track">
        <span className="nav-topbar__content">
          Chanzeywe Vocational Training College — Skills to Transform Livelihoods
        </span>
        {/* Duplicate for seamless loop on mobile */}
        <span className="nav-topbar__content">
          Chanzeywe Vocational Training College — Skills to Transform Livelihoods
        </span>
      </div>
    </div>

      <nav className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <div className="nav-logo__img-wrap">
            <img src={logoImg} alt="Chanzeywe Logo" />
          </div>
          <div className="nav-logo__text">
            <span className="nav-logo__name">Chanzeywe</span>
            <span className="nav-logo__sub">Vocational Training College</span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="nav-links">
          {navItems.map((item, i) =>
            item.children ? (
              <li
                key={i}
                className={`nav-item nav-item--dropdown${activeDropdown === i ? " nav-item--open" : ""}`}
                onMouseEnter={() => setActiveDropdown(i)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="nav-trigger" aria-expanded={activeDropdown === i}>
                  {item.label}
                  <svg className="nav-chevron" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="nav-dropdown">
                  <ul>
                    {item.children.map((child, j) => (
                      <li key={j}>
                        <Link
                          to={child.path}
                          className={`nav-dropdown__link${isActive(child.path) ? " active" : ""}`}
                        >
                          <span className="nav-dropdown__dot" />
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={i} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link${isActive(item.path) ? " nav-link--active" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Apply CTA */}
        <Link to="/courses" className="nav-cta">Apply Now</Link>

        {/* Hamburger */}
        <button
          className={`nav-hamburger${isOpen ? " nav-hamburger--open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`nav-mobile${isOpen ? " nav-mobile--open" : ""}`}>
        <ul className="nav-mobile__list">
          {navItems.map((item, i) =>
            item.children ? (
              <li key={i} className="nav-mobile__item">
                <button
                  className={`nav-mobile__trigger${mobileExpanded === i ? " expanded" : ""}`}
                  onClick={() => setMobileExpanded(mobileExpanded === i ? null : i)}
                >
                  {item.label}
                  <svg viewBox="0 0 16 16" fill="none" className="nav-chevron">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {mobileExpanded === i && (
                  <ul className="nav-mobile__sub">
                    {item.children.map((child, j) => (
                      <li key={j}>
                        <Link to={child.path} className="nav-mobile__sublink">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={i} className="nav-mobile__item">
                <Link
                  to={item.path}
                  className={`nav-mobile__link${isActive(item.path) ? " active" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
          <li className="nav-mobile__item">
            <Link to="/courses" className="nav-mobile__cta">Apply Now</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}