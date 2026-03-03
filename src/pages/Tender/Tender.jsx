import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import Photo from "../../assets/Photo1.jpg";
import TenderPdf from "../../assets/English.pdf"; // sample PDF for download
import Sorry from "../../assets/sorry.png";
import "./Tender.css";

const tenders = [
  {
    id: 1,
    number: "CHANZEYWE/OT/01/2023-2024",
    title: "PROVISION OF PRINTING PAPERS",
    method: "Open Tender",
    postedDate: "2025-12-14",
    closeDate: "2024-12-29",
  },
  {
    id: 2,
    number: "CHANZEYWE/OT/02/2025-2026",
    title: "PROVISION OF SECURITY SERVICES",
    method: "Restricted Tender",
    postedDate: "2025-12-14",
    closeDate: "2025-12-29",
  },
  {
    id: 3,
    number: "CHANZEYWE/OT/03/2025-2026",
    title: "PROVISION OF WASHING SOAP",
    method: "Open Tender",
    postedDate: "2025-12-14",
    closeDate: "2024-12-01",
  },
];

// helper function to check if tender is open
const isOpen = (closeDate) => new Date(closeDate) >= new Date();

const Tender = () => {
  const openTenders = tenders.filter((tender) => isOpen(tender.closeDate));
  const closedTenders = tenders.filter((tender) => !isOpen(tender.closeDate));

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="tender-hero">
        <img src={Photo} alt="Tenders" />
        <div className="tender-hero-text">
          <h2>Tenders at Chanzeywe Vocational Training College</h2>
          <p>We welcome suppliers to participate in our procurement processes</p>
        </div>
      </section>

      {/* OPEN TENDERS */}
      <section className="tender-section">
        <h3>Open Tender Opportunities</h3>

        {openTenders.length === 0 ? (
          <div className="no-tenders-container">
            <img src={Sorry} alt="No tenders" />
            <p>No open tenders at the moment.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="tender-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tender No.</th>
                  <th>Tender Description</th>
                  <th>Procurement Method</th>
                  <th>Published Date</th>
                  <th>Closing Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {openTenders.map((tender, index) => (
                  <tr key={tender.id}>
                    <td>{index + 1}</td>
                    <td>{tender.number}</td>
                    <td>{tender.title}</td>
                    <td>{tender.method}</td>
                    <td>{tender.postedDate}</td>
                    <td>{tender.closeDate}</td>
                    <td>
                      <span className="status open">Open</span>
                    </td>
                    <td>
                      <a href={TenderPdf} download className="apply-btn">
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

      {/* CLOSED TENDERS */}
      <section className="tender-section closed">
        <h3>Closed Tenders</h3>

        {closedTenders.length === 0 ? (
          <p className="no-tenders">No closed tenders.</p>
        ) : (
          <div className="table-wrapper">
            <table className="tender-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tender No.</th>
                  <th>Tender Description</th>
                  <th>Procurement Method</th>
                  <th>Published Date</th>
                  <th>Closing Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {closedTenders.map((tender, index) => (
                  <tr key={tender.id}>
                    <td>{index + 1}</td>
                    <td>{tender.number}</td>
                    <td>{tender.title}</td>
                    <td>{tender.method}</td>
                    <td>{tender.postedDate}</td>
                    <td>{tender.closeDate}</td>
                    <td>
                      <span className="status closed">Closed</span>
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

export default Tender;