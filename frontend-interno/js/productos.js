let productoActivoId = null;
// ==================================================
// INIT
// ==================================================
document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // CARGA INICIAL
  // ==============================
  cargarProductos();

  // ==============================
  // BUSCADOR
  // ==============================
  const searchInput = document.getElementById('searchProducto');
  let timeoutBusqueda = null;

  if (searchInput) {
    searchInput.addEventListener('input', () => {

      clearTimeout(timeoutBusqueda);

      timeoutBusqueda = setTimeout(() => {
        const texto = searchInput.value.trim();
        cargarProductos(texto);
      }, 300); // debounce 300ms

    });

  }

  // ==============================
  // BOTONES MODAL NUEVO PRODUCTO
  // ==============================
  const btnNuevo = document.getElementById('btnNuevoProducto');
  const btnCerrar = document.getElementById('cerrarModalProducto');
  const btnCancelar = document.getElementById('btnCancelarProducto');
  const overlayProducto =
    document.querySelector('#modalNuevoProducto .modal-overlay');
  const btnGuardar = document.getElementById('btnGuardarProducto');

  if (btnNuevo) btnNuevo.addEventListener('click', abrirModalProducto);
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalProducto);
  if (btnCancelar) btnCancelar.addEventListener('click', cerrarModalProducto);
  if (overlayProducto)
    overlayProducto.addEventListener('click', cerrarModalProducto);
  if (btnGuardar) btnGuardar.addEventListener('click', guardarProducto);

  // ==============================
  // MODAL DISPONIBILIDAD
  // ==============================
  const btnCerrarDisp =
    document.getElementById('cerrarModalDisponibilidad');
  const overlayDisp =
    document.querySelector('#modalDisponibilidad .modal-overlay');

  if (btnCerrarDisp)
    btnCerrarDisp.addEventListener('click', cerrarModalDisponibilidad);
  if (overlayDisp)
    overlayDisp.addEventListener('click', cerrarModalDisponibilidad);

  document
    .getElementById('btnGuardarStock')
    ?.addEventListener('click', guardarStockInicial);

  const btnSalida = document.getElementById('btnSalidaStock');

  if (btnSalida) {
    btnSalida.addEventListener('click', registrarSalidaStock);
  }

  // ==============================
  // MODAL COSTO
  // ==============================
  const btnCerrarCosto = document.getElementById('cerrarModalCosto');
  const btnCancelarCosto = document.getElementById('btnCancelarCosto');
  const overlayCosto = document.querySelector('#modalCosto .modal-overlay');
  const btnGuardarCosto = document.getElementById('btnGuardarCosto');

  if (btnCerrarCosto)
    btnCerrarCosto.addEventListener('click', cerrarModalCosto);
  if (btnCancelarCosto)
    btnCancelarCosto.addEventListener('click', cerrarModalCosto);
  if (overlayCosto)
    overlayCosto.addEventListener('click', cerrarModalCosto);
  if (btnGuardarCosto)
    btnGuardarCosto.addEventListener('click', guardarCosto);

});

// ==================================================
// LISTADO DE PRODUCTOS
// ==================================================
function cargarProductos(search = '') {

    let endpoint = 'productos.php';

    if (search !== '') {
        endpoint += '?search=' + encodeURIComponent(search);
    }

    apiFetch(endpoint)
        .then(data => {

            if (!data) return;

            renderTablaProductos(data);
        })
        .catch(() => alert('Error al cargar productos'));
}

function renderTablaProductos(productos) {
  const tbody = document.querySelector('#tablaProductos tbody');
  tbody.innerHTML = '';

  productos.forEach(p => {
    const estadoStock = p.stock_total > 0 ? 'stock-ok' : 'stock-low';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.descripcion}</td>
      <td class="${estadoStock}">${p.stock_total}</td>
      <td>
      <button class="btn btn-secondary tooltip"
        data-tooltip="Ver disponibilidad por sucursal"
        onclick="verDisponibilidad(${p.id}, '${escapeHtml(p.descripcion)}')">
        Stock
      </button>

        <button class="btn btn-primary"
          onclick="abrirModalCosto(${p.id}, '${escapeHtml(p.descripcion)}')">
          Agregar costo
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==================================================
// MODAL NUEVO PRODUCTO
// ==================================================
function abrirModalProducto() {
  document.getElementById('modalNuevoProducto').classList.remove('hidden');
  document.getElementById('descripcionProducto').value = '';
  document.getElementById('descripcionProducto').focus();
}

function cerrarModalProducto() {
  document.getElementById('modalNuevoProducto').classList.add('hidden');
}

function guardarProducto() {
  const input = document.getElementById('descripcionProducto');
  const inputStock = document.getElementById('stockMinimoProducto');
  const boton = document.getElementById('btnGuardarProducto');
  const mensaje = document.getElementById('mensajeProducto');

  const descripcion = input.value.trim();
  const stockMinimo = inputStock.value;

  // Reset mensaje
  mensaje.className = 'message hidden';
  mensaje.innerText = '';

  // Validación descripción
  if (descripcion === '') {
    mensaje.innerText = 'La descripción es obligatoria';
    mensaje.classList.remove('hidden');
    mensaje.classList.add('message-error');
    input.focus();
    return;
  }

  // Validación stock mínimo
  if (stockMinimo === '' || stockMinimo < 0) {
    mensaje.innerText = 'El stock mínimo debe ser 0 o mayor';
    mensaje.classList.remove('hidden');
    mensaje.classList.add('message-error');
    inputStock.focus();
    return;
  }

  // UI: deshabilitar botón
  boton.disabled = true;
  boton.innerText = 'Guardando...';

  apiFetch('productos.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      descripcion: descripcion,
      stock_minimo: Number(stockMinimo)
    })
  })
      .then(resp => {
      if (resp.error) {
        mensaje.innerText = resp.error;
        mensaje.classList.remove('hidden');
        mensaje.classList.add('message-error');
        return;
      }

    // Éxito
    mensaje.innerText = 'Producto creado correctamente';
    mensaje.classList.remove('hidden');
    mensaje.classList.add('message-success');

    cargarProductos();

    setTimeout(() => {

      input.value = '';
      inputStock.value = '';

      cerrarModalProducto();

    }, 900);

    })
    .catch(() => {
      mensaje.innerText = 'Error al guardar el producto';
      mensaje.classList.remove('hidden');
      mensaje.classList.add('message-error');
    })
    .finally(() => {
      boton.disabled = false;
      boton.innerText = 'Guardar';
    });
}

// ==================================================
// MODAL DISPONIBILIDAD
// ==================================================
function verDisponibilidad(idProducto, descripcion) {
  productoActivoId = idProducto;

  // 🔹 LIMPIAR MENSAJE DE STOCK
  const mensaje = document.getElementById('mensajeStock');
  mensaje.className = 'message hidden';
  mensaje.innerText = '';

  document.getElementById('tituloDisponibilidad').innerText =
    `Disponibilidad – ${descripcion}`;

  cargarSucursales();

    apiFetch('disponibilidad.php')
    .then(data => {
      const filtrados = data.filter(d => d.idProducto === idProducto);
      renderDisponibilidad(filtrados);
      abrirModalDisponibilidad();
    })
    .catch(() => {
      alert('Error al cargar disponibilidad');
    });
}



function renderDisponibilidad(registros) {
  const tbody = document.getElementById('tablaDisponibilidad');
  if (!tbody) {
    console.error('No existe tablaDisponibilidad');
    return;
  }

  tbody.innerHTML = '';

  if (registros.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="2">Sin stock registrado</td>
      </tr>
    `;
    return;
  }

  registros.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>Sucursal ${r.numSucursal}</td>
      <td>${r.cantidad}</td>
    `;
    tbody.appendChild(tr);
  });
}


function abrirModalDisponibilidad() {
  document.getElementById('modalDisponibilidad').classList.remove('hidden');
}

function cerrarModalDisponibilidad() {
  document.getElementById('modalDisponibilidad').classList.add('hidden');
}


function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cargarSucursales() {
  const select = document.getElementById('idSucursal');

  // Limpiar opciones anteriores
  select.innerHTML = '<option value="">Seleccionar sucursal</option>';

  apiFetch('sucursales.php')
    .then(data => {
      data.forEach(s => {
        const option = document.createElement('option');
        option.value = s.idSucursal;
        option.textContent = `Sucursal ${s.numSucursal}`;
        select.appendChild(option);
      });
    })
    .catch(() => {
      alert('Error al cargar sucursales');
    });
}

function guardarStockInicial() {
  const idSucursal = document.getElementById('idSucursal').value;
  const cantidad = document.getElementById('cantidadStock').value;
  const mensaje = document.getElementById('mensajeStock');

  mensaje.className = 'message hidden';
  mensaje.innerText = '';

  if (!productoActivoId || !idSucursal || cantidad <= 0) {
    mensaje.innerText = 'Seleccione sucursal y cantidad válida';
    mensaje.classList.remove('hidden');
    mensaje.classList.add('message-error');
    return;
  }

  apiFetch('disponibilidad.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idProducto: productoActivoId,
      idSucursal: Number(idSucursal),
      cantidad: Number(cantidad)
    })
  })
    .then(resp => {
      if (resp.error) {
        mensaje.innerText = resp.error;
        mensaje.classList.remove('hidden');
        mensaje.classList.add('message-error');
        return;
      }

      mensaje.innerText = 'Stock cargado correctamente';
      mensaje.classList.remove('hidden');
      mensaje.classList.add('message-success');

      document.getElementById('cantidadStock').value = '';

      cargarProductos();
      // Recargar disponibilidad
      recargarDisponibilidad();
    })
    .catch(() => {
      mensaje.innerText = 'Error al guardar stock';
      mensaje.classList.remove('hidden');
      mensaje.classList.add('message-error');
    });
}


function recargarDisponibilidad() {
  apiFetch('disponibilidad.php')
    .then(data => {
      const filtrados = data.filter(d => d.idProducto === productoActivoId);
      renderDisponibilidad(filtrados);
    })
    .catch(() => {
      alert('Error al recargar disponibilidad');
    });
}

let productoCostoId = null;

function abrirModalCosto(idProducto, descripcion) {
  productoCostoId = idProducto;

  // Título del modal
  document.getElementById('tituloCosto').innerText =
    `Agregar costo – ${descripcion}`;

  // Reset mensaje
  const mensaje = document.getElementById('mensajeCosto');
  mensaje.className = 'message hidden';
  mensaje.innerText = '';

  // Reset inputs
  document.getElementById('costoProducto').value = '';
  document.getElementById('ivaProducto').value = 22;

  // Cargar proveedores en el select
  cargarProveedoresCosto();

  // Mostrar modal
  document.getElementById('modalCosto').classList.remove('hidden');
}


function cargarProveedoresCosto() {
  apiFetch('proveedores.php')
    .then(data => {
      const select = document.getElementById('proveedorCosto');
      select.innerHTML = '<option value="">Seleccione proveedor</option>';

      data.forEach(pr => {
        const opt = document.createElement('option');
        opt.value = pr.idProveedor;
        opt.textContent = pr.nombre;
        select.appendChild(opt);
      });
    })
    .catch(err => console.error("Error cargando proveedores:", err));
}

function cerrarModalCosto() {
  document.getElementById('modalCosto').classList.add('hidden');
}

function guardarCosto() {
  const proveedor = document.getElementById('proveedorCosto').value;
  const costo = document.getElementById('costoProducto').value;
  const iva = document.getElementById('ivaProducto').value;

  const mensaje = document.getElementById('mensajeCosto');
  mensaje.className = 'message hidden';
  mensaje.innerText = '';

  // Validación
  if (!proveedor || !costo || costo <= 0) {
    mensaje.innerText = 'Seleccione proveedor y costo válido.';
    mensaje.classList.remove('hidden');
    mensaje.classList.add('message-error');
    return;
  }

  apiFetch('registro_costo.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idProducto: productoCostoId,
      idProveedor: Number(proveedor),
      costo: Number(costo),
      porcentajeIVA: Number(iva)
    })
  })
    .then(resp => {
      if (resp.error) {
        mensaje.innerText = resp.error;
        mensaje.classList.remove('hidden');
        mensaje.classList.add('message-error');
        return;
      }

      mensaje.innerText = 'Costo registrado correctamente.';
      mensaje.classList.remove('hidden');
      mensaje.classList.add('message-success');

      setTimeout(() => {
        cerrarModalCosto();
      }, 800);
    })
    .catch(() => {
      mensaje.innerText = 'Error al guardar el costo.';
      mensaje.classList.remove('hidden');
      mensaje.classList.add('message-error');
    });
}

function registrarSalidaStock() {

  const idSucursal = document.getElementById('idSucursal').value;
  const mensaje = document.getElementById('mensajeStock');

  mensaje.className = 'message hidden';
  mensaje.innerText = '';

  if (!productoActivoId || !idSucursal) {
    mensaje.innerText = 'Seleccione una sucursal.';
    mensaje.classList.remove('hidden');
    mensaje.classList.add('message-error');
    return;
  }

  apiFetch('disponibilidad.php', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idProducto: productoActivoId,
      idSucursal: Number(idSucursal),
      cantidad: 1
    })
  })
  .then(resp => {

    if (resp.error) {
      mensaje.innerText = resp.error;
      mensaje.classList.remove('hidden');
      mensaje.classList.add('message-error');
      return;
    }

    mensaje.innerText = 'Salida registrada correctamente.';
    mensaje.classList.remove('hidden');
    mensaje.classList.add('message-success');

    cargarProductos();
    recargarDisponibilidad();
  })
  .catch(() => {
    mensaje.innerText = 'Error al registrar salida.';
    mensaje.classList.remove('hidden');
    mensaje.classList.add('message-error');
  });
}