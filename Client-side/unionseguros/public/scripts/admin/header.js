document.querySelector("#cerrar-sesion-admin").addEventListener("click", function () {
    window.location.href = "/admin/login";
    localStorage.clear();
});