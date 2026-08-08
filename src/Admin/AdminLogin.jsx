import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { FaUserShield, FaLock, FaUser, FaExclamationCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { apiPost } from "../utils/api";
import useSeo from "../utils/useSeo";

export default function AdminLogin() {
  useSeo({ title: "Staff Login", noIndex: true });

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [busy,     setBusy]     = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Enter both username and password.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await apiPost("/auth/login.php", { username, password });
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adl-page">
      <form className="adl-card" onSubmit={submit}>
        <div className="adl-icon"><FaUserShield /></div>
        <h1 className="adl-title">Staff Portal</h1>
        <p className="adl-sub">Chanzeywe Vocational Training College</p>

        {error && (
          <div className="adl-error">
            <FaExclamationCircle /> {error}
          </div>
        )}

        <div className="adl-field">
          <label>Username</label>
          <div className="adl-input-wrap">
            <FaUser className="adl-input-icon" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
            />
          </div>
        </div>

        <div className="adl-field">
          <label>Password</label>
          <div className="adl-input-wrap">
            <FaLock className="adl-input-icon" />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="adl-pw-toggle"
              onClick={() => setShowPw(s => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPw ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="adl-submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
