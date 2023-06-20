var cotizaciones;
var searchTimer;

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

    const placa = document.createElement("td");
    placa.classList.add("td-placa");
    placa.innerText = vehiculo.placa;
    tableRow.appendChild(placa);

    const buttonEliminar = document.createElement("button");
    buttonEliminar.classList.add("button");
    buttonEliminar.classList.add("button-eliminar");
    buttonEliminar.innerText = "Eliminar";
    buttonEliminar.setAttribute("data-id", cotizacion.id);
    buttonEliminar.addEventListener("click", function () {
      if (
        confirm("¿Está seguro que desea eliminar esta cotizacion?") == false
      ) {
        return;
      }

      const dataId = event.target.getAttribute("data-id");
      const url = GLOBAL_URL + "/cotizacion/eliminarCotizacion?id=" + dataId;
      fetch(url, {
        method: "DELETE",
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
          alert("Cotizacion eliminada exitosamente");
          window.location.reload();
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    });

    tableRow.appendChild(buttonEliminar);

    table.appendChild(tableRow);
  });
}
