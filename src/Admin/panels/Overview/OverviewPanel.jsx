import React, { useState, useEffect } from "react";
import "../../AdminDashboard.css";
import "./OverviewPanel.css";
import { apiGet } from "../../../utils/api";

import {
  FaFileContract, FaBriefcase,
  FaNewspaper, FaClipboardList,
  FaClock,
} from "react-icons/fa";

const isOpen = (d) => new Date(d) >= new Date();

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const displayName = (username) =>
  username ? username.charAt(0).toUpperCase() + username.slice(1) : "Administrator";

/* Every module this panel can show a stat card for, and how to compute it.
   Only shown to admins who actually hold that permission — a staff login
   scoped to just "blog" has no business seeing tender/vacancy counts. */
const STAT_DEFS = [
  {
    module: "tenders", label: "Active Tenders", icon: <FaFileContract />,
    color: "#16a34a", bg: "rgba(22,163,74,0.1)", trend: "Currently open",
    load: (data) => data.filter(t => isOpen(t.closeDate)).length,
  },
  {
    module: "careers", label: "Open Vacancies", icon: <FaBriefcase />,
    color: "#d97706", bg: "rgba(217,119,6,0.1)", trend: "Currently open",
    load: (data) => data.filter(c => isOpen(c.closeDate)).length,
  },
  {
    module: "blog", label: "Blog Posts", icon: <FaNewspaper />,
    color: "#0891b2", bg: "rgba(8,145,178,0.1)",
    load: (data) => data.length,
    trendFor: (data) => `${data.filter(p => p.published).length} published`,
  },
  {
    module: "applications", label: "Applications", icon: <FaClipboardList />,
    color: "#db2777", bg: "rgba(219,39,119,0.1)",
    load: (data) => data.length,
    trendFor: (data) => `${data.filter(a => a.status === "pending").length} pending`,
  },
];

const ENDPOINT = {
  tenders: "/tenders.php",
  careers: "/careers.php",
  blog: "/blog.php?all=1",
  applications: "/applications.php",
};

/* ══ OVERVIEW PANEL ════════════════════ */
export default function OverviewPanel({ admin }) {
  const [values, setValues] = useState(null);

  const isSuperAdmin = admin?.role === "super_admin";
  const perms = admin?.permissions || [];
  const permsKey = perms.join(",");
  const stats = STAT_DEFS.filter(s => isSuperAdmin || perms.includes(s.module));

  useEffect(() => {
    const mods = STAT_DEFS.filter(s => isSuperAdmin || permsKey.split(",").includes(s.module)).map(s => s.module);

    // allSettled, not all — one module the admin can't see (or a transient
    // error) shouldn't blank out every other stat card. Resolves to []
    // immediately (still async) when mods is empty, so this stays a
    // single code path instead of an early synchronous setState.
    Promise.allSettled(mods.map(m => apiGet(ENDPOINT[m])))
      .then(results => {
        const next = {};
        results.forEach((r, i) => { next[mods[i]] = r.status === "fulfilled" ? r.value : []; });
        setValues(next);
      });
  }, [isSuperAdmin, permsKey]);

  const appsCount = values?.applications?.length ?? null;

  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });

  return (
    <div className="ovp">

      {/* ── Welcome banner ── */}
      <div className="ovp-banner">
        {/* Decorative orbs */}
        <div className="ovp-banner__orb ovp-banner__orb--1" />
        <div className="ovp-banner__orb ovp-banner__orb--2" />
        <div className="ovp-banner__orb ovp-banner__orb--3" />

        <div className="ovp-banner__left">
          <div className="ovp-banner__eyebrow">
            <span className="ovp-banner__pulse" />
            Chanzeywe TVC — Staff Portal
          </div>
          <h1 className="ovp-banner__title">{getGreeting()}, {displayName(admin?.username)} 👋</h1>
          <p className="ovp-banner__date">
            <FaClock style={{ opacity: 0.55, fontSize: "0.75rem" }} />
            {today}
          </p>
        </div>

        {/* Quick-count chip — only for admins who can see applications */}
        {(isSuperAdmin || perms.includes("applications")) && (
          <div className="ovp-banner__chips">
            <div className="ovp-banner__chip">
              <div className="ovp-banner__chip-icon">
                <FaClipboardList />
              </div>
              <div>
                <span className="ovp-banner__chip-val">{appsCount === null ? "…" : appsCount}</span>
                <span className="ovp-banner__chip-label">Applications</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Stat cards ── */}
      {stats.length === 0 ? (
        <div className="ovp-empty">
          <p>You don't have access to any section stats yet — ask your super admin to assign you a section.</p>
        </div>
      ) : (
        <div className="ovp-stat-grid">
          {stats.map((s, i) => {
            const data = values?.[s.module];
            const value = data ? s.load(data) : null;
            const trend = data ? (s.trendFor ? s.trendFor(data) : s.trend) : " ";
            return (
              <div
                key={i}
                className="ovp-stat"
                style={{ "--sc": s.color, "--sb": s.bg }}
              >
                <div className="ovp-stat__top-bar" />
                <div className="ovp-stat__icon">{s.icon}</div>
                <div className="ovp-stat__value">{value === null ? "…" : value}</div>
                <div className="ovp-stat__label">{s.label}</div>
                <div className="ovp-stat__hint">{trend}</div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
