<?php
/**
 * Shared file-upload helper for admin-managed public assets (hero images,
 * principal photo, blog covers, tender/career/download PDFs). These are
 * all intentionally public files — unlike application_documents, which
 * hold personal applicant data and are served through a gated endpoint.
 */

/** Validates and stores an uploaded file. Returns the stored filename (not the full path). */
function save_upload(array $file, string $dir, array $allowedExt, int $maxBytes, string $prefix): string {
    if ($file['error'] !== UPLOAD_ERR_OK) throw new RuntimeException('File upload failed');
    if ($file['size'] > $maxBytes) throw new RuntimeException('File exceeds the maximum allowed size');

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExt, true)) {
        throw new RuntimeException('File type not allowed (' . implode(', ', $allowedExt) . ' only)');
    }

    if (!is_dir($dir)) mkdir($dir, 0755, true);

    $stored = $prefix . '_' . date('YmdHis') . '_' . bin2hex(random_bytes(5)) . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], $dir . $stored)) {
        throw new RuntimeException('Could not save uploaded file');
    }
    return $stored;
}

function delete_upload(string $dir, ?string $filename): void {
    if (!$filename) return;
    $path = $dir . basename($filename);
    if (is_file($path)) unlink($path);
}
