import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Downloads.css";
import Photo from "../../assets/Photo1.jpg";
import PDF from "../../assets/English.pdf";

const Downloads = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="downloads-hero">
        <img src={Photo} alt="Student Resources" />
        <div className="downloads-overlay">
          <h2>Download Student Resources</h2>
          <p>
            Access important academic and admission documents anytime, anywhere.
          </p>
        </div>
      </section>

      {/* DOWNLOADS SECTION */}
      <section className="downloads-section">
        <h2>Available Downloads</h2>
        <p className="downloads-subtitle">
          Click on any document below to download.
        </p>

        <div className="downloads-grid">
          <a href={PDF} download className="download-card">
            <span>📄</span>
            <h3>Current Fee Structure</h3>
            <button>Download PDF</button>
          </a>

          <a href={PDF} download className="download-card">
            <span>📄</span>
            <h3>Admission Form</h3>
            <button>Download PDF</button>
          </a>

          <a href={PDF} download className="download-card">
            <span>📄</span>
            <h3>Medical Form</h3>
            <button>Download PDF</button>
          </a>

          <a href={PDF} download className="download-card">
            <span>📄</span>
            <h3>Student Registration Form</h3>
            <button>Download PDF</button>
          </a>

          <a href={PDF} download className="download-card">
            <span>📄</span>
            <h3>College Brochure</h3>
            <button>Download PDF</button>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Downloads;