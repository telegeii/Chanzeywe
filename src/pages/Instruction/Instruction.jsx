import React from "react";
import Photo from "../../assets/Photo1.jpg";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar";
import Level6 from "../../assets/Level6.png";
import Level5 from "../../assets/Level5.png";
import Level4 from "../../assets/Level4.png";
import "./Instruction.css";

const Instruction = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="instruction-hero">
        <img src={Photo} alt="Chanzeywe Technical Training College" />

        <div className="hero-overlay">
          <h2>Transform Your Future with Chanzeywe Technical Training College</h2>
          <p>
            Build practical, in-demand skills that open doors to exciting career
            opportunities across Kenya and beyond.
          </p>
          <button className="hero-btn">Apply Now</button>
        </div>
      </section>

      {/* WHY CHANZEYWE */}
      <section className="instruction-section">
        <h2>Why Chanzeywe Stands Out</h2>
        <p>
          At <strong>Chanzeywe</strong>, we understand the fast-changing job market
          and the importance of hands-on expertise. Our programs are designed to
          equip you with real-world technical skills employers are actively
          seeking.
        </p>

        <h3>What We Offer You</h3>
        <ul>
          <li>✔ Industry-relevant CBET curriculum</li>
          <li>✔ Experienced and passionate lecturers</li>
          <li>✔ Modern workshops and laboratories</li>
          <li>✔ Career guidance and entrepreneurial support</li>
        </ul>
      </section>

      {/* JOINING INSTRUCTIONS */}
      <section className="instruction-section highlight">
        <h2>Joining Instructions</h2>
        <ul>
          <li>Registration fee: <strong>Kshs. 500</strong> (non-refundable)</li>
          <li>Duly filled Admission & Medical Form</li>
          <li>Copy of ID / Birth Certificate / Waiting Card</li>
          <li>Copy of result slips or certificates</li>
          <li>Two (2) passport size photographs</li>
        </ul>
      </section>

      {/* LEVELS */}
      <section className="levels">
        <div className="level-card">
          <img src={Level6} alt="Level 6" />
          <h3>Level 6</h3>
          <p>
            KCSE aggregate C- (Minus) or Passed Craft Certificate or equivalent
            qualification.
          </p>
        </div>

        <div className="level-card">
          <img src={Level5} alt="Level 5" />
          <h3>Level 5</h3>
          <p>
            KCSE aggregate D (Plain) or equivalent qualification.
          </p>
        </div>

        <div className="level-card">
          <img src={Level4} alt="Level 4" />
          <h3>Level 4</h3>
          <p>
            KCPE Certificate or equivalent qualification.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Instruction;