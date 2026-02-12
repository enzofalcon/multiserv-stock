<?php

$data = [
  'departamento' => 'Montevideo',
  'localidad' => 'Cordón',
  'callePrincipal' => 'Colonia',
  'numero' => '1456',
  'calleInterseccion' => 'Arenal Grande',
  'observacion' => 'Puerta verde'
];

$ch = curl_init(
  'http://localhost/multiserv-stock/api-stock/public/direccion_proveedor.php?idDireccionProv=1'
);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
