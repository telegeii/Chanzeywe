<?php
require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/uploads.php';

const DOWNLOAD_UPLOAD_DIR  = __DIR__ . '/uploads/downloads/';
const DOWNLOAD_ALLOWED_EXT = ['pdf'];
const DOWNLOAD_MAX_BYTES   = 10 * 1024 * 1024;

function download_row(array $r): array {
    return [
        'id'       => (int)$r['id'],
        'title'    => $r['title'],
        'tag'      => $r['tag'],
        'desc'     => $r['description'],
        'fileUrl'  => $r['file_path'] ? '/api/uploads/downloads/' . $r['file_path'] : null,
        'fileName' => $r['file_name'],
        'visible'  => (bool)$r['visible'],
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    // Admin sees everything via ?all=1; the public Downloads page only
    // ever asks for visible documents.
    if (!empty($_GET['all'])) {
        require_permission('downloads');
        $rows = $pdo->query('SELECT * FROM downloads ORDER BY id DESC')->fetchAll();
        json_ok(array_map('download_row', $rows));
    }

    $rows = $pdo->query('SELECT * FROM downloads WHERE visible = 1 ORDER BY id DESC')->fetchAll();
    json_ok(array_map('download_row', $rows));
}

if ($method === 'POST') {
    require_permission('downloads');
    $b  = $_POST;
    $id = !empty($b['id']) ? (int)$b['id'] : null;

    try {
        if ($id) {
            $cur = $pdo->prepare('SELECT * FROM downloads WHERE id = ?');
            $cur->execute([$id]);
            $existing = $cur->fetch();
            if (!$existing) json_error('Document not found', 404);

            $title   = array_key_exists('title', $b)   ? trim($b['title'])   : $existing['title'];
            $tag     = array_key_exists('tag', $b)     ? trim($b['tag'])     : $existing['tag'];
            $desc    = array_key_exists('desc', $b)    ? trim($b['desc'])    : $existing['description'];
            $visible = array_key_exists('visible', $b) ? (!empty($b['visible']) && $b['visible'] !== '0' ? 1 : 0) : $existing['visible'];

            if ($title === '') json_error('Document title is required');

            $filePath = $existing['file_path'];
            $fileName = $existing['file_name'];
            if (!empty($_FILES['file']['name'])) {
                $filePath = save_upload($_FILES['file'], DOWNLOAD_UPLOAD_DIR, DOWNLOAD_ALLOWED_EXT, DOWNLOAD_MAX_BYTES, 'doc');
                $fileName = $_FILES['file']['name'];
                delete_upload(DOWNLOAD_UPLOAD_DIR, $existing['file_path']);
            }

            $stmt = $pdo->prepare(
                'UPDATE downloads SET title=?, tag=?, description=?, file_path=?, file_name=?, visible=? WHERE id=?'
            );
            $stmt->execute([$title, $tag, $desc, $filePath, $fileName, $visible, $id]);

            $row = $pdo->prepare('SELECT * FROM downloads WHERE id = ?');
            $row->execute([$id]);
            json_ok(download_row($row->fetch()));
        }

        // Create
        $title = trim($b['title'] ?? '');
        if ($title === '') json_error('Document title is required');

        $filePath = null;
        $fileName = null;
        if (!empty($_FILES['file']['name'])) {
            $filePath = save_upload($_FILES['file'], DOWNLOAD_UPLOAD_DIR, DOWNLOAD_ALLOWED_EXT, DOWNLOAD_MAX_BYTES, 'doc');
            $fileName = $_FILES['file']['name'];
        }

        $stmt = $pdo->prepare(
            'INSERT INTO downloads (title, tag, description, file_path, file_name, visible)
             VALUES (?,?,?,?,?,?)'
        );
        $stmt->execute([
            $title, trim($b['tag'] ?? '') ?: 'General', trim($b['desc'] ?? ''),
            $filePath, $fileName, !empty($b['visible']) && $b['visible'] !== '0' ? 1 : 0,
        ]);

        $newId = (int)$pdo->lastInsertId();
        $row = $pdo->prepare('SELECT * FROM downloads WHERE id = ?');
        $row->execute([$newId]);
        json_ok(download_row($row->fetch()), 201);
    } catch (RuntimeException $e) {
        json_error($e->getMessage(), 400);
    }
}

if ($method === 'DELETE') {
    require_permission('downloads');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $cur = $pdo->prepare('SELECT file_path FROM downloads WHERE id = ?');
    $cur->execute([$id]);
    $existing = $cur->fetch();
    if (!$existing) json_error('Document not found', 404);

    $pdo->prepare('DELETE FROM downloads WHERE id = ?')->execute([$id]);
    delete_upload(DOWNLOAD_UPLOAD_DIR, $existing['file_path']);

    json_ok(['deleted' => $id]);
}

json_error('Method not allowed', 405);
