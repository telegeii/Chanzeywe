-- ============================================================
-- Walk-in applications — admin-entered applications for students
-- who applied in person with hardcopy documents already verified
-- by staff, as opposed to the online public application form.
-- Safe to run against the live DB: only adds a column.
-- Run: mysql -u root chanzeywe_db < database/migrate_applications_walkin.sql
-- ============================================================

SET NAMES utf8mb4;

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS walk_in TINYINT(1) NOT NULL DEFAULT 0 AFTER course_id;
