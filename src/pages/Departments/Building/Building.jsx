import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer/Footer";
import { useNavigate, Link } from "react-router-dom";
import Photo from "../../../assets/Photo1.jpg";
import Level6 from "../../../assets/Level6.png";
import Level5 from "../../../assets/Level5.png";
import Level4 from "../../../assets/Level4.png";
import Logo from "../../../assets/Logo.png";
import "../Computing/Computing.css";
import {
  FaChevronRight, FaHardHat, FaCheckCircle,
  FaCalendarAlt, FaClock, FaBook, FaUserGraduate,
  FaMoneyBillWave, FaIdCard, FaCamera, FaFileAlt,
} from "react-icons/fa";

const courses = [
  { code: "DBC", title: "Building Technician Level 6 (Diploma)",        level: "Level 6", badge: "Diploma",     color: "#0a3d8f", bg: "rgba(10,61,143,0.07)", department: "Building & Civil Engineering", requirement: "C – or Pass in Level 5",    duration: "9 Terms", examBody: "CDACC" },
  { code: "DCE", title: "Civil Engineering Technician Level 6 (Diploma)",level: "Level 6", badge: "Diploma",     color: "#0a3d8f", bg: "rgba(10,61,143,0.07)", department: "Building & Civil Engineering", requirement: "C – or Pass in Level 5",    duration: "9 Terms", examBody: "CDACC" },
  { code: "CBT", title: "Building Technician Level 5 (Certificate)",     level: "Level 5", badge: "Certificate", color: "#059669", bg: "rgba(5,150,105,0.07)", department: "Building & Civil Engineering", requirement: "Grade D",                   duration: "6 Terms", examBody: "CDACC" },
  { code: "CP",  title: "Plumbing Level 5",                              level: "Level 5", badge: "Certificate", color: "#059669", bg: "rgba(5,150,105,0.07)", department: "Building & Civil Engineering", requirement: "Grade D",                   duration: "6 Terms", examBody: "CDACC" },
  { code: "AM",  title: "Masonry Level 4",                               level: "Level 4", badge: "Artisan",     color: "#d97706", bg: "rgba(217,119,6,0.07)", department: "Building & Civil Engineering", requirement: "KCSE Mean Grade D –",       duration: "3 Terms", examBody: "CDACC" },
  { code: "AP",  title: "Plumbing Level 4",                              level: "Level 4", badge: "Artisan",     color: "#d97706", bg: "rgba(217,119,6,0.07)", department: "Building & Civil Engineering", requirement: "KCSE Mean Grade D –",       duration: "3 Terms", examBody: "CDACC" },
];

const intakes = [
  { month: "January",   icon: "🌱", desc: "Best for fresh KCSE & KCPE graduates." },
  { month: "May",       icon: "☀️", desc: "Flexible mid-year intake." },
  { month: "September", icon: "🎓", desc: "Ideal after national examination results." },
];

const admissionDocs = [
  { icon: <FaMoneyBillWave />, text: "Registration fee: Kshs. 500 (non-refundable)" },
  { icon: <FaFileAlt />,       text: "Duly filled Admission & Medical Form" },
  { icon: <FaIdCard />,        text: "Copy of ID / Birth Certificate" },
  { icon: <FaBook />,          text: "Academic certificates / result slips" },
  { icon: <FaCamera />,        text: "Two passport size photographs" },
];

const levels = [
  { img: Level6, label: "Level 6", badge: "Diploma",     color: "#0a3d8f", bg: "rgba(10,61,143,0.07)", req: "KCSE aggregate C- (Minus) or Passed Craft Certificate or equivalent qualification.", duration: "9 Terms" },
  { img: Level5, label: "Level 5", badge: "Certificate", color: "#059669", bg: "rgba(5,150,105,0.07)", req: "KCSE aggregate D (Plain) or equivalent qualification.", duration: "6 Terms" },
  { img: Level4, label: "Level 4", badge: "Artisan",     color: "#d97706", bg: "rgba(217,119,6,0.07)", req: "KCPE Certificate or equivalent qualification.", duration: "3 Terms" },
];

const Building = () => {
  const [activeTab, setActiveTab] = useState("admission");
  const navigate = useNavigate();

  const handleApply = (course) =>
    navigate("/ApplicationForm", { state: course });

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="cmp-hero">
        <img src={Photo} alt="Building & Civil Engineering Department" />
        <div className="cmp-hero__overlay" />
        <div className="cmp-hero__content">
          <span className="cmp-hero__eyebrow">
            <FaHardHat /> Building &amp; Civil Engineering
          </span>
          <h1>Training Skilled Professionals for Construction &amp; Infrastructure</h1>
          <p>Hands-on, industry-aligned programmes for Kenya's growing construction sector.</p>
          <div className="cmp-hero__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <Link to="/courses">Departments</Link>
            <FaChevronRight />
            <span>Building &amp; Civil Engineering</span>
          </div>
        </div>
      </section>

      {/* ── Dept info ── */}
      <section className="cmp-dept">
        <div className="cmp-dept__logo-wrap">
          <img src={Logo} alt="Chanzeywe Logo" />
        </div>
        <div className="cmp-dept__text">
          <span className="cmp-eyebrow">Our Department</span>
          <h2>Building &amp; Civil Engineering Department</h2>
          <p className="cmp-dept__hod">Head of Department: <strong>Telegei Edward</strong></p>
          <p className="cmp-dept__tagline">Chanzeywe Vocational Training College — Skills to Transform Livelihoods</p>
        </div>
      </section>

      {/* ── Intakes ── */}
      <section className="cmp-intakes">
        <div className="cmp-intakes__header">
          <span className="cmp-eyebrow">When to Join</span>
          <h2>Available Intakes</h2>
        </div>
        <div className="cmp-intakes__grid">
          {intakes.map((it, i) => (
            <div key={i} className="cmp-intake-card">
              <span className="cmp-intake-card__emoji">{it.icon}</span>
              <div className="cmp-intake-card__icon"><FaCalendarAlt /></div>
              <h3>{it.month} Intake</h3>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="cmp-tabs">
        {["admission", "courses"].map((tab) => (
          <button
            key={tab}
            className={`cmp-tab${activeTab === tab ? " cmp-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "admission"
              ? <><FaUserGraduate /> Admission Requirements</>
              : <><FaBook /> Courses Offered</>}
          </button>
        ))}
      </div>

      {/* ── Admission tab ── */}
      {activeTab === "admission" && (
        <>
          <section className="cmp-admission">
            <div className="cmp-admission__header">
              <span className="cmp-eyebrow">How to Join</span>
              <h2>General Admission Requirements</h2>
              <p>Please bring the following documents when reporting for registration.</p>
            </div>
            <div className="cmp-admission__grid">
              {admissionDocs.map((d, i) => (
                <div key={i} className="cmp-admission__item">
                  <div className="cmp-admission__item-icon">{d.icon}</div>
                  <span>{d.text}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="cmp-levels">
            <div className="cmp-levels__header">
              <span className="cmp-eyebrow">Entry Requirements</span>
              <h2>Programme Levels</h2>
            </div>
            <div className="cmp-levels__grid">
              {levels.map((lv, i) => (
                <div key={i} className="cmp-level-card">
                  <div className="cmp-level-card__bar" style={{ background: lv.color }} />
                  <div className="cmp-level-card__body">
                    <div className="cmp-level-card__img-wrap" style={{ background: lv.bg }}>
                      <img src={lv.img} alt={lv.label} />
                    </div>
                    <div>
                      <span className="cmp-level-card__badge" style={{ color: lv.color, background: lv.bg }}>{lv.badge}</span>
                      <h3 style={{ color: lv.color }}>{lv.label}</h3>
                    </div>
                    <p>{lv.req}</p>
                    <div className="cmp-level-card__footer">
                      <span className="cmp-level-card__duration">
                        <FaClock style={{ fontSize: "0.7rem" }} /> {lv.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Courses tab ── */}
      {activeTab === "courses" && (
        <section className="cmp-courses">
          <div className="cmp-courses__header">
            <span className="cmp-eyebrow">What We Offer</span>
            <h2>Courses Offered</h2>
            <p>CDACC-accredited programmes for Kenya's construction and infrastructure sector.</p>
          </div>
          <div className="cmp-courses__grid">
            {courses.map((c, i) => (
              <div key={i} className="cmp-course-card">
                <div className="cmp-course-card__bar" style={{ background: c.color }} />
                <div className="cmp-course-card__body">
                  <div className="cmp-course-card__top">
                    <span className="cmp-course-card__code"  style={{ background: c.bg, color: c.color }}>{c.code}</span>
                    <span className="cmp-course-card__badge" style={{ background: c.bg, color: c.color }}>{c.badge}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <ul className="cmp-course-card__meta">
                    <li><FaUserGraduate /> {c.requirement}</li>
                    <li><FaClock />        {c.duration}</li>
                    <li><FaBook />         {c.examBody}</li>
                  </ul>
                  <div className="cmp-course-card__footer">
                    <button
                      onClick={() => handleApply(c)}
                      className="cmp-course-card__btn"
                      style={{ "--btn-color": c.color }}
                    >
                      Apply Now <FaChevronRight style={{ fontSize: "0.65rem" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default Building;