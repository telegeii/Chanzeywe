-- ============================================================
-- RBAC migration — roles, per-module permissions, login lockout.
-- Safe to run against the live DB: only adds columns/tables,
-- never drops existing data.
-- Run: mysql -u root chanzeywe_db < database/migrate_rbac.sql
-- ============================================================

SET NAMES utf8mb4;

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS role ENUM('super_admin','staff') NOT NULL DEFAULT 'staff' AFTER username,
  ADD COLUMN IF NOT EXISTS failed_attempts INT UNSIGNED NOT NULL DEFAULT 0 AFTER password_hash,
  ADD COLUMN IF NOT EXISTS blocked TINYINT(1) NOT NULL DEFAULT 0 AFTER failed_attempts,
  ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL DEFAULT NULL AFTER blocked;

UPDATE admin_users SET role = 'super_admin' WHERE username = 'admin';

CREATE TABLE IF NOT EXISTS admin_permissions (
  admin_id INT UNSIGNED NOT NULL,
  module   VARCHAR(40) NOT NULL,
  PRIMARY KEY (admin_id, module),
  CONSTRAINT fk_admin_permissions_admin FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
