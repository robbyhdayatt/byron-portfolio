<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

$ADMIN_USER = 'borpabloo';
$ADMIN_PASS_HASH = password_hash('2904', PASSWORD_BCRYPT);
$DATA_FILE = __DIR__ . '/content.json';
$UPLOAD_DIR = __DIR__ . '/../assets/images/';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

if ($action === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if ($username === 'borpabloo' && $password === '2904') {
        $_SESSION['admin_logged_in'] = true;
        echo json_encode(['success' => true, 'message' => 'Login berhasil!']);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Username atau Password salah!']);
    }
    exit;
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logout berhasil']);
    exit;
}

if ($action === 'check') {
    echo json_encode(['authenticated' => isLoggedIn()]);
    exit;
}

if ($action === 'get') {
    if (file_exists($DATA_FILE)) {
        echo file_get_contents($DATA_FILE);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'content.json not found']);
    }
    exit;
}

// Protected Actions (require authentication)
if (!isLoggedIn()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Akses ditolak. Silakan login lebih dulu.']);
    exit;
}

if ($action === 'save') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if ($data === null) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Format JSON tidak valid']);
        exit;
    }

    if (file_put_contents($DATA_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(['success' => true, 'message' => 'Data berhasil disimpan!']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal menulis file content.json']);
    }
    exit;
}

if ($action === 'upload') {
    if (!isset($_FILES['file'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Tidak ada file yang diunggah']);
        exit;
    }

    $file = $_FILES['file'];
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $allowed)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Format file tidak didukung! Guna (JPG, PNG, WEBP, SVG)']);
        exit;
    }

    if (!is_dir($UPLOAD_DIR)) {
        mkdir($UPLOAD_DIR, 0755, true);
    }

    $newFilename = 'upload_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
    $targetPath = $UPLOAD_DIR . $newFilename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $webUrl = './assets/images/' . $newFilename;
        echo json_encode(['success' => true, 'url' => $webUrl, 'message' => 'Gambar berhasil diupload!']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan gambar di server']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Action tidak valid']);
