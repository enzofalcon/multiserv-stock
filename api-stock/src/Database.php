<?php

class Database
{
    public static function getConnection(): PDO
    {
        $host = "localhost";
        $db   = "multiserv_stock";
        $user = "root";
        $pass = "";

        return new PDO(
            "mysql:host=$host;dbname=$db;charset=utf8mb4",
            $user,
            $pass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );
    }
}