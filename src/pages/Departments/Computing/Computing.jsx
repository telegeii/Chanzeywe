import React, { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import Photo from "../../../assets/Photo1.jpg";
import Level6 from "../../../assets/Level6.png";
import Level5 from "../../../assets/Level5.png";
import Level4 from "../../../assets/Level4.png";
import Logo from "../../../assets/Logo.png";

import "./Computing.css";

const Computing = () => {
  const [activeTab, setActiveTab] = useState("admission");
  const naviage=useNavigate();

  const courses = [
    {
      code: "DICT",
      title: "ICT Technician Level 6",
      level:"Level 6",
      department:"Computing And Informatics",
      requirement: "KCSE C- or Passed Craft Certificate",
      duration: "9 Terms",
      examBody: "CDACC",
    },
    {
      code: "CICT",
      title: "ICT Technician Level 5",
      level:"Level 5",
      department:"Computing And Informatics",
      requirement: "KCSE D (Plain)",
      duration: "6 Terms",
      examBody: "CDACC",
    },
    {
      code: "CP",
      title: "Computer Packages",
      level:"Level 4",
      department:"Computing And Informatics",
      requirement: "KCPE / KCSE",
      duration: "6 Weeks",
      examBody: "CTVC",
    },
  ];

  const handleApply=(course)=>{
    naviage("/ApplicationForm",{
      state:course
    })
  }

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <img src={Photo} alt="Computing Department" />
        <div className="hero-overlay">
          <h1>Computing & Informatics</h1>
          <p>Empowering Digital Skills for the Future</p>
        </div>
      </section>

      {/* DEPARTMENT INFO */}
      <section className="dept">
        <img src={Logo} alt="Logo" />
        <h2>Computing & Informatics Department</h2>
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
            <p>Start the year strong with fresh opportunities.</p>
          </div>
          <div className="intake-card">
            <h3>May Intake</h3>
            <p>Mid-year intake for flexible learners.</p>
          </div>
          <div className="intake-card">
            <h3>September Intake</h3>
            <p>Join after KCSE & KCPE results release.</p>
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
            {courses.map((c, i) => (
              <div key={i} className="course-card">
                <span className="course-code">{c.code}</span>
                <h3>{c.title}</h3>
                <p><strong>Requirement:</strong> {c.requirement}</p>
                <p><strong>Duration:</strong> {c.duration}</p>
                <p><strong>Exam Body:</strong> {c.examBody}</p>
                <button onClick={()=>handleApply(c)}>Apply Now</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};

export default Computing;