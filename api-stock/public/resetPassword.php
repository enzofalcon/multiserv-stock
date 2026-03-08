<?php

require_once __DIR__ . "/../src/Database.php";

$conn = Database::getConnection();

$hash = password_hash("123456", PASSWORD_DEFAULT);

$stmt = $conn->prepare("
    UPDATE usuario 
    SET passwordHash = ?
    WHERE email = 'admin@multiserv.com'
");

$stmt->execute([$hash]);

echo json_encode([
    "hash_guardado" => $hash
]);