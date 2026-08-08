<?php
require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/lib/OfferLetter.php';
require_once __DIR__ . '/lib/Mailer.php';

const UPLOAD_DIR       = __DIR__ . '/uploads/applications/';
const OFFER_UPLOAD_DIR = __DIR__ . '/uploads/offer_letters/';
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT    = ['pdf', 'jpg', 'jpeg', 'png'];

function app_row(array $r): array {
    return [
        'id'              => (int)$r['id'],
        'referenceNumber' => $r['reference_number'],
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
        'walkIn'        => !empty($r['walk_in']),
        'hasOfferLetter'=> !empty($r['offer_letter_path']),
        'offerSentAt'   => $r['offer_sent_at'] ?? null,
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

const APP_JOIN_SQL = 'SELECT a.*, c.title AS course_title, c.code AS course_code, c.level AS course_level,
    c.duration AS course_duration, c.exam_body AS course_exam_body, d.name AS department_name
    FROM applications a
    LEFT JOIN courses c ON c.id = a.course_id
    LEFT JOIN departments d ON d.id = c.department_id';

/**
 * Generates the offer letter PDF and emails the applicant, for a row that
 * has just become "accepted" (whether via the normal accept action or a
 * walk-in application created already-accepted). No-op if this row already
 * has a letter — never regenerates or re-sends. Returns the emailSent flag,
 * or null if it was a no-op (already had a letter).
 */
function generate_and_send_offer(PDO $pdo, array $row, int $id): ?bool {
    if (!empty($row['offer_letter_path'])) return null;

    $principal = $pdo->query('SELECT name, title FROM principal WHERE id = 1')->fetch() ?: ['name' => '', 'title' => ''];
    $course = [
        'title'     => $row['course_title'] ?? 'Selected Course',
        'level'     => $row['course_level'] ?? '',
        'duration'  => $row['course_duration'] ?? '',
        'exam_body' => $row['course_exam_body'] ?? '',
    ];
    $application = [
        'full_name'        => $row['full_name'],
        'email'            => $row['email'],
        'reference_number' => $row['reference_number'],
        'kcse_index'       => $row['kcse_index'],
    ];

    if (!is_dir(OFFER_UPLOAD_DIR)) mkdir(OFFER_UPLOAD_DIR, 0755, true);
    try {
        $pdfBytes = OfferLetter::generate($application, $course, $principal);
        $fileName = 'offer_' . $id . '_' . bin2hex(random_bytes(6)) . '.pdf';
        file_put_contents(OFFER_UPLOAD_DIR . $fileName, $pdfBytes);

        // The email points to the self-service lookup page rather than
        // attaching the PDF — simpler and more reliable than trying to
        // guarantee attachment delivery through every mail provider.
        // Lookup on that page is by KCSE index number, not the reference
        // number (which only appears printed on the letter). No email on
        // file (e.g. a walk-in applicant) just means nothing is sent —
        // the letter is still generated and downloadable by the admin.
        if (!empty($application['email'])) {
            $siteUrl = rtrim(getenv('SITE_URL') ?: 'https://www.chanzeywetvc.ac.ke', '/');
            $admissionLetterUrl = $siteUrl . '/admission-letter?index=' . urlencode($application['kcse_index']);
            $emailSent = Mailer::send_offer_email($application, $admissionLetterUrl);
        } else {
            $emailSent = false;
        }

        $pdo->prepare('UPDATE applications SET offer_letter_path = ?, offer_sent_at = NOW() WHERE id = ?')
            ->execute([$fileName, $id]);
        return $emailSent;
    } catch (Throwable $e) {
        error_log('[applications.php] Offer letter generation failed for id=' . $id . ': ' . $e->getMessage());
        return false;
    }
}

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

    // Admin offer-letter download — same gated-streaming pattern.
    if (!empty($_GET['offerLetter'])) {
        require_permission('applications');
        $stmt = $pdo->prepare('SELECT reference_number, offer_letter_path FROM applications WHERE id = ?');
        $stmt->execute([(int)$_GET['offerLetter']]);
        $app = $stmt->fetch();
        if (!$app || !$app['offer_letter_path']) json_error('Offer letter not found', 404);

        $path = OFFER_UPLOAD_DIR . basename($app['offer_letter_path']);
        if (!is_file($path)) json_error('File is missing on the server', 404);

        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="Chanzeywe_Offer_Letter_' . $app['reference_number'] . '.pdf"');
        header('Content-Length: ' . filesize($path));
        readfile($path);
        exit;
    }

    // Public self-service: a student enters their KCSE index number (the
    // number they gave on their application, not the system-generated
    // reference number — that one only ever appears printed on the letter
    // itself) to check whether they were accepted, before downloading.
    // Deliberately public (no login) and deliberately vague on failure —
    // same message whether the index number doesn't exist or exists but
    // isn't accepted yet, so this can't be used to probe application
    // status/existence. If the same index number applied more than once,
    // the most recently received application is used.
    if (!empty($_GET['checkOffer'])) {
        $index = trim($_GET['checkOffer']);
        $stmt = $pdo->prepare(APP_JOIN_SQL . ' WHERE a.kcse_index = ? ORDER BY a.received_at DESC LIMIT 1');
        $stmt->execute([$index]);
        $app = $stmt->fetch();
        if (!$app || $app['status'] !== 'accepted' || !$app['offer_letter_path']) {
            json_error('No accepted admission was found for that KCSE index number. Please double-check it, or contact the college if you believe this is an error.', 404);
        }
        json_ok([
            'fullName'        => $app['full_name'],
            'kcseIndex'       => $app['kcse_index'],
            'referenceNumber' => $app['reference_number'],
            'courseTitle'     => $app['course_title'],
            'courseLevel'     => $app['course_level'],
        ]);
    }

    // Public admission letter download — same lookup, streams the PDF.
    if (!empty($_GET['downloadOffer'])) {
        $index = trim($_GET['downloadOffer']);
        $stmt = $pdo->prepare('SELECT reference_number, kcse_index, status, offer_letter_path FROM applications WHERE kcse_index = ? ORDER BY received_at DESC LIMIT 1');
        $stmt->execute([$index]);
        $app = $stmt->fetch();
        if (!$app || $app['status'] !== 'accepted' || !$app['offer_letter_path']) {
            json_error('No accepted admission was found for that KCSE index number.', 404);
        }

        $path = OFFER_UPLOAD_DIR . basename($app['offer_letter_path']);
        if (!is_file($path)) json_error('File is missing on the server', 404);

        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="Chanzeywe_Admission_Letter_' . $app['reference_number'] . '.pdf"');
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

    // Actioned applications (accepted/rejected) sink to the bottom so the
    // admin list stays focused on what still needs a decision; newest
    // first within each tier.
    $apps = $pdo->query(APP_JOIN_SQL . " ORDER BY (a.status IN ('accepted','rejected')) ASC, a.received_at DESC")->fetchAll();
    json_ok(array_map('app_row', $apps));
}

if ($method === 'POST') {
    // ── Admin-entered walk-in application ──────────────────────────
    // For a student who applied in person with hardcopy documents the
    // admin has already verified by hand — no uploads, created straight
    // into "accepted" so the offer letter is generated immediately and
    // can be handed over or downloaded on the spot.
    if (!empty($_GET['walkIn'])) {
        require_permission('applications');
        $b = request_body();

        $required = ['fullName', 'kcseIndex', 'studentPhone', 'address', 'courseId'];
        foreach ($required as $f) {
            if (trim((string)($b[$f] ?? '')) === '') json_error(ucfirst($f) . ' is required');
        }
        if (!preg_match('/^\d{11}\/\d{4}$/', trim($b['kcseIndex']))) {
            json_error('Enter the KCSE index number as 11 digits / year, e.g. 29513204036/2024');
        }
        $email = trim($b['email'] ?? '');
        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('Enter a valid email address, or leave it blank');

        $courseId = (int)$b['courseId'];
        $chk = $pdo->prepare('SELECT id FROM courses WHERE id = ?');
        $chk->execute([$courseId]);
        if (!$chk->fetch()) json_error('Selected course was not found', 404);

        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare(
                'INSERT INTO applications
                 (full_name, gender, email, dob, nationality, id_number, school, kcse_index, kcse_year, grade, prev_cert, special_needs, student_phone, guardian_phone, address, course_id, status, walk_in)
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, \'accepted\', 1)'
            );
            $stmt->execute([
                trim($b['fullName']), trim($b['gender'] ?? ''), $email, $b['dob'] ?? null,
                trim($b['nationality'] ?? '') ?: 'Kenyan', trim($b['idNumber'] ?? ''), trim($b['school'] ?? ''),
                trim($b['kcseIndex']), trim($b['kcseYear'] ?? ''), trim($b['grade'] ?? ''),
                trim($b['prevCert'] ?? ''), trim($b['specialNeeds'] ?? ''),
                trim($b['studentPhone']), trim($b['guardianPhone'] ?? '') ?: trim($b['studentPhone']), trim($b['address']),
                $courseId,
            ]);
            $appId = (int)$pdo->lastInsertId();

            $referenceNumber = 'APP/' . $appId . '/' . strtoupper(date('M')) . '/' . date('Y');
            $pdo->prepare('UPDATE applications SET reference_number = ? WHERE id = ?')->execute([$referenceNumber, $appId]);

            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            json_error($e->getMessage(), 400);
        }

        $row = $pdo->prepare(APP_JOIN_SQL . ' WHERE a.id = ?');
        $row->execute([$appId]);
        $fresh = $row->fetch();
        $emailSent = generate_and_send_offer($pdo, $fresh, $appId);

        $row->execute([$appId]);
        $result = app_row($row->fetch());
        $result['emailSent'] = $emailSent;
        json_ok($result, 201);
    }

    // Public submission — multipart/form-data (text fields in $_POST, files in $_FILES).
    $b = $_POST;

    $required = ['fullName', 'gender', 'email', 'dob', 'school', 'kcseIndex', 'grade', 'studentPhone', 'guardianPhone', 'courseId'];
    foreach ($required as $f) {
        if (trim((string)($b[$f] ?? '')) === '') json_error(ucfirst($f) . ' is required');
    }
    if (!filter_var($b['email'], FILTER_VALIDATE_EMAIL)) json_error('Enter a valid email address');
    // KCSE index number is the key used later to look up and download the
    // admission letter, so its shape is enforced here too, not just client-side.
    if (!preg_match('/^\d{11}\/\d{4}$/', trim($b['kcseIndex']))) {
        json_error('Enter your KCSE index number as 11 digits / year, e.g. 29513204036/2024');
    }

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

        // Unique, human-readable reference — e.g. APP/9/AUG/2026 — visible
        // to the applicant immediately and reused on the offer letter later.
        $referenceNumber = 'APP/' . $appId . '/' . strtoupper(date('M')) . '/' . date('Y');
        $pdo->prepare('UPDATE applications SET reference_number = ? WHERE id = ?')->execute([$referenceNumber, $appId]);

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
        json_ok(['id' => $appId, 'referenceNumber' => $referenceNumber], 201);
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

    $current = $pdo->prepare(APP_JOIN_SQL . ' WHERE a.id = ?');
    $current->execute([$id]);
    $existing = $current->fetch();
    if (!$existing) json_error('Application not found', 404);

    $b = request_body();
    $status = $b['status'] ?? null;
    if (!in_array($status, ['pending', 'reviewed', 'accepted', 'rejected'], true)) {
        json_error('Invalid status value');
    }

    $stmt = $pdo->prepare('UPDATE applications SET status = ? WHERE id = ?');
    $stmt->execute([$status, $id]);

    // First transition into "accepted" — generate the offer letter and
    // email it. Re-saving an already-accepted application never re-sends.
    $emailSent = null;
    if ($status === 'accepted' && $existing['status'] !== 'accepted') {
        $emailSent = generate_and_send_offer($pdo, $existing, $id);
    }

    $row = $pdo->prepare(APP_JOIN_SQL . ' WHERE a.id = ?');
    $row->execute([$id]);
    $result = app_row($row->fetch());
    if ($emailSent !== null) $result['emailSent'] = $emailSent;
    json_ok($result);
}

if ($method === 'DELETE') {
    require_permission('applications');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $docs = $pdo->prepare('SELECT file_path FROM application_documents WHERE application_id = ?');
    $docs->execute([$id]);
    $paths = $docs->fetchAll(PDO::FETCH_COLUMN);

    $cur = $pdo->prepare('SELECT offer_letter_path FROM applications WHERE id = ?');
    $cur->execute([$id]);
    $offerLetterPath = $cur->fetchColumn();

    $stmt = $pdo->prepare('DELETE FROM applications WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) json_error('Application not found', 404);

    foreach ($paths as $p) {
        $full = UPLOAD_DIR . basename($p);
        if (is_file($full)) unlink($full);
    }
    if ($offerLetterPath) {
        $full = OFFER_UPLOAD_DIR . basename($offerLetterPath);
        if (is_file($full)) unlink($full);
    }

    json_ok(['deleted' => $id]);
}

json_error('Method not allowed', 405);
