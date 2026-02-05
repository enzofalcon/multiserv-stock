<?php
require_once __DIR__ . "/../src/CostosRepository.php";

header("Content-Type: application/json; charset=utf-8");

try {
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
        http_response_code(405);
        echo json_encode(["ok" => false, "error" => "Método no permitido"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (!isset($_GET["idProducto"])) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "Falta idProducto"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $idProducto = (int) $_GET["idProducto"];
    $repo = new CostosRepository();

    $ultimo = isset($_GET["ultimo"]) && (int)$_GET["ultimo"] === 1;

    if ($ultimo) {
        $data = $repo->getUltimoPorProducto($idProducto);
    } else {
        $data = $repo->getHistorialPorProducto($idProducto);
    }

    echo json_encode(["ok" => true, "data" => $data], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
