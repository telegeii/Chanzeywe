import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Downloads.css";
import Photo from "../../assets/Photo1.jpg";
import PDF from "../../assets/English.pdf";
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

const downloads = [
  {
    icon: <FaFileInvoice />,
    title: "Current Fee Structure",
    desc: "View tuition, levies, and payment schedules for all programmes.",
    file: PDF,
    tag: "Finance",
  },
  {
    icon: <FaFileAlt />,
    title: "Admission Form",
    desc: "Official application form for new and returning students.",
    file: PDF,
    tag: "Admissions",
  },
  {
    icon: <FaFileMedical />,
    title: "Medical Form",
    desc: "Student health declaration required before registration.",
    file: PDF,
    tag: "Health",
  },
  {
    icon: <FaFileSignature />,
    title: "Student Registration Form",
    desc: "Complete your enrolment with the official registration document.",
    file: PDF,
    tag: "Registration",
  },
  {
    icon: <FaBook />,
    title: "College Brochure",
    desc: "An overview of all departments, courses, and facilities.",
    file: PDF,
    tag: "General",
  },
];

const Downloads = () => {
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

        <div className="dl-grid">
          {downloads.map((item, i) => (
            <div key={i} className="dl-card">
              <div className="dl-card__top">
                <div className="dl-card__icon">{item.icon}</div>
                <span className="dl-card__tag">{item.tag}</span>
              </div>
              <div className="dl-card__body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <div className="dl-card__footer">
                <div className="dl-card__divider" />
                <a href={item.file} download className="dl-card__btn">
                  <FaDownload className="dl-card__btn-icon" />
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>

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