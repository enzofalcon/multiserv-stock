<?php

require_once __DIR__ . '/../src/Database.php';

header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();

    $stmt = $conn->query("
        SELECT idSucursal, numSucursal
        FROM sucursal
        WHERE estado = 'activa'
        ORDER BY numSucursal
    ");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
