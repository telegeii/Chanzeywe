import React from "react";
import Photo from "../../assets/Photo1.jpg";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar";
import Level6 from "../../assets/Level6.png";
import Level5 from "../../assets/Level5.png";
import Level4 from "../../assets/Level4.png";
import "./Instruction.css";
import { Link } from "react-router-dom";
import {
  FaChevronRight,
  FaCheckCircle,
  FaIdCard,
  FaCamera,
  FaFileAlt,
  FaMoneyBillWave,
  FaCertificate,
  FaTools,
  FaUserTie,
  FaLightbulb,
} from "react-icons/fa";

const offerings = [
  { icon: <FaCertificate />, text: "Industry-relevant CBET curriculum" },
  { icon: <FaUserTie />,    text: "Experienced and passionate lecturers" },
  { icon: <FaTools />,      text: "Modern workshops and laboratories" },
  { icon: <FaLightbulb />,  text: "Career guidance and entrepreneurial support" },
];

const joiningDocs = [
  { icon: <FaMoneyBillWave />, text: "Registration fee: Kshs. 500 (non-refundable)" },
  { icon: <FaFileAlt />,       text: "Duly filled Admission & Medical Form" },
  { icon: <FaIdCard />,        text: "Copy of ID / Birth Certificate / Waiting Card" },
  { icon: <FaFileAlt />,       text: "Copy of result slips or certificates" },
  { icon: <FaCamera />,        text: "Two (2) passport size photographs" },
];

const levels = [
  {
    img: Level6,
    label: "Level 6",
    badge: "Diploma",
    color: "#0a3d8f",
    bg: "rgba(10,61,143,0.07)",
    requirement: "KCSE aggregate C- (Minus) or Passed Craft Certificate or equivalent qualification.",
    duration: "9 Terms",
  },
  {
    img: Level5,
    label: "Level 5",
    badge: "Certificate",
    color: "#059669",
    bg: "rgba(5,150,105,0.07)",
    requirement: "KCSE aggregate D (Plain) or equivalent qualification.",
    duration: "6 Terms",
  },
  {
    img: Level4,
    label: "Level 4",
    badge: "Artisan",
    color: "#d97706",
    bg: "rgba(217,119,6,0.07)",
    requirement: "KCPE Certificate or equivalent qualification.",
    duration: "3 Terms",
  },
];

const Instruction = () => {
  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="ins-hero">
        <img src={Photo} alt="Chanzeywe Technical Training College" />
        <div className="ins-hero__overlay" />
        <div className="ins-hero__content">
          <span className="ins-hero__eyebrow">Joining Instructions</span>
          <h1>Transform Your Future</h1>
          <p>
            Build practical, in-demand skills that open doors to exciting career
            opportunities across Kenya and beyond.
          </p>
          <div className="ins-hero__actions">
            <Link to="/courses" className="ins-hero__btn ins-hero__btn--primary">
              Apply Now <FaChevronRight style={{ fontSize: "0.7rem" }} />
            </Link>
            <Link to="/courses" className="ins-hero__btn ins-hero__btn--outline">
              View Courses
            </Link>
          </div>
          <div className="ins-hero__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <span>Joining Instruction</span>
          </div>
        </div>
      </section>

      {/* ── Why Chanzeywe ── */}
      <section className="ins-why">
        <div className="ins-why__container">
          <div className="ins-why__text">
            <span className="ins-eyebrow">Our Advantage</span>
            <h2>Why Chanzeywe Stands Out</h2>
            <p>
              At <strong>Chanzeywe</strong>, we understand the fast-changing job
              market and the importance of hands-on expertise. Our programmes are
              designed to equip you with real-world technical skills that
              employers are actively seeking.
            </p>
            <p>
              We offer a learner-centred, competency-based environment that
              bridges the gap between classroom learning and industry demands —
              giving every student a clear path to employment or
              entrepreneurship.
            </p>
          </div>
          <div className="ins-why__offers">
            <h3>What We Offer You</h3>
            <ul className="ins-offers-list">
              {offerings.map((o, i) => (
                <li key={i}>
                  <span className="ins-offers-list__icon">{o.icon}</span>
                  <span>{o.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Joining Instructions ── */}
      <section className="ins-joining">
        <div className="ins-joining__container">
          <div className="ins-joining__header">
            <span className="ins-eyebrow">Required Documents</span>
            <h2>Joining Instructions</h2>
            <p>
              Please bring the following documents and payment when reporting to
              the college for registration.
            </p>
          </div>
          <div className="ins-joining__grid">
            {joiningDocs.map((doc, i) => (
              <div key={i} className="ins-joining__item">
                <div className="ins-joining__item-icon">{doc.icon}</div>
                <span>{doc.text}</span>
              </div>
            ))}
          </div>
          <div className="ins-joining__note">
            <FaCheckCircle className="ins-joining__note-icon" />
            <p>
              All original documents must be presented for verification on
              reporting day. Certified copies will be retained.
            </p>
          </div>
        </div>
      </section>

      {/* ── Entry Levels ── */}
      <section className="ins-levels">
        <div className="ins-levels__header">
          <span className="ins-eyebrow">Entry Requirements</span>
          <h2>Programme Levels</h2>
          <p>Choose the level that matches your qualifications and career goals.</p>
        </div>

        <div className="ins-levels__grid">
          {levels.map((lv, i) => (
            <div key={i} className="ins-level-card">
              {/* Top accent bar */}
              <div className="ins-level-card__bar" style={{ background: lv.color }} />

              <div className="ins-level-card__body">
                {/* Icon */}
                <div className="ins-level-card__img-wrap" style={{ background: lv.bg }}>
                  <img src={lv.img} alt={lv.label} />
                </div>

                {/* Badge + Label */}
                <div className="ins-level-card__meta">
                  <span
                    className="ins-level-card__badge"
                    style={{ color: lv.color, background: lv.bg }}
                  >
                    {lv.badge}
                  </span>
                  <h3 style={{ color: lv.color }}>{lv.label}</h3>
                </div>

                {/* Requirement */}
                <p className="ins-level-card__req">{lv.requirement}</p>

                {/* Duration tag */}
                <div className="ins-level-card__footer">
                  <span className="ins-level-card__duration">
                    ⏱ {lv.duration}
                  </span>
                  <Link to="/courses" className="ins-level-card__link">
                    View Courses <FaChevronRight style={{ fontSize: "0.6rem" }} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Instruction;