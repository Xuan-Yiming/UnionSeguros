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
      fetch(GLOBAL_URL + "/Vehiculo/insertar", {
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
            window.location.href = "/admin/PlanSOAT";
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

      fetch(GLOBAL_URL + "/Vehiculo/modificar", {
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
    //   let cobertura = document.querySelector("#txt-cobertura").value;
    //   let precio = document.querySelector("#txt-precio").value;
    //   let nombre = document.querySelector("#txt-nombre").value;

    //   if (cobertura == "") {
    //     document.querySelector("#txt-cobertura").focus();
    //     alert("Debe ingresar la cobertura");
    //     return false;
    //   }
    //   if (precio == "") {
    //     document.querySelector("#txt-precio").focus();
    //     alert("Debe ingresar el precio");
    //     return false;
    //   }
    //   if (nombre == "") {
    //     document.querySelector("#txt-nombre").focus();
    //     alert("Debe ingresar el nombre");
    //     return false;
    //   }

    //   if (!/^[0-9]+./.test(precio)) {
    //     document.querySelector("#txt-precio").focus();
    //     alert("El precio debe ser un número");
    //     return false;
    //   }

    //   if (!/^[0-9]+./.test(cobertura)) {
    //     document.querySelector("#txt-cobertura").focus();
    //     alert("La cobertura debe ser un número");
    //     return false;
    //   }

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
