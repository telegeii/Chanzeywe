import React, { useState } from "react";
import "../../AdminDashboard.css";
import "./CoursePanel.css";
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave,
  FaSearch, FaBuilding, FaBolt, FaUtensils,
  FaLaptop, FaSeedling, FaUsers, FaBook,
  FaThLarge, FaList, FaGraduationCap, FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

/* ── Department config (mirrors client deptIcons) ── */
const DEPT_CONFIG = {
  "Building & Civil Engineering": { icon: <FaBuilding />, color: "cop-dept--amber"  },
  "Electrical Engineering":       { icon: <FaBolt />,     color: "cop-dept--yellow" },
  "Hospitality":                  { icon: <FaUtensils />, color: "cop-dept--pink"   },
  "Computing & Informatics":      { icon: <FaLaptop />,   color: "cop-dept--blue"   },
  "Agriculture":                  { icon: <FaSeedling />, color: "cop-dept--green"  },
  "Liberal Studies":              { icon: <FaUsers />,    color: "cop-dept--purple" },
};

const DEPTS  = Object.keys(DEPT_CONFIG);
const LEVELS = ["Level 4", "Level 5", "Level 6"];
const EXAM_BODIES = ["CDACC", "CTVC", "KNEC", "Other"];

/* ── Level badge colour ── */
const levelBadge = lv =>
  lv === "Level 6" ? "cop-badge--diploma"
  : lv === "Level 5" ? "cop-badge--cert"
  : "cop-badge--artisan";

const levelLabel = lv =>
  lv === "Level 6" ? "Diploma" : lv === "Level 5" ? "Certificate" : "Artisan";

/* ── Seed data (full data from client) ── */
const INIT = [
  /* Building & Civil Engineering */
  { id:1,  code:"DBC",   title:"Building Technician Level 9 (Diploma)",            department:"Building & Civil Engineering", level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C – or Pass in Level 5" },
  { id:2,  code:"DCE",   title:"Civil Engineering Technician Level 6 (Diploma)",   department:"Building & Civil Engineering", level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C – or Pass in Level 5" },
  { id:3,  code:"CBT",   title:"Building Technician Level 5 (Certificate)",         department:"Building & Civil Engineering", level:"Level 5", duration:"6 Terms", examBody:"CDACC", requirement:"Grade D" },
  { id:4,  code:"CP",    title:"Plumbing Level 5",                                  department:"Building & Civil Engineering", level:"Level 5", duration:"6 Terms", examBody:"CDACC", requirement:"Grade D" },
  { id:5,  code:"AM",    title:"Masonry Level 4",                                   department:"Building & Civil Engineering", level:"Level 4", duration:"3 Terms", examBody:"CDACC", requirement:"KCSE Mean Grade D –" },
  { id:6,  code:"AP",    title:"Plumbing Level 4",                                  department:"Building & Civil Engineering", level:"Level 4", duration:"3 Terms", examBody:"CDACC", requirement:"KCSE Mean Grade D –" },
  /* Electrical Engineering */
  { id:7,  code:"DEEP",  title:"Electrical Engineering (Power Option) Level 6",     department:"Electrical Engineering",       level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass in Level 5" },
  { id:8,  code:"CEEP",  title:"Electrical Engineering (Power Option) Level 5",     department:"Electrical Engineering",       level:"Level 5", duration:"6 Terms", examBody:"CDACC", requirement:"D- or Pass in Level 4" },
  { id:9,  code:"AIE",   title:"Electrical Installation",                            department:"Electrical Engineering",       level:"Level 4", duration:"3 Terms", examBody:"CDACC", requirement:"Grade D – and E" },
  /* Hospitality */
  { id:10, code:"DFB",   title:"Food and Beverage Level 6",                          department:"Hospitality",                  level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass in Level 5" },
  { id:11, code:"CFB",   title:"Food and Beverage Level 5",                          department:"Hospitality",                  level:"Level 5", duration:"6 Terms", examBody:"CDACC", requirement:"D or Pass in Level 4" },
  { id:12, code:"AFB",   title:"Food and Beverage Level 4",                          department:"Hospitality",                  level:"Level 4", duration:"3 Terms", examBody:"CDACC", requirement:"D- and E" },
  { id:13, code:"FD",    title:"Fashion and Design Level 4",                         department:"Hospitality",                  level:"Level 4", duration:"3 Terms", examBody:"CDACC", requirement:"D- and E" },
  { id:14, code:"AHD",   title:"Hairdressing and Beauty Therapy Level 4",            department:"Hospitality",                  level:"Level 4", duration:"3 Terms", examBody:"CDACC", requirement:"D- and E" },
  /* Computing */
  { id:15, code:"DICT",  title:"ICT Technician Level 6",                             department:"Computing & Informatics",      level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass Level 6" },
  { id:16, code:"CICT",  title:"ICT Technician Level 5",                             department:"Computing & Informatics",      level:"Level 5", duration:"6 Terms", examBody:"CDACC", requirement:"D plain" },
  { id:17, code:"CPK",   title:"Computer Packages",                                  department:"Computing & Informatics",      level:"Level 4", duration:"6 Weeks", examBody:"CTVC",  requirement:"KCPE and KCSE" },
  /* Agriculture */
  { id:18, code:"DGA",   title:"Agriculture Extension Level 6",                      department:"Agriculture",                  level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass level 5" },
  { id:19, code:"CGA",   title:"Agriculture Extension Level 5",                      department:"Agriculture",                  level:"Level 5", duration:"6 Terms", examBody:"CDACC", requirement:"D or Pass Level 5" },
  { id:20, code:"AGA",   title:"Agriculture Extension Level 4",                      department:"Agriculture",                  level:"Level 4", duration:"3 Terms", examBody:"CDACC", requirement:"D- and E" },
  /* Liberal Studies */
  { id:21, code:"DSWCD", title:"Social Work Level 6",                                department:"Liberal Studies",              level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass Level 5" },
  { id:22, code:"CSWCD", title:"Social Work Level 5",                                department:"Liberal Studies",              level:"Level 5", duration:"6 Terms", examBody:"CDACC", requirement:"D (plain)" },
  { id:23, code:"DSCM",  title:"Supply Chain Management Level 6",                    department:"Liberal Studies",              level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass Level 5" },
  { id:24, code:"CSCM",  title:"Supply Chain Management Level 5",                    department:"Liberal Studies",              level:"Level 5", duration:"6 Terms", examBody:"CADAA", requirement:"D (plain)" },
];

const BLANK = { code:"", title:"", department:"Building & Civil Engineering", level:"Level 5", duration:"", examBody:"CDACC", requirement:"" };

const ITEMS_PER_PAGE = 2; // departments per page — mirrors client

export default function CoursesPanel() {
  const [courses,    setCourses]    = useState(INIT);
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(BLANK);
  const [search,     setSearch]     = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [levelFilter,setLevelFilter]= useState("");
  const [view,       setView]       = useState("dept"); // "dept" | "table"
  const [page,       setPage]       = useState(1);

  const openModal = (c = null) => { setEditing(c); setForm(c ? { ...c } : { ...BLANK }); setModal(true); };
  const close     = () => { setModal(false); setEditing(null); };

  const save = () => {
    if (!form.code || !form.title || !form.department) return;
    if (editing) setCourses(cs => cs.map(c => c.id === editing.id ? { ...form, id: editing.id } : c));
    else         setCourses(cs => [...cs, { ...form, id: Date.now() }]);
    close();
  };

  const del = id => setCourses(cs => cs.filter(c => c.id !== id));

  /* Filter for flat table view */
  const filtered = courses.filter(c =>
    (!deptFilter  || c.department === deptFilter) &&
    (!levelFilter || c.level === levelFilter) &&
    (!search      || c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()))
  );

  /* Group by dept for department view (mirrors client) */
  const grouped = DEPTS.map(d => ({
    name: d,
    courses: courses.filter(c =>
      c.department === d &&
      (!search      || c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())) &&
      (!levelFilter || c.level === levelFilter)
    ),
  })).filter(g => g.courses.length > 0);

  /* Pagination over dept groups */
  const totalPages  = Math.ceil(grouped.length / ITEMS_PER_PAGE);
  const pagedGroups = grouped.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  /* Stats */
  const l6 = courses.filter(c => c.level === "Level 6").length;
  const l5 = courses.filter(c => c.level === "Level 5").length;
  const l4 = courses.filter(c => c.level === "Level 4").length;

  return (
    <div className="cop-root">

      {/* ── Header ── */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Courses</h1>
          <p className="adm-page-header__sub">
            {courses.length} courses across {DEPTS.length} departments
          </p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => openModal()}>
          <FaPlus style={{ fontSize:"0.72rem" }} /> Add Course
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="cop-stats">
        <div className="cop-stat cop-stat--total">
          <div className="cop-stat__icon"><FaGraduationCap /></div>
          <div><span className="cop-stat__num">{courses.length}</span><span className="cop-stat__label">Total Courses</span></div>
        </div>
        <div className="cop-stat cop-stat--diploma">
          <div className="cop-stat__icon"><FaBook /></div>
          <div><span className="cop-stat__num">{l6}</span><span className="cop-stat__label">Diploma (L6)</span></div>
        </div>
        <div className="cop-stat cop-stat--cert">
          <div className="cop-stat__icon"><FaBook /></div>
          <div><span className="cop-stat__num">{l5}</span><span className="cop-stat__label">Certificate (L5)</span></div>
        </div>
        <div className="cop-stat cop-stat--artisan">
          <div className="cop-stat__icon"><FaBook /></div>
          <div><span className="cop-stat__num">{l4}</span><span className="cop-stat__label">Artisan (L4)</span></div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="cop-toolbar">
        <div className="cop-search">
          <FaSearch className="cop-search__icon" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search courses or code…" />
        </div>
        <div className="cop-filters">
          <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }}>
            <option value="">All Departments</option>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setPage(1); }}>
            <option value="">All Levels</option>
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="cop-view-toggle">
          <button className={`cop-view-btn${view === "dept" ? " cop-view-btn--active" : ""}`} onClick={() => setView("dept")} title="Department view"><FaThLarge /></button>
          <button className={`cop-view-btn${view === "table" ? " cop-view-btn--active" : ""}`} onClick={() => setView("table")} title="Table view"><FaList /></button>
        </div>
      </div>

      {/* ══ DEPARTMENT VIEW (mirrors client layout) ══ */}
      {view === "dept" && (
        <>
          {pagedGroups.length === 0 ? (
            <div className="cop-empty"><FaGraduationCap /><p>No courses match your filters.</p></div>
          ) : (
            pagedGroups.map(g => {
              const cfg = DEPT_CONFIG[g.name] || { icon: <FaBuilding />, color: "cop-dept--blue" };
              return (
                <div key={g.name} className={`cop-dept-card ${cfg.color}`}>
                  {/* Dept header — mirrors client dept-header */}
                  <div className="cop-dept-header">
                    <div className="cop-dept-header__icon">{cfg.icon}</div>
                    <div className="cop-dept-header__info">
                      <h2 className="cop-dept-header__name">{g.name.toUpperCase()}</h2>
                      <span className="cop-dept-header__count">{g.courses.length} course{g.courses.length !== 1 ? "s" : ""}</span>
                    </div>
                    <button className="adm-btn adm-btn--ghost adm-btn--sm cop-dept-add" onClick={() => openModal()}>
                      <FaPlus style={{ fontSize:"0.65rem" }} /> Add
                    </button>
                  </div>

                  {/* Course table — mirrors client courses-table */}
                  <div className="cop-table-wrap">
                    <table className="cop-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Course Title</th>
                          <th>Min. Requirement</th>
                          <th>Duration</th>
                          <th>Exam Body</th>
                          <th>Level</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.courses.map(c => (
                          <tr key={c.id}>
                            <td><code className="cop-code">{c.code}</code></td>
                            <td className="cop-row__title">{c.title}</td>
                            <td className="cop-row__req">{c.requirement}</td>
                            <td className="cop-row__dur">{c.duration}</td>
                            <td className="cop-row__exam">{c.examBody}</td>
                            <td>
                              <span className={`cop-badge ${levelBadge(c.level)}`}>
                                {levelLabel(c.level)} · {c.level}
                              </span>
                            </td>
                            <td>
                              <div className="adm-actions">
                                <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openModal(c)} title="Edit"><FaEdit /></button>
                                <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(c.id)} title="Delete"><FaTrash /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}

          {/* ── Pagination (mirrors client) ── */}
          {totalPages > 1 && (
            <div className="cop-pagination">
              <button
                className="cop-page-btn"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                <FaChevronLeft style={{ fontSize:"0.7rem" }} /> Previous
              </button>
              <div className="cop-page-dots">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`cop-page-dot${page === i + 1 ? " cop-page-dot--active" : ""}`}
                    onClick={() => setPage(i + 1)}
                  >{i + 1}</button>
                ))}
              </div>
              <button
                className="cop-page-btn"
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next <FaChevronRight style={{ fontSize:"0.7rem" }} />
              </button>
            </div>
          )}
        </>
      )}

      {/* ══ FLAT TABLE VIEW ══ */}
      {view === "table" && (
        <div className="adm-card cop-flat-card">
          <div className="adm-card__header">
            <span className="adm-card__title">All Courses ({filtered.length})</span>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table cop-flat-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Level</th>
                  <th>Duration</th>
                  <th>Exam Body</th>
                  <th>Requirement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="adm-empty">No courses found.</td></tr>
                )}
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td><code className="cop-code">{c.code}</code></td>
                    <td className="cop-row__title">{c.title}</td>
                    <td>
                      <div className="cop-dept-cell">
                        <span className={`cop-dept-dot ${DEPT_CONFIG[c.department]?.color || ""}`} />
                        <span style={{ fontSize:"0.8rem", color:"var(--adm-muted)" }}>{c.department}</span>
                      </div>
                    </td>
                    <td><span className={`cop-badge ${levelBadge(c.level)}`}>{levelLabel(c.level)} · {c.level}</span></td>
                    <td style={{ color:"var(--adm-muted)", fontSize:"0.8rem" }}>{c.duration}</td>
                    <td style={{ color:"var(--adm-muted)", fontSize:"0.8rem" }}>{c.examBody}</td>
                    <td style={{ color:"var(--adm-muted)", fontSize:"0.78rem", maxWidth:180 }}>{c.requirement}</td>
                    <td>
                      <div className="adm-actions">
                        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openModal(c)}><FaEdit /></button>
                        <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(c.id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ MODAL ══ */}
      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{editing ? "Edit Course" : "Add New Course"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>

            <div className="adm-modal__body">

              {/* Department picker — visual tiles */}
              <div className="cop-dept-picker">
                <label className="cop-dept-picker__label">Department</label>
                <div className="cop-dept-picker__grid">
                  {DEPTS.map(d => {
                    const cfg = DEPT_CONFIG[d];
                    return (
                      <button
                        key={d}
                        type="button"
                        className={`cop-dept-tile ${cfg.color}${form.department === d ? " cop-dept-tile--active" : ""}`}
                        onClick={() => setForm(p => ({ ...p, department: d }))}
                      >
                        <span className="cop-dept-tile__icon">{cfg.icon}</span>
                        <span className="cop-dept-tile__name">{d}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Level picker */}
              <div className="cop-level-picker">
                <label className="cop-level-picker__label">CDACC Level</label>
                <div className="cop-level-picker__row">
                  {LEVELS.map(l => (
                    <button
                      key={l}
                      type="button"
                      className={`cop-level-btn cop-level-btn--${l.replace(" ","")}${form.level === l ? " cop-level-btn--active" : ""}`}
                      onClick={() => setForm(p => ({ ...p, level: l }))}
                    >
                      <span>{levelLabel(l)}</span>
                      <span className="cop-level-btn__sub">{l}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:14, marginTop:18 }}>
                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>Course Code</label>
                    <input value={form.code} placeholder="e.g. DICT" onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
                  </div>
                  <div className="adm-field">
                    <label>Exam Body</label>
                    <select value={form.examBody} onChange={e => setForm(p => ({ ...p, examBody: e.target.value }))}>
                      {EXAM_BODIES.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div className="adm-field">
                  <label>Course Title</label>
                  <input value={form.title} placeholder="e.g. ICT Technician Level 6" onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                </div>

                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>Duration</label>
                    <input value={form.duration} placeholder="e.g. 9 Terms" onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
                  </div>
                  <div className="adm-field">
                    <label>Min. Entry Requirement</label>
                    <input value={form.requirement} placeholder="e.g. KCSE C-" onChange={e => setForm(p => ({ ...p, requirement: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}>
                <FaSave /> {editing ? "Save Changes" : "Add Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}