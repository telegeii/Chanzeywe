<?php
require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/uploads.php';

const CAREER_UPLOAD_DIR  = __DIR__ . '/uploads/careers/';
const CAREER_ALLOWED_EXT = ['pdf'];
const CAREER_MAX_BYTES   = 10 * 1024 * 1024;

function career_row(array $r): array {
    return [
        'id'         => (int)$r['id'],
        'number'     => $r['number'],
        'title'      => $r['title'],
        'postedDate' => $r['posted_date'],
        'closeDate'  => $r['close_date'],
        'fileUrl'    => $r['file_path'] ? '/api/uploads/careers/' . $r['file_path'] : null,
        'fileName'   => $r['file_name'],
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    $rows = $pdo->query('SELECT * FROM careers ORDER BY posted_date DESC, id DESC')->fetchAll();
    json_ok(array_map('career_row', $rows));
}

if ($method === 'POST') {
    require_permission('careers');
    $b  = $_POST;
    $id = !empty($b['id']) ? (int)$b['id'] : null;

    try {
        if ($id) {
            $cur = $pdo->prepare('SELECT * FROM careers WHERE id = ?');
            $cur->execute([$id]);
            $existing = $cur->fetch();
            if (!$existing) json_error('Vacancy not found', 404);

            $number     = array_key_exists('number', $b)     ? trim($b['number'])     : $existing['number'];
            $title      = array_key_exists('title', $b)      ? trim($b['title'])      : $existing['title'];
            $postedDate = array_key_exists('postedDate', $b) ? $b['postedDate']       : $existing['posted_date'];
            $closeDate  = array_key_exists('closeDate', $b)  ? $b['closeDate']        : $existing['close_date'];

            if ($number === '' || $title === '' || !$closeDate) json_error('Number, title and closing date are required');

            $filePath = $existing['file_path'];
            $fileName = $existing['file_name'];
            if (!empty($_FILES['file']['name'])) {
                $filePath = save_upload($_FILES['file'], CAREER_UPLOAD_DIR, CAREER_ALLOWED_EXT, CAREER_MAX_BYTES, 'career');
                $fileName = $_FILES['file']['name'];
                delete_upload(CAREER_UPLOAD_DIR, $existing['file_path']);
            }

            $stmt = $pdo->prepare(
                'UPDATE careers SET number=?, title=?, posted_date=?, close_date=?, file_path=?, file_name=? WHERE id=?'
            );
            $stmt->execute([$number, $title, $postedDate, $closeDate, $filePath, $fileName, $id]);

            $row = $pdo->prepare('SELECT * FROM careers WHERE id = ?');
            $row->execute([$id]);
            json_ok(career_row($row->fetch()));
        }

        // Create
        $number    = trim($b['number'] ?? '');
        $title     = trim($b['title'] ?? '');
        $closeDate = $b['closeDate'] ?? '';
        if ($number === '' || $title === '' || !$closeDate) json_error('Number, title and closing date are required');

        $filePath = null;
        $fileName = null;
        if (!empty($_FILES['file']['name'])) {
            $filePath = save_upload($_FILES['file'], CAREER_UPLOAD_DIR, CAREER_ALLOWED_EXT, CAREER_MAX_BYTES, 'career');
            $fileName = $_FILES['file']['name'];
        }

        $stmt = $pdo->prepare(
            'INSERT INTO careers (number, title, posted_date, close_date, file_path, file_name)
             VALUES (?,?,?,?,?,?)'
        );
        $stmt->execute([
            $number, $title, $b['postedDate'] ?? date('Y-m-d'), $closeDate, $filePath, $fileName,
        ]);

        $newId = (int)$pdo->lastInsertId();
        $row = $pdo->prepare('SELECT * FROM careers WHERE id = ?');
        $row->execute([$newId]);
        json_ok(career_row($row->fetch()), 201);
    } catch (RuntimeException $e) {
        json_error($e->getMessage(), 400);
    }
}

if ($method === 'DELETE') {
    require_permission('careers');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $cur = $pdo->prepare('SELECT file_path FROM careers WHERE id = ?');
    $cur->execute([$id]);
    $existing = $cur->fetch();
    if (!$existing) json_error('Vacancy not found', 404);

    $pdo->prepare('DELETE FROM careers WHERE id = ?')->execute([$id]);
    delete_upload(CAREER_UPLOAD_DIR, $existing['file_path']);

    json_ok(['deleted' => $id]);
}

json_error('Method not allowed', 405);
