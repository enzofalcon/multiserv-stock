<?php

class ProductRepository {

    private PDO $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    public function findAll(): array {

        $sql = "
            SELECT 
                p.idProducto AS id,
                p.descripcion
            FROM producto p
            ORDER BY p.descripcion
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(string $descripcion): int
    {
        $sql = "
            INSERT INTO producto (descripcion)
            VALUES (:descripcion)
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->execute();

        return (int) $this->conn->lastInsertId();
    }


}


