if (localStorage.getItem("user") == null) {
  window.location.href = "/admin/login";
}
var marcas;
var searchTimer;

function getSource() {
  return marcas;
}

window.onload = function () {
  document
    .querySelector("#btn-carga-masiva")
    .addEventListener("click", function () {
      document.querySelector("#btn-masiva").click();
    });

  fetch(GLOBAL_URL + "/calculoPrima/listarCalculoPrima")
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
      registrarAuditoria(
        JSON.parse(localStorage.getItem("user")).id,
        "consultar modelos"
      );
      this.marcas = data;
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
        GLOBAL_URL + "/modelo/buscarModelosPorParametros?" + params.toString()
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
                registrarAuditoria(
                  JSON.parse(localStorage.getItem("user")).id,
                  "buscar modelos"
                );
          this.marcas = data;
          pagination(data);
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    }, 500);
  });



  const fileInput = document.querySelector("#btn-masiva");

  // Add event listener for file selection
  fileInput.addEventListener("change", handleFileUpload);

};



function handleFileUpload(event) {
  const file = event.target.files[0];

  // Create a FormData object
  const formData = new FormData();
  formData.append("file", file, file.name);

  // Send the file to the server
  fetch(GLOBAL_URL + "/calculoPrima/CargaMasivaCalculoPrima", {
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
}

function crearLaTabla(data) {
  const table = document.querySelector("#table-body");
  table.innerHTML = "";
  data.forEach((marca) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const ID = document.createElement("td");
    ID.innerText = marca.marca;
    tableRow.appendChild(ID);

    const nombre = document.createElement("td");
    nombre.innerText = marca.modelo;
      tableRow.appendChild(nombre);
      
    const IDModelo = document.createElement("td");
      IDModelo.innerText = marca.valor_1;
      tableRow.appendChild(IDModelo);
      
      const modelo = document.createElement("td");
      modelo.innerText = marca.valor_2;
    tableRow.appendChild(modelo);
    
    const IDMarca = document.createElement("td");
    IDMarca.innerText = marca.valor_3;
    tableRow.appendChild(IDMarca);

    const marcaa = document.createElement("td");
    marcaa.innerText = marca.indiceSiniestralidad;
    tableRow.appendChild(marcaa);

    table.appendChild(tableRow);
  });
}
