// ===============================
// Productos – Vista + Lightbox
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();

  const btnCerrar = document.getElementById('cerrarModal');
  if (btnCerrar) {
    btnCerrar.addEventListener('click', cerrarModal);
  }
});

// -------------------------------
// Carga de productos
// -------------------------------
function cargarProductos() {
  fetch('/multiserv-stock/api-stock/public/productos.php')
    .then(response => response.json())
    .then(data => renderTablaProductos(data))
    .catch(() => {
      alert('Error al cargar productos');
    });
}

// -------------------------------
// Render tabla principal
// -------------------------------
function renderTablaProductos(productos) {
  const tbody = document.querySelector('#tablaProductos tbody');
  tbody.innerHTML = '';

  productos.forEach(p => {
    const estadoStock = p.stock_total > 0 ? 'stock-ok' : 'stock-low';

    const fila = document.createElement('tr');

    fila.innerHTML = `
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

    tbody.appendChild(fila);
  });
}

// -------------------------------
// Lightbox – Ver disponibilidad
// -------------------------------
function verDisponibilidad(idProducto, descripcion) {
  document.getElementById('modalTitulo').textContent =
    `Disponibilidad – ${descripcion}`;

  fetch('/multiserv-stock/api-stock/public/disponibilidad.php')
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById('tablaDisponibilidad');
      tbody.innerHTML = '';

      const registros = data.filter(d => d.idProducto === idProducto);

      if (registros.length === 0) {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td colspan="2">Sin stock registrado</td>
        `;
        tbody.appendChild(fila);
      } else {
        registros.forEach(d => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>Sucursal ${d.numSucursal}</td>
            <td>${d.cantidad}</td>
          `;
          tbody.appendChild(fila);
        });
      }

      document.getElementById('modalDisponibilidad')
        .classList.remove('hidden');
    })
    .catch(() => {
      alert('Error al cargar disponibilidad');
    });
}

// -------------------------------
// Cerrar modal
// -------------------------------
function cerrarModal() {
  document.getElementById('modalDisponibilidad')
    .classList.add('hidden');
}

// -------------------------------
// Utilidad: evitar problemas con comillas
// -------------------------------
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
