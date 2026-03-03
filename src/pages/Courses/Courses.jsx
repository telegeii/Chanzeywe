import React, { useState } from "react";
import "./Courses.css";
import Photo from "../../assets/Photo1.jpg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import PDF from "../../assets/English.pdf";
import { useNavigate } from "react-router-dom";

const departments = [
  {
    name: "BUILDING & CIVIL ENGINEERING DEPARTMENT",
    courses: [
      { code: "DBC", title: "Building Technician level 9 (Diploma)", requirement: "C – or Pass in Level 5", duration: "9 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 9 (Diploma)" },
      { code: "DCE", title: "Civil Engineering Technician Level 6 (Diploma)", requirement: "C – or Pass in Level 5", duration: "9 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 6 (Diploma)" },
      { code: "CBT", title: "Building Technician Level 5 (Certificate)", requirement: "Grade D", duration: "6 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 5 (Certificate)" },
      { code: "CP", title: "Plumbing Level 5", requirement: "Grade D", duration: "6 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 5" },
      { code: "AM", title: "Masonry Level 4", requirement: "KCSE Mean Grade D –", duration: "3 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 4" },
      { code: "AP", title: "Plumbing Level 4", requirement: "KCSE Mean Grade D –", duration: "3 Terms", examBody: "CDACC", department: "BUILDING & CIVIL ENGINEERING", level: "Level 4" },
    ],
  },
  {
    name: "ELECTRICAL ENGINEERING DEPARTMENT",
    courses: [
      { code: "DEEP", title: "Electrical Engineering (power option) Level 6", requirement: "C- or Pass in Level 5", duration: "9 Terms", examBody: "CDACC", department: "ELECTRICAL ENGINEERING", level: "Level 6" },
      { code: "CEEP", title: "Electrical Engineering (power option) Level 5", requirement: "D- or Pass in Level 4", duration: "6 Terms", examBody: "CDACC", department: "ELECTRICAL ENGINEERING", level: "Level 5" },
      { code: "AIE", title: "Electrical Installation", requirement: "Grade D – and E", duration: "3 Terms", examBody: "CDACC", department: "ELECTRICAL ENGINEERING", level: "Level 4" },
    ],
  },
  {
    name: "HOSPITALITY DEPARTMENT",
    courses:[
      { code: "DFB", title: "Food and Beverage Level 6", requirement: "C- or Pass in Level 5", duration: "9 Terms", examBody: "CDACC", department: "HOSPITALITY", level: "Level 6" },
      { code: "CFB", title: "Food and Beverage Level 5", requirement: "D or Pass in Level 4", duration: "6 Terms", examBody: "CDACC", department: "HOSPITALITY", level: "Level 5" },
      { code: "AFB", title: "Food and Beverage Level 4", requirement: "D- and E", duration: "3 Terms", examBody: "CDACC", department: "HOSPITALITY", level: "Level 4" },
      { code: "FD", title: "Fashion and Design Level 4", requirement: "D- and E", duration: "3 Terms", examBody: "CDACC", department: "HOSPITALITY", level: "Level 4" },
      { code: "AHD", title: "Hairdressing and Beauty Therapy Level 4", requirement: "D- and E", duration: "3 Terms", examBody: "CDACC", department: "HOSPITALITY", level: "Level 4" },
    ]
  },
  {
    name: "COMPUTING AND INFORMATICS",
    courses: [
      { code: "DICT", title: "ICT Technician Level 6", requirement: "C- or Pass Level 6", duration: "9 Terms", examBody: "CDACC", department: "COMPUTING AND INFORMATICS", level: "Level 6" },
      { code: "CICT", title: "ICT Technician Level 5", requirement: "D plain", duration: "6 Terms", examBody: "CDACC", department: "COMPUTING AND INFORMATICS", level: "Level 5" },
      { code: "CP", title: "Computer packages", requirement: "KCPE and KCSE", duration: "6 Weeks", examBody: "CTVC", department: "COMPUTING AND INFORMATICS", level: "Level 4" },
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
      { code: "DSCM", title: "Supply Chain Management Level 6", requirement: "C- or Pass Level 5", duration: "9 Terms", examBody: "CDACC", department: "LIBERAL STUDIES", level: "Level 6" },
      { code: "CSCM", title: "Supply Chain Management Level 5", requirement: "D (plain)", duration: "6 Terms", examBody: "CADAA", department: "LIBERAL STUDIES", level: "Level 5" },
    ],
  },
];

const Courses = () => {
  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(departments.length / itemsPerPage);

  const paginatedDepartments = departments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const navigate=useNavigate();

const handleApply=(course)=>{
  navigate("/ApplicationForm",{
    state:course
  })
}

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="courses-hero">
        <img src={Photo} alt="Chanzeywe Courses" />
        <div className="hero-overlay"></div>
        <div className="hero-text-overlay">
          <h1>Chanzeywe Courses</h1>
        </div>
      </div>

      <section className="courses-page">
        <p className="intro-text">Courses offered at Chanzeywe Vocational Training College</p>
        
        {paginatedDepartments.map((dept, i) => (
          <div key={i} className="department-section card">
            <h2>{dept.name}</h2>
            <div className="table-wrapper">
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Course</th>
                    <th>Minimum Requirement</th>
                    <th>Duration</th>
                    <th>Exam Body</th>
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
                        <button onClick={()=>handleApply(course)} className="apply-btn">Apply</button>
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
          <button onClick={prevPage} disabled={currentPage === 1}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
        </div>

        {/* Student Forms */}
        <div className="student-forms card">
          <h2>Student Forms</h2>
          <ul>
            <li><a href={PDF} download>Admission Form</a></li>
            <li><a href={PDF} download>Medical Form</a></li>
            <li><a href={PDF} download>Registration Form</a></li>
            <li><a href={PDF} download>Fee Structure</a></li>
          </ul>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Courses;