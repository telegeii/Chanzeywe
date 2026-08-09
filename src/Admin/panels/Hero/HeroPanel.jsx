import React, { useState, useEffect, useRef } from "react";
import "../../AdminDashboard.css";
import "./HeroPanel.css";
import { apiGet, apiPostForm, apiDelete } from "../../../utils/api";
import {
  FaEdit, FaTimes, FaSave, FaImage,
  FaEye, FaGripVertical,
  FaPlus, FaUserTie, FaQuoteLeft,
  FaLink, FaUpload, FaTrash, FaCamera, FaExclamationCircle,
} from "react-icons/fa";

const BLANK_SLIDE = { eyebrow:"", headline:"", subtitle:"", ctaLabel:"Learn More", ctaLink:"/", active:true, image:null, imageFile:null };
const BLANK_PRINCIPAL = { name:"", title:"", greeting:"Karibu", message:"", photo:null, photoFile:null };

/* ─────────────────────────────────────────
   IMAGE UPLOAD ZONE (reusable)
───────────────────────────────────────── */
function ImageUploadZone({ value, onPick, onRemove, label, hint }) {
  const ref = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    onPick(file);
  };

  return (
    <div className="hp-img-zone-wrap">
      {label && <label className="hp-img-zone-label">{label}</label>}
      {value ? (
        <div className="hp-img-preview-wrap">
          <img src={value} alt="Uploaded" className="hp-img-preview" />
          <button className="hp-img-remove" onClick={onRemove} title="Remove image">
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
   SINGLE-SLIDE STATIC PREVIEW
   Shows exactly one slide — whichever the admin last clicked in the
   grid — instead of auto-cycling through all of them. Simpler to read
   and matches how the homepage renders any one given slide.
───────────────────────────────────────── */
function SinglePreview({ slide }) {
  if (!slide) return (
    <div className="hp-preview-empty"><FaImage /><p>No slides yet — add one to see a preview.</p></div>
  );

  return (
    <div
      className="hp-preview"
      style={slide.image ? { backgroundImage:`url(${slide.image})`, backgroundSize:"cover", backgroundPosition:"center" } : {}}
    >
      <div className="hp-preview__overlay" />
      <div className="hp-preview__content">
        {slide.eyebrow && <span className="hp-preview__eyebrow">{slide.eyebrow}</span>}
        <h2 className="hp-preview__title">{slide.headline || "Untitled slide"}</h2>
        {slide.subtitle && <p className="hp-preview__sub">{slide.subtitle}</p>}
        {slide.ctaLabel && <div className="hp-preview__cta">{slide.ctaLabel}</div>}
      </div>
      {!slide.active && <span className="hp-preview__hidden-flag">Hidden from homepage</span>}
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
  const [slides,       setSlides]       = useState([]);
  const [slidesLoading,setSlidesLoading]= useState(true);
  const [slidesError,  setSlidesError]  = useState("");

  const [principal,        setPrincipal]        = useState(BLANK_PRINCIPAL);
  const [principalLoading, setPrincipalLoading] = useState(true);

  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(BLANK_SLIDE);
  const [formError, setFormError] = useState("");
  const [saving,    setSaving]    = useState(false);

  const [previewId, setPreviewId] = useState(null);
  const [dragId,    setDragId]    = useState(null);
  const [overId,    setOverId]    = useState(null);

  const [tab,       setTab]       = useState("slider");
  const [pSaved,    setPSaved]    = useState(false);
  const [pSaving,   setPSaving]   = useState(false);
  const [pError,    setPError]    = useState("");
  const photoRef                  = useRef(null);

  useEffect(() => {
    apiGet("/hero.php")
      .then(setSlides)
      .catch(err => setSlidesError(err.message))
      .finally(() => setSlidesLoading(false));
    apiGet("/principal.php")
      .then(p => setPrincipal({ ...p, photoFile: null }))
      .catch(() => {})
      .finally(() => setPrincipalLoading(false));
  }, []);

  const openSlide = (s=null) => { setEditing(s); setForm(s?{...s,imageFile:null}:{...BLANK_SLIDE}); setFormError(""); setModal(true); };
  const close     = () => { setModal(false); setEditing(null); };

  const saveSlide = async () => {
    if (!form.headline) { setFormError("Headline is required"); return; }
    setSaving(true);
    setFormError("");
    try {
      const fd = new FormData();
      if (editing) fd.append("id", editing.id);
      fd.append("eyebrow", form.eyebrow || "");
      fd.append("headline", form.headline);
      fd.append("subtitle", form.subtitle || "");
      fd.append("ctaLabel", form.ctaLabel || "");
      fd.append("ctaLink", form.ctaLink || "");
      fd.append("active", form.active ? "1" : "0");
      if (form.imageFile) fd.append("image", form.imageFile);
      else if (editing && !form.image) fd.append("removeImage", "1");

      const saved = await apiPostForm("/hero.php", fd);
      setSlides(ss => editing
        ? ss.map(s => s.id === saved.id ? saved : s)
        : [...ss, saved]);
      close();
    } catch (err) {
      setFormError(err.message || "Could not save this slide.");
    } finally {
      setSaving(false);
    }
  };

  const delSlide = async (id) => {
    if (!window.confirm("Delete this slide? This can't be undone.")) return;
    try {
      await apiDelete("/hero.php", id);
      setSlides(ss => ss.filter(s => s.id !== id));
    } catch (err) {
      setSlidesError(err.message);
    }
  };

  const toggleSlide = async (id) => {
    const s = slides.find(x => x.id === id);
    const fd = new FormData();
    fd.append("id", id);
    fd.append("active", s.active ? "0" : "1");
    try {
      const updated = await apiPostForm("/hero.php", fd);
      setSlides(ss => ss.map(x => x.id === id ? updated : x));
    } catch (err) {
      setSlidesError(err.message);
    }
  };

  // Persists a full reordering (from drag-and-drop) by writing a new
  // sortOrder to every slide whose position actually changed.
  const reorderSlides = async (newOrder) => {
    const prevSlides = slides;
    setSlides(newOrder.map((s, i) => ({ ...s, sortOrder: i + 1 })));

    const toUpdate = newOrder
      .map((s, i) => ({ id: s.id, oldOrder: s.sortOrder, pos: i + 1 }))
      .filter(x => x.oldOrder !== x.pos);
    if (!toUpdate.length) return;

    try {
      const updated = await Promise.all(toUpdate.map(({ id, pos }) => {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("sortOrder", pos);
        return apiPostForm("/hero.php", fd);
      }));
      setSlides(ss => {
        const byId = new Map(updated.map(u => [u.id, u]));
        return ss.map(s => byId.get(s.id) || s).sort((a, b) => a.sortOrder - b.sortOrder);
      });
    } catch (err) {
      setSlides(prevSlides);
      setSlidesError(err.message || "Could not save the new slide order.");
    }
  };

  const handleDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  };
  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id !== overId) setOverId(id);
  };
  const handleDragLeave = () => setOverId(null);
  const handleDragEnd   = () => { setDragId(null); setOverId(null); };
  const handleDrop = (e, dropId) => {
    e.preventDefault();
    setOverId(null);
    if (dragId == null || dragId === dropId) { setDragId(null); return; }
    const from = slides.findIndex(s => s.id === dragId);
    const to   = slides.findIndex(s => s.id === dropId);
    setDragId(null);
    if (from === -1 || to === -1) return;
    const next = [...slides];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    reorderSlides(next);
  };

  const handlePrincipalPhoto = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPrincipal(p => ({ ...p, photo: URL.createObjectURL(file), photoFile: file }));
  };

  const savePrincipal = async () => {
    setPSaving(true);
    setPError("");
    try {
      const fd = new FormData();
      fd.append("name", principal.name || "");
      fd.append("title", principal.title || "");
      fd.append("greeting", principal.greeting || "");
      fd.append("message", principal.message || "");
      if (principal.photoFile) fd.append("photo", principal.photoFile);
      else if (!principal.photo) fd.append("removePhoto", "1");

      const saved = await apiPostForm("/principal.php", fd);
      setPrincipal({ ...saved, photoFile: null });
      setPSaved(true);
      setTimeout(()=>setPSaved(false),2200);
    } catch (err) {
      setPError(err.message || "Could not save the principal's section.");
    } finally {
      setPSaving(false);
    }
  };

  const activeCount = slides.filter(s=>s.active).length;
  const previewSlide = slides.find(s => s.id === previewId) || slides.find(s => s.active) || slides[0] || null;
  const previewIndex = previewSlide ? slides.findIndex(s => s.id === previewSlide.id) : -1;

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

            {slidesLoading && <div className="hp-empty"><FaImage/><p>Loading slides…</p></div>}
            {slidesError && <div className="hp-empty" style={{color:"#b91c1c"}}><FaExclamationCircle/><p>{slidesError}</p></div>}

            {!slidesLoading && !slidesError && slides.length > 1 && (
              <p className="hp-drag-hint"><FaGripVertical/> Drag a card to reorder it — click a card to preview it on the right.</p>
            )}

            {!slidesLoading && !slidesError && slides.length > 0 && (
              <div className="hp-grid">
                {slides.map((s,i) => (
                  <div
                    key={s.id}
                    className={`hp-card${!s.active?" hp-card--inactive":""}${previewSlide?.id===s.id?" hp-card--selected":""}${dragId===s.id?" hp-card--dragging":""}${overId===s.id&&dragId!==s.id?" hp-card--over":""}`}
                    draggable
                    onDragStart={e=>handleDragStart(e,s.id)}
                    onDragOver={e=>handleDragOver(e,s.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={e=>handleDrop(e,s.id)}
                    onDragEnd={handleDragEnd}
                    onClick={()=>setPreviewId(s.id)}
                  >
                    <div className="hp-card__drag" title="Drag to reorder" onClick={e=>e.stopPropagation()}>
                      <FaGripVertical/>
                    </div>

                    <div className="hp-card__thumb">
                      {s.image
                        ? <img src={s.image} alt="slide" className="hp-card__thumb-img"/>
                        : <div className="hp-card__thumb-empty"><FaImage/></div>
                      }
                      <span className="hp-card__num">{i+1}</span>
                      {!s.active && <span className="hp-card__hidden-badge">Hidden</span>}
                    </div>

                    <div className="hp-card__body">
                      {s.eyebrow && <span className="hp-card__eyebrow">{s.eyebrow}</span>}
                      <h3 className="hp-card__headline">{s.headline}</h3>
                      {s.subtitle && <p className="hp-card__sub">{s.subtitle}</p>}
                      {s.ctaLabel && (
                        <div className="hp-card__cta">
                          <FaLink style={{fontSize:"0.6rem",opacity:0.45}}/>
                          <span className="hp-card__cta-label">{s.ctaLabel}</span>
                        </div>
                      )}
                    </div>

                    <div className="hp-card__footer" onClick={e=>e.stopPropagation()}>
                      <label className="hp-toggle hp-toggle--sm" title={s.active?"Visible on homepage":"Hidden from homepage"}>
                        <input type="checkbox" checked={s.active} onChange={()=>toggleSlide(s.id)}/>
                        <span className="hp-toggle__track"><span className="hp-toggle__thumb"/></span>
                      </label>
                      <div className="hp-card__actions">
                        <button className="hp-icon-btn hp-icon-btn--edit" onClick={()=>openSlide(s)} title="Edit"><FaEdit/></button>
                        <button className="hp-icon-btn hp-icon-btn--del"  onClick={()=>delSlide(s.id)} title="Delete"><FaTrash/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!slidesLoading && !slidesError && slides.length===0 && (
              <div className="hp-empty"><FaImage/><p>No slides yet. Click "Add Slide" to get started.</p></div>
            )}
          </div>

          {/* Preview */}
          <div className="hp-preview-col">
            <div className="hp-preview-col__title"><FaEye style={{opacity:0.5}}/> Slide Preview</div>
            <SinglePreview slide={previewSlide}/>
            {previewSlide && (
              <div className="hp-preview-note">
                Previewing <strong>slide {previewIndex+1}</strong> of {slides.length}
                {!previewSlide.active && " · hidden from the homepage"}
              </div>
            )}
            {!previewSlide && (
              <div className="hp-preview-note"><strong>{activeCount}</strong> of {slides.length} slides active</div>
            )}
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
                <button className="adm-btn adm-btn--primary" onClick={savePrincipal} disabled={pSaving || principalLoading}>
                  <FaSave/> {pSaving ? "Saving…" : pSaved?"Saved ✓":"Save Changes"}
                </button>
              </div>
              <div className="adm-card__body">
                <div style={{display:"flex",flexDirection:"column",gap:16}}>

                  {pError && (
                    <div className="hp-empty" style={{color:"#b91c1c", padding:"10px 14px"}}>
                      <FaExclamationCircle/><p style={{margin:0}}>{pError}</p>
                    </div>
                  )}

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
                          <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={()=>setPrincipal(p=>({...p,photo:null,photoFile:null}))}>
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

                  <div className="adm-form-grid--1">
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

                {formError && (
                  <div className="hp-empty" style={{color:"#b91c1c", padding:"10px 14px"}}>
                    <FaExclamationCircle/><p style={{margin:0}}>{formError}</p>
                  </div>
                )}

                {/* Image upload */}
                <ImageUploadZone
                  value={form.image}
                  onPick={file=>setForm(p=>({...p,image:URL.createObjectURL(file),imageFile:file}))}
                  onRemove={()=>setForm(p=>({...p,image:null,imageFile:null}))}
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
              <button className="adm-btn adm-btn--primary" onClick={saveSlide} disabled={saving}>
                <FaSave/> {saving ? "Saving…" : editing?"Save Changes":"Add Slide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
