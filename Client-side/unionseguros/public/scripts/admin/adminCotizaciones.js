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
  data.sort((a, b) => {
    if (a.id > b.id) {
      return -1;
    }
    if (a.id < b.id) {
      return 1;
    }
    return 0;
  });
  data.forEach((cotizacion) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const tipoDoc = document.createElement("td");
    tipoDoc.classList.add("td-tipodoc");
    tipoDoc.innerText = cotizacion.fidCliente.fidTipoDocumento.nombre;
    tipoDoc.style.width = "90px";
    tableRow.appendChild(tipoDoc);

    const documento = document.createElement("td");
    documento.classList.add("td-documento");
    documento.innerText = cotizacion.fidCliente.numeroDocumento;
    tableRow.appendChild(documento);

    const cliente = document.createElement("td");
    if(cotizacion.fidCliente.numeroDocumento.substring(0, 2) === "20" && cotizacion.fidCliente.fidTipoDocumento.nombre==="RUC"){
      cliente.innerText = cotizacion.fidCliente.nombre;
    }else{
      cliente.innerText =
          cotizacion.fidCliente.apellidoPaterno + " " +
          cotizacion.fidCliente.apellidoMaterno + ", " +
          cotizacion.fidCliente.nombre;
    }
    tableRow.appendChild(cliente);

    const placa = document.createElement("td");
    placa.innerText = cotizacion.fidVehiculo.placa;
    tableRow.appendChild(placa);

    const monto = document.createElement("td");
    monto.innerText = cotizacion.montoEstimado.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
    tableRow.appendChild(monto);

    const fecha = document.createElement("td");
    fecha.innerText = formateaFecha(cotizacion.fechaCotizacion);
    tableRow.appendChild(fecha);
    const button = document.createElement("td");
    button.style.width = "230px";
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

function formateaFecha(fechaFormatoOriginal) {
  var partes = fechaFormatoOriginal.split("-");
  var dia = partes[2];
  var mes = partes[1];
  var anio = partes[0];

  // Agregar ceros a la izquierda si es necesario
  if (dia.length < 2) {
    dia = "0" + dia;
  }
  if (mes.length < 2) {
    mes = "0" + mes;
  }

  var fechaFormateada = dia + "-" + mes + "-" + anio;
  return fechaFormateada;
}