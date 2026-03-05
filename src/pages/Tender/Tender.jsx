import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import Photo from "../../assets/Photo1.jpg";
import TenderPdf from "../../assets/English.pdf";
import Sorry from "../../assets/sorry.png";
import "./Tender.css";
import { Link } from "react-router-dom";
import { FaChevronRight, FaDownload, FaFileContract } from "react-icons/fa";

const tenders = [
  {
    id: 1,
    number: "CHANZEYWE/OT/01/2023-2024",
    title: "Provision of Printing Papers",
    method: "Open Tender",
    postedDate: "2025-12-14",
    closeDate: "2024-12-29",
  },
  {
    id: 2,
    number: "CHANZEYWE/OT/02/2025-2026",
    title: "Provision of Security Services",
    method: "Restricted Tender",
    postedDate: "2025-12-14",
    closeDate: "2025-12-29",
  },
  {
    id: 3,
    number: "CHANZEYWE/OT/03/2025-2026",
    title: "Provision of Washing Soap",
    method: "Open Tender",
    postedDate: "2025-12-14",
    closeDate: "2024-12-01",
  },
];

const isOpen = (closeDate) => new Date(closeDate) >= new Date();

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const TenderTable = ({ rows, showAction }) => (
  <div className="tender-card">
    <div className="table-wrapper">
      <table className="tender-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tender No.</th>
            <th>Description</th>
            <th>Method</th>
            <th>Published</th>
            <th>Closing</th>
            <th>Status</th>
            {showAction && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((tender, index) => (
            <tr key={tender.id}>
              <td>{index + 1}</td>
              <td>{tender.number}</td>
              <td>{tender.title}</td>
              <td>{tender.method}</td>
              <td>{fmt(tender.postedDate)}</td>
              <td>{fmt(tender.closeDate)}</td>
              <td>
                <span className={`status ${showAction ? "open" : "closed"}`}>
                  {showAction ? "Open" : "Closed"}
                </span>
              </td>
              {showAction && (
                <td>
                  <a href={TenderPdf} download className="apply-btn">
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

const Tender = () => {
  const openTenders   = tenders.filter((t) => isOpen(t.closeDate));
  const closedTenders = tenders.filter((t) => !isOpen(t.closeDate));

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="tender-hero">
        <img src={Photo} alt="Tenders at Chanzeywe" />
        <div className="tender-hero-text">
          <h2>Tenders at Chanzeywe Vocational Training College</h2>
          <p>We welcome suppliers to participate in our procurement processes.</p>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="tender-body">

        {/* Open Tenders */}
        <section className="tender-section">
          <div className="tender-section__header">
            <span className="tender-section__dot tender-section__dot--open" />
            <h3>Open Tender Opportunities</h3>
            <span className="tender-section__count tender-section__count--open">
              {openTenders.length} Active
            </span>
          </div>

          {openTenders.length === 0 ? (
            <div className="no-tenders-container">
              <img src={Sorry} alt="No open tenders" />
              <p>No open tenders at the moment.</p>
              <span>Check back soon for upcoming procurement opportunities.</span>
            </div>
          ) : (
            <TenderTable rows={openTenders} showAction={true} />
          )}
        </section>

        {/* Closed Tenders */}
        <section className="tender-section">
          <div className="tender-section__header">
            <span className="tender-section__dot tender-section__dot--closed" />
            <h3>Closed Tenders</h3>
            <span className="tender-section__count tender-section__count--closed">
              {closedTenders.length} Closed
            </span>
          </div>

          {closedTenders.length === 0 ? (
            <p style={{ color: "var(--td-muted)", fontFamily: "var(--td-font)", fontSize: "0.9rem" }}>
              No closed tenders on record.
            </p>
          ) : (
            <TenderTable rows={closedTenders} showAction={false} />
          )}
        </section>

      </div>

      <Footer />
    </>
  );
};

export default Tender;