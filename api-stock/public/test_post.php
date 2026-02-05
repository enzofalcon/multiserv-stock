<?php

$data = [
    "idProducto" => 1,
    "idSucursal" => 1,
    "cantidad"   => 120
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
    "http://localhost/multiserv-stock/api-stock/public/index.php",
    false,
    $context
);

echo $response;
