if (localStorage.getItem("user") == null) {
  window.location.href = "/admin/login";
}
var marcas;
var searchTimer;

window.onload = function () {

  document.querySelector("#btn-carga-masiva").addEventListener("click", function () {
    document.querySelector("#btn-masiva").click();
  });

  fetch(GLOBAL_URL + "/marcaVehiculo/listarTodasActivas")
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
      this.marcas = data;
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
        GLOBAL_URL + "/marcaVehiculo/buscarPorId?" + params.toString()
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
    localStorage.removeItem("data-marca");
    openModal(configurarModal());
  });

  const fileInput = document.querySelector("#btn-masiva");

  // Add event listener for file selection
  fileInput.addEventListener("change", handleFileUpload);
  
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
          console.log(JSON.stringify(data));
          fetch(GLOBAL_URL + "/marcaVehiculo/modificar", {
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
          fetch(GLOBAL_URL + "/marcaVehiculo/insertar", {
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
  if (localStorage.getItem("data-marca")) {
    const data = JSON.parse(localStorage.getItem("data-marca"));
    document.querySelector("#txt-marca").value = data.marca;
  } else {
    document.querySelector("#txt-marca").value = "";
  }
}
function handleFileUpload(event) {
  const file = event.target.files[0];

  // Create a FormData object
  const formData = new FormData();
  formData.append("file", file, file.name);

  // Send the file to the server
  fetch(GLOBAL_URL + "/marcaVehiculo/insertarMasivo", {
    method: "POST",
    body: formData,
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
};
function crearLaTabla(data) {
  const table = document.querySelector("#table-body");
  table.innerHTML = "";
  data.forEach((marca) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const ID = document.createElement("td");
    ID.classList.add("td-id");
    ID.innerText = marca.id;
    tableRow.appendChild(ID);

    const nombre = document.createElement("td");
    nombre.classList.add("td-beneficio");
    nombre.innerText = marca.marca;
    tableRow.appendChild(nombre);

    //add edit button
    const button = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.classList.add("btn-edit");
    editButton.innerText = "Editar";
    editButton.setAttribute("data-id", marca.id);
    editButton.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");
      localStorage.setItem(
        "data-marca",
        JSON.stringify(marcas.find((marca) => marca.id == dataId))
      );
      openModal(configurarModal());
    });
    button.appendChild(editButton);

    //add delete button
    // const deleteButton = document.createElement("button");
    // deleteButton.classList.add("btn-delete");
    // deleteButton.innerText = "Eliminar";
    // deleteButton.setAttribute("data-id", marca.id);
    // deleteButton.addEventListener("click", () => {
    //   const dataId = event.target.getAttribute("data-id");
    //   if (
    //     confirm(
    //       "¿Está seguro que desea eliminar la marca con ID: " + dataId + "?"
    //     )
    //   ) {
    //     fetch(GLOBAL_URL + "/marcaVehiculo/eliminar?idIngresado=" + dataId, {
    //       method: "PUT",
    //     })
    //       .then((response) => {
    //         if (!response.ok) {
    //           throw new Error(response.status + " " + response.statusText);
    //         } else {
    //           try {
    //             return response.json();
    //           } catch (error) {
    //             return null;
    //           }
    //         }
    //       })
    //       .then((element) => {
    //         if (element) {
    //           alert("Se ha eliminado correctamente");
    //           location.reload();
    //         } else {
    //           alert("No se ha podido eliminar");
    //           return;
    //         }
    //       })
    //       .catch((error) => {
    //         alert("Ha ocurrido un error de comunicación con el servidor");
    //         console.error(error);
    //       });
    //   }
    // });
    // button.appendChild(deleteButton);
    tableRow.appendChild(button);

    const modelButton = document.createElement("button");
    modelButton.classList.add("btn-edit");
    modelButton.innerText = "Ver Modelos";
    modelButton.setAttribute("data-id", marca.id);
    modelButton.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");
      localStorage.setItem(
        "data-marca",
        JSON.stringify(marcas.find((marca) => marca.id == dataId))
      );
      window.location.href = "/admin/modelo";
    });
    button.appendChild(modelButton);

    table.appendChild(tableRow);
  });
}
