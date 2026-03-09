<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "../middleware/auth.php";
require_once "../src/RegistroCostoRepository.php";

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

$idProducto  = $input['idProducto'] ?? null;
$idProveedor = $input['idProveedor'] ?? null;
$costo       = $input['costo'] ?? null;
$iva         = $input['porcentajeIVA'] ?? 0;

if (!$idProducto || !$idProveedor || $costo === null || $costo <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit;
}

try {

    $repo = new RegistroCostoRepository();

    $id = $repo->crearRegistroCosto(
        (int)$idProducto,
        (int)$idProveedor,
        (float)$costo,
        (float)$iva
    );

    echo json_encode([
        'success' => true,
        'id' => $id
    ]);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'error' => $e->getMessage()
    ]);
}