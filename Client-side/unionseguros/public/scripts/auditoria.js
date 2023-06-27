function registrarAuditoria(userID, accion) {
  var data = {
    fid_usuario: {
      id : userID,
    } ,
    accion: accion,
    tiempo: new Date(),
  };

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
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
