<?php
require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/uploads.php';

const BLOG_UPLOAD_DIR  = __DIR__ . '/uploads/blog/';
const BLOG_ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp'];
const BLOG_MAX_BYTES   = 8 * 1024 * 1024;

function blog_row(array $r): array {
    return [
        'id'        => (int)$r['id'],
        'title'     => $r['title'],
        'category'  => $r['category'],
        'author'    => $r['author'],
        'date'      => $r['published_date'],
        'location'  => $r['location'],
        'excerpt'   => $r['excerpt'],
        'body'      => $r['body'],
        'image'     => $r['image_path'] ? '/api/uploads/blog/' . $r['image_path'] : null,
        'published' => (bool)$r['published'],
    ];
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo    = db();

if ($method === 'GET') {
    // Admin (logged in) sees everything via ?all=1; the public site only
    // ever asks for published posts.
    if (!empty($_GET['all'])) {
        require_permission('blog');
        $rows = $pdo->query('SELECT * FROM blog_posts ORDER BY published_date DESC, id DESC')->fetchAll();
        json_ok(array_map('blog_row', $rows));
    }

    if (!empty($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT * FROM blog_posts WHERE id = ? AND published = 1');
        $stmt->execute([(int)$_GET['id']]);
        $post = $stmt->fetch();
        if (!$post) json_error('Post not found', 404);
        json_ok(blog_row($post));
    }

    $rows = $pdo->query('SELECT * FROM blog_posts WHERE published = 1 ORDER BY published_date DESC, id DESC')->fetchAll();
    json_ok(array_map('blog_row', $rows));
}

if ($method === 'POST') {
    require_permission('blog');
    $b  = $_POST;
    $id = !empty($b['id']) ? (int)$b['id'] : null;

    try {
        if ($id) {
            $cur = $pdo->prepare('SELECT * FROM blog_posts WHERE id = ?');
            $cur->execute([$id]);
            $existing = $cur->fetch();
            if (!$existing) json_error('Post not found', 404);

            $title     = array_key_exists('title', $b)     ? trim($b['title'])     : $existing['title'];
            $category  = array_key_exists('category', $b)  ? trim($b['category'])  : $existing['category'];
            $author    = array_key_exists('author', $b)    ? trim($b['author'])    : $existing['author'];
            $date      = array_key_exists('date', $b)      ? $b['date']            : $existing['published_date'];
            $location  = array_key_exists('location', $b)  ? trim($b['location'])  : $existing['location'];
            $excerpt   = array_key_exists('excerpt', $b)   ? trim($b['excerpt'])   : $existing['excerpt'];
            $body      = array_key_exists('body', $b)      ? trim($b['body'])      : $existing['body'];
            $published = array_key_exists('published', $b) ? (!empty($b['published']) && $b['published'] !== '0' ? 1 : 0) : $existing['published'];

            if ($title === '') json_error('Post title is required');

            $imagePath = $existing['image_path'];
            if (!empty($_FILES['image']['name'])) {
                $imagePath = save_upload($_FILES['image'], BLOG_UPLOAD_DIR, BLOG_ALLOWED_EXT, BLOG_MAX_BYTES, 'post');
                delete_upload(BLOG_UPLOAD_DIR, $existing['image_path']);
            }

            $stmt = $pdo->prepare(
                'UPDATE blog_posts SET title=?, category=?, author=?, published_date=?, location=?, excerpt=?, body=?, image_path=?, published=? WHERE id=?'
            );
            $stmt->execute([$title, $category, $author, $date, $location, $excerpt, $body, $imagePath, $published, $id]);

            $row = $pdo->prepare('SELECT * FROM blog_posts WHERE id = ?');
            $row->execute([$id]);
            json_ok(blog_row($row->fetch()));
        }

        // Create
        $title = trim($b['title'] ?? '');
        if ($title === '') json_error('Post title is required');

        $imagePath = null;
        if (!empty($_FILES['image']['name'])) {
            $imagePath = save_upload($_FILES['image'], BLOG_UPLOAD_DIR, BLOG_ALLOWED_EXT, BLOG_MAX_BYTES, 'post');
        }

        $stmt = $pdo->prepare(
            'INSERT INTO blog_posts (title, category, author, published_date, location, excerpt, body, image_path, published)
             VALUES (?,?,?,?,?,?,?,?,?)'
        );
        $stmt->execute([
            $title,
            trim($b['category'] ?? '') ?: 'News',
            trim($b['author'] ?? '') ?: 'Admin',
            $b['date'] ?? date('Y-m-d'),
            trim($b['location'] ?? '') ?: 'Vihiga, Kenya',
            trim($b['excerpt'] ?? ''),
            trim($b['body'] ?? ''),
            $imagePath,
            !empty($b['published']) && $b['published'] !== '0' ? 1 : 0,
        ]);

        $newId = (int)$pdo->lastInsertId();
        $row = $pdo->prepare('SELECT * FROM blog_posts WHERE id = ?');
        $row->execute([$newId]);
        json_ok(blog_row($row->fetch()), 201);
    } catch (RuntimeException $e) {
        json_error($e->getMessage(), 400);
    }
}

if ($method === 'DELETE') {
    require_permission('blog');
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) json_error('Missing id');

    $cur = $pdo->prepare('SELECT image_path FROM blog_posts WHERE id = ?');
    $cur->execute([$id]);
    $existing = $cur->fetch();
    if (!$existing) json_error('Post not found', 404);

    $pdo->prepare('DELETE FROM blog_posts WHERE id = ?')->execute([$id]);
    delete_upload(BLOG_UPLOAD_DIR, $existing['image_path']);

    json_ok(['deleted' => $id]);
}

json_error('Method not allowed', 405);
