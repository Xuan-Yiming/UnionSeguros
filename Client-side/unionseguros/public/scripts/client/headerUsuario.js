window.onload = function () {
    const userJSON = localStorage.getItem("user");
    const user = JSON.parse(userJSON);
    document.querySelector('#group-user-button-text').textContent = (user.nombre + " " + user.apellidoPaterno).toUpperCase();
}