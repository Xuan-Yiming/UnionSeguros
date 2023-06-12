var modelos;
var searchTimer;
window.onload = function () {
  if (localStorage.getItem("user") == null) {
    window.location.href = "/admin/login";
  }

  if (localStorage.getItem("data-marca") == null) {
    window.location.href = "/admin/marcaModelo";
  }

    document.querySelector("#btn-regresar").addEventListener("click", function () {
        localStorage.removeItem("data-marca");
        window.location.href = "/admin/marcaModelo";
    });

  var params = new URLSearchParams();
  params.append("idMarca", JSON.parse(localStorage.getItem("data-marca")).id);

  let url = new URL(
    GLOBAL_URL + "/modelo/listarModelosPorIdMarca?" + params.toString()
  );
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      this.modelos = data;
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
        GLOBAL_URL + "/marcaVehiculo/buscarPorId?" + params.toString()
      );

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.beneficios = data;
          crearLaTabla(data);
        })
        .catch((error) => {
          // Handle the error
          console.error(error);
        });
    }, 500);
  });

  document.querySelector("#btn-nuevo").addEventListener("click", function () {
    localStorage.removeItem("data-marca");
    openModal(configurarModal());
  });

  document
    .querySelector("#btn-modal-guardar")
    .addEventListener("click", function () {
      closeModal(function () {
        const nombre = document.querySelector("#txt-marca").value;
        const data = {
          marca: nombre,
          activo: true,
        };
        if (localStorage.getItem("data-marca")) {
          const dataId = JSON.parse(localStorage.getItem("data-marca")).id;
          data.id = dataId;
          fetch(GLOBAL_URL + "/marcaVehiculo/modificar", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((element) => {
              if (element) {
                alert("Se ha actualizado correctamente");
                location.reload();
                return true;
              } else {
                alert("No se ha podido actualizar");
                return false;
              }
            })
            .catch((error) => {
              // Handle the error
              console.error(error);
            });
        } else {
          fetch(GLOBAL_URL + "/marcaVehiculo/insertar", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((element) => {
              if (element) {
                alert("Se ha insertado correctamente");
                location.reload();
                return true;
              } else {
                alert("No se ha podido insertar");

                return false;
              }
            })
            .catch((error) => {
              // Handle the error
              console.error(error);
            });
        }
      });
    });

  document
    .querySelector("#btn-modal-cancelar")
    .addEventListener("click", function () {
      closeModal(function () {
        return true;
      });
    });
};

function configurarModal() {
  if (localStorage.getItem("data-plan")) {
    const data = JSON.parse(localStorage.getItem("data-plan"));
    document.querySelector("#txt-beneficio").value = data.beneficio;
    document.querySelector("#txt-monto").value = data.monto;
  } else {
    document.querySelector("#txt-beneficio").value = "";
    document.querySelector("#txt-monto").value = "";
  }
}

function crearLaTabla(data) {
  const table = document.querySelector("#table-body");
  table.innerHTML = "";
  data.forEach((modelo) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const ID = document.createElement("td");
    ID.classList.add("td-id");
    ID.innerText = modelo.id;
    tableRow.appendChild(ID);

    const nombre = document.createElement("td");
    nombre.classList.add("td-modelo");
    nombre.innerText = modelo.modelo;
    tableRow.appendChild(nombre);

    const tipoVehiculo = document.createElement("td");
    tipoVehiculo.classList.add("td-TipoVehiculo");
    tipoVehiculo.innerText = modelo.fidTipoVehiculo.nombreTipoVehiculo;
    tableRow.appendChild(tipoVehiculo);

    const valor = document.createElement("td");
    valor.classList.add("td-valor");
    valor.innerText = 0;
    tableRow.appendChild(valor);

    //add edit button
    const button = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.classList.add("btn-edit");
    editButton.innerText = "Editar";
    editButton.setAttribute("data-id", modelo.id);
    editButton.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");
      localStorage.setItem(
        "data-modelo",
          JSON.stringify(modelos.find((modelo) => modelo.id == dataId))
      );
      openModal(configurarModal());
    });
    button.appendChild(editButton);

    //add delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn-delete");
    deleteButton.innerText = "Eliminar";
    deleteButton.setAttribute("data-id", modelo.id);
    deleteButton.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");
      if (
        confirm(
          "¿Está seguro que desea eliminar el plan SOAT con ID: " + dataId + "?"
        )
      ) {
        fetch(
          GLOBAL_URL + "/detalleCotizacion/eliminar?idIngresado=" + dataId,
          {
            method: "PUT",
          }
        )
          .then((response) => response.json())
          .then((element) => {
            if (element) {
              alert("Se ha eliminado correctamente");
              location.reload();
            } else {
              alert("No se ha podido eliminar");
              return;
            }
          })
          .catch((error) => {
            // Handle the error
            console.error(error);
          });
      }
    });
    button.appendChild(deleteButton);
    tableRow.appendChild(button);

    table.appendChild(tableRow);
  });
}
