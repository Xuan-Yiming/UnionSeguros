if (localStorage.getItem("documento") == null) {
  window.location.href = "/SOAT";
}
var stage = 0;
window.onbeforeunload = function (e) {
  if(stage!==3){
    return "¿Está seguro que desea salir de esta página?";
  }
};
var placa = localStorage.getItem("placa");
var tipoDocumento = localStorage.getItem("tipoDocumento");
var numeroDocumento = localStorage.getItem("documento");


localStorage.setItem("idCliente", null);
localStorage.setItem("idVehiculo", null);
localStorage.setItem("data-vehiculo", null);

window.onload = function () {
  if (
    localStorage.getItem("placa") == null ||
    localStorage.getItem("tipoDocumento") == null ||
    localStorage.getItem("documento") == null
  ) {
    window.location.href = "/SOAT";
  }
  const today = new Date();
  document.querySelector("#date-picker").min = today
    .toISOString()
    .split("T")[0];
  document.querySelector("#date-picker").value = today
    .toISOString()
    .split("T")[0];

  inicializar();
};

document.querySelector("#btn-advance").addEventListener("click", function () {
  if (stage === 3) {
    localStorage.removeItem("placa");
    localStorage.removeItem("tipoDocumento");
    localStorage.removeItem("documento");
    window.location.href = "/SOAT";
  }

  if(stage===2){
    if (confirm("¿Deseas confirmar tu pago?")){
    } else {
      return;
    }
  }

  if (!verificacion()) {
    return;
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
    if (confirm("Deseas cancelar el proceso?")) {
      window.location.href = "/SOAT";
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

async function changeStage() {
  switch (stage) {
    case 0:
      document.querySelector(".form-vehiculo ").style.display = "block";
      document.querySelector(".form-plans").style.display = "none";
      document.querySelector(".form-payment").style.display = "none";
      document.querySelector(".form-result").style.display = "none";
      document.querySelector("#btn-descargar-constancia").style.display =
        "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 1:
      document.querySelector(".form-vehiculo ").style.display = "none";
      document.querySelector(".form-plans").style.display = "block";
      document.querySelector(".form-payment").style.display = "none";
      document.querySelector(".form-result").style.display = "none";
      document.querySelector("#btn-descargar-constancia").style.display =
        "none";
      document.querySelector("#btn-previous").style.display = "block";
      loadPlans();
      break;
    case 2:
      document.getElementById("btn-advance").textContent = "Confirmar pago";
      document.querySelector(".form-vehiculo ").style.display = "none";
      document.querySelector(".form-plans").style.display = "none";
      document.querySelector(".form-payment").style.display = "block";
      document.querySelector(".form-result").style.display = "none";
      document.querySelector("#btn-descargar-constancia").style.display =
        "none";
      document.querySelector("#btn-previous").style.display = "block";
      loadTarjeta();
      break;
    case 3:
      await guardar();
      break;
  }
}

function loadPlans() {
  fetch(GLOBAL_URL + "/planSOAT/listarActivos")
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
      const planContainer = document.querySelector(".content-planes");
      planContainer.innerHTML = "";
      data.forEach((plan) => {
        const planDiv = document.createElement("div");
        planDiv.classList.add("plan-soat");

        const heading = document.createElement("h2");
        heading.innerText = plan.nombrePlan;
        planDiv.appendChild(heading);

        const price = document.createElement("h1");
        price.innerText = `S/.${plan.precio}`;
        planDiv.appendChild(price);

        const descriptionList = document.createElement("ul");
        descriptionList.classList.add("plan-soat-description");

        const coverage = document.createElement("li");
        coverage.innerText = `Cobertura completa hasta S/.${plan.cobertura}`;
        descriptionList.appendChild(coverage);

        const discount = document.createElement("li");
        discount.innerText = "Descuento del 30% en Repsol y Primax";
        descriptionList.appendChild(discount);

        const ley = document.createElement("li");
        ley.innerText = "SOAT de acuerdo a la ley.";
        descriptionList.appendChild(ley);

        planDiv.appendChild(descriptionList);

        const selectButton = document.createElement("input");
        selectButton.type = "radio";
        selectButton.name = "select-plan";
        selectButton.classList.add("button-red-white-back");
        selectButton.value = plan.id;
        selectButton.setAttribute("id-plan", plan.id);
        selectButton.setAttribute("precio-plan", plan.precio);
        selectButton.setAttribute("nombre-plan", plan.nombrePlan);
        planDiv.appendChild(selectButton);
        selectButton.addEventListener("click", function () {
          localStorage.setItem("idPlan", event.target.getAttribute("id-plan"));
          localStorage.setItem(
            "precioPlan",
            event.target.getAttribute("precio-plan")
          );
          localStorage.setItem(
            "nombrePlan",
            event.target.getAttribute("nombre-plan")
          );
        });

        planContainer.appendChild(planDiv);
      });
    })
    .catch((error) => {
      alert("Ha ocurrido un error de comunicación con el servidor 1");
      console.error(error);
    });
}

function loadResumen() {
  document.getElementById("btn-advance").textContent = "Finalizar";
  let placa = localStorage.getItem("placa");
  let nuevaPlaca = placa.substring(0, 3) + "-" + placa.substring(3);
  document.querySelector("#txt-res-nombre").innerText =
      document.querySelector("#txt-nombres").value + " " +
      document.querySelector("#txt-apdPaterno").value +
      " " +
      document.querySelector("#txt-apdMaterno").value;
  document.querySelector("#txt-res-placa").innerText = nuevaPlaca;
  document.querySelector("#txt-res-plan").innerText =
      localStorage.getItem("nombrePlan");
  document.querySelector("#txt-res-total").innerText =
      "S/." + localStorage.getItem("precioPlan");
  const datePickerInput = document.querySelector("#date-picker");
  const dateValue = datePickerInput.value; // Assuming the input value is a valid date string

  const currentDate = new Date(dateValue);
  currentDate.setFullYear(currentDate.getFullYear() + 1);

  document.querySelector("#txt-res-periodo").innerText =
      "Desde " +
      document.querySelector("#date-picker").value +
      " hasta " +
      currentDate.toISOString().slice(0, 10);

  localStorage.removeItem("placa");
  localStorage.removeItem("tipoDocumento");
  localStorage.removeItem("documento");
}

function loadTarjeta() {
  document.querySelectorAll('input[name="select-plan"]').forEach((plan) => {
    if (plan.checked) {
      document.querySelector("#total-a-pagar").innerText =
        "Total: " + plan.parentElement.querySelector("h1").innerText;
    }
  });
}

function verificacion() {
  let apdPaterno = document.querySelector("#txt-apdPaterno").value;
  let apdMaterno = document.querySelector("#txt-apdMaterno").value;
  const nombres = document.querySelector("#txt-nombres").value;
  let marca;
  let modelo;
  if(localStorage.getItem("data-vehiculo")===null){
    marca = document.querySelector("#select-marca").value;
    modelo = document.querySelector("#select-modelo").value;
  }else{
    var data = JSON.parse(localStorage.getItem("data-vehiculo"));
    marca = data.fidModelo.fidMarcaVehiculo.id;
    modelo = data.fidModelo.id;
  }
  const anio = document.querySelector("#txt-anio").value;
  const numAsiento = document.querySelector("#txt-asientos").value;
  const uso = document.querySelector("#select-uso").value;
  const numSerie = document.querySelector("#txt-serie").value;
  const fecha = document.querySelector("#date-picker").value;

  switch (stage) {
    case 0:
      if (
          apdPaterno =="" ||
        nombres == "" ||
        marca == "" ||
        modelo == "" ||
        anio == "" ||
        uso == "" ||
        numAsiento == "" ||
        numSerie == "" ||
        fecha == ""
      ) {
        alert("Falta completar campos");
        return false;
      }

      if (!/^[0-9]+$/.test(numAsiento)) {
        document.querySelector("#txt-asientos").focus();
        alert("El número de asientos debe ser numérico");
        return false;
      }

      if (numAsiento < 1 || numAsiento > 20) {
        document.querySelector("#txt-asientos").focus();
        alert("El número de asientos debe estar entre 1 y 20");
        return false;
      }

      if (!/^[0-9]+$/.test(anio)) {
        document.querySelector("#txt-anio").focus();
        alert("El año debe ser numérico");
        return false;
      }

      if (anio < 2000 || anio > new Date().getFullYear()) {
        document.querySelector("#txt-anio").focus();
        alert("El año debe estar entre 2000 y " + new Date().getFullYear());
        return false;
      }

      if (numSerie.length !== 17) {
        document.querySelector("#txt-serie").focus();
        alert("El número de serie debe tener 17 caracteres");
        return false;
      }

      if(
          (apdPaterno !== "" && !/^[A-Za-z -]+$/.test(apdPaterno)) ||
          (apdMaterno !== "" && !/^[A-Za-z -]+$/.test(apdMaterno)) ||
          !/^[A-Za-z ]+$/.test(nombres)
      ){
        document.querySelector("#txt-apdPaterno").focus();
        alert(
            "Los nombres y apellidos no deben contener caracteres especiales"
        );
        return false;
      }

      if(apdMaterno==="" && (tipoDocumento!=="4" && tipoDocumento!=="2" && tipoDocumento!=="3")){
        alert("Complete su apellido por favor");
        return false;
      }else if(apdMaterno==="" && (tipoDocumento==="4" || tipoDocumento==="2" || tipoDocumento==="3")){
        document.querySelector("#txt-apdMaterno").value = '-';
      }

      if(tipoDocumento==="3" && numeroDocumento.substring(0, 2) === "20"){
        document.querySelector("#txt-apdPaterno").value = '-'
        document.querySelector("#txt-apdMaterno").value = '-'
      }

      break;
    case 1:
      //verificar que se haya seleccionado un plan
      var cont = 0;
      document.querySelectorAll('input[name="select-plan"]').forEach((plan) => {
        if (plan.checked) {
          cont++;
        }
      });
      if (cont === 0) {
        alert("Debe seleccionar un plan");
        return false;
      }

      break;
    case 2:
      //verificar que se haya llenado los datos de la tarjeta
      const numTarjeta = document.querySelector("#txt-num-tarjeta").value;
      const cvv = document.querySelector("#txt-CVV").value;
      const fechaVencimiento = document.querySelector("#txt-fecha-venc").value;
      const nombreTitular = document.querySelector("#txt-tarjeta-nombre").value;
      const email = document.querySelector("#txt-email").value;
      const moneda = 1;

      if (
        numTarjeta == "" ||
        cvv == "" ||
        fechaVencimiento == "" ||
        nombreTitular == "" ||
        email == "" ||
        moneda == ""
      ) {
        alert("Falta completar campos");
        return false;
      }

      if (numTarjeta.length != 16) {
        document.querySelector("#txt-num-tarjeta").focus();
        alert("El número de tarjeta debe tener 16 caracteres");
        return false;
      }

      if (!/^[0-9]+$/.test(numTarjeta)) {
        document.querySelector("#txt-num-tarjeta").focus();
        alert("El número de tarjeta debe ser numérico");
        return false;
      }

      if (!validateCardExpiration(fechaVencimiento)) {
        document.querySelector("#txt-fecha-venc").focus();
        alert("La fecha de vencimiento no es válido (MM/YY)");
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.querySelector("#txt-email").focus();
        alert("El correo electrónico no es válido");
        return false;
      }

      if (cvv.length != 3) {
        document.querySelector("#txt-CVV").focus();
        alert("El CVV debe tener 3 caracteres");
        return false;
      }

      if (!/^[0-9]+$/.test(cvv)) {
        document.querySelector("#txt-CVV").focus();
        alert("El CVV debe ser numérico");
        return false;
      }

      if (!/^[A-Za-z ]+$/.test(nombreTitular)) {
        document.querySelector("#txt-tarjeta-nombre").focus();
        alert("El nombre del titular no debe contener caracteres especiales");
        return false;
      }
      break;
    case 3:
      break;
  }
  return true;
}
function validateCardExpiration(expirationDate) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
  const currentYear = currentDate.getFullYear() % 100; // Getting the last two digits of the current year

  // Check if the expiration date has the correct format MM/yy
  const datePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!datePattern.test(expirationDate)) {
    return false;
  }

  // Extract month and year from the expiration date
  const [expirationMonth, expirationYear] = expirationDate
    .split("/")
    .map(Number);

  // Check if the expiration date is greater than the current date
  if (
    expirationYear < currentYear ||
    (expirationYear === currentYear && expirationMonth <= currentMonth)
  ) {
    return false;
  }

  return true;
}

async function guardar() {
  const apdPaterno = document.querySelector("#txt-apdPaterno").value;
  const apdMaterno = document.querySelector("#txt-apdMaterno").value;
  const nombres = document.querySelector("#txt-nombres").value;
  const fecha = document.querySelector("#date-picker").value;
  const dateParts = fecha.split("-");
  const yyyy = dateParts[0];
  const mm = dateParts[1];
  const dd = dateParts[2];
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  let marca;
  let modelo;
  if(localStorage.getItem("data-vehiculo")===null){
    marca = document.querySelector("#select-marca").value;
    modelo = document.querySelector("#select-modelo").value;
  }else{
    var data = JSON.parse(localStorage.getItem("data-vehiculo"));
    marca = data.fidModelo.fidMarcaVehiculo.id;
    modelo = data.fidModelo.id;
  }

  const anio = document.querySelector("#txt-anio").value;
  const uso = document.querySelector("#select-uso").value;
  const numAsiento = document.querySelector("#txt-asientos").value;
  const numSerie = document.querySelector("#txt-serie").value;

  const numTarjeta = document.querySelector("#txt-num-tarjeta").value;
  const cvv = document.querySelector("#txt-CVV").value;
  const fechaVencimiento = document.querySelector("#txt-fecha-venc").value;
  const nombreTitular = document.querySelector("#txt-tarjeta-nombre").value;
  const email = document.querySelector("#txt-email").value;
  const [month, year] = fechaVencimiento.split("/");
  const date = `${20 + year}-${month}-01`;

  const moneda = 1;

  try {
    let data = {
      cliente: {
        nombre: nombres,
        email: email,
        apellidoPaterno: apdPaterno,
        apellidoMaterno: apdMaterno,
        numeroDocumento: localStorage.getItem("documento"),
        fidRoles: {
          id: "1",
        },
        fidTipoDocumento: {
          id: localStorage.getItem("tipoDocumento"),
        },
        fechaCreacion: new Date().toISOString().slice(0, 10),
      },

      vehiculo: {
        fidTipoUso: {
          id: uso,
        },
        fidModelo: {
          id: modelo,
        },
        anhoFabricacion: anio,
        numeroAsientos: numAsiento,
        placa: this.placa,
        serie: numSerie,
      },
      MetodoPago: {
        nombreMetodo: "VISA",
        nombreTitular: nombreTitular,
        correo: email,
        numeroTarjeta: numTarjeta,
        cvv: cvv,
        fechaVencimiento: date,
      },
      poliza: {
        fidMoneda: {
          id: moneda,
        },
        precioBase: localStorage.getItem("precioPlan"),
        fechaVigenciaDesde: formattedDate,
        fechaVigenciaFin: `${parseInt(yyyy) + 1}-${mm}-${dd}`,
      },
      soat: {
        fidPlanSoat: {
          id: localStorage.getItem("idPlan"),
        },
        fechaDeEmision: new Date().toISOString().slice(0, 10),
        montoPrima: localStorage.getItem("precioPlan"),
      },
    };

    const idCliente = localStorage.getItem("idCliente");
    if (
      idCliente != null &&
      idCliente != "null" &&
      idCliente != "" &&
      idCliente != undefined &&
      idCliente != 0
    ) {
      data.cliente.id = idCliente;
    }

    const idVehiculo = localStorage.getItem("idVehiculo");
    if (
      idVehiculo != null &&
      idVehiculo != "null" &&
      idVehiculo != "" &&
      idVehiculo != undefined &&
      idVehiculo != 0
    ) {
      data.vehiculo.id = idVehiculo;
    }

    console.log(JSON.stringify(data));
    localStorage.setItem("soatDataCompleta", JSON.stringify(data));
    fetch(GLOBAL_URL + "/ProcesoSOAT/insertarInfoProceso1", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status + " " + response.statusText);
        }
      })
      .then((data) => {
        alert("Se realizo la compra correctamente");
        loadResumen();
        document.querySelector(".form-vehiculo ").style.display = "none";
        document.querySelector(".form-plans").style.display = "none";
        document.querySelector(".form-payment").style.display = "none";
        document.querySelector(".form-result").style.display = "block";
        document.querySelector("#btn-descargar-constancia").style.display =
          "block";
        document.querySelector("#btn-previous").style.display = "none";
      })
      .catch((error) => {
        console.error(error);
        localStorage.setItem("error", 1);
      });
  } catch (error) {
    localStorage.setItem("error", 1);
    console.error("Error:", error);
    stage--;
  }
}

async function inicializar() {
  await cargarPersona();
  await cargarVehiculo();

  if(localStorage.getItem("data-vehiculo")===null){
    await cargarMarcas();
    await cargarModelos();
  }else{

    var data = JSON.parse(localStorage.getItem("data-vehiculo"));

    var selectMarca = document.querySelector("#select-marca");
    selectMarca.options[0].textContent = data.fidModelo.fidMarcaVehiculo.marca;

    document.querySelector("#select-marca").disabled = true;

    var selectModelo = document.querySelector("#select-modelo");
    selectModelo.options[0].textContent = data.fidModelo.modelo;
    document.querySelector("#select-modelo").disabled = true;
  }

  if(tipoDocumento==="3" && numeroDocumento.substring(0, 2) === "20"){
    document.querySelector("#txt-apdPaterno").style.display = "none";
    document.querySelector("#apPaternoIDText").style.display = "none";
    document.querySelector("#txt-apdMaterno").style.display = "none";
    document.querySelector("#apMaternoIDText").style.display = "none";

    document.querySelector("#nombreIDText").innerText = "Nombre completo empresa";
    document.querySelector("#txt-apdPaterno").value = "-";
    document.querySelector("#txt-apdMaterno").value = "-";
  }
}

async function cargarMarcas() {
  fetch(GLOBAL_URL + "/marcaVehiculo/listarTodas")
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
      if (data != null) {
        data.forEach((element) => {
          var _option = document.createElement("option");
          _option.value = element.id;
          _option.text = element.marca;
          document.querySelector("#select-marca").appendChild(_option);
        });
      }
    })
    .catch((error) => {
      alert("Ha ocurrido un error de comunicación con el servidor 2");
      console.error(error);
    });
}

async function cargarModelos() {
  document
    .querySelector("#select-marca")
    .addEventListener("change", function () {
      document.querySelector("#select-modelo").innerHTML = "";
      const params = new URLSearchParams();
      params.append("idMarca", document.querySelector("#select-marca").value);

      const url =
        GLOBAL_URL + "/modelo/listarModelosPorIdMarca?" + params.toString();
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
          data.forEach((element) => {
            var _option = document.createElement("option");
            _option.value = element.id;
            _option.text = element.modelo;
            document.querySelector("#select-modelo").appendChild(_option);
          });
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor 3");
          console.error(error);
        });
    });
}

async function cargarPersona() {
  const url =
    GLOBAL_URL +
    "/cliente/buscarClientePorNumDocumento?numDocumentoIngresado=" +
    localStorage.getItem("documento");
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
      if (data != null) {
        if (data.id == -1) {
          alert("Por favor comunica con soporte para continuar con la compra");
          window.location.href = "/";
        }
        localStorage.setItem("idCliente", data.id);
        
        document.querySelector("#txt-apdPaterno").value = data.apellidoPaterno;
        document.querySelector("#txt-apdMaterno").value = data.apellidoMaterno;
        document.querySelector("#txt-nombres").value = data.nombre;
        document.querySelector("#txt-email").value = data.email;

        if (data.apellidoMaterno == "") {
          document.querySelector("#txt-apdMaterno").value = "-";
        }

        if (data.serie != "") {
          document.querySelector("#txt-nombres").disabled = true;
          document.querySelector("#txt-apdPaterno").disabled = true;
          document.querySelector("#txt-apdMaterno").disabled = true;
          document.querySelector("#txt-email").disabled = true;
        }
      }
    })
    .catch((error) => {
      if (error.message === "Unexpected end of JSON input") {
        return;
      }
      alert("Ha ocurrido un error de comunicación con el servidor 4");
      console.error(error);
    });
}

async function cargarVehiculo() {
  const params = new URLSearchParams();
  params.append("placaIngresada", localStorage.getItem("placa"));
  const url = GLOBAL_URL + "/vehiculo/buscarVehiculoPorPlaca?" + params.toString();
  console.log(url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.status + " " + response.statusText);
    }

    const data = await response.json();
    if (data != null) {
      localStorage.setItem("data-vehiculo", JSON.stringify(data));
      localStorage.setItem("idVehiculo", data.id);

      // numero de asientos
      if (data.numeroAsientos != "") {
        document.querySelector("#txt-asientos").value = data.numeroAsientos;
        document.querySelector("#txt-asientos").disabled = true;
      }
      // anio
      if (data.anhoFabricacion != "") {
        document.querySelector("#txt-anio").value = data.anhoFabricacion.toString();
        document.querySelector("#txt-anio").disabled = true;
      }
      //serie
      if (data.serie != "") {
        document.querySelector("#txt-serie").value = data.serie;
        document.querySelector("#txt-serie").disabled = true;
      }
      //uso
      if (data.fidTipoUso != "") {
        document.querySelector("#select-uso").value = data.fidTipoUso.idTipoUso;
        document.querySelector("#select-uso").disabled = true;
      }
    }
  } catch (error) {
    if (error.message === "Unexpected end of JSON input") {
      return;
    }
    alert("Ha ocurrido un error de comunicación con el servidor 6");
    console.error(error);
  }
}


function validateNumericInput(input) {
  // Obtener el valor del campo de texto
  const value = input.value;

  // Eliminar cualquier caracter no numérico del valor
  const numericValue = value.replace(/\D/g, '');

  // Actualizar el valor del campo de texto con solo caracteres numéricos
  input.value = numericValue;
}


document.querySelector("#btn-descargar-constancia").addEventListener("click", function () {
  let marca;
  let modelo;
  if(localStorage.getItem("data-vehiculo")===null){
    marca = document.querySelector("#select-marca option:checked").innerText;
    modelo = document.querySelector("#select-modelo option:checked").innerText;
  }else{
    var data = JSON.parse(localStorage.getItem("data-vehiculo"));
    marca = data.fidModelo.fidMarcaVehiculo.nombre;
    modelo = data.fidModelo.nombre;
  }
  const soatData ={
    nombre: document.querySelector("#txt-res-nombre").textContent,
    placa: document.querySelector("#txt-res-placa").textContent,
    nombrePlan: document.querySelector("#txt-res-plan").textContent,
    total: document.querySelector("#txt-res-total").textContent,
    periodo: document.querySelector("#txt-res-periodo").textContent,
    poliza: document.querySelector("#txt-serie").value+"8S",
    marca: marca,
    modelo: modelo,
  }
  generarPDF(soatData);
});

async function generarPDF(soatData) {
  // Extraigo datos necesarios para el pdf

  const imageURL = 'public/resources/logos/logo-transparent-back.png';
  const imageDataURL = await getImageDataURL(imageURL);

  // contenido del PDF
  const content = [

    // Título
    { text: 'Resumen Compra SOAT', style: 'header' },

    // Logo
    { image: imageDataURL, width: 140, alignment: 'center',
      margin: [5, 5] },

    // Separación notable
    { text: '', margin: [0, 0, 0, 20] },
    // CONTRATANTE/ASEGURADO
    { text: 'CONTRATANTE/ASEGURADO', style: 'subheader' },
    { text: soatData.nombre, style: 'subtitle' },

    // VIGENCIA DE LA PÓLIZA
    { text: 'NUMERO DE POLIZA', style: 'subheader' },
    { text: soatData.poliza, style: 'subtitle'},
    { text: 'VIGENCIA DE LA PÓLIZA', style: 'subheader' },
    { text: soatData.periodo, style: 'subtitle', margin: [0, 0, 0, 20]},

    // PLAN SOAT
    { text: 'PLAN SOAT', style: 'subheader' },
    { text: soatData.nombrePlan, style: 'subtitle' },
    { text: soatData.total, style: 'subtitle' },
    // VEHÍCULO ASEGURADO
    { text: 'MARCA', style: 'subheader' },
    { text: soatData.marca, style: 'subtitle'},
    { text: 'MODELO', style: 'subheader' },
    { text: soatData.modelo, style: 'subtitle'},
    { text: 'PLACA VEHICULAR', style: 'subheader' },
    { text: soatData.placa, style: 'subtitle'},
    

  ];

  // Definir los estilos del PDF
  const styles = {
    header: {
      fontSize: 18,
      bold: true,
      alignment: 'center',
      margin: [0, 0, 0, 10],
    },
    subheader: {
      fontSize: 15,
      bold: true,
      margin: [0, 10, 0, 5],
      color: '#122757',
    },
    subtitle: {
      fontSize: 14,
      bold: true,
      margin: [0, 0, 0, 3],
    },
  };

  // Definir el documento PDF
  const docDefinition = {
    content,
    styles,
    pageMargins: [80, 40, 80, 40],
  };

  // Genero el PDF
  const nombreArchivo = `${soatData.placa}_RESUMEN_COMPRA_SOAT.pdf`;
  pdfMake.createPdf(docDefinition).download(nombreArchivo);
}

function getImageDataURL(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}

