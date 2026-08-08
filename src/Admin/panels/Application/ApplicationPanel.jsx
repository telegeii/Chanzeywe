import React, { useState, useEffect } from "react";
import "../../AdminDashboard.css";
import "./ApplicationPanel.css";
import { apiGet, apiPost, apiPut, apiDelete } from "../../../utils/api";
import {
  FaClipboardList, FaUser, FaGraduationCap, FaPhone,
  FaEnvelope, FaSearch, FaEye, FaCheck, FaFilter, FaPlus, FaSave,
  FaTimes, FaChevronDown, FaChevronLeft, FaChevronRight, FaDownload,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaExclamationCircle,
  FaBuilding, FaCalendarAlt, FaIdCard, FaFileAlt, FaWalking,
  FaTrash, FaMapMarkerAlt,
} from "react-icons/fa";

/* ─── Config ─── */
const STATUS_CFG = {
  pending:  { label:"Pending",  icon:<FaHourglassHalf />, cls:"apl-status--pending"  },
  reviewed: { label:"Reviewed", icon:<FaEye />,           cls:"apl-status--reviewed" },
  accepted: { label:"Accepted", icon:<FaCheckCircle />,   cls:"apl-status--accepted" },
  rejected: { label:"Rejected", icon:<FaTimesCircle />,   cls:"apl-status--rejected" },
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

const ALL_STATUSES = ["all","pending","accepted","rejected"];
const PAGE_SIZE = 20;

const formatDate = (ts) => (ts ? ts.slice(0, 10) : "—");
const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 2);

const BLANK_WALKIN = {
  fullName: "", gender: "", email: "", dob: "", idNumber: "",
  kcseIndex: "", school: "", kcseYear: "", grade: "", prevCert: "", specialNeeds: "",
  studentPhone: "", guardianPhone: "", address: "", courseId: "",
};

/* ══ APPLICATIONS PANEL ════════════════════════════════════ */
export default function ApplicationsPanel() {
  const [apps,       setApps]       = useState([]);
  const [courses,    setCourses]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [listError,  setListError]  = useState("");
  const [selected,   setSelected]   = useState(null);
  const [docsLoading,setDocsLoading]= useState(false);
  const [actionError,setActionError]= useState("");
  const [filter,     setFilter]     = useState("all");
  const [search,     setSearch]     = useState("");
  const [deptF,      setDeptF]      = useState("all");
  const [page,       setPage]       = useState(1);

  const [walkInModal,  setWalkInModal]  = useState(false);
  const [walkInForm,   setWalkInForm]   = useState(BLANK_WALKIN);
  const [walkInError,  setWalkInError]  = useState("");
  const [walkInSaving, setWalkInSaving] = useState(false);

  const reloadApps = () => apiGet("/applications.php").then(setApps);

  useEffect(() => {
    Promise.all([apiGet("/applications.php"), apiGet("/courses.php")])
      .then(([appsList, courseList]) => { setApps(appsList); setCourses(courseList); })
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
      setApps(as => as.map(a => a.id === id ? { ...a, ...updated } : a));
      setSelected(s => s?.id === id ? { ...s, ...updated } : s);
      if (updated.emailSent === false) {
        setActionError('Marked as accepted, but the offer letter email could not be sent (SMTP not configured yet). You can still download the offer letter below and send it manually.');
      }
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

  const openWalkIn = () => { setWalkInForm(BLANK_WALKIN); setWalkInError(""); setWalkInModal(true); };
  const closeWalkIn = () => setWalkInModal(false);

  const saveWalkIn = async () => {
    setWalkInError("");
    setWalkInSaving(true);
    try {
      const result = await apiPost("/applications.php?walkIn=1", walkInForm);
      await reloadApps();
      setWalkInModal(false);
      // Jump straight into the detail modal — the offer letter is already
      // generated, so the admin can hand it over / download it immediately.
      setSelected(result);
      setDocsLoading(false);
      if (result.emailSent === false) {
        setActionError(walkInForm.email
          ? 'Application created and accepted, but the offer letter email could not be sent (SMTP not configured yet). Download it below instead.'
          : 'Application created and accepted. No email was provided, so download the offer letter below to hand to the student.');
      }
    } catch (err) {
      setWalkInError(err.message || "Could not create this application.");
    } finally {
      setWalkInSaving(false);
    }
  };

  const visible = apps.filter(a => {
    const okStatus = filter === "all" || a.status === filter;
    const okDept   = deptF  === "all" || a.department === deptF;
    const okSearch = !search || [a.fullName, a.kcseIndex, a.referenceNumber]
      .join(" ").toLowerCase().includes(search.toLowerCase());
    return okStatus && okDept && okSearch;
  });

  // Derived fresh every render (never mutates state) so deleting/filtering
  // down to fewer pages can't strand the view on a page that no longer exists.
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageApps   = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
          <button className="apl-walkin-btn" onClick={openWalkIn}>
            <FaWalking /> Add Walk-in Application
          </button>
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
        <>
          {/* Filters */}
          <div className="apl-filters">
            <div className="apl-filters__label">
              <FaFilter /> Filter Applications
            </div>

            <div className="apl-toolbar">
              <div className="apl-search">
                <FaSearch className="apl-search__icon" />
                <input
                  type="text"
                  placeholder="Search by name, KCSE index number or reference…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
                {search && (
                  <button className="apl-search__clear" onClick={() => setSearch("")}>
                    <FaTimes />
                  </button>
                )}
              </div>
              <div className="apl-select-wrap">
                <FaBuilding style={{fontSize:"0.72rem",color:"#6b7280",flexShrink:0}} />
                <select value={deptF} onChange={e => { setDeptF(e.target.value); setPage(1); }}>
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
                  onClick={() => { setFilter(s); setPage(1); }}
                >
                  {s === "all" ? "All Applications" : STATUS_CFG[s].label}
                  <span className="apl-tab__count">{counts[s] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── TABLE ── */}
          {loading ? (
            <div className="apl-empty">
              <FaClipboardList style={{fontSize:"2rem",opacity:0.15}}/>
              <p>Loading applications…</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="apl-empty">
              <FaClipboardList style={{fontSize:"2rem",opacity:0.15}}/>
              <p>No applications match your filters.</p>
            </div>
          ) : (
            <div className="adm-card">
              <div className="adm-table-wrap">
                <table className="adm-table apl-table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Course</th>
                      <th>Reference</th>
                      <th>Status</th>
                      <th>Received</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageApps.map((a) => {
                      /* Index into the full (unfiltered) list, not the
                         paginated slice — otherwise the same applicant's
                         avatar colour would shift depending on which page
                         or filter is active. */
                      const i  = apps.findIndex(x => x.id === a.id);
                      const sc = STATUS_CFG[a.status];
                      const dc = DEPT_COLORS[a.department] || "#0a3d8f";
                      return (
                        <tr key={a.id} className="apl-row" onClick={() => openApplication(a)}>
                          <td>
                            <div className="apl-row__applicant">
                              <span className="apl-row__avatar" style={{background: AVATAR_COLORS[i % AVATAR_COLORS.length]}}>
                                {initials(a.fullName)}
                              </span>
                              <div className="apl-row__applicant-text">
                                <span className="apl-row__name">
                                  {a.fullName}
                                  {a.walkIn && <span className="apl-walkin-badge" title="Added by admin as a walk-in">Walk-in</span>}
                                </span>
                                <span className="apl-row__email">{a.email || "No email on file"}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="apl-row__course">
                              <span className="apl-row__course-title">{a.courseTitle || "—"}</span>
                              <span className="apl-row__course-dept" style={{color:dc}}>{a.department || "—"} · {a.courseLevel || "—"}</span>
                            </div>
                          </td>
                          <td className="apl-row__ref">{a.referenceNumber || "—"}</td>
                          <td><span className={`apl-status ${sc.cls}`}>{sc.icon} {sc.label}</span></td>
                          <td className="apl-row__date">{formatDate(a.receivedAt)}</td>
                          <td>
                            <div className="apl-row-actions" onClick={e => e.stopPropagation()}>
                              <button className="apl-row-btn apl-row-btn--view" onClick={() => openApplication(a)} title="View details"><FaEye /></button>
                              <button className="apl-row-btn apl-row-btn--ok" onClick={() => setStatus(a.id,"accepted")} title="Accept" disabled={a.status === "accepted"}><FaCheck /></button>
                              <button className="apl-row-btn apl-row-btn--no" onClick={() => setStatus(a.id,"rejected")} title="Reject" disabled={a.status === "rejected"}><FaTimes /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination — only once there's more than one page's worth */}
              {visible.length > PAGE_SIZE && (
                <div className="apl-pagination">
                  <span className="apl-pagination__info">
                    Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, visible.length)} of {visible.length}
                  </span>
                  <div className="apl-pagination__btns">
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>
                      <FaChevronLeft style={{fontSize:"0.65rem"}}/> Previous
                    </button>
                    <span className="apl-pagination__page">Page {safePage} of {totalPages}</span>
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
                      Next <FaChevronRight style={{fontSize:"0.65rem"}}/>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ══ WALK-IN MODAL ══ */}
      {walkInModal && (
        <div className="adm-modal-overlay" onClick={closeWalkIn}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title"><FaWalking style={{marginRight:8,opacity:0.7}}/> Add Walk-in Application</span>
              <button className="adm-modal__close" onClick={closeWalkIn}><FaTimes /></button>
            </div>

            <div className="adm-modal__body">
              <p className="apl-walkin-note">
                For a student who applied in person with hardcopy documents you've already verified —
                no file uploads needed. This will be created as <strong>Accepted</strong> immediately
                and the admission letter generated right away.
              </p>

              {walkInError && (
                <div className="apl-empty" style={{ color: "#b91c1c", padding: "10px 14px", marginBottom: 12 }}>
                  <FaExclamationCircle /><p style={{ margin: 0 }}>{walkInError}</p>
                </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>Full Name *</label>
                    <input value={walkInForm.fullName} placeholder="e.g. Jane Wanjiru" onChange={e => setWalkInForm(p => ({ ...p, fullName: e.target.value }))} />
                  </div>
                  <div className="adm-field">
                    <label>Gender</label>
                    <select value={walkInForm.gender} onChange={e => setWalkInForm(p => ({ ...p, gender: e.target.value }))}>
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>KCSE Index Number *</label>
                    <input value={walkInForm.kcseIndex} placeholder="e.g. 29513204036/2024" onChange={e => setWalkInForm(p => ({ ...p, kcseIndex: e.target.value }))} />
                  </div>
                  <div className="adm-field">
                    <label>Course *</label>
                    <select value={walkInForm.courseId} onChange={e => setWalkInForm(p => ({ ...p, courseId: e.target.value }))}>
                      <option value="">Select course</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title} ({c.level}){c.department ? ` — ${c.department.name}` : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>Student Phone *</label>
                    <input value={walkInForm.studentPhone} placeholder="+254 7XX XXX XXX" onChange={e => setWalkInForm(p => ({ ...p, studentPhone: e.target.value }))} />
                  </div>
                  <div className="adm-field">
                    <label>Guardian Phone</label>
                    <input value={walkInForm.guardianPhone} placeholder="Optional — defaults to student phone" onChange={e => setWalkInForm(p => ({ ...p, guardianPhone: e.target.value }))} />
                  </div>
                </div>

                <div className="adm-field">
                  <label>Address *</label>
                  <input value={walkInForm.address} placeholder="e.g. P.O. Box 100, Vihiga" onChange={e => setWalkInForm(p => ({ ...p, address: e.target.value }))} />
                </div>

                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>Email <span className="apl-hint">(optional — needed to send the notification email)</span></label>
                    <input value={walkInForm.email} placeholder="student@example.com" onChange={e => setWalkInForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="adm-field">
                    <label>ID / Birth Certificate No.</label>
                    <input value={walkInForm.idNumber} onChange={e => setWalkInForm(p => ({ ...p, idNumber: e.target.value }))} />
                  </div>
                </div>

                <div className="adm-divider" />

                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>Secondary School</label>
                    <input value={walkInForm.school} onChange={e => setWalkInForm(p => ({ ...p, school: e.target.value }))} />
                  </div>
                  <div className="adm-field">
                    <label>KCSE Year</label>
                    <input type="number" value={walkInForm.kcseYear} onChange={e => setWalkInForm(p => ({ ...p, kcseYear: e.target.value }))} />
                  </div>
                </div>

                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>KCSE Mean Grade</label>
                    <select value={walkInForm.grade} onChange={e => setWalkInForm(p => ({ ...p, grade: e.target.value }))}>
                      <option value="">Select grade</option>
                      {["A","A-","B+","B","B-","C+","C","C-","D+","D","D-","E"].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="adm-field">
                    <label>Previous Certificate</label>
                    <input value={walkInForm.prevCert} placeholder="If any" onChange={e => setWalkInForm(p => ({ ...p, prevCert: e.target.value }))} />
                  </div>
                </div>

                <div className="adm-field">
                  <label>Special Needs / Disability</label>
                  <input value={walkInForm.specialNeeds} placeholder="Leave blank if none" onChange={e => setWalkInForm(p => ({ ...p, specialNeeds: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={closeWalkIn}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={saveWalkIn} disabled={walkInSaving}>
                <FaSave /> {walkInSaving ? "Creating…" : "Create & Accept"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DETAIL MODAL ══ */}
      {selected && (() => {
        const sc = STATUS_CFG[selected.status];
        const dc = DEPT_COLORS[selected.department] || "#0a3d8f";
        const idx = apps.findIndex(a => a.id === selected.id);
        const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
        return (
          <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
            <div className="adm-modal adm-modal--lg apl-modal" onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="apl-modal__head">
                <div className="apl-modal__head-bg" style={{background:`${dc}12`}}/>
                <span className="apl-modal__avatar" style={{background:avatarColor}}>{initials(selected.fullName)}</span>
                <div className="apl-modal__title-block">
                  <h3>{selected.fullName}</h3>
                  <div className="apl-detail__id-row">
                    <span className="apl-detail__app-id">{selected.referenceNumber || "—"}</span>
                    <span className={`apl-status ${sc.cls}`}>{sc.icon} {sc.label}</span>
                    {selected.walkIn && <span className="apl-walkin-badge">Walk-in</span>}
                  </div>
                </div>
                <button className="adm-modal__close" onClick={() => setSelected(null)}><FaTimes /></button>
              </div>

              {/* Scrollable body */}
              <div className="adm-modal__body apl-modal__body">

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
                  {selected.walkIn && (
                    <p style={{ fontSize: "0.8rem", color: "#9ca3af", margin: 0 }}>
                      Walk-in application — hardcopy documents verified in person, nothing uploaded.
                    </p>
                  )}
                  {!selected.walkIn && docsLoading && <p style={{ fontSize: "0.8rem", color: "#9ca3af", margin: 0 }}>Loading documents…</p>}
                  {!selected.walkIn && !docsLoading && (!selected.documents || selected.documents.length === 0) && (
                    <p style={{ fontSize: "0.8rem", color: "#9ca3af", margin: 0 }}>No documents on file.</p>
                  )}
                  {!selected.walkIn && !docsLoading && selected.documents?.map((d) => (
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

                {/* Danger + offer letter */}
                <div className="apl-detail__footer-btns">
                  <button className="apl-footer-btn apl-footer-btn--del" onClick={() => deleteApp(selected.id)}>
                    <FaTrash /> Delete
                  </button>
                  {selected.hasOfferLetter ? (
                    <a
                      className="apl-footer-btn apl-footer-btn--export"
                      href={`/api/applications.php?offerLetter=${selected.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <FaDownload /> Download Offer Letter
                    </a>
                  ) : (
                    <button
                      className="apl-footer-btn apl-footer-btn--export"
                      disabled
                      title="Generated automatically once this application is marked Accepted."
                    >
                      <FaDownload /> Offer Letter
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
