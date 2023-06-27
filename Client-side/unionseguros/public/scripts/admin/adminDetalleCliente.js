if (localStorage.getItem("user") == null) {
  window.location.href = "/admin/login";
}
window.onload = function () {
  const  fechaNac = document.querySelector("#dp-fecha-nacimiento");
// La fecha mínima permitida (hace 18 años)
  const fechaMinima = new Date();
  fechaMinima.setFullYear(fechaMinima.getFullYear() - 18);
// No deja poner otras fechas posteriores a esta
  fechaNac.max = fechaMinima.toISOString().split("T")[0];
  if(localStorage.getItem("data-cliente") === null){
    document.getElementById("txt-documento").maxLength = "8";
  }
  document
      .getElementById("select-documento")
      .addEventListener("change", function () {
        const selectedValue = this.value;
        //document.getElementById("txt-documento").value = "";
        //document.getElementById("txt-documento").disabled = false;
        if (document.querySelector("#select-documento").value == "1") {
          document.getElementById("txt-documento").maxLength = "8";
        } else if (document.querySelector("#select-documento").value == "2") {
          document.getElementById("txt-documento").maxLength = "9";
        } else if (document.querySelector("#select-documento").value == "3") {
          document.getElementById("txt-documento").maxLength = "11";
        }else if (document.querySelector("#select-documento").value == "4") {
          document.getElementById("txt-documento").maxLength = "16";
        }
      });

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
        if (localStorage.getItem("data-cliente") !== null){
          let doc = JSON.parse(localStorage.getItem("data-cliente"));
          document.querySelector("#select-documento").value =
              doc.fidTipoDocumento.id;
        }

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
              } else if (document.querySelector("#select-documento").value == "3") {
                document.getElementById("txt-documento").maxLength = "11";
              }else if (document.querySelector("#select-documento").value == "4") {
                document.getElementById("txt-documento").maxLength = "16";
              }
            });
      })
      .catch((error) => {
        alert("Ha ocurrido un error de comunicación con el servidor 1");
        console.error(error);
      });






  if (localStorage.getItem("data-cliente") == null) {
    document.querySelector("#titulo").innerHTML = "Nuevo cliente";
  } else {
    let data = JSON.parse(localStorage.getItem("data-cliente"));

    document.querySelector("#id").innerHTML = data.id;
    document.querySelector("#txt-nombre").value = data.nombre;
    document.querySelector("#txt-apellido-paterno").value =
        data.apellidoPaterno;
    document.querySelector("#txt-apellido-materno").value =
        data.apellidoMaterno;
    document.querySelector("#txt-celular").value = data.telefono;
    document.querySelector("#txt-correo").value = data.email;
    document.querySelector("#txt-contrasena").value = data.contrasena;
    document.querySelector("#txt-direccion").value = data.direccion;
    document.querySelector("#dp-fecha-nacimiento").value = data.fechaNacimiento;
    document.querySelector("#txt-documento").value = data.numeroDocumento;
    document.querySelector("#select-documento").value =
        data.fidTipoDocumento.id;
    document.querySelector("#checkbox-baneado").checked = data.baneado;
  }

  document.querySelector("#regresar").addEventListener("click", function () {
    alert("No se ha aplicado ningún cambio");
    localStorage.removeItem("data-usuario");
    window.location.href = "/admin/cliente";
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
        baneado: false,
        fidRoles: {
          idRole: 1,
          fidPermisos: {
            id: 1,
          },
        },
      };
      console.log(JSON.stringify(usuario));
      fetch(GLOBAL_URL + "/cliente/insertar", {
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
            registrarAuditoria(
              JSON.parse(localStorage.getItem("user")).id,
              "crear cliente"
            );
            if (parseInt(element) > 0) {
              alert("Se ha guardado correctamente");
              window.location.href = "/admin/cliente";
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
      let data = JSON.parse(localStorage.getItem("data-cliente"));
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
        activo: true,
        baneado: document.querySelector("#checkbox-baneado").checked,
        fidRoles: {
          idRole: 1,
          fidPermisos: {
            id: 1,
          },
        },
      };
      console.log(JSON.stringify(usuario));

      fetch(GLOBAL_URL + "/cliente/modificar", {
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
            registrarAuditoria(
              JSON.parse(localStorage.getItem("user")).id,
              "modificar cliente"
            );
            if (element) {
              alert("Se ha guardado correctamente");
              window.location.href = "/admin/cliente";
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

    var documento = document.querySelector("#txt-documento").value;
    var tipoDocumento = document.querySelector("#select-documento").value;
    var apdPaterno = document.querySelector("#txt-apellido-paterno").value;
    var apdMaterno = document.querySelector("#txt-apellido-materno").value;
    var nombres = document.querySelector("#txt-nombre").value;
    var email = document.querySelector("#txt-correo").value;
    var contrasena = document.querySelector("#txt-contrasena").value;
    var numCelular = document.querySelector("#txt-celular").value;


    if (numCelular !== "") {
      if (!/^[0-9]+$/.test(numCelular)) {
        document.querySelector("#txt-celular").focus();
        alert("El número celular debe ser numérico");
        return false;
      }
      if (numCelular.length !== 9) {
        document.querySelector("#txt-celular").focus();
        alert("El número celular debe tener 9 caracteres");
        return false;
      }
    }

    if (tipoDocumento === "0") {
      alert("Por favor ingrese el documento correcto.");
      return false;
    } else if (tipoDocumento === "3") {
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
    } else if (tipoDocumento === "4") {
      document.querySelector("#txt-documento").focus();
      if (documento.length < 8 ||!/^[A-Z0-9]+$/.test(documento)) {
        alert("Por favor ingrese un pasaporte correcto.");
        return false;
      }
    }

    var  inputFechaNacimiento = document.querySelector("#dp-fecha-nacimiento");
    if(new Date(inputFechaNacimiento.value) > fechaMinima){
      alert("El cliente debe ser mayor de 18 años.");
      return false;
    }
    if (inputFechaNacimiento.value === "") {
      alert("Debe ingresar fecha de nacimiento");
      return false;
    }

    if (email !== "") {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("El correo electrónico no es válido");
        return false;
      }
    }

    if (email === "") {
      alert("Debe ingresar un correo");
      return false;
    }
    if (nombres === "") {
      alert("Debe ingresar un nombre");
      return false;
    }

    if (contrasena === "") {
      alert("Debe ingresar una contraseña");
      return false;
    }

    if(
        (apdPaterno !== "" && !/^[A-Za-z -]+$/.test(apdPaterno)) ||
        (apdMaterno !== "" && !/^[A-Za-z -]+$/.test(apdMaterno)) ||
        !/^[A-Za-z ]+$/.test(nombres)
    ){
      document.querySelector("#txt-apellido-paterno").focus();
      alert(
          "Los nombres y apellidos no deben contener caracteres especiales"
      );
      return false;
    }

    if(apdMaterno==="" && (tipoDocumento!=="4" && tipoDocumento!=="2" && tipoDocumento!=="3")){
      alert("Complete su apellido por favor");
      return false;
    }else if(apdMaterno==="" && (tipoDocumento==="4" || tipoDocumento==="2" || tipoDocumento==="3")){
      document.querySelector("#txt-apellido-materno").value = '-';
    }

    if(tipoDocumento==="3" && documento.substring(0, 2) === "20"){
      document.querySelector("#txt-apellido-paterno").value = '-'
      document.querySelector("#txt-apellido-materno").value = '-'
    }



    return true;
  }
};

function validateNumericInput(input) {
  // Obtener el valor del campo de texto
  const value = input.value;

  // Eliminar cualquier caracter no numérico del valor
  const numericValue = value.replace(/\D/g, '');

  // Actualizar el valor del campo de texto con solo caracteres numéricos
  input.value = numericValue;
}