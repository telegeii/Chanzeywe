import React, { useState } from "react";
import "../AdminDashboard.css";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from "react-icons/fa";

const isOpen = d => new Date(d) >= new Date();

const INIT = [
  { id:1, number:"CHANZEYWE/PROC/TENDER/007/2025", title:"Supply of Laboratory Equipment", closeDate:"2026-03-30", postedDate:"2025-12-01" },
  { id:2, number:"CHANZEYWE/PROC/TENDER/008/2025", title:"Provision of Security Services",  closeDate:"2026-04-15", postedDate:"2025-12-10" },
  { id:3, number:"CHANZEYWE/PROC/TENDER/005/2025", title:"Supply of Stationery 2024",       closeDate:"2025-01-15", postedDate:"2024-12-01" },
];

const BLANK = { number:"", title:"", closeDate:"", postedDate: new Date().toISOString().split("T")[0] };

export default function TendersPanel() {
  const [tenders, setTenders] = useState(INIT);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(BLANK);

  const open  = (t = null) => { setEditing(t); setForm(t ? { ...t } : { ...BLANK }); setModal(true); };
  const close = () => { setModal(false); setEditing(null); };
  const save  = () => {
    if (!form.number || !form.title || !form.closeDate) return;
    if (editing) setTenders(ts => ts.map(t => t.id === editing.id ? { ...form, id: editing.id } : t));
    else         setTenders(ts => [...ts, { ...form, id: Date.now() }]);
    close();
  };
  const del = id => setTenders(ts => ts.filter(t => t.id !== id));
  const fmt = d => new Date(d).toLocaleDateString("en-KE", { day:"2-digit", month:"short", year:"numeric" });

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Tenders</h1>
          <p className="adm-page-header__sub">Manage procurement notices. {tenders.filter(t=>isOpen(t.closeDate)).length} currently active.</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => open()}><FaPlus style={{fontSize:"0.75rem"}}/> Post Tender</button>
      </div>

      <div className="adm-card">
        <div className="adm-card__header"><span className="adm-card__title">All Tenders ({tenders.length})</span></div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Tender No.</th><th>Title</th><th>Posted</th><th>Closing</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {tenders.map(t => (
                <tr key={t.id}>
                  <td><code style={{fontWeight:700,color:"var(--adm-blue)",fontSize:"0.78rem"}}>{t.number}</code></td>
                  <td style={{fontWeight:500}}>{t.title}</td>
                  <td style={{color:"var(--adm-muted)",fontSize:"0.8rem"}}>{fmt(t.postedDate)}</td>
                  <td style={{color:"var(--adm-muted)",fontSize:"0.8rem"}}>{fmt(t.closeDate)}</td>
                  <td><span className={`adm-pill ${isOpen(t.closeDate) ? "adm-pill--green" : "adm-pill--red"}`}>{isOpen(t.closeDate) ? "Open" : "Closed"}</span></td>
                  <td><div className="adm-actions">
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(t)}><FaEdit /></button>
                    <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(t.id)}><FaTrash /></button>
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
              <span className="adm-modal__title">{editing ? "Edit Tender" : "Post New Tender"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>
            <div className="adm-modal__body" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="adm-field"><label>Tender Number</label><input value={form.number} placeholder="e.g. CHANZEYWE/PROC/TENDER/001/2026" onChange={e=>setForm(p=>({...p,number:e.target.value}))}/></div>
              <div className="adm-field"><label>Tender Title</label><input value={form.title} placeholder="Brief description of the tender" onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
              <div className="adm-form-grid">
                <div className="adm-field"><label>Posted Date</label><input type="date" value={form.postedDate} onChange={e=>setForm(p=>({...p,postedDate:e.target.value}))}/></div>
                <div className="adm-field"><label>Closing Date</label><input type="date" value={form.closeDate} onChange={e=>setForm(p=>({...p,closeDate:e.target.value}))}/></div>
              </div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}><FaSave /> Save Tender</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}