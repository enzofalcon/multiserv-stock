<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// ================================
// Conexión a BD
// ================================
require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/DireccionSucursalRepository.php';

$db = new Database();
$conn = $db->getConnection();


// ================================
// GET → obtener dirección por sucursal
// ================================
if ($_SERVER["REQUEST_METHOD"] === "GET") {

    if (!isset($_GET["idSucursal"])) {
        echo json_encode(null);
        exit;
    }

    $id = intval($_GET["idSucursal"]);

    $sql = "SELECT * FROM direccion_sucursal WHERE idSucursal = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$id]);

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($data ? $data : null);
    exit;
}



// ================================
// POST → crear nueva dirección
// ================================
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input || !isset($input["idSucursal"])) {
        echo json_encode(["success" => false, "message" => "Datos incompletos"]);
        exit;
    }

    $sql = "INSERT INTO direccion_sucursal
            (idSucursal, departamento, localidad, callePrincipal, numero, calleInterseccion, observacion)
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $ok = $stmt->execute([
        $input["idSucursal"],
        $input["departamento"],
        $input["localidad"],
        $input["callePrincipal"],
        $input["numero"],
        $input["calleInterseccion"],
        $input["observacion"]
    ]);

    echo json_encode([
        "success" => $ok,
        "message" => $ok ? "Dirección creada correctamente" : "Error al crear dirección"
    ]);
    exit;
}



// ================================
// PUT → actualizar dirección
// ================================
if ($_SERVER["REQUEST_METHOD"] === "PUT") {

    if (!isset($_GET["idDireccionSuc"])) {
        echo json_encode(["success" => false, "message" => "Falta idDireccionSuc"]);
        exit;
    }

    $id = intval($_GET["idDireccionSuc"]);
    $input = json_decode(file_get_contents("php://input"), true);

    $sql = "UPDATE direccion_sucursal
            SET departamento=?, localidad=?, callePrincipal=?, numero=?, calleInterseccion=?, observacion=?
            WHERE idDireccionSuc=?";

    $stmt = $conn->prepare($sql);
    $ok = $stmt->execute([
        $input["departamento"],
        $input["localidad"],
        $input["callePrincipal"],
        $input["numero"],
        $input["calleInterseccion"],
        $input["observacion"],
        $id
    ]);

    echo json_encode([
        "success" => $ok,
        "message" => $ok ? "Dirección actualizada correctamente" : "Error al actualizar"
    ]);
    exit;
}


echo json_encode(["success" => false, "message" => "Método no permitido"]);
