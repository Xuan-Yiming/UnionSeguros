

var usuarios;
window.onload = function () {
    if (localStorage.getItem('user') == null) {
        window.location.href = '/admin/login';
    }
    fetch(GLOBAL_URL + '/usuario/ListarTodos')
        .then(response => response.json())
        .then(data => {
            this.usuarios = data;
            crearLaTabla(data);
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });

        document.querySelector('#txt-buscar').addEventListener('input', function () {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function () {
                const query = document.querySelector('#txt-buscar').value.toLowerCase();
                searchResult.innerHTML = '';

                let params = new URLSearchParams();
                params.append('busqueda', query);
                
                let url = new URL(GLOBAL_URL + '/usuario/buscarUsuario?' + params.toString());

                fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.usuarios = data;
                    crearLaTabla(data);
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
            }, 500);
        });
        
        document.querySelector('#btn-nuevo').addEventListener('click', function () {
            localStorage.removeItem("data-usuario");
            window.location.href = '/admin/detalleUsuario';
        });

}


function crearLaTabla(data){
    const table = document.querySelector('#table-body');
    table.innerHTML = '';
    data.forEach(usaurio => {
        const tableRow = document.createElement('tr');
        tableRow.classList.add('table-row');

        const nombres = document.createElement('td');
        nombres.classList.add('td-nombre');
        nombres.innerText = usaurio.nombre + ", " + usaurio.apellidoPaterno + " " + usaurio.apellidoMaterno;
        tableRow.appendChild(nombres);

        const rol = document.createElement('td');
        rol.classList.add('td-rol');
        rol.innerText = usaurio.fidRoles.descripcion;
        tableRow.appendChild(rol);

        const auditoria = document.createElement('td');
        auditoria.classList.add('td-auditoria');
        auditoria.innerText = "Auditoria";
        tableRow.appendChild(auditoria);


        const activo = document.createElement('td');
        activo.classList.add('td-activo');
        activo.innerText = usaurio.activo?'Activo':'Inactivo';
        tableRow.appendChild(activo);

        //add edit button
        const button = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.classList.add('btn-edit');
        editButton.innerText = 'Editar';
        editButton.setAttribute('data-id', usaurio.id);
        editButton.addEventListener('click', () => {
            const dataId = event.target.getAttribute('data-id');
            localStorage.setItem('data-usuario', JSON.stringify(this.usuarios.find( usuario => usuario.id == dataId)));
            window.location.href = '/admin/detalleUsuario';
        });
        button.appendChild(editButton);
        tableRow.appendChild(button);

        table.appendChild(tableRow);
    });

}