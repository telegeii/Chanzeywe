import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import Photo from "../../assets/Photo1.jpg";
import JobPdf from "../../assets/English.pdf"; // sample PDF
import Sorry from "../../assets/sorry.png";
import "./Career.css";

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

// helper function
const isOpen = (closeDate) => new Date(closeDate) >= new Date();

const Career = () => {
  const openJobs = jobs.filter((job) => isOpen(job.closeDate));
  const closedJobs = jobs.filter((job) => !isOpen(job.closeDate));

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="career-hero">
        <img src={Photo} alt="Careers" />
        <div className="career-hero-text">
          <h2>Careers at Chanzeywe Vocational Training College</h2>
          <p>Chanzeywe is an equal opportunity employer</p>
        </div>
      </section>

      {/* OPEN VACANCIES */}
      <section className="career-section">
        <h3>Open Career Opportunities</h3>

        {openJobs.length === 0 ? (
          <div className="no-jobs-container">
            <img src={Sorry} alt="No vacancies" />
            <p>No open vacancies at the moment.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="career-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vacancy No.</th>
                  <th>Job Title</th>
                  <th>Posted</th>
                  <th>Closing Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {openJobs.map((job, index) => (
                  <tr key={job.id}>
                    <td>{index + 1}</td>
                    <td>{job.number}</td>
                    <td>{job.title}</td>
                    <td>{job.postedDate}</td>
                    <td>{job.closeDate}</td>
                    <td>
                      <span className="status open">Open</span>
                    </td>
                    <td>
                      <a href={JobPdf} download className="apply-btn">
                        Apply
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CLOSED VACANCIES */}
      <section className="career-section closed">
        <h3>Closed Vacancies</h3>

        {closedJobs.length === 0 ? (
          <p className="no-jobs">No closed vacancies.</p>
        ) : (
          <div className="table-wrapper">
            <table className="career-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vacancy No.</th>
                  <th>Job Title</th>
                  <th>Posted</th>
                  <th>Closing Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {closedJobs.map((job, index) => (
                  <tr key={job.id}>
                    <td>{index + 1}</td>
                    <td>{job.number}</td>
                    <td>{job.title}</td>
                    <td>{job.postedDate}</td>
                    <td>{job.closeDate}</td>
                    <td>
                      <span className="status closed">Application Closed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
};

export default Career;