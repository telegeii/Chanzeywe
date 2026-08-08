-- ============================================================
-- Application reference numbers + acceptance offer letters.
-- Safe to run against the live DB: only adds columns.
-- Run: mysql -u root chanzeywe_db < database/migrate_applications_offer.sql
-- ============================================================

SET NAMES utf8mb4;

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS reference_number VARCHAR(40) NULL UNIQUE AFTER id,
  ADD COLUMN IF NOT EXISTS offer_letter_path VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS offer_sent_at TIMESTAMP NULL DEFAULT NULL;

-- Backfill any existing rows submitted before this migration so they still
-- have a usable reference number.
UPDATE applications
SET reference_number = CONCAT('APP/', id, '/', UPPER(DATE_FORMAT(received_at, '%b')), '/', YEAR(received_at))
WHERE reference_number IS NULL;
