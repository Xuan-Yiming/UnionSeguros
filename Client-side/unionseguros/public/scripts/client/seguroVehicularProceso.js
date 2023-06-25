window.onbeforeunload = function (e) {
  return "¿Está seguro que desea salir de esta página?";
};

if (localStorage.getItem("documento") == null) {
  window.location.href = "/seguroVehicular";
}
localStorage.removeItem("data-vehiculo");
var stage = 0;
let selectedPlans = [];
let total = 0;
var placa = localStorage.getItem("placa");
var tipoDocumento = localStorage.getItem("tipoDocumento");
var numeroDocumento = localStorage.getItem("documento");

const inputFechaNacimiento = document.querySelector("#date-picker2");

// La fecha mínima permitida (hace 18 años)
const fechaMinima = new Date();
fechaMinima.setFullYear(fechaMinima.getFullYear() - 18);

// No deja poner otras fechas posteriores a esta
inputFechaNacimiento.max = fechaMinima.toISOString().split("T")[0];

localStorage.setItem("idCliente", null);
localStorage.setItem("idVehiculo", null);
var flagMonto = false;
var montoEstimado = 0.0;

window.onload = function () {
  if (
    localStorage.getItem("placa") == null ||
    localStorage.getItem("tipoDocumento") == null ||
    localStorage.getItem("documento") == null
  ) {
    window.location.href = "/seguroVehicular";
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

document
  .querySelector("#btn-advance")
  .addEventListener("click", async function () {
    if (stage === 0) {
      await validacionMonto();
      if (!flagMonto) {
        alert(
          "Su vehiculo no puede ser cotizado debido a su año de fabricacion."
        );
        return;
      }
    }

    if (stage === 3) {
      localStorage.removeItem("placa");
      localStorage.removeItem("tipoDocumento");
      localStorage.removeItem("documento");
      window.location.href = "/seguroVehicular";
    }

    if (stage === 2) {
      localStorage.setItem("total", total);
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
      window.location.href = "/seguroVehicular";
      return;
    } else {
      return;
    }
  }

  if(stage===2){
    selectedPlans = [];
    total = 0;
    updateTotal();
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
      document.querySelector(".form-vehiculo ").style.display = "block";
      document.querySelector(".form-personal ").style.display = "none";
      document.querySelector(".form-plans").style.display = "none";
      document.querySelector(".form-result").style.display = "none";
      document.querySelector("#btn-descargar-constancia").style.display =
        "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 1:
      document.querySelector(".form-vehiculo ").style.display = "none";
      document.querySelector(".form-personal ").style.display = "block";
      document.querySelector(".form-plans").style.display = "none";
      document.querySelector(".form-result").style.display = "none";
      document.querySelector("#btn-descargar-constancia").style.display =
        "none";
      document.querySelector("#btn-previous").style.display = "block";
      break;
    case 2:
      document.querySelector(".form-vehiculo ").style.display = "none";
      document.querySelector(".form-personal ").style.display = "none";
      document.querySelector(".form-plans").style.display = "block";
      document.querySelector(".form-result").style.display = "none";
      document.querySelector("#btn-descargar-constancia").style.display =
        "none";
      document.querySelector("#btn-previous").style.display = "block";
      loadPlans();
      break;
    case 3:
      guardar();
      if (localStorage.getItem("error") === "1") {
        return;
      }

      break;
  }
}

function loadPlans() {
  fetch(GLOBAL_URL + "/detalleCotizacion/listarTodosActivos")
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
      const planContainer = document.querySelector(".content-plan");
      planContainer.innerHTML = "";
      data.forEach((plan) => {
        const planDiv = document.createElement("div");
        planDiv.classList.add("plan-seguro-vehicular");

        const benefit = document.createElement("h2");
        benefit.innerText = `${plan.beneficio}`;
        planDiv.appendChild(benefit);

        const price = document.createElement("h1");
        price.innerText = `S/.${plan.monto}`;
        planDiv.appendChild(price);

        const selectButton = document.createElement("input");
        selectButton.type = "checkbox"; // Cambiar el tipo de input a checkbox
        selectButton.classList.add("checkbox_benefit");
        selectButton.value = plan.id;
        selectButton.setAttribute("id-plan", plan.id);
        selectButton.setAttribute("monto-plan", plan.monto);
        selectButton.setAttribute("beneficio-plan", plan.beneficio);
        selectButton.addEventListener("change", function (event) {
          const planId = event.target.getAttribute("id-plan");
          const planPrice = parseFloat(event.target.getAttribute("monto-plan"));
          const planBenefit = event.target.getAttribute("beneficio-plan");

          if (event.target.checked) {
            // Agregar el plan a la lista de seleccionados
            selectedPlans.push({
              id: planId,
              monto: planPrice,
              beneficio: planBenefit,
            });
          } else {
            // Remover el plan de la lista de seleccionados
            selectedPlans = selectedPlans.filter((plan) => plan.id !== planId);
          }
          updateTotal();
        });
        planDiv.appendChild(selectButton);

        planContainer.appendChild(planDiv);
      });
    })
    .catch((error) => {
      alert("Ha ocurrido un error de comunicación con el servidor");
      console.error(error);
    });
}

function updateTotal() {
  const totalElement = document.getElementById("total");
  total = 0;
  selectedPlans.forEach((plan) => {
    total += plan.monto;
  });

  totalElement.innerText = `Precio total acumulado: S/.${montoEstimado+total}`;
}

function updateLocalStorage() {
  localStorage.setItem("selectedPlans", JSON.stringify(selectedPlans));
  localStorage.setItem("total", total);
}

// Cargar los planes y actualizar el total inicial

function loadResumen() {
  let placa = localStorage.getItem("placa");
  let nuevaPlaca = placa.substring(0, 3) + "-" + placa.substring(3);
  const total = parseFloat(localStorage.getItem("total"));
  const suma = total + montoEstimado;
  document.querySelector("#txt-res-total").innerText =
      "S/." + suma.toFixed(2);

  document.querySelector("#txt-res-total-beneficios").innerText =
      "S/." + total.toFixed(2);

  document.querySelector("#txt-res-inicial-vehiculo").innerText =
      "S/." + montoEstimado.toFixed(2);

  document.querySelector("#txt-res-nombre").innerText =
    document.querySelector("#txt-nombres").value + " " +
      document.querySelector("#txt-apdPaterno").value +
    " " +
      document.querySelector("#txt-apdMaterno").value;
  document.querySelector("#txt-res-placa").innerText = nuevaPlaca;

  const datePickerInput = document.querySelector("#date-picker");
  const dateValue = datePickerInput.value; // Assuming the input value is a valid date string

  const currentDate = new Date(dateValue);
  currentDate.setFullYear(currentDate.getFullYear() + 1);

  document.querySelector("#txt-res-periodo").innerText =
    "Desde " +
    document.querySelector("#date-picker").value +
    " hasta " +
    currentDate.toISOString().slice(0, 10);

  const listaBeneficios = document.getElementById("lista-beneficios-escogidos");
  listaBeneficios.innerHTML = "";
  selectedPlans.forEach(function (plan) {
    const planElement = document.createElement("div");
    const beneficioElement = document.createElement("p");

    beneficioElement.textContent = plan.beneficio + ": " + "S/. " + plan.monto;

    planElement.appendChild(beneficioElement);
    listaBeneficios.appendChild(planElement);
  });

  localStorage.removeItem("placa");
  localStorage.removeItem("tipoDocumento");
  localStorage.removeItem("documento");
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
  const fecha2 = document.querySelector("#date-picker2").value;
  const numCelular = document.querySelector("#txt-numCelular").value;
  const departamento = document.querySelector("#select-departamento").value;
  const provincia = document.querySelector("#select-provincia").value;
  const distrito = document.querySelector("#select-distrito").value;
  const direccion = document.querySelector("#txt-direccion").value;
  const email = document.querySelector("#txt-correo").value;

  switch (stage) {
    case 0:
      if ( marca == "" || modelo == "" || anio == "" || uso == "" || numAsiento == "" || numSerie == "" || fecha == "") {
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

      if (numSerie.length != 17) {
        document.querySelector("#txt-serie").focus();
        alert("El número de serie debe tener 17 caracteres");
        return false;
      }

      if (uso === "") {
        document.querySelector("#select-uso").focus();
        alert("Seleccione el uso de su vehículo");
        return false;
      }

      break;
    case 1:
      const inputFechaNacimiento = document.querySelector(
          "#date-picker2"
      );
      if (new Date(inputFechaNacimiento.value) > fechaMinima) {
        alert("Debes ser mayor de 18 años.");
        return false;
      }

      if (apdPaterno =="" || nombres == "" || fecha2 == "" || numCelular == "" || departamento == "" || provincia == ""
            || distrito=="" || direccion =="" || email==""    ) {
        alert("Falta completar campos");
        return false;
      }
      if (!/^[0-9]+$/.test(numCelular)) {
        document.querySelector("#txt-numCelular").focus();
        alert("El número celular debe ser numérico");
        return false;
      }

      if (numCelular.length !== 9) {
        document.querySelector("#txt-numCelular").focus();
        alert("El número celular debe tener 9 caracteres");
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

      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("El correo electrónico no es válido");
        return false;
      }

      break;

    case 2:

      break;

    case 3:
      break;
  }
  return true;
}

async function inicializar() {
  document.querySelector(".form-vehiculo ").style.display = "block";
  document.querySelector(".form-plans").style.display = "none";

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

  await cargarDepartamento();
  await cargarProvincia();
  await cargarDistrito();


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
      data.forEach((element) => {
        var _option = document.createElement("option");
        _option.value = element.id;
        _option.text = element.marca;
        document.querySelector("#select-marca").appendChild(_option);
      });
    })
    .catch((error) => {
      alert("Ha ocurrido un error de comunicación con el servidor");
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
          alert("Ha ocurrido un error de comunicación con el servidor");
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
        localStorage.setItem("idCliente", data.id);

        document.querySelector("#txt-apdPaterno").value = data.apellidoPaterno;
        document.querySelector("#txt-apdMaterno").value = data.apellidoMaterno;
        document.querySelector("#txt-nombres").value = data.nombre;
        document.querySelector("#txt-correo").value = data.email;

        if (data.apellidoMaterno == "") {
          document.querySelector("#txt-apdMaterno").value = "-";
        }

          document.querySelector("#txt-nombres").disabled = true;
          document.querySelector("#txt-apdPaterno").disabled = true;
          document.querySelector("#txt-apdMaterno").disabled = true;
          document.querySelector("#txt-correo").disabled = true;

          if(data.direccion!=="" && data.direccion!==null){
            document.querySelector("#txt-direccion").value = data.direccion;
            document.querySelector("#txt-direccion").disabled = true;
          }
          if(data.telefono!=="" && data.telefono!==null){
            document.querySelector("#txt-numCelular").value = data.telefono;
            document.querySelector("#txt-numCelular").disabled = true;
          }
          if(data.fechaNacimiento!=="" && data.fechaNacimiento!==null){
            document.querySelector("#date-picker2").value = data.fechaNacimiento;
            document.querySelector("#date-picker2").disabled = true;
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


async function cargarDepartamento() {
  fetch(GLOBAL_URL + "/Departamento/listarDepartamentos")
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
        _option.text = element.nombreDepartamento;
        document.querySelector("#select-departamento").appendChild(_option);
      });
    })
    .catch((error) => {
      alert("Ha ocurrido un error de comunicación con el servidor");
      console.error(error);
    });
}

async function cargarProvincia() {
  document
    .querySelector("#select-departamento")
    .addEventListener("change", function () {
      document.querySelector("#select-provincia").innerHTML = "";
      const params = new URLSearchParams();
      params.append(
        "idDepartamento",
        document.querySelector("#select-departamento").value
      );

      const url =
        GLOBAL_URL +
        "/Provincia/listarProvinciasPorDepartamento?" +
        params.toString();
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
            _option.text = element.nombreProvincia;
            document.querySelector("#select-provincia").appendChild(_option);
          });
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    });
}

async function cargarDistrito() {
  document
    .querySelector("#select-provincia")
    .addEventListener("change", function () {
      document.querySelector("#select-distrito").innerHTML = "";
      const params = new URLSearchParams();
      params.append(
        "idProvincia",
        document.querySelector("#select-provincia").value
      );

      const url =
        GLOBAL_URL +
        "/Distrito/listarDistritosPorProvincia?" +
        params.toString();
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
            _option.text = element.nombreDistrito;
            document.querySelector("#select-distrito").appendChild(_option);
          });
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    });
}

async function guardar() {
  const apdPaterno = document.querySelector("#txt-apdPaterno").value;
  const apdMaterno = document.querySelector("#txt-apdMaterno").value;
  const nombres = document.querySelector("#txt-nombres").value;
  const email = document.querySelector("#txt-correo").value;
  const fecha = document.querySelector("#date-picker").value; // FECHA DEL INICIO DE SEGURO VEHICULAR
  const dateParts = fecha.split("-");
  const yyyy = dateParts[0];
  const mm = dateParts[1];
  const dd = dateParts[2];
  const formattedDate = `${yyyy}-${mm}-${dd}`;
  const fechaBirth = document.querySelector("#date-picker2").value; // FECHA DE NACIMIENTO COMENTADO
  const datePartsBirth = fechaBirth.split("-");
  const yyyyBirth = datePartsBirth[0];
  const mmBirth = datePartsBirth[1];
  const ddBirth = datePartsBirth[2];
  const formattedDateBirth = `${yyyyBirth}-${mmBirth}-${ddBirth}`;
  const direccion = document.querySelector("#txt-direccion").value;
  const numCelular = document.querySelector("#txt-numCelular").value;

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

  const distrito = document.querySelector("#select-distrito").value;
  const valorAgregado = calcularValorAgregado();

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
        fechaNacimiento: formattedDateBirth,
        direccion: direccion,
        telefono: numCelular,
        fechaCreacion: formattedDate,
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
      fidMoneda: {
        id: 1, //moneda en lugar de 1
      },
      fidDistrito: {
        id: distrito,
      },
      fechaCotizacion: formattedDate,

      montoEstimado: montoEstimado + valorAgregado,
    };

    const idCliente = localStorage.getItem("idCliente");
    if (idCliente) {
      data.cliente.id = idCliente;
    }

    const idVehiculo = localStorage.getItem("idVehiculo");
    if (idVehiculo) {
      data.vehiculo.id = idVehiculo;
    }

    console.log(JSON.stringify(data));
    fetch(GLOBAL_URL + '/ProcesoSeguroVehicular/insertarInfoProceso1', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    })
        .then(response => {
          data = response;
          localStorage.setItem("idCotizacion", data);

          var listaCotizacionXDetalle = [];
          for (var i = 0; i < selectedPlans.length; i++) {
            var plan = selectedPlans[i];
            var cotizacionXDetalle = {
              fidCotizacion: {
                id: localStorage.getItem("idCotizacion"),
              },
              fidDetalleCotizacion: {
                id: plan.id,
              },
            };
            listaCotizacionXDetalle.push(cotizacionXDetalle);
          }

          try {
            let data = listaCotizacionXDetalle;
            console.log(JSON.stringify(data));
            fetch(GLOBAL_URL + "/cotizacionXDetalleCotizacion/insertar", {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                'Content-Type': 'application/json'
              },
            })
                .then(response => response.json())
                .then(data => {
                  // Supuestamente devuelve la lista
                  loadResumen();
                  document.querySelector(".form-vehiculo ").style.display = "none";
                  document.querySelector(".form-personal ").style.display = "none";
                  document.querySelector(".form-plans").style.display = "none";
                  document.querySelector(".form-result").style.display = "block";
                  document.querySelector("#btn-descargar-constancia").style.display =
                      "block";
                  document.querySelector("#btn-previous").style.display = "none";
                })
                .catch(error => {
                  alert("Ha ocurrido un error de comunicación con el servidor");
                  console.error(error);
                  localStorage.setItem("error", "1");
                });
          } catch (error) {
            console.error('Error:', error);
            alert("Ha ocurrido un error de comunicación con el servidor");
          }
        })
        .catch(error => {

          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
          localStorage.setItem("error", "1");
        });
  } catch (error) {
    console.error("Error:", error);
  }


}
/*---------------------MI PRIMER INTENTO------------------------------*/

/*
fetch(GLOBAL_URL + "/cotizacion/insertar", {
      method: "POST",
      body: JSON.stringify(data),
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
      .then((data) => {
        localStorage.setItem("idCotizacion", data);
          var listaCotizacionXDetalle = [];
          for (var i = 0; i < selectedPlans.length; i++) {
            var plan = selectedPlans[i];
            var cotizacionXDetalle = {
              fidCotizacion: localStorage.getItem("idCotizacion"),
              fidDetalleCotizacion: plan.id,
            };
            listaCotizacionXDetalle.push(cotizacionXDetalle);
          }

          try {
            let data = {
              listaInsertada: listaCotizacionXDetalle,
            };
            console.log(JSON.stringify(data));
            fetch(GLOBAL_URL + "/cotizacionXDetalleCotizacion/insertar", {
              method: "POST",
              body: JSON.stringify(data),
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
              .then((data) => {
                //supuestamente devuelve la lista
              })
              .catch((error) => {
                alert("Ha ocurrido un error de comunicación con el servidor");
                console.error(error);
                localStorage.setItem("error", "1");
              });
          } catch (error) {
            console.error("Error:", error);
          }
      })
      .catch((error) => {
        alert("Ha ocurrido un error de comunicación con el servidor");
        console.error(error);
        localStorage.setItem("error", "1");
      });
 */
/*---------------------LA FORMA ANIDADA SI NO FUNCIONA LA ANTERIOR------------------------------*/

/*
fetch(GLOBAL_URL + '/cotizacion/insertar', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json'
    },
})
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("idCotizacion", data);

        var listaCotizacionXDetalle = [];
        for (var i = 0; i < selectedPlans.length; i++) {
            var plan = selectedPlans[i];
            var cotizacionXDetalle = {
                fidCotizacion: localStorage.getItem("idCotizacion"),
                fidDetalleCotizacion: plan.id
            };
            listaCotizacionXDetalle.push(cotizacionXDetalle);
        }

        try {
            let data = {
                "listaInsertada": listaCotizacionXDetalle
            };
            console.log(JSON.stringify(data));
            fetch(GLOBAL_URL + '/cotizacionXDetalleCotizacion/insertar', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    // Supuestamente devuelve la lista
                })
                .catch(error => {
              
                                alert("Ha ocurrido un error de comunicación con el servidor");
            console.error(error);
                    localStorage.setItem("error", "1");
                });
        } catch (error) {
            console.error('Error:', error);
        }
    })
    .catch(error => {
  
                    alert("Ha ocurrido un error de comunicación con el servidor");
            console.error(error);
        localStorage.setItem("error", "1");
    });
*/

async function validacionMonto() {
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

  const anhoFabricacion = document.querySelector("#txt-anio").value;

  try {
    let params = new URLSearchParams();
    params.append("marcaIngresada", marca);
    params.append("modeloIngresado", modelo);
    params.append("anhoIngresado", anhoFabricacion);

    let url = new URL(
      GLOBAL_URL +
        "/calculoPrima/ObtenerCalculoPrima?" +
        params.toString()
    );
    const response = await fetch(url);
    const prima = await response.json();

    if (prima > 0) {
      montoEstimado = prima;
      document.getElementById("total").innerText = `Precio total acumulado: S/.${montoEstimado}`;
      alert(montoEstimado);
      flagMonto = true;
    } else {
      flagMonto = false;
    }
  } catch (error) {
    alert("Ha ocurrido un error de comunicación con el servidor");
    console.error(error);
    flagMonto = false;
  }
}

function calcularValorAgregado() {
  let total = 0.0;
  for (var i = 0; i < selectedPlans.length; i++) {
    var plan = selectedPlans[i];
    total += plan.monto;
  }
  return total;
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

  const soatData ={
    nombre: document.querySelector("#txt-res-nombre").textContent,
    placa: document.querySelector("#txt-res-placa").textContent,
    precioInicial: document.querySelector("#txt-res-inicial-vehiculo").textContent,
    totalBeneficios: document.querySelector("#txt-res-total-beneficios").textContent,
    totalAcumulado: document.querySelector("#txt-res-total").textContent,
    periodo: document.querySelector("#txt-res-periodo").textContent,
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
    { text: 'VIGENCIA DE LA PÓLIZA', style: 'subheader' },
    { text: soatData.periodo, style: 'subtitle', margin: [0, 0, 0, 20]},

    // PLAN SEGURO VEHICULAR
    { text: 'PRECIO TOTAL POR BENEFICIOS', style: 'subheader' },
    { text: soatData.totalBeneficios, style: 'subtitle' },
    { text: soatData.total, style: 'subtitle' },
    // VEHÍCULO ASEGURADO
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


