var cotizaciones;
var searchTimer;
window.onload = function () {
  fetch(GLOBAL_URL + "/cotizacion/listarCotizacionesActivas")
    .then((response) => response.json())
    .then((data) => {
      this.cotizaciones = data;
      crearLaTabla(data);
    })
    .catch((error) => {
      // Handle the error
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
        .then((response) => response.json())
        .then((data) => {
          this.cotizaciones = data;
          crearLaTabla(data);
        })
        .catch((error) => {
          // Handle the error
          console.error(error);
        });
    }, 500);
  });
};

function crearLaTabla(data) {
  const table = document.querySelector("#table-body");
  table.innerHTML = "";
  data.forEach((venta) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const placa = document.createElement("td");
    placa.classList.add("td-placa");
    placa.innerText = vehiculo.placa;
    tableRow.appendChild(placa);

    table.appendChild(tableRow);
  });
}
