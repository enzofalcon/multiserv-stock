<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../src/Database.php';

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();

$method = $_SERVER['REQUEST_METHOD'];


try {

    // ============================
    // GET - Ver disponibilidad
    // ============================
    if ($method === 'GET') {

        $stmt = $conn->query("
            SELECT
                d.idProducto,
                d.idSucursal,
                s.numSucursal,
                d.cantidad
            FROM disponibilidad d
            JOIN sucursal s ON s.idSucursal = d.idSucursal
            ORDER BY d.idProducto, s.numSucursal
        ");

        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // ============================
    // POST - Carga inicial de stock
    // ============================
    if ($method === 'POST') {

        $input = json_decode(file_get_contents('php://input'), true);

        $idProducto = $input['idProducto'] ?? null;
        $idSucursal = $input['idSucursal'] ?? null;
        $cantidad   = $input['cantidad'] ?? null;

        if (!$idProducto || !$idSucursal || $cantidad === null || $cantidad < 0) {
            http_response_code(400);
            echo json_encode([
                'error' => 'Datos inválidos'
            ]);
            exit;
        }

        // Verificar si ya existe disponibilidad
        $stmt = $conn->prepare("
            SELECT cantidad
            FROM disponibilidad
            WHERE idProducto = :idProducto
              AND idSucursal = :idSucursal
        ");

        $stmt->execute([
            ':idProducto' => $idProducto,
            ':idSucursal' => $idSucursal
        ]);

        if ($stmt->fetch()) {
            // UPDATE (set)
            $stmt = $conn->prepare("
                UPDATE disponibilidad
                SET cantidad = :cantidad
                WHERE idProducto = :idProducto
                  AND idSucursal = :idSucursal
            ");
        } else {
            // INSERT
            $stmt = $conn->prepare("
                INSERT INTO disponibilidad
                (idProducto, idSucursal, cantidad)
                VALUES
                (:idProducto, :idSucursal, :cantidad)
            ");
        }

        $stmt->execute([
            ':idProducto' => $idProducto,
            ':idSucursal' => $idSucursal,
            ':cantidad'   => $cantidad
        ]);

        echo json_encode([
            'success' => true
        ]);
        exit;
    }

    // ============================
    // Método no permitido
    // ============================
    http_response_code(405);
    echo json_encode([
        'error' => 'Método no permitido'
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
