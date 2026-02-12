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
      <td><input type="checkbox" class="chkProveedor"></td>
      <td>${p.idProveedor}</td>
      <td>${p.nombre}</td>
      <td>${p.rut}</td>
      <td>${p.correo}</td>
    `;

    const chk = tr.querySelector(".chkProveedor");

    // ============================
    // EVENTO DEL CHECKBOX
    // ============================
    chk.addEventListener("change", () => {

      if (chk.checked) {

        // 1) Desmarcar los otros checkboxes
        document.querySelectorAll(".chkProveedor").forEach(c => {
          if (c !== chk) c.checked = false;
        });

        // 2) Guardar el ID del proveedor seleccionado
        document.getElementById("idProveedorActual").value = p.idProveedor;

        // 3) Mostrar panel superior
        document.getElementById("accionesProveedor").classList.remove("hidden");

        // 4) Mostrar nombre del proveedor
        document.getElementById("proveedorSeleccionado").innerText =
          `Proveedor seleccionado: ${p.nombre}`;

        // 5) Resaltar fila seleccionada
        marcarFilaSeleccionada(tr);

      } else {

        // DESSELECCIÓN: ocultar el panel
        document.getElementById("accionesProveedor").classList.add("hidden");
        document.getElementById("idProveedorActual").value = "";
        document.getElementById("proveedorSeleccionado").innerText = "";
        quitarResaltado();
      }
    });


    // ============================
    // EVENTO AL CLICKEAR LA FILA
    // ============================
    tr.addEventListener('click', (e) => {

      // 👉 Evitar conflicto si el click fue sobre el checkbox
      if (e.target.classList.contains("chkProveedor")) return;

      // Seleccionar el checkbox automáticamente
      chk.checked = true;

      // Desmarcar los demás
      document.querySelectorAll(".chkProveedor").forEach(c => {
        if (c !== chk) c.checked = false;
      });

      // Guardar ID
      document.getElementById("idProveedorActual").value = p.idProveedor;

      // Mostrar panel
      document.getElementById("accionesProveedor").classList.remove("hidden");

      // Mostrar nombre en panel
      document.getElementById("proveedorSeleccionado").innerText =
        `Proveedor seleccionado: ${p.nombre}`;

      // Resaltar fila
      marcarFilaSeleccionada(tr);
    });

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

  fetch('../../api-stock/public/proveedores.php', {  // 👈 RUTA CORRECTA
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

function marcarFilaSeleccionada(fila) {
  document.querySelectorAll("#tablaProveedores tbody tr")
    .forEach(tr => tr.classList.remove("fila-seleccionada"));

  fila.classList.add("fila-seleccionada");
}

function quitarResaltado() {
  document.querySelectorAll("#tablaProveedores tbody tr")
    .forEach(tr => tr.classList.remove("fila-seleccionada"));
}
