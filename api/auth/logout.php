<?php
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

start_session();
$_SESSION = [];
session_destroy();

json_ok(['loggedOut' => true]);
