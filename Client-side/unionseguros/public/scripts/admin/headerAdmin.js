
const cerrarSesionAdmin = document.getElementById('cerrar-sesion-admin');
cerrarSesionAdmin.href = "/admin/login";
cerrarSesionAdmin.addEventListener('click', function(event) {
    event.preventDefault();

    localStorage.removeItem("user");

    window.location.href = cerrarSesionAdmin.href;
});
