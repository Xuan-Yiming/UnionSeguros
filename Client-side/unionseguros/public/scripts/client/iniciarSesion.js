

window.onload = function () {
    document.querySelector("#ingresar-btn").addEventListener('click', function () {
        let params = new URLSearchParams(location.search);
        params.append('email', document.querySelector("#txt-correo").value);
        params.append('contrasena', document.querySelector("#txt-contrasena").value);

        let url = new URL(GLOBAL_URL + '/usuario/login?'+ params.toString());
        fetch(url)
            .then(response => response.json())
            .then(element => {
                if (parseInt(element) > 0) {
                    localStorage.setItem('user', JSON.stringify(element));
                    window.location.href = '/usuario';
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