var stage = 0;


window.onload = function () {
};

document
    .querySelector("#btn-advance")
    .addEventListener("click", async function () {
      if (verificacion()) {
        return;
      }
      if (stage === 0) {
        try {
          const respuestaReseteo = await reseteoToken();
          alert("Se ha enviado un token de verificación a tu correo");
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
      if (stage === 1) {
        document.getElementById("btn-advance").textContent = "Finalizar";
        try {
          const flagPIN = await validacionPIN();
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

      if (stage === 2) {
        try {
          const flagCambioContrasena = await modificarContrasena();
          if (!flagCambioContrasena) {
            //el correo no existe en la BD
            alert("Usted no tiene una cuenta vinculada a Union Seguros.");
            return;
          } else {
            alert("Tu contraseña fue cambiada satisfactoriamente.");
            window.location.href = "/iniciarSesion";
            //el correo existe en la BD
          }
        } catch (error) {
          alert("Ha ocurrido un error al verificar el correo.");
          console.error(error);
          window.location.href = "/iniciarSesion";
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
    if (confirm("¿Deseas cancelar el proceso de recuperación de contraseña?")) {
      window.location.href = "/iniciarSesion";
      return;
    } else {
      return;
    }
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
      document.querySelector(".form-correo").style.display = "block";
      document.querySelector(".form-validacion").style.display = "none";
      document.querySelector(".form-contrasena").style.display = "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 1:
      document.querySelector(".form-correo").style.display = "none";
      document.querySelector(".form-validacion").style.display = "block";
      document.querySelector(".form-contrasena").style.display = "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 2:
      document.querySelector(".form-correo").style.display = "none";
      document.querySelector(".form-validacion").style.display = "none";
      document.querySelector(".form-contrasena").style.display = "block";
      document.querySelector("#btn-previous").style.display = "block";
      break;
  }
}

function verificacion() {
  switch (stage) {
    case 0:
      const email = document.querySelector("#txt-correo").value;
      if (
          email === ""
      ) {
        alert("Ingrese su correo electrónico");
        return true;
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("El correo electrónico no es válido");
        return true;
      }
      return false;
      break;
    case 1:
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
    case 2:
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
    case 3:
      break;
  }
  return true;
}

/****APIS****/

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

async function modificarContrasena() {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    const email = document.querySelector("#txt-correo").value;
    const contrasenia = document.querySelector("#txt-contrasena").value;
    params.append("correoIngresado", email);
    params.append("contrasenia", contrasenia);
    const url = GLOBAL_URL + "/usuario/actualizarContrasenia?" + params.toString();

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
