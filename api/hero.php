<?php
require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/uploads.php';

const HERO_UPLOAD_DIR  = __DIR__ . '/uploads/hero/';
const HERO_ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp'];
const HERO_MAX_BYTES   = 8 * 1024 * 1024;

function hero_row(array $r): array {
    return [
        'id'        => (int)$r['id'],
        'eyebrow'   => $r['eyebrow'],
        'headline'  => $r['headline'],
        'subtitle'  => $r['subtitle'],
        'ctaLabel'  => $r['cta_label'],
        'ctaLink'   => $r['cta_link'],
        'image'     => $r['image_path'] ? '/api/uploads/hero/' . $r['image_path'] : null,
        'active'    => (bool)$r['active'],
        'sortOrder' => (int)$r['sort_order'],
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    $sql = 'SELECT * FROM hero_slides';
    if (!empty($_GET['active'])) $sql .= ' WHERE active = 1';
    $sql .= ' ORDER BY sort_order, id';
    $rows = $pdo->query($sql)->fetchAll();
    json_ok(array_map('hero_row', $rows));
}

if ($method === 'POST') {
    require_permission('hero');
    $b  = $_POST;
    $id = !empty($b['id']) ? (int)$b['id'] : null;

    try {
        if ($id) {
            $cur = $pdo->prepare('SELECT * FROM hero_slides WHERE id = ?');
            $cur->execute([$id]);
            $existing = $cur->fetch();
            if (!$existing) json_error('Slide not found', 404);

            $eyebrow   = array_key_exists('eyebrow', $b)   ? trim($b['eyebrow'])   : $existing['eyebrow'];
            $headline  = array_key_exists('headline', $b)  ? trim($b['headline'])  : $existing['headline'];
            $subtitle  = array_key_exists('subtitle', $b)  ? trim($b['subtitle'])  : $existing['subtitle'];
            $ctaLabel  = array_key_exists('ctaLabel', $b)  ? trim($b['ctaLabel'])  : $existing['cta_label'];
            $ctaLink   = array_key_exists('ctaLink', $b)   ? trim($b['ctaLink'])   : $existing['cta_link'];
            $active    = array_key_exists('active', $b)    ? (!empty($b['active']) && $b['active'] !== '0' ? 1 : 0) : $existing['active'];
            $sortOrder = array_key_exists('sortOrder', $b) ? (int)$b['sortOrder']  : $existing['sort_order'];

            if ($headline === '') json_error('Headline is required');

            $imagePath = $existing['image_path'];
            if (!empty($_FILES['image']['name'])) {
                $imagePath = save_upload($_FILES['image'], HERO_UPLOAD_DIR, HERO_ALLOWED_EXT, HERO_MAX_BYTES, 'slide');
                delete_upload(HERO_UPLOAD_DIR, $existing['image_path']);
            } elseif (!empty($b['removeImage'])) {
                delete_upload(HERO_UPLOAD_DIR, $existing['image_path']);
                $imagePath = null;
            }

            $stmt = $pdo->prepare(
                'UPDATE hero_slides SET eyebrow=?, headline=?, subtitle=?, cta_label=?, cta_link=?, image_path=?, active=?, sort_order=? WHERE id=?'
            );
            $stmt->execute([$eyebrow, $headline, $subtitle, $ctaLabel, $ctaLink, $imagePath, $active, $sortOrder, $id]);

            $row = $pdo->prepare('SELECT * FROM hero_slides WHERE id = ?');
            $row->execute([$id]);
            json_ok(hero_row($row->fetch()));
        }

        // Create
        $headline = trim($b['headline'] ?? '');
        if ($headline === '') json_error('Headline is required');

        $maxOrder = (int)$pdo->query('SELECT COALESCE(MAX(sort_order), 0) FROM hero_slides')->fetchColumn();

        $imagePath = null;
        if (!empty($_FILES['image']['name'])) {
            $imagePath = save_upload($_FILES['image'], HERO_UPLOAD_DIR, HERO_ALLOWED_EXT, HERO_MAX_BYTES, 'slide');
        }

        $stmt = $pdo->prepare(
            'INSERT INTO hero_slides (eyebrow, headline, subtitle, cta_label, cta_link, image_path, active, sort_order)
             VALUES (?,?,?,?,?,?,?,?)'
        );
        $stmt->execute([
            trim($b['eyebrow'] ?? ''), $headline, trim($b['subtitle'] ?? ''),
            trim($b['ctaLabel'] ?? '') ?: 'Learn More', trim($b['ctaLink'] ?? '') ?: '/',
            $imagePath, !empty($b['active']) && $b['active'] !== '0' ? 1 : 0, $maxOrder + 1,
        ]);

        $newId = (int)$pdo->lastInsertId();
        $row = $pdo->prepare('SELECT * FROM hero_slides WHERE id = ?');
        $row->execute([$newId]);
        json_ok(hero_row($row->fetch()), 201);
    } catch (RuntimeException $e) {
        json_error($e->getMessage(), 400);
    }
}

if ($method === 'DELETE') {
    require_permission('hero');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $cur = $pdo->prepare('SELECT image_path FROM hero_slides WHERE id = ?');
    $cur->execute([$id]);
    $existing = $cur->fetch();
    if (!$existing) json_error('Slide not found', 404);

    $pdo->prepare('DELETE FROM hero_slides WHERE id = ?')->execute([$id]);
    delete_upload(HERO_UPLOAD_DIR, $existing['image_path']);

    json_ok(['deleted' => $id]);
}

json_error('Method not allowed', 405);
