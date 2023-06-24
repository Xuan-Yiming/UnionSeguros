const userJSON = localStorage.getItem("userCliente");
const user = JSON.parse(userJSON);
document.querySelector('#group-user-button-text').textContent = (user.nombre + " " + user.apellidoPaterno).toUpperCase();
