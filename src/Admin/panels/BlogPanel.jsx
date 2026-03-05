import React, { useState } from "react";
import "../AdminDashboard.css";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";

const fmt = d => new Date(d).toLocaleDateString("en-KE",{day:"2-digit",month:"short",year:"numeric"});

const INIT = [
  { id:1, title:"CDACC Accreditation Renewal 2025",     category:"Announcements", author:"Admin", date:"2025-12-01", published:true,  excerpt:"Chanzeywe TVC successfully renewed its CDACC accreditation for all programmes..." },
  { id:2, title:"January 2026 Intake Now Open",          category:"Admissions",    author:"Admin", date:"2025-11-20", published:true,  excerpt:"Applications are now open for January 2026 intake. Students are encouraged to apply early..." },
  { id:3, title:"Students Excel in CDACC Examinations",  category:"News",          author:"Admin", date:"2025-10-15", published:true,  excerpt:"Chanzeywe TVC students recorded an impressive pass rate in the latest CDACC examinations..." },
  { id:4, title:"New Computer Lab Commissioned",          category:"Infrastructure",author:"Admin", date:"2025-09-05", published:false, excerpt:"The college has commissioned a state-of-the-art computer lab..." },
];

const CATS = ["Announcements","Admissions","News","Infrastructure","Events","Academic"];
const BLANK = { title:"", category:"News", author:"Admin", date: new Date().toISOString().split("T")[0], published:false, excerpt:"", body:"" };

export default function BlogPanel() {
  const [posts,   setPosts]   = useState(INIT);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(BLANK);

  const open  = (p = null) => { setEditing(p); setForm(p ? { ...p } : { ...BLANK }); setModal(true); };
  const close = () => { setModal(false); setEditing(null); };
  const save  = () => {
    if (!form.title) return;
    if (editing) setPosts(ps => ps.map(p => p.id === editing.id ? { ...form, id: editing.id } : p));
    else         setPosts(ps => [...ps, { ...form, id: Date.now() }]);
    close();
  };
  const del    = id  => setPosts(ps => ps.filter(p => p.id !== id));
  const toggle = id  => setPosts(ps => ps.map(p => p.id === id ? { ...p, published: !p.published } : p));

  const catColor = c => ({ Announcements:"adm-pill--blue", Admissions:"adm-pill--green", News:"adm-pill--amber", Infrastructure:"adm-pill--blue", Events:"adm-pill--green", Academic:"adm-pill--blue" }[c] || "adm-pill--blue");

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Blog &amp; News</h1>
          <p className="adm-page-header__sub">Manage news articles and announcements. {posts.filter(p=>p.published).length} published.</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => open()}><FaPlus style={{fontSize:"0.75rem"}}/> New Post</button>
      </div>

      <div className="adm-card">
        <div className="adm-card__header"><span className="adm-card__title">All Posts ({posts.length})</span></div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {posts.map(p => (
                <tr key={p.id}>
                  <td style={{fontWeight:600,maxWidth:240}}>{p.title}</td>
                  <td><span className={`adm-pill ${catColor(p.category)}`}>{p.category}</span></td>
                  <td style={{color:"var(--adm-muted)",fontSize:"0.8rem"}}>{p.author}</td>
                  <td style={{color:"var(--adm-muted)",fontSize:"0.8rem"}}>{fmt(p.date)}</td>
                  <td><span className={`adm-pill ${p.published ? "adm-pill--green" : "adm-pill--red"}`}>{p.published ? "Published" : "Draft"}</span></td>
                  <td><div className="adm-actions">
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" title={p.published?"Unpublish":"Publish"} onClick={()=>toggle(p.id)}>
                      {p.published ? <FaEyeSlash/> : <FaEye/>}
                    </button>
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(p)}><FaEdit /></button>
                    <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(p.id)}><FaTrash /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{editing ? "Edit Post" : "New Blog Post"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>
            <div className="adm-modal__body" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="adm-field"><label>Post Title</label><input value={form.title} placeholder="Enter a compelling headline…" onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
              <div className="adm-form-grid">
                <div className="adm-field">
                  <label>Category</label>
                  <select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="adm-field"><label>Author</label><input value={form.author} placeholder="Author name" onChange={e=>setForm(p=>({...p,author:e.target.value}))}/></div>
              </div>
              <div className="adm-form-grid">
                <div className="adm-field"><label>Publish Date</label><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div>
                <div className="adm-field" style={{justifyContent:"flex-end"}}>
                  <label>Status</label>
                  <label style={{display:"flex",alignItems:"center",gap:10,marginTop:4,cursor:"pointer",fontSize:"0.85rem"}}>
                    <input type="checkbox" checked={form.published} onChange={e=>setForm(p=>({...p,published:e.target.checked}))} style={{accentColor:"var(--adm-blue)",width:16,height:16}}/>
                    Publish immediately
                  </label>
                </div>
              </div>
              <div className="adm-field"><label>Excerpt / Summary</label><textarea value={form.excerpt} placeholder="Short summary shown on the blog listing page…" rows={3} onChange={e=>setForm(p=>({...p,excerpt:e.target.value}))}/></div>
              <div className="adm-field"><label>Full Post Content</label><textarea value={form.body} placeholder="Write the full article here…" rows={7} onChange={e=>setForm(p=>({...p,body:e.target.value}))}/></div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}><FaSave /> {form.published ? "Publish Post" : "Save Draft"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}