<?php
require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/uploads.php';

const TENDER_UPLOAD_DIR  = __DIR__ . '/uploads/tenders/';
const TENDER_ALLOWED_EXT = ['pdf'];
const TENDER_MAX_BYTES   = 10 * 1024 * 1024;

function tender_row(array $r): array {
    return [
        'id'         => (int)$r['id'],
        'number'     => $r['number'],
        'title'      => $r['title'],
        'method'     => $r['method'],
        'postedDate' => $r['posted_date'],
        'closeDate'  => $r['close_date'],
        'fileUrl'    => $r['file_path'] ? '/api/uploads/tenders/' . $r['file_path'] : null,
        'fileName'   => $r['file_name'],
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    $rows = $pdo->query('SELECT * FROM tenders ORDER BY posted_date DESC, id DESC')->fetchAll();
    json_ok(array_map('tender_row', $rows));
}

if ($method === 'POST') {
    require_permission('tenders');
    $b  = $_POST;
    $id = !empty($b['id']) ? (int)$b['id'] : null;

    try {
        if ($id) {
            $cur = $pdo->prepare('SELECT * FROM tenders WHERE id = ?');
            $cur->execute([$id]);
            $existing = $cur->fetch();
            if (!$existing) json_error('Tender not found', 404);

            $number     = array_key_exists('number', $b)     ? trim($b['number'])     : $existing['number'];
            $title      = array_key_exists('title', $b)      ? trim($b['title'])      : $existing['title'];
            $tMethod    = array_key_exists('method', $b)     ? trim($b['method'])     : $existing['method'];
            $postedDate = array_key_exists('postedDate', $b) ? $b['postedDate']       : $existing['posted_date'];
            $closeDate  = array_key_exists('closeDate', $b)  ? $b['closeDate']        : $existing['close_date'];

            if ($number === '' || $title === '' || !$closeDate) json_error('Number, title and closing date are required');

            $filePath = $existing['file_path'];
            $fileName = $existing['file_name'];
            if (!empty($_FILES['file']['name'])) {
                $filePath = save_upload($_FILES['file'], TENDER_UPLOAD_DIR, TENDER_ALLOWED_EXT, TENDER_MAX_BYTES, 'tender');
                $fileName = $_FILES['file']['name'];
                delete_upload(TENDER_UPLOAD_DIR, $existing['file_path']);
            }

            $stmt = $pdo->prepare(
                'UPDATE tenders SET number=?, title=?, method=?, posted_date=?, close_date=?, file_path=?, file_name=? WHERE id=?'
            );
            $stmt->execute([$number, $title, $tMethod, $postedDate, $closeDate, $filePath, $fileName, $id]);

            $row = $pdo->prepare('SELECT * FROM tenders WHERE id = ?');
            $row->execute([$id]);
            json_ok(tender_row($row->fetch()));
        }

        // Create
        $number    = trim($b['number'] ?? '');
        $title     = trim($b['title'] ?? '');
        $closeDate = $b['closeDate'] ?? '';
        if ($number === '' || $title === '' || !$closeDate) json_error('Number, title and closing date are required');

        $filePath = null;
        $fileName = null;
        if (!empty($_FILES['file']['name'])) {
            $filePath = save_upload($_FILES['file'], TENDER_UPLOAD_DIR, TENDER_ALLOWED_EXT, TENDER_MAX_BYTES, 'tender');
            $fileName = $_FILES['file']['name'];
        }

        $stmt = $pdo->prepare(
            'INSERT INTO tenders (number, title, method, posted_date, close_date, file_path, file_name)
             VALUES (?,?,?,?,?,?,?)'
        );
        $stmt->execute([
            $number, $title, trim($b['method'] ?? '') ?: 'Open Tender',
            $b['postedDate'] ?? date('Y-m-d'), $closeDate, $filePath, $fileName,
        ]);

        $newId = (int)$pdo->lastInsertId();
        $row = $pdo->prepare('SELECT * FROM tenders WHERE id = ?');
        $row->execute([$newId]);
        json_ok(tender_row($row->fetch()), 201);
    } catch (RuntimeException $e) {
        json_error($e->getMessage(), 400);
    }
}

if ($method === 'DELETE') {
    require_permission('tenders');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $cur = $pdo->prepare('SELECT file_path FROM tenders WHERE id = ?');
    $cur->execute([$id]);
    $existing = $cur->fetch();
    if (!$existing) json_error('Tender not found', 404);

    $pdo->prepare('DELETE FROM tenders WHERE id = ?')->execute([$id]);
    delete_upload(TENDER_UPLOAD_DIR, $existing['file_path']);

    json_ok(['deleted' => $id]);
}

json_error('Method not allowed', 405);
