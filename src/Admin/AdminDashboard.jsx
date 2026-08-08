import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { apiGet, apiPost } from "../utils/api";
import useSeo from "../utils/useSeo";
import CoursesPanel      from "../Admin/panels/Course/CoursesPanel";
import TendersPanel      from "./panels/Tender/TendersPanel";
import CareersPanel      from "./panels/Career/CareersPanel";
import DownloadsPanel    from "./panels/Downloads/DownloadsPanel";
import BlogPanel         from "./panels/Blog/BlogPanel";
import DepartmentsPanel  from "./panels/Department/DepartmentsPanel";
import HeroPanel         from "./panels/Hero/HeroPanel";
import OverviewPanel     from "./panels/Overview/OverviewPanel";
import ApplicationsPanel from "./panels/Application/ApplicationPanel";
import UsersPanel        from "./panels/Users/UsersPanel";
import AccountPanel      from "./panels/Account/AccountPanel";

import {
  FaTachometerAlt, FaBook, FaFileContract, FaBriefcase,
  FaDownload, FaNewspaper, FaBuilding, FaImage,
  FaBars, FaTimes, FaSignOutAlt,
  FaChevronRight, FaClipboardList, FaUsersCog, FaUserCog,
  FaUserShield, FaUser,
} from "react-icons/fa";

/* ─────────────────────────────────────────
   NAV CONFIG
───────────────────────────────────────── */
const NAV = [
  { id:"overview",     label:"Overview",           icon:<FaTachometerAlt /> },
  { id:"hero",         label:"Hero / Slider",      icon:<FaImage />         },
    { id:"__s1", label:"Content" },
  { id:"courses",      label:"Courses",            icon:<FaBook />          },
  { id:"departments",  label:"Departments",        icon:<FaBuilding />      },
  { id:"blog",         label:"Blog / News",        icon:<FaNewspaper />     },

  { id:"__s2", label:"Management" },
  { id:"applications", label:"Applications",       icon:<FaClipboardList /> },
  { id:"tenders",      label:"Tenders",            icon:<FaFileContract />  },
  { id:"careers",      label:"Careers",            icon:<FaBriefcase />     },
  { id:"downloads",    label:"Downloads",          icon:<FaDownload />      },

  { id:"__s3", label:"Account" },
  { id:"users",        label:"Admin Users",        icon:<FaUsersCog />      },
  { id:"account",      label:"My Account",         icon:<FaUserCog />       },
];

/* ─────────────────────────────────────────
   PANEL MAP
───────────────────────────────────────── */
/* Built as a function (not a static object) because OverviewPanel needs
   the logged-in admin's username/permissions to scope its greeting and
   stat cards. */
function panelFor(id, admin) {
  switch (id) {
    case "overview":     return <OverviewPanel admin={admin} />;
    case "hero":         return <HeroPanel />;
    case "courses":      return <CoursesPanel />;
    case "departments":  return <DepartmentsPanel />;
    case "tenders":      return <TendersPanel />;
    case "careers":      return <CareersPanel />;
    case "downloads":    return <DownloadsPanel />;
    case "blog":         return <BlogPanel />;
    case "applications": return <ApplicationsPanel />;
    case "users":        return <UsersPanel />;
    case "account":      return <AccountPanel />;
    default:              return null;
  }
}

/**
 * `overview` and `account` are open to any logged-in admin; `users` is
 * super_admin only; every other id must be in the admin's permissions —
 * the server enforces the real boundary (require_permission per endpoint),
 * this just keeps the nav from showing sections a staff login can't use.
 */
function visibleNav(admin) {
  const perms = admin.permissions || [];
  const isSuperAdmin = admin.role === "super_admin";
  const allowed = (id) =>
    id === "overview" || id === "account" || (id === "users" && isSuperAdmin) || perms.includes(id);

  const kept = NAV.filter(n => n.id.startsWith("__s") || allowed(n.id));

  // Drop section headers left with nothing visible under them.
  return kept.filter((n, i) => {
    if (!n.id.startsWith("__s")) return true;
    const next = kept[i + 1];
    return next && !next.id.startsWith("__s");
  });
}

/* ═══════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════ */
export default function AdminDashboard() {
  useSeo({ title: "Staff Portal", noIndex: true });

  const navigate  = useNavigate();
  const [admin,    setAdmin]    = useState(null);
  const [checking, setChecking] = useState(true);
  const [active,   setActive]   = useState("overview");
  const [sideOpen, setSideOpen] = useState(true);

  useEffect(() => {
    apiGet("/auth/me.php")
      .then(setAdmin)
      .catch(() => navigate("/admin/login", { replace: true }))
      .finally(() => setChecking(false));
  }, [navigate]);

  const logout = async () => {
    try { await apiPost("/auth/logout.php", {}); } catch { /* session already gone */ }
    navigate("/admin/login", { replace: true });
  };

  if (checking) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", fontFamily:"'Outfit',sans-serif", color:"#6b7280" }}>
        Loading admin portal…
      </div>
    );
  }
  if (!admin) return null; // redirecting to login

  const nav = visibleNav(admin);
  const current = nav.find(n => n.id === active);
  // If the current tab isn't in this admin's nav (e.g. a staff login that
  // never had "hero"), fall back to Overview instead of a blank panel.
  const activeSafe = current ? active : "overview";

  return (
    <div className={`adm-root${sideOpen ? "" : " adm-root--collapsed"}`}>

      {/* ══ SIDEBAR ══ */}
      <aside className="adm-sidebar">

        {/* Brand */}
        <div className="adm-sidebar__brand">
          <div className="adm-sidebar__logo">C</div>
          <div className="adm-sidebar__brand-text">
            <span className="adm-sidebar__brand-name">Chanzeywe TVC</span>
            <span className="adm-sidebar__brand-sub">Staff Portal</span>
          </div>
        </div>

        {/* Navigation — completely static, no scroll */}
        <nav className="adm-sidebar__nav">
          {nav.map(n => {

            /* Section label row */
            if (n.id.startsWith("__s")) {
              return (
                <div key={n.id} className="adm-nav-section">
                  <span className="adm-nav-section__label">{n.label}</span>
                  <span className="adm-nav-section__line" />
                </div>
              );
            }

            /* Nav button */
            const isActive = activeSafe === n.id;
            return (
              <button
                key={n.id}
                className={`adm-nav-item${isActive ? " adm-nav-item--active" : ""}`}
                onClick={() => setActive(n.id)}
                title={!sideOpen ? n.label : undefined}
              >
                {isActive && <span className="adm-nav-item__bar" />}
                <span className="adm-nav-item__icon">{n.icon}</span>
                <span className="adm-nav-item__label">{n.label}</span>
                {isActive && <FaChevronRight className="adm-nav-item__arrow" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="adm-sidebar__logout" onClick={logout}>
          <FaSignOutAlt />
          <span className="adm-sidebar__logout-label">Logout</span>
        </button>

      </aside>

      {/* ══ MAIN ══ */}
      <div className="adm-main">

        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar__left">
            <button
              className="adm-topbar__toggle"
              onClick={() => setSideOpen(s => !s)}
              aria-label="Toggle sidebar"
            >
              {sideOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="adm-topbar__breadcrumb">
              <span className="adm-topbar__breadcrumb-root">Admin</span>
              <FaChevronRight className="adm-topbar__sep" />
              <span className="adm-topbar__page">{nav.find(n => n.id === activeSafe)?.label}</span>
            </div>
          </div>

          <div className="adm-topbar__right">
            <div className="adm-topbar__user">
              <div className="adm-topbar__user-avatar">{admin.username.charAt(0).toUpperCase()}</div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                <span className="adm-topbar__user-name">{admin.username}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.66rem", fontWeight: 600, color: admin.role === "super_admin" ? "#6d28d9" : "#0a3d8f" }}>
                  {admin.role === "super_admin" ? <><FaUserShield style={{ fontSize: "0.6rem" }} /> Super Admin</> : <><FaUser style={{ fontSize: "0.6rem" }} /> Staff</>}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="adm-content">
          {panelFor(activeSafe, admin)}
        </main>

      </div>
    </div>
  );
}
