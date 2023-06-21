var beneficios;
var searchTimer;
window.onload = function () {
  if (localStorage.getItem("user") == null) {
    window.location.href = "/admin/login";
  }

  fetch(GLOBAL_URL + "/detalleCotizacion/listarTodosActivos")
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
      this.beneficios = data;
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
            "/detalleCotizacion/buscarPorParametros?" +
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
            this.beneficios = data;
            crearLaTabla(data);
          })
          .catch((error) => {
  
                        alert("Ha ocurrido un error de comunicación con el servidor");
  console.error(error);
          });
      }, 500);
    });

  document.querySelector("#btn-nuevo").addEventListener("click", function () {
    localStorage.removeItem("data-beneficio");
    openModal(configurarModal());
  });

  document
    .querySelector("#btn-modal-guardar")
    .addEventListener("click", function () {
      closeModal(function () {
        const beneficio = document.querySelector("#txt-beneficio").value;
        const monto = document.querySelector("#txt-monto").value;
        const data = {
          beneficio: beneficio,
          monto: monto,
          activo: true,
        };
        if (localStorage.getItem("data-beneficio")) {
          const dataId = JSON.parse(localStorage.getItem("data-beneficio")).id;
          data.id = dataId;
          fetch(GLOBAL_URL + "/detalleCotizacion/modificar", {
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
                alert("Se ha actualizado correctamente");
                location.reload();
                return true;
              } else {
                alert("No se ha podido actualizar");
                return false;
              }
            })
            .catch((error) => {
              alert("Ha ocurrido un error de comunicación con el servidor");
              console.error(error);
            });
        } else {
          fetch(GLOBAL_URL + "/detalleCotizacion/insertar", {
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
                alert("Se ha insertado correctamente");
                location.reload();
                return true;
              } else {
                alert("No se ha podido insertar");

                return false;
              }
            })
            .catch((error) => {
              alert("Ha ocurrido un error de comunicación con el servidor");
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
  if (localStorage.getItem("data-beneficio")) {
    const data = JSON.parse(localStorage.getItem("data-beneficio"));
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
  data.forEach((beneficio) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const ID = document.createElement("td");
    ID.classList.add("td-id");
    ID.innerText = beneficio.id;
    tableRow.appendChild(ID);

    const descripcionBenficio = document.createElement("td");
    descripcionBenficio.classList.add("td-beneficio");
    descripcionBenficio.innerText = beneficio.beneficio;
    tableRow.appendChild(descripcionBenficio);

    const monto = document.createElement("td");
    monto.classList.add("td-monto");
    monto.innerText = beneficio.monto;
    tableRow.appendChild(monto);

    //add edit button
    const button = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.classList.add("btn-edit");
    editButton.innerText = "Editar";
    editButton.setAttribute("data-id", beneficio.id);
    editButton.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");
      localStorage.setItem(
        "data-beneficio",
        JSON.stringify(beneficios.find((beneficio) => beneficio.id == dataId))
      );
      openModal(configurarModal());
    });
    button.appendChild(editButton);

    //add delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn-delete");
    deleteButton.innerText = "Eliminar";
    deleteButton.setAttribute("data-id", beneficio.id);
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
              alert("Se ha eliminado correctamente");
              location.reload();
            } else {
              alert("No se ha podido eliminar");
              return;
            }
          })
          .catch((error) => {
            alert("Ha ocurrido un error de comunicación con el servidor");
            console.error(error);
          });
      }
    });
    button.appendChild(deleteButton);
    tableRow.appendChild(button);

    table.appendChild(tableRow);
  });
}
