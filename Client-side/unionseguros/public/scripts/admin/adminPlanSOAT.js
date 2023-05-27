const GLOBAL_URL = 'http://localhost:8080/api/v1'

var planes;
window.onload = function () {
    if (localStorage.getItem('user') == null) {
        window.location.href = '/admin/login';
        if(localStorage.getItem('rol') != 2){
            alert("No eres admin");
            window.location.href = '/';
        }
    }

    fetch(GLOBAL_URL + '/planSOAT/ListarTodos')
        .then(response => response.json())
        .then(data => {
            this.planes = data;
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
                
                let url = new URL(GLOBAL_URL + '/planSOAT/buscarPlanesSOAT?' + params.toString());

                fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.planes = data;
                    crearLaTabla(data);
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                });
            }, 500);
        });
        
        document.querySelector('#btn-nuevo').addEventListener('click', function () {
            localStorage.removeItem('data-plan');
            window.location.href = '/admin/detallePlanSOAT';
        });

}


function crearLaTabla(data){
    const table = document.querySelector('#table-body');
    table.innerHTML = '';
    data.forEach(plan => {
        const tableRow = document.createElement('tr');
        tableRow.classList.add('table-row');

        const ID = document.createElement('td');
        ID.classList.add('td-id');
        ID.innerText = plan.id;
        tableRow.appendChild(ID);

        const nombrePlan = document.createElement('td');
        nombrePlan.classList.add('td-nombre');
        nombrePlan.innerText = plan.nombrePlan;
        tableRow.appendChild(nombrePlan);

        const precio = document.createElement('td');
        precio.classList.add('td-precio');
        precio.innerText = plan.precio;
        tableRow.appendChild(precio);

        const cobertura = document.createElement('td');
        cobertura.classList.add('td-cobertura');
        cobertura.innerText = plan.cobertura;
        tableRow.appendChild(cobertura);

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
            const dataId = event.target.getAttribute('data-id');
                localStorage.setItem('data-plan', JSON.stringify(planes.find(plan => plan.id == dataId)));
                window.location.href = '/admin/detallePlanSOAT';
        });
        button.appendChild(editButton);
        tableRow.appendChild(button);

        table.appendChild(tableRow);
    });
}