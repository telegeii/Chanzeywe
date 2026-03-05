import React, { useState } from "react";
import "../AdminDashboard.css";
import { FaEdit, FaTimes, FaSave, FaBuilding } from "react-icons/fa";

const INIT = [
  { id:1, name:"Computing & Informatics",      hod:"Telegei Edward", icon:"💻", courses:3, hero:"Empowering Digital Skills for the Future",              tagline:"Industry-aligned ICT programmes designed for Kenya's growing tech economy." },
  { id:2, name:"Building & Civil Engineering", hod:"Telegei Edward", icon:"🏗️", courses:6, hero:"Training Skilled Professionals for Construction",         tagline:"Hands-on programmes for Kenya's growing construction sector." },
  { id:3, name:"Electrical Engineering",       hod:"Telegei Edward", icon:"⚡", courses:3, hero:"Training Professionals in Electrical Power & Installation",tagline:"Industry-aligned programmes powering Kenya's electrical sector." },
  { id:4, name:"Liberal Studies",              hod:"Telegei Edward", icon:"📚", courses:4, hero:"Empowering Social & Management Professionals",             tagline:"Programmes in social work and supply chain management." },
  { id:5, name:"Hospitality & Tourism",        hod:"TBD",            icon:"🍽️", courses:2, hero:"Excellence in Hospitality & Culinary Arts",               tagline:"Training world-class hospitality professionals." },
];

export default function DepartmentsPanel() {
  const [depts,   setDepts]   = useState(INIT);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({});

  const open  = d => { setEditing(d); setForm({ ...d }); setModal(true); };
  const close = () => { setModal(false); setEditing(null); };
  const save  = () => {
    setDepts(ds => ds.map(d => d.id === editing.id ? { ...form, id: editing.id } : d));
    close();
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Departments</h1>
          <p className="adm-page-header__sub">Edit department hero text, HOD names, and taglines shown on the public site.</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
        {depts.map(d => (
          <div key={d.id} className="adm-card" style={{marginBottom:0}}>
            <div className="adm-card__header">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:"1.4rem"}}>{d.icon}</span>
                <div>
                  <div className="adm-card__title">{d.name}</div>
                  <div style={{fontSize:"0.75rem",color:"var(--adm-muted)",marginTop:2}}>HOD: {d.hod}</div>
                </div>
              </div>
              <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(d)}><FaEdit /> Edit</button>
            </div>
            <div className="adm-card__body">
              <div style={{fontSize:"0.82rem",color:"var(--adm-text)",fontWeight:600,marginBottom:4}}>{d.hero}</div>
              <div style={{fontSize:"0.78rem",color:"var(--adm-muted)",lineHeight:1.6}}>{d.tagline}</div>
              <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid var(--adm-border)",display:"flex",gap:16}}>
                <span style={{fontSize:"0.74rem",color:"var(--adm-muted)"}}><strong style={{color:"var(--adm-blue)"}}>{d.courses}</strong> Courses</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">Edit Department — {editing?.name}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>
            <div className="adm-modal__body" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="adm-field"><label>Department Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
              <div className="adm-field"><label>Head of Department (HOD)</label><input value={form.hod} onChange={e=>setForm(p=>({...p,hod:e.target.value}))}/></div>
              <div className="adm-field"><label>Hero Headline (shown on department page)</label><input value={form.hero} onChange={e=>setForm(p=>({...p,hero:e.target.value}))}/></div>
              <div className="adm-field"><label>Tagline / Subtitle</label><textarea value={form.tagline} rows={3} onChange={e=>setForm(p=>({...p,tagline:e.target.value}))}/></div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}><FaSave /> Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}