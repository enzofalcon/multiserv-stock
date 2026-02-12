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
  fetch('../../api-stock/public/sucursales.php')
    .then(res => res.json())
    .then(data => renderSucursales(data))
    .catch(() => alert("Error cargando sucursales"));
}

function renderSucursales(lista) {
  const tbody = document.querySelector('#tablaSucursales tbody');
  tbody.innerHTML = '';

  lista.forEach(s => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td><input type="checkbox" class="chkSucursal"></td>
      <td>${s.idSucursal}</td>
      <td>${s.numSucursal}</td>
      <td>${s.correo}</td>
      <td>${s.telefono}</td>
      <td>${s.estado}</td>
    `;

    const chk = tr.querySelector(".chkSucursal");

    // =============================
    // EVENTO DEL CHECKBOX
    // =============================
    chk.addEventListener("change", () => {

      if (chk.checked) {

        // Desmarcar otros checkboxes
        document.querySelectorAll(".chkSucursal").forEach(c => {
          if (c !== chk) c.checked = false;
        });

        // Guardar ID
        document.getElementById("idSucursalActual").value = s.idSucursal;

        // Mostrar panel
        document.getElementById("accionesSucursal").classList.remove("hidden");

        // Texto del panel
        document.getElementById("sucursalSeleccionada").innerText =
          `Sucursal seleccionada: ${s.numSucursal}`;

        // Aplicar resaltado
        marcarFilaSucursal(tr);

      } else {

        // Deseleccionar → ocultar panel
        document.getElementById("accionesSucursal").classList.add("hidden");
        document.getElementById("idSucursalActual").value = "";
        document.getElementById("sucursalSeleccionada").innerText = "";
        limpiarSeleccionSucursales();
      }
    });

    // =============================
    // CLIC EN LA FILA → seleccionar checkbox
    // =============================
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
  document.getElementById('mensajeSucursal').className = 'message hidden';
  document.getElementById('numeroSucursal').value = '';
  document.getElementById('correoSucursal').value = '';
  document.getElementById('telefonoSucursal').value = '';

  document.getElementById('modalSucursal').classList.remove('hidden');
}

function cerrarModalSucursal() {
  document.getElementById('modalSucursal').classList.add('hidden');
}


// ===============================
// Guardar sucursal
// ===============================
function guardarSucursal() {
  const numero = document.getElementById('numeroSucursal').value.trim();
  const correo = document.getElementById('correoSucursal').value.trim();
  const telefono = document.getElementById('telefonoSucursal').value.trim();

  const msg = document.getElementById('mensajeSucursal');
  msg.className = 'message hidden';
  msg.innerText = '';

  if (!numero || !correo || !telefono) {
    msg.innerText = "Todos los campos son obligatorios.";
    msg.classList.remove('hidden');
    msg.classList.add('message-error');
    return;
  }

  fetch('../../api-stock/public/sucursales.php', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numSucursal: numero, correo, telefono })
  })
    .then(res => res.json())
    .then(resp => {
      if (resp.error) {
        msg.innerText = resp.error;
        msg.classList.remove('hidden');
        msg.classList.add('message-error');
        return;
      }

      msg.innerText = "Sucursal creada correctamente.";
      msg.classList.remove('hidden');
      msg.classList.add('message-success');

      setTimeout(() => {
        cerrarModalSucursal();
        cargarSucursales();
      }, 800);
    });
}


function limpiarSeleccionSucursales() {
  document.querySelectorAll("#tablaSucursales tr").forEach(f => {
    f.classList.remove("fila-activa");
  });
}

function marcarFilaSucursal(fila) {
  limpiarSeleccionSucursales();
  fila.classList.add("fila-activa");
}
