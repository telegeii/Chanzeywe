import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/Logo.png";
import "../Style/Nav.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`container ${scrolled ? "scrolled" : ""}`}>
      <nav>
        {/* Logo */}
        <div className="logo-section">
          <img src={logoImg} alt="Chanzeywe Logo" className="logo-img" />
          <span className="logo-text">
            Chanzeywe Vocational Training College
          </span>
        </div>

        {/* Hamburger */}
        <div
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation */}
        <ul className={isOpen ? "nav-links open" : "nav-links"}>
          <li><Link to="/">Home</Link></li>

          {/* EXPLORE */}
          <li className="dropdown">
            <span className="dropdown-title">Explore ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/charter">Service Charter</Link></li>
              <li><Link to="/corruption">Report Corruption</Link></li>
            </ul>
          </li>
          {/*COURSES*/}
                    {/* EXPLORE */}
          <li className="dropdown">
            <span className="dropdown-title">Academics ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/instruction">Joining Instruction</Link></li>
            </ul>
          </li>

          {/* ACADEMICS */}
          <li className="dropdown">
            <span className="dropdown-title">Departments ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/computing">COMPUTING AND INFORMATICS</Link></li>
              <li><Link to="/building">BUILDING & CIVIL ENGINEERING DEPARTMENT</Link></li>
              <li><Link to="/electrical">ELECTRICAL ENGINEERING DEPARTMENT</Link></li>
              <li><Link to="/liberal">LIBERAL STUDIES DEPARTMENT</Link></li>
              <li><Link to="/hospitality">HOSPITALITY DEPARTMENT</Link></li>
              <li><Link to="/agriculture">AGRICULTURE AND ENVIRONMENTAL STUDIES</Link></li>
            </ul>
          </li>

          {/* STUDENT */}
          <li className="dropdown">
            <span className="dropdown-title">Student ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/student-portal">Student Portal</Link></li>
              <li><Link to="/downloads">Downloads</Link></li>
              
            </ul>
          </li>

          {/* ADVERT */}
          <li className="dropdown">
            <span className="dropdown-title">Advert ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/career">Vacancies</Link></li>
              <li><Link to="/tender">Tenders</Link></li>
            </ul>
          </li>

          <li><Link to="/blog">News</Link></li>
        </ul>
      </nav>
    </div>
  );
}