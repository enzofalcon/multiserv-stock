<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../src/Database.php';

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();

$input = json_decode(file_get_contents('php://input'), true);

$idProducto   = $input['idProducto'] ?? null;
$idProveedor  = $input['idProveedor'] ?? null;
$costo        = $input['costo'] ?? null;
$iva          = $input['porcentajeIVA'] ?? null;

if (!$idProducto || !$idProveedor || !$costo || $costo <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

try {
    $stmt = $conn->prepare("
        INSERT INTO registro_costo
        (idProducto, idProveedor, costo, fechaHora, porcentajeIVA)
        VALUES
        (:idProducto, :idProveedor, :costo, NOW(), :iva)
    ");

    $stmt->execute([
        ':idProducto'  => $idProducto,
        ':idProveedor' => $idProveedor,
        ':costo'       => $costo,
        ':iva'         => $iva
    ]);

    echo json_encode(['success' => true]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

