// ===============================
// Botón del panel de acciones
// ===============================
document.getElementById("btnDireccionProveedor")
  .addEventListener("click", () => {

    const idProveedor = document.getElementById("idProveedorActual").value;

    if (!idProveedor) {
      alert("Seleccione un proveedor de la tabla.");
      return;
    }

    cargarDireccion(idProveedor);
    abrirModalDireccion();
  });

let modoEdicion = false;

// ===============================
// Abrir y cerrar modal
// ===============================
function abrirModalDireccion() {
  const modal = document.getElementById("modalDireccion");
  modal.classList.remove("hidden");
  modal.style.display = ""; // Limpia cualquier override previo
}

function cerrarModalDireccion() {
  const modal = document.getElementById("modalDireccion");
  modal.classList.add("hidden");
  modal.style.display = ""; // Limpia display:block si quedó aplicado
}

// ===============================
// Prevenir que el click del botón Guardar reabra el modal
// ===============================
const btnGuardarDireccion = document.querySelector('#modalDireccion button[type="submit"]');

btnGuardarDireccion.addEventListener("click", (e) => {
  e.stopPropagation(); // 🔥 Evita que se reabra al cerrar
});

// ===============================
// Cargar dirección (GET)
// ===============================
function cargarDireccion(idProveedor) {
  fetch(`/multiserv-stock/api-stock/public/direccion_proveedor.php?idProveedor=${idProveedor}`)
    .then(res => res.json())
    .then(data => {
      if (data) {
        modoEdicion = true;
        document.getElementById("idDireccionProv").value = data.idDireccionProv;
        document.getElementById("departamento").value = data.departamento;
        document.getElementById("localidad").value = data.localidad;
        document.getElementById("callePrincipal").value = data.callePrincipal;
        document.getElementById("numero").value = data.numero ?? "";
        document.getElementById("calleInterseccion").value = data.calleInterseccion ?? "";
        document.getElementById("observacion").value = data.observacion ?? "";
      } else {
        modoEdicion = false;
        document.getElementById("formDireccion").reset();
      }
    });
}

// ===============================
// Guardar dirección (POST o PUT)
// ===============================
document.getElementById("formDireccion").addEventListener("submit", function (e) {
  e.preventDefault();

  const idProveedor = document.getElementById("idProveedorActual").value;

  const data = {
    idProveedor,
    departamento: departamento.value,
    localidad: localidad.value,
    callePrincipal: callePrincipal.value,
    numero: numero.value,
    calleInterseccion: calleInterseccion.value,
    observacion: observacion.value
  };

  let url = "/multiserv-stock/api-stock/public/direccion_proveedor.php";
  let method = "POST";

  if (modoEdicion) {
    const idDireccion = document.getElementById("idDireccionProv").value;
    url += `?idDireccionProv=${idDireccion}`;
    method = "PUT";
  }

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(resp => {

      // Mostrar mensaje
      document.getElementById("msgDireccion").textContent = resp.message;

      if (resp.success) {

        // Recargar dirección
        cargarDireccion(idProveedor);

        // Cerrar modal automáticamente
        cerrarModalDireccion();

        // Opcional: limpiar mensaje después de cerrar
        setTimeout(() => {
          document.getElementById("msgDireccion").textContent = "";
        }, 500);
      }
    });
});

// ===============================
// Auxiliar: quitar resaltado
// ===============================
function quitarResaltado() {
  document.querySelectorAll("#tablaProveedores tbody tr")
    .forEach(tr => tr.classList.remove("fila-seleccionada"));
}
