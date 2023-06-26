if (localStorage.getItem("user") === null) {
  window.location.href = "/admin/login";
}
var planes;
var searchTimer;

function getSource() {
  return planes;
}

window.onload = function () {
  fetch(GLOBAL_URL + "/planSOAT/listarActivos")
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
      this.planes = data;
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
        GLOBAL_URL + "/planSOAT/buscarPlanesSOAT?" + params.toString()
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
          this.planes = data;
          pagination(data);
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    }, 500);
  });

  document.querySelector("#btn-nuevo").addEventListener("click", function () {
    localStorage.removeItem("data-plan");
    window.location.href = "/admin/detallePlanSOAT";
  });
};

function crearLaTabla(data) {
  const table = document.querySelector("#table-body");
  table.innerHTML = "";
  data.forEach((plan) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const ID = document.createElement("td");
    ID.classList.add("td-id");
    ID.innerText = plan.id;
    tableRow.appendChild(ID);

    const nombrePlan = document.createElement("td");
    nombrePlan.classList.add("td-nombre");
    nombrePlan.innerText = plan.nombrePlan;
    tableRow.appendChild(nombrePlan);

    const precio = document.createElement("td");
    precio.classList.add("td-monto");
    precio.innerText = plan.precio.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });;
    tableRow.appendChild(precio);

    const cobertura = document.createElement("td");
    cobertura.classList.add("td-monto");
    cobertura.innerText = plan.cobertura.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });;
    tableRow.appendChild(cobertura);

    //add edit button
    const button = document.createElement("td");
    button.style.width = "520px";
    const editButton = document.createElement("button");
    editButton.classList.add("btn-edit");
    editButton.innerText = "Editar";
    editButton.setAttribute("data-id", plan.id);
    editButton.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");
      localStorage.setItem(
        "data-plan",
        JSON.stringify(planes.find((plan) => plan.id == dataId))
      );
      window.location.href = "/admin/detallePlanSOAT";
    });
    button.appendChild(editButton);

    //add delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn-delete");
    deleteButton.innerText = "Eliminar";
    deleteButton.setAttribute("data-id", plan.id);
    deleteButton.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");

      if (
        confirm(
          "¿Está seguro que desea eliminar el plan SOAT con ID: " + dataId + "?"
        )
      ) {
        let planElegido = planes.find((plan) => plan.id == dataId);
        const plan = {
          id: planElegido.id,
          cobertura: planElegido.cobertura,
          precio: planElegido.precio,
          nombrePlan: planElegido.nombrePlan,
          activo: false,
        };

        fetch(GLOBAL_URL + "/planSOAT/modificar", {
          method: "PUT",
          body: JSON.stringify(plan),
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
