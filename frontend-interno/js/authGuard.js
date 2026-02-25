document.addEventListener("DOMContentLoaded", () => {

  fetch("../../api-stock/public/session.php")
    .then(res => res.json())
    .then(data => {

      if (!data.logueado) {
        window.location.href = "../login.html";
      }

    })
    .catch(() => {
      window.location.href = "../login.html";
    });

});