// ==================================================
// INIT
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();

  // ---------- Modal Nuevo Producto ----------
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

  // ---------- Modal Disponibilidad ----------
  const btnCerrarDisp =
    document.getElementById('cerrarModalDisponibilidad');
  const overlayDisp =
    document.querySelector('#modalDisponibilidad .modal-overlay');

  if (btnCerrarDisp)
    btnCerrarDisp.addEventListener('click', cerrarModalDisponibilidad);
  if (overlayDisp)
    overlayDisp.addEventListener('click', cerrarModalDisponibilidad);
});

// ==================================================
// LISTADO DE PRODUCTOS
// ==================================================
function cargarProductos() {
  fetch('http://localhost/multiserv-stock/api-stock/public/productos.php')
    .then(res => res.json())
    .then(data => renderTablaProductos(data))
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

  fetch('http://localhost/multiserv-stock/api-stock/public/productos.php', {
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
  document.getElementById('tituloDisponibilidad').innerText =
    `Disponibilidad – ${descripcion}`;

  fetch('http://localhost/multiserv-stock/api-stock/public/disponibilidad.php')
    .then(res => res.json())
    .then(data => {
      const filtrados = data.filter(d => d.idProducto === idProducto);
      renderDisponibilidad(filtrados);
      abrirModalDisponibilidad();
    })
    .catch(() => alert('Error al cargar disponibilidad'));
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
