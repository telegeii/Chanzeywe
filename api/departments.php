<?php
require_once __DIR__ . '/config/session.php';

function dept_row(array $r): array {
    return [
        'id'           => (int)$r['id'],
        'name'         => $r['name'],
        'slug'         => $r['slug'],
        'hod'          => $r['hod'],
        'heroHeadline' => $r['hero_headline'],
        'tagline'      => $r['tagline'],
        'colorHex'     => $r['color_hex'],
        'active'       => (bool)$r['active'],
        'sortOrder'    => (int)$r['sort_order'],
        'coursesCount' => isset($r['courses_count']) ? (int)$r['courses_count'] : null,
    ];
}

function course_row(array $r): array {
    return [
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
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    // Single department by slug or id (individual department page / admin edit)
    if (!empty($_GET['slug']) || !empty($_GET['id'])) {
        if (!empty($_GET['slug'])) {
            $stmt = $pdo->prepare('SELECT * FROM departments WHERE slug = ?');
            $stmt->execute([$_GET['slug']]);
        } else {
            $stmt = $pdo->prepare('SELECT * FROM departments WHERE id = ?');
            $stmt->execute([(int)$_GET['id']]);
        }
        $dept = $stmt->fetch();
        if (!$dept) json_error('Department not found', 404);

        $row = dept_row($dept);
        $cStmt = $pdo->prepare('SELECT * FROM courses WHERE department_id = ? ORDER BY sort_order, id');
        $cStmt->execute([$dept['id']]);
        $row['courses'] = array_map('course_row', $cStmt->fetchAll());
        json_ok($row);
    }

    // List (public Courses page uses with_courses=1; admin list view doesn't need it)
    $withCourses = !empty($_GET['with_courses']);
    $sql = 'SELECT d.*, (SELECT COUNT(*) FROM courses c WHERE c.department_id = d.id) AS courses_count
            FROM departments d ORDER BY d.sort_order, d.id';
    $depts = $pdo->query($sql)->fetchAll();
    $out = array_map('dept_row', $depts);

    if ($withCourses) {
        $cStmt = $pdo->query('SELECT * FROM courses ORDER BY sort_order, id');
        $byDept = [];
        foreach ($cStmt->fetchAll() as $c) {
            $byDept[$c['department_id']][] = course_row($c);
        }
        foreach ($out as &$d) {
            $d['courses'] = $byDept[$d['id']] ?? [];
        }
        unset($d);
    }

    json_ok($out);
}

if ($method === 'POST') {
    require_permission('departments');
    $b = request_body();
    $name  = trim($b['name'] ?? '');
    $slug  = trim($b['slug'] ?? '');
    $hero  = trim($b['heroHeadline'] ?? '');
    if ($name === '')  json_error('Department name is required');
    if ($slug === '')  json_error('Slug is required');
    if ($hero === '')  json_error('Hero headline is required');

    $stmt = $pdo->prepare(
        'INSERT INTO departments (name, slug, hod, hero_headline, tagline, color_hex, active, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    try {
        $stmt->execute([
            $name, $slug,
            trim($b['hod'] ?? ''),
            $hero,
            trim($b['tagline'] ?? ''),
            $b['colorHex'] ?? '#0a3d8f',
            !empty($b['active']) ? 1 : 0,
            (int)($b['sortOrder'] ?? 0),
        ]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') json_error('A department with that slug already exists', 409);
        throw $e;
    }

    $id = (int)$pdo->lastInsertId();
    $row = $pdo->prepare('SELECT * FROM departments WHERE id = ?');
    $row->execute([$id]);
    json_ok(dept_row($row->fetch()), 201);
}

if ($method === 'PUT' || $method === 'PATCH') {
    require_permission('departments');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $current = $pdo->prepare('SELECT * FROM departments WHERE id = ?');
    $current->execute([$id]);
    $existing = $current->fetch();
    if (!$existing) json_error('Department not found', 404);

    // Partial update: this endpoint serves both the full edit-modal Save
    // (all fields present) and the quick visibility-toggle action (only
    // `active` present) — only fields actually sent are changed.
    // name/slug/colorHex intentionally not updatable — see plan notes on
    // why department identity (slug) drives the fixed client icon/colour lookup.
    $b = request_body();
    $hod       = array_key_exists('hod', $b)          ? trim($b['hod'])          : $existing['hod'];
    $hero      = array_key_exists('heroHeadline', $b)  ? trim($b['heroHeadline']) : $existing['hero_headline'];
    $tagline   = array_key_exists('tagline', $b)       ? trim($b['tagline'])      : $existing['tagline'];
    $active    = array_key_exists('active', $b)        ? (!empty($b['active']) ? 1 : 0) : $existing['active'];
    $sortOrder = array_key_exists('sortOrder', $b)     ? (int)$b['sortOrder']     : $existing['sort_order'];

    if ($hero === '') json_error('Hero headline is required');

    $stmt = $pdo->prepare(
        'UPDATE departments SET hod=?, hero_headline=?, tagline=?, active=?, sort_order=? WHERE id=?'
    );
    $stmt->execute([$hod, $hero, $tagline, $active, $sortOrder, $id]);

    $row = $pdo->prepare('SELECT * FROM departments WHERE id = ?');
    $row->execute([$id]);
    json_ok(dept_row($row->fetch()));
}

if ($method === 'DELETE') {
    require_permission('departments');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $stmt = $pdo->prepare('DELETE FROM departments WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) json_error('Department not found', 404);

    json_ok(['deleted' => $id]);
}

json_error('Method not allowed', 405);
