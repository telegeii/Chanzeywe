import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import Photo from "../../assets/Photo1.jpg";
import "./AdmissionLetter.css";
import useSeo from "../../utils/useSeo";
import { apiGet } from "../../utils/api";
import {
  FaChevronRight, FaSearch, FaCheckCircle, FaExclamationCircle,
  FaDownload, FaGraduationCap, FaFileAlt,
} from "react-icons/fa";

const AdmissionLetter = () => {
  useSeo({
    title: "Download Admission Letter",
    description: "Accepted applicants can download their official Chanzeywe Vocational Training College admission letter using their KCSE index number.",
  });

  const location = useLocation();
  const [indexNumber, setIndexNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Prefills from the link sent in the acceptance email (?index=12345678901/2024).
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const index = params.get("index");
    if (index) setIndexNumber(index);
  }, [location.search]);

  const check = async (e) => {
    e.preventDefault();
    if (!indexNumber.trim()) {
      setError("Enter your KCSE index number.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await apiGet(`/applications.php?checkOffer=${encodeURIComponent(indexNumber.trim())}`);
      setResult(data);
    } catch (err) {
      setError(err.message || "No accepted admission was found for that KCSE index number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <div className="adml-hero">
        <img src={Photo} alt="Chanzeywe Admission Letter" />
        <div className="adml-hero__overlay" />
        <div className="adml-hero__content">
          <span className="adml-hero__eyebrow">Accepted Applicants</span>
          <h1>Download Your Admission Letter</h1>
          <p>Enter your KCSE index number to check your status and download your letter.</p>
          <div className="adml-hero__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <span>Admission Letter</span>
          </div>
        </div>
      </div>

      <section className="adml-section">
        <div className="adml-card">

          <form className="adml-form" onSubmit={check}>
            <label htmlFor="adml-index">KCSE Index Number</label>
            <div className="adml-input-row">
              <input
                id="adml-index"
                type="text"
                value={indexNumber}
                onChange={(e) => setIndexNumber(e.target.value)}
                placeholder="e.g. 29513204036/2024"
                autoComplete="off"
              />
              <button type="submit" disabled={loading}>
                <FaSearch /> {loading ? "Checking…" : "Check Status"}
              </button>
            </div>
            <span className="adml-hint">
              This is the same KCSE index number you gave on your application form.
            </span>
          </form>

          {error && (
            <div className="adml-result adml-result--error">
              <FaExclamationCircle />
              <div>
                <h3>Not Found</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="adml-result adml-result--success">
              <FaCheckCircle />
              <div className="adml-result__body">
                <h3>Congratulations, {result.fullName.split(" ")[0]}!</h3>
                <p>Your application has been accepted for the following programme:</p>
                <div className="adml-result__course">
                  <FaGraduationCap />
                  <div>
                    <strong>{result.courseTitle}</strong>
                    <span>{result.courseLevel} · Ref: {result.referenceNumber}</span>
                  </div>
                </div>
                <a
                  className="adml-download-btn"
                  href={`/api/applications.php?downloadOffer=${encodeURIComponent(result.kcseIndex)}`}
                >
                  <FaDownload /> Download Admission Letter
                </a>
              </div>
            </div>
          )}

          <div className="adml-note">
            <FaFileAlt className="adml-note__icon" />
            <p>
              If your application is still pending or you can't find your index number,
              please check your email or contact the college — your admission letter will
              only appear here once your application has been reviewed and accepted.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AdmissionLetter;
