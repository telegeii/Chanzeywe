<?php
require_once __DIR__ . '/config/session.php';

const LEVELS = ['Level 4', 'Level 5', 'Level 6'];

function course_row(array $r): array {
    $out = [
        'id'           => (int)$r['id'],
        'code'         => $r['code'],
        'title'        => $r['title'],
        'departmentId' => (int)$r['department_id'],
        'level'        => $r['level'],
        'duration'     => $r['duration'],
        'examBody'     => $r['exam_body'],
        'requirement'  => $r['requirement'],
        'sortOrder'    => (int)$r['sort_order'],
    ];
    if (isset($r['dept_name'])) {
        $out['department'] = [
            'id'   => (int)$r['department_id'],
            'name' => $r['dept_name'],
            'slug' => $r['dept_slug'],
        ];
    }
    return $out;
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT * FROM courses WHERE id = ?');
        $stmt->execute([(int)$_GET['id']]);
        $c = $stmt->fetch();
        if (!$c) json_error('Course not found', 404);
        json_ok(course_row($c));
    }

    $sql = 'SELECT c.*, d.name AS dept_name, d.slug AS dept_slug
            FROM courses c JOIN departments d ON d.id = c.department_id';
    $params = [];
    if (!empty($_GET['department_id'])) {
        $sql .= ' WHERE c.department_id = ?';
        $params[] = (int)$_GET['department_id'];
    }
    $sql .= ' ORDER BY d.sort_order, c.sort_order, c.id';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    json_ok(array_map('course_row', $stmt->fetchAll()));
}

if ($method === 'POST') {
    require_permission('courses');
    $b = request_body();
    $code   = trim($b['code'] ?? '');
    $title  = trim($b['title'] ?? '');
    $deptId = (int)($b['departmentId'] ?? 0);
    $level  = $b['level'] ?? '';

    if ($code === '')  json_error('Course code is required');
    if ($title === '') json_error('Course title is required');
    if (!$deptId)       json_error('Department is required');
    if (!in_array($level, LEVELS, true)) json_error('Level must be one of: ' . implode(', ', LEVELS));

    $deptCheck = $pdo->prepare('SELECT id FROM departments WHERE id = ?');
    $deptCheck->execute([$deptId]);
    if (!$deptCheck->fetch()) json_error('Department not found', 404);

    $stmt = $pdo->prepare(
        'INSERT INTO courses (code, title, department_id, level, duration, exam_body, requirement, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $code, $title, $deptId, $level,
        trim($b['duration'] ?? ''),
        trim($b['examBody'] ?? 'CDACC'),
        trim($b['requirement'] ?? ''),
        (int)($b['sortOrder'] ?? 0),
    ]);

    $id = (int)$pdo->lastInsertId();
    $row = $pdo->prepare('SELECT * FROM courses WHERE id = ?');
    $row->execute([$id]);
    json_ok(course_row($row->fetch()), 201);
}

if ($method === 'PUT' || $method === 'PATCH') {
    require_permission('courses');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $current = $pdo->prepare('SELECT * FROM courses WHERE id = ?');
    $current->execute([$id]);
    $existing = $current->fetch();
    if (!$existing) json_error('Course not found', 404);

    $b = request_body();
    $code   = array_key_exists('code', $b)         ? trim($b['code'])  : $existing['code'];
    $title  = array_key_exists('title', $b)        ? trim($b['title']) : $existing['title'];
    $deptId = array_key_exists('departmentId', $b)  ? (int)$b['departmentId'] : (int)$existing['department_id'];
    $level  = array_key_exists('level', $b)        ? $b['level']       : $existing['level'];

    if ($code === '')  json_error('Course code is required');
    if ($title === '') json_error('Course title is required');
    if (!in_array($level, LEVELS, true)) json_error('Level must be one of: ' . implode(', ', LEVELS));

    $deptCheck = $pdo->prepare('SELECT id FROM departments WHERE id = ?');
    $deptCheck->execute([$deptId]);
    if (!$deptCheck->fetch()) json_error('Department not found', 404);

    $stmt = $pdo->prepare(
        'UPDATE courses SET code=?, title=?, department_id=?, level=?, duration=?, exam_body=?, requirement=?, sort_order=? WHERE id=?'
    );
    $stmt->execute([
        $code, $title, $deptId, $level,
        array_key_exists('duration', $b)    ? trim($b['duration'])    : $existing['duration'],
        array_key_exists('examBody', $b)    ? trim($b['examBody'])    : $existing['exam_body'],
        array_key_exists('requirement', $b) ? trim($b['requirement']) : $existing['requirement'],
        array_key_exists('sortOrder', $b)   ? (int)$b['sortOrder']    : $existing['sort_order'],
        $id,
    ]);

    $row = $pdo->prepare('SELECT * FROM courses WHERE id = ?');
    $row->execute([$id]);
    json_ok(course_row($row->fetch()));
}

if ($method === 'DELETE') {
    require_permission('courses');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $stmt = $pdo->prepare('DELETE FROM courses WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) json_error('Course not found', 404);

    json_ok(['deleted' => $id]);
}

json_error('Method not allowed', 405);
