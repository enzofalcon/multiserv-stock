<?php
require_once "../middleware/auth.php";
require_once "../src/database.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/ProductRepository.php';
require_once __DIR__ . '/../src/StockRepository.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = new Database();
    $conn = $db->getConnection();

    $productRepo = new ProductRepository($conn);
    $stockRepo   = new StockRepository($conn);

    // =========================
    // GET – LISTADO DE PRODUCTOS
    // =========================
    if ($method === 'GET') {

        $search = $_GET['search'] ?? null;

        $productos = $productRepo->findAll($search);
        $resultado = [];

        foreach ($productos as $producto) {
        $stockTotal = $stockRepo->getStockTotalByProducto($producto['idProducto']);

        $resultado[] = [
            'id'          => $producto['idProducto'],
            'descripcion' => $producto['descripcion'],
            'stock_total' => $stockTotal
        ];
        }

        echo json_encode($resultado);
        exit;
    }

    // =========================
    // POST – ALTA DE PRODUCTO
    // =========================
    if ($method === 'POST') {

        $input = json_decode(file_get_contents('php://input'), true);

        if (
            !isset($input['descripcion']) ||
            trim($input['descripcion']) === ''
        ) {
            http_response_code(400);
            echo json_encode([
                'error' => 'La descripción es obligatoria'
            ]);
            exit;
        }

        $id = $productRepo->create($input['descripcion']);

        echo json_encode([
            'success' => true,
            'id' => $id
        ]);
        exit;
    }

    // =========================
    // MÉTODO NO PERMITIDO
    // =========================
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
