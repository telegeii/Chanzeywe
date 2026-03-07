import React, { useState, useEffect, useRef } from "react";
import "../../AdminDashboard.css";
import "./HeroPanel.css";
import {
  FaEdit, FaTimes, FaSave, FaImage,
  FaArrowUp, FaArrowDown, FaEye, FaEyeSlash,
  FaPlus, FaUserTie, FaQuoteLeft, FaStar,
  FaLink, FaChevronLeft, FaChevronRight,
  FaUpload, FaTrash, FaCamera,
} from "react-icons/fa";

/* ── Seed data ─────────────────────────── */
const INIT_SLIDES = [
  { id:1, eyebrow:"Welcome to Chanzeywe TVC",  headline:"Skills to Transform Livelihoods",    subtitle:"Join Chanzeywe TVC — Quality CDACC-accredited vocational training.",       ctaLabel:"Explore Courses",  ctaLink:"/courses",     active:true, image:null },
  { id:2, eyebrow:"CDACC Accredited",           headline:"Nationally Recognised Programmes",   subtitle:"Certificates, diplomas and artisan programmes across 6 departments.",       ctaLabel:"View Departments", ctaLink:"/departments",  active:true, image:null },
  { id:3, eyebrow:"Intakes Now Open",           headline:"January 2026 Intake Now Open",       subtitle:"Secure your place early. Applications open for January, May & September.", ctaLabel:"Apply Now",        ctaLink:"/apply",        active:true, image:null },
];

const INIT_PRINCIPAL = {
  name:     "Mr. Gilbert G. Mwavali",
  title:    "Principal / Secretary – B.O.G",
  since:    "Since 2020",
  greeting: "Karibu",
  message:  "A heartfelt welcome to the digital home of Chanzeywe Institute. We are committed to academic excellence, innovation, and the development of skilled professionals ready to thrive in the modern technological world.",
  photo:    null,
};

const BLANK_SLIDE = { eyebrow:"", headline:"", subtitle:"", ctaLabel:"Learn More", ctaLink:"/", active:true, image:null };

/* ─────────────────────────────────────────
   IMAGE UPLOAD ZONE (reusable)
───────────────────────────────────────── */
function ImageUploadZone({ value, onChange, label, hint }) {
  const ref = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="hp-img-zone-wrap">
      {label && <label className="hp-img-zone-label">{label}</label>}
      {value ? (
        <div className="hp-img-preview-wrap">
          <img src={value} alt="Uploaded" className="hp-img-preview" />
          <button className="hp-img-remove" onClick={() => onChange(null)} title="Remove image">
            <FaTrash />
          </button>
          <button className="hp-img-change" onClick={() => ref.current?.click()} title="Change image">
            <FaCamera /> Change
          </button>
        </div>
      ) : (
        <div
          className="hp-img-zone"
          onClick={() => ref.current?.click()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={e => e.preventDefault()}
        >
          <FaUpload className="hp-img-zone__icon" />
          <span className="hp-img-zone__title">Click or drag & drop to upload</span>
          {hint && <span className="hp-img-zone__hint">{hint}</span>}
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}

/* ─────────────────────────────────────────
   MINI LIVE SLIDER PREVIEW
───────────────────────────────────────── */
function SliderPreview({ slides }) {
  const active = slides.filter(s => s.active);
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);

  useEffect(() => { setIdx(0); }, [active.length]);

  useEffect(() => {
    if (active.length < 2) return;
    timer.current = setInterval(() => setIdx(i => (i + 1) % active.length), 3000);
    return () => clearInterval(timer.current);
  }, [active.length]);

  if (!active.length) return (
    <div className="hp-preview-empty"><FaImage /><p>No active slides — enable at least one to preview.</p></div>
  );

  const s = active[Math.min(idx, active.length - 1)];

  return (
    <div
      className="hp-preview"
      style={s.image ? { backgroundImage:`url(${s.image})`, backgroundSize:"cover", backgroundPosition:"center" } : {}}
    >
      <div className="hp-preview__overlay" />
      <div className="hp-preview__content">
        {s.eyebrow && <span className="hp-preview__eyebrow">{s.eyebrow}</span>}
        <h2 className="hp-preview__title">{s.headline}</h2>
        {s.subtitle && <p className="hp-preview__sub">{s.subtitle}</p>}
        {s.ctaLabel && <div className="hp-preview__cta">{s.ctaLabel}</div>}
      </div>
      {active.length > 1 && (
        <div className="hp-preview__dots">
          {active.map((_, i) => (
            <button key={i} className={`hp-preview__dot${i===idx?" hp-preview__dot--active":""}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
      {active.length > 1 && <>
        <button className="hp-preview__arrow hp-preview__arrow--l" onClick={() => setIdx(i => (i-1+active.length)%active.length)}><FaChevronLeft /></button>
        <button className="hp-preview__arrow hp-preview__arrow--r" onClick={() => setIdx(i => (i+1)%active.length)}><FaChevronRight /></button>
      </>}
      <div className="hp-preview__progress" key={idx}><div className="hp-preview__progress-bar" /></div>
      <span className="hp-preview__label">Live Preview</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   PRINCIPAL SECTION PREVIEW
───────────────────────────────────────── */
function PrincipalPreview({ p }) {
  return (
    <div className="hp-prin-preview">
      <div className="hp-prin-preview__blob hp-prin-preview__blob--1" />
      <div className="hp-prin-preview__blob hp-prin-preview__blob--2" />
      <div className="hp-prin-preview__inner">
        <div className="hp-prin-preview__photo">
          <div className="hp-prin-preview__photo-frame">
            {p.photo
              ? <img src={p.photo} alt="Principal" className="hp-prin-preview__photo-img" />
              : <FaUserTie className="hp-prin-preview__photo-icon" />
            }
          </div>
          <div className="hp-prin-preview__badge"><FaStar style={{fontSize:"0.6rem"}}/><span>{p.since}</span></div>
        </div>
        <div className="hp-prin-preview__msg">
          <div className="hp-prin-preview__label">
            <span className="hp-prin-preview__label-line"/>
            <span>Principal's Message</span>
          </div>
          <FaQuoteLeft className="hp-prin-preview__quote-icon"/>
          <blockquote className="hp-prin-preview__quote">{p.message}</blockquote>
          <div className="hp-prin-preview__divider"/>
          <p className="hp-prin-preview__karibu">~ {p.greeting}</p>
          <h3 className="hp-prin-preview__name">{p.name}</h3>
          <span className="hp-prin-preview__title-text">{p.title}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PANEL
═══════════════════════════════════════════ */
export default function HeroPanel() {
  const [slides,    setSlides]    = useState(INIT_SLIDES);
  const [principal, setPrincipal] = useState(INIT_PRINCIPAL);
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(BLANK_SLIDE);
  const [tab,       setTab]       = useState("slider");
  const [pSaved,    setPSaved]    = useState(false);
  const photoRef                  = useRef(null);

  const openSlide = (s=null) => { setEditing(s); setForm(s?{...s}:{...BLANK_SLIDE}); setModal(true); };
  const close     = () => { setModal(false); setEditing(null); };

  const saveSlide = () => {
    if (!form.headline) return;
    if (editing) setSlides(ss => ss.map(s => s.id===editing.id ? {...form,id:editing.id} : s));
    else         setSlides(ss => [...ss, {...form, id:Date.now()}]);
    close();
  };

  const delSlide    = id  => setSlides(ss => ss.filter(s => s.id!==id));
  const toggleSlide = id  => setSlides(ss => ss.map(s => s.id===id ? {...s,active:!s.active} : s));
  const moveSlide   = (id, dir) => {
    const i = slides.findIndex(s => s.id===id);
    if ((dir===-1&&i===0)||(dir===1&&i===slides.length-1)) return;
    const ns=[...slides]; [ns[i],ns[i+dir]]=[ns[i+dir],ns[i]]; setSlides(ns);
  };

  const handlePrincipalPhoto = (file) => {
    if (!file||!file.type.startsWith("image/")) return;
    const r=new FileReader(); r.onload=e=>setPrincipal(p=>({...p,photo:e.target.result})); r.readAsDataURL(file);
  };

  const savePrincipal = () => { setPSaved(true); setTimeout(()=>setPSaved(false),2200); };
  const activeCount   = slides.filter(s=>s.active).length;

  return (
    <div className="hp-root">

      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Hero &amp; Principal</h1>
          <p className="adm-page-header__sub">Manage homepage slider slides and the Principal's message section.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="hp-tabs">
        <button className={`hp-tab${tab==="slider"?" hp-tab--active":""}`} onClick={()=>setTab("slider")}>
          <FaImage /> Slider / Hero <span className="hp-tab__pill">{activeCount} active</span>
        </button>
        <button className={`hp-tab${tab==="principal"?" hp-tab--active":""}`} onClick={()=>setTab("principal")}>
          <FaUserTie /> Principal's Message
        </button>
      </div>

      {/* ══ SLIDER TAB ══ */}
      {tab==="slider" && (
        <div className="hp-slider-layout">
          <div className="hp-slides-col">
            <div className="hp-slides-header">
              <span className="hp-slides-header__title">
                Slides <span className="hp-slides-header__count">{slides.length}</span>
              </span>
              <button className="adm-btn adm-btn--primary" onClick={()=>openSlide()}>
                <FaPlus style={{fontSize:"0.7rem"}}/> Add Slide
              </button>
            </div>

            {slides.map((s,i) => (
              <div key={s.id} className={`hp-slide-card${!s.active?" hp-slide-card--inactive":""}`}>
                {/* Thumbnail */}
                <div className="hp-slide-card__thumb">
                  {s.image
                    ? <img src={s.image} alt="slide" className="hp-slide-card__thumb-img"/>
                    : <div className="hp-slide-card__thumb-empty"><FaImage/></div>
                  }
                  <span className="hp-slide-card__num">{i+1}</span>
                </div>
                {/* Body */}
                <div className="hp-slide-card__body">
                  {s.eyebrow && <span className="hp-slide-card__eyebrow">{s.eyebrow}</span>}
                  <h3 className="hp-slide-card__headline">{s.headline}</h3>
                  {s.subtitle && <p className="hp-slide-card__sub">{s.subtitle}</p>}
                  <div className="hp-slide-card__cta">
                    <FaLink style={{fontSize:"0.62rem",opacity:0.45}}/>
                    <span className="hp-slide-card__cta-label">{s.ctaLabel}</span>
                    <span className="hp-slide-card__cta-link">{s.ctaLink}</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="hp-slide-card__actions">
                  <button className="hp-icon-btn hp-icon-btn--move" onClick={()=>moveSlide(s.id,-1)} disabled={i===0} title="Move up"><FaArrowUp/></button>
                  <button className="hp-icon-btn hp-icon-btn--move" onClick={()=>moveSlide(s.id,1)}  disabled={i===slides.length-1} title="Move down"><FaArrowDown/></button>
                  <button className={`hp-icon-btn ${s.active?"hp-icon-btn--eye":"hp-icon-btn--eye-off"}`} onClick={()=>toggleSlide(s.id)} title={s.active?"Hide":"Show"}>
                    {s.active?<FaEye/>:<FaEyeSlash/>}
                  </button>
                  <button className="hp-icon-btn hp-icon-btn--edit" onClick={()=>openSlide(s)} title="Edit"><FaEdit/></button>
                  <button className="hp-icon-btn hp-icon-btn--del"  onClick={()=>delSlide(s.id)} title="Delete"><FaTrash/></button>
                </div>
                {!s.active && <span className="hp-slide-card__hidden-badge">Hidden</span>}
              </div>
            ))}

            {slides.length===0 && (
              <div className="hp-empty"><FaImage/><p>No slides yet. Click "Add Slide" to get started.</p></div>
            )}
          </div>

          {/* Preview */}
          <div className="hp-preview-col">
            <div className="hp-preview-col__title"><FaEye style={{opacity:0.5}}/> Homepage Preview</div>
            <SliderPreview slides={slides}/>
            <div className="hp-preview-note"><strong>{activeCount}</strong> of {slides.length} slides active · Auto-advances every 6s</div>
          </div>
        </div>
      )}

      {/* ══ PRINCIPAL TAB ══ */}
      {tab==="principal" && (
        <div className="hp-principal-layout">
          <div className="hp-prin-form-col">
            <div className="adm-card">
              <div className="adm-card__header">
                <span className="adm-card__title">Principal's Section</span>
                <button className="adm-btn adm-btn--primary" onClick={savePrincipal}>
                  <FaSave/> {pSaved?"Saved ✓":"Save Changes"}
                </button>
              </div>
              <div className="adm-card__body">
                <div style={{display:"flex",flexDirection:"column",gap:16}}>

                  {/* Photo upload */}
                  <div className="hp-principal-photo-section">
                    <label className="hp-img-zone-label">
                      <FaCamera style={{marginRight:6,opacity:0.55}}/> Principal's Profile Photo
                    </label>
                    <div className="hp-principal-photo-row">
                      <div className="hp-principal-photo-frame">
                        {principal.photo
                          ? <img src={principal.photo} alt="Principal" className="hp-principal-photo-img"/>
                          : <FaUserTie className="hp-principal-photo-placeholder"/>
                        }
                      </div>
                      <div className="hp-principal-photo-btns">
                        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={()=>photoRef.current?.click()}>
                          <FaUpload/> {principal.photo?"Change Photo":"Upload Photo"}
                        </button>
                        {principal.photo && (
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={()=>setPrincipal(p=>({...p,photo:null}))}>
                            <FaTrash/> Remove
                          </button>
                        )}
                        <span className="hp-field-hint-block">JPG or PNG · Recommended square (400×400px+)</span>
                      </div>
                      <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePrincipalPhoto(e.target.files[0])}/>
                    </div>
                  </div>

                  <div className="adm-divider"/>

                  <div className="adm-form-grid">
                    <div className="adm-field">
                      <label>Principal's Full Name</label>
                      <input value={principal.name} placeholder="e.g. Mr. Gilbert G. Mwavali" onChange={e=>setPrincipal(p=>({...p,name:e.target.value}))}/>
                    </div>
                    <div className="adm-field">
                      <label>Title / Position</label>
                      <input value={principal.title} placeholder="e.g. Principal / Secretary – B.O.G" onChange={e=>setPrincipal(p=>({...p,title:e.target.value}))}/>
                    </div>
                  </div>

                  <div className="adm-form-grid">
                    <div className="adm-field">
                      <label>Since (badge text)</label>
                      <input value={principal.since} placeholder="e.g. Since 2020" onChange={e=>setPrincipal(p=>({...p,since:e.target.value}))}/>
                    </div>
                    <div className="adm-field">
                      <label>Greeting Word</label>
                      <input value={principal.greeting} placeholder="e.g. Karibu" onChange={e=>setPrincipal(p=>({...p,greeting:e.target.value}))}/>
                    </div>
                  </div>

                  <div className="adm-field">
                    <label>Welcome Message</label>
                    <textarea value={principal.message} rows={6} placeholder="Principal's welcome message…" onChange={e=>setPrincipal(p=>({...p,message:e.target.value}))}/>
                    <span className="hp-field-hint-block">Appears as a blockquote on the homepage principal section.</span>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="hp-prin-preview-col">
            <div className="hp-preview-col__title"><FaEye style={{opacity:0.5}}/> Section Preview</div>
            <PrincipalPreview p={principal}/>
          </div>
        </div>
      )}

      {/* ══ SLIDE MODAL ══ */}
      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal adm-modal--lg" onClick={e=>e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{editing?"Edit Slide":"Add New Slide"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes/></button>
            </div>

            {/* Live mini preview */}
            <div className="hp-modal-preview" style={form.image?{backgroundImage:`url(${form.image})`,backgroundSize:"cover",backgroundPosition:"center"}:{}}>
              <div className="hp-modal-preview__overlay"/>
              <div className="hp-modal-preview__content">
                {form.eyebrow && <span className="hp-modal-preview__eyebrow">{form.eyebrow}</span>}
                <div className="hp-modal-preview__title">{form.headline||"Headline will appear here…"}</div>
                {form.subtitle && <div className="hp-modal-preview__sub">{form.subtitle}</div>}
                {form.ctaLabel && <div className="hp-modal-preview__cta">{form.ctaLabel}</div>}
              </div>
            </div>

            <div className="adm-modal__body">
              <div style={{display:"flex",flexDirection:"column",gap:14}}>

                {/* Image upload */}
                <ImageUploadZone
                  value={form.image}
                  onChange={img=>setForm(p=>({...p,image:img}))}
                  label="Slide Background Image"
                  hint="Recommended 1920×1080px JPG or PNG — used as full-width slide background."
                />

                <div className="adm-divider" style={{margin:"2px 0"}}/>

                <div className="adm-field">
                  <label>Eyebrow Text <span className="hp-field-hint">(small text above headline)</span></label>
                  <input value={form.eyebrow} placeholder="e.g. Welcome to Chanzeywe TVC" onChange={e=>setForm(p=>({...p,eyebrow:e.target.value}))}/>
                </div>

                <div className="adm-field">
                  <label>Headline <span style={{color:"#dc2626",fontSize:"0.75rem"}}>*</span></label>
                  <input value={form.headline} placeholder="Main bold slide title" onChange={e=>setForm(p=>({...p,headline:e.target.value}))}/>
                </div>

                <div className="adm-field">
                  <label>Subtitle / Subtext</label>
                  <textarea value={form.subtitle} rows={2} placeholder="Supporting text below the headline" onChange={e=>setForm(p=>({...p,subtitle:e.target.value}))}/>
                </div>

                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>CTA Button Label</label>
                    <input value={form.ctaLabel} placeholder="e.g. Apply Now" onChange={e=>setForm(p=>({...p,ctaLabel:e.target.value}))}/>
                  </div>
                  <div className="adm-field">
                    <label>CTA Link</label>
                    <input value={form.ctaLink} placeholder="e.g. /courses" onChange={e=>setForm(p=>({...p,ctaLink:e.target.value}))}/>
                  </div>
                </div>

                <div className="hp-active-row">
                  <label className="hp-toggle">
                    <input type="checkbox" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))}/>
                    <span className="hp-toggle__track"><span className="hp-toggle__thumb"/></span>
                  </label>
                  <div>
                    <span className="hp-active-row__label">{form.active?"Slide is Active":"Slide is Hidden"}</span>
                    <span className="hp-active-row__hint">{form.active?"This slide will appear in the homepage carousel.":"This slide is hidden from the public."}</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={saveSlide}>
                <FaSave/> {editing?"Save Changes":"Add Slide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}