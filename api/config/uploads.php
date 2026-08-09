<?php
/**
 * Shared file-upload helper for admin-managed public assets (hero images,
 * principal photo, blog covers, tender/career/download PDFs). These are
 * all intentionally public files — unlike application_documents, which
 * hold personal applicant data and are served through a gated endpoint.
 */

/**
 * Confirms a file's actual content matches its claimed extension — the
 * extension whitelist alone only checks the filename, which is entirely
 * attacker-controlled (a script renamed to photo.jpg still has an
 * allowed extension). Uses real content sniffing, never the browser-
 * supplied $_FILES[...]['type'], which is just as untrustworthy as the
 * filename.
 */
function verify_upload_content(string $tmpPath, string $ext): void {
    $images = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp'];

    if (isset($images[$ext])) {
        $info = @getimagesize($tmpPath);
        if ($info === false || $info['mime'] !== $images[$ext]) {
            throw new RuntimeException('File is not a valid ' . strtoupper($ext) . ' image');
        }
        return;
    }

    if ($ext === 'pdf') {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime  = $finfo ? finfo_file($finfo, $tmpPath) : false;
        if ($finfo) finfo_close($finfo);
        if ($mime !== 'application/pdf') {
            throw new RuntimeException('File is not a valid PDF');
        }
    }
}

/** Validates and stores an uploaded file. Returns the stored filename (not the full path). */
function save_upload(array $file, string $dir, array $allowedExt, int $maxBytes, string $prefix): string {
    if ($file['error'] !== UPLOAD_ERR_OK) throw new RuntimeException('File upload failed');
    if ($file['size'] > $maxBytes) throw new RuntimeException('File exceeds the maximum allowed size');

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedExt, true)) {
        throw new RuntimeException('File type not allowed (' . implode(', ', $allowedExt) . ' only)');
    }
    verify_upload_content($file['tmp_name'], $ext);

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
