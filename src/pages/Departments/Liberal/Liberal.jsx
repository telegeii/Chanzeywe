import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer/Footer";
import { Navigate, useNavigate } from "react-router-dom";
import Photo from "../../../assets/Photo1.jpg";
import Level6 from "../../../assets/Level6.png";
import Level5 from "../../../assets/Level5.png";
import Level4 from "../../../assets/Level4.png";
import Logo from "../../../assets/Logo.png";

import "../Computing/Computing.css"; // reuse SAME CSS

const Liberal = () => {
  const [activeTab, setActiveTab] = useState("admission");
  const navigate =useNavigate();

  // ✅ ONLY COURSE LIST CHANGED
  const courses = [
    { code: "DSWCD", title: "Social Work Level 6", level: "Level 6",department: "Liberal Studies" ,requirement: "C- or Pass Level 5", duration: "9 Terms", examBody: "CDACC" },
    { code: "CSWCD", title: "Social Work Level 5",level: "Level 5",department: "Liberal Studies", requirement: "D (plain)", duration: "6 Terms", examBody: "CDACC" },
    { code: "DSCM", title: "Supply Chain Management Level 6", level: "Level 6",department: "Liberal Studies",requirement: "C- or Pass Level 5", duration: "9 Terms", examBody: "CDACC" },
    { code: "CSCM", title: "Supply Chain Management Level 5", level: "Level 5",department: "Liberal Studies",requirement: "D (plain)", duration: "6 Terms", examBody: "CADAA" },
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
        <img src={Photo} alt="Liberal Studies Department" />
        <div className="hero-overlay">
          <h1>Liberal Studies</h1>
          <p>Empowering Social & Management Professionals</p>
        </div>
      </section>

      {/* DEPARTMENT INFO with HOD */}
      <section className="dept">
        <img src={Logo} alt="Logo" />
        <h2>Liberal Studies Department</h2>
        <p className="hod">HOD: <strong>Telegei Edward</strong></p>
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
              <p>
                KCSE aggregate C- (Minus) or Passed Craft Certificate or Equivalent
                qualification as approved by Kenya National Examinations Council.
              </p>
            </div>

            <div className="level-card">
              <img src={Level5} alt="Level 5" />
              <h3>Level 5 Entry Requirements</h3>
              <p>
                KCSE aggregate D (Plain) or Equivalent qualification as approved by
                Kenya National Examinations Council.
              </p>
            </div>

            <div className="level-card">
              <img src={Level4} alt="Level 4" />
              <h3>Level 4 Entry Requirements</h3>
              <p>
                KCPE Certificate or Equivalent qualification as approved by Kenya
                National Examinations Council.
              </p>
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

export default Liberal;