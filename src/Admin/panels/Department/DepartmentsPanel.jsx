import React, { useState, useEffect } from "react";
import "../../AdminDashboard.css";
import "./DepartmentPanel.css";
import {
  FaEdit, FaTimes, FaSave, FaBuilding, FaBolt,
  FaUtensils, FaLaptop, FaSeedling, FaUsers,
  FaUserTie, FaCalendarAlt, FaClock, FaBook,
  FaUserGraduate, FaMoneyBillWave, FaIdCard,
  FaCamera, FaFileAlt, FaCheckCircle, FaPlus,
  FaEye, FaChevronRight, FaExclamationCircle,
} from "react-icons/fa";
import { apiGet, apiPost, apiPut } from "../../../utils/api";

/* ── Icon/colour/intake config by department slug — mirrors client
   deptIcons & cmp-hero colours. DB stores identity/content; this
   fixed visual mapping stays client-side (React icons aren't data). ── */
const DEPT_CONFIG = {
  computing: {
    icon: <FaLaptop />, color: "#0a3d8f", bg: "rgba(10,61,143,0.07)", cls: "dp-dept--blue",
    intakes: [
      { month:"January",   emoji:"🌱", desc:"Start the year strong with fresh opportunities." },
      { month:"May",       emoji:"☀️", desc:"Mid-year intake for flexible learners." },
      { month:"September", emoji:"🎓", desc:"Join after KCSE & KCPE results release." },
    ],
  },
  building: {
    icon: <FaBuilding />, color: "#d97706", bg: "rgba(217,119,6,0.07)", cls: "dp-dept--amber",
    intakes: [
      { month:"January",   emoji:"🌱", desc:"Begin the year with construction skills." },
      { month:"May",       emoji:"☀️", desc:"Mid-year intake open to all applicants." },
      { month:"September", emoji:"🎓", desc:"Join after national exam results." },
    ],
  },
  electrical: {
    icon: <FaBolt />, color: "#ca8a04", bg: "rgba(202,138,4,0.07)", cls: "dp-dept--yellow",
    intakes: [
      { month:"January",   emoji:"🌱", desc:"Kick off with power & installation programmes." },
      { month:"May",       emoji:"☀️", desc:"Mid-year flexible intake." },
      { month:"September", emoji:"🎓", desc:"Post-exam intake for new students." },
    ],
  },
  hospitality: {
    icon: <FaUtensils />, color: "#db2777", bg: "rgba(219,39,119,0.07)", cls: "dp-dept--pink",
    intakes: [
      { month:"January",   emoji:"🌱", desc:"Start your hospitality career in January." },
      { month:"May",       emoji:"☀️", desc:"Mid-year intake for aspiring chefs & stylists." },
      { month:"September", emoji:"🎓", desc:"September post-exam intake." },
    ],
  },
  agriculture: {
    icon: <FaSeedling />, color: "#16a34a", bg: "rgba(22,163,74,0.07)", cls: "dp-dept--green",
    intakes: [
      { month:"January",   emoji:"🌱", desc:"Plant your future in agricultural science." },
      { month:"May",       emoji:"☀️", desc:"Mid-year intake for environmental studies." },
      { month:"September", emoji:"🎓", desc:"Join after results season." },
    ],
  },
  liberal: {
    icon: <FaUsers />, color: "#7c3aed", bg: "rgba(124,58,237,0.07)", cls: "dp-dept--purple",
    intakes: [
      { month:"January",   emoji:"🌱", desc:"Begin your social & management journey." },
      { month:"May",       emoji:"☀️", desc:"Mid-year intake for flexible learners." },
      { month:"September", emoji:"🎓", desc:"September intake for new students." },
    ],
  },
};
const FALLBACK_CFG = { icon:<FaBuilding />, color:"#0a3d8f", bg:"rgba(10,61,143,0.07)", cls:"dp-dept--blue", intakes:[] };
const cfg = (slug) => DEPT_CONFIG[slug] || FALLBACK_CFG;

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* Admission docs — mirrors client admissionDocs */
const ADMISSION_DOCS = [
  { icon: <FaMoneyBillWave />, text: "Registration fee: Kshs. 500 (non-refundable)" },
  { icon: <FaFileAlt />,       text: "Duly filled Admission & Medical Form" },
  { icon: <FaIdCard />,        text: "Copy of ID / Birth Certificate" },
  { icon: <FaBook />,          text: "Academic certificates / result slips" },
  { icon: <FaCamera />,        text: "Two passport size photographs" },
];

/* Programme levels — mirrors client levels array (generic CBET
   framework text, not admin-editable per-department data) */
const PROGRAMME_LEVELS = [
  { label:"Level 6", badge:"Diploma",     color:"#0a3d8f", bg:"rgba(10,61,143,0.07)",  req:"KCSE aggregate C- (Minus) or Passed Craft Certificate or equivalent.", duration:"9 Terms"  },
  { label:"Level 5", badge:"Certificate", color:"#059669", bg:"rgba(5,150,105,0.07)",  req:"KCSE aggregate D (Plain) or equivalent qualification.",                duration:"6 Terms"  },
  { label:"Level 4", badge:"Artisan",     color:"#d97706", bg:"rgba(217,119,6,0.07)",  req:"KCPE Certificate or equivalent qualification.",                       duration:"3 Terms"  },
];

const BLANK_FORM = { name:"", hod:"", heroHeadline:"", tagline:"", active:true };

export default function DepartmentsPanel() {
  const [depts,    setDepts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [listError,setListError]= useState("");

  const [modal,    setModal]    = useState(false);
  const [preview,  setPreview]  = useState(null); // dept being previewed (with nested courses)
  const [previewLoading, setPreviewLoading] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(BLANK_FORM);
  const [saving,   setSaving]   = useState(false);
  const [formError,setFormError]= useState("");
  const [previewTab, setPreviewTab] = useState("admission"); // mirrors client activeTab

  useEffect(() => {
    apiGet("/departments.php")
      .then(setDepts)
      .catch(err => setListError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (d) => { setEditing(d); setForm({ ...d }); setFormError(""); setModal(true); };
  const openAdd  = () => { setEditing(null); setForm({ ...BLANK_FORM }); setFormError(""); setModal(true); };
  const close    = () => { setModal(false); setEditing(null); };

  const openPreview = async (d) => {
    setPreviewTab("admission");
    setPreviewLoading(true);
    try {
      const full = await apiGet(`/departments.php?slug=${d.slug}`);
      setPreview(full);
    } catch (err) {
      setListError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };
  const closePreview = () => setPreview(null);

  const save = async () => {
    if (!form.name || !form.heroHeadline) {
      setFormError("Department name and hero headline are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (editing) {
        const updated = await apiPut("/departments.php", editing.id, form);
        setDepts(ds => ds.map(d => d.id === editing.id ? updated : d));
      } else {
        const created = await apiPost("/departments.php", { ...form, slug: slugify(form.name) });
        setDepts(ds => [...ds, created]);
      }
      close();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (d) => {
    try {
      const updated = await apiPut("/departments.php", d.id, { active: !d.active });
      setDepts(ds => ds.map(x => x.id === d.id ? updated : x));
    } catch (err) {
      setListError(err.message);
    }
  };

  if (loading) {
    return <div className="dp-empty"><FaBuilding /><p>Loading departments…</p></div>;
  }

  return (
    <div className="dp-root">

      {/* ── Header ── */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Departments</h1>
          <p className="adm-page-header__sub">
            {depts.length} departments &nbsp;·&nbsp; {depts.filter(d=>d.active).length} active on public site
          </p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={openAdd}>
          <FaPlus style={{ fontSize:"0.72rem" }} /> Add Department
        </button>
      </div>

      {listError && (
        <div className="dp-list-error">
          <FaExclamationCircle /> {listError}
        </div>
      )}

      {/* ── Dept cards grid ── */}
      <div className="dp-grid">
        {depts.map(d => {
          const c = cfg(d.slug);
          return (
            <div key={d.id} className={`dp-card ${c.cls}${!d.active ? " dp-card--inactive" : ""}`}>

              {/* Colour top bar */}
              <div className="dp-card__bar" style={{ background: c.color }} />

              <div className="dp-card__inner">
                {/* Icon + name */}
                <div className="dp-card__head">
                  <div className="dp-card__icon" style={{ background: c.bg, color: c.color }}>
                    {c.icon}
                  </div>
                  <div className="dp-card__info">
                    <h3 className="dp-card__name">{d.name}</h3>
                    <span className="dp-card__hod">
                      <FaUserTie style={{ fontSize:"0.68rem" }} /> HOD: {d.hod}
                    </span>
                  </div>
                  {!d.active && <span className="dp-inactive-badge">Hidden</span>}
                </div>

                {/* Hero headline */}
                <p className="dp-card__hero">"{d.heroHeadline}"</p>

                {/* Tagline */}
                <p className="dp-card__tagline">{d.tagline}</p>

                {/* Meta row — mirrors client dept page sections */}
                <div className="dp-card__meta">
                  <span className="dp-meta-chip">
                    <FaBook style={{ fontSize:"0.7rem" }} /> {d.coursesCount} Course{d.coursesCount !== 1 ? "s" : ""}
                  </span>
                  <span className="dp-meta-chip">
                    <FaCalendarAlt style={{ fontSize:"0.7rem" }} /> 3 Intakes/yr
                  </span>
                  <span className="dp-meta-chip">
                    <FaCheckCircle style={{ fontSize:"0.7rem" }} /> CDACC
                  </span>
                </div>
              </div>

              {/* Footer actions */}
              <div className="dp-card__footer">
                <button
                  className={`dp-toggle-btn${d.active ? " dp-toggle-btn--active" : ""}`}
                  onClick={() => toggleActive(d)}
                  title={d.active ? "Hide from site" : "Show on site"}
                >
                  <FaEye /> {d.active ? "Visible" : "Hidden"}
                </button>
                <button className="dp-edit-btn" onClick={() => openEdit(d)}>
                  <FaEdit /> Edit
                </button>
                <button className="dp-preview-btn" onClick={() => openPreview(d)}>
                  <FaEye /> Preview
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════
          DEPT PREVIEW — mirrors Computing.jsx
          ════════════════════════════════════ */}
      {previewLoading && (
        <div className="dp-preview-overlay">
          <div className="dp-preview-loading">Loading preview…</div>
        </div>
      )}
      {preview && (() => {
        const c = cfg(preview.slug);
        return (
          <div className="dp-preview-overlay" onClick={closePreview}>
            <div className="dp-preview-modal" onClick={e => e.stopPropagation()}>

              {/* Preview topbar */}
              <div className="dp-preview-bar">
                <span className="dp-preview-bar__label">
                  <FaEye /> Preview — {preview.name} Department Page
                </span>
                <button className="dp-preview-bar__close" onClick={closePreview}><FaTimes /></button>
              </div>

              <div className="dp-preview-body">

                {/* ── Hero (mirrors cmp-hero) ── */}
                <div className="dp-ph-hero" style={{ borderBottom: `4px solid ${c.color}` }}>
                  <div className="dp-ph-hero__overlay" style={{ background: c.color }} />
                  <div className="dp-ph-hero__content">
                    <span className="dp-ph-hero__eyebrow" style={{ color: c.color, background: c.bg }}>
                      {c.icon} {preview.name}
                    </span>
                    <h1 className="dp-ph-hero__title">{preview.heroHeadline}</h1>
                    <p className="dp-ph-hero__sub">{preview.tagline}</p>
                    <div className="dp-ph-hero__bc">
                      <span>Home</span><FaChevronRight className="dp-ph-bc__arrow" />
                      <span>Departments</span><FaChevronRight className="dp-ph-bc__arrow" />
                      <span style={{ color: "#fff" }}>{preview.name}</span>
                    </div>
                  </div>
                </div>

                {/* ── Dept info (mirrors cmp-dept) ── */}
                <div className="dp-ph-dept">
                  <div className="dp-ph-dept__logo" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
                  <div>
                    <span className="dp-ph-eyebrow" style={{ color: c.color }}>Our Department</span>
                    <h2 className="dp-ph-dept__name">{preview.name} Department</h2>
                    <p className="dp-ph-dept__hod">Head of Department: <strong>{preview.hod}</strong></p>
                    <p className="dp-ph-dept__tagline">Chanzeywe Vocational Training College — Skills to Transform Livelihoods</p>
                  </div>
                </div>

                {/* ── Intakes (mirrors cmp-intakes) ── */}
                <div className="dp-ph-section">
                  <span className="dp-ph-eyebrow" style={{ color: c.color }}>When to Join</span>
                  <h2 className="dp-ph-section__title">Available Intakes</h2>
                  <div className="dp-ph-intakes">
                    {c.intakes.map((it, i) => (
                      <div key={i} className="dp-ph-intake" style={{ borderTop: `3px solid ${c.color}` }}>
                        <span className="dp-ph-intake__emoji">{it.emoji}</span>
                        <FaCalendarAlt style={{ color: c.color, fontSize:"0.9rem" }} />
                        <strong>{it.month} Intake</strong>
                        <p>{it.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Tabs (mirrors cmp-tabs) ── */}
                <div className="dp-ph-tabs">
                  {["admission","courses"].map(t => (
                    <button
                      key={t}
                      className={`dp-ph-tab${previewTab === t ? " dp-ph-tab--active" : ""}`}
                      style={previewTab === t ? { borderColor: c.color, color: c.color } : {}}
                      onClick={() => setPreviewTab(t)}
                    >
                      {t === "admission" ? <><FaUserGraduate /> Admission Requirements</> : <><FaBook /> Courses Offered</>}
                    </button>
                  ))}
                </div>

                {/* ── Admission tab (mirrors cmp-admission + cmp-levels) ── */}
                {previewTab === "admission" && (
                  <>
                    <div className="dp-ph-section">
                      <span className="dp-ph-eyebrow" style={{ color: c.color }}>How to Join</span>
                      <h2 className="dp-ph-section__title">General Admission Requirements</h2>
                      <p className="dp-ph-section__sub">Please bring the following documents when reporting for registration.</p>
                      <div className="dp-ph-docs">
                        {ADMISSION_DOCS.map((doc, i) => (
                          <div key={i} className="dp-ph-doc" style={{ borderLeft: `3px solid ${c.color}` }}>
                            <span className="dp-ph-doc__icon" style={{ color: c.color, background: c.bg }}>{doc.icon}</span>
                            <span>{doc.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="dp-ph-section">
                      <span className="dp-ph-eyebrow" style={{ color: c.color }}>Entry Requirements</span>
                      <h2 className="dp-ph-section__title">Programme Levels</h2>
                      <div className="dp-ph-levels">
                        {PROGRAMME_LEVELS.map((lv, i) => (
                          <div key={i} className="dp-ph-level" style={{ borderTop: `3px solid ${lv.color}` }}>
                            <div className="dp-ph-level__top">
                              <span className="dp-ph-level__badge" style={{ color: lv.color, background: lv.bg }}>{lv.badge}</span>
                              <strong style={{ color: lv.color }}>{lv.label}</strong>
                            </div>
                            <p>{lv.req}</p>
                            <span className="dp-ph-level__dur"><FaClock style={{ fontSize:"0.65rem" }} /> {lv.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* ── Courses tab — real live data from the Courses panel ── */}
                {previewTab === "courses" && (
                  <div className="dp-ph-section">
                    <span className="dp-ph-eyebrow" style={{ color: c.color }}>What We Offer</span>
                    <h2 className="dp-ph-section__title">Courses Offered</h2>
                    <p className="dp-ph-section__sub">
                      CDACC-accredited programmes — {preview.courses.length} course{preview.courses.length !== 1 ? "s" : ""} in this department.
                    </p>
                    {preview.courses.length === 0 ? (
                      <div className="dp-ph-course-placeholder">
                        <FaBook style={{ fontSize:"2rem", color: c.color, opacity:0.3 }} />
                        <p>No courses yet for this department.</p>
                        <span>Add one from the Courses panel.</span>
                      </div>
                    ) : (
                      <div className="dp-ph-course-list">
                        {preview.courses.map(course => (
                          <div key={course.id} className="dp-ph-course" style={{ borderLeft: `3px solid ${c.color}` }}>
                            <div>
                              <strong>{course.title}</strong>
                              <span className="dp-ph-course__meta">{course.code} · {course.level} · {course.duration}</span>
                            </div>
                            <span className="dp-ph-course__badge" style={{ color: c.color, background: c.bg }}>{course.examBody}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ EDIT MODAL ══ */}
      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{editing ? `Edit Department — ${editing.name}` : "Add New Department"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>

            <div className="adm-modal__body">

              {formError && (
                <div className="dp-list-error" style={{ marginBottom: 16 }}>
                  <FaExclamationCircle /> {formError}
                </div>
              )}

              {/* Live preview strip */}
              <div className="dp-modal-preview" style={{ borderLeft: `4px solid ${cfg(editing?.slug).color}`, background: cfg(editing?.slug).bg }}>
                <div style={{ color: cfg(editing?.slug).color, fontSize:"1.1rem" }}>{cfg(editing?.slug).icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:"0.88rem", color:"#1a1f36" }}>{form.heroHeadline || "Hero headline will appear here…"}</div>
                  <div style={{ fontSize:"0.75rem", color:"#6b7280", marginTop:3 }}>{form.tagline || "Tagline will appear here…"}</div>
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:14, marginTop:18 }}>
                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>
                      Department Name {editing && <span className="dp-field-hint">(locked)</span>}
                    </label>
                    <input
                      value={form.name}
                      disabled={!!editing}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder={editing ? undefined : "e.g. Marine & Fisheries Studies"}
                      title={editing ? "Renaming isn't supported — this name is the key into each department's icon, color, and intake data." : undefined}
                    />
                    {!editing && (
                      <span className="dp-field-hint-block">
                        New departments use a default icon/color unless the name exactly matches an existing one. Can't be changed after saving.
                      </span>
                    )}
                  </div>
                  <div className="adm-field">
                    <label><FaUserTie style={{ marginRight:5, opacity:0.5 }} />Head of Department (HOD)</label>
                    <input value={form.hod} placeholder="e.g. Telegei Edward" onChange={e => setForm(p => ({ ...p, hod: e.target.value }))} />
                  </div>
                </div>

                <div className="adm-field">
                  <label>Hero Headline <span className="dp-field-hint">(shown as the big H1 on the department page)</span></label>
                  <input value={form.heroHeadline} placeholder="e.g. Empowering Digital Skills for the Future" onChange={e => setForm(p => ({ ...p, heroHeadline: e.target.value }))} />
                </div>

                <div className="adm-field">
                  <label>Tagline / Subtitle <span className="dp-field-hint">(shown under the headline)</span></label>
                  <textarea value={form.tagline} rows={3} placeholder="e.g. Industry-aligned programmes designed for Kenya's growing tech economy." onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save} disabled={saving}>
                <FaSave /> {saving ? "Saving…" : editing ? "Save Changes" : "Add Department"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
