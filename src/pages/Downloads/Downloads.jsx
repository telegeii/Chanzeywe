import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Downloads.css";
import Photo from "../../assets/Photo1.jpg";
import { Link } from "react-router-dom";
import {
  FaDownload,
  FaFilePdf,
  FaChevronRight,
  FaFileAlt,
  FaFileInvoice,
  FaFileMedical,
  FaFileSignature,
  FaBook,
} from "react-icons/fa";
import { apiGet } from "../../utils/api";
import useSeo from "../../utils/useSeo";

const TAG_ICON = {
  Finance:      <FaFileInvoice />,
  Admissions:   <FaFileAlt />,
  Health:       <FaFileMedical />,
  Registration: <FaFileSignature />,
  General:      <FaBook />,
  Academic:     <FaFilePdf />,
};

const Downloads = () => {
  useSeo({
    title: "Downloads",
    description: "Download official forms and documents from Chanzeywe Vocational Training College — fee structure, admission form, medical form, registration form and more.",
  });

  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/downloads.php")
      .then(setDownloads)
      .catch(() => setError("Unable to load documents right now. Please try again shortly."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="dl-hero">
        <img src={Photo} alt="Student Resources" />
        <div className="dl-hero__overlay" />
        <div className="dl-hero__content">
          <span className="dl-hero__eyebrow">Student Resources</span>
          <h1>Downloads</h1>
          <p>Access important academic and admission documents anytime, anywhere.</p>
          <div className="dl-hero__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <span>Downloads</span>
          </div>
        </div>
      </section>

      {/* ── Downloads section ── */}
      <section className="dl-section">
        <div className="dl-intro">
          <span className="dl-eyebrow">Available Files</span>
          <h2>Student Document Centre</h2>
          <p>Download official forms and documents needed for your academic journey at Chanzeywe TVC.</p>
        </div>

        {loading && <p style={{ textAlign: "center", padding: "20px 0" }}>Loading documents…</p>}
        {!loading && error && <p style={{ textAlign: "center", padding: "20px 0", color: "#b91c1c" }}>{error}</p>}
        {!loading && !error && downloads.length === 0 && (
          <p style={{ textAlign: "center", padding: "20px 0" }}>No documents are available right now.</p>
        )}

        {!loading && !error && downloads.length > 0 && (
          <div className="dl-grid">
            {downloads.map((item) => (
              <div key={item.id} className="dl-card">
                <div className="dl-card__top">
                  <div className="dl-card__icon">{TAG_ICON[item.tag] || <FaFileAlt />}</div>
                  <span className="dl-card__tag">{item.tag}</span>
                </div>
                <div className="dl-card__body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <div className="dl-card__footer">
                  <div className="dl-card__divider" />
                  {item.fileUrl ? (
                    <a href={item.fileUrl} download className="dl-card__btn">
                      <FaDownload className="dl-card__btn-icon" />
                      Download PDF
                    </a>
                  ) : (
                    <span className="dl-card__btn" style={{ opacity: 0.5, cursor: "default" }}>
                      No file uploaded yet
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info note */}
        <div className="dl-note">
          <FaFilePdf className="dl-note__icon" />
          <p>All documents are in PDF format. Ensure you have a PDF reader installed to open them.</p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Downloads;
