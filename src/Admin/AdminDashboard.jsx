import React, { useState } from "react";
import "./AdminDashboard.css";
import CoursesPanel      from "../Admin/panels/Course/CoursesPanel";
import TendersPanel      from "./panels/Tender/TendersPanel";
import CareersPanel      from "./panels/Career/CareersPanel";
import DownloadsPanel    from "./panels/Downloads/DownloadsPanel";
import BlogPanel         from "./panels/Blog/BlogPanel";
import DepartmentsPanel  from "./panels/Department/DepartmentsPanel";
import HeroPanel         from "./panels/Hero/HeroPanel";
import OverviewPanel     from "./panels/Overview/OverviewPanel";
import CorruptionPanel   from "./panels/Corruption/CorruptionPanel";
import ApplicationsPanel from "./panels/Application/ApplicationPanel";

import {
  FaTachometerAlt, FaBook, FaFileContract, FaBriefcase,
  FaDownload, FaNewspaper, FaBuilding, FaImage,
  FaBars, FaTimes, FaSignOutAlt,
  FaChevronRight, FaClipboardList, FaShieldAlt,
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
  { id:"corruption",   label:"Corruption Reports", icon:<FaShieldAlt />     },
  
];


/* ─────────────────────────────────────────
   PLACEHOLDER — for panels not built yet
───────────────────────────────────────── */
function PlaceholderPanel({ title, icon, color }) {
  return (
    <div className="adm-placeholder">
      <div className="adm-placeholder__icon" style={{ background:`${color}12`, color }}>
        {icon}
      </div>
      <h2 className="adm-placeholder__title">{title}</h2>
      <p className="adm-placeholder__hint">
        Create{" "}
        <code className="adm-placeholder__code">
          {title.replace(/ /g,"")}Panel.jsx
        </code>{" "}
        and import it here to replace this placeholder.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   PANEL MAP
───────────────────────────────────────── */
const PANEL = {
  overview:     <OverviewPanel />,
  hero:         <HeroPanel />,
  courses:      <CoursesPanel />,
  departments:  <DepartmentsPanel />,
  tenders:      <TendersPanel />,
  careers:      <CareersPanel />,
  downloads:    <DownloadsPanel />,
  blog:         <BlogPanel />,
  applications: <ApplicationsPanel />,
  corruption:   <CorruptionPanel />,
};

/* ═══════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════ */
export default function AdminDashboard() {
  const [active,   setActive]   = useState("overview");
  const [sideOpen, setSideOpen] = useState(true);

  const current = NAV.find(n => n.id === active);

  return (
    <div className={`adm-root${sideOpen ? "" : " adm-root--collapsed"}`}>

      {/* ══ SIDEBAR ══ */}
      <aside className="adm-sidebar">

        {/* Brand */}
        <div className="adm-sidebar__brand">
          <div className="adm-sidebar__logo">C</div>
          <div className="adm-sidebar__brand-text">
            <span className="adm-sidebar__brand-name">Chanzeywe TVC</span>
            <span className="adm-sidebar__brand-sub">Admin Portal</span>
          </div>
        </div>

        {/* Navigation — completely static, no scroll */}
        <nav className="adm-sidebar__nav">
          {NAV.map(n => {

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
            const isActive = active === n.id;
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
        <button className="adm-sidebar__logout">
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
              <span className="adm-topbar__page">{current?.label}</span>
            </div>
          </div>

          <div className="adm-topbar__right">
            <div className="adm-topbar__user">
              <div className="adm-topbar__user-avatar">A</div>
              <span className="adm-topbar__user-name">Administrator</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="adm-content">
          {PANEL[active]}
        </main>

      </div>
    </div>
  );
}