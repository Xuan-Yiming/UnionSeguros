import {GLOBAL_URL} from './conection.js';

window.onload = function () {
    document.querySelector("#button-login").addEventListener('click', function () {
        const user = {
            "usuario": document.querySelector("#txt-usuario").value,
            "password": document.querySelector("#txt-usuario").value
        }
        fetch(GLOBAL_URL + '/usuario/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(element => {
                if (element) {
                    localStorage.setItem('user', JSON.stringify(element));
                    window.location.href = '/admin/PlanSOAT';
                } else {
                    alert("Usuario o contraseña incorrectos");
                    return;
                }
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
    }
}