import React from "react";
import "../../AdminDashboard.css";
import "./OverviewPanel.css";

import {
  FaBook, FaFileContract, FaBriefcase, FaDownload,
  FaNewspaper, FaBuilding, FaArrowUp, FaClipboardList,
  FaClock, FaShieldAlt,
} from "react-icons/fa";

/* ── Stat data ────────────────────────── */
const STATS = [
  {
    label: "Total Courses",
    value: 18,
    icon:  <FaBook />,
    color: "#0a3d8f",
    bg:    "rgba(10,61,143,0.1)",
    trend: "+2 this month",
    up:    true,
  },
  {
    label: "Active Tenders",
    value: 2,
    icon:  <FaFileContract />,
    color: "#16a34a",
    bg:    "rgba(22,163,74,0.1)",
    trend: "Newly posted",
    up:    true,
  },
  {
    label: "Open Vacancies",
    value: 2,
    icon:  <FaBriefcase />,
    color: "#d97706",
    bg:    "rgba(217,119,6,0.1)",
    trend: "No change",
    up:    null,
  },
  {
    label: "Downloads",
    value: 9,
    icon:  <FaDownload />,
    color: "#7c3aed",
    bg:    "rgba(124,58,237,0.1)",
    trend: "+3 this week",
    up:    true,
  },
  {
    label: "Blog Posts",
    value: 6,
    icon:  <FaNewspaper />,
    color: "#0891b2",
    bg:    "rgba(8,145,178,0.1)",
    trend: "+1 published",
    up:    true,
  },
  {
    label: "Departments",
    value: 5,
    icon:  <FaBuilding />,
    color: "#dc2626",
    bg:    "rgba(220,38,38,0.1)",
    trend: "Stable",
    up:    null,
  },
  {
    label: "Applications",
    value: 8,
    icon:  <FaClipboardList />,
    color: "#db2777",
    bg:    "rgba(219,39,119,0.1)",
    trend: "3 pending",
    up:    true,
  },
  {
    label: "Corruption Reports",
    value: 2,
    icon:  <FaShieldAlt />,
    color: "#7c3aed",
    bg:    "rgba(124,58,237,0.1)",
    trend: "Under review",
    up:    null,
  },
];

/* ══ OVERVIEW PANEL ════════════════════ */
export default function OverviewPanel() {
  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });

  return (
    <div className="ovp">

      {/* ── Welcome banner ── */}
      <div className="ovp-banner">
        {/* Decorative orbs */}
        <div className="ovp-banner__orb ovp-banner__orb--1" />
        <div className="ovp-banner__orb ovp-banner__orb--2" />
        <div className="ovp-banner__orb ovp-banner__orb--3" />

        <div className="ovp-banner__left">
          <div className="ovp-banner__eyebrow">
            <span className="ovp-banner__pulse" />
            Chanzeywe TVC — Admin Portal
          </div>
          <h1 className="ovp-banner__title">Good morning, Administrator 👋</h1>
          <p className="ovp-banner__date">
            <FaClock style={{ opacity: 0.55, fontSize: "0.75rem" }} />
            {today}
          </p>
        </div>

        {/* Quick-count chips */}
        <div className="ovp-banner__chips">
          <div className="ovp-banner__chip">
            <div className="ovp-banner__chip-icon">
              <FaClipboardList />
            </div>
            <div>
              <span className="ovp-banner__chip-val">8</span>
              <span className="ovp-banner__chip-label">Applications</span>
            </div>
          </div>
          <div className="ovp-banner__chip ovp-banner__chip--purple">
            <div className="ovp-banner__chip-icon ovp-banner__chip-icon--purple">
              <FaShieldAlt />
            </div>
            <div>
              <span className="ovp-banner__chip-val">2</span>
              <span className="ovp-banner__chip-label">Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="ovp-stat-grid">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="ovp-stat"
            style={{ "--sc": s.color, "--sb": s.bg }}
          >
            {/* Top colour accent bar */}
            <div className="ovp-stat__top-bar" />

            <div className="ovp-stat__row">
              <div className="ovp-stat__icon">{s.icon}</div>
              {s.up && (
                <span className="ovp-stat__badge">
                  <FaArrowUp style={{ fontSize: "0.48rem" }} />
                  {s.trend.split(" ")[0]}
                </span>
              )}
            </div>

            <div className="ovp-stat__value">{s.value}</div>
            <div className="ovp-stat__label">{s.label}</div>
            <div className="ovp-stat__hint">{s.trend}</div>
          </div>
        ))}
      </div>

    </div>
  );
} 