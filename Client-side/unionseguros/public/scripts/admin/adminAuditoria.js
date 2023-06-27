if (localStorage.getItem("user") === null) {
  window.location.href = "/admin/login";
}

function goBack() {
  window.history.back();
}

window.onload = function () {
  if (localStorage.getItem("id-usuario") == null) {
    goBack();
  }
  let url = new URL(
    GLOBAL_URL +
      "/auditoria/buscarAuditoriasPorID?idIngresado=" +
      localStorage.getItem("id-usuario")
  );
  console.log(url);
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
        "Ver auditoria"
      );
      document.querySelector(".text-container").innerHTML = "";
      data.forEach((element) => {
        document.querySelector(".text-container").innerHTML += element.tiempo + " -- " + element.accion + "<br>";
      });
    })
    .catch((error) => {
      alert("Ha ocurrido un error de comunicación con el servidor");
      console.error(error);
    });
};
