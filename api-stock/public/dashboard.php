<?php
require_once "../middleware/auth.php";

require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/ProductRepository.php';
require_once __DIR__ . '/../src/StockRepository.php';

header('Content-Type: application/json');

try {

    $db = new Database();
    $conn = $db->getConnection();

    $productRepo = new ProductRepository($conn);
    $stockRepo   = new StockRepository($conn);

    // ===============================
    // PRODUCTOS
    // ===============================

    $productos = $productRepo->findAll();

    $totalProductos = count($productos);
    $stockGeneral   = 0;
    $bajoStock      = 0;

    $productosAlerta = [];

    foreach ($productos as $producto) {

        $idProducto   = $producto['idProducto'];
        $descripcion  = $producto['descripcion'];
        $stockMinimo  = $producto['stockMinimo'] ?? 0;

        $stockActual = $stockRepo->getStockTotalByProducto($idProducto);

        $stockGeneral += $stockActual;

        // Solo consideramos alerta si el mínimo es mayor a 0
        if ($stockMinimo > 0 && $stockActual <= $stockMinimo) {

            $bajoStock++;

            // Guardamos máximo 5 para mostrar en dashboard
            if (count($productosAlerta) < 5) {
                $productosAlerta[] = [
                    "id" => $idProducto,
                    "descripcion" => $descripcion,
                    "stock_actual" => $stockActual,
                    "stock_minimo" => $stockMinimo
                ];
            }
        }
    }

    // ===============================
    // PROVEEDORES
    // ===============================

    $stmtProv = $conn->query("SELECT COUNT(*) as total FROM proveedor");
    $totalProveedores = $stmtProv->fetch(PDO::FETCH_ASSOC)['total'];


    // ===============================
    // ORDENAR ALERTAS POR PRIORIDAD
    // ===============================
    usort($productosAlerta, function($a, $b) {

        // Prioridad 1: stock 0
        if ($a['stock_actual'] == 0 && $b['stock_actual'] != 0) return -1;
        if ($b['stock_actual'] == 0 && $a['stock_actual'] != 0) return 1;

        // Prioridad 2: diferencia con mínimo
        $difA = $a['stock_actual'] - $a['stock_minimo'];
        $difB = $b['stock_actual'] - $b['stock_minimo'];

        return $difA <=> $difB;
    });

    // ===============================
    // RESPUESTA JSON
    // ===============================
    echo json_encode([
        "total_productos"   => (int)$totalProductos,
        "stock_general"     => (int)$stockGeneral,
        "bajo_stock"        => (int)$bajoStock,
        "total_proveedores" => (int)$totalProveedores,
        "productos_alerta"  => $productosAlerta
    ]);

} catch (Throwable $e) {

    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}