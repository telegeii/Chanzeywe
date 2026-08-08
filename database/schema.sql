-- ============================================================
-- Chanzeywe TVC — Database Schema
-- Run: mysql -u root chanzeywe_db < database/schema.sql
-- (create the database first: CREATE DATABASE chanzeywe_db;)
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── admin_users ────────────────────────────────────────────
DROP TABLE IF EXISTS admin_users;
CREATE TABLE admin_users (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username        VARCHAR(64)  NOT NULL UNIQUE,
  role            ENUM('super_admin','staff') NOT NULL DEFAULT 'staff',
  password_hash   VARCHAR(255) NOT NULL,
  failed_attempts INT UNSIGNED NOT NULL DEFAULT 0,
  blocked         TINYINT(1)   NOT NULL DEFAULT 0,
  last_login      TIMESTAMP    NULL DEFAULT NULL,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seeded account — username: admin / password: Chanzeywe@2026
-- CHANGE THIS PASSWORD after first login. This is the sole super_admin;
-- create staff accounts (limited to specific sections) from the Users panel.
INSERT INTO admin_users (username, role, password_hash) VALUES
  ('admin', 'super_admin', '$2y$10$N.X/MlYKkG78QLmReAbJRe2vHSvG2Z78QgQFstbTzZjw27FCARdjS');

-- ── admin_permissions ────────────────────────────────────────
-- One row per module a `staff` account may manage. super_admin accounts
-- implicitly have every module and never need rows here.
DROP TABLE IF EXISTS admin_permissions;
CREATE TABLE admin_permissions (
  admin_id INT UNSIGNED NOT NULL,
  module   VARCHAR(40) NOT NULL,
  PRIMARY KEY (admin_id, module),
  CONSTRAINT fk_admin_permissions_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── departments ─────────────────────────────────────────────
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  slug          VARCHAR(60)  NOT NULL UNIQUE,
  hod           VARCHAR(120) NOT NULL DEFAULT '',
  hero_headline VARCHAR(200) NOT NULL DEFAULT '',
  tagline       VARCHAR(255) NOT NULL DEFAULT '',
  color_hex     VARCHAR(7)   NOT NULL DEFAULT '#0a3d8f',
  active        TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order    INT          NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO departments (id, name, slug, hod, hero_headline, tagline, color_hex, active, sort_order) VALUES
  (1, 'Computing & Informatics',      'computing',  'Telegei Edward', 'Empowering Digital Skills for the Future',                 'Industry-aligned ICT programmes designed for Kenya''s growing tech economy.', '#0a3d8f', 1, 1),
  (2, 'Building & Civil Engineering', 'building',   'Telegei Edward', 'Training Skilled Professionals for Construction',          'Hands-on programmes for Kenya''s growing construction sector.',               '#d97706', 1, 2),
  (3, 'Electrical Engineering',       'electrical', 'Telegei Edward', 'Training Professionals in Electrical Power & Installation', 'Industry-aligned programmes powering Kenya''s electrical sector.',            '#ca8a04', 1, 3),
  (4, 'Liberal Studies',              'liberal',    'Telegei Edward', 'Empowering Social & Management Professionals',             'Programmes in social work and supply chain management.',                     '#7c3aed', 1, 4),
  (5, 'Hospitality',                  'hospitality','TBD',            'Excellence in Hospitality & Culinary Arts',                'Training world-class hospitality professionals.',                            '#db2777', 1, 5),
  (6, 'Agriculture',                  'agriculture','TBD',            'Cultivating Agricultural Excellence',                      'Practical agricultural programmes for sustainable livelihoods.',             '#16a34a', 1, 6);

-- ── courses ─────────────────────────────────────────────────
DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(20)  NOT NULL,
  title         VARCHAR(200) NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  level         ENUM('Level 4','Level 5','Level 6') NOT NULL,
  duration      VARCHAR(40)  NOT NULL DEFAULT '',
  exam_body     VARCHAR(20)  NOT NULL DEFAULT 'CDACC',
  requirement   VARCHAR(120) NOT NULL DEFAULT '',
  sort_order    INT          NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_courses_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO courses (code, title, department_id, level, duration, exam_body, requirement, sort_order) VALUES
  ('DBC',   'Building Technician Level 9 (Diploma)',          2, 'Level 6', '9 Terms',  'CDACC', 'C – or Pass in Level 5',      1),
  ('DCE',   'Civil Engineering Technician Level 6 (Diploma)', 2, 'Level 6', '9 Terms',  'CDACC', 'C – or Pass in Level 5',      2),
  ('CBT',   'Building Technician Level 5 (Certificate)',      2, 'Level 5', '6 Terms',  'CDACC', 'Grade D',                     3),
  ('CP',    'Plumbing Level 5',                                2, 'Level 5', '6 Terms',  'CDACC', 'Grade D',                     4),
  ('AM',    'Masonry Level 4',                                 2, 'Level 4', '3 Terms',  'CDACC', 'KCSE Mean Grade D –',         5),
  ('AP',    'Plumbing Level 4',                                2, 'Level 4', '3 Terms',  'CDACC', 'KCSE Mean Grade D –',         6),
  ('DEEP',  'Electrical Engineering (Power Option) Level 6',   3, 'Level 6', '9 Terms',  'CDACC', 'C- or Pass in Level 5',       7),
  ('CEEP',  'Electrical Engineering (Power Option) Level 5',   3, 'Level 5', '6 Terms',  'CDACC', 'D- or Pass in Level 4',       8),
  ('AIE',   'Electrical Installation',                          3, 'Level 4', '3 Terms',  'CDACC', 'Grade D – and E',             9),
  ('DFB',   'Food and Beverage Level 6',                        5, 'Level 6', '9 Terms',  'CDACC', 'C- or Pass in Level 5',       10),
  ('CFB',   'Food and Beverage Level 5',                        5, 'Level 5', '6 Terms',  'CDACC', 'D or Pass in Level 4',        11),
  ('AFB',   'Food and Beverage Level 4',                        5, 'Level 4', '3 Terms',  'CDACC', 'D- and E',                    12),
  ('FD',    'Fashion and Design Level 4',                       5, 'Level 4', '3 Terms',  'CDACC', 'D- and E',                    13),
  ('AHD',   'Hairdressing and Beauty Therapy Level 4',          5, 'Level 4', '3 Terms',  'CDACC', 'D- and E',                    14),
  ('DICT',  'ICT Technician Level 6',                           1, 'Level 6', '9 Terms',  'CDACC', 'C- or Pass Level 6',          15),
  ('CICT',  'ICT Technician Level 5',                           1, 'Level 5', '6 Terms',  'CDACC', 'D plain',                     16),
  ('CPK',   'Computer Packages',                                 1, 'Level 4', '6 Weeks',  'CTVC',  'KCPE and KCSE',               17),
  ('DGA',   'Agriculture Extension Level 6',                    6, 'Level 6', '9 Terms',  'CDACC', 'C- or Pass level 5',          18),
  ('CGA',   'Agriculture Extension Level 5',                    6, 'Level 5', '6 Terms',  'CDACC', 'D or Pass Level 5',           19),
  ('AGA',   'Agriculture Extension Level 4',                    6, 'Level 4', '3 Terms',  'CDACC', 'D- and E',                    20),
  ('DSWCD', 'Social Work Level 6',                               4, 'Level 6', '9 Terms',  'CDACC', 'C- or Pass Level 5',          21),
  ('CSWCD', 'Social Work Level 5',                               4, 'Level 5', '6 Terms',  'CDACC', 'D (plain)',                   22),
  ('DSCM',  'Supply Chain Management Level 6',                  4, 'Level 6', '9 Terms',  'CDACC', 'C- or Pass Level 5',          23),
  ('CSCM',  'Supply Chain Management Level 5',                  4, 'Level 5', '6 Terms',  'CDACC', 'D (plain)',                   24);

-- ============================================================
-- Tables below are created now so later modules need no future
-- migration, but have no API/UI wired yet this round.
-- ============================================================

-- ── hero_slides ─────────────────────────────────────────────
DROP TABLE IF EXISTS hero_slides;
CREATE TABLE hero_slides (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  eyebrow     VARCHAR(120) NOT NULL DEFAULT '',
  headline    VARCHAR(200) NOT NULL,
  subtitle    VARCHAR(255) NOT NULL DEFAULT '',
  cta_label   VARCHAR(60)  NOT NULL DEFAULT 'Learn More',
  cta_link    VARCHAR(120) NOT NULL DEFAULT '/',
  image_path  VARCHAR(255) DEFAULT NULL,
  active      TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── principal (single-row) ──────────────────────────────────
DROP TABLE IF EXISTS principal;
CREATE TABLE principal (
  id         INT UNSIGNED PRIMARY KEY DEFAULT 1,
  name       VARCHAR(120) NOT NULL DEFAULT '',
  title      VARCHAR(160) NOT NULL DEFAULT '',
  greeting   VARCHAR(60)  NOT NULL DEFAULT 'Karibu',
  message    TEXT,
  photo_path VARCHAR(255) DEFAULT NULL,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_principal_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── blog_posts ──────────────────────────────────────────────
DROP TABLE IF EXISTS blog_posts;
CREATE TABLE blog_posts (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(200) NOT NULL,
  category       VARCHAR(60)  NOT NULL DEFAULT 'News',
  author         VARCHAR(80)  NOT NULL DEFAULT 'Admin',
  published_date DATE         NOT NULL,
  location       VARCHAR(120) NOT NULL DEFAULT 'Vihiga, Kenya',
  excerpt        VARCHAR(255) NOT NULL DEFAULT '',
  body           TEXT,
  image_path     VARCHAR(255) DEFAULT NULL,
  published      TINYINT(1)   NOT NULL DEFAULT 0,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── tenders ─────────────────────────────────────────────────
DROP TABLE IF EXISTS tenders;
CREATE TABLE tenders (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  number      VARCHAR(80)  NOT NULL,
  title       VARCHAR(200) NOT NULL,
  method      VARCHAR(60)  NOT NULL DEFAULT 'Open Tender',
  posted_date DATE         NOT NULL,
  close_date  DATE         NOT NULL,
  file_path   VARCHAR(255) DEFAULT NULL,
  file_name   VARCHAR(200) DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── careers ─────────────────────────────────────────────────
DROP TABLE IF EXISTS careers;
CREATE TABLE careers (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  number      VARCHAR(80)  NOT NULL,
  title       VARCHAR(200) NOT NULL,
  posted_date DATE         NOT NULL,
  close_date  DATE         NOT NULL,
  file_path   VARCHAR(255) DEFAULT NULL,
  file_name   VARCHAR(200) DEFAULT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── downloads ───────────────────────────────────────────────
DROP TABLE IF EXISTS downloads;
CREATE TABLE downloads (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  tag         VARCHAR(60)  NOT NULL DEFAULT 'General',
  description VARCHAR(255) NOT NULL DEFAULT '',
  file_path   VARCHAR(255) DEFAULT NULL,
  file_name   VARCHAR(200) DEFAULT NULL,
  visible     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── applications ────────────────────────────────────────────
DROP TABLE IF EXISTS applications;
CREATE TABLE applications (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference_number   VARCHAR(40)  NULL UNIQUE,
  full_name      VARCHAR(150) NOT NULL,
  gender         VARCHAR(20)  DEFAULT NULL,
  email          VARCHAR(150) NOT NULL,
  dob            DATE         DEFAULT NULL,
  nationality    VARCHAR(60)  DEFAULT 'Kenyan',
  id_number      VARCHAR(60)  DEFAULT NULL,
  school         VARCHAR(150) DEFAULT NULL,
  kcse_index     VARCHAR(60)  DEFAULT NULL,
  kcse_year      VARCHAR(10)  DEFAULT NULL,
  grade          VARCHAR(10)  DEFAULT NULL,
  prev_cert      VARCHAR(150) DEFAULT NULL,
  special_needs  VARCHAR(150) DEFAULT NULL,
  student_phone  VARCHAR(30)  NOT NULL,
  guardian_phone VARCHAR(30)  NOT NULL,
  address        VARCHAR(200) DEFAULT NULL,
  course_id      INT UNSIGNED DEFAULT NULL,
  status         ENUM('pending','reviewed','accepted','rejected') NOT NULL DEFAULT 'pending',
  offer_letter_path VARCHAR(255) NULL,
  offer_sent_at     TIMESTAMP NULL DEFAULT NULL,
  received_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_applications_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── application_documents ───────────────────────────────────
DROP TABLE IF EXISTS application_documents;
CREATE TABLE application_documents (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  application_id INT UNSIGNED NOT NULL,
  doc_type       VARCHAR(60)  NOT NULL,
  file_path      VARCHAR(255) NOT NULL,
  file_name      VARCHAR(200) NOT NULL,
  uploaded_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_docs_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
