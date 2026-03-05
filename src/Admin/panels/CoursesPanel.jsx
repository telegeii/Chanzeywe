import React, { useState } from "react";
import "../AdminDashboard.css";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from "react-icons/fa";

const INIT_COURSES = [
  { id:1, code:"DICT",  title:"ICT Technician Level 6",                          department:"Computing & Informatics",      level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"KCSE C- or Passed Craft Certificate" },
  { id:2, code:"CICT",  title:"ICT Technician Level 5",                          department:"Computing & Informatics",      level:"Level 5", duration:"6 Terms", examBody:"CDACC", requirement:"KCSE D (Plain)" },
  { id:3, code:"CP",    title:"Computer Packages",                               department:"Computing & Informatics",      level:"Level 4", duration:"6 Weeks", examBody:"CTVC",  requirement:"KCPE / KCSE" },
  { id:4, code:"DBC",   title:"Building Technician Level 6",                     department:"Building & Civil Engineering", level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass in Level 5" },
  { id:5, code:"DCE",   title:"Civil Engineering Technician Level 6",            department:"Building & Civil Engineering", level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass in Level 5" },
  { id:6, code:"CBT",   title:"Building Technician Level 5",                     department:"Building & Civil Engineering", level:"Level 5", duration:"6 Terms", examBody:"CDACC", requirement:"Grade D" },
  { id:7, code:"DEEP",  title:"Electrical Engineering (Power Option) Level 6",   department:"Electrical Engineering",       level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass in Level 5" },
  { id:8, code:"CEEP",  title:"Electrical Engineering (Power Option) Level 5",   department:"Electrical Engineering",       level:"Level 5", duration:"6 Terms", examBody:"CDACC", requirement:"D- or Pass in Level 4" },
  { id:9, code:"DSWCD", title:"Social Work Level 6",                             department:"Liberal Studies",              level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass Level 5" },
  { id:10,code:"DSCM",  title:"Supply Chain Management Level 6",                 department:"Liberal Studies",              level:"Level 6", duration:"9 Terms", examBody:"CDACC", requirement:"C- or Pass Level 5" },
];

const DEPTS = ["Computing & Informatics","Building & Civil Engineering","Electrical Engineering","Liberal Studies","Hospitality & Tourism","Agriculture"];
const LEVELS = ["Level 4","Level 5","Level 6"];
const BLANK = { code:"", title:"", department:"", level:"Level 5", duration:"", examBody:"CDACC", requirement:"" };

export default function CoursesPanel() {
  const [courses, setCourses] = useState(INIT_COURSES);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(BLANK);
  const [filter,  setFilter]  = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const open = (course = null) => {
    setEditing(course);
    setForm(course ? { ...course } : { ...BLANK });
    setModal(true);
  };

  const close = () => { setModal(false); setEditing(null); };

  const save = () => {
    if (!form.code || !form.title || !form.department) return;
    if (editing) {
      setCourses(cs => cs.map(c => c.id === editing.id ? { ...form, id: editing.id } : c));
    } else {
      setCourses(cs => [...cs, { ...form, id: Date.now() }]);
    }
    close();
  };

  const del = (id) => setCourses(cs => cs.filter(c => c.id !== id));

  const filtered = courses.filter(c =>
    (!deptFilter || c.department === deptFilter) &&
    (!filter || c.title.toLowerCase().includes(filter.toLowerCase()) || c.code.toLowerCase().includes(filter.toLowerCase()))
  );

  const levelColor = (lv) => lv === "Level 6" ? "adm-pill--blue" : lv === "Level 5" ? "adm-pill--green" : "adm-pill--amber";

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Courses</h1>
          <p className="adm-page-header__sub">Manage all courses across departments. {courses.length} courses total.</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => open()}>
          <FaPlus style={{ fontSize: "0.75rem" }} /> Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="adm-card" style={{ marginBottom: 20 }}>
        <div className="adm-card__body" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <input
            className="adm-field input"
            style={{ flex:1, minWidth:180, padding:"9px 13px", border:"1.5px solid var(--adm-border)", borderRadius:8, fontFamily:"var(--adm-font)", fontSize:"0.85rem", background:"var(--adm-bg)", outline:"none" }}
            placeholder="Search by title or code…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <select
            style={{ padding:"9px 13px", border:"1.5px solid var(--adm-border)", borderRadius:8, fontFamily:"var(--adm-font)", fontSize:"0.85rem", background:"var(--adm-bg)", outline:"none", minWidth:200 }}
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="adm-card">
        <div className="adm-card__header">
          <span className="adm-card__title">All Courses ({filtered.length})</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Department</th>
                <th>Level</th>
                <th>Duration</th>
                <th>Exam Body</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="adm-empty">No courses found.</td></tr>
              )}
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><code style={{ fontWeight:700, color:"var(--adm-blue)", fontSize:"0.8rem" }}>{c.code}</code></td>
                  <td style={{ fontWeight:500 }}>{c.title}</td>
                  <td style={{ color:"var(--adm-muted)", fontSize:"0.82rem" }}>{c.department}</td>
                  <td><span className={`adm-pill ${levelColor(c.level)}`}>{c.level}</span></td>
                  <td style={{ color:"var(--adm-muted)", fontSize:"0.82rem" }}>{c.duration}</td>
                  <td style={{ color:"var(--adm-muted)", fontSize:"0.82rem" }}>{c.examBody}</td>
                  <td>
                    <div className="adm-actions">
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(c)}><FaEdit /></button>
                      <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(c.id)}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{editing ? "Edit Course" : "Add New Course"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>
            <div className="adm-modal__body">
              <div className="adm-form-grid" style={{ gap:14 }}>
                {[
                  { key:"code",        label:"Course Code",   ph:"e.g. DICT"  },
                  { key:"examBody",    label:"Exam Body",     ph:"e.g. CDACC" },
                ].map(f => (
                  <div key={f.key} className="adm-field">
                    <label>{f.label}</label>
                    <input value={form[f.key]} placeholder={f.ph} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div className="adm-field" style={{ marginTop:14 }}>
                <label>Course Title</label>
                <input value={form.title} placeholder="Full course name" onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="adm-form-grid" style={{ marginTop:14 }}>
                <div className="adm-field">
                  <label>Department</label>
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}>
                    <option value="">Select department</option>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label>Level</label>
                  <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="adm-form-grid" style={{ marginTop:14 }}>
                <div className="adm-field">
                  <label>Duration</label>
                  <input value={form.duration} placeholder="e.g. 9 Terms" onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
                </div>
                <div className="adm-field">
                  <label>Entry Requirement</label>
                  <input value={form.requirement} placeholder="e.g. KCSE C-" onChange={e => setForm(p => ({ ...p, requirement: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}><FaSave /> Save Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}