<?php
require_once __DIR__ . "/Database.php";

class CostosRepository
{
    public function getHistorialPorProducto(int $idProducto): array
    {
        $pdo = Database::getConnection();

        $sql = "
            SELECT
                rc.idRegistroCosto,
                rc.idProducto,
                rc.idProveedor,
                rc.costo,
                rc.porcentajeIVA,
                rc.fechaHora
            FROM registro_costo rc
            WHERE rc.idProducto = :idProducto
            ORDER BY rc.fechaHora DESC, rc.idRegistroCosto DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([":idProducto" => $idProducto]);

        return $stmt->fetchAll();
    }

    public function getUltimoPorProducto(int $idProducto): ?array
    {
        $pdo = Database::getConnection();

        $sql = "
            SELECT
                rc.idRegistroCosto,
                rc.idProducto,
                rc.idProveedor,
                rc.costo,
                rc.porcentajeIVA,
                rc.fechaHora
            FROM registro_costo rc
            WHERE rc.idProducto = :idProducto
            ORDER BY rc.fechaHora DESC, rc.idRegistroCosto DESC
            LIMIT 1
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([":idProducto" => $idProducto]);

        $row = $stmt->fetch();
        return $row === false ? null : $row;
    }
}
