var vehiculos;
var searchTimer;

function getSource() {
  return vehiculos;
}


window.onload = function () {
  fetch(GLOBAL_URL + "/vehiculo/buscarVehiculoParametros?busqueda=")
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
      this.vehiculos = data;
      pagination(data);
    })
    .catch((error) => {
      alert("Ha ocurrido un error de comunicación con el servidor");
      console.error(error);
    });

  document.querySelector("#txt-buscar").addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      const query = document.querySelector("#txt-buscar").value.toLowerCase();

      let params = new URLSearchParams();
      params.append("busqueda", query);

      let url = new URL(
        GLOBAL_URL + "/vehiculo/buscarVehiculoParametros?" + params.toString()
      );

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
          this.vehiculos = data;
          pagination(data);
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    }, 500);
  });

  document.querySelector("#btn-nuevo").addEventListener("click", function () {
    localStorage.removeItem("data-vehiculo");
    window.location.href = "/admin/detalleVehiculo";
  });
};

function crearLaTabla(data) {
  const table = document.querySelector("#table-body");
  table.innerHTML = "";
  data.forEach((vehiculo) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const placa = document.createElement("td");
    placa.classList.add("td-placa");
    placa.innerText = vehiculo.placa;
    tableRow.appendChild(placa);

    const marca = document.createElement("td");
    marca.classList.add("td-marca");
    marca.innerText = vehiculo.fidModelo.fidMarcaVehiculo.marca;
    tableRow.appendChild(marca);

    const modelo = document.createElement("td");
    modelo.classList.add("td-modelo");
    modelo.innerText = vehiculo.fidModelo.modelo;
    tableRow.appendChild(modelo);

    const serie = document.createElement("td");
    serie.classList.add("td-serie");
    serie.innerText = vehiculo.serie;
    tableRow.appendChild(serie);

    const dueno = document.createElement("td");
    dueno.classList.add("td-dueno");
    dueno.innerText =
      vehiculo.fidPersona.nombre +
      " " +
      vehiculo.fidPersona.apellidoPaterno +
      " " +
      vehiculo.fidPersona.apellidoMaterno;
    tableRow.appendChild(dueno);
    //add edit button
    const button = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.classList.add("btn-edit");
    editButton.innerText = "Editar";
    editButton.setAttribute("data-id", vehiculo.id);
    editButton.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");
      localStorage.setItem(
        "data-vehiculo",
        JSON.stringify(vehiculos.find((vehiculo) => vehiculo.id == dataId))
      );
      window.location.href = "/admin/detalleVehiculo";
    });
    button.appendChild(editButton);

    //add delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn-delete");
    deleteButton.innerText = "Eliminar";
    deleteButton.setAttribute("data-id", vehiculo.id);
    deleteButton.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");
      var params = new URLSearchParams();
      params.append("eliminar", dataId);

      var url = new URL(
        GLOBAL_URL + "/vehiculo/eliminar2" + "?" + params.toString()
      );
      console.log(url);
      fetch(url, {
        method: "PUT",
        body: params,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.status + " " + response.statusText);
          } else {
            try {
              return response;
            } catch (error) {
              return null;
            }
          }
        })
        .then((element) => {
          alert("Se ha guardado correctamente");
          window.location.href = "/admin/vehiculo";
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    });
    button.appendChild(deleteButton);
    tableRow.appendChild(button);

    table.appendChild(tableRow);
  });
}
