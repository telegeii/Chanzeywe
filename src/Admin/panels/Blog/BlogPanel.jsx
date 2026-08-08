import React, { useState, useEffect } from "react";
import "../../AdminDashboard.css"
import "./BlogPanel.css";
import { apiGet, apiPostForm, apiDelete } from "../../../utils/api";
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave,
  FaEye, FaEyeSlash, FaUpload, FaCalendarAlt,
  FaMapMarkerAlt, FaNewspaper, FaThLarge, FaList,
  FaSearch, FaExclamationCircle,
} from "react-icons/fa";

const fmt = d =>
  new Date(d).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });

const CATS = ["Announcements", "Admissions", "News", "Infrastructure", "Events", "Academic"];

const CAT_COLOR = {
  Announcements: "blue",
  Admissions:    "green",
  News:          "amber",
  Infrastructure:"purple",
  Events:        "teal",
  Academic:      "blue",
};

const BLANK = {
  title: "", category: "News", author: "Admin",
  date: new Date().toISOString().split("T")[0],
  location: "Vihiga, Kenya",
  published: false,
  image: null, imageFile: null,
  excerpt: "", body: "",
};

export default function BlogPanel() {
  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [listError,  setListError]  = useState("");
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(BLANK);
  const [formError,  setFormError]  = useState("");
  const [saving,     setSaving]     = useState(false);
  const [view,       setView]       = useState("grid");
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("");

  useEffect(() => {
    apiGet("/blog.php?all=1")
      .then(setPosts)
      .catch(err => setListError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const open  = (p = null) => { setEditing(p); setForm(p ? { ...p, imageFile: null } : { ...BLANK }); setFormError(""); setModal(true); };
  const close = () => { setModal(false); setEditing(null); };

  const save = async () => {
    if (!form.title) { setFormError("Post title is required"); return; }
    setSaving(true);
    setFormError("");
    try {
      const fd = new FormData();
      if (editing) fd.append("id", editing.id);
      fd.append("title", form.title);
      fd.append("category", form.category);
      fd.append("author", form.author || "");
      fd.append("date", form.date);
      fd.append("location", form.location || "");
      fd.append("excerpt", form.excerpt || "");
      fd.append("body", form.body || "");
      fd.append("published", form.published ? "1" : "0");
      if (form.imageFile) fd.append("image", form.imageFile);
      else if (editing && !form.image) fd.append("removeImage", "1");

      const saved = await apiPostForm("/blog.php", fd);
      setPosts(ps => editing ? ps.map(p => p.id === saved.id ? saved : p) : [saved, ...ps]);
      close();
    } catch (err) {
      setFormError(err.message || "Could not save this post.");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    try {
      await apiDelete("/blog.php", id);
      setPosts(ps => ps.filter(p => p.id !== id));
    } catch (err) {
      setListError(err.message);
    }
  };

  const toggle = async (id) => {
    const p = posts.find(x => x.id === id);
    try {
      const updated = await apiPostForm("/blog.php", (() => {
        const fd = new FormData();
        fd.append("id", id);
        fd.append("published", p.published ? "0" : "1");
        return fd;
      })());
      setPosts(ps => ps.map(x => x.id === id ? updated : x));
    } catch (err) {
      setListError(err.message);
    }
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, image: URL.createObjectURL(file), imageFile: file }));
  };

  const filtered = posts.filter(p =>
    (!catFilter || p.category === catFilter) &&
    (!search    || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  const published = posts.filter(p => p.published).length;
  const drafts    = posts.length - published;

  return (
    <div className="bp-root">

      {/* ── Page header ── */}
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Blog &amp; News</h1>
          <p className="adm-page-header__sub">
            {published} published &nbsp;·&nbsp; {drafts} draft{drafts !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => open()}>
          <FaPlus style={{ fontSize: "0.72rem" }} /> New Post
        </button>
      </div>

      {listError && (
        <div className="bp-empty" style={{ color: "#b91c1c" }}><FaExclamationCircle /><p>{listError}</p></div>
      )}

      {/* ── Category chips ── */}
      <div className="bp-chips">
        <button
          className={`bp-chip bp-chip--all ${!catFilter ? "bp-chip--active-all" : ""}`}
          onClick={() => setCatFilter("")}
        >
          All <span className="bp-chip__count">{posts.length}</span>
        </button>
        {CATS.map(c => {
          const count = posts.filter(p => p.category === c).length;
          if (!count) return null;
          return (
            <button
              key={c}
              className={`bp-chip bp-chip--${CAT_COLOR[c]} ${catFilter === c ? "bp-chip--active" : ""}`}
              onClick={() => setCatFilter(catFilter === c ? "" : c)}
            >
              {c} <span className="bp-chip__count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Toolbar ── */}
      <div className="bp-toolbar">
        <div className="bp-search">
          <FaSearch className="bp-search__icon" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts…" />
        </div>
        <div className="bp-view-toggle">
          <button className={`bp-view-btn${view === "grid" ? " bp-view-btn--active" : ""}`} onClick={() => setView("grid")} title="Card view"><FaThLarge /></button>
          <button className={`bp-view-btn${view === "list" ? " bp-view-btn--active" : ""}`} onClick={() => setView("list")} title="List view"><FaList /></button>
        </div>
      </div>

      {loading && <div className="bp-empty"><FaNewspaper /><p>Loading posts…</p></div>}

      {/* ── GRID ── */}
      {!loading && view === "grid" && (
        <div className="bp-grid">
          {filtered.length === 0 && (
            <div className="bp-empty"><FaNewspaper /><p>No posts found.</p></div>
          )}
          {filtered.map(p => (
            <div key={p.id} className={`bp-card${!p.published ? " bp-card--draft" : ""}`}>
              <div className="bp-card__img">
                {p.image
                  ? <img src={p.image} alt={p.title} />
                  : <div className="bp-card__no-img"><FaNewspaper /></div>
                }
                <span className={`bp-card__cat bp-cat--${CAT_COLOR[p.category]}`}>{p.category}</span>
                <span className={`bp-card__badge${p.published ? " bp-card__badge--pub" : " bp-card__badge--draft"}`}>
                  {p.published ? "● Published" : "○ Draft"}
                </span>
              </div>
              <div className="bp-card__body">
                <h3>{p.title}</h3>
                <p className="bp-card__excerpt">{p.excerpt}</p>
                <div className="bp-card__meta">
                  <span><FaCalendarAlt /> {fmt(p.date)}</span>
                  <span><FaMapMarkerAlt /> {p.location}</span>
                </div>
              </div>
              <div className="bp-card__footer">
                <span className="bp-card__author">By {p.author}</span>
                <div className="bp-card__actions">
                  <button className={`bp-icon-btn${p.published ? " bp-icon-btn--eye" : " bp-icon-btn--eye-off"}`} onClick={() => toggle(p.id)} title={p.published ? "Unpublish" : "Publish"}>
                    {p.published ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button className="bp-icon-btn bp-icon-btn--edit" onClick={() => open(p)} title="Edit"><FaEdit /></button>
                  <button className="bp-icon-btn bp-icon-btn--del"  onClick={() => del(p.id)} title="Delete"><FaTrash /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── LIST ── */}
      {!loading && view === "list" && (
        <div className="adm-card">
          <div className="adm-card__header">
            <span className="adm-card__title">All Posts ({filtered.length})</span>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Cover</th><th>Title</th><th>Category</th>
                  <th>Location</th><th>Author</th><th>Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="bp-thumb">
                        {p.image
                          ? <img src={p.image} alt="" />
                          : <div className="bp-thumb__empty"><FaNewspaper /></div>
                        }
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 220 }}>{p.title}</td>
                    <td><span className={`adm-pill adm-pill--${CAT_COLOR[p.category]}`}>{p.category}</span></td>
                    <td style={{ color: "var(--adm-muted)", fontSize: "0.8rem" }}>{p.location}</td>
                    <td style={{ color: "var(--adm-muted)", fontSize: "0.8rem" }}>{p.author}</td>
                    <td style={{ color: "var(--adm-muted)", fontSize: "0.8rem" }}>{fmt(p.date)}</td>
                    <td><span className={`adm-pill ${p.published ? "adm-pill--green" : "adm-pill--red"}`}>{p.published ? "Published" : "Draft"}</span></td>
                    <td>
                      <div className="adm-actions">
                        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => toggle(p.id)}>{p.published ? <FaEyeSlash /> : <FaEye />}</button>
                        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(p)}><FaEdit /></button>
                        <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => del(p.id)}><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════ MODAL ══════════ */}
      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal adm-modal--lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{editing ? "Edit Post" : "New Blog Post"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>

            <div className="adm-modal__body">

              {formError && (
                <div className="bp-empty" style={{ color: "#b91c1c", padding: "10px 14px" }}>
                  <FaExclamationCircle /><p style={{ margin: 0 }}>{formError}</p>
                </div>
              )}

              {/* Image upload */}
              <div className="bp-upload">
                {form.image ? (
                  <div className="bp-upload__preview">
                    <img src={form.image} alt="Cover preview" />
                    <button className="bp-upload__remove" onClick={() => setForm(p => ({ ...p, image: null, imageFile: null }))}><FaTimes /></button>
                    <label className="bp-upload__change">
                      <FaUpload /> Change Image
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />
                    </label>
                  </div>
                ) : (
                  <label className="bp-upload__zone">
                    <FaUpload className="bp-upload__icon" />
                    <span className="bp-upload__title">Upload Cover Image</span>
                    <span className="bp-upload__hint">Click to browse · JPG, PNG · 1200 × 630px recommended</span>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImage} />
                  </label>
                )}
              </div>

              <div className="bp-modal-fields">
                <div className="adm-field">
                  <label>Post Title</label>
                  <input value={form.title} placeholder="Enter a compelling headline…" onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                </div>

                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="adm-field">
                    <label>Author</label>
                    <input value={form.author} placeholder="Author name" onChange={e => setForm(p => ({ ...p, author: e.target.value }))} />
                  </div>
                </div>

                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label><FaCalendarAlt style={{ marginRight: 6, opacity: 0.6 }} />Publish Date</label>
                    <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div className="adm-field">
                    <label><FaMapMarkerAlt style={{ marginRight: 6, opacity: 0.6 }} />Location</label>
                    <input value={form.location} placeholder="e.g. Vihiga, Kenya" onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                  </div>
                </div>

                <div className="adm-field">
                  <label>Excerpt / Summary <span className="bp-hint">(shown on blog listing)</span></label>
                  <textarea value={form.excerpt} rows={3} placeholder="Short summary…" onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} />
                </div>

                <div className="adm-field">
                  <label>Full Post Content</label>
                  <textarea value={form.body} rows={8} placeholder="Write the full article here…" onChange={e => setForm(p => ({ ...p, body: e.target.value }))} />
                </div>

                {/* Publish toggle */}
                <div className="bp-pub-row">
                  <label className="bp-toggle">
                    <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} />
                    <span className="bp-toggle__track"><span className="bp-toggle__thumb" /></span>
                  </label>
                  <div>
                    <span className="bp-pub-row__label">{form.published ? "Publish immediately" : "Save as draft"}</span>
                    <span className="bp-pub-row__hint">{form.published ? "This post will be visible to the public." : "Only admins can see this post."}</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save} disabled={saving}>
                <FaSave /> {saving ? "Saving…" : form.published ? "Publish Post" : "Save Draft"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
