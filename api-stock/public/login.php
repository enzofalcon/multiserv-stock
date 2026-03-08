<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . "/../src/Database.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

if (!$email || !$password) {
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}

$database = new Database();
$conexion = $database->getConnection();

$stmt = $conexion->prepare("SELECT * FROM usuario WHERE email = ? AND activo = 1");
$stmt->execute([$email]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);
echo $usuario["passwordHash"]; exit;
if (!$usuario) {
    echo json_encode(["error" => "Usuario no encontrado"]);
    exit;
}

if (!password_verify($password, $usuario["passwordHash"])) {
    echo json_encode(["error" => "Credenciales incorrectas"]);
    exit;
}

$_SESSION["usuario"] = [
    "id" => $usuario["idUsuario"],
    "nombre" => $usuario["nombre"],
    "email" => $usuario["email"]
];

echo json_encode(["success" => true]);