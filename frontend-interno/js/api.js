function apiFetch(endpoint, options = {}) {

    const url = API_BASE + endpoint;

    return fetch(url, options)
        .then(async res => {

            // Si la sesión expiró
            if (res.status === 401) {

                const enPages = window.location.pathname.includes("/pages/");
                window.location.href = enPages ? "../login.html" : "login.html";

                return Promise.reject("No autorizado");
            }

            // Intentar leer JSON
            let data;

            try {
                data = await res.json();
            } catch (err) {
                console.error("Respuesta no es JSON:", url);
                throw new Error("Respuesta inválida del servidor");
            }

            // Error HTTP
            if (!res.ok) {
                console.error("API ERROR:", {
                    endpoint: endpoint,
                    status: res.status,
                    data: data
                });

                throw new Error(data?.error || "Error en la API");
            }

            return data;
        })
        .catch(err => {
            console.error("Fetch ERROR:", endpoint, err);
            throw err;
        });
}