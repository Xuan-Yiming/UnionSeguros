function registrarAuditoria(userID, accion) {
  var data = {
    idUsuario: userID,
    accion: accion,
    hora: new Date(),
  };
    return;
  fetch(GLOBAL_URL + "/auditoria/insertar", {
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
    .catch((error) => {
      console.error(error);
    });
}
