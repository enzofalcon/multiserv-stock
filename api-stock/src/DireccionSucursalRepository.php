<?php

class DireccionSucursalRepository {

  private $db;

  public function __construct($db) {
    $this->db = $db;
  }

  // Obtener dirección por sucursal
  public function getBySucursal($idSucursal) {
    $sql = "SELECT * FROM direccion_sucursal WHERE idSucursal = ?";
    $stmt = $this->db->prepare($sql);
    $stmt->execute([$idSucursal]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  // Crear dirección
  public function create($data) {
    $sql = "INSERT INTO direccion_sucursal 
      (idSucursal, departamento, localidad, callePrincipal, numero, calleInterseccion, observacion)
      VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $this->db->prepare($sql);
    
    $ok = $stmt->execute([
      $data["idSucursal"],
      $data["departamento"],
      $data["localidad"],
      $data["callePrincipal"],
      $data["numero"],
      $data["calleInterseccion"],
      $data["observacion"]
    ]);

    return [
      "success" => $ok,
      "message" => $ok ? "Dirección creada correctamente" : "Error al crear la dirección"
    ];
  }

  // Actualizar dirección existente
  public function update($idDireccionSuc, $data) {
    $sql = "UPDATE direccion_sucursal SET
      departamento = ?, 
      localidad = ?, 
      callePrincipal = ?, 
      numero = ?, 
      calleInterseccion = ?, 
      observacion = ?
      WHERE idDireccionSuc = ?";

    $stmt = $this->db->prepare($sql);

    $ok = $stmt->execute([
      $data["departamento"],
      $data["localidad"],
      $data["callePrincipal"],
      $data["numero"],
      $data["calleInterseccion"],
      $data["observacion"],
      $idDireccionSuc
    ]);

    return [
      "success" => $ok,
      "message" => $ok ? "Dirección actualizada correctamente" : "Error al actualizar la dirección"
    ];
  }
}
