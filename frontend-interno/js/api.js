function apiFetch(endpoint, options = {}) {

    return fetch(API_BASE + endpoint, options)
        .then(res => {

            if (res.status === 401) {

                const enPages = window.location.pathname.includes("/pages/");
                window.location.href = enPages ? "../login.html" : "login.html";

                return Promise.reject("No autorizado");
            }

            return res.json();
        });
}