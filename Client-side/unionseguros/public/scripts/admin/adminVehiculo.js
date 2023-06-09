

var vehculos;
var searchTimer;
window.onload = function () {
    if (localStorage.getItem('user') == null) {
        window.location.href = '/admin/login';
    }
    fetch(GLOBAL_URL + "/vehiculo/buscarVehiculoParametros?busqueda=")
      .then((response) => response.json())
      .then((data) => {
        this.vehculos = data;
        crearLaTabla(data);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });

    document.querySelector('#txt-buscar').addEventListener('input', function () {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            const query = document.querySelector('#txt-buscar').value.toLowerCase();

            let params = new URLSearchParams();
            params.append('busqueda', query);

            let url = new URL(
              GLOBAL_URL +
                "/vehiculo/buscarVehiculoParametros?" +
                params.toString()
            );

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.vehculos = data;
                    crearLaTabla(data);
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
        }, 500);
    });

    document.querySelector('#btn-nuevo').addEventListener('click', function () {
        localStorage.removeItem("data-vehiculo");
        window.location.href = '/admin/detalleVehiculo';
    });

}


function crearLaTabla(data) {
    const table = document.querySelector('#table-body');
    table.innerHTML = '';
    data.forEach(vehiculo => {
        const tableRow = document.createElement('tr');
        tableRow.classList.add('table-row');

        const placa = document.createElement('td');
        placa.classList.add("td-placa");
        placa.innerText = vehiculo.placa;
        tableRow.appendChild(placa);

        const marca = document.createElement('td');
        marca.classList.add("td-marca");
        marca.innerText = vehiculo.fidModelo.fidMarcaVehiculo.marca;
        tableRow.appendChild(marca);

        const modelo = document.createElement('td');
        modelo.classList.add("td-modelo");
        modelo.innerText = vehiculo.fidModelo.modelo;
        tableRow.appendChild(modelo);

        const serie = document.createElement('td');
        serie.classList.add("td-serie");
        serie.innerText = vehiculo.serie;
        tableRow.appendChild(serie);

        const dueno = document.createElement('td');
        dueno.classList.add("td-dueno");
        dueno.innerText =
          vehiculo.fidPersona.nombre +
          " " +
          vehiculo.fidPersona.apellidoPaterno +
          " " +
          vehiculo.fidPersona.apellidoMaterno;
        tableRow.appendChild(dueno);
        //add edit button
        const button = document.createElement('td');

        //add delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-delete');
        deleteButton.innerText = 'Eliminar';
        deleteButton.setAttribute("data-id", vehiculo.id);
        deleteButton.addEventListener('click', () => {
            const dataId = event.target.getAttribute('data-id');
            let data = this.usuarios.find((vehiculo) => vehiculo.id == dataId);
            const usuario = {
                "id": data.id,
                "nombre": data.nombre,
                "apellidoPaterno": data.apellidoPaterno,
                "apellidoMaterno": data.apellidoMaterno,
                "fechaNacimiento": data.fechaNacimiento,
                "telefono": data.telefono,
                "direccion": data.direccion,
                "numeroDocumento": data.numeroDocumento,
                "activoPersona": false,
                "fidTipoDocumento": {
                    "id": data.fidTipoDocumento.id
                },
                "email": data.email,
                "contrasena": data.contrasena,
                "fechaCreacion": data.fechaCreacion,
                "activoUsuario": false,
                "activo": false,
                "fidRoles": {
                    "idRole": 1,
                    "fidPermisos": {
                        "id": 1
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
        });
        button.appendChild(deleteButton);
        tableRow.appendChild(button);

        table.appendChild(tableRow);
    });

}