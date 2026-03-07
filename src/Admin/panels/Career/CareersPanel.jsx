import React, { useState } from "react";
import "../../AdminDashboard.css";
import "./CareerPanel.css";
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave,
  FaUpload, FaSearch, FaBriefcase, FaCalendarAlt,
  FaHashtag, FaDownload, FaFilePdf, FaClock,
  FaCheckCircle, FaTimesCircle,
} from "react-icons/fa";

const isOpen = d => new Date(d) >= new Date();
const fmt    = d => new Date(d).toLocaleDateString("en-KE", { day:"2-digit", month:"short", year:"numeric" });

/* Days remaining helper */
const daysLeft = d => {
  const diff = new Date(d) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const INIT = [
  { id:1, number:"CHANZEYWE/TRAINERS/ADVERT/9/25",  title:"Advertisement for BOG Trainer Positions",    closeDate:"2025-12-29", postedDate:"2025-12-14", file:null, fileName:"Trainer_Advert_9_25.pdf"   },
  { id:2, number:"CHANZEYWE/HR/ADVERT/10/25",        title:"Advertisement for Human Resource Positions", closeDate:"2025-12-29", postedDate:"2025-12-14", file:null, fileName:"HR_Advert_10_25.pdf"       },
  { id:3, number:"CHANZEYWE/ADMIN/ADVERT/11/25",     title:"Advertisement for Administrator Positions",  closeDate:"2027-12-01", postedDate:"2024-11-14", file:null, fileName:"Admin_Advert_11_25.pdf"    },
];

const BLANK = {
  number:"", title:"",
  closeDate:"", postedDate: new Date().toISOString().split("T")[0],
  file:null, fileName:"",
};

export default function CareersPanel() {
  const [jobs,    setJobs]    = useState(INIT);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(BLANK);
  const [search,  setSearch]  = useState("");
  const [tab,     setTab]     = useState("open"); // "open" | "closed" | "all"

  const open  = (j = null) => { setEditing(j); setForm(j ? { ...j } : { ...BLANK }); setModal(true); };
  const close = () => { setModal(false); setEditing(null); };

  const save = () => {
    if (!form.number || !form.title || !form.closeDate) return;
    if (editing) setJobs(js => js.map(j => j.id === editing.id ? { ...form, id: editing.id } : j));
    else         setJobs(js => [{ ...form, id: Date.now() }, ...js]);
    close();
  };

  const del = id => setJobs(js => js.filter(j => j.id !== id));

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, file, fileName: file.name }));
  };

  const openJobs   = jobs.filter(j => isOpen(j.closeDate));
  const closedJobs = jobs.filter(j => !isOpen(j.closeDate));

  const filtered = (tab === "open" ? openJobs : tab === "closed" ? closedJobs : jobs)
    .filter(j => !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.number.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="cp-root">

      {/* ── Header ── */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Career Vacancies</h1>
          <p className="adm-page-header__sub">
            {openJobs.length} open &nbsp;·&nbsp; {closedJobs.length} closed &nbsp;·&nbsp; {jobs.length} total
          </p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => open()}>
          <FaPlus style={{ fontSize: "0.72rem" }} /> Post Vacancy
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="cp-stats">
        <div className="cp-stat cp-stat--open">
          <div className="cp-stat__icon"><FaCheckCircle /></div>
          <div>
            <span className="cp-stat__num">{openJobs.length}</span>
            <span className="cp-stat__label">Open Vacancies</span>
          </div>
        </div>
        <div className="cp-stat cp-stat--closed">
          <div className="cp-stat__icon"><FaTimesCircle /></div>
          <div>
            <span className="cp-stat__num">{closedJobs.length}</span>
            <span className="cp-stat__label">Closed Vacancies</span>
          </div>
        </div>
        <div className="cp-stat cp-stat--total">
          <div className="cp-stat__icon"><FaBriefcase /></div>
          <div>
            <span className="cp-stat__num">{jobs.length}</span>
            <span className="cp-stat__label">Total Posted</span>
          </div>
        </div>
      </div>

      {/* ── Tabs + Search ── */}
      <div className="cp-toolbar">
        <div className="cp-tabs">
          {[
            { key:"open",   label:"Open",   count: openJobs.length   },
            { key:"closed", label:"Closed", count: closedJobs.length },
            { key:"all",    label:"All",    count: jobs.length       },
          ].map(t => (
            <button
              key={t.key}
              className={`cp-tab${tab === t.key ? " cp-tab--active" : ""} cp-tab--${t.key}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              <span className="cp-tab__count">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="cp-search">
          <FaSearch className="cp-search__icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vacancies…" />
        </div>
      </div>

      {/* ── Open Section Header (mirrors client) ── */}
      {(tab === "open" || tab === "all") && (
        <div className="cp-section-head cp-section-head--open">
          <span className="cp-dot cp-dot--open" />
          <h3>Open Career Opportunities</h3>
          <span className="cp-badge cp-badge--open">{openJobs.length} Active</span>
        </div>
      )}

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div className="cp-empty">
          <FaBriefcase />
          <p>No vacancies found{tab === "open" ? " — no open positions at the moment." : "."}</p>
          <button className="adm-btn adm-btn--primary" onClick={() => open()}>
            <FaPlus style={{ fontSize: "0.72rem" }} /> Post a Vacancy
          </button>
        </div>
      ) : (
        <div className="adm-card cp-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table cp-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vacancy No.</th>
                  <th>Job Title</th>
                  <th>Published</th>
                  <th>Closing Date</th>
                  <th>Status</th>
                  <th>PDF</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((j, i) => {
                  const open_ = isOpen(j.closeDate);
                  const days  = daysLeft(j.closeDate);
                  return (
                    <tr key={j.id} className={!open_ ? "cp-row--closed" : ""}>
                      <td className="cp-row__num">{i + 1}</td>
                      <td>
                        <code className="cp-code">{j.number}</code>
                      </td>
                      <td className="cp-row__title">{j.title}</td>
                      <td className="cp-row__date">{fmt(j.postedDate)}</td>
                      <td>
                        <div className="cp-close-cell">
                          <span className="cp-row__date">{fmt(j.closeDate)}</span>
                          {open_ && days <= 14 && (
                            <span className="cp-expiring">
                              <FaClock /> {days}d left
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`adm-pill ${open_ ? "adm-pill--green" : "adm-pill--red"}`}>
                          {open_ ? "Open" : "Closed"}
                        </span>
                      </td>
                      <td>
                        {j.fileName ? (
                          <div className="cp-pdf-chip">
                            <FaFilePdf className="cp-pdf-chip__icon" />
                            <span>{j.fileName}</span>
                          </div>
                        ) : (
                          <span className="cp-no-pdf">— no file</span>
                        )}
                      </td>
                      <td>
                        <div className="adm-actions">
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(j)} title="Edit"><FaEdit /></button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(j.id)} title="Delete"><FaTrash /></button>
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

      {/* ── Closed Section Header ── */}
      {(tab === "closed" || tab === "all") && closedJobs.length > 0 && (
        <div className="cp-section-head cp-section-head--closed" style={{ marginTop: 32 }}>
          <span className="cp-dot cp-dot--closed" />
          <h3>Closed Vacancies</h3>
          <span className="cp-badge cp-badge--closed">{closedJobs.length} Closed</span>
        </div>
      )}

      {/* ── Equal opportunity note (mirrors client) ── */}
      <div className="cp-note">
        <FaBriefcase className="cp-note__icon" />
        <p>Chanzeywe TVC is an <strong>equal opportunity employer</strong>. All qualified candidates are encouraged to apply regardless of gender, age, or disability.</p>
      </div>

      {/* ══════════ MODAL ══════════ */}
      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>

            <div className="adm-modal__header">
              <span className="adm-modal__title">
                {editing ? "Edit Vacancy" : "Post New Vacancy"}
              </span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>

            <div className="adm-modal__body">

              {/* Status preview banner */}
              {form.closeDate && (
                <div className={`cp-modal-status ${isOpen(form.closeDate) ? "cp-modal-status--open" : "cp-modal-status--closed"}`}>
                  {isOpen(form.closeDate)
                    ? <><FaCheckCircle /> This vacancy will be <strong>Open</strong> — closes {fmt(form.closeDate)}</>
                    : <><FaTimesCircle /> This vacancy will be <strong>Closed</strong> — closing date has passed</>
                  }
                </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:14, marginTop: form.closeDate ? 16 : 0 }}>

                <div className="adm-field">
                  <label><FaHashtag style={{ marginRight:5, opacity:0.5 }} />Vacancy Number</label>
                  <input
                    value={form.number}
                    placeholder="e.g. CHANZEYWE/HR/ADVERT/01/26"
                    onChange={e => setForm(p => ({ ...p, number: e.target.value }))}
                  />
                  <span className="cp-field-hint">Use the format: CHANZEYWE / DEPT / ADVERT / NO / YEAR</span>
                </div>

                <div className="adm-field">
                  <label><FaBriefcase style={{ marginRight:5, opacity:0.5 }} />Job Title / Advertisement Title</label>
                  <input
                    value={form.title}
                    placeholder="e.g. Advertisement for Trainer Positions"
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  />
                </div>

                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label><FaCalendarAlt style={{ marginRight:5, opacity:0.5 }} />Posted Date</label>
                    <input type="date" value={form.postedDate} onChange={e => setForm(p => ({ ...p, postedDate: e.target.value }))} />
                  </div>
                  <div className="adm-field">
                    <label><FaCalendarAlt style={{ marginRight:5, opacity:0.5 }} />Closing Date</label>
                    <input type="date" value={form.closeDate} onChange={e => setForm(p => ({ ...p, closeDate: e.target.value }))} />
                  </div>
                </div>

                {/* PDF Upload — maps to JobPdf / download link on client */}
                <div className="adm-field">
                  <label><FaFilePdf style={{ marginRight:5, color:"#dc2626", opacity:0.7 }} />Application / Advert PDF</label>
                  <span className="cp-field-hint" style={{ marginBottom:8, display:"block" }}>
                    This PDF will be the file students download via the "Download" button on the public careers page.
                  </span>
                  {form.fileName ? (
                    <div className="cp-file-chip">
                      <FaFilePdf className="cp-file-chip__icon" />
                      <span className="cp-file-chip__name">{form.fileName}</span>
                      <button
                        className="cp-file-chip__remove"
                        onClick={() => setForm(p => ({ ...p, file:null, fileName:"" }))}
                      ><FaTimes /></button>
                    </div>
                  ) : (
                    <label className="cp-upload-zone">
                      <FaUpload className="cp-upload-zone__icon" />
                      <span className="cp-upload-zone__title">Click to upload PDF</span>
                      <span className="cp-upload-zone__hint">Only .pdf files · Max 10 MB</span>
                      <input type="file" accept=".pdf" style={{ display:"none" }} onChange={handleFile} />
                    </label>
                  )}
                </div>

              </div>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}>
                <FaSave /> {editing ? "Save Changes" : "Post Vacancy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}