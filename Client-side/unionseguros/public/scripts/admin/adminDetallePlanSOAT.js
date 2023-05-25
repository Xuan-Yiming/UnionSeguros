import {GLOBAL_URL} from './conection.js';

window.onload = function () {
    if (localStorage.getItem('plan-id') == null) {
        document.querySelector('#titulo').innerHTML = 'Nuevo Plan SOAT';
    }
    

    if (localStorage.getItem('plan-id')){

        let id = localStorage.getItem('plan-id');

        let params = new URLSearchParams();
        params.append('id', id);
        let url = new URL(GLOBAL_URL + '/planSOAT/obtenerPorId?' + params.toString());
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                document.querySelector('#id').innerHTML = data.id;
                document.querySelector('#txt-cobertura').value = data.cobertura;
                document.querySelector('#txt-precio').value = data.precio;
                document.querySelector('#txt-nombre').value = data.nombrePlan;
                document.querySelector('#select-estado').value = data.activo;
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
    
    }

    document.querySelector('#regresar').addEventListener('click', function () {
        localStorage.clear();
        window.location.href = '/admin/PlanSOAT';
    });

    document.querySelector('#btn-guardar').addEventListener('click', function () {
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
};


