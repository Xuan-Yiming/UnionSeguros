var stage = 0;
var flagClienteExiste = false;
var flagCorreoValidado = false;
document.getElementById("txt-documento").maxLength = "8";
const inputFechaNacimiento = document.querySelector("#dp-fecha-nacimiento");

// La fecha mínima permitida (hace 18 años)
const fechaMinima = new Date();
fechaMinima.setFullYear(fechaMinima.getFullYear() - 18);

// No deja poner otras fechas posteriores a esta
inputFechaNacimiento.max = fechaMinima.toISOString().split("T")[0];

window.onbeforeunload = function (e) {
  if(stage===1){
    return "¿Está seguro que desea salir de esta página?";
  }
};

window.onload = function () {
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
    .catch((error) => {
      alert("Ha ocurrido un error de comunicación con el servidor 1");
      console.error(error);
    });
};

document
  .getElementById("select-documento")
  .addEventListener("change", function () {
    const selectedValue = this.value;
    document.getElementById("txt-documento").value = "";
    document.getElementById("txt-documento").disabled = false;
    if (document.querySelector("#select-documento").value == "1") {
      document.getElementById("txt-documento").maxLength = "8";
    } else if (document.querySelector("#select-documento").value == "2") {
      document.getElementById("txt-documento").maxLength = "9";
    } else if (document.querySelector("#select-documento").value == "3") {
      document.getElementById("txt-documento").maxLength = "11";
    } else if (document.querySelector("#select-documento").value == "4") {
      document.getElementById("txt-documento").maxLength = "16";
    }
  });

document
  .querySelector("#btn-advance")
  .addEventListener("click", async function () {
    if (verificacion()) {
      return;
    }
    if (stage === 0) {
      try {
        const personaEncontrada = await validacionRegistro();

        if (personaEncontrada) {
          //la persona ya esta en la BD
          if (
            personaEncontrada.contrasena !== "" &&
            personaEncontrada.contrasena !== null
          ) {
            //la persona ya tiene contrasena
            alert("La persona ya se encuentra registrada");
            return;
          } else {
            // no tiene contraseña
            alert("Necesitas crear una contraseña para iniciar sesión.");
            document.querySelector("#txt-nombres").value =
              personaEncontrada.nombre;
            document.querySelector("#txt-apdPaterno").value =
              personaEncontrada.apellidoPaterno;
            document.querySelector("#txt-apdMaterno").value =
              personaEncontrada.apellidoMaterno;
            document.querySelector("#txt-correo").value =
              personaEncontrada.email;
            flagClienteExiste = true; //indica que el correo ya existe pero es correcto que avance
            document.querySelector("#txt-nombres").disabled = true;
            document.querySelector("#txt-apdPaterno").disabled = true;
            document.querySelector("#txt-apdMaterno").disabled = true;
            document.querySelector("#txt-correo").disabled = true;
            localStorage.setItem(
              "dataCliente",
              JSON.stringify(personaEncontrada)
            );
          }
        } else {
        }
      } catch (error) {
        alert("Ha ocurrido un error al validar número de documento");
        console.error(error);
      }
    }

    if (stage === 1) {
      //si se autocompletaron datos no necesita verificar correo
      try {
        const correoEncontrado = await validacionCorreo(); //devuelve TRUE si no se ha encontrado ningun correo
        if (!correoEncontrado && flagClienteExiste === false) {
          //el correo ya se encuentra registrado
          alert("El correo ingresado ya se encuentra registrado.");
          return;
        } else {
          //aca debe MANDAR PIN

          try {
            const respuestaReseteo = await reseteoToken();
            alert("Se reseteo? " + respuestaReseteo);
            const respuestaPIN = await enviarPIN();
            if (!respuestaPIN) {
              alert("No se pudo enviar el token a tu correo.");
              return;
            } else {
              alert("Se envió un token a tu correo.");
            }
          } catch (error) {
            alert("Ha ocurrido un error al enviar el PIN");
            console.error(error);
          }
        }
      } catch (error) {
        alert("Ha ocurrido un error al validar el correo");
        console.error(error);
      }
    }
    if (stage === 2) {
      flagCorreoValidado = true;
      document.getElementById("btn-advance").textContent = "Finalizar";

       try {
         const flagPIN = await validacionPIN();
         alert(flagPIN);
         if (!flagPIN) {
           //el PIN no es correcto
           alert("El PIN ingresado es incorrecto.");
           return;
         } else {
           alert("El PIN ingresado es correcto.");
           //el PIN es correcto
         }
       } catch (error) {
         alert("Ha ocurrido un error al verificar el PIN");
         console.error(error);
       }
    }

    if (stage === 3) {
      if (!flagClienteExiste) {
        //cliente no existe
        const usuario = {
          nombre: document.querySelector("#txt-nombres").value,
          apellidoPaterno: document.querySelector("#txt-apdPaterno").value,
          apellidoMaterno: document.querySelector("#txt-apdMaterno").value,
          fechaNacimiento: new Date(
            document.querySelector("#dp-fecha-nacimiento").value
          )
            .toISOString()
            .slice(0, 10),
          telefono: "",
          direccion: "",
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
            if (parseInt(element) > 0) {
              alert(
                "Tu cuenta fue registrada con éxito. Ya puedes iniciar sesión con tus credenciales."
              );
              window.location.href = "/iniciarSesion";
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
        //se modifica la contrasena
        let data = JSON.parse(localStorage.getItem("dataCliente"));
        const usuario = {
          id: data.id,
          nombre: document.querySelector("#txt-nombres").value,
          apellidoPaterno: document.querySelector("#txt-apdPaterno").value,
          apellidoMaterno: document.querySelector("#txt-apdMaterno").value,
          fechaNacimiento: new Date(
            document.querySelector("#dp-fecha-nacimiento").value
          )
            .toISOString()
            .slice(0, 10),
          telefono: data.telefono,
          direccion: data.direccion,
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
          baneado: data.baneado,
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
            if (element) {
              alert(
                "Tu cuenta fue actualizada exitosamente. Ya puedes iniciar sesión con tus credenciales."
              );
              window.location.href = "/iniciarSesion";
            } else {
              alert("Ha ocurrido un error");
            }
          })
          .catch((error) => {
            alert("Ha ocurrido un error de comunicación con el servidor");
            console.error(error);
          });
      }
    }

    var bar = document.querySelector(".ProgressBar");
    if (bar.querySelectorAll(".is-current").length > 0) {
      const progressBar = document.querySelector(".ProgressBar");
      const currentSteps = progressBar.querySelectorAll(".is-current");
      currentSteps.forEach((step) => {
        step.classList.remove("is-current");
        step.classList.add("is-complete");
      });
      const firstIncompleteStep = progressBar.querySelector(
        ".ProgressBar-step:not(.is-complete)"
      );
      if (firstIncompleteStep) {
        firstIncompleteStep.classList.add("is-current");
      }
    } else {
      const firstStep = bar.querySelector(".ProgressBar-step");
      if (firstStep) {
        firstStep.classList.add("is-current");
      }
    }

    stage = stage + 1;
    console.log(stage);

    changeStage();
  });

document.querySelector("#btn-previous").addEventListener("click", function () {
  if (stage === 0) {
    if (confirm("Deseas cancelar el proceso de registro?")) {
      window.location.href = "/iniciarSesion";
      return;
    } else {
      return;
    }
  }
  if (stage === 1) {
    document.querySelector("#txt-nombres").value = "";
    document.querySelector("#txt-apdPaterno").value = "";
    document.querySelector("#txt-apdMaterno").value = "";
    document.querySelector("#txt-correo").value = "";
    flagClienteExiste = false;
    document.querySelector("#txt-nombres").disabled = false;
    document.querySelector("#txt-apdPaterno").disabled = false;
    document.querySelector("#txt-apdMaterno").disabled = false;
    document.querySelector("#txt-correo").disabled = false;
    localStorage.removeItem("dataCliente");
  }

  const bar = document.querySelector(".ProgressBar");
  const currentSteps = bar.querySelectorAll(".is-current");
  if (currentSteps.length > 0) {
    currentSteps.forEach((step) => {
      step.classList.remove("is-current");
      if (step.previousElementSibling) {
        step.previousElementSibling.classList.remove("is-complete");
        step.previousElementSibling.classList.add("is-current");
      }
    });
  } else {
    const lastCompleteStep = bar.querySelector(".is-complete:last-of-type");
    if (lastCompleteStep) {
      lastCompleteStep.classList.remove("is-complete");
      lastCompleteStep.classList.add("is-current");
    }
  }

  stage = stage - 1;
  console.log(stage);
  changeStage();
});

function changeStage() {
  switch (stage) {
    case 0:
      document.querySelector(".form-registro").style.display = "block";
      document.querySelector(".form-correo").style.display = "none";
      document.querySelector(".form-validacion").style.display = "none";
      document.querySelector(".form-contrasena").style.display = "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 1:
      document.querySelector(".form-registro").style.display = "none";
      document.querySelector(".form-correo").style.display = "block";
      document.querySelector(".form-validacion").style.display = "none";
      document.querySelector(".form-contrasena").style.display = "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 2:
      document.querySelector(".form-registro").style.display = "none";
      document.querySelector(".form-correo").style.display = "none";
      document.querySelector(".form-validacion").style.display = "block";
      document.querySelector(".form-contrasena").style.display = "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 3:
      document.querySelector(".form-registro").style.display = "none";
      document.querySelector(".form-correo").style.display = "none";
      document.querySelector(".form-validacion").style.display = "none";
      document.querySelector(".form-contrasena").style.display = "block";
      document.querySelector("#btn-previous").style.display = "block";
      break;
  }
}

function verificacion() {
  const apdPaterno = document.querySelector("#txt-apdPaterno").value;
  const apdMaterno = document.querySelector("#txt-apdMaterno").value;
  const nombres = document.querySelector("#txt-nombres").value;

  switch (stage) {
    case 0:
      var documento = document.querySelector("#txt-documento").value;
      var tipoDocumento = document.querySelector("#select-documento").value;

      if (tipoDocumento === "0") {
        alert("Por favor ingrese el documento correcto.");
        return true;
      } else if (tipoDocumento === "3") {
        if (
          documento.length !== 11 ||
          !/^[0-9]+$/.test(documento) ||
          (documento.substring(0, 2) !== "10" &&
            documento.substring(0, 2) !== "20")
        ) {
          document.querySelector("#txt-documento").focus();
          alert("Por favor ingrese un RUC correcto.");
          return true;
        }
      } else if (tipoDocumento === "1") {
        if (documento.length !== 8 || !/^[0-9]+$/.test(documento)) {
          document.querySelector("#txt-documento").focus();
          alert("Por favor ingrese un DNI correcto.");
          return true;
        }
      } else if (tipoDocumento === "2") {
        if (documento.length !== 9 || !/^[0-9]+$/.test(documento)) {
          document.querySelector("#txt-documento").focus();
          alert("Por favor ingrese un CE correcto.");
          return true;
        }
      } else if (tipoDocumento === "4") {
        document.querySelector("#txt-documento").focus();
        if (documento.length < 8 || !/^[A-Z0-9]+$/.test(documento)) {
          alert("Por favor ingrese un pasaporte correcto.");
          return true;
        }
      }
      return false;
      break;

    case 1:
      const inputFechaNacimiento = document.querySelector(
        "#dp-fecha-nacimiento"
      );
      if (new Date(inputFechaNacimiento.value) > fechaMinima) {
        alert("Debes ser mayor de 18 años.");
        return true;
      }
      const email = document.querySelector("#txt-correo").value;
      if (
        email === "" ||
        apdPaterno === "" ||
        nombres === "" ||
        inputFechaNacimiento.value === ""
      ) {
        alert("Falta completar campos");
        return true;
      }
      if (
        !/^[A-Za-z]+$/.test(apdPaterno) ||
        !/^[A-Za-z]+$/.test(apdMaterno) ||
        !/^[A-Za-z ]+$/.test(nombres)
      ) {
        if (apdMaterno !== "-") {
          document.querySelector("#txt-apdPaterno").focus();
          alert(
            "Los nombres y apellidos no deben contener caracteres especiales"
          );
          return true;
        }
      }

      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("El correo electrónico no es válido");
        return true;
      }
      return false;
      break;
    case 2:
      const pin = document.querySelector("#txt-PIN").value;

      if (pin === "") {
        alert("Falta completar el campo");
        return true;
      }

      if (pin.length !== 6) {
        alert("El PIN debe tener 6 dígitos");
        return true;
      }

      if (!/^[0-9]+$/.test(pin)) {
        alert("El PIN debe ser numérico");
        return true;
      }
      return false;
      break;
    case 3:
      const contrasena = document.querySelector("#txt-contrasena").value;
      const contrasenaConfirm = document.querySelector(
        "#txt-contrasena-confirm"
      ).value;

      if (contrasena === "") {
        alert("Ingrese una contraseña.");
        return true;
      }
      if (contrasena !== "" && contrasenaConfirm === "") {
        alert("Confirme su contraseña por favor.");
        return true;
      }
      if (contrasena !== contrasenaConfirm) {
        alert("Las contraseñas no coinciden.");
        return true;
      }

      return false;
      break;

    case 4:
      break;
  }
  return true;
}

/****APIS****/
async function validacionRegistro() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    const numero_documento = document.querySelector("#txt-documento").value;
    const id_tipo_documento = document.querySelector("#select-documento").value;
    params.append("numDocumento", numero_documento);
    params.append("tipoDocumento", id_tipo_documento);
    const url =
      GLOBAL_URL + "/usuario/verificarExistenciaDeCliente?" + params.toString();

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        resolve(null);
      });
  });
}

async function validacionCorreo() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    const email = document.querySelector("#txt-correo").value;
    params.append("correoIngresado", email);
    const url =
      GLOBAL_URL +
      "/usuario/verificarEmailIngresadoDisponible?" +
      params.toString();

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error(error);
        resolve(null);
      });
  });
}

async function enviarPIN() {
  return new Promise((resolve, reject) => {
    const email = document.querySelector("#txt-correo").value;
    const url = GLOBAL_URL + "/EmailXToken/insertar";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        emailIngresado: email,
      }),
    };

    fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          if (data !== null) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
  });
}



async function validacionPIN() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    const email = document.querySelector("#txt-correo").value;
    const token_ingresado = document.querySelector("#txt-PIN").value;
    params.append("email", email);
    params.append("token", token_ingresado);
    const url = GLOBAL_URL + "/EmailXToken/validarToken?" + params.toString();

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status + " " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error(error);
        resolve(null);
      });
  });
}

async function reseteoToken(){
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    const email = document.querySelector("#txt-correo").value;
    params.append("email", email);
    const url = GLOBAL_URL + "/EmailXToken/resetearToken?" + params.toString();

    fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.error(error);
          resolve(null);
        });
  });
}
