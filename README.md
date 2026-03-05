# 🎓 Chanzeywe Vocational Training College — Official Website

> **Skills to Transform Livelihoods** — A full-featured, professionally designed institutional website for Chanzeywe Vocational Training College, Vihiga County, Kenya.

---

## 🌐 Live Preview

> _Add your deployment link here once hosted (e.g. Netlify / Vercel / cPanel)_

---

## 📸 Screenshots

> _Add screenshots of the homepage, department pages, and admin dashboard here_

---

## 🧾 About the Project

This is the official web presence for **Chanzeywe Vocational Training College (TVC)**, a CDACC-accredited institution in Vihiga County, Kenya. The site provides prospective students, staff, and the public with access to course information, admission requirements, tenders, career vacancies, downloadable documents, and news updates.

The project also includes a **frontend Admin Dashboard** that allows administrators to manage all public-facing content — courses, tenders, careers, downloads, blog posts, and site settings — without touching code.

---

## ✨ Features

### 🏫 Public Website
- **Homepage** — Animated hero slider, featured programmes, principal's message, partners, and latest news
- **About Page** — College history, vision, mission and core values
- **Courses Page** — Paginated course listings with department filter and level badges
- **Department Pages** — Dedicated pages for each of the 5 departments with admission requirements, programme levels, and course cards
- **Online Application Form** — 3-step validated application form with file uploads (KCSE result slip, certificate, ID)
- **Downloads Page** — Categorised downloadable documents (forms, fee structures, guidelines)
- **Tenders Page** — Live procurement notices with open/closed status
- **Careers Page** — Job vacancy listings with open/closed status
- **Blog / News** — College announcements and news articles
- **Joining Instructions** — Step-by-step guide for new students
- **Report Corruption** — Anonymous corruption reporting form
- **Contact Page** — Location map, contact details and inquiry form
- **College Charter** — Rights and obligations of students and staff

### 🛠️ Admin Dashboard
- **Overview Panel** — Stats across all content types, alerts for expiring posts, activity feed
- **Hero / Slider Manager** — Add, reorder, toggle and edit homepage slides; edit global site info
- **Courses Manager** — Full CRUD for all courses across all departments with search and filter
- **Departments Manager** — Edit HOD names, hero headlines, and taglines per department
- **Tenders Manager** — Post and manage procurement notices with automatic open/closed status
- **Careers Manager** — Post and manage job vacancies with automatic status tracking
- **Downloads Manager** — Upload and manage downloadable PDFs with category tagging
- **Blog Manager** — Write, publish, draft and delete news posts with full content editor

---

## 🗂️ Project Structure

```
src/
├── assets/                   # Images, PDFs, logos
├── components/
│   ├── Navbar/               # Top navigation
│   └── Footer/               # Site footer
├── pages/
│   ├── Home/                 # Homepage with slider
│   ├── About/                # About the college
│   ├── Courses/              # All courses listing
│   ├── Downloads/            # Downloadable documents
│   ├── Instruction/          # Joining instructions
│   ├── Tender/               # Procurement tenders
│   ├── Career/               # Job vacancies
│   ├── Blog/                 # News and announcements
│   ├── Contact/              # Contact page
│   ├── Charter/              # College charter
│   ├── Corruption/           # Report corruption
│   └── ApplicationForm/      # Online application
├── departments/
│   ├── Computing/            # Computing & Informatics
│   ├── Building/             # Building & Civil Engineering
│   ├── Electrical/           # Electrical Engineering
│   ├── Liberal/              # Liberal Studies
│   └── Hospitality/          # Hospitality & Tourism
└── admin/
    ├── AdminDashboard.jsx    # Main dashboard shell
    ├── AdminDashboard.css    # Shared dashboard styles
    └── panels/
        ├── OverviewPanel.jsx
        ├── HeroPanel.jsx
        ├── CoursesPanel.jsx
        ├── DepartmentsPanel.jsx
        ├── TendersPanel.jsx
        ├── CareersPanel.jsx
        ├── DownloadsPanel.jsx
        └── BlogPanel.jsx
```

---

## 🎨 Design System

The entire site uses a consistent design language:

| Token | Value |
|---|---|
| Primary Blue | `#0a3d8f` |
| Dark Blue | `#072d6b` |
| Deep Navy | `#051f4e` |
| Gold Accent | `#f0a500` |
| Display Font | Cormorant Garamond (serif) |
| UI Font | Outfit (sans-serif) |
| Border Radius | 16px (cards), 10px (inputs) |

**Design Patterns Used:**
- Ken Burns zoom animation on all hero sections
- Dual-layer gradient overlays for hero legibility
- Scoped BEM-style CSS class naming per component (e.g. `cmp-`, `ap-`, `adm-`)
- No global CSS resets — all styles are component-scoped to prevent conflicts
- Mobile-first responsive grid breakpoints at 900px, 768px, 600px, 480px

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend framework |
| React Router v6 | Client-side routing |
| React Icons | Icon library (Font Awesome set) |
| CSS Modules (scoped) | Component styling |
| Google Fonts | Typography (Outfit + Cormorant Garamond) |
| Vite | Build tool and dev server |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/chanzeywe-tvc.git

# Navigate into the project
cd chanzeywe-tvc

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready for deployment to any static host.

---

## 🗺️ Routes

| Path | Page |
|---|---|
| `/` | Homepage |
| `/about` | About the College |
| `/courses` | All Courses |
| `/downloads` | Downloads |
| `/instruction` | Joining Instructions |
| `/tenders` | Tenders |
| `/careers` | Career Vacancies |
| `/blog` | Blog & News |
| `/contact` | Contact |
| `/charter` | College Charter |
| `/corruption` | Report Corruption |
| `/ApplicationForm` | Online Application |
| `/departments/computing` | Computing & Informatics |
| `/departments/building` | Building & Civil Engineering |
| `/departments/electrical` | Electrical Engineering |
| `/departments/liberal` | Liberal Studies |
| `/departments/hospitality` | Hospitality & Tourism |
| `/admin` | Admin Dashboard |

---

## 🏛️ Departments

| Department | Courses | Levels |
|---|---|---|
| Computing & Informatics | ICT Technician L6, ICT Technician L5, Computer Packages | 4, 5, 6 |
| Building & Civil Engineering | Building Tech L6, Civil Eng L6, Building Tech L5, Plumbing L5, Masonry L4, Plumbing L4 | 4, 5, 6 |
| Electrical Engineering | Electrical Eng (Power) L6, Electrical Eng (Power) L5, Electrical Installation L4 | 4, 5, 6 |
| Liberal Studies | Social Work L6 & L5, Supply Chain Management L6 & L5 | 5, 6 |
| Hospitality & Tourism | Food & Beverage, Front Office | 4, 5 |

---

## 📋 Admin Dashboard Access

The admin dashboard is accessible at `/admin`. It is **frontend-only** in this version — no authentication or backend connection is included. Backend integration (API, database, authentication) is planned for a future phase.

**Panels available:**
- Overview with site-wide stats and alerts
- Hero slider and global site settings editor
- Full CRUD for Courses, Tenders, Careers, Downloads, and Blog Posts
- Department content editor (HOD, headlines, taglines)

---

## 🔒 Planned Future Features

- [ ] Backend API (Node.js / Laravel / Firebase)
- [ ] Admin authentication with protected routes
- [ ] Image upload for hero and blog sections
- [ ] Student application tracking system
- [ ] Email notifications for form submissions
- [ ] Online fee payment integration (M-Pesa)
- [ ] Student portal / results check

---

## 🤝 Contributing

This project is maintained by the college's ICT team. If you are a developer contributing to the project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: description of change"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📞 Contact

**Chanzeywe Vocational Training College**
P.O. Box 413 – 50310, Vihiga, Kenya
📞 +254 740 932 743
📧 chanzeywetvc@gmail.com
🌐 [www.chanzeywetvc.ac.ke](http://www.chanzeywetvc.ac.ke)

---

## 📄 License

This project is proprietary software developed for Chanzeywe Vocational Training College. All rights reserved © 2025 Chanzeywe TVC.

---

<p align="center">Built with ❤️ for Chanzeywe Vocational Training College — Vihiga County, Kenya</p>
