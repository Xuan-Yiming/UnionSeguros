var cotizaciones;
var searchTimer;
if (localStorage.getItem("user") == null) {
  window.location.href = "/admin/login";
}
window.onload = function () {
  fetch(GLOBAL_URL + "/cotizacion/listarCotizacionesActivas")
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
      this.cotizaciones = data;
      crearLaTabla(data);
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
        GLOBAL_URL +
          "/cotizacion/listarCotiazacionesActivos?" +
          params.toString()
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
          this.cotizaciones = data;
          crearLaTabla(data);
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    }, 500);
  });
};

function crearLaTabla(data) {
  const table = document.querySelector("#table-body");
  table.innerHTML = "";
  data.forEach((cotizacion) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const cliente = document.createElement("td");
    cliente.innerText =
      cotizacion.fidCliente.id +
      " - " +
      cotizacion.fidCliente.nombre +
      " " +
      cotizacion.fidCliente.apellidoPaterno +
      " " +
      cotizacion.fidCliente.apellidoMaterno +
      " - " +
      cotizacion.fidCliente.numeroDocumento;;
    tableRow.appendChild(cliente);

    const placa = document.createElement("td");
    placa.innerText = cotizacion.fidVehiculo.placa;
    tableRow.appendChild(placa);

    const monto = document.createElement("td");
    monto.innerText = cotizacion.montoEstimado;;
    tableRow.appendChild(monto);

    const fecha = document.createElement("td");
    fecha.innerText = cotizacion.fechaCotizacion;
    tableRow.appendChild(fecha);
    const button = document.createElement("td");
    const buttonEliminar = document.createElement("button");
    buttonEliminar.classList.add("button");
    buttonEliminar.classList.add("btn-delete");
    buttonEliminar.innerText = "Eliminar";
    buttonEliminar.setAttribute("data-id", cotizacion.id);
    buttonEliminar.addEventListener("click", function () {
      if (
        confirm("¿Está seguro que desea eliminar esta cotizacion?") == false
      ) {
        return;
      }

      const dataId = event.target.getAttribute("data-id");
      var data = {
        eliminar: dataId,
      };
      const url = GLOBAL_URL + "/cotizacion/eliminar?eliminar=" + dataId;
      fetch(url, {
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
            } catch (error) {
              return null;
            }
          }
        })
        .then((data) => {
          alert("Cotizacion eliminada exitosamente");
          window.location.reload();
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    });

    button.appendChild(buttonEliminar);
    tableRow.appendChild(button);
    table.appendChild(tableRow);
  });
}
