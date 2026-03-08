<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . "/../src/Database.php";

$raw = file_get_contents("php://input");

echo json_encode([
    "raw_input" => $raw,
    "_POST" => $_POST,
    "_REQUEST" => $_REQUEST
]);
exit;

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");

echo json_encode([
    "data_recibida" => $data,
    "email" => $email,
    "password" => $password
]);
exit;

if (!$email || !$password) {
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}

$database = new Database();
$conexion = $database->getConnection();

$stmt = $conexion->prepare("SELECT * FROM usuario WHERE email = ? AND activo = 1");
$stmt->execute([$email]);
$usuario = $stmt->fetch(PDO::FETCH_ASSOC);

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