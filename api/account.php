<?php
require_once __DIR__ . '/config/session.php';

const ACCOUNT_MIN_PASSWORD_LENGTH = 8;

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    json_error('Method not allowed', 405);
}

$me  = require_admin();
$pdo = db();

$b = request_body();
$currentPassword = (string)($b['currentPassword'] ?? '');
$newUsername     = trim($b['newUsername'] ?? '');
$newPassword     = (string)($b['newPassword'] ?? '');

if ($currentPassword === '') json_error('Enter your current password to confirm this change');
if ($newUsername === '' && $newPassword === '') json_error('Nothing to update');
if ($newPassword !== '' && strlen($newPassword) < ACCOUNT_MIN_PASSWORD_LENGTH) {
    json_error('New password must be at least ' . ACCOUNT_MIN_PASSWORD_LENGTH . ' characters');
}

$stmt = $pdo->prepare('SELECT * FROM admin_users WHERE id = ?');
$stmt->execute([$me['id']]);
$user = $stmt->fetch();
if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
    json_error('Current password is incorrect', 401);
}

$username = $newUsername !== '' ? $newUsername : $user['username'];
$params = [$username];
$sql = 'UPDATE admin_users SET username = ?';
if ($newPassword !== '') {
    $sql .= ', password_hash = ?';
    $params[] = password_hash($newPassword, PASSWORD_BCRYPT);
}
$sql .= ' WHERE id = ?';
$params[] = $me['id'];

try {
    $pdo->prepare($sql)->execute($params);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') json_error('That username is already taken', 409);
    throw $e;
}

start_session();
$_SESSION['admin_username'] = $username;

json_ok(['id' => $me['id'], 'username' => $username, 'role' => $me['role']]);
