window.onload = function () {
  document
    .querySelector("#button-login")
    .addEventListener("click", function () {
      // login
      let params = new URLSearchParams(location.search);
      params.append("email", document.querySelector("#txt-usuario").value);
      params.append(
        "contrasena",
        document.querySelector("#txt-contrasena").value
      );

      let url = new URL(GLOBAL_URL + "/usuario/login?" + params.toString());
      console.log(url);
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
          } else {
            try {
              return response.json();
            } catch (error) {
              return null;
            }
          }
        })
        .then((data) => {
          if (parseInt(data.id) === 0) {
            alert("Usuario o contraseña incorrectos");
            return;
          }

          if (data.fidRoles.idRole != 2) {
            alert("No tiene permisos para acceder a esta sección");
            return;
          }
          localStorage.setItem("user", JSON.stringify(data));
          registrarAuditoria(
            JSON.parse(localStorage.getItem("user")).id,
            "lgoin"
          );
          window.location.href = "/admin/ventas";
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    });
};
