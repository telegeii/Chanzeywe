-- ============================================================
-- Seed data for Hero/Slider, Principal, Blog, Tenders, Careers,
-- Downloads — carries over the current site content so the
-- public pages and admin panels aren't empty on first load.
-- Run: mysql -u root chanzeywe_db < database/seed_remaining_modules.sql
-- Safe to re-run: it only inserts if each table is currently empty.
-- ============================================================

SET NAMES utf8mb4;

INSERT INTO hero_slides (eyebrow, headline, subtitle, cta_label, cta_link, active, sort_order)
SELECT * FROM (SELECT
  'Welcome to Chanzeywe TVC' AS eyebrow,
  'Skills to Transform Livelihoods' AS headline,
  'Quality CDACC-accredited vocational training for Kenya''s growing economy.' AS subtitle,
  'Explore Courses' AS cta_label, '/courses' AS cta_link, 1 AS active, 1 AS sort_order
UNION ALL SELECT
  'CDACC Accredited', 'Nationally Recognised Programmes',
  'Certificates, diplomas and artisan programmes across 6 departments.',
  'View Departments', '/courses', 1, 2
UNION ALL SELECT
  'Intakes Now Open', 'January 2026 Intake Now Open',
  'Apply early — intakes run in January, May, and September every year.',
  'Apply Now', '/courses', 1, 3
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM hero_slides);

INSERT INTO principal (id, name, title, greeting, message)
SELECT 1, 'Mr. Gilbert G. Mwavali', 'Principal / Secretary – B.O.G', 'Karibu',
  'A heartfelt welcome to the digital home of Chanzeywe Institute. We are committed to academic excellence, innovation, and the development of skilled professionals ready to thrive in the modern technological world.'
WHERE NOT EXISTS (SELECT 1 FROM principal WHERE id = 1);

INSERT INTO blog_posts (title, category, author, published_date, location, excerpt, body, published)
SELECT * FROM (SELECT
  'Ministry of Education Certification' AS title, 'Announcements' AS category, 'Admin' AS author,
  '2026-02-28' AS published_date, 'Vihiga, Kenya' AS location,
  'Chanzeywe Vocational College is officially certified by the Ministry of Education under the State Department for Vocational and Technical Training.' AS excerpt,
  'Chanzeywe Vocational College is officially certified by the Ministry of Education under the State Department for Vocational and Technical Training. This certification affirms the college''s commitment to delivering quality, industry-aligned technical and vocational education to students across the region.' AS body,
  1 AS published
UNION ALL SELECT
  'About Chanzeywe Vocational College', 'News', 'Admin', '2026-02-20', 'Vihiga, Kenya',
  'Founded in 2020 and located in Vihiga County near Mahanga Market, the college offers quality, practical and industry-focused training.',
  'Founded in 2020 and located in Vihiga County near Mahanga Market, the college offers quality, practical and industry-focused training across six departments, equipping students with the skills they need to thrive in Kenya''s job market.',
  1
UNION ALL SELECT
  'Safaricom Foundation ICT Support', 'Infrastructure', 'Admin', '2026-02-10', 'Vihiga, Kenya',
  'Safaricom Foundation donated computers to enhance digital literacy and hands-on ICT training at the college.',
  'Safaricom Foundation donated computers to enhance digital literacy and hands-on ICT training at the college, giving students in the Computing & Informatics department access to modern equipment for their coursework.',
  1
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM blog_posts);

INSERT INTO tenders (number, title, method, posted_date, close_date)
SELECT * FROM (SELECT
  'CHANZEYWE/OT/01/2023-2024' AS number, 'Provision of Printing Papers' AS title, 'Open Tender' AS method,
  '2025-12-14' AS posted_date, '2025-12-29' AS close_date
UNION ALL SELECT
  'CHANZEYWE/OT/02/2025-2026', 'Provision of Security Services', 'Restricted Tender', '2025-12-14', '2026-06-30'
UNION ALL SELECT
  'CHANZEYWE/OT/03/2025-2026', 'Provision of Washing Soap', 'Open Tender', '2025-12-14', '2025-12-01'
UNION ALL SELECT
  'CHANZEYWE/PROC/004/2026', 'Supply of Laboratory Equipment', 'Open Tender', '2026-01-10', '2026-07-15'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM tenders);

INSERT INTO careers (number, title, posted_date, close_date)
SELECT * FROM (SELECT
  'CHANZEYWE/TRAINERS/ADVERT/9/25' AS number, 'Advertisement for BOG Trainer Positions' AS title,
  '2025-12-14' AS posted_date, '2025-12-29' AS close_date
UNION ALL SELECT
  'CHANZEYWE/HR/ADVERT/10/25', 'Advertisement for Human Resource Positions', '2025-12-14', '2025-12-29'
UNION ALL SELECT
  'CHANZEYWE/ADMIN/ADVERT/11/25', 'Advertisement for Administrator Positions', '2024-11-14', '2027-12-01'
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM careers);

INSERT INTO downloads (title, tag, description, visible)
SELECT * FROM (SELECT
  'Current Fee Structure' AS title, 'Finance' AS tag, 'View tuition, levies, and payment schedules for all programmes.' AS description, 1 AS visible
UNION ALL SELECT
  'Admission Form', 'Admissions', 'Official application form for new and returning students.', 1
UNION ALL SELECT
  'Medical Form', 'Health', 'Student health declaration required before registration.', 1
UNION ALL SELECT
  'Student Registration Form', 'Registration', 'Complete your enrolment with the official registration document.', 1
UNION ALL SELECT
  'College Brochure', 'General', 'An overview of all departments, courses, and facilities at Chanzeywe TVC.', 1
UNION ALL SELECT
  'CDACC Examination Guidelines', 'Academic', 'Guidelines and instructions for CDACC national examinations.', 0
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM downloads);
