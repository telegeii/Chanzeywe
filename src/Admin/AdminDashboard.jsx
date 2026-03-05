import React, { useState } from "react";
import "./AdminDashboard.css";
import CoursesPanel     from "./panels/CoursesPanel";
import TendersPanel     from "./panels/TendersPanel";
import CareersPanel     from "./panels/CareersPanel";
import DownloadsPanel   from "./panels/DownloadsPanel";
import BlogPanel        from "./panels/BlogPanel";
import DepartmentsPanel from "./panels/DepartmentsPanel";
import HeroPanel        from "./panels/HeroPanel";
import OverviewPanel    from "./panels/OverviewPanel";

import {
  FaTachometerAlt, FaBook, FaFileContract, FaBriefcase,
  FaDownload, FaNewspaper, FaBuilding, FaImage,
  FaBars, FaTimes, FaSignOutAlt, FaBell, FaUserCircle,
  FaChevronRight,
} from "react-icons/fa";

const NAV = [
  { id: "overview",     label: "Overview",      icon: <FaTachometerAlt /> },
  { id: "hero",         label: "Hero / Slider",  icon: <FaImage /> },
  { id: "courses",      label: "Courses",        icon: <FaBook /> },
  { id: "departments",  label: "Departments",    icon: <FaBuilding /> },
  { id: "tenders",      label: "Tenders",        icon: <FaFileContract /> },
  { id: "careers",      label: "Careers",        icon: <FaBriefcase /> },
  { id: "downloads",    label: "Downloads",      icon: <FaDownload /> },
  { id: "blog",         label: "Blog / News",    icon: <FaNewspaper /> },
];

const PANEL = {
  overview:    <OverviewPanel />,
  hero:        <HeroPanel />,
  courses:     <CoursesPanel />,
  departments: <DepartmentsPanel />,
  tenders:     <TendersPanel />,
  careers:     <CareersPanel />,
  downloads:   <DownloadsPanel />,
  blog:        <BlogPanel />,
};

export default function AdminDashboard() {
  const [active,   setActive]   = useState("overview");
  const [sideOpen, setSideOpen] = useState(true);
  const [notifs,   setNotifs]   = useState(3);

  const current = NAV.find(n => n.id === active);

  return (
    <div className={`adm-root${sideOpen ? "" : " adm-root--collapsed"}`}>

      {/* ── Sidebar ── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar__brand">
          <div className="adm-sidebar__logo">C</div>
          {sideOpen && (
            <div className="adm-sidebar__brand-text">
              <span className="adm-sidebar__brand-name">Chanzeywe</span>
              <span className="adm-sidebar__brand-sub">Admin Portal</span>
            </div>
          )}
        </div>

        <nav className="adm-sidebar__nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`adm-nav-item${active === n.id ? " adm-nav-item--active" : ""}`}
              onClick={() => setActive(n.id)}
              title={!sideOpen ? n.label : undefined}
            >
              <span className="adm-nav-item__icon">{n.icon}</span>
              {sideOpen && <span className="adm-nav-item__label">{n.label}</span>}
              {sideOpen && active === n.id && (
                <FaChevronRight className="adm-nav-item__arrow" />
              )}
            </button>
          ))}
        </nav>

        <button className="adm-sidebar__logout" title="Logout">
          <FaSignOutAlt />
          {sideOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* ── Main area ── */}
      <div className="adm-main">

        {/* Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar__left">
            <button className="adm-topbar__toggle" onClick={() => setSideOpen(s => !s)}>
              {sideOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="adm-topbar__breadcrumb">
              <span>Admin</span>
              <FaChevronRight style={{ fontSize: "0.55rem", opacity: 0.4 }} />
              <span className="adm-topbar__page">{current?.label}</span>
            </div>
          </div>

          <div className="adm-topbar__right">
            <button className="adm-topbar__icon-btn" title="Notifications">
              <FaBell />
              {notifs > 0 && <span className="adm-badge">{notifs}</span>}
            </button>
            <div className="adm-topbar__user">
              <FaUserCircle />
              <span>Administrator</span>
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