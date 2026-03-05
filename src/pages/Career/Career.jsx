import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import Photo from "../../assets/Photo1.jpg";
import JobPdf from "../../assets/English.pdf";
import Sorry from "../../assets/sorry.png";
import "./Career.css";
import { Link } from "react-router-dom";
import { FaDownload, FaChevronRight } from "react-icons/fa";

const jobs = [
  {
    id: 1,
    number: "CHANZEYWE/TRAINERS/ADVERT/9/25",
    title: "Advertisement for BOG Trainer Positions",
    closeDate: "2025-12-29",
    postedDate: "2025-12-14",
  },
  {
    id: 2,
    number: "CHANZEYWE/HR/ADVERT/10/25",
    title: "Advertisement for Human Resource Positions",
    closeDate: "2025-12-29",
    postedDate: "2025-12-14",
  },
  {
    id: 3,
    number: "CHANZEYWE/ADMIN/ADVERT/11/25",
    title: "Advertisement for Administrator Positions",
    closeDate: "2027-12-01",
    postedDate: "2024-11-14",
  },
];

const isOpen = (closeDate) => new Date(closeDate) >= new Date();

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const JobTable = ({ rows, showAction }) => (
  <div className="career-card">
    <div className="table-wrapper">
      <table className="career-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Vacancy No.</th>
            <th>Job Title</th>
            <th>Published</th>
            <th>Closing Date</th>
            <th>Status</th>
            {showAction && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((job, index) => (
            <tr key={job.id}>
              <td>{index + 1}</td>
              <td>{job.number}</td>
              <td>{job.title}</td>
              <td>{fmt(job.postedDate)}</td>
              <td>{fmt(job.closeDate)}</td>
              <td>
                <span className={`status ${showAction ? "open" : "closed"}`}>
                  {showAction ? "Open" : "Closed"}
                </span>
              </td>
              {showAction && (
                <td>
                  <a href={JobPdf} download className="apply-btn">
                    <FaDownload style={{ fontSize: "0.72rem" }} /> Download
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Career = () => {
  const openJobs   = jobs.filter((j) => isOpen(j.closeDate));
  const closedJobs = jobs.filter((j) => !isOpen(j.closeDate));

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="career-hero">
        <img src={Photo} alt="Careers at Chanzeywe" />
        <div className="career-hero-text">
          <h2>Careers at Chanzeywe Vocational Training College</h2>
          <p>Chanzeywe is an equal opportunity employer.</p>
          <div className="career-hero-text__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <span>Careers</span>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="career-body">

        {/* Open Vacancies */}
        <section className="career-section">
          <div className="career-section__header">
            <span className="career-section__dot career-section__dot--open" />
            <h3>Open Career Opportunities</h3>
            <span className="career-section__count career-section__count--open">
              {openJobs.length} Active
            </span>
          </div>

          {openJobs.length === 0 ? (
            <div className="no-jobs-container">
              <img src={Sorry} alt="No vacancies" />
              <p>No open vacancies at the moment.</p>
              <span>Check back soon for new opportunities.</span>
            </div>
          ) : (
            <JobTable rows={openJobs} showAction={true} />
          )}
        </section>

        {/* Closed Vacancies */}
        <section className="career-section">
          <div className="career-section__header">
            <span className="career-section__dot career-section__dot--closed" />
            <h3>Closed Vacancies</h3>
            <span className="career-section__count career-section__count--closed">
              {closedJobs.length} Closed
            </span>
          </div>

          {closedJobs.length === 0 ? (
            <p style={{ color: "var(--cr-muted)", fontFamily: "var(--cr-font)", fontSize: "0.9rem" }}>
              No closed vacancies on record.
            </p>
          ) : (
            <JobTable rows={closedJobs} showAction={false} />
          )}
        </section>

      </div>

      <Footer />
    </>
  );
};

export default Career;