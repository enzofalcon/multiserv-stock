let modoEdicionSuc = false;

// ============================
// Abrir y cerrar modal
// ============================

function abrirModalDireccionSucursal() {
  document.getElementById("modalDireccionSucursal").classList.remove("hidden");
}

function cerrarModalDireccionSucursal() {
  document.getElementById("modalDireccionSucursal").classList.add("hidden");
}


// ============================
// Cargar dirección (GET)
// ============================

function cargarDireccionSucursal(idSucursal) {
  fetch(`/multiserv-stock/api-stock/public/direccion_sucursal.php?idSucursal=${idSucursal}`)
    .then(res => res.json())
    .then(data => {

      // VERIFICACIÓN CORRECTA
      if (data && data.idDireccionSuc) {
        modoEdicionSuc = true;

        document.getElementById("idDireccionSuc").value = data.idDireccionSuc;
        departamentoSuc.value = data.departamento;
        localidadSuc.value = data.localidad;
        callePrincipalSuc.value = data.callePrincipal;
        numeroSuc.value = data.numero ?? "";
        calleInterseccionSuc.value = data.calleInterseccion ?? "";
        observacionSuc.value = data.observacion ?? "";

      } else {
        // NO EXISTE DIRECCIÓN → MODO CREACIÓN
        modoEdicionSuc = false;
        document.getElementById("formDireccionSucursal").reset();
        document.getElementById("idDireccionSuc").value = "";
      }

    });
}


// ============================
// Guardar (POST) o actualizar (PUT)
// ============================

document.getElementById("formDireccionSucursal").addEventListener("submit", e => {
  e.preventDefault();

  const idSucursal = document.getElementById("idSucursalActual").value;

  const data = {
    idSucursal,
    departamento: departamentoSuc.value,
    localidad: localidadSuc.value,
    callePrincipal: callePrincipalSuc.value,
    numero: numeroSuc.value,
    calleInterseccion: calleInterseccionSuc.value,
    observacion: observacionSuc.value
  };

  let url = "/multiserv-stock/api-stock/public/direccion_sucursal.php";
  let method = "POST";

  if (modoEdicionSuc) {
    url += `?idDireccionSuc=${document.getElementById("idDireccionSuc").value}`;
    method = "PUT";
  }
console.log("DATA ENVIADA:", data);
console.log("URL:", url);
console.log("METHOD:", method);

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(resp => {
      alert(resp.message);
      cerrarModalDireccionSucursal();
    });
});


// ============================
// Botón del panel de acciones
// ============================

document.getElementById("btnDireccionSucursal").addEventListener("click", () => {

  const idSucursal = document.getElementById("idSucursalActual").value;

  if (!idSucursal) {
    alert("Seleccione una sucursal.");
    return;
  }

  cargarDireccionSucursal(idSucursal);
  abrirModalDireccionSucursal();
});
