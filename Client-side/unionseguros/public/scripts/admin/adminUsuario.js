const GLOBAL_URL = 'http://localhost:3000/api/'

var planes;
window.onload = function () {
    fetch(GLOBAL_URL + '/Usuario/ListarTodos')
        .then(response => response.json())
        .then(data => {
            planes = data;
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
                    planes = data;
                    crearLaTabla(data);
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
            }, 500);
        });
        
        document.querySelector('#btn-nuevo').addEventListener('click', function () {
            localStorage.clear();
            window.location.href = '/admin/detallePlanSOAT';
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
        nombres.innerText = usaurio.nombres + ", " + usaurio.apellidoPaterno + " " + usaurio.apellidoMaterno;
        tableRow.appendChild(nombres);

        const rol = document.createElement('td');
        rol.classList.add('td-rol');
        rol.innerText = usaurio.rol;
        tableRow.appendChild(rol);

        const auditoria = document.createElement('td');
        auditoria.classList.add('td-auditoria');
        auditoria.innerText = plan.precio;
        tableRow.appendChild(auditoria);


        const activo = document.createElement('td');
        activo.classList.add('td-activo');
        activo.innerText = plan.activo?'Activo':'Inactivo';
        tableRow.appendChild(activo);

        //add edit button
        const button = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.classList.add('btn-edit');
        editButton.innerText = 'Editar';
        editButton.setAttribute('data-id', plan.id);
        editButton.addEventListener('click', () => {
        });
        button.appendChild(editButton);
        tableRow.appendChild(button);

        table.appendChild(tableRow);
    });

    const btnEdits = document.querySelectorAll('.btn-edit');
    btnEdits.forEach(btn => {
        btn.addEventListener('click', function () {
        const usaurio = {
            "id": this.getAttribute('data-id'),
        }
        localStorage.setItem('usaurio-id', usaurio.id);
        window.location.href = '/admin/detalleUsuario';
    });
});
}