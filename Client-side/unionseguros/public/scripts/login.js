// const GLOBAL_URL = 'https://apimocha.com/unionseguros';
const GLOBAL_URL = 'http://localhost:8080/api/v1';

var stage = 0;

window.onload = function () {
    localStorage.setItem("idCliente", 0);
    localStorage.setItem("idVehiculo", 0);


    document.querySelector("#dpFecha").value = new Date().toISOString().split("T")[0];

    const today = new Date();

    document.querySelector("#dpFecha").min = today.toISOString().split("T")[0];


    /*


    //vehiculo
    fetch(GLOBAL_URL + '/marcaVehiculo/listarTodas')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                var _option = document.createElement("option");
                _option.value = element.id;
                _option.text = element.marca;
                document.querySelector("#select-marca").appendChild(_option);
            });
        }).catch(error => {
        // Handle the error
        console.error(error);
    });

    document.querySelector("#select-marca").addEventListener("change", function () {
        document.querySelector("#select-modelo").innerHTML = "";
        fetch(GLOBAL_URL + '/modelo/listarModelosPorIdMarca?idMarca=' + document.querySelector("#select-marca").value)
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    var _option = document.createElement("option");
                    _option.value = element.id;
                    _option.text = element.modelo;
                    document.querySelector("#select-modelo").appendChild(_option);
                });
            }).catch(error => {
            // Handle the error
            console.error(error);
        });
    });

    const select = document.getElementById('select-anio');

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Generate options for years from 1980 to current year + 1
    for (let i = currentYear + 1; i >= 1980; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }

    const usos = [
        { id: 1, nombre: "Particular" },
        { id: 2, nombre: "Taxi" },
        { id: 5, nombre: "Carga" },
    ]
    usos.forEach(element => {
        var _option = document.createElement("option");
        _option.value = element.id;
        _option.text = element.nombre;
        document.querySelector("#select-uso").appendChild(_option);
    });

    fetch(GLOBAL_URL + '/vehiculo/buscarVehiculoPorPlaca?placaIngresada=' + localStorage.getItem("placa"))
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem("idVehiculo", data.id);
            // marca

            if (data.fidModelo.fidMarcaVehiculo != "") {
                document.querySelector("#select-marca").disabled = true;
                document.querySelector("#select-marca").value = data.fidModelo.fidMarcaVehiculo.id;
            }
            document.querySelector("#select-modelo").innerHTML = "";
            fetch(GLOBAL_URL + '/modelo/listarModelosPorIdMarca?idMarca=' + data.fidModelo.fidMarcaVehiculo.id)
                .then(response => response.json())
                .then(data => {
                    data.forEach(element => {
                        var _option = document.createElement("option");
                        _option.value = element.id;
                        _option.text = element.modelo;
                        document.querySelector("#select-modelo").appendChild(_option);
                    });

                    if (data.fidModelo != "") {
                        document.querySelector("#select-modelo").disabled = true;
                        document.querySelector("#select-modelo").value = data.fidModelo.id;
                    }
                }).catch(error => {
                // Handle the error
                console.error(error);
            });


            // modelos



            // numero de asientos
            document.querySelector("#txt-asientos").value = data.numeroAsientos;
            if (data.numeroAsientos != "") {
                document.querySelector("#txt-asientos").disabled = true;
            }

            // anio
            if ((data.anhoFabricacion).substring(0, 4) != "") {
                document.querySelector("#select-anio").disabled = true;
                document.querySelector("#select-anio").value = (data.anhoFabricacion).substring(0, 4);
            }
            //serie
            document.querySelector("#txt-serie").value = data.serie;
            if (data.serie != "") {
                document.querySelector("#txt-serie").disabled = true;
            }

            //uso
            if (data.fidTipoUso != "") {
                document.querySelector("#select-uso").value = data.fidTipoUso.idTipoUso;
            } else {
            }
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });

    fetch(GLOBAL_URL + '/cliente/buscarClientePorNumDocumento?numDocumentoIngresado=' + localStorage.getItem("documento"))
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("idCliente", data.id);
            document.querySelector("#txt-apdPaterno").value = data.apellidoPaterno;
            if (data.serie != "") {
                document.querySelector("#txt-apdPaterno").disabled = true;
            }

            document.querySelector("#txt-apdMaterno").value = data.apellidoMaterno;
            if (data.serie != "") {
                document.querySelector("#txt-apdMaterno").disabled = true;
            }

            document.querySelector("#txt-nombres").value = data.nombre;
            if (data.serie != "") {
                document.querySelector("#txt-nombres").disabled = true;
            }
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });*/
};

document.getElementById("select-documento").addEventListener("change", function () {
    const selectedValue = this.value;
    document.getElementById("txt-documento").disabled = false;
    if (document.querySelector("#select-documento").value == "1") {
        document.getElementById("txt-documento").maxLength = "8";
    } else if (document.querySelector("#select-documento").value == "2") {
        document.getElementById("txt-documento").maxLength = "9";
    } else if (document.querySelector("#select-documento").value == "3") {
        document.getElementById("txt-documento").maxLength = "11";
    }
});


document.querySelector("#advance").addEventListener("click", function () {
    if (stage == 3) {
        window.location.href = "/SOAT";
    }

    if (!verificacion()) {
        return;
    }

    var bar = document.querySelector(".ProgressBar");
    if (bar.querySelectorAll(".is-current").length > 0) {
        const progressBar = document.querySelector('.ProgressBar');
        const currentSteps = progressBar.querySelectorAll('.is-current');
        currentSteps.forEach((step) => {
            step.classList.remove('is-current');
            step.classList.add('is-complete');
        });
        const firstIncompleteStep = progressBar.querySelector('.ProgressBar-step:not(.is-complete)');
        if (firstIncompleteStep) {
            firstIncompleteStep.classList.add('is-current');
        }
    } else {
        const firstStep = bar.querySelector(".ProgressBar-step");
        if (firstStep) {
            firstStep.classList.add("is-current");
        }
    }

    stage = stage + 1;
    console.log(stage);
    changeStage();
});

document.querySelector("#previous").addEventListener("click", function () {

    if (stage == 0) {
        if (confirm("Deseas cancelar el proceso de registro?")) {
            window.location.href = "/SOAT";
            return;
        } else {
            return;
        }
    }

    const bar = document.querySelector(".ProgressBar");
    const currentSteps = bar.querySelectorAll(".is-current");
    if (currentSteps.length > 0) {
        currentSteps.forEach(step => {
            step.classList.remove("is-current");
            if (step.previousElementSibling) {
                step.previousElementSibling.classList.remove("is-complete");
                step.previousElementSibling.classList.add("is-current");
            }
        });
    } else {
        const lastCompleteStep = bar.querySelector(".is-complete:last-of-type");
        if (lastCompleteStep) {
            lastCompleteStep.classList.remove("is-complete");
            lastCompleteStep.classList.add("is-current");
        }
    }

    stage = stage - 1;
    console.log(stage);
    changeStage();
});

function changeStage() {
    switch (stage) {
        case 0:
            document.querySelector(".div-registro-datos").style.display = "block";
            document.querySelector(".div-ingreso-correo").style.display = "none";
            document.querySelector(".div-validacion-correo").style.display = "none";
            document.querySelector(".div-result").style.display = "none";
            document.querySelector("#previous").style.display = "block";
            break;
        case 1:
            document.querySelector(".div-registro-datos").style.display = "none";
            document.querySelector(".div-ingreso-correo").style.display = "block";
            document.querySelector(".div-validacion-correo").style.display = "none";
            document.querySelector(".div-result").style.display = "none";;
            document.querySelector("#previous").style.display = "block";
            loadIngresoDatos();
            break;
        case 2:
            document.querySelector(".div-registro-datos").style.display = "none";
            document.querySelector(".div-ingreso-correo").style.display = "none";
            document.querySelector(".div-validacion-correo").style.display = "block";
            document.querySelector(".div-result").style.display = "none";
            document.querySelector("#previous").style.display = "block";
            loadIngresoCorreo();
            break;
        case 3:
            document.querySelector(".div-registro-datos").style.display = "none";
            document.querySelector(".div-ingreso-correo").style.display = "none";
            document.querySelector(".div-validacion-correo").style.display = "none";
            document.querySelector(".div-result").style.display = "block";
            document.querySelector("#previous").style.display = "none";
            guardar();
            loadFin();
            break;
    }
}

function loadIngresoDatos() {

}

function loadFin() {

}

function loadIngresoCorreo() {

}

function verificacion() {

    switch (stage) {
        case 0:


            var documento = document.querySelector("#txt-docNum").value;
            var tipoDocumento = document.querySelector("#select-documento").value;


            if (documento == "") {
                alert("Por favor ingrese el documento correcto.");
                return true;
            } else {
                if (tipoDocumento == "DNI") {
                    if (documento.length !== 8 || !/^[0-9]+$/.test(documento)){
                        alert("Por favor ingrese el documento correcto.");
                        return true;
                    }
                } else if (tipoDocumento == "CE") {
                    if (documento.length !== 9 || !/^[0-9]+$/.test(documento)){
                        alert("Por favor ingrese el documento correcto.");
                        return true;
                    }
                } else if (tipoDocumento == "RUC") {
                    if((documento.length !== 11 || !/^[0-9]+$/.test(documento)) || (documento.substring(0, 2) !== "10" && documento.substring(0, 2) !== "20")){
                        alert("Por favor ingrese el documento correcto.");
                        return true;
                    }
                }
            }


            break;
        case 1:


            const email = document.querySelector("#txt-correo").value;
            if (  email =="" ) {
                alert("Falta completar campos");
                return false;
            }

            if (email.indexOf("@") == -1) {
                alert("El correo electrónico no es válido");
                return false;
            }


            break;
        case 2:

            const pin = document.querySelector("#txt-PIN").value;



            if (  pin == "" ) {
                alert("Falta completar campos");
                return false;
            }


            if (pin.length != 6) {
                alert("El número de tarjeta debe tener 6 dígitos");
                return false;
            }

            if (!/^[0-9]+$/.test(pin)) {
                alert("El PIN debe ser numérico");
                return false;
            }

            break;
        case 3:
            break;
    }
    return true;
}
/*
function guardar() {
    const apdPaterno = document.querySelector("#txt-apdPaterno").value;
    const apdMaterno = document.querySelector("#txt-apdMaterno").value;
    const nombres = document.querySelector("#txt-nombres").value;
    const marca = document.querySelector("#select-marca").value;
    const modelo = document.querySelector("#select-modelo").value;
    const anio = document.querySelector("#select-anio").value;
    const uso = document.querySelector("#select-uso").value;
    const numAsiento = document.querySelector("#txt-asientos").value;
    const numSerie = document.querySelector("#txt-serie").value;

    const pin = document.querySelector("#txt-PIN").value;
    const email = document.querySelector("#txt-correo").value;
    const documento = document.querySelector("#txt-docNum").value;


    const moneda = document.querySelector("#select-moneda").value;
    const dateParts = fecha.split('-');
    const yyyy = dateParts[0];
    const mm = dateParts[1];
    const dd = dateParts[2];
    const formattedDate = `${yyyy}-${mm}-${dd}`;


    const [month, year] = fechaVencimiento.split('/');

    const date = `${20+year}-${month}-01`;

    var idUsuario;
    if (localStorage.getItem('idCliente') == 0) {
        const infoCliente = {
            "nombre": nombres,
            "apellidoPaterno": apdPaterno,
            "apellidoMaterno": apdMaterno,
            "numeroDocumento": localStorage.getItem("documento"),
            "activo": true,
            "fidTipoDocumento": {
                "id": localStorage.getItem("tipoDocumento")
            },
            "fechaCreacion": formattedDate,
            "activoUsuario": true,
            "activoPersona": true,
            "baneado": false,
            "fidRoles": {
                "idRole": 1,
                "fidPermisos": {
                    "id": 1
                }
            }
        };

        fetch(GLOBAL_URL + '/cliente/ingresar', {
            method: 'POST',
            body: JSON.stringify(infoCliente),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(element => {
                if (element) {

                } else {
                    alert("No se ha podido guardar");
                    return;
                }
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });


        fetch(GLOBAL_URL + '/cliente/buscarClientePorNumDocumento?numDocumentoIngresado=' + localStorage.getItem("documento"))
            .then(response => response.json())
            .then(element => {
                idUsuario = element.id
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
    } else {
        idUsuario = localStorage.getItem('idCliente');
    }

    var idVehiculo;
    if (localStorage.getItem('idVehiculo') == 0) {
        const infoVehiculo = {
            "fidTipoUso": {
                "idTipoUso": uso
            },
            "fidModelo": {
                "id": modelo
            },
            "fidPersona": {
                "id": idUsuario
            },
            "anhoFabricacion": anio + "-01-01",
            "numeroAsientos": numAsiento,
            "placa": localStorage.getItem("placa"),
            "serie": numSerie,
            "activo": true
        }

        fetch(GLOBAL_URL + '/vehiculo/insertar', {
            method: 'POST',
            body: JSON.stringify(infoVehiculo),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(element => {
                if (element) {

                } else {
                    alert("No se ha podido guardar");
                    return;
                }
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });


        fetch(GLOBAL_URL + '/vehiculo/buscarVehiculoPorPlaca?placaIngresada=' + localStorage.getItem("placa"))
            .then(response => response.json())
            .then(data => {
                idVehiculo = data.id
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
    } else {
        idVehiculo = localStorage.getItem('idVehiculo');
    }

    const infoTarejta = {
        "nombreMetodo": "VISA",
        "nombreTitular": nombreTitular,
        "correo": email,
        "numeroTarjeta": numTarjeta,
        "cvv": cvv,
        "fechaVencimiento": date,
        "activo": true
    }

    fetch(GLOBAL_URL + '/metodoDePago/insertar', {
        method: 'POST',
        body: JSON.stringify(infoTarejta),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(element => {
            if (element) {

            } else {
                alert("No se ha podido guardar");
                return;
            }
        })

    const infoPoliza = {
        "fidMoneda": {
            "id": moneda
        },
        "fidMetodo": {
            "id": 1
        },
        "fidVehiculo": {
            "id": idVehiculo
        },
        "fidCliente": {
            "id": idUsuario
        },
        "precioBase": document.querySelector('input[name="select-plan"]:checked').parentElement.querySelector('h1').innerText.slice(2),
        "fechaVigenciaDesde": formattedDate,
        "fechaVigenciaFin": `${parseInt(yyyy)+1}-${mm}-${dd}`,
        "activo": true
    }

    fetch(GLOBAL_URL + '/poliza/insertar', {
        method: 'POST',
        body: JSON.stringify(infoPoliza),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(element => {
            if (element) {

            } else {
                alert("No se ha podido guardar");
                return;
            }
        })
    alert("Se ha guardado correctamente");
    localStorage.clear();
}*/