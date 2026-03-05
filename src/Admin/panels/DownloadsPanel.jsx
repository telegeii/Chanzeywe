import React, { useState } from "react";
import "../AdminDashboard.css";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaUpload } from "react-icons/fa";

const CATS = ["Finance","Admissions","Health","Registration","General","Academic"];

const INIT = [
  { id:1, title:"School Fee Structure 2025",        category:"Finance",      description:"Current fee structure for all programmes." },
  { id:2, title:"Admission Form",                   category:"Admissions",   description:"Student admission application form." },
  { id:3, title:"Medical Form",                     category:"Health",       description:"Medical examination form for new students." },
  { id:4, title:"Registration Form",                category:"Registration", description:"Semester registration form." },
  { id:5, title:"CDACC Examination Guidelines",     category:"Academic",     description:"Guidelines for CDACC examinations." },
];

const BLANK = { title:"", category:"General", description:"", file: null };

export default function DownloadsPanel() {
  const [items,   setItems]   = useState(INIT);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(BLANK);

  const open  = (it = null) => { setEditing(it); setForm(it ? { ...it } : { ...BLANK }); setModal(true); };
  const close = () => { setModal(false); setEditing(null); };
  const save  = () => {
    if (!form.title || !form.category) return;
    if (editing) setItems(is => is.map(i => i.id === editing.id ? { ...form, id: editing.id } : i));
    else         setItems(is => [...is, { ...form, id: Date.now() }]);
    close();
  };
  const del = id => setItems(is => is.filter(i => i.id !== id));

  const catColor = c => ({ Finance:"adm-pill--blue", Admissions:"adm-pill--green", Health:"adm-pill--red", Registration:"adm-pill--amber", General:"adm-pill--blue", Academic:"adm-pill--green" }[c] || "adm-pill--blue");

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Downloads</h1>
          <p className="adm-page-header__sub">Manage downloadable documents available to students and staff.</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => open()}><FaPlus style={{fontSize:"0.75rem"}}/> Add Document</button>
      </div>

      <div className="adm-card">
        <div className="adm-card__header"><span className="adm-card__title">All Documents ({items.length})</span></div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>#</th><th>Document Title</th><th>Category</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={it.id}>
                  <td style={{color:"var(--adm-muted)",fontSize:"0.8rem"}}>{i+1}</td>
                  <td style={{fontWeight:600}}>{it.title}</td>
                  <td><span className={`adm-pill ${catColor(it.category)}`}>{it.category}</span></td>
                  <td style={{color:"var(--adm-muted)",fontSize:"0.82rem",maxWidth:260}}>{it.description}</td>
                  <td><div className="adm-actions">
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(it)}><FaEdit /></button>
                    <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(it.id)}><FaTrash /></button>
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
              <span className="adm-modal__title">{editing ? "Edit Document" : "Add New Document"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>
            <div className="adm-modal__body" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="adm-field"><label>Document Title</label><input value={form.title} placeholder="e.g. School Fee Structure 2026" onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
              <div className="adm-field">
                <label>Category</label>
                <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="adm-field"><label>Description</label><textarea value={form.description} placeholder="Brief description of this document…" rows={3} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div>
              <div className="adm-field">
                <label>Upload PDF File</label>
                <label style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:"var(--adm-bg)",border:"1.5px dashed var(--adm-border)",borderRadius:8,cursor:"pointer",fontSize:"0.84rem",color:"var(--adm-muted)"}}>
                  <FaUpload style={{color:"var(--adm-blue)"}}/>
                  {form.file ? form.file.name : "Click to browse PDF file"}
                  <input type="file" accept=".pdf" style={{display:"none"}} onChange={e=>setForm(p=>({...p,file:e.target.files[0]}))}/>
                </label>
              </div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}><FaSave /> Save Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}