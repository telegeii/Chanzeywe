import React, { useState, useEffect } from "react";
import "../../AdminDashboard.css";
import "./ApplicationPanel.css";
import { apiGet, apiPut, apiDelete } from "../../../utils/api";
import {
  FaClipboardList, FaUser, FaGraduationCap, FaPhone,
  FaEnvelope, FaSearch, FaFilter, FaEye, FaCheck,
  FaTimes, FaChevronDown, FaDownload, FaClock,
  FaCheckCircle, FaHourglassHalf, FaBan, FaTimesCircle,
  FaBuilding, FaCalendarAlt, FaIdCard, FaFileAlt,
  FaUpload, FaTrash, FaMapMarkerAlt,
} from "react-icons/fa";

/* ─── Config ─── */
const STATUS_CFG = {
  pending:  { label:"Pending",  icon:<FaHourglassHalf />, cls:"app-status--pending"  },
  reviewed: { label:"Reviewed", icon:<FaEye />,           cls:"app-status--reviewed" },
  accepted: { label:"Accepted", icon:<FaCheckCircle />,   cls:"app-status--accepted" },
  rejected: { label:"Rejected", icon:<FaTimesCircle />,   cls:"app-status--rejected" },
};

const AVATAR_COLORS = [
  "#0a3d8f","#db2777","#16a34a","#d97706",
  "#0891b2","#7c3aed","#dc2626","#059669",
];

const DEPT_COLORS = {
  "Computing & Informatics":      "#0a3d8f",
  "Electrical Engineering":       "#d97706",
  "Liberal Studies":              "#0891b2",
  "Hospitality":                  "#db2777",
  "Building & Civil Engineering": "#7c3aed",
  "Agriculture":                  "#16a34a",
};

const ALL_STATUSES = ["all","pending","reviewed","accepted","rejected"];

const appCode = (id) => `APP-${String(id).padStart(4, "0")}`;
const formatDate = (ts) => (ts ? ts.slice(0, 10) : "—");

/* ══ APPLICATIONS PANEL ════════════════════════════════════ */
export default function ApplicationsPanel() {
  const [apps,       setApps]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [listError,  setListError]  = useState("");
  const [selected,   setSelected]   = useState(null);
  const [docsLoading,setDocsLoading]= useState(false);
  const [actionError,setActionError]= useState("");
  const [filter,     setFilter]     = useState("all");
  const [search,     setSearch]     = useState("");
  const [deptF,      setDeptF]      = useState("all");

  useEffect(() => {
    apiGet("/applications.php")
      .then(setApps)
      .catch(() => setListError("Unable to load applications right now. Please try again shortly."))
      .finally(() => setLoading(false));
  }, []);

  const openApplication = (a) => {
    setSelected(a);
    setActionError("");
    setDocsLoading(true);
    apiGet(`/applications.php?id=${a.id}`)
      .then((full) => setSelected((cur) => (cur?.id === a.id ? full : cur)))
      .catch(() => setActionError("Could not load submitted documents for this application."))
      .finally(() => setDocsLoading(false));
  };

  const counts = {
    all:      apps.length,
    pending:  apps.filter(a => a.status === "pending").length,
    reviewed: apps.filter(a => a.status === "reviewed").length,
    accepted: apps.filter(a => a.status === "accepted").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };

  const depts = ["all", ...Array.from(new Set(apps.map(a => a.department).filter(Boolean)))];

  const setStatus = async (id, st) => {
    setActionError("");
    try {
      const updated = await apiPut("/applications.php", id, { status: st });
      setApps(as => as.map(a => a.id === id ? { ...a, status: updated.status } : a));
      setSelected(s => s?.id === id ? { ...s, status: updated.status } : s);
    } catch (err) {
      setActionError(err.message || "Could not update the application status.");
    }
  };

  const deleteApp = async (id) => {
    if (!window.confirm("Delete this application? This can't be undone.")) return;
    setActionError("");
    try {
      await apiDelete("/applications.php", id);
      setApps(as => as.filter(a => a.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      setActionError(err.message || "Could not delete this application.");
    }
  };

  const visible = apps.filter(a => {
    const okStatus = filter === "all" || a.status === filter;
    const okDept   = deptF  === "all" || a.department === deptF;
    const okSearch = !search || [appCode(a.id), a.fullName, a.courseTitle, a.department, a.email]
      .join(" ").toLowerCase().includes(search.toLowerCase());
    return okStatus && okDept && okSearch;
  });

  return (
    <div className="apl">

      {/* ══ BANNER ══ */}
      <div className="apl-banner">
        <div className="apl-banner__orb apl-banner__orb--1" />
        <div className="apl-banner__orb apl-banner__orb--2" />
        <div className="apl-banner__orb apl-banner__orb--3" />
        <div className="apl-banner__grid" />

        <div className="apl-banner__left">
          <div className="apl-banner__eyebrow">
            <FaClipboardList /> Student Admissions
          </div>
          <h1 className="apl-banner__title">Applications</h1>
          <p className="apl-banner__sub">
            Review, process and manage all incoming student applications.
            Accept or reject based on eligibility and available capacity.
          </p>
        </div>

        <div className="apl-banner__stats">
          {[
            { val: counts.all,      label:"Total",    color:"rgba(255,255,255,0.15)", text:"#fff"    },
            { val: counts.pending,  label:"Pending",  color:"rgba(240,165,0,0.22)",  text:"#fcd34d" },
            { val: counts.accepted, label:"Accepted", color:"rgba(22,163,74,0.22)",  text:"#6ee7b7" },
            { val: counts.rejected, label:"Rejected", color:"rgba(220,38,38,0.22)",  text:"#fca5a5" },
          ].map((s, i) => (
            <div key={i} className="apl-banner__stat" style={{background:s.color}}>
              <span className="apl-banner__stat-val" style={{color:s.text}}>{s.val}</span>
              <span className="apl-banner__stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {listError && (
        <div className="apl-empty" style={{ background: "#fff5f5", color: "#b91c1c" }}>
          <FaTimesCircle style={{ fontSize: "1.4rem" }} />
          <p>{listError}</p>
        </div>
      )}

      {/* ══ MAIN ══ */}
      {!listError && (
      <div className="apl-layout">

        {/* ── LIST COLUMN ── */}
        <div className="apl-list-col">

          {/* Toolbar */}
          <div className="apl-toolbar">
            <div className="apl-search">
              <FaSearch className="apl-search__icon" />
              <input
                type="text"
                placeholder="Search name, course, ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="apl-search__clear" onClick={() => setSearch("")}>
                  <FaTimes />
                </button>
              )}
            </div>
            <div className="apl-select-wrap">
              <FaBuilding style={{fontSize:"0.72rem",color:"#6b7280",flexShrink:0}} />
              <select value={deptF} onChange={e => setDeptF(e.target.value)}>
                {depts.map(d => (
                  <option key={d} value={d}>{d === "all" ? "All Departments" : d}</option>
                ))}
              </select>
              <FaChevronDown style={{fontSize:"0.58rem",color:"#9ca3af",flexShrink:0}} />
            </div>
          </div>

          {/* Status filter tabs */}
          <div className="apl-tabs">
            {ALL_STATUSES.map(s => (
              <button
                key={s}
                className={`apl-tab${filter === s ? " apl-tab--active" : ""} apl-tab--${s}`}
                onClick={() => setFilter(s)}
              >
                {s === "all" ? "All Applications" : STATUS_CFG[s].label}
                <span className="apl-tab__count">{counts[s] ?? 0}</span>
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="apl-cards">
            {loading && (
              <div className="apl-empty">
                <FaClipboardList style={{fontSize:"2rem",opacity:0.15}}/>
                <p>Loading applications…</p>
              </div>
            )}
            {!loading && visible.length === 0 && (
              <div className="apl-empty">
                <FaClipboardList style={{fontSize:"2rem",opacity:0.15}}/>
                <p>No applications match your filters.</p>
              </div>
            )}
            {!loading && visible.map((a) => {
              /* Index into the full (unfiltered) list, not `visible`
                 — otherwise the same applicant's avatar colour shifts
                 between the list and detail panel whenever a filter
                 is active, since the two views used different index
                 sources for the same colour lookup. */
              const i   = apps.findIndex(x => x.id === a.id);
              const sc  = STATUS_CFG[a.status];
              const dc  = DEPT_COLORS[a.department] || "#0a3d8f";
              const isActive = selected?.id === a.id;
              return (
                <div
                  key={a.id}
                  className={`apl-card${isActive ? " apl-card--active" : ""}`}
                  onClick={() => openApplication(a)}
                >
                  <div className="apl-card__bar" style={{background:dc}} />

                  <div className="apl-card__top">
                    {/* Avatar */}
                    <div
                      className="apl-card__avatar"
                      style={{background: AVATAR_COLORS[i % AVATAR_COLORS.length]}}
                    >
                      {a.fullName.split(" ").map(w=>w[0]).join("").slice(0,2)}
                    </div>

                    {/* Name + course */}
                    <div className="apl-card__info">
                      <div className="apl-card__name">{a.fullName}</div>
                      <div className="apl-card__course">
                        <FaGraduationCap style={{fontSize:"0.6rem",opacity:0.55}}/> {a.courseTitle || "—"}
                      </div>
                      <div className="apl-card__dept" style={{color:dc}}>
                        {a.department || "—"} · {a.courseLevel || "—"}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="apl-card__right">
                      <span className={`apl-status ${sc.cls}`}>
                        {sc.icon} {sc.label}
                      </span>
                      <span className="apl-card__id">{appCode(a.id)}</span>
                    </div>
                  </div>

                  <div className="apl-card__foot">
                    <span className="apl-card__date">
                      <FaClock style={{fontSize:"0.58rem"}}/> Received {formatDate(a.receivedAt)}
                    </span>
                    <div className="apl-card__btns">
                      <button
                        className="apl-card__btn apl-card__btn--view"
                        onClick={e => { e.stopPropagation(); openApplication(a); }}
                      >
                        <FaEye /> View
                      </button>
                      <button
                        className="apl-card__btn apl-card__btn--ok"
                        onClick={e => { e.stopPropagation(); setStatus(a.id,"accepted"); }}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="apl-card__btn apl-card__btn--no"
                        onClick={e => { e.stopPropagation(); setStatus(a.id,"rejected"); }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── DETAIL COLUMN ── */}
        <div className={`apl-detail${selected ? " apl-detail--open" : ""}`}>
          {!selected ? (
            <div className="apl-detail__empty">
              <div className="apl-detail__empty-icon"><FaClipboardList /></div>
              <p>Select an application to review the full details.</p>
            </div>
          ) : (() => {
            const sc = STATUS_CFG[selected.status];
            const dc = DEPT_COLORS[selected.department] || "#0a3d8f";
            const idx = apps.findIndex(a => a.id === selected.id);
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            return (
              <>
                {/* Header */}
                <div className="apl-detail__head">
                  <div className="apl-detail__head-bg" style={{background:`${dc}12`}}/>
                  <div className="apl-detail__avatar" style={{background:avatarColor}}>
                    {selected.fullName.split(" ").map(w=>w[0]).join("").slice(0,2)}
                  </div>
                  <div className="apl-detail__title-block">
                    <h3 className="apl-detail__name">{selected.fullName}</h3>
                    <div className="apl-detail__id-row">
                      <span className="apl-detail__app-id">{appCode(selected.id)}</span>
                      <span className={`apl-status ${sc.cls}`}>{sc.icon} {sc.label}</span>
                    </div>
                  </div>
                  <button className="apl-detail__close" onClick={() => setSelected(null)}>
                    <FaTimes />
                  </button>
                </div>

                {/* Scrollable body */}
                <div className="apl-detail__body">

                  {actionError && (
                    <div className="apl-empty" style={{ background: "#fff5f5", color: "#b91c1c", padding: "14px" }}>
                      <p style={{ margin: 0 }}>{actionError}</p>
                    </div>
                  )}

                  {/* Course block */}
                  <div className="apl-detail__course-block" style={{"--dc":dc}}>
                    <div className="apl-detail__course-icon" style={{background:`${dc}18`,color:dc}}>
                      <FaGraduationCap />
                    </div>
                    <div>
                      <div className="apl-detail__course-name">{selected.courseTitle || "—"}</div>
                      <div className="apl-detail__course-meta">
                        {selected.department || "—"} · {selected.courseLevel || "—"} · <strong>{selected.courseCode || "—"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Personal details */}
                  <div className="apl-detail__section-label">Personal Details</div>
                  <div className="apl-detail__grid">
                    {[
                      {icon:<FaUser />,         label:"Full Name",    value:selected.fullName    },
                      {icon:<FaUser />,         label:"Gender",       value:selected.gender      },
                      {icon:<FaEnvelope />,     label:"Email",        value:selected.email       },
                      {icon:<FaCalendarAlt />,  label:"Date of Birth",value:selected.dob         },
                      {icon:<FaIdCard />,       label:"Nationality",  value:selected.nationality },
                      {icon:<FaIdCard />,       label:"ID / Cert No.",value:selected.idNumber    },
                    ].map((f,i) => (
                      <div key={i} className="apl-detail__field">
                        <span className="apl-detail__field-icon" style={{color:dc,background:`${dc}12`}}>{f.icon}</span>
                        <div>
                          <span className="apl-detail__field-label">{f.label}</span>
                          <span className="apl-detail__field-value">{f.value || "—"}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Academic details */}
                  <div className="apl-detail__section-label">Academic Information</div>
                  <div className="apl-detail__grid">
                    {[
                      {label:"School",        value:selected.school     },
                      {label:"KCSE Index",    value:selected.kcseIndex || "—" },
                      {label:"KCSE Year",     value:selected.kcseYear || "—"  },
                      {label:"Mean Grade",    value:selected.grade      },
                      {label:"Previous Cert", value:selected.prevCert || "—"  },
                      {label:"Special Needs", value:selected.specialNeeds || "None" },
                    ].map((f,i) => (
                      <div key={i} className="apl-detail__field apl-detail__field--plain">
                        <span className="apl-detail__field-label">{f.label}</span>
                        <span className="apl-detail__field-value">{f.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Contact */}
                  <div className="apl-detail__section-label">Contact Details</div>
                  <div className="apl-detail__grid">
                    {[
                      {icon:<FaPhone />,        label:"Student Phone",  value:selected.studentPhone  },
                      {icon:<FaPhone />,        label:"Guardian Phone", value:selected.guardianPhone },
                      {icon:<FaMapMarkerAlt />, label:"Address",        value:selected.address || "—"},
                    ].map((f,i) => (
                      <div key={i} className="apl-detail__field">
                        <span className="apl-detail__field-icon" style={{color:dc,background:`${dc}12`}}>{f.icon}</span>
                        <div>
                          <span className="apl-detail__field-label">{f.label}</span>
                          <span className="apl-detail__field-value">{f.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Documents submitted */}
                  <div className="apl-detail__section-label">Documents Submitted</div>
                  <div className="apl-detail__docs">
                    {docsLoading && <p style={{ fontSize: "0.8rem", color: "#9ca3af", margin: 0 }}>Loading documents…</p>}
                    {!docsLoading && (!selected.documents || selected.documents.length === 0) && (
                      <p style={{ fontSize: "0.8rem", color: "#9ca3af", margin: 0 }}>No documents on file.</p>
                    )}
                    {!docsLoading && selected.documents?.map((d) => (
                      <div key={d.id} className="apl-detail__doc">
                        <FaFileAlt style={{color:dc}}/>
                        <span>{d.docType}</span>
                        <a
                          className="apl-detail__doc-dl"
                          href={`/api/applications.php?download=${d.id}`}
                          title={`Download ${d.fileName}`}
                        >
                          <FaDownload />
                        </a>
                      </div>
                    ))}
                  </div>

                  {/* Update status */}
                  <div className="apl-detail__section-label">Update Status</div>
                  <div className="apl-detail__actions">
                    {[
                      {s:"reviewed", label:"Mark Reviewed", cls:"apl-act--review", icon:<FaEye />          },
                      {s:"accepted", label:"Accept",        cls:"apl-act--accept", icon:<FaCheck />        },
                      {s:"rejected", label:"Reject",        cls:"apl-act--reject", icon:<FaTimesCircle />  },
                    ].map(btn => (
                      <button
                        key={btn.s}
                        className={`apl-act-btn ${btn.cls}`}
                        disabled={selected.status === btn.s}
                        onClick={() => setStatus(selected.id, btn.s)}
                      >
                        {btn.icon} {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Danger + export */}
                  <div className="apl-detail__footer-btns">
                    <button className="apl-footer-btn apl-footer-btn--del" onClick={() => deleteApp(selected.id)}>
                      <FaTrash /> Delete
                    </button>
                    <button
                      className="apl-footer-btn apl-footer-btn--export"
                      disabled
                      title="PDF export isn't wired up yet — this panel has no backend to generate one from."
                    >
                      <FaDownload /> Export PDF
                    </button>
                  </div>

                </div>
              </>
            );
          })()}
        </div>

      </div>
      )}
    </div>
  );
}
