<?php

class Database {
    public static function getConnection(): PDO
    {
        $host = getenv('DB_HOST') ?: 'localhost';
        $port = getenv('DB_PORT') ?: '3306';
        $db   = getenv('DB_NAME') ?: 'multiserv';
        $user = getenv('DB_USER') ?: 'root';
        $pass = getenv('DB_PASS') ?: '';

        try {

            return new PDO(
                "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4",
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );

        } catch (PDOException $e) {
            die("ERROR DB: " . $e->getMessage());
        }
    }
}

//  <?php

// class Database {
//     public static function getConnection(): PDO
//     {
//         $host = getenv('DB_HOST') ?: 'localhost';
//         $port = getenv('DB_PORT') ?: '3306';
//         $db   = getenv('DB_NAME') ?: 'multiserv';
//         $user = getenv('DB_USER') ?: 'root';
//         $pass = getenv('DB_PASS') ?: '';

//         return new PDO(
//             "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4",
//             $user,
//             $pass,
//             [
//                 PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
//                 PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
//             ]
//         );
//     }
// } 