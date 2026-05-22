# Multiserv Stock

Sistema web de gestión de stock desarrollado como solución para la empresa MultiServ, orientado al control de productos, proveedores y disponibilidad por sucursal.

---

## Descripción

Multiserv Stock es un sistema que permite administrar el inventario de productos de una organización, registrando su disponibilidad en distintas sucursales y gestionando la relación con proveedores.

La aplicación fue desarrollada bajo una arquitectura cliente-servidor, utilizando PHP para el backend, MySQL como sistema de base de datos y tecnologías web estándar (HTML, CSS y JavaScript) para el frontend.

La arquitectura original del sistema fue diseñada para ejecutarse completamente mediante contenedores Docker. Para las pruebas de despliegue cloud realizadas en esta versión, se utilizó Render para el despliegue de la aplicación y Aiven Cloud como servicio remoto de base de datos MySQL.

---

## Funcionalidades principales

- Gestión de productos
- Registro de stock por sucursal
- Consulta de disponibilidad de productos
- Gestión de proveedores
- Registro de costos asociados a productos
- Visualización de alertas por bajo stock

---

## Tecnologías utilizadas

- PHP 8
- MySQL 8
- HTML5
- CSS3
- JavaScript
- Docker
- Render
- Aiven Cloud

---

## Arquitectura del sistema

El sistema se organiza en los siguientes componentes principales:

- Backend (`api-stock`): API REST desarrollada en PHP
- Frontend (`frontend-interno`): interfaz de usuario web
- Base de datos MySQL remota administrada mediante Aiven Cloud

La aplicación se ejecuta en un contenedor Docker desplegado en Render, mientras que la base de datos se encuentra desacoplada en un servicio cloud administrado.

---

## Requisitos

Para ejecutar el sistema localmente se requiere:

- Docker y Docker Compose

o alternativamente:

- PHP 8
- MySQL 8
- Servidor web Apache

---

## Ejecución con Docker

### 1. Clonar el repositorio

```bash
git clone https://github.com/enzofalcon/multiserv-stock
```

### 2. Posicionarse en la carpeta del proyecto

```bash
cd multiserv-stock
```

### 3. Levantar los contenedores

```bash
docker-compose up -d
```

### 4. Acceder al sistema

```text
http://localhost:8080
```

---

## Sistema desplegado

El sistema se encuentra desplegado y disponible públicamente en:

```text
https://multiserv-stock.onrender.com/
```

Desde esta URL es posible acceder a la aplicación sin necesidad de realizar instalación local.

---

## Credenciales de prueba

Para acceder al sistema desplegado se dispone del siguiente usuario demostrativo:

```text
Usuario: admin@multiserv.com
Contraseña: password
```

Estas credenciales tienen fines exclusivamente académicos y demostrativos.

---

## Seguridad

La autenticación del sistema se realiza mediante sesiones PHP.

La conexión entre la API desplegada y la base de datos remota utiliza SSL/TLS para garantizar comunicaciones seguras entre servicios.

---

## Base de datos

El sistema incluye scripts SQL de inicialización que permiten crear automáticamente la estructura de base de datos en entornos locales dockerizados.

En el despliegue cloud publicado, la base de datos MySQL se encuentra alojada en Aiven Cloud y conectada remotamente mediante SSL/TLS.

---

## Repositorio

El código fuente del sistema se encuentra disponible en:

```text
https://github.com/enzofalcon/multiserv-stock
```

---

## Observaciones

La versión 1.0 del sistema se enfoca en la gestión operativa básica de stock, productos, proveedores y disponibilidad por sucursal.

Algunas funcionalidades, como la integración completa del historial de movimientos de stock, reportes avanzados y métricas analíticas, quedan planteadas como posibles mejoras futuras.

---

## Autor

Enzo Falcón