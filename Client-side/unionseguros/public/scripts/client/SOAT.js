
window.onload = function () {
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
      alert("Ha ocurrido un error de comunicación con el servidor");
      console.error(error);
    });

  document.querySelector("#btn-cotizar").addEventListener("click", async function () {
    if (verificacion()) {
      return;
    }

    const placa = document.querySelector("#txt-placa").value;
    const documento = document.querySelector("#txt-documento").value;
    const tipoDocumento = document.querySelector("#select-documento").value;

    try {
      const vehiculoEncontrado = await comprobarPlaca(placa);
      if (vehiculoEncontrado) {
        alert("El vehiculo ya cuenta con seguro SOAT.");
        // No guarda los datos ni redirecciona
        return;
      }else{
        localStorage.setItem("placa", placa);
        localStorage.setItem("documento", documento);
        localStorage.setItem("tipoDocumento", tipoDocumento);
        window.location.href = "/SOATProceso";
      }

    } catch (error) {
      alert("Ha ocurrido un error de comunicación con el servidor");
      console.error(error);
    }
  });
};

//Q&A
function toggleAnswer(answerId) {
  var answer = document.getElementById("answer" + answerId);
  var toggleIcon = document.getElementById("toggle-icon" + answerId);
  if (answer.style.display === "block") {
    answer.style.display = "none";
    toggleIcon.classList.remove("active");
  } else {
    answer.style.display = "block";
    toggleIcon.classList.add("active");
  }
}

function verificacion() {
  var placa = document.querySelector("#txt-placa").value;
  var documento = document.querySelector("#txt-documento").value;
  var tipoDocumento = document.querySelector("#select-documento").value;

  if (tipoDocumento === "0") {
    alert("Por favor ingrese el documento correcto.");
    return true;
  } else if (tipoDocumento === "5") {
    if (
      documento.length !== 11 ||
      !/^[0-9]+$/.test(documento) ||
      (documento.substring(0, 2) !== "10" && documento.substring(0, 2) !== "20")
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
  } else if (tipoDocumento === "3") {
    document.querySelector("#txt-documento").focus();
    if (!/^[A-Z0-9]+$/.test(documento)) {
      alert("Por favor ingrese un pasaporte correcto.");
      return true;
    }
  }
  if (placa === "" || placa.length !== 6 || !/^[A-Za-z0-9]+$/.test(placa)) {
    document.querySelector("#txt-placa").focus();
    alert("Por favor ingrese la placa correcta.");
    return true;
  }

  return false;
}



async function comprobarPlaca(placa) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    params.append("placaIngresada", placa);
    const url = GLOBAL_URL + "/vehiculo/buscarVehiculoPorPlaca?" + params.toString();

    fetch(url)
        .then((response) => {
          if (!response.ok) {
            return null;
          }
          return response.text();
        })
        .then((data) => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData != null);
          } catch (error) {
            resolve(null);
          }
        })
        .catch((error) => {
          reject(error);
        });
  });
}
