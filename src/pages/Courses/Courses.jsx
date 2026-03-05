import React, { useState } from "react";
import "./Courses.css";
import Photo from "../../assets/Photo1.jpg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import PDF from "../../assets/English.pdf";
import { useNavigate, Link } from "react-router-dom";
import {
  FaChevronRight,
  FaChevronLeft,
  FaDownload,
  FaBuilding,
  FaBolt,
  FaUtensils,
  FaLaptop,
  FaSeedling,
  FaUsers,
} from "react-icons/fa";

const deptIcons = {
  "BUILDING & CIVIL ENGINEERING DEPARTMENT": <FaBuilding />,
  "ELECTRICAL ENGINEERING DEPARTMENT": <FaBolt />,
  "HOSPITALITY DEPARTMENT": <FaUtensils />,
  "COMPUTING AND INFORMATICS": <FaLaptop />,
  "AGRICULTURE AND ENVIRONMENTAL STUDIES DEPARTMENT": <FaSeedling />,
  "LIBERAL STUDIES DEPARTMENT": <FaUsers />,
};

const departments = [
  {
    name: "BUILDING & CIVIL ENGINEERING DEPARTMENT",
    courses: [
      { code: "DBC", title: "Building Technician level 9 (Diploma)", requirement: "C – or Pass in Level 5", duration: "9 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 6" },
      { code: "DCE", title: "Civil Engineering Technician Level 6 (Diploma)", requirement: "C – or Pass in Level 5", duration: "9 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 6 " },
      { code: "CBT", title: "Building Technician Level 5 (Certificate)", requirement: "Grade D", duration: "6 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 5" },
      { code: "CP",  title: "Plumbing Level 5", requirement: "Grade D", duration: "6 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 5" },
      { code: "AM",  title: "Masonry Level 4", requirement: "KCSE Mean Grade D –", duration: "3 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 4" },
      { code: "AP",  title: "Plumbing Level 4", requirement: "KCSE Mean Grade D –", duration: "3 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 4" },
    ],
  },
  {
    name: "ELECTRICAL ENGINEERING DEPARTMENT",
    courses: [
      { code: "DEEP", title: "Electrical Engineering (power option) Level 6", requirement: "C- or Pass in Level 5", duration: "9 Terms", examBody: "CDACC", department: "ELECTRICAL ENGINEERING", level: "Level 6" },
      { code: "CEEP", title: "Electrical Engineering (power option) Level 5", requirement: "D- or Pass in Level 4", duration: "6 Terms", examBody: "CDACC", department: "ELECTRICAL ENGINEERING", level: "Level 5" },
      { code: "AIE",  title: "Electrical Installation", requirement: "Grade D – and E", duration: "3 Terms", examBody: "CDACC", department: "ELECTRICAL ENGINEERING", level: "Level 4" },
    ],
  },
  {
    name: "HOSPITALITY DEPARTMENT",
    courses: [
      { code: "DFB", title: "Food and Beverage Level 6", requirement: "C- or Pass in Level 5", duration: "9 Terms", examBody: "CDACC", department: "HOSPITALITY", level: "Level 6" },
      { code: "CFB", title: "Food and Beverage Level 5", requirement: "D or Pass in Level 4", duration: "6 Terms", examBody: "CDACC", department: "HOSPITALITY", level: "Level 5" },
      { code: "AFB", title: "Food and Beverage Level 4", requirement: "D- and E", duration: "3 Terms", examBody: "CDACC", department: "HOSPITALITY", level: "Level 4" },
      { code: "FD",  title: "Fashion and Design Level 4", requirement: "D- and E", duration: "3 Terms", examBody: "CDACC", department: "HOSPITALITY", level: "Level 4" },
      { code: "AHD", title: "Hairdressing and Beauty Therapy Level 4", requirement: "D- and E", duration: "3 Terms", examBody: "CDACC", department: "HOSPITALITY", level: "Level 4" },
    ],
  },
  {
    name: "COMPUTING AND INFORMATICS",
    courses: [
      { code: "DICT", title: "ICT Technician Level 6", requirement: "C- or Pass Level 6", duration: "9 Terms", examBody: "CDACC", department: "COMPUTING AND INFORMATICS", level: "Level 6" },
      { code: "CICT", title: "ICT Technician Level 5", requirement: "D plain", duration: "6 Terms", examBody: "CDACC", department: "COMPUTING AND INFORMATICS", level: "Level 5" },
      { code: "CP",   title: "Computer Packages", requirement: "KCPE and KCSE", duration: "6 Weeks", examBody: "CTVC", department: "COMPUTING AND INFORMATICS", level: "Level 4" },
    ],
  },
  {
    name: "AGRICULTURE AND ENVIRONMENTAL STUDIES DEPARTMENT",
    courses: [
      { code: "DGA", title: "Agriculture Extension Level 6", requirement: "C- or Pass level 5", duration: "9 Terms", examBody: "CDACC", department: "AGRICULTURE AND ENVIRONMENTAL STUDIES", level: "Level 6" },
      { code: "CGA", title: "Agriculture Extension Level 5", requirement: "D or Pass Level 5", duration: "6 Terms", examBody: "CDACC", department: "AGRICULTURE AND ENVIRONMENTAL STUDIES", level: "Level 5" },
      { code: "AGA", title: "Agriculture Extension Level 4", requirement: "D- and E", duration: "3 Terms", examBody: "CDACC", department: "AGRICULTURE AND ENVIRONMENTAL STUDIES", level: "Level 4" },
    ],
  },
  {
    name: "LIBERAL STUDIES DEPARTMENT",
    courses: [
      { code: "DSWCD", title: "Social Work Level 6", requirement: "C- or Pass Level 5", duration: "9 Terms", examBody: "CDACC", department: "LIBERAL STUDIES", level: "Level 6" },
      { code: "CSWCD", title: "Social Work Level 5", requirement: "D (plain)", duration: "6 Terms", examBody: "CDACC", department: "LIBERAL STUDIES", level: "Level 5" },
      { code: "DSCM",  title: "Supply Chain Management Level 6", requirement: "C- or Pass Level 5", duration: "9 Terms", examBody: "CDACC", department: "LIBERAL STUDIES", level: "Level 6" },
      { code: "CSCM",  title: "Supply Chain Management Level 5", requirement: "D (plain)", duration: "6 Terms", examBody: "CADAA", department: "LIBERAL STUDIES", level: "Level 5" },
    ],
  },
];

const forms = [
  { label: "Admission Form", file: PDF },
  { label: "Medical Form", file: PDF },
  { label: "Registration Form", file: PDF },
  { label: "Fee Structure", file: PDF },
];

const getLevelVariant = (level = "") => {
  if (level.toLowerCase().includes("diploma")) return "level-badge level-badge--diploma";
  return "level-badge";
};

const Courses = () => {
  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(departments.length / itemsPerPage);
  const navigate = useNavigate();

  const paginatedDepts = departments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApply = (course) => navigate("/ApplicationForm", { state: course });

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <div className="courses-hero">
        <img src={Photo} alt="Chanzeywe Courses" />
        <div className="hero-overlay" />
        <div className="hero-text-overlay">
          <span className="hero-text-overlay__eyebrow">Academic Programmes</span>
          <h1>Our Courses</h1>
          <p>Explore TVET programmes across 6 departments — all CDACC accredited.</p>
          <div className="hero-text-overlay__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <span>Courses</span>
          </div>
        </div>
      </div>

      <section className="courses-page">

        {/* Intro */}
        <div className="courses-intro">
          <span className="courses-eyebrow">What We Offer</span>
          <h2>Courses at Chanzeywe TVC</h2>
          <p>
            Quality, industry-aligned programmes at Certificate, Diploma, and Artisan levels
            designed to equip you with practical, job-ready skills.
          </p>
        </div>

        {/* Dept tables */}
        {paginatedDepts.map((dept, i) => (
          <div key={i} className="department-section card">
            <div className="dept-header">
              <div className="dept-header__icon">
                {deptIcons[dept.name] || <FaBuilding />}
              </div>
              <h2>{dept.name}</h2>
            </div>

            <div className="table-wrapper">
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Course Title</th>
                    <th>Min. Requirement</th>
                    <th>Duration</th>
                    <th>Exam Body</th>
                    <th>Level</th>
                    <th>Apply</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.courses.map((course, idx) => (
                    <tr key={idx}>
                      <td>{course.code}</td>
                      <td>{course.title}</td>
                      <td>{course.requirement}</td>
                      <td>{course.duration}</td>
                      <td>{course.examBody}</td>
                      <td>
                        <span className={getLevelVariant(course.level)}>
                          {course.level}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleApply(course)} className="apply-btn">
                          Apply <FaChevronRight style={{ fontSize: "0.6rem" }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            <FaChevronLeft style={{ fontSize: "0.7rem" }} /> Previous
          </button>
          <span className="pagination__info">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            Next <FaChevronRight style={{ fontSize: "0.7rem" }} />
          </button>
        </div>

        {/* Student Forms */}
        <div className="student-forms card">
          <div className="forms-header">
            <span className="courses-eyebrow">Downloads</span>
            <h2>Student Forms</h2>
          </div>
          <ul>
            {forms.map((f, i) => (
              <li key={i}>
                <a href={f.file} download>
                  <FaDownload /> {f.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </section>

      <Footer />
    </>
  );
};

export default Courses;