var ventas;
var searchTimer;

window.onload = function () {
  fetch(GLOBAL_URL + "/BoletaDeVenta/listarTodas")
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
          crearLaTabla(data);
        })
        .catch((error) => {
          alert(error);
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

    const plan = document.createElement("td");
    plan.classList.add("td-soat");
    plan.innerText = venta.fidSoat.fidPlanSoat.nombrePlan;
    tableRow.appendChild(plan);

    const monto = document.createElement("td");
    monto.classList.add("td-monto");
    monto.innerText = venta.fidSoat.fidPlanSoat.precio;
    tableRow.appendChild(monto);

    const cliente = document.createElement("td");
    cliente.classList.add("td-cliente");
    cliente.innerText =
      venta.fidSoat.fidPoliza.fidCliente.id +
      " - " +
      venta.fidSoat.fidPoliza.fidCliente.nombre +
      ", " +
      venta.fidSoat.fidPoliza.fidCliente.apellidoPaterno +
      " " +
      venta.fidSoat.fidPoliza.fidCliente.apellidoMaterno;
    tableRow.appendChild(cliente);

    const fecha = document.createElement("td");
    fecha.classList.add("td-fecha");
    fecha.innerText = venta.fechaEmision;
    tableRow.appendChild(fecha);

    const buttonEliminar = document.createElement("button");
    buttonEliminar.classList.add("button");
    buttonEliminar.classList.add("button-eliminar");
    buttonEliminar.innerText = "Eliminar";
    buttonEliminar.setAttribute("data-id", venta.id);
    buttonEliminar.addEventListener("click", function () {
      if (
        confirm("¿Está seguro que desea eliminar esta cotizacion?") == false
      ) {
        return;
      }

      const dataId = event.target.getAttribute("data-id");
      var data = {
        id: dataId,
        fidSoat: {},
        fechaEmision: null,
        monto: null,
        activo: false,
      };
      const url = GLOBAL_URL + "/BoletaDeVenta/eliminar";
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
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
              return response.json();
            } catch (error) {
              return null;
            }
          }
        })
        .then((data) => {
          alert("Boleta eliminada exitosamente");
          window.location.reload();
        })
        .catch((error) => {
          alert(error);
          console.error(error);
        });
    });

    tableRow.appendChild(buttonEliminar);

    table.appendChild(tableRow);
  });
}
