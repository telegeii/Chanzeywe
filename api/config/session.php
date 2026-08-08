<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/response.php';

/** Every module a staff account can be individually granted access to. */
const ALL_MODULES = ['hero', 'courses', 'departments', 'blog', 'applications', 'tenders', 'careers', 'downloads'];

function start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_set_cookie_params([
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        // Automatically require HTTPS for the session cookie once deployed
        // behind TLS; harmless no-op on local HTTP dev.
        'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
    session_name('chanzeywe_admin');
    session_start();
}

/**
 * Defence-in-depth CSRF check for every mutating request. The frontend's
 * fetch wrapper sends this custom header on every POST/PUT/DELETE; a
 * cross-site <form> submission (classic CSRF) cannot set custom headers,
 * so this blocks that class of attack even though SameSite=Lax cookies
 * already cover most of it.
 */
function require_fetch_header(): void {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'GET' || $method === 'HEAD' || $method === 'OPTIONS') return;
    if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'fetch') {
        json_error('Invalid request', 403);
    }
}

/** Returns the logged-in admin's public info (with role + permissions), or null. */
function current_admin(): ?array {
    start_session();
    if (empty($_SESSION['admin_id'])) return null;

    $role = $_SESSION['admin_role'] ?? 'staff';
    $admin = [
        'id'       => $_SESSION['admin_id'],
        'username' => $_SESSION['admin_username'] ?? '',
        'role'     => $role,
    ];

    if ($role === 'super_admin') {
        $admin['permissions'] = ALL_MODULES;
    } else {
        $stmt = db()->prepare('SELECT module FROM admin_permissions WHERE admin_id = ?');
        $stmt->execute([$admin['id']]);
        $admin['permissions'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    return $admin;
}

/** Call at the top of any authenticated endpoint. Exits with 401 if not logged in. */
function require_admin(): array {
    require_fetch_header();
    $admin = current_admin();
    if ($admin === null) {
        json_error('Not authenticated', 401);
    }
    return $admin;
}

/** Call at the top of a module's mutation branch. 401 if logged out, 403 if lacking that module. */
function require_permission(string $module): array {
    $admin = require_admin();
    if ($admin['role'] !== 'super_admin' && !in_array($module, $admin['permissions'], true)) {
        json_error('You do not have permission to manage this section', 403);
    }
    return $admin;
}

/** Call at the top of super-admin-only endpoints (user management). */
function require_super_admin(): array {
    $admin = require_admin();
    if ($admin['role'] !== 'super_admin') {
        json_error('Super admin access required', 403);
    }
    return $admin;
}
