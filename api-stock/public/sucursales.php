<?php

require_once __DIR__ . '/../src/Database.php';

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();

$method = $_SERVER['REQUEST_METHOD'];


// ===================================================
// GET → listar sucursales
// ===================================================
if ($method === 'GET') {

    $stmt = $conn->query("
        SELECT 
            idSucursal,
            numSucursal,
            correo,
            telefono,
            estado
        FROM sucursal
        ORDER BY numSucursal
    ");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}


// ===================================================
// POST → agregar sucursal
// ===================================================
if ($method === 'POST') {

    $input = json_decode(file_get_contents('php://input'), true);

    $numSucursal = $input['numSucursal'] ?? null;
    $correo      = $input['correo'] ?? null;
    $telefono    = $input['telefono'] ?? null;

    if (!$numSucursal || !$correo || !$telefono) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos inválidos']);
        exit;
    }

    try {
        $stmt = $conn->prepare("
            INSERT INTO sucursal (numSucursal, correo, telefono)
            VALUES (:num, :correo, :telefono)
        ");

        $stmt->execute([
            ':num'      => $numSucursal,
            ':correo'   => $correo,
            ':telefono' => $telefono
        ]);

        echo json_encode(['success' => true]);

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }

    exit;
}


// ===================================================
// Método no permitido
// ===================================================
http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);