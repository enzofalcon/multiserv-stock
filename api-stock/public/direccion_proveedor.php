<?php

require_once __DIR__ . '/../src/DireccionProveedorRepository.php';

header('Content-Type: application/json');

$repo = new DireccionProveedorRepository();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {

  if (!isset($_GET['idProveedor'])) {
    http_response_code(400);
    echo json_encode(['error' => 'idProveedor requerido']);
    exit;
  }

  $direccion = $repo->getByProveedor((int)$_GET['idProveedor']);
  echo json_encode($direccion);

}

elseif ($method === 'POST') {

  $data = json_decode(file_get_contents('php://input'), true);

  if (
    !isset($data['idProveedor']) ||
    !isset($data['departamento']) ||
    !isset($data['localidad']) ||
    !isset($data['callePrincipal'])
  ) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
  }

// Control de unicidad lógica
  if ($repo->existsForProveedor((int)$data['idProveedor'])) {
    http_response_code(409);
    echo json_encode([
      'success' => false,
      'message' => 'El proveedor ya tiene una dirección registrada'
    ]);
    exit;
  }

  $ok = $repo->create($data);

  echo json_encode([
    'success' => $ok,
    'message' => $ok
      ? 'Dirección registrada correctamente'
      : 'Error al registrar dirección'
  ]);
}

elseif ($method === 'PUT') {

  if (!isset($_GET['idDireccionProv'])) {
    http_response_code(400);
    echo json_encode(['error' => 'idDireccionProv requerido']);
    exit;
  }

  $data = json_decode(file_get_contents('php://input'), true);

  if (
    !isset($data['departamento']) ||
    !isset($data['localidad']) ||
    !isset($data['callePrincipal'])
  ) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
  }

  $ok = $repo->update((int)$_GET['idDireccionProv'], $data);

  echo json_encode([
    'success' => $ok,
    'message' => $ok
      ? 'Dirección actualizada correctamente'
      : 'Error al actualizar la dirección'
  ]);
}


