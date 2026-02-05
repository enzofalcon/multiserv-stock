<?php
require_once '../src/Database.php';

$db = new Database();
$conn = $db->getConnection();

$sql = "
SELECT
  p.idProducto,
  p.descripcion,
  s.idSucursal,
  s.numSucursal,
  d.cantidad
FROM disponibilidad d
JOIN producto p ON p.idProducto = d.idProducto
JOIN sucursal s ON s.idSucursal = d.idSucursal
";

$stmt = $conn->prepare($sql);
$stmt->execute();

$resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($resultado);
