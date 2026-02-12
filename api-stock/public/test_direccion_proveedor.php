<?php

$data = [
  'idProveedor' => 1,
  'departamento' => 'Montevideo',
  'localidad' => 'Centro',
  'callePrincipal' => '18 de Julio',
  'numero' => '1234',
  'calleInterseccion' => 'Ejido',
  'observacion' => 'Entrada por portón negro'
];

$ch = curl_init('http://localhost/multiserv-stock/api-stock/public/direccion_proveedor.php');

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
