<?php
require_once __DIR__ . '/config/session.php';

const UPLOAD_DIR    = __DIR__ . '/uploads/applications/';
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT    = ['pdf', 'jpg', 'jpeg', 'png'];

function app_row(array $r): array {
    return [
        'id'            => (int)$r['id'],
        'fullName'      => $r['full_name'],
        'gender'        => $r['gender'],
        'email'         => $r['email'],
        'dob'           => $r['dob'],
        'nationality'   => $r['nationality'],
        'idNumber'      => $r['id_number'],
        'school'        => $r['school'],
        'kcseIndex'     => $r['kcse_index'],
        'kcseYear'      => $r['kcse_year'],
        'grade'         => $r['grade'],
        'prevCert'      => $r['prev_cert'],
        'specialNeeds'  => $r['special_needs'],
        'studentPhone'  => $r['student_phone'],
        'guardianPhone' => $r['guardian_phone'],
        'address'       => $r['address'],
        'courseId'      => $r['course_id'] !== null ? (int)$r['course_id'] : null,
        'courseTitle'   => $r['course_title']    ?? null,
        'courseCode'    => $r['course_code']     ?? null,
        'courseLevel'   => $r['course_level']    ?? null,
        'department'    => $r['department_name'] ?? null,
        'status'        => $r['status'],
        'receivedAt'    => $r['received_at'],
    ];
}

function doc_row(array $r): array {
    return [
        'id'         => (int)$r['id'],
        'docType'    => $r['doc_type'],
        'fileName'   => $r['file_name'],
        'uploadedAt' => $r['uploaded_at'],
    ];
}

const APP_JOIN_SQL = 'SELECT a.*, c.title AS course_title, c.code AS course_code, c.level AS course_level, d.name AS department_name
    FROM applications a
    LEFT JOIN courses c ON c.id = a.course_id
    LEFT JOIN departments d ON d.id = c.department_id';

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    // Admin document download — streams the file, never exposes a raw static URL.
    if (!empty($_GET['download'])) {
        require_permission('applications');
        $stmt = $pdo->prepare('SELECT * FROM application_documents WHERE id = ?');
        $stmt->execute([(int)$_GET['download']]);
        $doc = $stmt->fetch();
        if (!$doc) json_error('Document not found', 404);

        $path = UPLOAD_DIR . basename($doc['file_path']);
        if (!is_file($path)) json_error('File is missing on the server', 404);

        $ext  = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $mime = ['pdf' => 'application/pdf', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png'][$ext]
            ?? 'application/octet-stream';

        header('Content-Type: ' . $mime);
        header('Content-Disposition: attachment; filename="' . $doc['file_name'] . '"');
        header('Content-Length: ' . filesize($path));
        readfile($path);
        exit;
    }

    require_permission('applications');

    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare(APP_JOIN_SQL . ' WHERE a.id = ?');
        $stmt->execute([(int)$_GET['id']]);
        $app = $stmt->fetch();
        if (!$app) json_error('Application not found', 404);

        $row = app_row($app);
        $dStmt = $pdo->prepare('SELECT * FROM application_documents WHERE application_id = ? ORDER BY id');
        $dStmt->execute([$app['id']]);
        $row['documents'] = array_map('doc_row', $dStmt->fetchAll());
        json_ok($row);
    }

    $apps = $pdo->query(APP_JOIN_SQL . ' ORDER BY a.received_at DESC')->fetchAll();
    json_ok(array_map('app_row', $apps));
}

if ($method === 'POST') {
    // Public submission — multipart/form-data (text fields in $_POST, files in $_FILES).
    $b = $_POST;

    $required = ['fullName', 'gender', 'email', 'dob', 'school', 'grade', 'studentPhone', 'guardianPhone', 'courseId'];
    foreach ($required as $f) {
        if (trim((string)($b[$f] ?? '')) === '') json_error(ucfirst($f) . ' is required');
    }
    if (!filter_var($b['email'], FILTER_VALIDATE_EMAIL)) json_error('Enter a valid email address');

    $courseId = (int)$b['courseId'];
    $chk = $pdo->prepare('SELECT id FROM courses WHERE id = ?');
    $chk->execute([$courseId]);
    if (!$chk->fetch()) json_error('Selected course was not found', 404);

    if (empty($_FILES['result']['name'])) json_error('KCSE Result Slip is required');
    if (empty($_FILES['id']['name']))     json_error('ID / Birth Certificate is required');

    if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);

    $pdo->beginTransaction();
    $saved = [];
    try {
        $stmt = $pdo->prepare(
            'INSERT INTO applications
             (full_name, gender, email, dob, nationality, id_number, school, kcse_index, kcse_year, grade, prev_cert, special_needs, student_phone, guardian_phone, address, course_id)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        );
        $stmt->execute([
            trim($b['fullName']), trim($b['gender']), trim($b['email']), $b['dob'],
            trim($b['nationality'] ?? '') ?: 'Kenyan', trim($b['idNumber'] ?? ''), trim($b['school']),
            trim($b['kcseIndex'] ?? ''), trim($b['kcseYear'] ?? ''), trim($b['grade']),
            trim($b['prevCert'] ?? ''), trim($b['specialNeeds'] ?? ''),
            trim($b['studentPhone']), trim($b['guardianPhone']), trim($b['address'] ?? ''),
            $courseId,
        ]);
        $appId = (int)$pdo->lastInsertId();

        $docTypes = ['result' => 'KCSE Result Slip', 'cert' => 'KCSE Certificate', 'id' => 'ID / Birth Certificate'];
        foreach ($docTypes as $key => $label) {
            if (empty($_FILES[$key]['name'])) continue;
            $file = $_FILES[$key];
            if ($file['error'] !== UPLOAD_ERR_OK) throw new RuntimeException("Upload failed for $label");
            if ($file['size'] > MAX_FILE_BYTES) throw new RuntimeException("$label exceeds the 5MB limit");

            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, ALLOWED_EXT, true)) throw new RuntimeException("$label must be a PDF, JPG or PNG file");

            $stored = 'app' . $appId . '_' . $key . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
            $dest = UPLOAD_DIR . $stored;
            if (!move_uploaded_file($file['tmp_name'], $dest)) throw new RuntimeException("Could not save $label");
            $saved[] = $dest;

            $docStmt = $pdo->prepare(
                'INSERT INTO application_documents (application_id, doc_type, file_path, file_name) VALUES (?,?,?,?)'
            );
            $docStmt->execute([$appId, $label, $stored, $file['name']]);
        }

        $pdo->commit();
        json_ok(['id' => $appId], 201);
    } catch (Throwable $e) {
        $pdo->rollBack();
        foreach ($saved as $path) { if (is_file($path)) unlink($path); }
        json_error($e->getMessage(), 400);
    }
}

if ($method === 'PUT' || $method === 'PATCH') {
    require_permission('applications');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $current = $pdo->prepare('SELECT id FROM applications WHERE id = ?');
    $current->execute([$id]);
    if (!$current->fetch()) json_error('Application not found', 404);

    $b = request_body();
    $status = $b['status'] ?? null;
    if (!in_array($status, ['pending', 'reviewed', 'accepted', 'rejected'], true)) {
        json_error('Invalid status value');
    }

    $stmt = $pdo->prepare('UPDATE applications SET status = ? WHERE id = ?');
    $stmt->execute([$status, $id]);

    $row = $pdo->prepare(APP_JOIN_SQL . ' WHERE a.id = ?');
    $row->execute([$id]);
    json_ok(app_row($row->fetch()));
}

if ($method === 'DELETE') {
    require_permission('applications');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $docs = $pdo->prepare('SELECT file_path FROM application_documents WHERE application_id = ?');
    $docs->execute([$id]);
    $paths = $docs->fetchAll(PDO::FETCH_COLUMN);

    $stmt = $pdo->prepare('DELETE FROM applications WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) json_error('Application not found', 404);

    foreach ($paths as $p) {
        $full = UPLOAD_DIR . basename($p);
        if (is_file($full)) unlink($full);
    }

    json_ok(['deleted' => $id]);
}

json_error('Method not allowed', 405);
