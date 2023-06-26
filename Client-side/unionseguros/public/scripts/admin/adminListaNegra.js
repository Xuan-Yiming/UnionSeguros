var usuarios;
var searchTimer;
if (localStorage.getItem("user") == null) {
  window.location.href = "/admin/login";
}

function getSource() {
  return usuarios;
}

window.onload = function () {
  document
    .querySelector("#btn-carga-masiva")
    .addEventListener("click", function () {
      document.querySelector("#btn-masiva").click();
    });

  fetch(GLOBAL_URL + "/listaNegra/buscarListaNegraParametros?busqueda=")
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
      this.usuarios = data;
      pagination();
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
          "/listaNegra/buscarListaNegraParametros?" +
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
          this.usuarios = data;
          pagination(data);
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    }, 500);
  });

  document.querySelector("#btn-nuevo").addEventListener("click", function () {
    localStorage.removeItem("data-cliente");
    window.location.href = "/admin/detalleCliente";
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
  fetch(GLOBAL_URL + "/listaNegra/cargaMasivaListaNegra", {
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
  data.forEach((usaurio) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const tipoDoc = document.createElement("td");
    tipoDoc.classList.add("td-tipodoc");
    tipoDoc.innerText = usaurio.tipoDocumento;
    tipoDoc.style.width = "90px";
    tableRow.appendChild(tipoDoc);

    const documento = document.createElement("td");
    documento.classList.add("td-documento");
    documento.innerText = usaurio.numeroDocumento;
    tableRow.appendChild(documento);

    const nombres = document.createElement("td");
    nombres.classList.add("td-nombre");
    nombres.innerText = usaurio.nombreApellidos;
      tableRow.appendChild(nombres);
      
      const motivo = document.createElement("td");
      motivo.classList.add("td-motivo");
      motivo.innerText = usaurio.motivo;
      tableRow.appendChild(motivo);
      

    table.appendChild(tableRow);
  });
}
