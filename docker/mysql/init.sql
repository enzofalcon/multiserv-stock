-- ============================================
-- MULTISERV STOCK - BASE DE DATOS COMPLETA
-- Versión 1.0
-- MySQL 8 - InnoDB
-- ============================================

USE multiserv;

-- ============================================
-- TABLA USUARIO
-- ============================================

CREATE TABLE usuario (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  fechaCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- TABLA PRODUCTO
-- ============================================

CREATE TABLE producto (
  idProducto INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  stockMinimo INT NOT NULL DEFAULT 0,
  CHECK (stockMinimo >= 0)
) ENGINE=InnoDB;

-- ============================================
-- TABLA PROVEEDOR
-- ============================================

CREATE TABLE proveedor (
  idProveedor INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  rut VARCHAR(20) NOT NULL,
  correo VARCHAR(255) NOT NULL,
  estado ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
  UNIQUE (rut),
  UNIQUE (correo)
) ENGINE=InnoDB;

-- ============================================
-- TABLA SUCURSAL
-- ============================================

CREATE TABLE sucursal (
  idSucursal INT AUTO_INCREMENT PRIMARY KEY,
  numSucursal INT NOT NULL,
  correo VARCHAR(255) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  estado ENUM('activa','inactiva') NOT NULL DEFAULT 'activa',
  UNIQUE (numSucursal),
  UNIQUE (correo)
) ENGINE=InnoDB;

-- ============================================
-- DIRECCION PROVEEDOR
-- ============================================

CREATE TABLE direccion_proveedor (
  idDireccionProv INT AUTO_INCREMENT PRIMARY KEY,
  idProveedor INT NOT NULL,
  departamento VARCHAR(100) NOT NULL,
  localidad VARCHAR(100) NOT NULL,
  callePrincipal VARCHAR(150) NOT NULL,
  numero VARCHAR(20),
  calleInterseccion VARCHAR(150),
  observacion VARCHAR(255),
  CONSTRAINT fk_dir_proveedor
    FOREIGN KEY (idProveedor)
    REFERENCES proveedor(idProveedor)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- DIRECCION SUCURSAL
-- ============================================

CREATE TABLE direccion_sucursal (
  idDireccionSuc INT AUTO_INCREMENT PRIMARY KEY,
  idSucursal INT NOT NULL,
  departamento VARCHAR(100) NOT NULL,
  localidad VARCHAR(100) NOT NULL,
  callePrincipal VARCHAR(150) NOT NULL,
  numero VARCHAR(20),
  calleInterseccion VARCHAR(150),
  observacion VARCHAR(255),
  CONSTRAINT fk_dir_sucursal
    FOREIGN KEY (idSucursal)
    REFERENCES sucursal(idSucursal)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- TELEFONOS PROVEEDOR
-- ============================================

CREATE TABLE telefono_proveedor (
  idTelefonoProveedor INT AUTO_INCREMENT PRIMARY KEY,
  idProveedor INT NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  observacion VARCHAR(255),
  CONSTRAINT fk_tel_proveedor
    FOREIGN KEY (idProveedor)
    REFERENCES proveedor(idProveedor)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- REGISTRO COSTO
-- ============================================

CREATE TABLE registro_costo (
  idRegistroCosto INT AUTO_INCREMENT PRIMARY KEY,
  idProducto INT NOT NULL,
  idProveedor INT NOT NULL,
  costo DECIMAL(10,2) NOT NULL,
  fechaHora DATETIME NOT NULL,
  porcentajeIVA DECIMAL(5,2) NOT NULL,
  CHECK (costo > 0),
  CONSTRAINT fk_rc_producto
    FOREIGN KEY (idProducto)
    REFERENCES producto(idProducto),
  CONSTRAINT fk_rc_proveedor
    FOREIGN KEY (idProveedor)
    REFERENCES proveedor(idProveedor)
) ENGINE=InnoDB;

-- ============================================
-- DISPONIBILIDAD (estado actual)
-- ============================================

CREATE TABLE disponibilidad (
  idProducto INT NOT NULL,
  idSucursal INT NOT NULL,
  cantidad INT NOT NULL,
  PRIMARY KEY (idProducto, idSucursal),
  CHECK (cantidad >= 0),
  CONSTRAINT fk_disp_producto
    FOREIGN KEY (idProducto)
    REFERENCES producto(idProducto),
  CONSTRAINT fk_disp_sucursal
    FOREIGN KEY (idSucursal)
    REFERENCES sucursal(idSucursal)
) ENGINE=InnoDB;

-- ============================================
-- MOVIMIENTO STOCK (histórico)
-- ============================================

CREATE TABLE movimiento_stock (
  idMovimientoStock INT AUTO_INCREMENT PRIMARY KEY,
  idProducto INT NOT NULL,
  idSucursal INT NOT NULL,
  idUsuario INT NOT NULL,
  tipoMovimiento VARCHAR(50) NOT NULL,
  cantidad INT NOT NULL,
  fechaHora DATETIME NOT NULL,
  motivo VARCHAR(255),
  CONSTRAINT fk_ms_producto
    FOREIGN KEY (idProducto)
    REFERENCES producto(idProducto),
  CONSTRAINT fk_ms_sucursal
    FOREIGN KEY (idSucursal)
    REFERENCES sucursal(idSucursal),
  CONSTRAINT fk_ms_usuario
    FOREIGN KEY (idUsuario)
    REFERENCES usuario(idUsuario)
) ENGINE=InnoDB;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
