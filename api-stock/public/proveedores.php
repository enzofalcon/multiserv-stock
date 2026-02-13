<?php

require_once __DIR__ . '/../src/Database.php';

header('Content-Type: application/json');

$db = new Database();
$conn = $db->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {

    $stmt = $conn->query("
        SELECT idProveedor, nombre, correo, rut, estado
        FROM proveedor
        ORDER BY nombre
    ");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        $nombre = $input['nombre'] ?? null;
        $correo = $input['correo'] ?? null;
        $rut = $input['rut'] ?? null;

        if (!$nombre || !$correo || !$rut) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos inválidos']);
            exit;
        }

        $stmt = $conn->prepare("
            INSERT INTO proveedor (nombre, correo, rut)
            VALUES (:nombre, :correo, :rut)
        ");

        $stmt->execute([
            ':nombre' => $nombre,
            ':correo' => $correo,
            ':rut' => $rut
        ]);

        echo json_encode([
            'success' => true,
            'idProveedor' => $conn->lastInsertId()   // 🔥 IMPORTANTE
        ]);
        exit;

    } catch (Throwable $e) {

        // Captura errores de SQL: duplicados, formato, etc.
        http_response_code(500);
        echo json_encode([
            'error' => 'Error SQL: ' . $e->getMessage()
        ]);
        exit;
    }
}

if ($method === 'PUT') {

    try {

        if (!isset($_GET['idProveedor'])) {
            http_response_code(400);
            echo json_encode(['error' => 'idProveedor requerido']);
            exit;
        }

        $id = (int) $_GET['idProveedor'];
        $input = json_decode(file_get_contents('php://input'), true);

        // Detectar si se quiere actualizar SOLO el estado
        if (isset($input['estado'])) {

            $estado = $input['estado'];

            $stmt = $conn->prepare("
                UPDATE proveedor
                SET estado = :estado
                WHERE idProveedor = :id
            ");

            $stmt->execute([
                ':estado' => $estado,
                ':id' => $id
            ]);

            echo json_encode([
                'success' => true,
                'message' => $estado === 'activo'
                    ? 'Proveedor reactivado correctamente'
                    : 'Proveedor desactivado correctamente'
            ]);
            exit;
        }

        // Si no es solo estado → es edición completa
        $nombre = $input['nombre'] ?? null;
        $correo = $input['correo'] ?? null;
        $rut = $input['rut'] ?? null;

        if (!$nombre || !$correo || !$rut) {
            http_response_code(400);
            echo json_encode(['error' => 'Datos inválidos']);
            exit;
        }

        $stmt = $conn->prepare("
            UPDATE proveedor
            SET nombre = :nombre,
                correo = :correo,
                rut = :rut
            WHERE idProveedor = :id
        ");

        $stmt->execute([
            ':nombre' => $nombre,
            ':correo' => $correo,
            ':rut' => $rut,
            ':id' => $id
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Proveedor actualizado correctamente'
        ]);
        exit;

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Error SQL: ' . $e->getMessage()
        ]);
        exit;
    }
}


// ================================
// DELETE → desactivar proveedor (lógico)
// ================================
if ($method === 'DELETE') {

    try {

        if (!isset($_GET['idProveedor'])) {
            http_response_code(400);
            echo json_encode(['error' => 'idProveedor requerido']);
            exit;
        }

        $id = (int) $_GET['idProveedor'];

        // 🔄 Desactivar proveedor
        $stmt = $conn->prepare("
            UPDATE proveedor
            SET estado = 'inactivo'
            WHERE idProveedor = :id
        ");

        $stmt->execute([':id' => $id]);

        echo json_encode([
            'success' => true,
            'message' => 'Proveedor desactivado correctamente'
        ]);
        exit;

    } catch (Throwable $e) {

        http_response_code(500);
        echo json_encode([
            'error' => 'Error SQL: ' . $e->getMessage()
        ]);
        exit;
    }
}


http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
