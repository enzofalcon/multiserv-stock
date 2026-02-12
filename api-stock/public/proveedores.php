<?php

require_once __DIR__ . '/../src/Database.php';

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $conn->query("
        SELECT idProveedor, nombre, correo, rut
        FROM proveedor
        ORDER BY nombre
    ");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        $nombre = $input['nombre'] ?? null;
        $correo = $input['correo'] ?? null;
        $rut = $input['rut'] ?? null;

        if (!$nombre || !$correo || !$rut) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos inválidos']);
            exit;
        }

        $stmt = $conn->prepare("
            INSERT INTO proveedor (nombre, correo, rut)
            VALUES (:nombre, :correo, :rut)
        ");

        $stmt->execute([
            ':nombre' => $nombre,
            ':correo' => $correo,
            ':rut' => $rut
        ]);

        echo json_encode([
            'success' => true,
            'idProveedor' => $conn->lastInsertId()   // 🔥 IMPORTANTE
        ]);
        exit;

    } catch (Throwable $e) {

        // Captura errores de SQL: duplicados, formato, etc.
        http_response_code(500);
        echo json_encode([
            'error' => 'Error SQL: ' . $e->getMessage()
        ]);
        exit;
    }
}


http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
