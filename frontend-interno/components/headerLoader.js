/* Base del proyecto */
const basePath = "";

/* Diccionario de nombres automáticos */
const pageTitles = {
    inicio: "Inicio",
    productos: "Productos",
    proveedores: "Proveedores",
    sucursales: "Sucursales"
};

/**
 * cargarHeader(pageName, breadcrumbList)
 * pageName → "productos", "proveedores", etc.
 * breadcrumbList → array opcional [{ label, url }]
 */
function cargarHeader(pageName, breadcrumbList = []) {

    fetch(`${basePath}/components/header.html`)
        .then(r => r.text())
        .then(html => {

            document.getElementById("header-container").innerHTML = html;




apiFetch("session.php")
  .then(data => {

    const contenedor = document.getElementById("usuario-info");
    if (!contenedor) return;

    if (data.logueado) {

      contenedor.innerHTML = `
        👤 ${data.usuario.nombre}
        <button id="btnLogout" class="btn btn-secondary">
          Cerrar sesión
        </button>
      `;

      document.getElementById("btnLogout")
        .addEventListener("click", () => {

          apiFetch("logout.php", { method: "POST" })
            .then(() => {

              // Redirige correctamente según carpeta
              const enPages = window.location.pathname.includes("/pages/");
              window.location.href = enPages ? "../login.html" : "login.html";

            });

        });

    } else {

      const enPages = window.location.pathname.includes("/pages/");
      contenedor.innerHTML = `
        <a href="${enPages ? '../login.html' : 'login.html'}">
          Iniciar sesión
        </a>
      `;
    }

  });   
            /* ---------- 1. Título AUTOMÁTICO ---------- */
            const title = document.getElementById("ms-page-title");

            const autoTitle = pageTitles[pageName] ?? "";
            title.textContent = autoTitle ? ` / ${autoTitle}` : "";

            /* ---------- 2. Rutas del menú ---------- */
            document.getElementById("nav-inicio").href      = `${basePath}/index.html`;
            document.getElementById("nav-productos").href   = `${basePath}/pages/productos.html`;
            document.getElementById("nav-proveedores").href = `${basePath}/pages/proveedores.html`;
            document.getElementById("nav-sucursales").href  = `${basePath}/pages/sucursales.html`;

            // Logo → Inicio
            document.getElementById("ms-logo-link").href = `${basePath}/index.html`;

            /* ---------- 3. Activar botón del menú ---------- */
            const activeLink = document.querySelector(`.ms-nav a[data-page="${pageName}"]`);
            if (activeLink) activeLink.classList.add("active");

            /* ---------- 4. Breadcrumb ---------- */
            const bc = document.querySelector(".ms-breadcrumb");

            if (!breadcrumbList.length) {
                bc.innerHTML = "";
                return;
            }

            let htmlBC = `<a href="${basePath}/index.html">Inicio</a>`;

            breadcrumbList.forEach((item, i) => {
                htmlBC += ` <span class="separator">/</span> `;
                if (i === breadcrumbList.length - 1) {
                    htmlBC += `<span class="current">${item.label}</span>`;
                } else {
                    htmlBC += `<a href="${item.url}">${item.label}</a>`;
                }
            });

            bc.innerHTML = htmlBC;
        })
        .catch(err => console.error("Error cargando header:", err));
}

