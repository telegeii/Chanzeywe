import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import Photo from "../../../assets/Photo1.jpg";
import Level6 from "../../../assets/Level6.png";
import Level5 from "../../../assets/Level5.png";
import Level4 from "../../../assets/Level4.png";
import Logo from "../../../assets/Logo.png";

import "../Computing/Computing.css"; // reuse SAME CSS

const Hospitality = () => {
  const [activeTab, setActiveTab] = useState("admission");
  const navigate = useNavigate();

  // ✅ COURSE LIST
  const courses = [
    {
      code: "DFB",
      title: "Food and Beverage Level 6",
      requirement: "C- or Pass in Level 5",
      duration: "9 Terms",
      examBody: "CDACC",
      level: "Level 6",
      department: "Hospitality"
    },
    {
      code: "CFB",
      title: "Food and Beverage Level 5",
      requirement: "D or Pass in Level 4",
      duration: "6 Terms",
      examBody: "CDACC",
      level: "Level 5",
      department: "Hospitality"
    },
    {
      code: "AFB",
      title: "Food and Beverage Level 4",
      requirement: "D- or E",
      duration: "3 Terms",
      examBody: "CDACC",
      level: "Level 4",
      department: "Hospitality"
    },
    {
      code: "FD",
      title: "Fashion and Design Level 4",
      requirement: "D- or E",
      duration: "3 Terms",
      examBody: "CDACC",
      level: "Level 4",
      department: "Hospitality"
    },
    {
      code: "AHD",
      title: "Hairdressing & Beauty Therapy Level 4",
      requirement: "D- or E",
      duration: "3 Terms",
      examBody: "CDACC",
      level: "Level 4",
      department: "Hospitality"
    }
  ];

  /* ===== APPLY BUTTON HANDLER ===== */
  const handleApply = (course) => {
    navigate("/ApplicationForm", {
      state: course, // 🔑 SEND COURSE DATA TO APPLICATION PAGE
    });
  };
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <img src={Photo} alt="Hospitality Department" />
        <div className="hero-overlay">
          <h1>Hospitality Department</h1>
          <p>Training Skilled Professionals in Hospitality & Creative Arts</p>
        </div>
      </section>

      {/* DEPARTMENT INFO */}
      <section className="dept">
        <img src={Logo} alt="Logo" />
        <h2>Hospitality Department</h2>
        <p className="hod">
          HOD: <strong>Telegei Edward</strong>
        </p>
        <p className="tagline">
          Chanzeywe Vocational Training College – Skills to Transform Livelihoods
        </p>
      </section>

      {/* INTAKES */}
      <section className="intakes">
        <h2>Available Intakes</h2>
        <div className="intake-grid">
          <div className="intake-card">
            <h3>January Intake</h3>
            <p>Best for fresh KCSE & KCPE graduates.</p>
          </div>
          <div className="intake-card">
            <h3>May Intake</h3>
            <p>Flexible mid-year intake.</p>
          </div>
          <div className="intake-card">
            <h3>September Intake</h3>
            <p>Ideal after national examination results.</p>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "admission" ? "active" : ""}
          onClick={() => setActiveTab("admission")}
        >
          Admission Requirements
        </button>
        <button
          className={activeTab === "courses" ? "active" : ""}
          onClick={() => setActiveTab("courses")}
        >
          Courses Offered
        </button>
      </div>

      {/* ADMISSION */}
      {activeTab === "admission" && (
        <>
          <section className="admission">
            <h2>General Admission Requirements</h2>
            <ul>
              <li>Registration fee: Kshs. 500 (non-refundable)</li>
              <li>Duly filled Admission & Medical Form</li>
              <li>Copy of ID / Birth Certificate</li>
              <li>Academic certificates / result slips</li>
              <li>Two passport size photographs</li>
            </ul>
          </section>

          <section className="levels">
            <div className="level-card">
              <img src={Level6} alt="Level 6" />
              <h3>Level 6 Entry Requirements</h3>
              <p>KCSE C- or Passed Level 5</p>
            </div>

            <div className="level-card">
              <img src={Level5} alt="Level 5" />
              <h3>Level 5 Entry Requirements</h3>
              <p>KCSE D or Passed Level 4</p>
            </div>

            <div className="level-card">
              <img src={Level4} alt="Level 4" />
              <h3>Level 4 Entry Requirements</h3>
              <p>KCPE Certificate or Equivalent</p>
            </div>
          </section>
        </>
      )}

      {/* COURSES */}
      {activeTab === "courses" && (
        <section className="courses">
          <h2>Courses Offered</h2>

          <div className="course-grid">
            {courses.map((course, i) => (
              <div key={i} className="course-card">
                <span className="course-code">{course.code}</span>
                <h3>{course.title}</h3>
                <p><strong>Requirement:</strong> {course.requirement}</p>
                <p><strong>Duration:</strong> {course.duration}</p>
                <p><strong>Exam Body:</strong> {course.examBody}</p>

                <button onClick={() => handleApply(course)}>
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default Hospitality;