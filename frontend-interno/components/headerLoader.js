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

            const container = document.getElementById("header-container");
            if (!container) {
                console.warn("header-container no encontrado");
                return;
            }

            container.innerHTML = html;

            /* ---------- SESIÓN ---------- */

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

                        const btnLogout = document.getElementById("btnLogout");

                        if (btnLogout) {
                            btnLogout.addEventListener("click", () => {

                                apiFetch("logout.php", { method: "POST" })
                                    .then(() => {

                                        const enPages = window.location.pathname.includes("/pages/");
                                        window.location.href = enPages ? "../login.html" : "login.html";

                                    });

                            });
                        }

                    } else {

                        const enPages = window.location.pathname.includes("/pages/");
                        contenedor.innerHTML = `
                            <a href="${enPages ? '../login.html' : 'login.html'}">
                                Iniciar sesión
                            </a>
                        `;
                    }

                });

            /* ---------- 1. Título automático ---------- */

            const title = document.getElementById("ms-page-title");

            const autoTitle = pageTitles[pageName] ?? "";

            if (title) {
                title.textContent = autoTitle ? ` / ${autoTitle}` : "";
            }

            /* ---------- 2. Rutas del menú ---------- */

            const navInicio = document.getElementById("nav-inicio");
            if (navInicio) navInicio.href = `${basePath}/index.html`;

            const navProductos = document.getElementById("nav-productos");
            if (navProductos) navProductos.href = `${basePath}/pages/productos.html`;

            const navProveedores = document.getElementById("nav-proveedores");
            if (navProveedores) navProveedores.href = `${basePath}/pages/proveedores.html`;

            const navSucursales = document.getElementById("nav-sucursales");
            if (navSucursales) navSucursales.href = `${basePath}/pages/sucursales.html`;

            const logo = document.getElementById("ms-logo-link");
            if (logo) logo.href = `${basePath}/index.html`;

            /* ---------- 3. Activar menú ---------- */

            const activeLink = document.querySelector(`.ms-nav a[data-page="${pageName}"]`);
            if (activeLink) activeLink.classList.add("active");

            /* ---------- 4. Breadcrumb ---------- */

            const bc = document.querySelector(".ms-breadcrumb");

            if (!bc || !breadcrumbList.length) {
                if (bc) bc.innerHTML = "";
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