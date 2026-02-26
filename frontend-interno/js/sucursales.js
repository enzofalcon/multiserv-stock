document.addEventListener('DOMContentLoaded', () => {
  cargarSucursales();

  const btnNuevo = document.getElementById('btnNuevaSucursal');
  const btnCerrar = document.getElementById('cerrarModalSucursal');
  const btnCancelar = document.getElementById('btnCancelarSucursal');
  const overlay = document.querySelector('#modalSucursal .modal-overlay');
  const btnGuardar = document.getElementById('btnGuardarSucursal');

  if (btnNuevo) btnNuevo.addEventListener('click', abrirModalSucursal);
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModalSucursal);
  if (btnCancelar) btnCancelar.addEventListener('click', cerrarModalSucursal);
  if (overlay) overlay.addEventListener('click', cerrarModalSucursal);
  if (btnGuardar) btnGuardar.addEventListener('click', guardarSucursal);
});


// ===============================
// Cargar sucursales
// ===============================
function cargarSucursales() {

  fetch(API_BASE + 'sucursales.php')
    .then(res => {

      if (res.status === 401) {
        window.location.href = "../login.html";
        return null;
      }

      if (!res.ok) {
        throw new Error("Error HTTP " + res.status);
      }

      return res.json();
    })
    .then(data => {

      if (!data) return;

      renderSucursales(data); // ✅ nombre correcto
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
      if (chk.checked) {

        document.getElementById("idSucursalActual").value = s.idSucursal;
        document.getElementById("accionesSucursal").classList.remove("hidden");
        document.getElementById("sucursalSeleccionada").innerText =
          `Sucursal seleccionada: ${s.numSucursal}`;

        marcarFilaSucursal(tr);

      } else {

        document.getElementById("accionesSucursal").classList.add("hidden");
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