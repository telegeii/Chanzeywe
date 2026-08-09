-- ============================================================
-- Production-readiness indexes.
-- kcse_index is the lookup key for the public self-service admission-
-- letter check/download (unauthenticated, so it needs to stay fast even
-- as applications grow into the thousands) and is also used by the
-- admin search box — neither had an index. `status` backs both the
-- admin status-filter tabs and the accepted/rejected-sink sort order.
-- Safe to run against the live DB — CREATE INDEX IF NOT EXISTS is a
-- no-op if already applied.
-- Run: mysql -u root chanzeywe_db < database/migrate_production_indexes.sql
-- ============================================================

SET NAMES utf8mb4;

CREATE INDEX IF NOT EXISTS idx_applications_kcse_index ON applications (kcse_index);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status, received_at);
