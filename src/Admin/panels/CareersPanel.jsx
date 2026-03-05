import React, { useState } from "react";
import "../AdminDashboard.css";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from "react-icons/fa";

const isOpen = d => new Date(d) >= new Date();
const fmt    = d => new Date(d).toLocaleDateString("en-KE", { day:"2-digit", month:"short", year:"numeric" });

const INIT = [
  { id:1, number:"CHANZEYWE/TRAINERS/ADVERT/9/25",  title:"Advertisement for BOG Trainer Positions",      closeDate:"2025-12-29", postedDate:"2025-12-14" },
  { id:2, number:"CHANZEYWE/HR/ADVERT/10/25",        title:"Advertisement for Human Resource Positions",   closeDate:"2025-12-29", postedDate:"2025-12-14" },
  { id:3, number:"CHANZEYWE/ADMIN/ADVERT/11/25",     title:"Advertisement for Administrator Positions",    closeDate:"2027-12-01", postedDate:"2024-11-14" },
];

const BLANK = { number:"", title:"", closeDate:"", postedDate: new Date().toISOString().split("T")[0] };

export default function CareersPanel() {
  const [jobs,    setJobs]    = useState(INIT);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(BLANK);

  const open  = (j = null) => { setEditing(j); setForm(j ? { ...j } : { ...BLANK }); setModal(true); };
  const close = () => { setModal(false); setEditing(null); };
  const save  = () => {
    if (!form.number || !form.title || !form.closeDate) return;
    if (editing) setJobs(js => js.map(j => j.id === editing.id ? { ...form, id: editing.id } : j));
    else         setJobs(js => [...js, { ...form, id: Date.now() }]);
    close();
  };
  const del = id => setJobs(js => js.filter(j => j.id !== id));

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Career Vacancies</h1>
          <p className="adm-page-header__sub">Post and manage job advertisements. {jobs.filter(j=>isOpen(j.closeDate)).length} open right now.</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => open()}><FaPlus style={{fontSize:"0.75rem"}}/> Post Vacancy</button>
      </div>

      <div className="adm-card">
        <div className="adm-card__header"><span className="adm-card__title">All Vacancies ({jobs.length})</span></div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Vacancy No.</th><th>Job Title</th><th>Posted</th><th>Closing</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id}>
                  <td><code style={{fontWeight:700,color:"var(--adm-blue)",fontSize:"0.78rem"}}>{j.number}</code></td>
                  <td style={{fontWeight:500}}>{j.title}</td>
                  <td style={{color:"var(--adm-muted)",fontSize:"0.8rem"}}>{fmt(j.postedDate)}</td>
                  <td style={{color:"var(--adm-muted)",fontSize:"0.8rem"}}>{fmt(j.closeDate)}</td>
                  <td><span className={`adm-pill ${isOpen(j.closeDate) ? "adm-pill--green" : "adm-pill--red"}`}>{isOpen(j.closeDate) ? "Open" : "Closed"}</span></td>
                  <td><div className="adm-actions">
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(j)}><FaEdit /></button>
                    <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(j.id)}><FaTrash /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{editing ? "Edit Vacancy" : "Post New Vacancy"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>
            <div className="adm-modal__body" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="adm-field"><label>Vacancy Number</label><input value={form.number} placeholder="e.g. CHANZEYWE/HR/ADVERT/01/26" onChange={e=>setForm(p=>({...p,number:e.target.value}))}/></div>
              <div className="adm-field"><label>Job Title</label><input value={form.title} placeholder="e.g. Advertisement for Trainer Positions" onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
              <div className="adm-form-grid">
                <div className="adm-field"><label>Posted Date</label><input type="date" value={form.postedDate} onChange={e=>setForm(p=>({...p,postedDate:e.target.value}))}/></div>
                <div className="adm-field"><label>Closing Date</label><input type="date" value={form.closeDate} onChange={e=>setForm(p=>({...p,closeDate:e.target.value}))}/></div>
              </div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}><FaSave /> Save Vacancy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}