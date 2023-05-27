const GLOBAL_URL = 'http://localhost:8080/api/v1'

window.onload = function () {
    if (localStorage.getItem('user') == null) {
        window.location.href = '/admin/login';
    }

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
        document.querySelector('#select-estado').value = data.activo? 1: 0;
    }

    document.querySelector('#regresar').addEventListener('click', function () {
        localStorage.removeItem('data-usaurio');
        window.location.href = '/admin/usuario';
    });

    document.querySelector('#btn-guardar').addEventListener('click', function () {
        if(!verificarCampos()) {
            return;
        }
        if (document.querySelector('#id').innerHTML == "") {
            const plan = {
                "cobertura": document.querySelector('#txt-cobertura').value,
                "precio": document.querySelector('#txt-precio').value,
                "nombrePlan": document.querySelector('#txt-nombre').value,
                "activo": document.querySelector('#select-estado').value
            }
            fetch(GLOBAL_URL + '/planSOAT/insertar', {
                method: 'POST',
                body: JSON.stringify(plan),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(element => {
                    if (element) {
                        alert("Se ha guardado correctamente");
                        window.location.href = '/admin/PlanSOAT';
                    } else {
                        alert("No se ha podido guardar");
                        return;
                    }
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
        } else {
            const plan = {
                "id": document.querySelector('#id').innerHTML,
                "cobertura": document.querySelector('#txt-cobertura').value,
                "precio": document.querySelector('#txt-precio').value,
                "nombrePlan": document.querySelector('#txt-nombre').value,
                "activo": document.querySelector('#select-estado').value
            }

            fetch(GLOBAL_URL + '/planSOAT/modificar', {
                method: 'PUT',
                body: JSON.stringify(plan),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(element => {
                    if (element) {
                        alert("Se ha guardado correctamente");
                        window.location.href = '/admin/PlanSOAT';
                    } else {
                        alert("No se ha podido guardar");
                        return;
                    }
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
        }

    });

    function verificarCampos(){
        let cobertura = document.querySelector('#txt-cobertura').value;
        let precio = document.querySelector('#txt-precio').value;
        let nombre = document.querySelector('#txt-nombre').value;

        if(cobertura == ""){
            document.querySelector('#txt-cobertura').focus();
            alert("Debe ingresar la cobertura");
            return false;
        }
        if(precio == ""){
            document.querySelector('#txt-precio').focus();
            alert("Debe ingresar el precio");
            return false;
        }
        if(nombre == ""){
            document.querySelector('#txt-nombre').focus();
            alert("Debe ingresar el nombre");
            return false;
        }

        if(!/^[0-9]+./.test(precio)){
            document.querySelector('#txt-precio').focus();
            alert("El precio debe ser un número");
            return false;
        }

        if(!/^[0-9]+./.test(cobertura)){
            document.querySelector('#txt-cobertura').focus();
            alert("La cobertura debe ser un número");
            return false;
        }

        return true;
    }
};


