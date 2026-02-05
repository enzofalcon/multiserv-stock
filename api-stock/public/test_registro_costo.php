<?php
$data = [
    "idProducto" => 1,
    "idProveedor" => 1,
    "costo" => 2500.00,
    "porcentajeIVA" => 22.00
];

$options = [
    "http" => [
        "method"  => "POST",
        "header"  => "Content-Type: application/json",
        "content" => json_encode($data)
    ]
];

$context = stream_context_create($options);

$response = file_get_contents(
    "http://localhost/multiserv-stock/api-stock/public/registro_costo.php",
    false,
    $context
);

echo $response;
