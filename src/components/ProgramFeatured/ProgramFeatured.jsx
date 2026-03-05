import React from "react";
import { FaComputer, FaLeaf } from "react-icons/fa6";
import { MdElectricalServices, MdConstruction } from "react-icons/md";
import { GiHospital } from "react-icons/gi";
import { IoNutrition } from "react-icons/io5";
import { AiFillCar } from "react-icons/ai";
import { FaHandHoldingMedical, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProgramFeatured.css";

const NextArrow = ({ onClick }) => (
  <button className="pf-arrow pf-arrow--next" onClick={onClick} aria-label="Next">
    <FaChevronRight />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button className="pf-arrow pf-arrow--prev" onClick={onClick} aria-label="Previous">
    <FaChevronLeft />
  </button>
);

const programs = [
  {
    icon: <FaComputer />,
    color: "#2563eb",
    bg: "#eff6ff",
    examBody: "TVET / CDACC",
    department: "Computing & Informatics",
    course: "Information Communication Technology",
    duration: "3 Years",
  },
  {
    icon: <AiFillCar />,
    color: "#0891b2",
    bg: "#ecfeff",
    examBody: "TVET / CDACC",
    department: "Mechanical & Automotive",
    course: "Refrigeration & Air Conditioning",
    duration: "2 Years",
  },
  {
    icon: <FaHandHoldingMedical />,
    color: "#059669",
    bg: "#ecfdf5",
    examBody: "TVET / CDACC",
    department: "Health Science",
    course: "Community Health Level",
    duration: "3 Years",
  },
  {
    icon: <IoNutrition />,
    color: "#d97706",
    bg: "#fffbeb",
    examBody: "TVET / CDACC",
    department: "Health Science",
    course: "Nutrition and Dietetics",
    duration: "2 Years",
  },
  {
    icon: <MdElectricalServices />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    examBody: "TVET / CDACC",
    department: "Electrical Engineering",
    course: "Electrical Installation & Maintenance",
    duration: "3 Years",
  },
  {
    icon: <MdConstruction />,
    color: "#b45309",
    bg: "#fef3c7",
    examBody: "TVET / CDACC",
    department: "Building & Civil Engineering",
    course: "Building Technology",
    duration: "3 Years",
  },
];

const settings = {
  dots: true,
  arrows: true,
  infinite: true,
  speed: 480,
  slidesToShow: 3,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  appendDots: (dots) => <ul className="pf-dots">{dots}</ul>,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2, slidesToScroll: 1 },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        centerMode: true,
        centerPadding: "24px",
      },
    },
  ],
};

const ProgramFeatured = () => (
  <section className="pf-section">
    {/* Header */}
    <div className="pf-header">
      <span className="pf-eyebrow">What We Offer</span>
      <h2 className="pf-title">Featured Programmes</h2>
      <p className="pf-subtitle">
        Industry-aligned TVET courses designed to equip you with real-world,
        job-ready skills.
      </p>
    </div>

    {/* Slider */}
    <div className="pf-slider-wrap">
      <Slider {...settings}>
        {programs.map((p, i) => (
          <div key={i} className="pf-slide">
            <div className="pf-card">
              {/* Icon */}
              <div className="pf-icon" style={{ background: p.bg, color: p.color }}>
                {p.icon}
              </div>

              {/* Content */}
              <div className="pf-card__body">
                <p className="pf-dept">{p.department}</p>
                <h3 className="pf-course">{p.course}</h3>

                <div className="pf-tags">
                  <span className="pf-tag">
                    <svg viewBox="0 0 16 16" fill="none"><path d="M8 1v7l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/></svg>
                    {p.duration}
                  </span>
                  <span className="pf-tag pf-tag--exam">{p.examBody}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pf-card__footer">
                <div className="pf-accent-bar" style={{ background: p.color }} />
                <button className="pf-btn" style={{ "--btn-color": p.color }}>
                  Enroll Now
                  <FaChevronRight className="pf-btn__icon" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>

    {/* View all link */}
    <div className="pf-viewall">
      <a href="/courses" className="pf-viewall__link">
        View All Programmes <FaChevronRight style={{ fontSize: "0.7rem" }} />
      </a>
    </div>
  </section>
);

export default ProgramFeatured;