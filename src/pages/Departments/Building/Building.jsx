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

const Building = () => {
  const [activeTab, setActiveTab] = useState("admission");
  const navigate=useNavigate();

  // ✅ ONLY COURSE LIST CHANGED
  const courses = [
    { code: "DBC", title: "Building Technician Level 6 (Diploma)", level: "Level 6",department: "Building & Civil Engineering",requirement: "C – or Pass in Level 5", duration: "9 Terms", examBody: "CDACC" },
    { code: "DCE", title: "Civil Engineering Technician Level 6 (Diploma)",level: "Level 6",department: "Building & Civil Engineering", requirement: "C – or Pass in Level 5", duration: "9 Terms", examBody: "CDACC" },
    { code: "CBT", title: "Building Technician Level 5 (Certificate)", level: "Level 5",department: "Building & Civil Engineering",requirement: "Grade D", duration: "6 Terms", examBody: "CDACC" },
    { code: "CP", title: "Plumbing Level 5", level: "Level 5",department: "Building & Civil Engineering",requirement: "Grade D", duration: "6 Terms", examBody: "CDACC" },
    { code: "AM", title: "Masonry Level 4", level: "Level 4",department: "Building & Civil Engineering",requirement: "KCSE Mean Grade D –", duration: "3 Terms", examBody: "CDACC" },
    { code: "AP", title: "Plumbing Level 4", level: "Level 4",department: "Building & Civil Engineering",requirement: "KCSE Mean Grade D –", duration: "3 Terms", examBody: "CDACC" },
  ];
  const handleApply=(course)=>{
    navigate("/ApplicationForm",{
      state:course
    })
  }
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <img src={Photo} alt="Building & Civil Engineering Department" />
        <div className="hero-overlay">
          <h1>Building & Civil Engineering</h1>
          <p>Training Skilled Professionals for Construction & Infrastructure</p>
        </div>
      </section>

      {/* DEPARTMENT INFO */}
      <section className="dept">
        <img src={Logo} alt="Logo" />
        <h2>Building & Civil Engineering Department</h2>
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

export default Building;