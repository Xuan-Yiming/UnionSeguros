

function goBack() {
  window.history.back();
}

window.onload = function () {

    if (localStorage.getItem("user") == null ) {
        window.location.href = "/admin/login";
    }
    if (localStorage.getItem("id-usuario") == null) {
        goBack();
    }

    return;
    fetch(
      GLOBAL_URL +
        "/auditoria/listarAuditorias?id=" +
        localStorage.getItem("id-usuario")
    )
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
        document.querySelector(".text-container").innerHTML = data;
      })
      .catch((error) => {
        alert("Ha ocurrido un error de comunicación con el servidor");
        console.error(error);
      });



}