

window.onload = function () {
    if (localStorage.getItem('user') == null) {
        window.location.href = '/admin/login';
    }

    fetch(GLOBAL_URL + '/roles/listarActivos')
    .then(response => response.json())
    .then(data => {
        data.forEach(rol => {
            const option = document.createElement('option');
            option.value = rol.idRole;
            option.innerText = rol.descripcion;
            document.querySelector('#select-rol').appendChild(option);
        });
    })
    .catch(error => {
        // Handle the error
        console.error(error);
    });


    if (localStorage.getItem('data-usuario') == null) {
        document.querySelector('#titulo').innerHTML = 'Nuevo Usuario';
    } else {
        let data = JSON.parse(localStorage.getItem('data-usuario'));

        document.querySelector('#id').innerHTML = data.id;
        document.querySelector('#txt-nombre').value = data.nombre;
        document.querySelector('#txt-apellido-paterno').value = data.apellidoPaterno;
        document.querySelector('#txt-apellido-materno').value = data.apellidoMaterno;
        document.querySelector('#txt-celular').value = data.telefono;
        document.querySelector('#txt-correo').value = data.email;
        document.querySelector('#txt-contrasena').value = data.contrasena;
        document.querySelector('#select-estado').value = data.activo;
        document.querySelector('#select-rol').value = data.fidRoles.idRole;
        document.querySelector('#txt-direccion').value = data.direccion;
        document.querySelector('#dp-fecha-nacimiento').value = data.fechaNacimiento;
        document.querySelector('#txt-documento').value = data.numeroDocumento;
        document.querySelector('#select-documento').value = data.fidTipoDocumento.id;
        document.querySelector('#select-estado').value = data.activo ? 1 : 0;
    }

    document.querySelector('#regresar').addEventListener('click', function () {
        localStorage.removeItem('data-usaurio');
        window.location.href = '/admin/usuario';
    });

    document.querySelector('#btn-guardar').addEventListener('click', function () {
        if (!verificarCampos()) {
            return;
        }
        if (document.querySelector('#id').innerHTML == "") {
            const usuario = {
                "nombre":  document.querySelector('#txt-nombre').value,
                "apellidoPaterno":  document.querySelector('#txt-apellido-paterno').value,
                "apellidoMaterno":  document.querySelector('#txt-apellido-materno').value,
                "fechaNacimiento": new Date(document.querySelector('#dp-fecha-nacimiento').value).toISOString().slice(0, 10),
                "telefono":  document.querySelector('#txt-celular').value,
                "direccion": document.querySelector('#txt-direccion').value,
                "numeroDocumento": document.querySelector('#txt-documento').value,
                "activoPersona": true,
                "fidTipoDocumento": {
                    "id": document.querySelector('#select-documento').value
                },
                "email":  document.querySelector('#txt-correo').value,
                "contrasena":  document.querySelector('#txt-contrasena').value,
                "fechaCreacion": new Date().toISOString().slice(0, 10),
                "activoUsuario": true,
                "activo": true,
                "fidRoles": {
                    "idRole":  document.querySelector('#select-rol').value,
                    "fidPermisos": {
                        "id":  document.querySelector('#select-rol').value
                    }
                }
            }
            console.log(JSON.stringify(usuario));
            fetch(GLOBAL_URL + '/administrador/insertar', {
                method: 'POST',
                body: JSON.stringify(usuario),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(element => {
                    if (parseInt(element) > 0) {
                        alert("Se ha guardado correctamente");
                        window.location.href = '/admin/usuario';
                    } else {
                        if (parseInt(element) > 0 == 0) {
                        alert("Numero de documento repetido");
                        } else if (parseInt(element) > 0 == -1) {
                        alert("Correo repetido");
                        } else {
                        alert("Ha ocurrido un error");
                        }
                        return;
                        
                    }
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
        } else {
            let data = JSON.parse(localStorage.getItem('data-usuario'));
            const usuario = {
                "id": data.id,
                "nombre":  document.querySelector('#txt-nombre').value,
                "apellidoPaterno":  document.querySelector('#txt-apellido-paterno').value,
                "apellidoMaterno":  document.querySelector('#txt-apellido-materno').value,
                "fechaNacimiento": new Date(document.querySelector('#dp-fecha-nacimiento').value).toISOString().slice(0, 10),
                "telefono":  document.querySelector('#txt-celular').value,
                "direccion": document.querySelector('#txt-direccion').value,
                "numeroDocumento": document.querySelector('#txt-documento').value,
                "activoPersona": true,
                "fidTipoDocumento": {
                    "id": document.querySelector('#select-documento').value
                },
                "email":  document.querySelector('#txt-correo').value,
                "contrasena":  document.querySelector('#txt-contrasena').value,
                "fechaCreacion": data.fechaCreacion,
                "activoUsuario": true,
                "activo": document.querySelector('#select-estado').value == 1 ? true : false,
                "fidRoles": {
                    "idRole":  document.querySelector('#select-rol').value,
                    "fidPermisos": {
                        "id":  document.querySelector('#select-rol').value
                    }
                }
            }
            console.log(JSON.stringify(usuario));

            fetch(GLOBAL_URL + '/administrador/modificar', {
                method: 'PUT',
                body: JSON.stringify(usuario),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(element => {
                    if (element) {
                        alert("Se ha guardado correctamente");
                        window.location.href = '/admin/usuario';
                    } else {
                        alert("Ha ocurrido un error");
                    }
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
        }

    });

    function verificarCampos() {

        return true;
        let cobertura = document.querySelector('#txt-cobertura').value;
        let precio = document.querySelector('#txt-precio').value;
        let nombre = document.querySelector('#txt-nombre').value;

        if (cobertura == "") {
            document.querySelector('#txt-cobertura').focus();
            alert("Debe ingresar la cobertura");
            return false;
        }
        if (precio == "") {
            document.querySelector('#txt-precio').focus();
            alert("Debe ingresar el precio");
            return false;
        }
        if (nombre == "") {
            document.querySelector('#txt-nombre').focus();
            alert("Debe ingresar el nombre");
            return false;
        }

        if (!/^[0-9]+./.test(precio)) {
            document.querySelector('#txt-precio').focus();
            alert("El precio debe ser un número");
            return false;
        }

        if (!/^[0-9]+./.test(cobertura)) {
            document.querySelector('#txt-cobertura').focus();
            alert("La cobertura debe ser un número");
            return false;
        }

        return true;
    }
};


