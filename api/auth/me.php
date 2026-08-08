<?php
require_once __DIR__ . '/../config/session.php';

$admin = current_admin();
if ($admin === null) {
    json_error('Not authenticated', 401);
}

json_ok($admin);
