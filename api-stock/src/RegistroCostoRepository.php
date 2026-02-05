<?php
require_once __DIR__ . "/Database.php";

class RegistroCostoRepository
{
    public function crearRegistroCosto(
        int $idProducto,
        int $idProveedor,
        float $costo,
        float $porcentajeIVA
    ): int {
        $pdo = Database::getConnection();

        $sql = "
            INSERT INTO registro_costo (idProducto, idProveedor, costo, fechaHora, porcentajeIVA)
            VALUES (:idProducto, :idProveedor, :costo, NOW(), :porcentajeIVA)
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ":idProducto" => $idProducto,
            ":idProveedor" => $idProveedor,
            ":costo" => $costo,
            ":porcentajeIVA" => $porcentajeIVA
        ]);

        return (int) $pdo->lastInsertId();
    }
}
