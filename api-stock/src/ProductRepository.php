<?php

class ProductRepository {

    private PDO $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    public function findAll($search = null)
{
    if ($search) {
        $sql = "SELECT idProducto, descripcion, stockMinimo
                FROM producto
                WHERE descripcion LIKE :search
                ORDER BY descripcion ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':search', '%' . $search . '%');
    } else {
        $sql = "SELECT idProducto, descripcion, stockMinimo
                FROM producto
                ORDER BY descripcion ASC";

        $stmt = $this->conn->prepare($sql);
    }

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    public function create(string $descripcion, int $stockMinimo): int
    {
        $sql = "
            INSERT INTO producto (descripcion, stockMinimo)
            VALUES (:descripcion, :stockMinimo)
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':stockMinimo', $stockMinimo, PDO::PARAM_INT);
        $stmt->execute();

        return (int) $this->conn->lastInsertId();
    }


}


