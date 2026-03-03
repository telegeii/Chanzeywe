import React from "react";
import "./Corruption.css";
import Bribery from "../../assets/bribery.png";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";

const Corruption = () => {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="corruption-hero">
        <div className="hero-content">
          <h1>
            Let’s <span className="red-text">Fight Corruption</span> Together
          </h1>
          <p>Anonymous, secure & confidential reporting</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="corruption-container">
        <div className="corruption-grid">
          {/* FORM */}
          <div className="corruption-form">
            <h2>Report an Incident</h2>

            <form>
              <div className="form-group">
                <label>Type of Corruption</label>
                <select required>
                  <option value="">Select type</option>
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

              <div className="form-group">
                <label>Location (Office / Department)</label>
                <input
                  type="text"
                  placeholder="e.g. Finance Office"
                  required
                />
              </div>

              <div className="form-group">
                <label>Individual(s) Involved</label>
                <input
                  type="text"
                  placeholder="Name or position (optional)"
                />
              </div>

              <div className="form-group">
                <label>Description of the Incident</label>
                <textarea
                  rows="5"
                  placeholder="Explain what happened..."
                  required
                />
              </div>

              {/* CAPTCHA */}
              <div className="captcha">
                <input type="checkbox" required />
                <span>I’m not a robot</span>
              </div>

              <button type="submit" className="submit-btn">
                Report Now
              </button>
            </form>
          </div>

          {/* INFO */}
          <div className="corruption-info">
            <img src={Bribery} alt="Fight Corruption" />
            <h2>
              Chanzeywe is a{" "}
              <span className="red-text">Corruption-Free Zone</span>
            </h2>
            <p>
              This platform allows you to report corruption, fraud, unethical
              conduct, or abuse of authority. Your identity is not required, and
              all reports are handled with the highest level of confidentiality.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Corruption;