const userJSON = localStorage.getItem("userCliente");
const user = JSON.parse(userJSON);
document.querySelector('#group-user-button-text').textContent = (user.nombre + " " + user.apellidoPaterno).toUpperCase();

const cerrarSesionCliente = document.getElementById('cerrar-sesion-cliente');
cerrarSesionCliente.href = "/login";
cerrarSesionCliente.addEventListener('click', function(event) {
    event.preventDefault();

    alert('Adiós Cliente');
    localStorage.removeItem("userCliente");

    window.location.href = cerrarSesionCliente.href;
});
