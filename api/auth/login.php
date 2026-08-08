<?php
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

const MAX_LOGIN_ATTEMPTS = 5;

$body = request_body();
$username = trim($body['username'] ?? '');
$password = (string)($body['password'] ?? '');

if ($username === '' || $password === '') {
    json_error('Username and password are required', 400);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT id, username, role, password_hash, failed_attempts, blocked FROM admin_users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user) {
    json_error('Invalid username or password', 401);
}

if ((int)$user['blocked'] === 1) {
    json_error('This account has been blocked after too many failed login attempts. Contact your administrator to have it unblocked.', 403);
}

if (!password_verify($password, $user['password_hash'])) {
    $attempts = (int)$user['failed_attempts'] + 1;

    if ($attempts >= MAX_LOGIN_ATTEMPTS) {
        $pdo->prepare('UPDATE admin_users SET failed_attempts = ?, blocked = 1 WHERE id = ?')
            ->execute([$attempts, $user['id']]);
        json_error('Too many failed attempts. This account has been blocked. Contact your administrator to have it unblocked.', 403);
    }

    $pdo->prepare('UPDATE admin_users SET failed_attempts = ? WHERE id = ?')->execute([$attempts, $user['id']]);
    $remaining = MAX_LOGIN_ATTEMPTS - $attempts;
    json_error("Invalid username or password. {$remaining} attempt(s) remaining before this account is locked.", 401);
}

// Success — reset the counter and stamp the login.
$pdo->prepare('UPDATE admin_users SET failed_attempts = 0, last_login = NOW() WHERE id = ?')->execute([$user['id']]);

start_session();
session_regenerate_id(true);
$_SESSION['admin_id']       = $user['id'];
$_SESSION['admin_username'] = $user['username'];
$_SESSION['admin_role']     = $user['role'];

json_ok(['id' => $user['id'], 'username' => $user['username'], 'role' => $user['role']]);
