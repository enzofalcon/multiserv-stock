document.addEventListener('DOMContentLoaded', () => {
  cargarProveedores();

  // Botones modal
  const btnNuevo = document.getElementById('btnNuevoProveedor');
  const btnCerrar = document.getElementById('cerrarModalProveedor');
  const btnCancelar = document.getElementById('btnCancelarProveedor');
  const overlay = document.querySelector('#modalProveedor .modal-overlay');
  const btnGuardar = document.getElementById('btnGuardarProveedor');

  if (btnNuevo) btnNuevo.addEventListener('click', abrirModalProveedor);
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalProveedor);
  if (btnCancelar) btnCancelar.addEventListener('click', cerrarModalProveedor);
  if (overlay) overlay.addEventListener('click', cerrarModalProveedor);
  if (btnGuardar) btnGuardar.addEventListener('click', guardarProveedor);
});


// ======================================================
// Cargar tabla
// ======================================================
function cargarProveedores() {
  fetch('../../api-stock/public/proveedores.php')
    .then(res => res.json())
    .then(data => renderTablaProveedores(data))
    .catch(() => alert('Error cargando proveedores'));
}

function renderTablaProveedores(lista) {
  const tbody = document.querySelector('#tablaProveedores tbody');
  tbody.innerHTML = '';

  lista.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.idProveedor}</td>
      <td>${p.nombre}</td>
      <td>${p.rut}</td>
      <td>${p.correo}</td>
    `;
    tbody.appendChild(tr);
  });
}


// ======================================================
// Modal
// ======================================================
function abrirModalProveedor() {
  document.getElementById('mensajeProveedor').className = 'message hidden';
  document.getElementById('mensajeProveedor').innerText = '';

  document.getElementById('nombreProveedor').value = '';
  document.getElementById('rutProveedor').value = '';
  document.getElementById('correoProveedor').value = '';

  document.getElementById('modalProveedor').classList.remove('hidden');
}

function cerrarModalProveedor() {
  document.getElementById('modalProveedor').classList.add('hidden');
}


// ======================================================
// Guardar proveedor
// ======================================================
function guardarProveedor() {
  const nombre = document.getElementById('nombreProveedor').value.trim();
  const rut = document.getElementById('rutProveedor').value.trim();
  const correo = document.getElementById('correoProveedor').value.trim();

  const msg = document.getElementById('mensajeProveedor');
  msg.className = 'message hidden';
  msg.innerText = '';

  if (!nombre || !rut || !correo) {
    msg.innerText = 'Todos los campos son obligatorios.';
    msg.classList.remove('hidden');
    msg.classList.add('message-error');
    return;
  }

  fetch('../../api-stock/public/proveedores.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, rut, correo })
  })
    .then(res => res.json())
    .then(resp => {
      if (resp.error) {
        msg.innerText = resp.error;
        msg.classList.remove('hidden');
        msg.classList.add('message-error');
        return;
      }

      msg.innerText = 'Proveedor agregado correctamente.';
      msg.classList.remove('hidden');
      msg.classList.add('message-success');

      setTimeout(() => {
        cerrarModalProveedor();
        cargarProveedores();
      }, 800);
    })
    .catch(() => {
      msg.innerText = 'Error guardando proveedor.';
      msg.classList.remove('hidden');
      msg.classList.add('message-error');
    });
}
