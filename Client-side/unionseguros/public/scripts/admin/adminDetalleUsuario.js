window.onload = function () {
  if (localStorage.getItem("user") == null) {
    window.location.href = "/admin/login";
  }

  fetch(GLOBAL_URL + "/tipoDocumento/listarActivos")
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
      document.querySelector("#select-documento").innerHTML = "";
      data.forEach((tipoDocumento) => {
        const option = document.createElement("option");
        option.value = tipoDocumento.id;
        option.innerText = tipoDocumento.nombre;
        document.querySelector("#select-documento").appendChild(option);
      });
    })
    .then(() => {
      document
        .getElementById("select-documento")
        .addEventListener("change", function () {
          document.getElementById("txt-documento").disabled = false;
          if (document.querySelector("#select-documento").value == "1") {
            document.getElementById("txt-documento").maxLength = "8";
          } else if (document.querySelector("#select-documento").value == "2") {
            document.getElementById("txt-documento").maxLength = "9";
          } else if (document.querySelector("#select-documento").value == "5") {
            document.getElementById("txt-documento").maxLength = "11";
          }
        });
    })
    .catch((error) => {
      alert("Ha ocurrido un error de comunicación con el servidor");
      console.error(error);
    });

  if (localStorage.getItem("data-usuario") == null) {
    document.querySelector("#titulo").innerHTML = "Nuevo Usuario";
  } else {
    let data = JSON.parse(localStorage.getItem("data-usuario"));

    document.querySelector("#id").innerHTML = data.id;
    document.querySelector("#txt-nombre").value = data.nombre;
    document.querySelector("#txt-apellido-paterno").value =
      data.apellidoPaterno;
    document.querySelector("#txt-apellido-materno").value =
      data.apellidoMaterno;
    document.querySelector("#txt-celular").value = data.telefono;
    document.querySelector("#txt-correo").value = data.email;
    document.querySelector("#txt-contrasena").value = data.contrasena;
    document.querySelector("#select-estado").value = data.activo;
    document.querySelector("#txt-direccion").value = data.direccion;
    document.querySelector("#dp-fecha-nacimiento").value = data.fechaNacimiento;
    document.querySelector("#txt-documento").value = data.numeroDocumento;
    document.querySelector("#select-documento").value =
      data.fidTipoDocumento.id;
  }

  document.querySelector("#regresar").addEventListener("click", function () {
    localStorage.removeItem("data-usuario");
    window.location.href = "/admin/usuario";
  });

  document.querySelector("#btn-guardar").addEventListener("click", function () {
    if (!verificarCampos()) {
      return;
    }
    if (document.querySelector("#id").innerHTML == "") {
      const usuario = {
        nombre: document.querySelector("#txt-nombre").value,
        apellidoPaterno: document.querySelector("#txt-apellido-paterno").value,
        apellidoMaterno: document.querySelector("#txt-apellido-materno").value,
        fechaNacimiento: new Date(
          document.querySelector("#dp-fecha-nacimiento").value
        )
          .toISOString()
          .slice(0, 10),
        telefono: document.querySelector("#txt-celular").value,
        direccion: document.querySelector("#txt-direccion").value,
        numeroDocumento: document.querySelector("#txt-documento").value,
        activoPersona: true,
        fidTipoDocumento: {
          id: document.querySelector("#select-documento").value,
        },
        email: document.querySelector("#txt-correo").value,
        contrasena: document.querySelector("#txt-contrasena").value,
        fechaCreacion: new Date().toISOString().slice(0, 10),
        activoUsuario: true,
        activo: true,
        fidRoles: {
          idRole: 2,
          fidPermisos: {
            id: 2,
          },
        },
      };

      console.log(JSON.stringify(usuario));
      fetch(GLOBAL_URL + "/administrador/insertar", {
        method: "POST",
        body: JSON.stringify(usuario),
        headers: {
          "Content-Type": "application/json",
        },
      })
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
        .then((element) => {
          if (parseInt(element) > 0) {
            alert("Se ha guardado correctamente");
            window.location.href = "/admin/usuario";
          } else {
            if (parseInt(element) > 0 == 0) {
              alert("Número de documento repetido");
            } else if (parseInt(element) > 0 == -1) {
              alert("Correo repetido");
            } else {
              alert("Ha ocurrido un error");
            }
            return;
          }
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    } else {
      let data = JSON.parse(localStorage.getItem("data-usuario"));
      const usuario = {
        id: data.id,
        nombre: document.querySelector("#txt-nombre").value,
        apellidoPaterno: document.querySelector("#txt-apellido-paterno").value,
        apellidoMaterno: document.querySelector("#txt-apellido-materno").value,
        fechaNacimiento: new Date(
          document.querySelector("#dp-fecha-nacimiento").value
        )
          .toISOString()
          .slice(0, 10),
        telefono: document.querySelector("#txt-celular").value,
        direccion: document.querySelector("#txt-direccion").value,
        numeroDocumento: document.querySelector("#txt-documento").value,
        activoPersona: true,
        fidTipoDocumento: {
          id: document.querySelector("#select-documento").value,
        },
        email: document.querySelector("#txt-correo").value,
        contrasena: document.querySelector("#txt-contrasena").value,
        fechaCreacion: data.fechaCreacion,
        activoUsuario: true,
        activo:
          document.querySelector("#select-estado").value == 1 ? true : false,
        fidRoles: {
          idRole: 2,
          fidPermisos: {
            id: 2,
          },
        },
      };
      console.log(JSON.stringify(usuario));

      fetch(GLOBAL_URL + "/administrador/modificar", {
        method: "PUT",
        body: JSON.stringify(usuario),
        headers: {
          "Content-Type": "application/json",
        },
      })
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
        .then((element) => {
          if (element) {
            alert("Se ha guardado correctamente");
            window.location.href = "/admin/usuario";
          } else {
            alert("Ha ocurrido un error");
          }
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    }
  });

  function verificarCampos() {
    return true;
    let cobertura = document.querySelector("#txt-cobertura").value;
    let precio = document.querySelector("#txt-precio").value;
    let nombre = document.querySelector("#txt-nombre").value;

    if (cobertura == "") {
      document.querySelector("#txt-cobertura").focus();
      alert("Debe ingresar la cobertura");
      return false;
    }
    if (precio == "") {
      document.querySelector("#txt-precio").focus();
      alert("Debe ingresar el precio");
      return false;
    }
    if (nombre == "") {
      document.querySelector("#txt-nombre").focus();
      alert("Debe ingresar el nombre");
      return false;
    }

    if (!/^[0-9]+./.test(precio)) {
      document.querySelector("#txt-precio").focus();
      alert("El precio debe ser un número");
      return false;
    }

    if (!/^[0-9]+./.test(cobertura)) {
      document.querySelector("#txt-cobertura").focus();
      alert("La cobertura debe ser un número");
      return false;
    }

    var documento = document.querySelector("#txt-documento").value;
    var tipoDocumento = document.querySelector("#select-documento").value;

    if (tipoDocumento === "0") {
      alert("Por favor ingrese el documento correcto.");
      return false;
    } else if (tipoDocumento === "5") {
      if (
        documento.length !== 11 ||
        !/^[0-9]+$/.test(documento) ||
        (documento.substring(0, 2) !== "10" &&
          documento.substring(0, 2) !== "20")
      ) {
        document.querySelector("#txt-documento").focus();
        alert("Por favor ingrese un RUC correcto.");
        return false;
      }
    } else if (tipoDocumento === "1") {
      if (documento.length !== 8 || !/^[0-9]+$/.test(documento)) {
        document.querySelector("#txt-documento").focus();
        alert("Por favor ingrese un DNI correcto.");
        return false;
      }
    } else if (tipoDocumento === "2") {
      if (documento.length !== 9 || !/^[0-9]+$/.test(documento)) {
        document.querySelector("#txt-documento").focus();
        alert("Por favor ingrese un CE correcto.");
        return false;
      }
    } else if (tipoDocumento === "3") {
      document.querySelector("#txt-documento").focus();
      if (!/^[A-Z0-9]+$/.test(documento)) {
        alert("Por favor ingrese un pasaporte correcto.");
        return false;
      }
    }
    if (placa == "" || placa.length !== 6 || !/^[A-Za-z0-9]+$/.test(placa)) {
      document.querySelector("#txt-placa").focus();
      alert("Por favor ingrese la placa correcta.");
      return false;
    }

    return true;
  }
};
