const GLOBAL_URL = 'http://localhost:8080/api/v1'

window.onload = function () {
    document.querySelector("#button-login").addEventListener('click', function () {
        let params = new URLSearchParams(location.search);
        params.append('email', document.querySelector("#txt-usuario").value);
        params.append('contrasena', document.querySelector("#txt-contrasena").value);

        let url = new URL(GLOBAL_URL + 'usuario/login?'+ params.toString());
        fetch(url)
            .then(response => response.json())
            .then(element => {
                if (element!=0) {
                    localStorage.setItem('user', JSON.stringify(element));
                    
                    let params = new URLSearchParams();
                    params.append('id', element.toString());

                    let url = new URL(GLOBAL_URL + 'administrador/getRol?' + params.toString());

                    fetch(url)
                        .then(response => response.json())
                        .then(element => {
                            localStorage.setItem('rol', JSON.stringify(element));

                            if (element.toString() == 2){
                                window.location.href = '/admin/PlanSOAT';
                            }else{
                                alert("No eres admin");
                                window.location.href = '/';
                            }
                        })
                        .catch(error => {
                            // Handle the error
                            console.error(error);
                        });

                    
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