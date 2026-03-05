import React from "react";
import "./About.css";
import Photo from "../../assets/Photo1.jpg";
import Mission from "../../assets/mission.png";
import Vision from "../../assets/vision.png";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar";
import { FaChevronRight, FaAward, FaUsers, FaBookOpen, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const stats = [
  { num: "2020", label: "Est. Year" },
  { num: "1,200+", label: "Alumni" },
  { num: "11+", label: "Departments" },
  { num: "ISO", label: "9001:2015" },
];

const values = [
  {
    icon: <FaAward />,
    title: "Excellence",
    desc: "We uphold the highest standards in technical education and professional development.",
  },
  {
    icon: <FaUsers />,
    title: "Community",
    desc: "We serve the Vihiga community and broader Kenya with inclusive, accessible training.",
  },
  {
    icon: <FaBookOpen />,
    title: "Innovation",
    desc: "We embrace modern, competency-based training methods aligned with industry needs.",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Accessibility",
    desc: "Strategically located near Mahanga Market, we are easy to reach for all learners.",
  },
];

const About = () => {
  return (
    <div className="about-page">
      <Navbar />

      {/* ── Hero ── */}
      <div className="about-hero">
        <img src={Photo} alt="Chanzeywe Vocational Training College campus" />
        <div className="about-hero__overlay" />
        <div className="about-hero__content">
          <span className="about-hero__eyebrow">Who We Are</span>
          <h1>About Chanzeywe</h1>
          <p>Empowering communities through quality technical education since 2020.</p>
          <div className="about-hero__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <span>About Us</span>
          </div>
        </div>
        {/* Stats bar */}
        <div className="about-hero__stats">
          {stats.map((s, i) => (
            <div key={i} className="about-hero__stat">
              <span className="about-hero__stat-num">{s.num}</span>
              <span className="about-hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── About intro ── */}
      <section className="about-intro">
        <div className="about-intro__container">
          <div className="about-intro__label">
            <span className="about-eyebrow">Our Story</span>
          </div>
          <h2>Chanzeywe Vocational Training College</h2>
          <p>
            Founded in 2005 and nestled in Vihiga County, Chanzeywe Vocational Training College
            is a public TVET institution committed to delivering quality technical and business
            education. We equip learners with practical, industry-ready skills for both local
            and international markets — producing responsible, innovative professionals who
            drive Kenya's development.
          </p>
          <Link to="/courses" className="about-intro__cta">
            Explore Our Courses <FaChevronRight style={{ fontSize: "0.7rem" }} />
          </Link>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="about-mv">
        <div className="about-mv__container">
          <div className="about-mv__card about-mv__card--mission">
            <div className="about-mv__img-wrap">
              <img src={Mission} alt="Our Mission" />
            </div>
            <div className="about-mv__body">
              <span className="about-mv__tag">Mission</span>
              <h3>Our Mission</h3>
              <p>
                To train and produce responsible, innovative, skilled and knowledgeable
                manpower in technical and business disciplines that meets the needs of
                industry and society.
              </p>
            </div>
          </div>

          <div className="about-mv__card about-mv__card--vision">
            <div className="about-mv__img-wrap">
              <img src={Vision} alt="Our Vision" />
            </div>
            <div className="about-mv__body">
              <span className="about-mv__tag about-mv__tag--vision">Vision</span>
              <h3>Our Vision</h3>
              <p>
                To be a nationally recognized center of excellence in innovation,
                technical training, research, and community empowerment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="about-values">
        <div className="about-values__container">
          <div className="about-values__header">
            <span className="about-eyebrow">What Drives Us</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="about-values__grid">
            {values.map((v, i) => (
              <div key={i} className="about-value-card">
                <div className="about-value-card__icon">{v.icon}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;