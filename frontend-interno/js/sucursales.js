
// ===============================
// Guardar sucursal
// ===============================
document.addEventListener('DOMContentLoaded', () => {

  cargarSucursales();

  const btnNuevo = document.getElementById('btnNuevaSucursal');
  const btnCerrar = document.getElementById('cerrarModalSucursal');
  const btnCancelar = document.getElementById('btnCancelarSucursal');
  const overlay = document.querySelector('#modalSucursal .modal-overlay');
  const btnGuardar = document.getElementById('btnGuardarSucursal');
  const btnEliminar = document.getElementById('btnEliminarSucursal');

  if (btnNuevo) btnNuevo.addEventListener('click', abrirModalSucursal);
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalSucursal);
  if (btnCancelar) btnCancelar.addEventListener('click', cerrarModalSucursal);
  if (overlay) overlay.addEventListener('click', cerrarModalSucursal);
  if (btnGuardar) btnGuardar.addEventListener('click', guardarSucursal);
  if (btnEliminar) {
    btnEliminar.addEventListener('click', eliminarSucursal);
  }
});


// ===============================
// Cargar sucursales
// ===============================
function cargarSucursales() {

apiFetch("sucursales.php")
  .then(data => {
    if (!data) return;
    renderSucursales(data);
  })
    .catch(error => {
      console.error("Error real:", error);
      alert("Error cargando sucursales");
    });
}


// ===============================
// Render
// ===============================
function renderSucursales(lista) {

  const tabla = document.getElementById("tablaSucursales");
  if (!tabla) {
    console.error("No existe tablaSucursales");
    return;
  }

  const tbody = tabla.querySelector("tbody");
  if (!tbody) {
    console.error("No existe tbody en tablaSucursales");
    return;
  }

  tbody.innerHTML = '';

  lista.forEach(s => {

    const tr = document.createElement('tr');
    tr.dataset.estado = s.estado;
    tr.innerHTML = `
      <td><input type="checkbox" class="chkSucursal"></td>
      <td>${s.idSucursal}</td>
      <td>${s.numSucursal}</td>
      <td>${s.correo}</td>
      <td>${s.telefono}</td>
      <td class="${s.estado === 'activa' ? 'estado-activo' : 'estado-inactivo'}">
        ${s.estado}
      </td>
    `;

    const chk = tr.querySelector(".chkSucursal");

    chk.addEventListener("change", () => {

      // 🔹 DESMARCAR LOS DEMÁS
      document.querySelectorAll(".chkSucursal").forEach(c => {
        if (c !== chk) c.checked = false;
      });

      if (chk.checked) {

        document.getElementById("idSucursalActual").value = s.idSucursal;

        document.getElementById("accionesSucursal")
          .classList.remove("hidden");

        document.getElementById("sucursalSeleccionada").innerText =
          `Sucursal seleccionada: ${s.numSucursal}`;

        marcarFilaSucursal(tr);

      } else {

        document.getElementById("accionesSucursal")
          .classList.add("hidden");

        document.getElementById("idSucursalActual").value = "";

        document.getElementById("sucursalSeleccionada").innerText = "";

        limpiarSeleccionSucursales();
      }

    });

    tr.addEventListener("click", (e) => {
      if (e.target.classList.contains("chkSucursal")) return;
      chk.checked = true;
      chk.dispatchEvent(new Event("change"));
    });

    tbody.appendChild(tr);
  });
}

// ===============================
// Modal
// ===============================

function abrirModalSucursal() {
  document.getElementById("modalSucursal").classList.remove("hidden");
}

function cerrarModalSucursal() {
  document.getElementById("modalSucursal").classList.add("hidden");
}

// ===============================
// Guardar sucursal
// ===============================
function guardarSucursal() {

  const numInput = document.getElementById("numeroSucursal");
  const correoInput = document.getElementById("correoSucursal");
  const telInput = document.getElementById("telefonoSucursal");

  if (!numInput || !correoInput || !telInput) {
    console.error("Inputs del modal no encontrados");
    return;
  }

  const numSucursal = numInput.value;
  const correo = correoInput.value;
  const telefono = telInput.value;

  apiFetch("sucursales.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      numSucursal,
      correo,
      telefono
    })
  })
  .then(data => {

    if (data.success) {

      cerrarModalSucursal();
      cargarSucursales();

      // limpiar formulario
      numInput.value = "";
      correoInput.value = "";
      telInput.value = "";

    } else {
      alert(data.error || "Error guardando sucursal");
    }

  })
  .catch(err => {
    console.error(err);
    alert("Error de conexión");
  });

}

function cerrarModalSucursal() {

  document.getElementById("modalSucursal").classList.add("hidden");

  document.getElementById("numeroSucursal").value = "";
  document.getElementById("correoSucursal").value = "";
  document.getElementById("telefonoSucursal").value = "";

}

function limpiarSeleccionSucursales() {
  document.querySelectorAll("#tablaSucursales tbody tr")
    .forEach(tr => tr.classList.remove("fila-seleccionada"));
}

function marcarFilaSucursal(fila) {
  limpiarSeleccionSucursales();
  fila.classList.add("fila-seleccionada");
}

function eliminarSucursal() {

  const id = document.getElementById("idSucursalActual").value;

  if (!id) {
    alert("Selecciona una sucursal");
    return;
  }

  const fila = document.querySelector("#tablaSucursales tbody tr.fila-seleccionada");

  if (!fila) {
    alert("No se encontró la sucursal seleccionada.");
    return;
  }

  const estadoActual = fila.dataset.estado;
  const nuevoEstado = estadoActual === "activa" ? "inactiva" : "activa";

  const mensaje =
    estadoActual === "activa"
      ? "¿Seguro que desea desactivar esta sucursal?"
      : "¿Desea reactivar esta sucursal?";

  if (!confirm(mensaje)) return;

  apiFetch(`sucursales.php?idSucursal=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado })
  })
  .then(resp => {

    if (resp.error) {
      alert(resp.error);
      return;
    }

    alert(resp.message || "Estado actualizado");
    cargarSucursales();

    document.getElementById("accionesSucursal").classList.add("hidden");
    document.getElementById("idSucursalActual").value = "";
  })
  .catch(err => {
    console.error(err);
    alert("Error de conexión");
  });
}