import React, { useState, useCallback, useEffect, useRef } from "react";
import { FaComputer } from "react-icons/fa6";
import { MdElectricalServices, MdConstruction } from "react-icons/md";
import { IoNutrition } from "react-icons/io5";
import { AiFillCar } from "react-icons/ai";
import {
  FaHandHoldingMedical, FaChevronLeft, FaChevronRight,
  FaClock, FaAward, FaArrowRight,
} from "react-icons/fa";
import "./ProgramFeatured.css";

/* ── Data ──────────────────────────────────── */
const programs = [
  {
    icon:       <FaComputer />,
    color:      "#2563eb",
    bg:         "#eff6ff",
    light:      "#dbeafe",
    examBody:   "TVET / CDACC",
    department: "Computing & Informatics",
    course:     "Information Communication Technology",
    duration:   "3 Years",
    tag:        "High Demand",
  },
  {
    icon:       <AiFillCar />,
    color:      "#0891b2",
    bg:         "#ecfeff",
    light:      "#cffafe",
    examBody:   "TVET / CDACC",
    department: "Mechanical & Automotive",
    course:     "Refrigeration & Air Conditioning",
    duration:   "2 Years",
    tag:        "Technical",
  },
  {
    icon:       <FaHandHoldingMedical />,
    color:      "#059669",
    bg:         "#ecfdf5",
    light:      "#d1fae5",
    examBody:   "TVET / CDACC",
    department: "Health Science",
    course:     "Community Health",
    duration:   "3 Years",
    tag:        "In Demand",
  },
  {
    icon:       <IoNutrition />,
    color:      "#d97706",
    bg:         "#fffbeb",
    light:      "#fef3c7",
    examBody:   "TVET / CDACC",
    department: "Health Science",
    course:     "Nutrition and Dietetics",
    duration:   "2 Years",
    tag:        "Specialized",
  },
  {
    icon:       <MdElectricalServices />,
    color:      "#7c3aed",
    bg:         "#f5f3ff",
    light:      "#ede9fe",
    examBody:   "TVET / CDACC",
    department: "Electrical Engineering",
    course:     "Electrical Installation & Maintenance",
    duration:   "3 Years",
    tag:        "Practical",
  },
  {
    icon:       <MdConstruction />,
    color:      "#b45309",
    bg:         "#fef3c7",
    light:      "#fde68a",
    examBody:   "TVET / CDACC",
    department: "Building & Civil Engineering",
    course:     "Building Technology",
    duration:   "3 Years",
    tag:        "Industry-Ready",
  },
];

/* ══ COMPONENT ════════════════════════════════ */
export default function ProgramFeatured() {
  const [active, setActive]   = useState(0);
  const [phase,  setPhase]    = useState("idle"); // idle | out | in
  const [dir,    setDir]      = useState(1);
  const autoRef               = useRef(null);
  const touchX                = useRef(null);
  const total                 = programs.length;

  /* Navigate with enter/exit animation */
  const go = useCallback((idx, d) => {
    clearInterval(autoRef.current);
    setDir(d);
    setPhase("out");
    setTimeout(() => {
      setActive(idx);
      setPhase("in");
      setTimeout(() => setPhase("idle"), 260);
    }, 220);
  }, []);

  const goPrev = () => go((active - 1 + total) % total, -1);
  const goNext = () => go((active + 1) % total,         +1);

  /* Auto-play */
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setActive(a => {
        const nx = (a + 1) % total;
        setDir(1);
        setPhase("out");
        setTimeout(() => {
          setActive(nx);
          setPhase("in");
          setTimeout(() => setPhase("idle"), 260);
        }, 220);
        return a; // hold until timer fires
      });
    }, 4500);
    return () => clearInterval(autoRef.current);
  }, []); // eslint-disable-line

  /* Touch swipe */
  const onTouchStart = e => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -42) goNext();
    if (dx >  42) goPrev();
    touchX.current = null;
  };

  const p    = programs[active];
  const prev = (active - 1 + total) % total;
  const next = (active + 1) % total;

  return (
    <section className="pf-section">

      {/* ── Section header ── */}
      <div className="pf-header">
        <span className="pf-eyebrow">What We Offer</span>
        <h2 className="pf-title">Featured Programmes</h2>
        <p className="pf-subtitle">
          Industry-aligned TVET courses designed to equip you with
          real-world, job-ready skills.
        </p>
      </div>

      {/* ══ STAGE ══ */}
      <div className="pf-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        {/* Animated colour wash behind the card */}
        <div className="pf-stage__wash" style={{ background: p.light }} />

        {/* ── Prev peek (desktop) ── */}
        <div className="pf-peek pf-peek--left" onClick={goPrev} role="button" aria-label="Previous programme">
          <div className="pf-peek__card" style={{ "--pk": programs[prev].color }}>
            <div className="pf-peek__icon" style={{ color: programs[prev].color, background: programs[prev].bg }}>
              {programs[prev].icon}
            </div>
            <span className="pf-peek__label">{programs[prev].course}</span>
          </div>
          <div className="pf-peek__arrow"><FaChevronLeft /></div>
        </div>

        {/* ── Main card ── */}
        <div
          className={[
            "pf-card",
            phase === "out" ? `pf-card--exit-${dir > 0 ? "left" : "right"}` : "",
            phase === "in"  ? `pf-card--enter-${dir > 0 ? "right" : "left"}` : "",
          ].join(" ").trim()}
          style={{ "--cc": p.color, "--cb": p.bg }}
        >
          {/* Top: counter + tag */}
          <div className="pf-card__top">
            <span className="pf-card__num">
              {String(active + 1).padStart(2, "0")}
              <em>/{String(total).padStart(2, "0")}</em>
            </span>
            <span className="pf-card__tag" style={{ background: p.bg, color: p.color }}>
              <FaAward /> {p.tag}
            </span>
          </div>

          {/* Icon with glow ring */}
          <div className="pf-card__icon-wrap">
            <div className="pf-card__icon-ring" style={{ background: p.light }} />
            <div className="pf-card__icon" style={{ background: p.bg, color: p.color }}>
              {p.icon}
            </div>
          </div>

          {/* Text */}
          <p className="pf-card__dept">{p.department}</p>
          <h3 className="pf-card__course">{p.course}</h3>

          {/* Info pills */}
          <div className="pf-card__pills">
            <span className="pf-card__pill">
              <FaClock /> {p.duration}
            </span>
            <span className="pf-card__pill pf-card__pill--blue">
              {p.examBody}
            </span>
          </div>

          {/* CTA */}
          <button className="pf-card__btn">
            Enroll Now <FaArrowRight />
          </button>

          {/* Bottom accent bar */}
          <div className="pf-card__bar" style={{ background: p.color }} />
        </div>

        {/* ── Next peek (desktop) ── */}
        <div className="pf-peek pf-peek--right" onClick={goNext} role="button" aria-label="Next programme">
          <div className="pf-peek__arrow"><FaChevronRight /></div>
          <div className="pf-peek__card" style={{ "--pk": programs[next].color }}>
            <div className="pf-peek__icon" style={{ color: programs[next].color, background: programs[next].bg }}>
              {programs[next].icon}
            </div>
            <span className="pf-peek__label">{programs[next].course}</span>
          </div>
        </div>

      </div>{/* end .pf-stage */}

      {/* ── Mobile nav arrows ── */}
      <div className="pf-mobile-nav">
        <button className="pf-mobile-arrow" onClick={goPrev} aria-label="Previous">
          <FaChevronLeft />
        </button>
        <div className="pf-dots">
          {programs.map((_, i) => (
            <button
              key={i}
              className={`pf-dot${i === active ? " pf-dot--on" : ""}`}
              style={i === active ? { background: p.color, width: "22px" } : {}}
              onClick={() => go(i, i > active ? 1 : -1)}
              aria-label={`Programme ${i + 1}`}
            />
          ))}
        </div>
        <button className="pf-mobile-arrow" onClick={goNext} aria-label="Next">
          <FaChevronRight />
        </button>
      </div>

      {/* ── View all ── */}
      <div className="pf-viewall">
        <a href="/courses" className="pf-viewall__link">
          View All Programmes <FaChevronRight />
        </a>
      </div>

    </section>
  );
}