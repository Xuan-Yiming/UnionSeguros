const GLOBAL_URL = 'http://localhost:8080/api/v1'

window.onload = function () {
    document.querySelector("#button-login").addEventListener('click', function () {
        let params = new URLSearchParams(location.search);
        params.append('email', document.querySelector("#txt-usuario").value);
        params.append('contrasena', document.querySelector("#txt-usuario").value);

        let url = new URL(GLOBAL_URL + 'usuario/login?'+ params.toString());
        fetch(url)
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
    });
}