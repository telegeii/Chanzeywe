import React, { useState } from "react";
import "../../AdminDashboard.css";
import "./DownloadPanel.css";
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave,
  FaUpload, FaSearch, FaThLarge, FaList,
  FaDownload, FaFilePdf, FaFileAlt, FaFileInvoice,
  FaFileMedical, FaFileSignature, FaBook, FaEye,
  FaEyeSlash,
} from "react-icons/fa";

/* ── Tag config ─────────────────────────── */
const TAGS = ["Finance", "Admissions", "Health", "Registration", "General", "Academic"];

const TAG_COLOR = {
  Finance:      "dp-tag--blue",
  Admissions:   "dp-tag--green",
  Health:       "dp-tag--red",
  Registration: "dp-tag--amber",
  General:      "dp-tag--purple",
  Academic:     "dp-tag--teal",
};

const TAG_BG = {
  Finance:      { bg: "rgba(10,61,143,0.07)",  color: "#0a3d8f" },
  Admissions:   { bg: "rgba(22,163,74,0.08)",  color: "#15803d" },
  Health:       { bg: "rgba(220,38,38,0.07)",  color: "#b91c1c" },
  Registration: { bg: "rgba(217,119,6,0.08)",  color: "#b45309" },
  General:      { bg: "rgba(124,58,237,0.07)", color: "#6d28d9" },
  Academic:     { bg: "rgba(8,145,178,0.07)",  color: "#0e7490" },
};

/* ── Icon map ───────────────────────────── */
const ICONS = {
  Finance:      <FaFileInvoice />,
  Admissions:   <FaFileAlt />,
  Health:       <FaFileMedical />,
  Registration: <FaFileSignature />,
  General:      <FaBook />,
  Academic:     <FaFilePdf />,
};

/* ── Seed data ──────────────────────────── */
const INIT = [
  { id:1, title:"Current Fee Structure",      tag:"Finance",      desc:"View tuition, levies, and payment schedules for all programmes.",          file:null, fileName:"Fee_Structure_2025.pdf",       visible:true  },
  { id:2, title:"Admission Form",             tag:"Admissions",   desc:"Official application form for new and returning students.",                 file:null, fileName:"Admission_Form.pdf",            visible:true  },
  { id:3, title:"Medical Form",               tag:"Health",       desc:"Student health declaration required before registration.",                  file:null, fileName:"Medical_Form.pdf",              visible:true  },
  { id:4, title:"Student Registration Form",  tag:"Registration", desc:"Complete your enrolment with the official registration document.",          file:null, fileName:"Registration_Form.pdf",         visible:true  },
  { id:5, title:"College Brochure",           tag:"General",      desc:"An overview of all departments, courses, and facilities at Chanzeywe TVC.", file:null, fileName:"College_Brochure_2025.pdf",     visible:true  },
  { id:6, title:"CDACC Examination Guidelines",tag:"Academic",    desc:"Guidelines and instructions for CDACC national examinations.",              file:null, fileName:"CDACC_Exam_Guidelines.pdf",     visible:false },
];

const BLANK = { title:"", tag:"General", desc:"", file:null, fileName:"", visible:true };

export default function DownloadsPanel() {
  const [docs,      setDocs]      = useState(INIT);
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(BLANK);
  const [view,      setView]      = useState("grid");
  const [search,    setSearch]    = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const open  = (d = null) => { setEditing(d); setForm(d ? { ...d } : { ...BLANK }); setModal(true); };
  const close = () => { setModal(false); setEditing(null); };

  const save = () => {
    if (!form.title || !form.tag) return;
    if (editing) setDocs(ds => ds.map(d => d.id === editing.id ? { ...form, id: editing.id } : d));
    else         setDocs(ds => [{ ...form, id: Date.now() }, ...ds]);
    close();
  };

  const del    = id => setDocs(ds => ds.filter(d => d.id !== id));
  const toggle = id => setDocs(ds => ds.map(d => d.id === id ? { ...d, visible: !d.visible } : d));

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, file, fileName: file.name }));
  };

  const filtered = docs.filter(d =>
    (!tagFilter || d.tag === tagFilter) &&
    (!search    || d.title.toLowerCase().includes(search.toLowerCase()))
  );

  const visible = docs.filter(d => d.visible).length;

  return (
    <div className="dp-root">

      {/* ── Header ── */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Downloads</h1>
          <p className="adm-page-header__sub">
            {docs.length} document{docs.length !== 1 ? "s" : ""} &nbsp;·&nbsp; {visible} visible to students
          </p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => open()}>
          <FaPlus style={{ fontSize: "0.72rem" }} /> Add Document
        </button>
      </div>

      {/* ── Tag chips ── */}
      <div className="dp-chips">
        <button
          className={`dp-chip dp-chip--all${!tagFilter ? " dp-chip--active-all" : ""}`}
          onClick={() => setTagFilter("")}
        >
          All <span className="dp-chip__count">{docs.length}</span>
        </button>
        {TAGS.map(t => {
          const count = docs.filter(d => d.tag === t).length;
          if (!count) return null;
          return (
            <button
              key={t}
              className={`dp-chip ${TAG_COLOR[t]}${tagFilter === t ? " dp-chip--active" : ""}`}
              onClick={() => setTagFilter(tagFilter === t ? "" : t)}
            >
              {t} <span className="dp-chip__count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div className="dp-toolbar">
        <div className="dp-search">
          <FaSearch className="dp-search__icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents…" />
        </div>
        <div className="dp-view-toggle">
          <button className={`dp-view-btn${view === "grid" ? " dp-view-btn--active" : ""}`} onClick={() => setView("grid")} title="Card view"><FaThLarge /></button>
          <button className={`dp-view-btn${view === "list" ? " dp-view-btn--active" : ""}`} onClick={() => setView("list")} title="List view"><FaList /></button>
        </div>
      </div>

      {/* ══ GRID VIEW ══ */}
      {view === "grid" && (
        <div className="dp-grid">
          {filtered.length === 0 && (
            <div className="dp-empty"><FaFilePdf /><p>No documents found.</p></div>
          )}
          {filtered.map(d => {
            const tc = TAG_BG[d.tag] || TAG_BG["General"];
            return (
              <div key={d.id} className={`dp-card${!d.visible ? " dp-card--hidden" : ""}`}>

                {/* Coloured top bar */}
                <div className="dp-card__bar" style={{ background: tc.color }} />

                <div className="dp-card__inner">
                  {/* Icon tile */}
                  <div className="dp-card__icon-wrap" style={{ background: tc.bg, color: tc.color }}>
                    {ICONS[d.tag] || <FaFilePdf />}
                  </div>

                  {/* Tag + visibility */}
                  <div className="dp-card__meta-row">
                    <span className={`dp-tag ${TAG_COLOR[d.tag]}`}>{d.tag}</span>
                    {!d.visible && <span className="dp-hidden-badge">Hidden</span>}
                  </div>

                  <h3 className="dp-card__title">{d.title}</h3>
                  <p className="dp-card__desc">{d.desc}</p>

                  {/* File name chip */}
                  {d.fileName && (
                    <div className="dp-card__file">
                      <FaFilePdf style={{ color: "#dc2626", fontSize: "0.75rem" }} />
                      <span>{d.fileName}</span>
                    </div>
                  )}
                </div>

                {/* Footer actions */}
                <div className="dp-card__footer">
                  <button
                    className={`dp-icon-btn${d.visible ? " dp-icon-btn--eye" : " dp-icon-btn--eye-off"}`}
                    title={d.visible ? "Hide from students" : "Show to students"}
                    onClick={() => toggle(d.id)}
                  >
                    {d.visible ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button className="dp-icon-btn dp-icon-btn--edit" onClick={() => open(d)} title="Edit"><FaEdit /></button>
                  <button className="dp-icon-btn dp-icon-btn--del"  onClick={() => del(d.id)} title="Delete"><FaTrash /></button>
                </div>
              </div>
            );
          })}

          {/* "Add new" ghost card */}
          <button className="dp-add-card" onClick={() => open()}>
            <FaPlus className="dp-add-card__icon" />
            <span>Add Document</span>
          </button>
        </div>
      )}

      {/* ══ LIST VIEW ══ */}
      {view === "list" && (
        <div className="adm-card">
          <div className="adm-card__header">
            <span className="adm-card__title">All Documents ({filtered.length})</span>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>File</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const tc = TAG_BG[d.tag] || TAG_BG["General"];
                  return (
                    <tr key={d.id} style={{ opacity: d.visible ? 1 : 0.55 }}>
                      <td style={{ color: "var(--adm-muted)", fontSize: "0.8rem" }}>{i + 1}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: tc.bg, color: tc.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0 }}>
                            {ICONS[d.tag] || <FaFilePdf />}
                          </div>
                          <span style={{ fontWeight: 600 }}>{d.title}</span>
                        </div>
                      </td>
                      <td><span className={`adm-pill adm-pill--${TAG_COLOR[d.tag].replace("dp-tag--","")}`}>{d.tag}</span></td>
                      <td style={{ color: "var(--adm-muted)", fontSize: "0.8rem", maxWidth: 240 }}>{d.desc}</td>
                      <td style={{ color: "var(--adm-muted)", fontSize: "0.78rem" }}>
                        {d.fileName
                          ? <span style={{ display: "flex", alignItems: "center", gap: 5 }}><FaFilePdf style={{ color: "#dc2626" }} />{d.fileName}</span>
                          : <span style={{ color: "#d1d5db" }}>—</span>
                        }
                      </td>
                      <td>
                        <span className={`adm-pill ${d.visible ? "adm-pill--green" : "adm-pill--red"}`}>
                          {d.visible ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td>
                        <div className="adm-actions">
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => toggle(d.id)}>{d.visible ? <FaEyeSlash /> : <FaEye />}</button>
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(d)}><FaEdit /></button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(d.id)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Info note (mirrors client) ── */}
      <div className="dp-note">
        <FaFilePdf className="dp-note__icon" />
        <p>All documents are served in PDF format. Students must have a PDF reader installed to open them.</p>
      </div>

      {/* ══════════ MODAL ══════════ */}
      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{editing ? "Edit Document" : "Add New Document"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>

            <div className="adm-modal__body">

              {/* Tag selector — visual row */}
              <div className="dp-tag-picker">
                <label className="dp-tag-picker__label">Category / Tag</label>
                <div className="dp-tag-picker__row">
                  {TAGS.map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`dp-tag-btn ${TAG_COLOR[t]}${form.tag === t ? " dp-tag-btn--active" : ""}`}
                      onClick={() => setForm(p => ({ ...p, tag: t }))}
                    >
                      <span className="dp-tag-btn__icon">{ICONS[t]}</span>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>

                <div className="adm-field">
                  <label>Document Title</label>
                  <input value={form.title} placeholder="e.g. Current Fee Structure 2026" onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                </div>

                <div className="adm-field">
                  <label>Description</label>
                  <textarea value={form.desc} rows={3} placeholder="Brief description shown on the downloads page…" onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} />
                </div>

                {/* File upload */}
                <div className="adm-field">
                  <label>PDF File</label>
                  {form.fileName ? (
                    <div className="dp-file-chip">
                      <FaFilePdf className="dp-file-chip__icon" />
                      <span className="dp-file-chip__name">{form.fileName}</span>
                      <button
                        className="dp-file-chip__remove"
                        onClick={() => setForm(p => ({ ...p, file: null, fileName: "" }))}
                      ><FaTimes /></button>
                    </div>
                  ) : (
                    <label className="dp-upload-zone">
                      <FaUpload className="dp-upload-zone__icon" />
                      <span className="dp-upload-zone__title">Click to upload PDF</span>
                      <span className="dp-upload-zone__hint">Only .pdf files · Max 10 MB</span>
                      <input type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFile} />
                    </label>
                  )}
                </div>

                {/* Visibility toggle */}
                <div className="dp-vis-row">
                  <label className="dp-toggle">
                    <input type="checkbox" checked={form.visible} onChange={e => setForm(p => ({ ...p, visible: e.target.checked }))} />
                    <span className="dp-toggle__track"><span className="dp-toggle__thumb" /></span>
                  </label>
                  <div>
                    <span className="dp-vis-row__label">{form.visible ? "Visible to students" : "Hidden from students"}</span>
                    <span className="dp-vis-row__hint">{form.visible ? "This file will appear on the Downloads page." : "Only admins can see this document."}</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}>
                <FaSave /> {editing ? "Save Changes" : "Add Document"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}