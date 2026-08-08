<?php
require_once __DIR__ . '/config/session.php';

const MIN_PASSWORD_LENGTH = 8;

function user_row(array $r, array $permissions): array {
    return [
        'id'             => (int)$r['id'],
        'username'       => $r['username'],
        'role'           => $r['role'],
        'blocked'        => (bool)$r['blocked'],
        'failedAttempts' => (int)$r['failed_attempts'],
        'lastLogin'      => $r['last_login'],
        'createdAt'      => $r['created_at'],
        'permissions'    => $r['role'] === 'super_admin' ? ALL_MODULES : $permissions,
    ];
}

function fetch_permissions(PDO $pdo, int $adminId): array {
    $stmt = $pdo->prepare('SELECT module FROM admin_permissions WHERE admin_id = ?');
    $stmt->execute([$adminId]);
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

function count_super_admins(PDO $pdo, ?int $excludeId = null): int {
    if ($excludeId) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM admin_users WHERE role = 'super_admin' AND id != ?");
        $stmt->execute([$excludeId]);
    } else {
        $stmt = $pdo->query("SELECT COUNT(*) FROM admin_users WHERE role = 'super_admin'");
    }
    return (int)$stmt->fetchColumn();
}

function clean_permissions($input): array {
    if (!is_array($input)) return [];
    return array_values(array_intersect(array_map('strval', $input), ALL_MODULES));
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();
$me     = require_super_admin();

if ($method === 'GET') {
    $rows = $pdo->query('SELECT * FROM admin_users ORDER BY id')->fetchAll();
    $out = array_map(fn($r) => user_row($r, fetch_permissions($pdo, (int)$r['id'])), $rows);
    json_ok($out);
}

if ($method === 'POST') {
    $b = request_body();
    $username = trim($b['username'] ?? '');
    $password = (string)($b['password'] ?? '');
    $role     = ($b['role'] ?? 'staff') === 'super_admin' ? 'super_admin' : 'staff';
    $permissions = clean_permissions($b['permissions'] ?? []);

    if ($username === '') json_error('Username is required');
    if (strlen($password) < MIN_PASSWORD_LENGTH) json_error('Password must be at least ' . MIN_PASSWORD_LENGTH . ' characters');

    $hash = password_hash($password, PASSWORD_BCRYPT);

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('INSERT INTO admin_users (username, role, password_hash) VALUES (?,?,?)');
        $stmt->execute([$username, $role, $hash]);
        $newId = (int)$pdo->lastInsertId();

        if ($role === 'staff' && $permissions) {
            $permStmt = $pdo->prepare('INSERT INTO admin_permissions (admin_id, module) VALUES (?,?)');
            foreach ($permissions as $mod) $permStmt->execute([$newId, $mod]);
        }

        $pdo->commit();
    } catch (PDOException $e) {
        $pdo->rollBack();
        if ($e->getCode() === '23000') json_error('That username is already taken', 409);
        throw $e;
    }

    $row = $pdo->prepare('SELECT * FROM admin_users WHERE id = ?');
    $row->execute([$newId]);
    json_ok(user_row($row->fetch(), fetch_permissions($pdo, $newId)), 201);
}

if ($method === 'PUT' || $method === 'PATCH') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $cur = $pdo->prepare('SELECT * FROM admin_users WHERE id = ?');
    $cur->execute([$id]);
    $existing = $cur->fetch();
    if (!$existing) json_error('User not found', 404);

    $b = request_body();
    $isSelf = $id === (int)$me['id'];

    $username = array_key_exists('username', $b) ? trim($b['username']) : $existing['username'];
    $role     = array_key_exists('role', $b) ? (($b['role'] === 'super_admin') ? 'super_admin' : 'staff') : $existing['role'];
    if ($username === '') json_error('Username is required');

    if ($existing['role'] === 'super_admin' && $role === 'staff' && count_super_admins($pdo, $id) === 0) {
        json_error('Cannot demote the last remaining super admin', 400);
    }

    if (array_key_exists('blocked', $b)) {
        $blocked = !empty($b['blocked']) ? 1 : 0;
        if ($isSelf && $blocked) json_error('You cannot block your own account', 400);
    } else {
        $blocked = (int)$existing['blocked'];
    }

    $passwordSql = '';
    $params = [$username, $role, $blocked];
    if (!empty($b['newPassword'])) {
        if (strlen($b['newPassword']) < MIN_PASSWORD_LENGTH) {
            json_error('Password must be at least ' . MIN_PASSWORD_LENGTH . ' characters');
        }
        $passwordSql = ', password_hash = ?';
        $params[] = password_hash($b['newPassword'], PASSWORD_BCRYPT);
    }
    // Unblocking (or an explicit admin edit) resets the failed-attempt counter.
    $resetAttempts = array_key_exists('blocked', $b) && $blocked === 0;

    $pdo->beginTransaction();
    try {
        $sql = "UPDATE admin_users SET username = ?, role = ?, blocked = ?{$passwordSql}" .
               ($resetAttempts ? ', failed_attempts = 0' : '') . ' WHERE id = ?';
        $params[] = $id;
        $pdo->prepare($sql)->execute($params);

        if (array_key_exists('permissions', $b) && $role === 'staff') {
            $pdo->prepare('DELETE FROM admin_permissions WHERE admin_id = ?')->execute([$id]);
            $permStmt = $pdo->prepare('INSERT INTO admin_permissions (admin_id, module) VALUES (?,?)');
            foreach (clean_permissions($b['permissions']) as $mod) $permStmt->execute([$id, $mod]);
        } elseif ($role === 'super_admin') {
            // super_admin has implicit full access — no stored rows needed.
            $pdo->prepare('DELETE FROM admin_permissions WHERE admin_id = ?')->execute([$id]);
        }

        $pdo->commit();
    } catch (PDOException $e) {
        $pdo->rollBack();
        if ($e->getCode() === '23000') json_error('That username is already taken', 409);
        throw $e;
    }

    if ($isSelf && array_key_exists('username', $b)) {
        start_session();
        $_SESSION['admin_username'] = $username;
    }

    $row = $pdo->prepare('SELECT * FROM admin_users WHERE id = ?');
    $row->execute([$id]);
    json_ok(user_row($row->fetch(), fetch_permissions($pdo, $id)));
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');
    if ($id === (int)$me['id']) json_error('You cannot delete your own account', 400);

    $cur = $pdo->prepare('SELECT role FROM admin_users WHERE id = ?');
    $cur->execute([$id]);
    $existing = $cur->fetch();
    if (!$existing) json_error('User not found', 404);

    if ($existing['role'] === 'super_admin' && count_super_admins($pdo, $id) === 0) {
        json_error('Cannot delete the last remaining super admin', 400);
    }

    $pdo->prepare('DELETE FROM admin_users WHERE id = ?')->execute([$id]);
    json_ok(['deleted' => $id]);
}

json_error('Method not allowed', 405);
