if (localStorage.getItem("user") === null) {
  window.location.href = "/admin/login";
}

window.onload = function () {
  if (localStorage.getItem("data-plan") == null) {
    document.querySelector("#titulo").innerHTML = "Nuevo Plan SOAT";
  } else {
    let data = JSON.parse(localStorage.getItem("data-plan"));

    document.querySelector("#id").innerHTML = data.id;
    document.querySelector("#txt-cobertura").value = data.cobertura;
    document.querySelector("#txt-precio").value = data.precio;
    document.querySelector("#txt-nombre").value = data.nombrePlan;
    document.querySelector("#select-estado").value = data.activo;
  }

  document.querySelector("#regresar").addEventListener("click", function () {
    localStorage.removeItem("data-plan");
    window.location.href = "/admin/PlanSOAT";
  });

  document.querySelector("#btn-guardar").addEventListener("click", function () {
    if (!verificarCampos()) {
      return;
    }
    if (document.querySelector("#id").innerHTML == "") {
      const plan = {
        cobertura: document.querySelector("#txt-cobertura").value,
        precio: document.querySelector("#txt-precio").value,
        nombrePlan: document.querySelector("#txt-nombre").value,
        activo: document.querySelector("#select-estado").value ? true : false,
      };
      fetch(GLOBAL_URL + "/planSOAT/insertar", {
        method: "POST",
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
            alert("Se ha guardado correctamente");
            window.location.href = "/admin/PlanSOAT";
          } else {
            alert("No se ha podido guardar");
            return;
          }
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    } else {
      const plan = {
        id: document.querySelector("#id").innerHTML,
        cobertura: document.querySelector("#txt-cobertura").value,
        precio: document.querySelector("#txt-precio").value,
        nombrePlan: document.querySelector("#txt-nombre").value,
        activo: document.querySelector("#select-estado").value ? true : false,
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
            alert("Se ha guardado correctamente");
            window.location.href = "/admin/PlanSOAT";
          } else {
            alert("No se ha podido guardar");
            return;
          }
        })
        .catch((error) => {
          alert("Ha ocurrido un error de comunicación con el servidor");
          console.error(error);
        });
    }
  });

  function verificarCampos() {
    let cobertura = document.querySelector("#txt-cobertura").value;
    let precio = document.querySelector("#txt-precio").value;
    let nombre = document.querySelector("#txt-nombre").value;

    if (cobertura == "") {
      document.querySelector("#txt-cobertura").focus();
      alert("Debe ingresar la cobertura");
      return false;
    }
    if (precio == "") {
      document.querySelector("#txt-precio").focus();
      alert("Debe ingresar el precio");
      return false;
    }
    if (nombre == "") {
      document.querySelector("#txt-nombre").focus();
      alert("Debe ingresar el nombre");
      return false;
    }

    if (!/^[0-9]+./.test(precio)) {
      document.querySelector("#txt-precio").focus();
      alert("El precio debe ser un número");
      return false;
    }

    if (!/^[0-9]+./.test(cobertura)) {
      document.querySelector("#txt-cobertura").focus();
      alert("La cobertura debe ser un número");
      return false;
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
