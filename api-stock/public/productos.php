<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/ProductRepository.php';
require_once __DIR__ . '/../src/StockRepository.php';

header('Content-Type: application/json');

try {
    $db = new Database();
    $conn = $db->getConnection();

    $productRepo = new ProductRepository($conn);
    $stockRepo   = new StockRepository($conn);

    $productos = $productRepo->findAll();

    $resultado = [];

    foreach ($productos as $producto) {
        $stockTotal = $stockRepo->getStockTotalByProducto($producto['id']);
        $resultado[] = [
            'id'          => $producto['id'],
            'descripcion' => $producto['descripcion'],
            'stock_total' => $stockTotal
        ];

    }

    echo json_encode($resultado);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
