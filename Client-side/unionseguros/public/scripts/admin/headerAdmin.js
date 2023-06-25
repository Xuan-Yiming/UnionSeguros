const userJSON = localStorage.getItem("user");
const user = JSON.parse(userJSON);
document.querySelector('#group-user-button-text').textContent = (user.nombre).toUpperCase();

const cerrarSesionAdmin = document.getElementById('cerrar-sesion-admin');
cerrarSesionAdmin.href = "/admin/login";
cerrarSesionAdmin.addEventListener('click', function(event) {
    event.preventDefault();

    localStorage.removeItem("user");

    window.location.href = cerrarSesionAdmin.href;
});
