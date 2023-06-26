if (localStorage.getItem("user") == null) {
  window.location.href = "/admin/login";
}
var ventas;
var searchTimer;

function getSource() {
  return ventas;
}

window.onload = function () {
  fetch(GLOBAL_URL + "/BoletaDeVenta/listarTodasActivas")
    .then((response) => {
      if (!response.ok) {
        if (response.status < 500 && response.status >= 400) {
          throw new Error(
            "Error del cliente: " + response.status + " " + response.statusText
          );
        } else {
          throw new Error(
            "Error del servidor: " + response.status + " " + response.statusText
          );
        }
      } else {
        try {
          return response.json();
        } catch (error) {
          return null;
        }
      }
    })
    .then((data) => {
      this.ventas = data;
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
        GLOBAL_URL +
          "/BoletaDeVenta/buscarBoletaDeVentaParametros?" +
          params.toString()
      );

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            if (response.status < 500 && response.status >= 400) {
              throw new Error(
                "Error del cliente: " +
                  response.status +
                  " " +
                  response.statusText
              );
            } else {
              throw new Error(
                "Error del servidor: " +
                  response.status +
                  " " +
                  response.statusText
              );
            }
          } else {
            try {
              return response.json();
            } catch (error) {
              return null;
            }
          }
        })
        .then((data) => {
          this.ventas = data;
          pagination(data);
        })
        .catch((error) => {
          alert(error);
          console.error(error);
        });
    }, 500);
  });
  const fileInput = document.querySelector("#btn-masiva");

  // Add event listener for file selection
  fileInput.addEventListener("change", handleFileUpload);
};
// Handle file upload event
function handleFileUpload(event) {
  const fileInput = document.querySelector("#btn-masiva");
  const file = fileInput.files[0];

  // Create a FormData object
  const formData = new FormData();
  formData.append("file", file, file.name);

  // Send the file to the server
  fetch(GLOBAL_URL + "/SoatVigente/CargaMasivaSoatVigente", {
    method: "POST",
    body: formData,
    redirect: "follow",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
      } else {
        try {
          return response.text();
        } catch (error) {
          return null;
        }
      }
    })
    .then((data) => {
      alert(data);
      window.location.reload();
    })
    .catch((error) => {
      alert("Ha ocurrido un error de comunicación con el servidor");
      console.error("Error:", error);
    });
}
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
  data.forEach((venta) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const tipoDoc = document.createElement("td");
    tipoDoc.classList.add("td-tipodoc");
    tipoDoc.innerText = venta.fidSoat.fidPoliza.fidCliente.fidTipoDocumento.nombre;
    tableRow.appendChild(tipoDoc);

    const documento = document.createElement("td");
    documento.classList.add("td-documento");
    documento.innerText = venta.fidSoat.fidPoliza.fidCliente.numeroDocumento;
    tableRow.appendChild(documento);

    const cliente = document.createElement("td");
    cliente.classList.add("td-nombre");
    if(venta.fidSoat.fidPoliza.fidCliente.numeroDocumento.substring(0, 2) === "20" && venta.fidSoat.fidPoliza.fidCliente.fidTipoDocumento.nombre==="RUC"){
      cliente.innerText = venta.fidSoat.fidPoliza.fidCliente.nombre;
    }else{
      cliente.innerText =
          venta.fidSoat.fidPoliza.fidCliente.apellidoPaterno + " " +
          venta.fidSoat.fidPoliza.fidCliente.apellidoMaterno + ", " +
          venta.fidSoat.fidPoliza.fidCliente.nombre;
    }
    tableRow.appendChild(cliente);

    const placa = document.createElement("td");
    placa.classList.add("td-placa");
    placa.innerText = venta.fidSoat.fidPoliza.fidVehiculo.placa;
    tableRow.appendChild(placa);

    const plan = document.createElement("td");
    plan.classList.add("td-soat");
    plan.innerText = venta.fidSoat.fidPlanSoat.nombrePlan;
    tableRow.appendChild(plan);

    const monto = document.createElement("td");
    monto.classList.add("td-monto");
    monto.innerText = venta.fidSoat.fidPlanSoat.precio.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });;
    tableRow.appendChild(monto);

    const fecha = document.createElement("td");
    fecha.classList.add("td-fecha");
    fecha.innerText = formateaFecha(venta.fechaEmision);
    //fecha.innerText = venta.fechaEmision;
    tableRow.appendChild(fecha);
    const button = document.createElement("td");
    button.style.width = "230px";
    const buttonEliminar = document.createElement("button");
    buttonEliminar.classList.add("button");
    buttonEliminar.classList.add("btn-delete");
    buttonEliminar.innerText = "Eliminar";
    buttonEliminar.setAttribute("data-id", venta.id);
    buttonEliminar.addEventListener("click", function () {
      if (
        confirm("¿Está seguro que desea eliminar esta cotizacion?") == false
      ) {
        return;
      }

      const dataId = event.target.getAttribute("data-id");

      const url = GLOBAL_URL + "/BoletaDeVenta/eliminar?idBoleta=" + dataId;
      console.log(url);
      fetch(url, {
        method: "PUT",
        body: dataId,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status < 500 && response.status >= 400) {
              throw new Error(
                "Error del cliente: " +
                  response.status +
                  " " +
                  response.statusText
              );
            } else {
              throw new Error(
                "Error del servidor: " +
                  response.status +
                  " " +
                  response.statusText
              );
            }
          } else {
            try {
              alert("Boleta eliminada exitosamente");
              window.location.reload();
            } catch (error) {
              return null;
            }
          }
        })
        .then((data) => {})
        .catch((error) => {
          alert(error);
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