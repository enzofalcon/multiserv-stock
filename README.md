# Multiserv Stock

Sistema web de gestión de stock desarrollado como solución para la empresa MultiServ, orientado al control de productos, proveedores y disponibilidad por sucursal.

## Descripción

Multiserv Stock es un sistema que permite administrar el inventario de productos de una organización, registrando su disponibilidad en distintas sucursales y gestionando la relación con proveedores.

La aplicación fue desarrollada bajo una arquitectura cliente-servidor, utilizando PHP para el backend, MySQL como sistema de base de datos y tecnologías web estándar (HTML, CSS y JavaScript) para el frontend.

## Funcionalidades principales

* Gestión de productos
* Registro de stock por sucursal
* Consulta de disponibilidad de productos
* Gestión de proveedores
* Registro de costos asociados a productos
* Visualización de alertas por bajo stock

## Tecnologías utilizadas

* PHP 8
* MySQL 8
* HTML5
* CSS3
* JavaScript
* Docker

## Estructura del proyecto

El sistema se organiza en dos componentes principales:

* Backend (api-stock): API REST desarrollada en PHP
* Frontend (frontend-interno): interfaz de usuario web

## Requisitos

Para ejecutar el sistema se requiere:

* Docker y Docker Compose

o alternativamente:

* PHP 8
* MySQL 8
* Servidor web (Apache)

## Ejecución con Docker

1. Clonar el repositorio:

git clone https://github.com/enzofalcon/multiserv-stock

2. Posicionarse en la carpeta del proyecto:

cd multiserv-stock

3. Levantar los contenedores:

docker-compose up -d

4. Acceder al sistema desde el navegador:

http://localhost:8080

## Base de datos

El sistema incluye scripts de inicialización que permiten crear automáticamente la estructura de base de datos al levantar el entorno.

## Usuario de acceso

El sistema cuenta con un usuario administrador preconfigurado para pruebas.

## Observaciones

Esta versión corresponde a la v1.0 del sistema, enfocada en la gestión básica de stock. Algunas funcionalidades como el registro de movimientos de stock o la generación de reportes quedan planteadas como mejoras futuras.

## Autor

Enzo Falcón
