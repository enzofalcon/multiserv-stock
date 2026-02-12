<?php

require_once __DIR__ . '/Database.php';

class DireccionProveedorRepository {

  private PDO $db;

  public function __construct() {
    $this->db = Database::getConnection();
  }

  public function getByProveedor(int $idProveedor): ?array {
    $sql = "SELECT * FROM direccion_proveedor WHERE idProveedor = :idProveedor";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['idProveedor' => $idProveedor]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    return $result ?: null;
  }

  public function create(array $data): bool {
    $sql = "
      INSERT INTO direccion_proveedor
      (idProveedor, departamento, localidad, callePrincipal, numero, calleInterseccion, observacion)
      VALUES
      (:idProveedor, :departamento, :localidad, :callePrincipal, :numero, :calleInterseccion, :observacion)
    ";

    $stmt = $this->db->prepare($sql);

    return $stmt->execute([
      'idProveedor'        => $data['idProveedor'],
      'departamento'       => $data['departamento'],
      'localidad'          => $data['localidad'],
      'callePrincipal'     => $data['callePrincipal'],
      'numero'             => $data['numero'] ?? null,
      'calleInterseccion'  => $data['calleInterseccion'] ?? null,
      'observacion'        => $data['observacion'] ?? null
    ]);
  }
    public function existsForProveedor(int $idProveedor): bool {
    $sql = "SELECT COUNT(*) FROM direccion_proveedor WHERE idProveedor = :idProveedor";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(['idProveedor' => $idProveedor]);
    return $stmt->fetchColumn() > 0;
    }

    public function update(int $idDireccionProv, array $data): bool {
    $sql = "
        UPDATE direccion_proveedor
        SET
        departamento = :departamento,
        localidad = :localidad,
        callePrincipal = :callePrincipal,
        numero = :numero,
        calleInterseccion = :calleInterseccion,
        observacion = :observacion
        WHERE idDireccionProv = :idDireccionProv
    ";

    $stmt = $this->db->prepare($sql);

    return $stmt->execute([
        'departamento'      => $data['departamento'],
        'localidad'         => $data['localidad'],
        'callePrincipal'    => $data['callePrincipal'],
        'numero'            => $data['numero'] ?? null,
        'calleInterseccion' => $data['calleInterseccion'] ?? null,
        'observacion'       => $data['observacion'] ?? null,
        'idDireccionProv'   => $idDireccionProv
    ]);
    }


}

