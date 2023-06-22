window.onload = function () {
  if (localStorage.getItem("user") == null) {
    window.location.href = "/admin/login";
  }

  inicializar();
  if (localStorage.getItem("data-vehiculo") == null) {
    document.querySelector("#titulo").innerHTML = "Nuevo Vehiculo";
  } else {
    let data = JSON.parse(localStorage.getItem("data-vehiculo"));

    document.querySelector("#id").innerHTML = data.id;
    document.querySelector("#txt-placa").value = data.placa;
    document.querySelector("#txt-anio").value = data.anhoFabricacion.toString();
    document.querySelector("#txt-serie").value = data.serie;
    document.querySelector("#select-uso").value = data.fidTipoUso.idTipoUso;
    document.querySelector("#txt-asientos").value = data.numeroAsientos;
    document.querySelector("#txt-dueno").value = data.fidPersona.id;
  }

  document.querySelector("#regresar").addEventListener("click", function () {
    localStorage.removeItem("data-plan");
    window.location.href = "/admin/Vehiculo";
  });

  document.querySelector("#btn-guardar").addEventListener("click", function () {
    if (!verificarCampos()) {
      return;
    }
    if (document.querySelector("#id").innerHTML == "") {
      const data = {
        fidTipoUso: {
          idTipoUso: document.querySelector("#select-uso").value,
        },
        fidModelo: {
          id: document.querySelector("#select-modelo").value,
        },
        fidPersona: {
          id: document.querySelector("#txt-dueno").value,
        },
        anhoFabricacion: document.querySelector("#txt-anio").value,
        numeroAsientos: document.querySelector("#txt-asientos").value,
        placa: document.querySelector("#txt-placa").value,
        serie: document.querySelector("#txt-serie").value,
        activo: true,
      };
      console.log(JSON.stringify(data));
      fetch(GLOBAL_URL + "/vehiculo/insertar", {
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
        .then((element) => {
          if (element) {
            alert("Se ha guardado correctamente");
            window.location.href = "/admin/vehiculo";
          } else {
            alert("No se ha podido guardar");
            return;
          }
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    } else {
      const data = {
        id: document.querySelector("#id").innerHTML,
        fidTipoUso: {
          idTipoUso: document.querySelector("#select-uso").value,
        },
        fidModelo: {
          id: document.querySelector("#select-modelo").value,
        },
        fidPersona: {
          id: document.querySelector("#txt-dueno").value,
        },
        anhoFabricacion: document.querySelector("#txt-anio").value,
        numeroAsientos: document.querySelector("#txt-asientos").value,
        placa: document.querySelector("#txt-placa").value,
        serie: document.querySelector("#txt-serie").value,
        activo: true,
      };
      console.log(JSON.stringify(data));
      fetch(GLOBAL_URL + "/vehiculo/modificar", {
        method: "PUT",
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
        .then((element) => {
          if (element) {
            alert("Se ha guardado correctamente");
            window.location.href = "/admin/vehiculo";
          } else {
            alert("No se ha podido guardar");
            return;
          }
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    }
  });

  function verificarCampos() {
    var marca = document.querySelector("#select-marca").value;
    var modelo = document.querySelector("#select-modelo").value;
    var anio = document.querySelector("#txt-anio").value;
    var numAsiento = document.querySelector("#txt-asientos").value;
    var uso = document.querySelector("#select-uso").value;
    var numSerie = document.querySelector("#txt-serie").value;
    var placa = document.querySelector("#txt-placa").value;
    var dueño = document.querySelector("#txt-dueno").value;

    if (placa === "" || placa.length !== 6 || !/^[A-Za-z0-9]+$/.test(placa)) {
      document.querySelector("#txt-placa").focus();
      alert("Ingresar placa correcta.");
      return true;
    }

    if (placa == "") {
      alert("Debe ingresar la placa");
      return false;
    }

    if (numAsiento == "") {
      alert("Debe ingresar el número de asientos");
      return false;
    }

    if (anio == "") {
      alert("Debe ingresar el año");
      return false;
    }
    if (marca == "") {
      alert("Debe seleccionar la marca");
      return false;
    }
    if (modelo == "") {
      alert("Debe seleccionar el modelo");
      return false;
    }
    if (uso =="") {
      alert("Debe seleccionar el tipo de uso");
      return false;
    }

    if (numSerie == "") {
      alert("Debe ingresar el número de serie");
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


    return true;
  }
};

async function inicializar() {
  await cargarMarcas();
  await cargarModelos();
}

async function cargarMarcas() {
  document.querySelector("#select-marca").innerHTML = "";
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

      if (localStorage.getItem("data-vehiculo")) {
        document.querySelector("#select-marca").value = JSON.parse(
          localStorage.getItem("data-vehiculo")
        ).fidModelo.fidMarcaVehiculo.id;
      }

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

          if (localStorage.getItem("data-vehiculo")) {
            document.querySelector("#select-modelo").value = JSON.parse(
              localStorage.getItem("data-vehiculo")
            ).fidModelo.id;
          }
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
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
