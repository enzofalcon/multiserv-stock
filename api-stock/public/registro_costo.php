<?php
require_once __DIR__ . "/../src/RegistroCostoRepository.php";

header("Content-Type: application/json; charset=utf-8");

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        echo json_encode(["ok" => false, "error" => "Método no permitido"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $input = json_decode(file_get_contents("php://input"), true);

    $repo = new RegistroCostoRepository();
    $id = $repo->crearRegistroCosto(
        (int) $input["idProducto"],
        (int) $input["idProveedor"],
        (float) $input["costo"],
        (float) $input["porcentajeIVA"]
    );

    echo json_encode([
        "ok" => true,
        "message" => "Registro de costo creado",
        "idRegistroCosto" => $id
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
