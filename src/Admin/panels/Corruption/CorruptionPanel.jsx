import React, { useState } from "react";
import "../../AdminDashboard.css";
import "./CorruptionPanel.css";
import {
  FaShieldAlt, FaExclamationTriangle, FaEye, FaCheck,
  FaTimes, FaSearch, FaFilter, FaDownload, FaClock,
  FaUserSecret, FaLock, FaChevronDown, FaFlag,
  FaFileAlt, FaTrash, FaCheckCircle, FaHourglassHalf,
  FaBan, FaUserTie,
} from "react-icons/fa";

/* ── Seed data ──────────────────────────── */
const INIT_REPORTS = [
  {
    id: "RPT-001",
    type: "Bribery",
    location: "Finance Office",
    individual: "Unknown",
    date: "2025-12-10",
    received: "2025-12-11",
    description:
      "A staff member was reportedly demanding payment before processing student fee receipts. Multiple students witnessed the incident near the bursar's window.",
    status: "under_review",
    severity: "high",
  },
  {
    id: "RPT-002",
    type: "Abuse of Power",
    location: "Admissions Department",
    individual: "Dept. Head (unnamed)",
    date: "2025-12-05",
    received: "2025-12-07",
    description:
      "Admissions officer allegedly bypassing merit criteria for certain applicants. Favouring applicants from a specific region without valid academic justification.",
    status: "investigating",
    severity: "high",
  },
  {
    id: "RPT-003",
    type: "Nepotism / Favoritism",
    location: "HR Department",
    individual: "Not disclosed",
    date: "2025-11-28",
    received: "2025-11-29",
    description:
      "A junior staff position was filled without proper advertisement. The hired individual is reportedly related to a senior officer.",
    status: "resolved",
    severity: "medium",
  },
  {
    id: "RPT-004",
    type: "Misuse of Resources",
    location: "ICT Department",
    individual: "Anonymous",
    date: "2025-11-15",
    received: "2025-11-16",
    description:
      "Institution equipment (laptops and printers) reported to have been taken off premises for personal use without authorization.",
    status: "dismissed",
    severity: "low",
  },
  {
    id: "RPT-005",
    type: "Embezzlement",
    location: "Student Affairs",
    individual: "Senior staff member",
    date: "2025-12-01",
    received: "2025-12-02",
    description:
      "Student welfare funds reportedly diverted. Discrepancy found in welfare fund disbursement records for the month of November 2025.",
    status: "under_review",
    severity: "critical",
  },
  {
    id: "RPT-006",
    type: "Fraud",
    location: "Procurement",
    individual: "Not specified",
    date: "2025-10-20",
    received: "2025-10-21",
    description:
      "Tender awarded to a vendor whose bid was not the lowest. No documented justification. Conflict of interest suspected between procurement officer and vendor.",
    status: "resolved",
    severity: "high",
  },
];

const STATUS_CFG = {
  under_review: { label: "Under Review",  icon: <FaHourglassHalf />, cls: "crp-status--review"    },
  investigating: { label: "Investigating", icon: <FaSearch />,         cls: "crp-status--invest"   },
  resolved:     { label: "Resolved",      icon: <FaCheckCircle />,    cls: "crp-status--resolved" },
  dismissed:    { label: "Dismissed",     icon: <FaBan />,            cls: "crp-status--dismissed"},
};

const SEVERITY_CFG = {
  critical: { label: "Critical", cls: "crp-sev--critical" },
  high:     { label: "High",     cls: "crp-sev--high"     },
  medium:   { label: "Medium",   cls: "crp-sev--medium"   },
  low:      { label: "Low",      cls: "crp-sev--low"      },
};

const TYPE_ICONS = {
  "Bribery":             "💰",
  "Fraud":               "🔍",
  "Abuse of Power":      "⚠️",
  "Embezzlement":        "💸",
  "Conflict of Interest":"⚖️",
  "Nepotism / Favoritism":"👥",
  "Misuse of Resources": "🖥️",
  "Other":               "📋",
};

const ALL_STATUSES = ["all", "under_review", "investigating", "resolved", "dismissed"];

/* ══ CORRUPTION PANEL ════════════════════ */
export default function CorruptionPanel() {
  const [reports, setReports]       = useState(INIT_REPORTS);
  const [selected, setSelected]     = useState(null);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [severityFilter, setSeverity] = useState("all");

  /* counts */
  const counts = {
    all:          reports.length,
    under_review: reports.filter(r => r.status === "under_review").length,
    investigating:reports.filter(r => r.status === "investigating").length,
    resolved:     reports.filter(r => r.status === "resolved").length,
    dismissed:    reports.filter(r => r.status === "dismissed").length,
  };

  const criticalCount = reports.filter(r => r.severity === "critical").length;

  /* update status */
  const updateStatus = (id, status) => {
    setReports(rs => rs.map(r => r.id === id ? {...r, status} : r));
    setSelected(s => s && s.id === id ? {...s, status} : s);
  };

  /* delete */
  const deleteReport = id => {
    setReports(rs => rs.filter(r => r.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  /* filter + search */
  const visible = reports.filter(r => {
    const matchStatus   = filter === "all" || r.status === filter;
    const matchSeverity = severityFilter === "all" || r.severity === severityFilter;
    const matchSearch   = !search || [r.id, r.type, r.location, r.individual]
      .join(" ").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSeverity && matchSearch;
  });

  return (
    <div className="crp">

      {/* ══ HEADER BANNER ══ */}
      <div className="crp-banner">
        <div className="crp-banner__orb crp-banner__orb--1" />
        <div className="crp-banner__orb crp-banner__orb--2" />
        <div className="crp-banner__cross crp-banner__cross--1" />
        <div className="crp-banner__cross crp-banner__cross--2" />

        <div className="crp-banner__left">
          <div className="crp-banner__eyebrow">
            <FaShieldAlt />
            Governance &amp; Integrity
          </div>
          <h1 className="crp-banner__title">Corruption Reports</h1>
          <p className="crp-banner__sub">
            All submissions are anonymous and confidential.
            Review, investigate and act on each report below.
          </p>
        </div>

        {/* Summary pills */}
        <div className="crp-banner__pills">
          <div className="crp-banner__pill crp-banner__pill--critical">
            <FaExclamationTriangle />
            <div>
              <span className="crp-banner__pill-val">{criticalCount}</span>
              <span className="crp-banner__pill-lbl">Critical</span>
            </div>
          </div>
          <div className="crp-banner__pill crp-banner__pill--review">
            <FaHourglassHalf />
            <div>
              <span className="crp-banner__pill-val">{counts.under_review}</span>
              <span className="crp-banner__pill-lbl">Under Review</span>
            </div>
          </div>
          <div className="crp-banner__pill crp-banner__pill--total">
            <FaFileAlt />
            <div>
              <span className="crp-banner__pill-val">{counts.all}</span>
              <span className="crp-banner__pill-lbl">Total Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ TRUST STRIP ══ */}
      <div className="crp-trust-strip">
        {[
          { icon:<FaUserSecret />, text:"All submissions are 100% anonymous" },
          { icon:<FaLock />,       text:"Encrypted & strictly confidential"  },
          { icon:<FaShieldAlt />,  text:"Whistleblower protection applies"   },
        ].map((t, i) => (
          <div key={i} className="crp-trust-item">
            <span className="crp-trust-item__icon">{t.icon}</span>
            <span className="crp-trust-item__text">{t.text}</span>
          </div>
        ))}
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="crp-layout">

        {/* ── LEFT: list ── */}
        <div className="crp-list-col">

          {/* Search + filter bar */}
          <div className="crp-toolbar">
            <div className="crp-search">
              <FaSearch className="crp-search__icon" />
              <input
                type="text"
                placeholder="Search by ID, type, location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="crp-severity-select">
              <FaFilter style={{fontSize:"0.75rem", color:"#6b7280"}} />
              <select value={severityFilter} onChange={e => setSeverity(e.target.value)}>
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <FaChevronDown style={{fontSize:"0.6rem", color:"#9ca3af"}} />
            </div>
          </div>

          {/* Status tabs */}
          <div className="crp-tabs">
            {ALL_STATUSES.map(s => (
              <button
                key={s}
                className={`crp-tab${filter === s ? " crp-tab--active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s === "all" ? "All" : STATUS_CFG[s].label}
                <span className="crp-tab__count">{counts[s] ?? 0}</span>
              </button>
            ))}
          </div>

          {/* Report cards */}
          <div className="crp-cards">
            {visible.length === 0 && (
              <div className="crp-empty">
                <FaShieldAlt style={{fontSize:"2rem", opacity:0.15}}/>
                <p>No reports match your filters.</p>
              </div>
            )}

            {visible.map(r => {
              const sc = STATUS_CFG[r.status];
              const sv = SEVERITY_CFG[r.severity];
              const isActive = selected?.id === r.id;

              return (
                <div
                  key={r.id}
                  className={`crp-card${isActive ? " crp-card--active" : ""}`}
                  onClick={() => setSelected(r)}
                >
                  {/* Severity stripe */}
                  <div className={`crp-card__stripe crp-stripe--${r.severity}`} />

                  <div className="crp-card__top">
                    <div className="crp-card__type-icon">
                      {TYPE_ICONS[r.type] || "📋"}
                    </div>
                    <div className="crp-card__meta">
                      <div className="crp-card__id">{r.id}</div>
                      <div className="crp-card__type">{r.type}</div>
                    </div>
                    <div className="crp-card__badges">
                      <span className={`crp-sev ${sv.cls}`}>{sv.label}</span>
                      <span className={`crp-status ${sc.cls}`}>{sc.icon} {sc.label}</span>
                    </div>
                  </div>

                  <div className="crp-card__location">
                    <FaUserTie style={{opacity:0.45, fontSize:"0.7rem"}}/> {r.location}
                  </div>
                  <div className="crp-card__desc">{r.description}</div>
                  <div className="crp-card__foot">
                    <span className="crp-card__date">
                      <FaClock style={{fontSize:"0.6rem"}}/> Received {r.received}
                    </span>
                    <button
                      className="crp-card__view-btn"
                      onClick={e => { e.stopPropagation(); setSelected(r); }}
                    >
                      <FaEye /> View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: detail ── */}
        <div className={`crp-detail${selected ? " crp-detail--open" : ""}`}>
          {!selected ? (
            <div className="crp-detail__empty">
              <div className="crp-detail__empty-icon">
                <FaShieldAlt />
              </div>
              <p>Select a report to view full details and take action.</p>
            </div>
          ) : (
            <>
              {/* Detail header */}
              <div className="crp-detail__head">
                <div>
                  <div className="crp-detail__id">{selected.id}</div>
                  <h3 className="crp-detail__title">{selected.type}</h3>
                  <div className="crp-detail__badges">
                    <span className={`crp-sev ${SEVERITY_CFG[selected.severity].cls}`}>
                      {SEVERITY_CFG[selected.severity].label}
                    </span>
                    <span className={`crp-status ${STATUS_CFG[selected.status].cls}`}>
                      {STATUS_CFG[selected.status].icon} {STATUS_CFG[selected.status].label}
                    </span>
                  </div>
                </div>
                <button className="crp-detail__close" onClick={() => setSelected(null)}>
                  <FaTimes />
                </button>
              </div>

              {/* Fields */}
              <div className="crp-detail__body">
                <div className="crp-detail__fields">
                  {[
                    { label:"Location / Department", value: selected.location     },
                    { label:"Individual(s) Involved", value: selected.individual  },
                    { label:"Incident Date",           value: selected.date        },
                    { label:"Report Received",         value: selected.received    },
                  ].map((f, i) => (
                    <div key={i} className="crp-detail__field">
                      <span className="crp-detail__field-label">{f.label}</span>
                      <span className="crp-detail__field-value">{f.value}</span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="crp-detail__desc-block">
                  <div className="crp-detail__desc-label">
                    <FaFileAlt /> Incident Description
                  </div>
                  <p className="crp-detail__desc-text">{selected.description}</p>
                </div>

                {/* Confidential notice */}
                <div className="crp-detail__notice">
                  <FaLock />
                  <span>
                    This report is anonymous and confidential. Do not share identifying
                    details outside the integrity committee.
                  </span>
                </div>

                {/* Action buttons */}
                <div className="crp-detail__section-label">Update Status</div>
                <div className="crp-detail__actions">
                  <button
                    className="crp-action-btn crp-action-btn--review"
                    onClick={() => updateStatus(selected.id, "under_review")}
                    disabled={selected.status === "under_review"}
                  >
                    <FaHourglassHalf /> Under Review
                  </button>
                  <button
                    className="crp-action-btn crp-action-btn--invest"
                    onClick={() => updateStatus(selected.id, "investigating")}
                    disabled={selected.status === "investigating"}
                  >
                    <FaSearch /> Investigating
                  </button>
                  <button
                    className="crp-action-btn crp-action-btn--resolve"
                    onClick={() => updateStatus(selected.id, "resolved")}
                    disabled={selected.status === "resolved"}
                  >
                    <FaCheck /> Resolve
                  </button>
                  <button
                    className="crp-action-btn crp-action-btn--dismiss"
                    onClick={() => updateStatus(selected.id, "dismissed")}
                    disabled={selected.status === "dismissed"}
                  >
                    <FaBan /> Dismiss
                  </button>
                </div>

                {/* Danger zone */}
                <div className="crp-detail__danger">
                  <button
                    className="crp-danger-btn"
                    onClick={() => deleteReport(selected.id)}
                  >
                    <FaTrash /> Delete Report
                  </button>
                  <button className="crp-export-btn">
                    <FaDownload /> Export PDF
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}