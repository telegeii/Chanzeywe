import React from "react";
import "../AdminDashboard.css";
import {
  FaBook, FaFileContract, FaBriefcase, FaDownload,
  FaNewspaper, FaBuilding, FaUsers, FaEye,
  FaArrowUp, FaArrowDown, FaExclamationTriangle,
} from "react-icons/fa";

const stats = [
  { label: "Total Courses",    value: 18,  icon: <FaBook />,         color: "#0a3d8f", bg: "rgba(10,61,143,0.1)",  trend: "+2",  up: true  },
  { label: "Active Tenders",   value: 2,   icon: <FaFileContract />, color: "#16a34a", bg: "rgba(22,163,74,0.1)",  trend: "New", up: true  },
  { label: "Open Vacancies",   value: 2,   icon: <FaBriefcase />,    color: "#d97706", bg: "rgba(217,119,6,0.1)",  trend: "0",   up: null  },
  { label: "Downloads",        value: 9,   icon: <FaDownload />,     color: "#7c3aed", bg: "rgba(124,58,237,0.1)", trend: "+3",  up: true  },
  { label: "Blog Posts",       value: 6,   icon: <FaNewspaper />,    color: "#0891b2", bg: "rgba(8,145,178,0.1)",  trend: "+1",  up: true  },
  { label: "Departments",      value: 5,   icon: <FaBuilding />,     color: "#dc2626", bg: "rgba(220,38,38,0.1)",  trend: "—",   up: null  },
];

const recent = [
  { type: "Career",   title: "BOG Trainer Positions",       date: "14 Dec 2025", status: "open"   },
  { type: "Tender",   title: "Supply of Lab Equipment",     date: "10 Dec 2025", status: "open"   },
  { type: "Blog",     title: "CDACC Accreditation Update",  date: "8 Dec 2025",  status: "pub"    },
  { type: "Tender",   title: "Stationery Supply 2024",      date: "1 Nov 2025",  status: "closed" },
  { type: "Career",   title: "Administrator Positions",     date: "14 Nov 2024", status: "closed" },
];

const alerts = [
  { msg: "2 tenders closing within 30 days",  color: "#d97706" },
  { msg: "Career post expires 29 Dec 2025",   color: "#dc2626" },
];

export default function OverviewPanel() {
  return (
    <div>
      {/* Header */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Dashboard Overview</h1>
          <p className="adm-page-header__sub">Welcome back, Administrator. Here's what's happening on the site.</p>
        </div>
        <span style={{ fontSize: "0.78rem", color: "var(--adm-muted)" }}>
          {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {/* Alerts */}
      {alerts.map((a, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#fff", border: `1.5px solid ${a.color}33`,
          borderLeft: `4px solid ${a.color}`, borderRadius: 10,
          padding: "11px 16px", marginBottom: 12,
          fontSize: "0.83rem", color: "var(--adm-text)",
        }}>
          <FaExclamationTriangle style={{ color: a.color, flexShrink: 0 }} />
          {a.msg}
        </div>
      ))}

      {/* Stats */}
      <div className="adm-stats">
        {stats.map((s, i) => (
          <div key={i} className="adm-stat-card">
            <div className="adm-stat-card__top">
              <div className="adm-stat-card__icon" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              {s.up !== null && (
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700, color: s.up ? "#16a34a" : "#dc2626",
                  display: "flex", alignItems: "center", gap: 3,
                }}>
                  {s.up ? <FaArrowUp style={{ fontSize: "0.6rem" }} /> : <FaArrowDown style={{ fontSize: "0.6rem" }} />}
                  {s.trend}
                </span>
              )}
            </div>
            <div className="adm-stat-card__value">{s.value}</div>
            <div className="adm-stat-card__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="adm-card">
        <div className="adm-card__header">
          <span className="adm-card__title">Recent Activity</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span className={`adm-pill adm-pill--${r.type === "Career" ? "blue" : r.type === "Tender" ? "amber" : "green"}`}>
                      {r.type}
                    </span>
                  </td>
                  <td>{r.title}</td>
                  <td style={{ color: "var(--adm-muted)", fontSize: "0.8rem" }}>{r.date}</td>
                  <td>
                    <span className={`adm-pill ${r.status === "open" || r.status === "pub" ? "adm-pill--green" : "adm-pill--red"}`}>
                      {r.status === "pub" ? "Published" : r.status === "open" ? "Open" : "Closed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="adm-card">
        <div className="adm-card__header">
          <span className="adm-card__title">Quick Actions</span>
        </div>
        <div className="adm-card__body" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Add Course", "Post Tender", "Post Vacancy", "Add Download", "Write Blog Post"].map((a, i) => (
            <button key={i} className="adm-btn adm-btn--ghost">{a}</button>
          ))}
        </div>
      </div>
    </div>
  );
}