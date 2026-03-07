import React, { useState } from "react";
import "../../AdminDashboard.css";
import "./ApplicationPanel.css";
import {
  FaClipboardList, FaUser, FaGraduationCap, FaPhone,
  FaEnvelope, FaSearch, FaFilter, FaEye, FaCheck,
  FaTimes, FaChevronDown, FaDownload, FaClock,
  FaCheckCircle, FaHourglassHalf, FaBan, FaTimesCircle,
  FaBuilding, FaCalendarAlt, FaIdCard, FaFileAlt,
  FaUpload, FaTrash, FaMapMarkerAlt,
} from "react-icons/fa";

/* ─── Seed applications (mirrors client ApplicationForm fields) ─── */
const INIT_APPS = [
  {
    id: "APP-2025-001",
    fullName:      "Jane Achieng Mwangi",
    gender:        "Female",
    email:         "jane.mwangi@gmail.com",
    dob:           "2003-04-12",
    nationality:   "Kenyan",
    idNumber:      "38291047",
    school:        "Vihiga Girls High School",
    kcseIndex:     "10234567890/2022",
    kcseYear:      "2022",
    grade:         "C+",
    prevCert:      "—",
    specialNeeds:  "None",
    studentPhone:  "+254 712 345 678",
    guardianPhone: "+254 723 456 789",
    address:       "P.O. Box 100, Vihiga",
    course:        "ICT Technician",
    department:    "Computing & Informatics",
    level:         "Level 6",
    code:          "DICT-L6",
    received:      "2025-12-14",
    status:        "pending",
    docs:          ["KCSE Result Slip", "National ID"],
  },
  {
    id: "APP-2025-002",
    fullName:      "Brian Otieno Omondi",
    gender:        "Male",
    email:         "brian.omondi@gmail.com",
    dob:           "2002-09-03",
    nationality:   "Kenyan",
    idNumber:      "40123456",
    school:        "Butere Boys High School",
    kcseIndex:     "20345678901/2021",
    kcseYear:      "2021",
    grade:         "C",
    prevCert:      "—",
    specialNeeds:  "None",
    studentPhone:  "+254 723 456 789",
    guardianPhone: "+254 734 567 890",
    address:       "P.O. Box 203, Kakamega",
    course:        "Electrical Engineering (Power)",
    department:    "Electrical Engineering",
    level:         "Level 5",
    code:          "CEEP-L5",
    received:      "2025-12-13",
    status:        "pending",
    docs:          ["KCSE Result Slip", "National ID", "KCSE Certificate"],
  },
  {
    id: "APP-2025-003",
    fullName:      "Grace Nafula Achieng",
    gender:        "Female",
    email:         "grace.achieng@gmail.com",
    dob:           "2001-07-22",
    nationality:   "Kenyan",
    idNumber:      "37890123",
    school:        "Hamisi Secondary School",
    kcseIndex:     "30456789012/2020",
    kcseYear:      "2020",
    grade:         "B-",
    prevCert:      "Certificate in Social Work",
    specialNeeds:  "None",
    studentPhone:  "+254 734 567 890",
    guardianPhone: "+254 745 678 901",
    address:       "P.O. Box 55, Hamisi",
    course:        "Social Work & Community Development",
    department:    "Liberal Studies",
    level:         "Level 6",
    code:          "CSWD-L6",
    received:      "2025-12-12",
    status:        "reviewed",
    docs:          ["KCSE Result Slip", "KCSE Certificate", "National ID"],
  },
  {
    id: "APP-2025-004",
    fullName:      "Moses Kiprotich Sang",
    gender:        "Male",
    email:         "moses.sang@gmail.com",
    dob:           "2000-01-15",
    nationality:   "Kenyan",
    idNumber:      "36123456",
    school:        "Kapsabet Boys High School",
    kcseIndex:     "40567890123/2019",
    kcseYear:      "2019",
    grade:         "C+",
    prevCert:      "—",
    specialNeeds:  "None",
    studentPhone:  "+254 745 678 901",
    guardianPhone: "+254 756 789 012",
    address:       "P.O. Box 78, Eldoret",
    course:        "Food & Beverage Production",
    department:    "Hospitality",
    level:         "Level 5",
    code:          "CFBP-L5",
    received:      "2025-12-10",
    status:        "accepted",
    docs:          ["KCSE Result Slip", "National ID"],
  },
  {
    id: "APP-2025-005",
    fullName:      "Aisha Zawadi Wambui",
    gender:        "Female",
    email:         "aisha.wambui@gmail.com",
    dob:           "2004-11-08",
    nationality:   "Kenyan",
    idNumber:      "Birth Cert: KE2004/023891",
    school:        "Luanda Secondary School",
    kcseIndex:     "50678901234/2023",
    kcseYear:      "2023",
    grade:         "C",
    prevCert:      "—",
    specialNeeds:  "Visual impairment (mild)",
    studentPhone:  "+254 756 789 012",
    guardianPhone: "+254 767 890 123",
    address:       "P.O. Box 12, Luanda",
    course:        "Building Technician",
    department:    "Building & Civil Engineering",
    level:         "Level 6",
    code:          "CBT-L6",
    received:      "2025-12-09",
    status:        "pending",
    docs:          ["KCSE Result Slip", "Birth Certificate"],
  },
  {
    id: "APP-2025-006",
    fullName:      "Kevin Mutua Nzinga",
    gender:        "Male",
    email:         "kevin.mutua@gmail.com",
    dob:           "2001-05-30",
    nationality:   "Kenyan",
    idNumber:      "38456789",
    school:        "Machakos High School",
    kcseIndex:     "60789012345/2020",
    kcseYear:      "2020",
    grade:         "D+",
    prevCert:      "—",
    specialNeeds:  "None",
    studentPhone:  "+254 767 890 123",
    guardianPhone: "+254 778 901 234",
    address:       "P.O. Box 300, Machakos",
    course:        "Agriculture Extension Services",
    department:    "Agriculture",
    level:         "Level 5",
    code:          "CAES-L5",
    received:      "2025-12-07",
    status:        "rejected",
    docs:          ["KCSE Result Slip"],
  },
  {
    id: "APP-2025-007",
    fullName:      "Lydia Chebet Rotich",
    gender:        "Female",
    email:         "lydia.chebet@gmail.com",
    dob:           "2005-03-18",
    nationality:   "Kenyan",
    idNumber:      "Birth Cert: KE2005/017432",
    school:        "Kapkenda Girls Secondary",
    kcseIndex:     "70890123456/2023",
    kcseYear:      "2023",
    grade:         "C-",
    prevCert:      "—",
    specialNeeds:  "None",
    studentPhone:  "+254 778 901 234",
    guardianPhone: "+254 789 012 345",
    address:       "P.O. Box 9, Eldoret",
    course:        "Computer Packages",
    department:    "Computing & Informatics",
    level:         "Level 4",
    code:          "CCP-L4",
    received:      "2025-12-05",
    status:        "accepted",
    docs:          ["KCSE Result Slip", "National ID", "KCSE Certificate"],
  },
  {
    id: "APP-2025-008",
    fullName:      "Samuel Onyango Otieno",
    gender:        "Male",
    email:         "samuel.otieno@gmail.com",
    dob:           "2002-12-01",
    nationality:   "Kenyan",
    idNumber:      "39876543",
    school:        "Kisumu Boys High School",
    kcseIndex:     "80901234567/2021",
    kcseYear:      "2021",
    grade:         "C",
    prevCert:      "—",
    specialNeeds:  "None",
    studentPhone:  "+254 789 012 345",
    guardianPhone: "+254 700 123 456",
    address:       "P.O. Box 800, Kisumu",
    course:        "Plumbing & Pipe Fitting",
    department:    "Building & Civil Engineering",
    level:         "Level 5",
    code:          "CPF-L5",
    received:      "2025-12-03",
    status:        "reviewed",
    docs:          ["KCSE Result Slip", "National ID"],
  },
];

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
  "Building & Civil Engineering": "#d97706",
  "Agriculture":                  "#16a34a",
};

const ALL_STATUSES = ["all","pending","reviewed","accepted","rejected"];

/* ══ APPLICATIONS PANEL ════════════════════════════════════ */
export default function ApplicationsPanel() {
  const [apps,     setApps]     = useState(INIT_APPS);
  const [selected, setSelected] = useState(null);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [deptF,    setDeptF]    = useState("all");

  const counts = {
    all:      apps.length,
    pending:  apps.filter(a => a.status === "pending").length,
    reviewed: apps.filter(a => a.status === "reviewed").length,
    accepted: apps.filter(a => a.status === "accepted").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };

  const depts = ["all", ...Array.from(new Set(apps.map(a => a.department)))];

  const setStatus = (id, st) => {
    setApps(as => as.map(a => a.id === id ? {...a, status: st} : a));
    setSelected(s => s?.id === id ? {...s, status: st} : s);
  };

  const deleteApp = id => {
    setApps(as => as.filter(a => a.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const visible = apps.filter(a => {
    const okStatus = filter === "all" || a.status === filter;
    const okDept   = deptF  === "all" || a.department === deptF;
    const okSearch = !search || [a.id, a.fullName, a.course, a.department, a.email]
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

      {/* ══ MAIN ══ */}
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
            {visible.length === 0 && (
              <div className="apl-empty">
                <FaClipboardList style={{fontSize:"2rem",opacity:0.15}}/>
                <p>No applications match your filters.</p>
              </div>
            )}
            {visible.map((a, i) => {
              const sc  = STATUS_CFG[a.status];
              const dc  = DEPT_COLORS[a.department] || "#0a3d8f";
              const isActive = selected?.id === a.id;
              return (
                <div
                  key={a.id}
                  className={`apl-card${isActive ? " apl-card--active" : ""}`}
                  onClick={() => setSelected(a)}
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
                        <FaGraduationCap style={{fontSize:"0.6rem",opacity:0.55}}/> {a.course}
                      </div>
                      <div className="apl-card__dept" style={{color:dc}}>
                        {a.department} · {a.level}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="apl-card__right">
                      <span className={`apl-status ${sc.cls}`}>
                        {sc.icon} {sc.label}
                      </span>
                      <span className="apl-card__id">{a.id}</span>
                    </div>
                  </div>

                  <div className="apl-card__foot">
                    <span className="apl-card__date">
                      <FaClock style={{fontSize:"0.58rem"}}/> Received {a.received}
                    </span>
                    <div className="apl-card__btns">
                      <button
                        className="apl-card__btn apl-card__btn--view"
                        onClick={e => { e.stopPropagation(); setSelected(a); }}
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
                      <span className="apl-detail__app-id">{selected.id}</span>
                      <span className={`apl-status ${sc.cls}`}>{sc.icon} {sc.label}</span>
                    </div>
                  </div>
                  <button className="apl-detail__close" onClick={() => setSelected(null)}>
                    <FaTimes />
                  </button>
                </div>

                {/* Scrollable body */}
                <div className="apl-detail__body">

                  {/* Course block */}
                  <div className="apl-detail__course-block" style={{"--dc":dc}}>
                    <div className="apl-detail__course-icon" style={{background:`${dc}18`,color:dc}}>
                      <FaGraduationCap />
                    </div>
                    <div>
                      <div className="apl-detail__course-name">{selected.course}</div>
                      <div className="apl-detail__course-meta">
                        {selected.department} · {selected.level} · <strong>{selected.code}</strong>
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
                      {label:"Previous Cert", value:selected.prevCert   },
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
                    {selected.docs.map((d,i) => (
                      <div key={i} className="apl-detail__doc">
                        <FaFileAlt style={{color:dc}}/>
                        <span>{d}</span>
                        <button className="apl-detail__doc-dl" title="Download">
                          <FaDownload />
                        </button>
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
                    <button className="apl-footer-btn apl-footer-btn--export">
                      <FaDownload /> Export PDF
                    </button>
                  </div>

                </div>
              </>
            );
          })()}
        </div>

      </div>
    </div>
  );
}