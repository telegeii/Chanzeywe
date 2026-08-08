import React, { useState, useEffect } from "react";
import "../../AdminDashboard.css";
import "./AccountPanel.css";
import { apiGet, apiPost } from "../../../utils/api";
import PasswordField from "../../components/PasswordField";
import {
  FaUserCircle, FaLock, FaSave, FaCheckCircle,
  FaExclamationCircle, FaUserShield, FaUser,
} from "react-icons/fa";

export default function AccountPanel() {
  const [me,      setMe]      = useState(null);
  const [form,    setForm]    = useState({ currentPassword: "", newUsername: "", newPassword: "", confirmPassword: "" });
  const [error,   setError]   = useState("");
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    apiGet("/auth/me.php").then((admin) => {
      setMe(admin);
      setForm(f => ({ ...f, newUsername: admin.username }));
    }).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);

    if (!form.currentPassword) { setError("Enter your current password to confirm changes."); return; }
    if (form.newPassword && form.newPassword !== form.confirmPassword) { setError("New password and confirmation don't match."); return; }
    if (form.newPassword && form.newPassword.length < 8) { setError("New password must be at least 8 characters."); return; }

    const usernameChanged = me && form.newUsername.trim() !== me.username;
    if (!usernameChanged && !form.newPassword) { setError("Change your username or set a new password before saving."); return; }

    setSaving(true);
    try {
      const body = { currentPassword: form.currentPassword };
      if (usernameChanged) body.newUsername = form.newUsername.trim();
      if (form.newPassword) body.newPassword = form.newPassword;

      const updated = await apiPost("/account.php", body);
      setMe(updated);
      setForm({ currentPassword: "", newUsername: updated.username, newPassword: "", confirmPassword: "" });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Could not update your account.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="acp-root">
      <div className="adm-page-header">
        <div>
          <h1 className="adm-page-header__title">My Account</h1>
          <p className="adm-page-header__sub">Update your own login username and password.</p>
        </div>
      </div>

      <div className="acp-card adm-card">
        {me && (
          <div className="acp-identity">
            <div className="acp-identity__avatar"><FaUserCircle /></div>
            <div>
              <span className="acp-identity__name">{me.username}</span>
              <span className={`adm-pill ${me.role === "super_admin" ? "adm-pill--purple" : "adm-pill--blue"}`} style={{ marginTop: 4 }}>
                {me.role === "super_admin" ? <><FaUserShield style={{ fontSize: "0.65rem" }} /> Super Admin</> : <><FaUser style={{ fontSize: "0.65rem" }} /> Staff</>}
              </span>
            </div>
          </div>
        )}

        <form className="acp-form" onSubmit={submit}>
          {error && (
            <div className="acp-msg acp-msg--error"><FaExclamationCircle /> {error}</div>
          )}
          {saved && (
            <div className="acp-msg acp-msg--ok"><FaCheckCircle /> Account updated successfully.</div>
          )}

          <div className="adm-field">
            <label>Username</label>
            <input value={form.newUsername} onChange={e => setForm(f => ({ ...f, newUsername: e.target.value }))} />
          </div>

          <div className="acp-divider" />

          <div className="adm-form-grid">
            <div className="adm-field">
              <label>New Password <span className="acp-hint">(leave blank to keep current)</span></label>
              <PasswordField value={form.newPassword} placeholder="••••••••" onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} autoComplete="new-password" />
            </div>
            <div className="adm-field">
              <label>Confirm New Password</label>
              <PasswordField value={form.confirmPassword} placeholder="••••••••" onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} autoComplete="new-password" />
            </div>
          </div>

          <div className="acp-divider" />

          <div className="adm-field">
            <label><FaLock style={{ marginRight: 6, opacity: 0.6 }} />Current Password <span className="acp-hint">(required to confirm any change)</span></label>
            <PasswordField value={form.currentPassword} placeholder="••••••••" onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} autoComplete="current-password" />
          </div>

          <button type="submit" className="adm-btn adm-btn--primary" disabled={saving} style={{ alignSelf: "flex-start" }}>
            <FaSave /> {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
