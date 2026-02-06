<?php
require_once __DIR__ . '/../src/Database.php';

$db = new Database();
$pdo = $db->getConnection();

$mensaje = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim($_POST['nombre'] ?? '');
    $correo = trim($_POST['correo'] ?? '');
    $rut    = trim($_POST['rut'] ?? '');

    if ($nombre && $correo && $rut) {
        $sql = "INSERT INTO proveedor (nombre, correo, rut)
                VALUES (:nombre, :correo, :rut)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nombre' => $nombre,
            ':correo' => $correo,
            ':rut'    => $rut
        ]);

        $mensaje = 'Proveedor agregado correctamente';
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Agregar proveedor</title>
</head>
<body>

<h2>Agregar proveedor</h2>

<?php if ($mensaje): ?>
    <p style="color: green;"><?php echo $mensaje; ?></p>
<?php endif; ?>

<form method="post">
    <label>Nombre</label><br>
    <input type="text" name="nombre" required><br><br>

    <label>Correo</label><br>
    <input type="email" name="correo" required><br><br>

    <label>RUT</label><br>
    <input type="text" name="rut" required><br><br>

    <button type="submit">Guardar</button>
</form>

</body>
</html>
