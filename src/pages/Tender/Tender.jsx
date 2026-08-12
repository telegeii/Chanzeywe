import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import Photo from "../../assets/Photo1.jpg";
import Sorry from "../../assets/sorry.png";
import "./Tender.css";
import { Link } from "react-router-dom";
import { FaChevronRight, FaDownload } from "react-icons/fa";
import { apiGet } from "../../utils/api";
import useSeo from "../../utils/useSeo";

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
                  {tender.fileUrl ? (
                    <a href={tender.fileUrl} download className="apply-btn">
                      <FaDownload style={{ fontSize: "0.72rem" }} /> Download
                    </a>
                  ) : (
                    <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>No file</span>
                  )}
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
  useSeo({
    title: "Tenders",
    description: "Current and past procurement tenders at Chanzeywe Vocational Training College, Vihiga County, Kenya. Subject to PPRA regulations.",
  });

  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/tenders.php")
      .then(setTenders)
      .catch(() => setError("Unable to load tenders right now. Please try again shortly."))
      .finally(() => setLoading(false));
  }, []);

  const openTenders   = tenders.filter((t) => isOpen(t.closeDate));
  // Public site only ever shows the 5 most recently closed tenders — older
  // ones stay in the admin panel's records but drop off the public list.
  const closedTenders = tenders
    .filter((t) => !isOpen(t.closeDate))
    .sort((a, b) => new Date(b.closeDate) - new Date(a.closeDate))
    .slice(0, 5);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="tender-hero">
        <img src={Photo} alt="Tenders at Chanzeywe" />
        <div className="tender-hero-text">
          <h2>Tenders at Chanzeywe Vocational Training College</h2>
          <p>We welcome suppliers to participate in our procurement processes.</p>
          <div className="tender-hero-text__breadcrumb">
            <Link to="/">Home</Link>
            <FaChevronRight />
            <span>Tenders</span>
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="tender-body">

        {loading && <p style={{ textAlign: "center", padding: "40px 0", fontFamily: "var(--td-font)" }}>Loading tenders…</p>}
        {!loading && error && (
          <p style={{ textAlign: "center", padding: "40px 0", fontFamily: "var(--td-font)", color: "#b91c1c" }}>{error}</p>
        )}

        {!loading && !error && (
          <>
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
          </>
        )}

      </div>

      <Footer />
    </>
  );
};

export default Tender;
