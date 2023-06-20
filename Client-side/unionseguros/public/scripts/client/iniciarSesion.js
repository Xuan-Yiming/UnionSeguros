window.onload = function () {
  document
    .querySelector("#ingresar-btn")
    .addEventListener("click", function () {
      let params = new URLSearchParams(location.search);
      params.append("email", document.querySelector("#txt-correo").value);
      params.append(
        "contrasena",
        document.querySelector("#txt-contrasena").value
      );

      let url = new URL(GLOBAL_URL + "/usuario/login?" + params.toString());
      fetch(url)
        .then((response) => response.json())
        .then((element) => {
          if (element != null) {
            localStorage.setItem("userCliente", JSON.stringify(element));
            window.location.href = "/usuario";
          } else {
            alert("Usuario o contraseña incorrectos");
            return;
          }
        })
        .catch((error) => {
          alert("Usuario o contraseña incorrectos");
          console.error(error);
        });
    });
};
