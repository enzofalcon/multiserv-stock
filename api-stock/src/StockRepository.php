<?php

class StockRepository {

    private PDO $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    public function getStockTotalByProducto(int $idProducto): int {

        $sql = "
            SELECT COALESCE(SUM(d.cantidad), 0) AS total
            FROM disponibilidad d
            WHERE d.idProducto = :idProducto
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            ':idProducto' => $idProducto
        ]);

        return (int) $stmt->fetchColumn();
    }
}
