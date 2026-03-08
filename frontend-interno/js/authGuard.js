document.addEventListener("DOMContentLoaded", () => {

  apiFetch("session.php")
    .then(data => {

      if (!data.logueado) {
        window.location.href = "../login.html";
      }

    })
    .catch(() => {
      window.location.href = "../login.html";
    });

});document.addEventListener("DOMContentLoaded", () => {

  apiFetch("session.php")
    .then(data => {

      if (!data.logueado) {
        window.location.href = "../login.html";
      }

    })
    .catch(() => {
      window.location.href = "../login.html";
    });

});