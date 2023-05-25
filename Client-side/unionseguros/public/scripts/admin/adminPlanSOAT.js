const GLOBAL_URL = 'http://localhost:3000/api/'

var planes;
window.onload = function () {
    fetch(GLOBAL_URL + '/planSOAT/ListarTodos')
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
                
                let url = new URL(GLOBAL_URL + '/planSOAT/buscarPlanesSOAT?' + params.toString());

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
        });
        button.appendChild(editButton);
        tableRow.appendChild(button);

        table.appendChild(tableRow);
    });

    const btnEdits = document.querySelectorAll('.btn-edit');
    btnEdits.forEach(btn => {
        btn.addEventListener('click', function () {
        const plan = {
            "id": this.getAttribute('data-id'),
        }
        localStorage.setItem('plan-id', plan.id);
        window.location.href = '/admin/detallePlanSOAT';
    });
});
}