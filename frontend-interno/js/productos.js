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

    let url = API_BASE + 'productos.php';

    if (search !== '') {
        url += '?search=' + encodeURIComponent(search);
    }

    fetch(url)
        .then(res => {

            if (res.status === 401) {
                window.location.href = '../login.html';
                return;
            }

            return res.json();
        })
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
        <button class="btn btn-secondary"
          onclick="verDisponibilidad(${p.id}, '${escapeHtml(p.descripcion)}')">
          Ver
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
  const boton = document.getElementById('btnGuardarProducto');
  const mensaje = document.getElementById('mensajeProducto');

  const descripcion = input.value.trim();

  // Reset mensaje
  mensaje.className = 'message hidden';
  mensaje.innerText = '';

  if (descripcion === '') {
    mensaje.innerText = 'La descripción es obligatoria';
    mensaje.classList.remove('hidden');
    mensaje.classList.add('message-error');
    input.focus();
    return;
  }

  // UI: deshabilitar botón
  boton.disabled = true;
  boton.innerText = 'Guardando...';

    fetch(API_BASE + 'productos.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descripcion })
  })
    .then(res => res.json())
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

      // Refrescar listado
      cargarProductos();

      // Cerrar modal luego de un momento
      setTimeout(() => {
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

    fetch(API_BASE + 'disponibilidad.php')
    .then(res => res.json())
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

// ==================================================
// UTIL
// ==================================================
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

  fetch(API_BASE + 'sucursales.php')
    .then(res => res.json())
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

  fetch(API_BASE + 'disponibilidad.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idProducto: productoActivoId,
      idSucursal: Number(idSucursal),
      cantidad: Number(cantidad)
    })
  })
    .then(res => res.json())
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
  fetch(API_BASE + 'disponibilidad.php')
    .then(res => res.json())
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
  fetch(API_BASE + 'proveedores.php')
    .then(res => res.json())
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

  fetch(API_BASE + 'registro_costo.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idProducto: productoCostoId,
      idProveedor: Number(proveedor),
      costo: Number(costo),
      porcentajeIVA: Number(iva)
    })
  })
    .then(res => res.json())
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