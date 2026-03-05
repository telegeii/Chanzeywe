import React, { useState } from "react";
import "./Corruption.css";
import Bribery from "../../assets/bribery.png";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  FaShieldAlt,
  FaUserSecret,
  FaLock,
  FaChevronRight,
  FaExclamationTriangle,
  FaPaperPlane,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const trustPoints = [
  {
    icon: <FaUserSecret />,
    title: "100% Anonymous",
    desc: "Your identity is never required. Reports are untraceable.",
  },
  {
    icon: <FaLock />,
    title: "Fully Confidential",
    desc: "All submissions are encrypted and handled with discretion.",
  },
  {
    icon: <FaShieldAlt />,
    title: "Safe to Report",
    desc: "No retaliation. You are protected under Kenya's whistleblower laws.",
  },
];

const Corruption = () => {
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="cor-hero">
        <div className="cor-hero__overlay" />
        {/* Decorative rings */}
        <div className="cor-hero__ring cor-hero__ring--1" />
        <div className="cor-hero__ring cor-hero__ring--2" />

        <div className="cor-hero__content">
          <div className="cor-hero__badge">
            <FaShieldAlt />
            <span>Zero Tolerance Policy</span>
          </div>
          <h1>
            Let's <span className="cor-red">Fight Corruption</span> Together
          </h1>
          <p>Anonymous, secure &amp; confidential reporting — no identity required.</p>
          <div className="cor-hero__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <span>Report Corruption</span>
          </div>
        </div>

        {/* Trust strip */}
        <div className="cor-hero__trust">
          {trustPoints.map((t, i) => (
            <div key={i} className="cor-trust-item">
              <span className="cor-trust-item__icon">{t.icon}</span>
              <div>
                <strong>{t.title}</strong>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main ── */}
      <section className="cor-section">
        <div className="cor-grid">

          {/* ── LEFT: Form ── */}
          <div className="cor-form-card">
            <div className="cor-form-card__header">
              <div className="cor-form-card__icon">
                <FaExclamationTriangle />
              </div>
              <div>
                <span className="cor-eyebrow">Confidential Report</span>
                <h2>Report an Incident</h2>
              </div>
            </div>

            <form className="cor-form" onSubmit={handleSubmit} noValidate>
              <div className={`cor-field${focused === "type" ? " cor-field--active" : ""}`}>
                <label htmlFor="cor-type">Type of Corruption</label>
                <select
                  id="cor-type"
                  required
                  onFocus={() => setFocused("type")}
                  onBlur={() => setFocused(null)}
                >
                  <option value="">Select type...</option>
                  <option>Bribery</option>
                  <option>Fraud</option>
                  <option>Abuse of Power</option>
                  <option>Embezzlement</option>
                  <option>Conflict of Interest</option>
                  <option>Nepotism / Favoritism</option>
                  <option>Misuse of Resources</option>
                  <option>Other</option>
                </select>
              </div>

              <div className={`cor-field${focused === "location" ? " cor-field--active" : ""}`}>
                <label htmlFor="cor-location">Location / Department</label>
                <input
                  id="cor-location"
                  type="text"
                  placeholder="e.g. Finance Office, Admissions"
                  required
                  onFocus={() => setFocused("location")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <div className={`cor-field${focused === "individual" ? " cor-field--active" : ""}`}>
                <label htmlFor="cor-individual">
                  Individual(s) Involved
                  <span className="cor-field__optional">optional</span>
                </label>
                <input
                  id="cor-individual"
                  type="text"
                  placeholder="Name or position"
                  onFocus={() => setFocused("individual")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <div className={`cor-field${focused === "date" ? " cor-field--active" : ""}`}>
                <label htmlFor="cor-date">
                  Date of Incident
                  <span className="cor-field__optional">optional</span>
                </label>
                <input
                  id="cor-date"
                  type="date"
                  onFocus={() => setFocused("date")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <div className={`cor-field${focused === "desc" ? " cor-field--active" : ""}`}>
                <label htmlFor="cor-desc">Description of the Incident</label>
                <textarea
                  id="cor-desc"
                  rows={5}
                  placeholder="Describe what happened in as much detail as possible..."
                  required
                  onFocus={() => setFocused("desc")}
                  onBlur={() => setFocused(null)}
                />
              </div>

              <div className="cor-captcha">
                <input type="checkbox" id="cor-robot" required />
                <label htmlFor="cor-robot">I confirm this report is truthful and made in good faith.</label>
              </div>

              <button
                type="submit"
                className={`cor-submit${submitted ? " cor-submit--sent" : ""}`}
              >
                {submitted ? (
                  <>✓ Report Submitted Successfully</>
                ) : (
                  <><FaPaperPlane className="cor-submit__icon" /> Submit Report</>
                )}
              </button>
            </form>
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="cor-info-col">

            {/* Image card */}
            <div className="cor-info-card">
              <div className="cor-info-card__img-wrap">
                <img src={Bribery} alt="Fight Corruption" />
              </div>
              <div className="cor-info-card__body">
                <span className="cor-eyebrow">Our Commitment</span>
                <h2>
                  Chanzeywe is a{" "}
                  <span className="cor-red">Corruption-Free Zone</span>
                </h2>
                <p>
                  This platform allows you to report corruption, fraud, unethical
                  conduct, or abuse of authority. Your identity is not required,
                  and all reports are handled with the highest level of
                  confidentiality and urgency.
                </p>
              </div>
            </div>

            {/* What happens next */}
            <div className="cor-next-card">
              <h4>What Happens After You Report?</h4>
              <ol className="cor-steps">
                <li>
                  <span className="cor-step__num">01</span>
                  <div>
                    <strong>Report Received</strong>
                    <p>Your anonymous submission is securely logged.</p>
                  </div>
                </li>
                <li>
                  <span className="cor-step__num">02</span>
                  <div>
                    <strong>Review & Investigation</strong>
                    <p>The report is reviewed by the integrity committee.</p>
                  </div>
                </li>
                <li>
                  <span className="cor-step__num">03</span>
                  <div>
                    <strong>Action Taken</strong>
                    <p>Appropriate disciplinary or legal action is initiated.</p>
                  </div>
                </li>
              </ol>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Corruption;