<?php
/**
 * Minimal .env loader — no dependency needed for a handful of KEY=VALUE
 * lines. Loads api/config/.env once per request if present; silently does
 * nothing if it's missing (e.g. a fresh checkout before it's been created).
 * Values become available via getenv(), matching how db.php already reads
 * DB_* — this just gives it (and Mailer.php) something to read from.
 */
function load_env(): void {
    static $loaded = false;
    if ($loaded) return;
    $loaded = true;

    $path = __DIR__ . '/.env';
    if (!is_file($path)) return;

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (!str_contains($line, '=')) continue;

        [$key, $value] = explode('=', $line, 2);
        $key   = trim($key);
        $value = trim($value);
        // Strip matching surrounding quotes, if any.
        if (strlen($value) >= 2 && $value[0] === $value[-1] && ($value[0] === '"' || $value[0] === "'")) {
            $value = substr($value, 1, -1);
        }

        putenv("$key=$value");
    }
}

load_env();
