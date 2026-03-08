<?php
require_once __DIR__ . "/../src/Database.php";
require_once __DIR__ . "/../src/StockRepository.php";

header("Content-Type: application/json; charset=utf-8");

try {

    $conn = Database::getConnection();
    $repo = new StockRepository($conn);

    $method = $_SERVER["REQUEST_METHOD"];

    if ($method === "GET") {

        $numSucursal = isset($_GET["sucursal"]) ? (int)$_GET["sucursal"] : null;

        echo json_encode([
            "ok" => true,
            "data" => $repo->getStockTotalByProducto($numSucursal)
        ], JSON_UNESCAPED_UNICODE);

    } elseif ($method === "POST") {

        $input = json_decode(file_get_contents("php://input"), true);

        $repo->setDisponibilidad(
            (int) $input["idProducto"],
            (int) $input["idSucursal"],
            (int) $input["cantidad"]
        );

        echo json_encode([
            "ok" => true,
            "message" => "Disponibilidad registrada"
        ], JSON_UNESCAPED_UNICODE);

    } else {
        http_response_code(405);
        echo json_encode(["ok" => false, "error" => "Método no permitido"], JSON_UNESCAPED_UNICODE);
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}