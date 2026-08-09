<?php
/**
 * Uniform JSON response envelope for every endpoint.
 */

header('Content-Type: application/json; charset=utf-8');

/**
 * PHP warnings/notices (not caught by set_exception_handler below, which
 * only sees thrown Throwables) must never be echoed into what's supposed
 * to be a clean JSON body — that both leaks file paths and breaks the
 * response for every client. Default to production-safe (hidden, but
 * still logged); set APP_ENV=development in api/config/.env for local
 * debugging to see them inline instead.
 */
$isDev = getenv('APP_ENV') === 'development';
ini_set('display_errors', $isDev ? '1' : '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

/**
 * Never let a raw PHP/PDO error (with file paths, query text, stack trace)
 * reach the client. Log the real error server-side and return a generic
 * message instead.
 */
set_exception_handler(function (Throwable $e): void {
    error_log('[chanzeywe-api] Uncaught ' . get_class($e) . ': ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode(['success' => false, 'error' => 'Internal server error']);
    exit;
});

function json_ok($data, int $status = 200): never {
    http_response_code($status);
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

function json_error(string $message, int $status = 400): never {
    http_response_code($status);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}

/** Decode the JSON request body, or [] if empty/invalid. */
function request_body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}
