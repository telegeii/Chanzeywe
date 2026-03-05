import React, { useState } from "react";
import "../AdminDashboard.css";
import { FaEdit, FaTimes, FaSave, FaImage, FaToggleOn, FaToggleOff, FaArrowUp, FaArrowDown } from "react-icons/fa";

const INIT_SLIDES = [
  { id:1, headline:"Skills to Transform Livelihoods",         subtext:"Join Chanzeywe TVC — Quality CDACC-accredited vocational training.",                       ctaLabel:"Explore Courses",  ctaLink:"/courses",     active:true  },
  { id:2, headline:"CDACC Accredited Programmes",              subtext:"Nationally recognised certificates, diplomas and artisan programmes across 5 departments.", ctaLabel:"View Departments", ctaLink:"/departments",  active:true  },
  { id:3, headline:"January 2026 Intake Now Open",             subtext:"Secure your place early. Applications are open for January, May and September intakes.",    ctaLabel:"Apply Now",        ctaLink:"/apply",        active:true  },
];

const INIT_SITE = {
  collegeName:  "Chanzeywe Vocational Training College",
  tagline:      "Skills to Transform Livelihoods",
  county:       "Vihiga County",
  phone:        "+254 740 932 743",
  email:        "chanzeywetvc@gmail.com",
  website:      "www.chanzeywetvc.ac.ke",
  poBox:        "P.O. BOX 413 – 50310 Vihiga",
  principalMsg: "Welcome to Chanzeywe Vocational Training College, where we are committed to transforming livelihoods through quality skills training.",
};

const BLANK = { headline:"", subtext:"", ctaLabel:"Learn More", ctaLink:"/", active:true };

export default function HeroPanel() {
  const [slides,  setSlides]  = useState(INIT_SLIDES);
  const [site,    setSite]    = useState(INIT_SITE);
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(BLANK);
  const [tab,     setTab]     = useState("slider");
  const [saved,   setSaved]   = useState(false);

  const open  = (s = null) => { setEditing(s); setForm(s ? { ...s } : { ...BLANK }); setModal(true); };
  const close = () => { setModal(false); setEditing(null); };
  const save  = () => {
    if (!form.headline) return;
    if (editing) setSlides(ss => ss.map(s => s.id === editing.id ? { ...form, id: editing.id } : s));
    else         setSlides(ss => [...ss, { ...form, id: Date.now() }]);
    close();
  };
  const del    = id  => setSlides(ss => ss.filter(s => s.id !== id));
  const toggle = id  => setSlides(ss => ss.map(s => s.id === id ? { ...s, active: !s.active } : s));
  const move   = (id, dir) => {
    const i = slides.findIndex(s => s.id === id);
    if ((dir === -1 && i === 0) || (dir === 1 && i === slides.length - 1)) return;
    const ns = [...slides];
    [ns[i], ns[i + dir]] = [ns[i + dir], ns[i]];
    setSlides(ns);
  };

  const saveSite = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Hero &amp; Site Settings</h1>
          <p className="adm-page-header__sub">Edit homepage slider content and global site information.</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{display:"flex",gap:10,marginBottom:24}}>
        {[["slider","Slider / Hero"],["site","Site Information"]].map(([k,l]) => (
          <button key={k} className={`adm-btn ${tab===k?"adm-btn--primary":"adm-btn--ghost"}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {/* ── Slider tab ── */}
      {tab === "slider" && (
        <>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
            <button className="adm-btn adm-btn--primary" onClick={() => open()}><FaImage style={{fontSize:"0.75rem"}}/> Add Slide</button>
          </div>

          {slides.map((s, i) => (
            <div key={s.id} className="adm-card" style={{marginBottom:14,opacity:s.active?1:0.55}}>
              <div className="adm-card__header">
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{background:"var(--adm-bg)",borderRadius:8,padding:"4px 10px",fontSize:"0.72rem",fontWeight:700,color:"var(--adm-muted)"}}>Slide {i+1}</div>
                  <span style={{fontWeight:600,fontSize:"0.9rem",color:"var(--adm-text)"}}>{s.headline}</span>
                </div>
                <div className="adm-actions">
                  <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => move(s.id,-1)}><FaArrowUp/></button>
                  <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => move(s.id, 1)}><FaArrowDown/></button>
                  <button
                    className="adm-btn adm-btn--ghost adm-btn--sm"
                    style={{color: s.active ? "var(--adm-green)" : "var(--adm-muted)"}}
                    onClick={() => toggle(s.id)}
                    title={s.active ? "Deactivate" : "Activate"}
                  >
                    {s.active ? <FaToggleOn style={{fontSize:"1rem"}}/> : <FaToggleOff style={{fontSize:"1rem"}}/>}
                  </button>
                  <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(s)}><FaEdit /></button>
                  <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(s.id)}><FaTimes /></button>
                </div>
              </div>
              <div className="adm-card__body">
                <p style={{fontSize:"0.84rem",color:"var(--adm-muted)",marginBottom:8}}>{s.subtext}</p>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:"0.74rem",fontWeight:600,color:"var(--adm-text)"}}>CTA:</span>
                  <span style={{fontSize:"0.74rem",background:"rgba(10,61,143,0.1)",color:"var(--adm-blue)",padding:"2px 10px",borderRadius:20,fontWeight:600}}>{s.ctaLabel}</span>
                  <span style={{fontSize:"0.74rem",color:"var(--adm-muted)"}}>{s.ctaLink}</span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ── Site info tab ── */}
      {tab === "site" && (
        <div className="adm-card">
          <div className="adm-card__header">
            <span className="adm-card__title">Global Site Information</span>
            <button className="adm-btn adm-btn--primary" onClick={saveSite}>
              <FaSave /> {saved ? "Saved ✓" : "Save Changes"}
            </button>
          </div>
          <div className="adm-card__body">
            <div className="adm-form-grid" style={{gap:16}}>
              {[
                { key:"collegeName", label:"College Name" },
                { key:"tagline",     label:"Tagline" },
                { key:"county",      label:"County" },
                { key:"phone",       label:"Phone Number" },
                { key:"email",       label:"Email Address" },
                { key:"website",     label:"Website URL" },
                { key:"poBox",       label:"P.O. Box / Address" },
              ].map(f => (
                <div key={f.key} className="adm-field">
                  <label>{f.label}</label>
                  <input value={site[f.key]} onChange={e=>setSite(p=>({...p,[f.key]:e.target.value}))}/>
                </div>
              ))}
            </div>
            <div className="adm-field" style={{marginTop:16}}>
              <label>Principal's Welcome Message</label>
              <textarea value={site.principalMsg} rows={5} onChange={e=>setSite(p=>({...p,principalMsg:e.target.value}))}/>
            </div>
          </div>
        </div>
      )}

      {/* Slide Modal */}
      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{editing ? "Edit Slide" : "Add New Slide"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>
            <div className="adm-modal__body" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="adm-field"><label>Headline</label><input value={form.headline} placeholder="Main bold text on the slide" onChange={e=>setForm(p=>({...p,headline:e.target.value}))}/></div>
              <div className="adm-field"><label>Subtext</label><textarea value={form.subtext} rows={3} placeholder="Supporting description below the headline" onChange={e=>setForm(p=>({...p,subtext:e.target.value}))}/></div>
              <div className="adm-form-grid">
                <div className="adm-field"><label>CTA Button Label</label><input value={form.ctaLabel} placeholder="e.g. Apply Now" onChange={e=>setForm(p=>({...p,ctaLabel:e.target.value}))}/></div>
                <div className="adm-field"><label>CTA Link / URL</label><input value={form.ctaLink} placeholder="e.g. /courses" onChange={e=>setForm(p=>({...p,ctaLink:e.target.value}))}/></div>
              </div>
              <label style={{display:"flex",alignItems:"center",gap:10,fontSize:"0.84rem",cursor:"pointer"}}>
                <input type="checkbox" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))} style={{accentColor:"var(--adm-blue)",width:16,height:16}}/>
                Active (show this slide)
              </label>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save}><FaSave /> Save Slide</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}