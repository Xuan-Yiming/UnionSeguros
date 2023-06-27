var usuarios;
var searchTimer;
if (localStorage.getItem("user") == null) {
  window.location.href = "/admin/login";
}

function getSource() {
  return usuarios;
}

window.onload = function () {

  fetch(GLOBAL_URL + "/cliente/listarClientesActivos?busqueda=")
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
        GLOBAL_URL + "/cliente/listarClientesActivos?" + params.toString()
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

  document.querySelector("#btn-reporte").addEventListener("click", function () {
    let url = new URL(GLOBAL_URL + "/reportesEXCEL/EXCELClientes");
    console.log(url);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status + " " + response.statusText);
        } else {
          try {
            return response.blob();
          } catch (error) {
            return null;
          }
        }
      })
      .then((data) => {
        const downloadUrl = window.URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "ReporteDeClientes.xlsx";
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      });
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
  data.forEach((usaurio) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");

    const tipoDoc = document.createElement("td");
    tipoDoc.classList.add("td-tipodoc");
    tipoDoc.innerText = usaurio.fidTipoDocumento.nombre;
    tableRow.appendChild(tipoDoc);


    const documento = document.createElement("td");
    documento.classList.add("td-documento");
    documento.innerText = usaurio.numeroDocumento;
    tableRow.appendChild(documento);

    const nombres = document.createElement("td");
    nombres.classList.add("td-nombre");
    if(usaurio.numeroDocumento.substring(0, 2) === "20" && usaurio.fidTipoDocumento.nombre==="RUC"){
      nombres.innerText = usaurio.nombre;
    }else{
      nombres.innerText = usaurio.apellidoPaterno + " " + usaurio.apellidoMaterno + ", " + usaurio.nombre;
    }
    tableRow.appendChild(nombres);

    const correo = document.createElement("td");
    correo.classList.add("td-correo");
    correo.innerText = usaurio.email;
    tableRow.appendChild(correo);

    const baneado = document.createElement("td");
    baneado.classList.add("td-baneado");
    baneado.innerText = usaurio.baneado ? "Baneado" : "Habilitado";
    tableRow.appendChild(baneado);

    const auditoria = document.createElement("td");
    const buttonAuditoria = document.createElement("button");
    buttonAuditoria.classList.add("btn-edit");
    buttonAuditoria.innerText = "Auditoria";
    buttonAuditoria.setAttribute("data-id", usaurio.id);
    buttonAuditoria.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");
      localStorage.setItem("id-usuario", dataId);
      window.location.href = "/admin/auditoria";
    });
    auditoria.style.width = "130px";
    auditoria.appendChild(buttonAuditoria);
    tableRow.appendChild(auditoria);

    //add edit button
    const button = document.createElement("td");
    button.style.width = "230px";
    const editButton = document.createElement("button");
    editButton.classList.add("btn-edit");
    editButton.innerText = "Editar";
    editButton.setAttribute("data-id", usaurio.id);
    editButton.addEventListener("click", () => {
      const dataId = event.target.getAttribute("data-id");
      localStorage.setItem(
        "data-cliente",
        JSON.stringify(this.usuarios.find((usuario) => usuario.id == dataId))
      );
      window.location.href = "/admin/detalleCliente";
    });
    button.appendChild(editButton);

    //add delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn-delete");
    deleteButton.innerText = "Eliminar";
    deleteButton.setAttribute("data-id", usaurio.id);
    deleteButton.addEventListener("click", () => {
      if (confirm("¿Está seguro que desea eliminar este cliente?") === false) {
        return;
      }

      const dataId = event.target.getAttribute("data-id");
      let data = this.usuarios.find((usuario) => usuario.id == dataId);
      const usuario = {
        id: data.id,
        nombre: data.nombre,
        apellidoPaterno: data.apellidoPaterno,
        apellidoMaterno: data.apellidoMaterno,
        fechaNacimiento: data.fechaNacimiento,
        telefono: data.telefono,
        direccion: data.direccion,
        numeroDocumento: data.numeroDocumento,
        activoPersona: false,
        fidTipoDocumento: {
          id: data.fidTipoDocumento.id,
        },
        email: data.email,
        contrasena: data.contrasena,
        fechaCreacion: data.fechaCreacion,
        activoUsuario: false,
        activo: false,
        baneado: data.baneado,
        fidRoles: {
          idRole: 1,
          fidPermisos: {
            id: 1,
          },
        },
      };
      console.log(JSON.stringify(usuario));

      fetch(GLOBAL_URL + "/cliente/modificar", {
        method: "PUT",
        body: JSON.stringify(usuario),
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
            alert("Se ha guardado correctamente");
            window.location.href = "/admin/cliente";
          } else {
            alert("Ha ocurrido un error");
          }
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    });
    button.appendChild(deleteButton);
    tableRow.appendChild(button);

    table.appendChild(tableRow);
  });
}

function reporte() {


}