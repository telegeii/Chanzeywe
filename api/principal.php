<?php
require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/uploads.php';

const PRINCIPAL_UPLOAD_DIR  = __DIR__ . '/uploads/principal/';
const PRINCIPAL_ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp'];
const PRINCIPAL_MAX_BYTES   = 8 * 1024 * 1024;

const PRINCIPAL_DEFAULTS = [
    'name'     => 'Mr. Gilbert G. Mwavali',
    'title'    => 'Principal / Secretary – B.O.G',
    'greeting' => 'Karibu',
    'message'  => "A heartfelt welcome to the digital home of Chanzeywe Institute. We are committed to academic excellence, innovation, and the development of skilled professionals ready to thrive in the modern technological world.",
];

function principal_row(?array $r): array {
    if (!$r) {
        return array_merge(PRINCIPAL_DEFAULTS, ['photo' => null]);
    }
    return [
        'name'     => $r['name'],
        'title'    => $r['title'],
        'greeting' => $r['greeting'],
        'message'  => $r['message'],
        'photo'    => $r['photo_path'] ? '/api/uploads/principal/' . $r['photo_path'] : null,
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    $row = $pdo->query('SELECT * FROM principal WHERE id = 1')->fetch();
    json_ok(principal_row($row ?: null));
}

if ($method === 'POST') {
    require_permission('hero');
    $b = $_POST;

    $name     = trim($b['name'] ?? '');
    $title    = trim($b['title'] ?? '');
    $greeting = trim($b['greeting'] ?? '') ?: 'Karibu';
    $message  = trim($b['message'] ?? '');
    if ($name === '')    json_error('Principal name is required');
    if ($message === '') json_error('Welcome message is required');

    try {
        $existing = $pdo->query('SELECT * FROM principal WHERE id = 1')->fetch();

        $photoPath = $existing['photo_path'] ?? null;
        if (!empty($_FILES['photo']['name'])) {
            $photoPath = save_upload($_FILES['photo'], PRINCIPAL_UPLOAD_DIR, PRINCIPAL_ALLOWED_EXT, PRINCIPAL_MAX_BYTES, 'principal');
            if ($existing) delete_upload(PRINCIPAL_UPLOAD_DIR, $existing['photo_path']);
        } elseif (!empty($b['removePhoto']) && $existing) {
            delete_upload(PRINCIPAL_UPLOAD_DIR, $existing['photo_path']);
            $photoPath = null;
        }

        if ($existing) {
            $stmt = $pdo->prepare('UPDATE principal SET name=?, title=?, greeting=?, message=?, photo_path=? WHERE id=1');
            $stmt->execute([$name, $title, $greeting, $message, $photoPath]);
        } else {
            $stmt = $pdo->prepare('INSERT INTO principal (id, name, title, greeting, message, photo_path) VALUES (1,?,?,?,?,?)');
            $stmt->execute([$name, $title, $greeting, $message, $photoPath]);
        }

        $row = $pdo->query('SELECT * FROM principal WHERE id = 1')->fetch();
        json_ok(principal_row($row));
    } catch (RuntimeException $e) {
        json_error($e->getMessage(), 400);
    }
}

json_error('Method not allowed', 405);
