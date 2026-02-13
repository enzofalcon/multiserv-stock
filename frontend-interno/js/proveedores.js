let mostrarInactivos = false;
document.addEventListener('DOMContentLoaded', () => {
  cargarProveedores();

  const btnNuevo = document.getElementById('btnNuevoProveedor');
  const btnCerrar = document.getElementById('cerrarModalProveedor');
  const btnCancelar = document.getElementById('btnCancelarProveedor');
  const overlay = document.querySelector('#modalProveedor .modal-overlay');
  const btnGuardar = document.getElementById('btnGuardarProveedor');
  const btnEditar = document.getElementById('btnEditarProveedor'); 

  if (btnNuevo) btnNuevo.addEventListener('click', abrirModalProveedor);
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalProveedor);
  if (btnCancelar) btnCancelar.addEventListener('click', cerrarModalProveedor);
  if (overlay) overlay.addEventListener('click', cerrarModalProveedor);
  if (btnGuardar) btnGuardar.addEventListener('click', guardarProveedor);

  if (btnEditar) btnEditar.addEventListener('click', editarProveedor); 
  const btnEliminar = document.getElementById('btnEliminarProveedor');
  if (btnEliminar) btnEliminar.addEventListener('click', eliminarProveedor);
  const btnToggle = document.getElementById("btnToggleInactivos");
  if (btnToggle) {
    btnToggle.addEventListener("click", () => {
      mostrarInactivos = !mostrarInactivos;
      btnToggle.innerText = mostrarInactivos
        ? "Ocultar inactivos"
        : "Mostrar inactivos";
      cargarProveedores();
    });
  }

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
    // 🔎 FILTRO
    if (!mostrarInactivos && p.estado === "inactivo") {
      return;
    }

    const tr = document.createElement('tr');

    if (p.estado === "inactivo") {
      tr.classList.add("fila-inactiva");
    }

    tr.innerHTML = `
      <td><input type="checkbox" class="chkProveedor"></td>
      <td>${p.idProveedor}</td>
      <td>${p.nombre}</td>
      <td>${p.rut}</td>
      <td>${p.correo}</td>
      <td class="estado-${p.estado}">${p.estado}</td>
    `;
    tr.dataset.estado = p.estado;
    const chk = tr.querySelector(".chkProveedor");

    // ============================
    // EVENTO DEL CHECKBOX
    // ============================
  chk.addEventListener("change", () => {

  if (chk.checked) {

    document.getElementById("idProveedorActual").value = p.idProveedor;

    document.getElementById("accionesProveedor")
      .classList.remove("hidden");

    document.getElementById("proveedorSeleccionado").innerText =
      `Proveedor seleccionado: ${p.nombre}`;

    marcarFilaSeleccionada(tr);

    // 👇 MOVER AQUÍ el cambio del botón
    const btnEliminar = document.getElementById("btnEliminarProveedor");

    if (p.estado === "inactivo") {
      btnEliminar.innerText = "Reactivar";
      btnEliminar.classList.remove("btn-danger");
      btnEliminar.classList.add("btn-success");
    } else {
      btnEliminar.innerText = "Eliminar";
      btnEliminar.classList.remove("btn-success");
      btnEliminar.classList.add("btn-danger");
    }

  } else {

    document.getElementById("accionesProveedor")
      .classList.add("hidden");

    document.getElementById("idProveedorActual").value = "";

    document.getElementById("proveedorSeleccionado").innerText = "";

    limpiarSeleccion();
  }

});


    // ============================
    // EVENTO AL CLICKEAR LA FILA
    // ============================
    tr.addEventListener('click', (e) => {

      // Evitar conflicto si el click fue sobre el checkbox
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
      // Ajustar botón según estado
      const btnEliminar = document.getElementById("btnEliminarProveedor");

      if (p.estado === "inactivo") {
          btnEliminar.innerText = "Reactivar";
          btnEliminar.classList.remove("btn-danger");
          btnEliminar.classList.add("btn-success");
      } else {
          btnEliminar.innerText = "Eliminar";
          btnEliminar.classList.remove("btn-success");
          btnEliminar.classList.add("btn-danger");
      }

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

  const msg = document.getElementById('mensajeProveedor');
  msg.className = 'message hidden';
  msg.innerText = '';

  // SOLO limpiar si NO estamos editando
  if (!modoEdicionProveedor) {
    document.getElementById('nombreProveedor').value = '';
    document.getElementById('rutProveedor').value = '';
    document.getElementById('correoProveedor').value = '';

    document.querySelector("#modalProveedor h2").innerText = "Nuevo proveedor";
  } else {
    document.querySelector("#modalProveedor h2").innerText = "Editar proveedor";
  }

  document.getElementById('modalProveedor').classList.remove('hidden');
}

function cerrarModalProveedor() {
  document.getElementById('modalProveedor').classList.add('hidden');
  modoEdicionProveedor = false;
}



// ======================================================
// Guardar proveedor
// ======================================================
function guardarProveedor() {

  const nombre = document.getElementById('nombreProveedor').value.trim();
  const rut = document.getElementById('rutProveedor').value.trim();
  const correo = document.getElementById('correoProveedor').value.trim();
  const id = document.getElementById("idProveedorActual").value;

  const msg = document.getElementById('mensajeProveedor');
  msg.className = 'message hidden';
  msg.innerText = '';

  if (!nombre || !rut || !correo) {
    msg.innerText = 'Todos los campos son obligatorios.';
    msg.classList.remove('hidden');
    msg.classList.add('message-error');
    return;
  }

  let url = '../../api-stock/public/proveedores.php';
  let method = 'POST';

  // 🔥 SI ESTAMOS EDITANDO
  if (modoEdicionProveedor) {
    url += `?idProveedor=${id}`;
    method = 'PUT';
  }

  fetch(url, {
    method: method,
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

    msg.innerText = modoEdicionProveedor
      ? 'Proveedor actualizado correctamente.'
      : 'Proveedor agregado correctamente.';

    msg.classList.remove('hidden');
    msg.classList.add('message-success');

    setTimeout(() => {
      cerrarModalProveedor();
      cargarProveedores();
      modoEdicionProveedor = false;
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

let modoEdicionProveedor = false;

function editarProveedor() {

  const id = document.getElementById("idProveedorActual").value;

  if (!id) {
    alert("Seleccione un proveedor.");
    return;
  }

  const fila = document.querySelector("#tablaProveedores tbody tr.fila-seleccionada");

  if (!fila) {
    alert("No se encontró la fila seleccionada.");
    return;
  }

  const celdas = fila.querySelectorAll("td");

  document.getElementById("nombreProveedor").value = celdas[2].innerText;
  document.getElementById("rutProveedor").value = celdas[3].innerText;
  document.getElementById("correoProveedor").value = celdas[4].innerText;

  modoEdicionProveedor = true;

  abrirModalProveedor();
}


function limpiarSeleccion() {
  document.querySelectorAll("#tablaProveedores tbody tr")
    .forEach(tr => tr.classList.remove("fila-seleccionada"));
}

function marcarFilaSeleccionada(fila) {
  limpiarSeleccion();
  fila.classList.add("fila-seleccionada");
}

function eliminarProveedor() {

  const id = document.getElementById("idProveedorActual").value;

  if (!id) {
    alert("Seleccione un proveedor.");
    return;
  }

  const fila = document.querySelector("#tablaProveedores tbody tr.fila-seleccionada");

  if (!fila) {
    alert("No se encontró la fila seleccionada.");
    return;
  }

  const estadoActual = fila.dataset.estado;
  const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";

  const mensaje =
    estadoActual === "activo"
      ? "¿Seguro que desea desactivar este proveedor?"
      : "¿Desea reactivar este proveedor?";

  if (!confirm(mensaje)) return;

  fetch(`../../api-stock/public/proveedores.php?idProveedor=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado })
  })
    .then(res => res.json())
    .then(resp => {
      if (resp.error) {
        alert(resp.error);
        return;
      }

      alert(resp.message);
      cargarProveedores();

      document.getElementById("accionesProveedor").classList.add("hidden");
      document.getElementById("idProveedorActual").value = "";
    });
}


function reactivarProveedor(id) {

  fetch(`../../api-stock/public/proveedores.php?idProveedor=${id}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: "activo" })
  })
    .then(res => res.json())
    .then(resp => {
      alert("Proveedor reactivado");
      cargarProveedores();
    });
}
