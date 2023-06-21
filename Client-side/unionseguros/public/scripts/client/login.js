var stage = 0;
localStorage.setItem("idCliente", null);
localStorage.setItem("idVehiculo", null);
document.getElementById("txt-documento").maxLength = "8";
var flagRegistro = false;
var flagCorreo = false;
var flagEnviarPIN = false;
var flagValidarPIN = false;

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
  document.querySelector("#dpFecha").value = new Date()
    .toISOString()
    .split("T")[0];
  const today = new Date();
  document.querySelector("#dpFecha").min = today.toISOString().split("T")[0];
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
    }else if (document.querySelector("#select-documento").value == "4") {
      document.getElementById("txt-documento").maxLength = "16";
    }


  });

document.querySelector("#btn-advance").addEventListener("click", async function () {
    if (verificacion()) {
      return;
    }
    if (stage === 0) {
      try {
        const personaEncontrada = await validacionRegistro();
        if (personaEncontrada) {
          alert(personaEncontrada.nombre + " " + personaEncontrada.contrasena);
          //la persona ya esta en la BD
          if(personaEncontrada.contrasena!=="" && personaEncontrada.contrasena!==null){
            //la persona ya tiene contrasena
            alert("La persona ya se encuentra registrada");
            return;
          }else{
            // no tiene contraseña
            alert("La persona ya se encuentra registrada pero NO tiene contrasena");
            document.querySelector("#txt-nombres").value = personaEncontrada.nombre;
            document.querySelector("#txt-apdPaterno").value = personaEncontrada.apellidoPaterno;
            document.querySelector("#txt-apdMaterno").value = personaEncontrada.apellidoMaterno;
            document.querySelector("#txt-correo").value = personaEncontrada.email;

            document.querySelector("#txt-nombres").disabled = true;
            document.querySelector("#txt-apdPaterno").disabled = true;
            document.querySelector("#txt-apdMaterno").disabled = true;
            document.querySelector("#txt-correo").disabled = true;
          }
        }else{
          alert("Puede continuar");
        }
      } catch (error) {
        alert("Ha ocurrido un error de comunicación con el servidor 0");
        console.error(error);
      }
    }

    if (stage === 1) {
      await validacionCorreo();
      if (!flagCorreo) {
        return;
      } else {
        await enviarPIN();
        if (!flagEnviarPIN) {
          return;
        }
      }
    }
    if (stage === 2) {
      await validarPIN();
      if (!flagValidarPIN) {
        return;
      }
    }
    if (stage === 4) {
      window.location.href = "/";
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

    document.querySelector("#txt-nombres").disabled = false;
    document.querySelector("#txt-apdPaterno").disabled = false;
    document.querySelector("#txt-apdMaterno").disabled = false;
    document.querySelector("#txt-correo").disabled = false;
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
      document.querySelector(".form-result").style.display = "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 1:
      document.querySelector(".form-registro").style.display = "none";
      document.querySelector(".form-correo").style.display = "block";
      document.querySelector(".form-validacion").style.display = "none";
      document.querySelector(".form-contrasena").style.display = "none";
      document.querySelector(".form-result").style.display = "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 2:
      document.querySelector(".form-registro").style.display = "none";
      document.querySelector(".form-correo").style.display = "none";
      document.querySelector(".form-validacion").style.display = "block";
      document.querySelector(".form-contrasena").style.display = "none";
      document.querySelector(".form-result").style.display = "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 3:
      document.querySelector(".form-registro").style.display = "none";
      document.querySelector(".form-correo").style.display = "none";
      document.querySelector(".form-validacion").style.display = "none";
      document.querySelector(".form-contrasena").style.display = "block";
      document.querySelector(".form-result").style.display = "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 4:
      document.querySelector(".form-registro").style.display = "none";
      document.querySelector(".form-correo").style.display = "none";
      document.querySelector(".form-validacion").style.display = "none";
      document.querySelector(".form-contrasena").style.display = "none";
      document.querySelector(".form-result").style.display = "block";
      document.querySelector("#btn-previous").style.display = "none";
      guardar();
      if (localStorage.getItem("error") === "1") {
        return;
      }
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
        if (documento.length < 8 ||!/^[A-Z0-9]+$/.test(documento)) {
          alert("Por favor ingrese un pasaporte correcto.");
          return true;
        }
      }
      return false;
      break;

    case 1:
      const email = document.querySelector("#txt-correo").value;
      if (email === "" || apdPaterno === "" || nombres === "") {
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
      if (contrasena === "") {
        alert("Falta completar el campo");
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
    numero_documento = document.querySelector("#txt-documento").value;
    id_tipo_documento = document.querySelector("#select-documento").value;
    params.append("numDocumento", numero_documento);
    params.append("tipoDocumento", id_tipo_documento);
    const url = GLOBAL_URL + "/usuario/verificarExistenciaDeCliente?" + params.toString();

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
  const email = document.querySelector("#txt-correo").value;

  try {
    const response = await fetch(
      GLOBAL_URL +
        "/usuario/verificarEmailIngresadoDisponible?correoIngresado=" +
        email
    );
    const data = await response.json();

    if (!data) {
      flagCorreo = false;
      alert("El correo ingresado ya esta en uso. Ingrese otro.");
    } else {
      flagCorreo = true;
    }
  } catch (error) {
    alert("Ha ocurrido un error de comunicación con el servidor 3");
    console.error(error);
    flagCorreo = false;
  }
}

async function enviarPIN() {
  const email = document.querySelector("#txt-correo").value;

  try {
    const data = [email];
    console.log(JSON.stringify(data));
    const response = await fetch(GLOBAL_URL + "/email/generarToken", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.text();

    alert(responseData);
    if (responseData === "SE ENVIO EL TOKEN") {
      flagEnviarPIN = true;
    } else {
      flagEnviarPIN = false;
    }
  } catch (error) {
    // Handle the error
    alert("Ha ocurrido un error de comunicación con el servidor 4");
    console.error(error);
    localStorage.setItem("error", "1");
    flagEnviarPIN = false;
  }
}

async function validarPIN() {
  const correo = document.querySelector("#txt-documento").value;
  const token_ingresado = document.querySelector("#txt-PIN").value;
  const informacion = JSON.stringify([correo, token_ingresado]);
  const url = GLOBAL_URL + "/usuario/verificarToken?informacion=" + informacion;

  try {
    const response = await fetch(url);
    const element = await response.json();

    if (element) {
      //el PIN ingresado coincide con el enviado
      flagValidarPIN = true;
    } else {
      //el PIN ingresado coincide con el enviado
      alert("El PIN ingresado no coincide");
      flagValidarPIN = false;
    }
  } catch (error) {
    alert("Ha ocurrido un error de comunicación con el servidor 5");
    console.error(error);
    localStorage.setItem("error", "1");
    flagRegistro = false;
  }
}
function guardar() {}
