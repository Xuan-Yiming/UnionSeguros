if (localStorage.getItem("userCliente") === null) {
    window.location.href = "/iniciarSesion";
}
window.onload = function () {
    let data = JSON.parse(localStorage.getItem("userCliente"));
    document.querySelector("#txt-nombre").value = data.nombre;
    document.querySelector("#txt-apellido-paterno").value =
        data.apellidoPaterno;
    document.querySelector("#txt-apellido-materno").value =
        data.apellidoMaterno;
    document.querySelector("#txt-celular").value = data.telefono;
    document.querySelector("#txt-correo").value = data.email;
    document.querySelector("#txt-direccion").value = data.direccion;
    document.querySelector("#txt-documento").value = data.numeroDocumento;
};
