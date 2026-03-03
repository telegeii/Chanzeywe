import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";

import "./Application.css";

const ApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state;

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="no-course">
          <h2>No course selected</h2>
          <button onClick={() => navigate("/agriculture")}>
            Back to Courses
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* ===== INSTITUTE HEADER ===== */}
      <section className="riat-header">
        <h1>CHANZEYWE VOCATIONAL TRAINING COLLEGE</h1>
        <h2>Skills to Transform Livelihood</h2>
        <h2>VIHIGA COUNTY</h2>

        <p>
          P.O. BOX 413 – 50310 Vihiga <br />
          Cellphones: +254 740 932 743 <br />
          E-mail:  chanzeywetvc@gmail.com <br />
          Website:  www.chanzeywetvc.ac.ke
          
        </p>
      </section>

      {/* ===== FORM WRAPPER ===== */}
      <section className="application-wrapper">
        <h2 className="form-title">STUDENT COURSE APPLICATION FORM</h2>

        {/* ===== COURSE DETAILS ===== */}
        <div className="course-summary">
          <div><strong>Department:</strong> {course.department}</div>
          <div><strong>Course:</strong> {course.title}</div>
          <div><strong>Level:</strong> {course.level}</div>
          <div><strong>Course Code:</strong> {course.code}</div>
        </div>

        {/* ===== FORM ===== */}
        <form className="application-form">
          <h3>Personal Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select required>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required />
            </div>

            <div className="form-group">
              <label>Date of Birth (15 Years +)</label>
              <input type="date" required />
            </div>
          </div>

          <h3>Academic Information</h3>

          <div className="form-group">
            <label>Secondary School Attended</label>
            <input type="text" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>KCSE Index Number</label>
              <input type="text" />
            </div>

            <div className="form-group">
              <label>KCSE Year</label>
              <input type="number" />
            </div>
          </div>

          <div className="form-group">
            <label>KCSE Mean Grade</label>
            <select>
              <option value="">Select Grade</option>
              <option>A</option><option>A-</option><option>B+</option>
              <option>B</option><option>B-</option><option>C+</option>
              <option>C</option><option>C-</option><option>D+</option>
              <option>D</option><option>D-</option><option>E</option>
            </select>
          </div>

          <h3>Contact Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Student Phone Number</label>
              <input type="tel" required />
            </div>

            <div className="form-group">
              <label>Parent / Guardian Contact</label>
              <input type="tel" required />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Submit Application
          </button>
        </form>
      </section>

      <Footer />
    </>
  );
};

export default ApplicationForm;