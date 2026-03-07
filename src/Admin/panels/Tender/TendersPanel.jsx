import React, { useState } from "react";
import "../../AdminDashboard.css";
import "./TenderPanel.css";
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave,
  FaUpload, FaSearch, FaFileContract, FaCalendarAlt,
  FaHashtag, FaFilePdf, FaClock, FaDownload,
  FaCheckCircle, FaTimesCircle, FaTag,
} from "react-icons/fa";

const isOpen  = d => new Date(d) >= new Date();
const fmt     = d => new Date(d).toLocaleDateString("en-KE", { day:"2-digit", month:"short", year:"numeric" });
const daysLeft = d => Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));

const METHODS = ["Open Tender", "Restricted Tender", "Direct Procurement", "Request for Quotation", "Framework Agreement"];

const METHOD_COLOR = {
  "Open Tender":          "tp-method--blue",
  "Restricted Tender":    "tp-method--amber",
  "Direct Procurement":   "tp-method--purple",
  "Request for Quotation":"tp-method--teal",
  "Framework Agreement":  "tp-method--green",
};

const INIT = [
  { id:1, number:"CHANZEYWE/OT/01/2023-2024", title:"Provision of Printing Papers",   method:"Open Tender",       postedDate:"2025-12-14", closeDate:"2024-12-29", file:null, fileName:"Tender_Printing_Papers.pdf"  },
  { id:2, number:"CHANZEYWE/OT/02/2025-2026", title:"Provision of Security Services",  method:"Restricted Tender", postedDate:"2025-12-14", closeDate:"2026-06-30", file:null, fileName:"Tender_Security_Services.pdf" },
  { id:3, number:"CHANZEYWE/OT/03/2025-2026", title:"Provision of Washing Soap",       method:"Open Tender",       postedDate:"2025-12-14", closeDate:"2024-12-01", file:null, fileName:"Tender_Washing_Soap.pdf"      },
  { id:4, number:"CHANZEYWE/PROC/004/2026",   title:"Supply of Laboratory Equipment",  method:"Open Tender",       postedDate:"2026-01-10", closeDate:"2026-07-15", file:null, fileName:"Tender_Lab_Equipment.pdf"     },
];

const BLANK = {
  number:"", title:"", method:"Open Tender",
  closeDate:"", postedDate: new Date().toISOString().split("T")[0],
  file:null, fileName:"",
};

export default function TendersPanel() {
  const [tenders, setTenders] = useState(INIT);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(BLANK);
  const [search,  setSearch]  = useState("");
  const [tab,     setTab]     = useState("open"); // "open" | "closed" | "all"

  const openModal  = (t = null) => { setEditing(t); setForm(t ? { ...t } : { ...BLANK }); setModal(true); };
  const close      = () => { setModal(false); setEditing(null); };

  const save = () => {
    if (!form.number || !form.title || !form.closeDate) return;
    if (editing) setTenders(ts => ts.map(t => t.id === editing.id ? { ...form, id: editing.id } : t));
    else         setTenders(ts => [{ ...form, id: Date.now() }, ...ts]);
    close();
  };

  const del = id => setTenders(ts => ts.filter(t => t.id !== id));

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, file, fileName: file.name }));
  };

  const openTenders   = tenders.filter(t => isOpen(t.closeDate));
  const closedTenders = tenders.filter(t => !isOpen(t.closeDate));

  const listToShow = tab === "open" ? openTenders : tab === "closed" ? closedTenders : tenders;

  const filtered = listToShow.filter(t =>
    !search ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.number.toLowerCase().includes(search.toLowerCase()) ||
    t.method.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tp-root">

      {/* ── Header ── */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Tenders</h1>
          <p className="adm-page-header__sub">
            {openTenders.length} active &nbsp;·&nbsp; {closedTenders.length} closed &nbsp;·&nbsp; {tenders.length} total
          </p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => openModal()}>
          <FaPlus style={{ fontSize:"0.72rem" }} /> Post Tender
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="tp-stats">
        <div className="tp-stat tp-stat--open">
          <div className="tp-stat__icon"><FaCheckCircle /></div>
          <div>
            <span className="tp-stat__num">{openTenders.length}</span>
            <span className="tp-stat__label">Open Tenders</span>
          </div>
        </div>
        <div className="tp-stat tp-stat--closed">
          <div className="tp-stat__icon"><FaTimesCircle /></div>
          <div>
            <span className="tp-stat__num">{closedTenders.length}</span>
            <span className="tp-stat__label">Closed Tenders</span>
          </div>
        </div>
        <div className="tp-stat tp-stat--total">
          <div className="tp-stat__icon"><FaFileContract /></div>
          <div>
            <span className="tp-stat__num">{tenders.length}</span>
            <span className="tp-stat__label">Total Posted</span>
          </div>
        </div>
      </div>

      {/* ── Tabs + Search ── */}
      <div className="tp-toolbar">
        <div className="tp-tabs">
          {[
            { key:"open",   label:"Open",   count: openTenders.length   },
            { key:"closed", label:"Closed", count: closedTenders.length },
            { key:"all",    label:"All",    count: tenders.length       },
          ].map(t => (
            <button
              key={t.key}
              className={`tp-tab${tab === t.key ? " tp-tab--active" : ""} tp-tab--${t.key}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              <span className="tp-tab__count">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="tp-search">
          <FaSearch className="tp-search__icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenders…" />
        </div>
      </div>

      {/* ── Section header — Open (mirrors client) ── */}
      {(tab === "open" || tab === "all") && (
        <div className="tp-section-head tp-section-head--open">
          <span className="tp-dot tp-dot--open" />
          <h3>Open Tender Opportunities</h3>
          <span className="tp-badge tp-badge--open">{openTenders.length} Active</span>
        </div>
      )}

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div className="tp-empty">
          <FaFileContract />
          <p>No tenders found{tab === "open" ? " — no open procurement notices at the moment." : "."}</p>
          <button className="adm-btn adm-btn--primary" onClick={() => openModal()}>
            <FaPlus style={{ fontSize:"0.72rem" }} /> Post a Tender
          </button>
        </div>
      ) : (
        <div className="adm-card tp-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table tp-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tender No.</th>
                  <th>Description</th>
                  <th>Method</th>
                  <th>Published</th>
                  <th>Closing</th>
                  <th>Status</th>
                  <th>PDF</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const open_ = isOpen(t.closeDate);
                  const days  = daysLeft(t.closeDate);
                  return (
                    <tr key={t.id} className={!open_ ? "tp-row--closed" : ""}>
                      <td className="tp-row__num">{i + 1}</td>
                      <td><code className="tp-code">{t.number}</code></td>
                      <td className="tp-row__title">{t.title}</td>
                      <td>
                        <span className={`tp-method ${METHOD_COLOR[t.method] || "tp-method--blue"}`}>
                          {t.method}
                        </span>
                      </td>
                      <td className="tp-row__date">{fmt(t.postedDate)}</td>
                      <td>
                        <div className="tp-close-cell">
                          <span className="tp-row__date">{fmt(t.closeDate)}</span>
                          {open_ && days <= 14 && (
                            <span className="tp-expiring"><FaClock /> {days}d left</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`adm-pill ${open_ ? "adm-pill--green" : "adm-pill--red"}`}>
                          {open_ ? "Open" : "Closed"}
                        </span>
                      </td>
                      <td>
                        {t.fileName ? (
                          <div className="tp-pdf-chip">
                            <FaFilePdf className="tp-pdf-chip__icon" />
                            <span>{t.fileName}</span>
                          </div>
                        ) : (
                          <span className="tp-no-pdf">— no file</span>
                        )}
                      </td>
                      <td>
                        <div className="adm-actions">
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openModal(t)} title="Edit"><FaEdit /></button>
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(t.id)} title="Delete"><FaTrash /></button>
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

      {/* ── Closed section header (mirrors client) ── */}
      {(tab === "closed" || tab === "all") && closedTenders.length > 0 && (
        <div className="tp-section-head tp-section-head--closed" style={{ marginTop:32 }}>
          <span className="tp-dot tp-dot--closed" />
          <h3>Closed Tenders</h3>
          <span className="tp-badge tp-badge--closed">{closedTenders.length} Closed</span>
        </div>
      )}

      {/* ── Procurement note ── */}
      <div className="tp-note">
        <FaFileContract className="tp-note__icon" />
        <p>We welcome suppliers to participate in our procurement processes. All tenders are subject to <strong>PPRA regulations</strong>.</p>
      </div>

      {/* ══════════ MODAL ══════════ */}
      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>

            <div className="adm-modal__header">
              <span className="adm-modal__title">
                {editing ? "Edit Tender" : "Post New Tender"}
              </span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>

            <div className="adm-modal__body">

              {/* Live status banner */}
              {form.closeDate && (
                <div className={`tp-modal-status ${isOpen(form.closeDate) ? "tp-modal-status--open" : "tp-modal-status--closed"}`}>
                  {isOpen(form.closeDate)
                    ? <><FaCheckCircle /> This tender will be <strong>Open</strong> — closes {fmt(form.closeDate)}</>
                    : <><FaTimesCircle /> This tender will be <strong>Closed</strong> — closing date has passed</>
                  }
                </div>
              )}

              <div style={{ display:"flex", flexDirection:"column", gap:14, marginTop: form.closeDate ? 16 : 0 }}>

                <div className="adm-field">
                  <label><FaHashtag style={{ marginRight:5, opacity:0.5 }} />Tender Number</label>
                  <input
                    value={form.number}
                    placeholder="e.g. CHANZEYWE/OT/01/2025-2026"
                    onChange={e => setForm(p => ({ ...p, number: e.target.value }))}
                  />
                  <span className="tp-field-hint">Format: CHANZEYWE / TYPE / NO / FINANCIAL YEAR</span>
                </div>

                <div className="adm-field">
                  <label><FaFileContract style={{ marginRight:5, opacity:0.5 }} />Tender Title / Description</label>
                  <input
                    value={form.title}
                    placeholder="e.g. Provision of Security Services"
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  />
                </div>

                {/* Procurement method — visual selector */}
                <div className="tp-method-picker">
                  <label className="tp-method-picker__label"><FaTag style={{ marginRight:5, opacity:0.5 }} />Procurement Method</label>
                  <div className="tp-method-picker__row">
                    {METHODS.map(m => (
                      <button
                        key={m}
                        type="button"
                        className={`tp-method-btn ${METHOD_COLOR[m] || "tp-method--blue"}${form.method === m ? " tp-method-btn--active" : ""}`}
                        onClick={() => setForm(p => ({ ...p, method: m }))}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
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

                {/* PDF Upload — maps to TenderPdf / download on client */}
                <div className="adm-field">
                  <label><FaFilePdf style={{ marginRight:5, color:"#dc2626", opacity:0.8 }} />Tender Document PDF</label>
                  <span className="tp-field-hint" style={{ marginBottom:8, display:"block" }}>
                    This file will be available to suppliers via the "Download" button on the public tenders page.
                  </span>
                  {form.fileName ? (
                    <div className="tp-file-chip">
                      <FaFilePdf className="tp-file-chip__icon" />
                      <span className="tp-file-chip__name">{form.fileName}</span>
                      <button
                        className="tp-file-chip__remove"
                        onClick={() => setForm(p => ({ ...p, file:null, fileName:"" }))}
                      ><FaTimes /></button>
                    </div>
                  ) : (
                    <label className="tp-upload-zone">
                      <FaUpload className="tp-upload-zone__icon" />
                      <span className="tp-upload-zone__title">Click to upload Tender PDF</span>
                      <span className="tp-upload-zone__hint">Only .pdf files · Max 10 MB</span>
                      <input type="file" accept=".pdf" style={{ display:"none" }} onChange={handleFile} />
                    </label>
                  )}
                </div>

              </div>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}>
                <FaSave /> {editing ? "Save Changes" : "Post Tender"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}