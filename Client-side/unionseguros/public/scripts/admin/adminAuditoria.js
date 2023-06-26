if (localStorage.getItem("user") === null) {
    window.location.href = "/admin/login";
}

function goBack() {
  window.history.back();
}

window.onbeforeunload = confirmExit;
function confirmExit() {
  if (confirm("confirm exit is being called") == true) {
    //do something
  } else {
    return false;
  }

}

window.onload = function () {
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