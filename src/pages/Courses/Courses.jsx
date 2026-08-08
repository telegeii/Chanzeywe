import React, { useState, useEffect } from "react";
import "./Courses.css";
import Photo from "../../assets/Photo1.jpg";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import PDF from "../../assets/English.pdf";
import { useNavigate, Link } from "react-router-dom";
import { apiGet } from "../../utils/api";
import useSeo from "../../utils/useSeo";
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

const DEPT_ICONS = {
  computing:   <FaLaptop />,
  building:    <FaBuilding />,
  electrical:  <FaBolt />,
  liberal:     <FaUsers />,
  hospitality: <FaUtensils />,
  agriculture: <FaSeedling />,
};

const forms = [
  { label: "Admission Form", file: PDF },
  { label: "Medical Form", file: PDF },
  { label: "Registration Form", file: PDF },
  { label: "Fee Structure", file: PDF },
];

const getLevelVariant = (level = "") => {
  if (level.includes("Level 6")) return "level-badge level-badge--diploma";
  return "level-badge";
};

const Courses = () => {
  useSeo({
    title: "Courses & Programmes",
    description: "Explore CDACC-accredited diploma, certificate and artisan courses at Chanzeywe Vocational Training College across Computing, Building, Electrical, Hospitality, Agriculture and Liberal Studies departments.",
  });

  const itemsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiGet("/departments.php?with_courses=1")
      .then((data) => setDepartments(data.filter((d) => d.active)))
      .catch(() => setError("Unable to load courses right now. Please try again shortly."))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(departments.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedDepts = departments.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const handleApply = (course, dept) =>
    navigate("/ApplicationForm", { state: { ...course, department: dept.name } });

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

        {loading && <p className="courses-status">Loading courses…</p>}
        {!loading && error && <p className="courses-status courses-status--error">{error}</p>}
        {!loading && !error && departments.length === 0 && (
          <p className="courses-status">No courses are available right now.</p>
        )}

        {/* Dept tables */}
        {!loading && !error && paginatedDepts.map((dept) => (
          <div key={dept.id} className="department-section card">
            <div className="dept-header">
              <div className="dept-header__icon">
                {DEPT_ICONS[dept.slug] || <FaBuilding />}
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
                  {dept.courses.map((course) => (
                    <tr key={course.id}>
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
                        <button onClick={() => handleApply(course, dept)} className="apply-btn">
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
        {!loading && !error && departments.length > 0 && (
          <div className="pagination">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={safePage === 1}>
              <FaChevronLeft style={{ fontSize: "0.7rem" }} /> Previous
            </button>
            <span className="pagination__info">Page {safePage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={safePage === totalPages}>
              Next <FaChevronRight style={{ fontSize: "0.7rem" }} />
            </button>
          </div>
        )}

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
