window.onload = function () {
  let data = JSON.parse(localStorage.getItem("userCliente"));
  document.querySelector("#txt-nombre").value = data.nombre;
  document.querySelector("#txt-apellido-paterno").value = data.apellidoPaterno;
  document.querySelector("#txt-apellido-materno").value = data.apellidoMaterno;
  document.querySelector("#txt-celular").value = data.telefono;
  document.querySelector("#txt-correo").value = data.email;
  document.querySelector("#txt-direccion").value = data.direccion;
  document.querySelector("#txt-documento").value = data.numeroDocumento;
  document.querySelector("#regresar").addEventListener("click", function () {
    alert("No se ha aplicado ningún cambio");
    window.location.href = "/usuarioMiCuenta";
  });

  document.querySelector("#btn-guardar").addEventListener("click", function () {
    if (!verificarCampos()) {
      return;
    }
    const usuario = {
      id: data.id,
      nombre: document.querySelector("#txt-nombre").value,
      apellidoPaterno: document.querySelector("#txt-apellido-paterno").value,
      apellidoMaterno: document.querySelector("#txt-apellido-materno").value,
      fechaNacimiento: data.fechaNacimiento,
      telefono: document.querySelector("#txt-celular").value,
      direccion: document.querySelector("#txt-direccion").value,
      numeroDocumento: data.numeroDocumento,
      activoPersona: true,
      fidTipoDocumento: {
        id: data.fidTipoDocumento.id
      },
      email: data.email,
      contrasena: data.contrasena,
      fechaCreacion: data.fechaCreacion,
      activoUsuario: true,
      activo: true,
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
          localStorage.setItem("userCliente", JSON.stringify(usuario));
          window.location.href = "/usuarioMiCuenta";
        } else {
          alert("Ha ocurrido un error");
        }
      })
      .catch((error) => {
        alert("Ha ocurrido un error de comunicación con el servidor");
        console.error(error);
      });
  });

  function verificarCampos() {
    const numCelular = document.querySelector("#txt-celular").value;
    const email = document.querySelector("#txt-correo").value;

    if (numCelular !== "") {
      if (!/^[0-9]+$/.test(numCelular)) {
        document.querySelector("#txt-celular").focus();
        alert("El número celular debe ser numérico");
        return false;
      }
      if (numCelular.length !== 9) {
        document.querySelector("#txt-celular").focus();
        alert("El número celular debe tener 9 caracteres");
        return false;
      }
    }
    if (email !== "") {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        alert("El correo electrónico no es válido");
        return false;
      }
    }

    return true;
  }
};

function validateNumericInput(input) {
  // Obtener el valor del campo de texto
  const value = input.value;

  // Eliminar cualquier caracter no numérico del valor
  const numericValue = value.replace(/\D/g, '');

  // Actualizar el valor del campo de texto con solo caracteres numéricos
  input.value = numericValue;
}