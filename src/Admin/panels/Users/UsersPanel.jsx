import React, { useState, useEffect } from "react";
import "../../AdminDashboard.css";
import "./UsersPanel.css";
import { apiGet, apiPost, apiPut, apiDelete } from "../../../utils/api";
import PasswordField from "../../components/PasswordField";
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaUserShield,
  FaUser, FaLock, FaLockOpen, FaExclamationCircle, FaUsersCog,
  FaCheckCircle, FaBan,
} from "react-icons/fa";

const MODULE_LABELS = {
  hero:         "Hero & Principal",
  courses:      "Courses",
  departments:  "Departments",
  blog:         "Blog & News",
  applications: "Applications",
  tenders:      "Tenders",
  careers:      "Careers",
  downloads:    "Downloads",
};
const ALL_MODULES = Object.keys(MODULE_LABELS);

const BLANK = { username: "", password: "", role: "staff", permissions: [] };

const fmtDate = (ts) => (ts ? new Date(ts).toLocaleString("en-KE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never");

export default function UsersPanel() {
  const [users,      setUsers]      = useState([]);
  const [me,         setMe]         = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [listError,  setListError]  = useState("");
  const [modal,      setModal]      = useState(false);
  const [editing,    setEditing]    = useState(null);
  const [form,       setForm]       = useState(BLANK);
  const [formError,  setFormError]  = useState("");
  const [saving,     setSaving]     = useState(false);
  const [rowBusyId,  setRowBusyId]  = useState(null);

  useEffect(() => {
    Promise.all([apiGet("/users.php"), apiGet("/auth/me.php")])
      .then(([list, myself]) => { setUsers(list); setMe(myself); })
      .catch(err => setListError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const open = (u = null) => {
    setEditing(u);
    setForm(u ? { username: u.username, password: "", role: u.role, permissions: u.permissions } : { ...BLANK });
    setFormError("");
    setModal(true);
  };
  const close = () => { setModal(false); setEditing(null); };

  const togglePerm = (mod) => {
    setForm(p => ({
      ...p,
      permissions: p.permissions.includes(mod) ? p.permissions.filter(m => m !== mod) : [...p.permissions, mod],
    }));
  };

  const save = async () => {
    if (!form.username.trim()) { setFormError("Username is required"); return; }
    if (!editing && form.password.length < 8) { setFormError("Password must be at least 8 characters"); return; }
    if (editing && form.password && form.password.length < 8) { setFormError("New password must be at least 8 characters"); return; }

    setSaving(true);
    setFormError("");
    try {
      if (editing) {
        const body = { username: form.username, role: form.role, permissions: form.permissions };
        if (form.password) body.newPassword = form.password;
        const saved = await apiPut("/users.php", editing.id, body);
        setUsers(us => us.map(u => u.id === saved.id ? saved : u));
      } else {
        const saved = await apiPost("/users.php", {
          username: form.username, password: form.password, role: form.role, permissions: form.permissions,
        });
        setUsers(us => [...us, saved]);
      }
      close();
    } catch (err) {
      setFormError(err.message || "Could not save this user.");
    } finally {
      setSaving(false);
    }
  };

  const del = async (u) => {
    if (!window.confirm(`Delete the account "${u.username}"? This can't be undone.`)) return;
    setRowBusyId(u.id);
    try {
      await apiDelete("/users.php", u.id);
      setUsers(us => us.filter(x => x.id !== u.id));
    } catch (err) {
      setListError(err.message);
    } finally {
      setRowBusyId(null);
    }
  };

  const toggleBlocked = async (u) => {
    setRowBusyId(u.id);
    try {
      const saved = await apiPut("/users.php", u.id, { blocked: !u.blocked });
      setUsers(us => us.map(x => x.id === u.id ? saved : x));
    } catch (err) {
      setListError(err.message);
    } finally {
      setRowBusyId(null);
    }
  };

  return (
    <div className="up-root">

      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">Admin Users</h1>
          <p className="adm-page-header__sub">
            {users.length} account{users.length !== 1 ? "s" : ""} &nbsp;·&nbsp; delegate specific sections to staff logins
          </p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => open()}>
          <FaPlus style={{ fontSize: "0.72rem" }} /> Add User
        </button>
      </div>

      {listError && (
        <div className="up-empty" style={{ color: "#b91c1c" }}><FaExclamationCircle /><p>{listError}</p></div>
      )}

      {loading ? (
        <div className="up-empty"><FaUsersCog /><p>Loading users…</p></div>
      ) : (
        <div className="adm-card">
          <div className="adm-table-wrap">
            <table className="adm-table up-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const isSelf = me && u.id === me.id;
                  return (
                    <tr key={u.id} style={{ opacity: u.blocked ? 0.65 : 1 }}>
                      <td>
                        <div className="up-user-cell">
                          <span className="up-avatar">{u.username.charAt(0).toUpperCase()}</span>
                          <span style={{ fontWeight: 600 }}>{u.username}{isSelf && <span className="up-you"> (you)</span>}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`adm-pill ${u.role === "super_admin" ? "adm-pill--purple" : "adm-pill--blue"}`}>
                          {u.role === "super_admin" ? <><FaUserShield style={{ fontSize: "0.65rem" }} /> Super Admin</> : <><FaUser style={{ fontSize: "0.65rem" }} /> Staff</>}
                        </span>
                      </td>
                      <td>
                        <div className="up-perm-row">
                          {u.role === "super_admin" ? (
                            <span className="up-perm-chip up-perm-chip--all">All sections</span>
                          ) : u.permissions.length === 0 ? (
                            <span className="up-perm-chip up-perm-chip--none">No access yet</span>
                          ) : (
                            u.permissions.map(m => <span key={m} className="up-perm-chip">{MODULE_LABELS[m] || m}</span>)
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`adm-pill ${u.blocked ? "adm-pill--red" : "adm-pill--green"}`}>
                          {u.blocked ? <><FaBan style={{ fontSize: "0.6rem" }} /> Blocked</> : <><FaCheckCircle style={{ fontSize: "0.6rem" }} /> Active</>}
                        </span>
                        {u.blocked && u.failedAttempts > 0 && (
                          <span className="up-attempts"> {u.failedAttempts}/5 failed attempts</span>
                        )}
                      </td>
                      <td style={{ color: "var(--adm-muted)", fontSize: "0.78rem" }}>{fmtDate(u.lastLogin)}</td>
                      <td>
                        <div className="adm-actions">
                          <button
                            className="adm-btn adm-btn--ghost adm-btn--sm"
                            onClick={() => toggleBlocked(u)}
                            disabled={rowBusyId === u.id || isSelf}
                            title={isSelf ? "You cannot block your own account" : u.blocked ? "Unblock this account" : "Block this account"}
                          >
                            {u.blocked ? <FaLockOpen /> : <FaLock />}
                          </button>
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => open(u)}><FaEdit /></button>
                          <button
                            className="adm-btn adm-btn--danger adm-btn--sm"
                            onClick={() => del(u)}
                            disabled={rowBusyId === u.id || isSelf}
                            title={isSelf ? "You cannot delete your own account" : "Delete"}
                          >
                            <FaTrash />
                          </button>
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

      {/* ══════════ MODAL ══════════ */}
      {modal && (
        <div className="adm-modal-overlay" onClick={close}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal__header">
              <span className="adm-modal__title">{editing ? `Edit "${editing.username}"` : "Add New User"}</span>
              <button className="adm-modal__close" onClick={close}><FaTimes /></button>
            </div>

            <div className="adm-modal__body">
              {formError && (
                <div className="up-empty" style={{ color: "#b91c1c", padding: "10px 14px", marginBottom: 12 }}>
                  <FaExclamationCircle /><p style={{ margin: 0 }}>{formError}</p>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="adm-form-grid">
                  <div className="adm-field">
                    <label>Username</label>
                    <input value={form.username} placeholder="e.g. jane.blog" onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
                  </div>
                  <div className="adm-field">
                    <label>{editing ? "New Password" : "Password"} {editing && <span className="up-hint">(leave blank to keep current)</span>}</label>
                    <PasswordField value={form.password} placeholder="••••••••" onChange={e => setForm(p => ({ ...p, password: e.target.value }))} autoComplete="new-password" />
                  </div>
                </div>

                <div className="adm-field">
                  <label>Role</label>
                  <div className="up-role-toggle">
                    <button
                      type="button"
                      className={`up-role-btn${form.role === "staff" ? " up-role-btn--active" : ""}`}
                      onClick={() => setForm(p => ({ ...p, role: "staff" }))}
                    >
                      <FaUser /> Staff — limited to chosen sections
                    </button>
                    <button
                      type="button"
                      className={`up-role-btn${form.role === "super_admin" ? " up-role-btn--active" : ""}`}
                      onClick={() => setForm(p => ({ ...p, role: "super_admin" }))}
                    >
                      <FaUserShield /> Super Admin — full access
                    </button>
                  </div>
                </div>

                {form.role === "staff" && (
                  <div className="adm-field">
                    <label>Sections this user can manage</label>
                    <div className="up-perm-picker">
                      {ALL_MODULES.map(m => (
                        <button
                          key={m}
                          type="button"
                          className={`up-perm-btn${form.permissions.includes(m) ? " up-perm-btn--active" : ""}`}
                          onClick={() => togglePerm(m)}
                        >
                          {MODULE_LABELS[m]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={close}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save} disabled={saving}>
                <FaSave /> {saving ? "Saving…" : editing ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
