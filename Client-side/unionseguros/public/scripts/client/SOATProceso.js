const GLOBAL_URL = 'http://localhost:8080/api/v1'

var stage = 0;

var placa = localStorage.getItem("placa");
var tipoDocumento = localStorage.getItem("tipoDocumento");
var numeroDocumento = localStorage.getItem("documento");

localStorage.setItem("idCliente", 0);
localStorage.setItem("idVehiculo", 0);

window.onload = function () {

    const today = new Date();
    document.querySelector("#date-picker").min = today.toISOString().split("T")[0];

    //marca
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
            console.error(error);
        });

    //modelo
    document.querySelector("#select-marca").addEventListener("change", function () {
        document.querySelector("#select-modelo").innerHTML = "";
        const params = new URLSearchParams();
        params.append("idMarca", document.querySelector("#select-marca").value);

        const url = GLOBAL_URL + "/modelo/listarModelosPorIdMarca?" + params.toString();
        fetch(url)
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

    //anio, asientos
    document.querySelector("#select-modelo").addEventListener("change", function () {
        document.querySelector("#txt-anio").textContent = document.querySelector("#select-modelo").options[document.querySelector("#select-modelo").selectedIndex].getAttribute("data-anio");
        document.querySelector("#txt-asientos").value = document.querySelector("#select-modelo").options[document.querySelector("#select-modelo").selectedIndex].getAttribute("data-asientos");
    });

    const params = new URLSearchParams();
    params.append("placaIngresada", localStorage.getItem("placa"));
    const url = GLOBAL_URL + "/vehiculo/buscarVehiculoPorPlaca?" + params.toString();

    //datos del vehiculo
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data != null) {
                localStorage.setItem("idVehiculo", data.id);

                // marca
                if (data.fidModelo.fidMarcaVehiculo != "") {
                    document.querySelector("#select-marca").disabled = true;
                    document.querySelector("#select-marca").value = data.fidModelo.fidMarcaVehiculo.id;
                }
                document.querySelector("#select-modelo").innerHTML = "";

                const params = new URLSearchParams();
                params.append("idMarca", data.fidModelo.fidMarcaVehiculo.id);
                const url = GLOBAL_URL + "/modelo/listarModelosPorIdMarca?" + params.toString();

                fetch(url)
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
                if (data.numeroAsientos != "") {
                    document.querySelector("#txt-asientos").value = data.numeroAsientos;
                    document.querySelector("#txt-asientos").disabled = true;
                }
                // anio
                if ((data.anhoFabricacion).substring(0, 4) != "") {
                    document.querySelector("#txt-anio").value = (data.anhoFabricacion).substring(0, 4);
                    document.querySelector("#txt-anio").disabled = true;
                }
                //serie
                if (data.serie != "") {
                    document.querySelector("#txt-serie").value = data.serie;
                    document.querySelector("#txt-serie").disabled = true;
                }
                //uso
                if (data.fidTipoUso != "") {
                    document.querySelector("#select-uso").value = data.fidTipoUso.idTipoUso;

                } else {
                }
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
        });
};

document.querySelector("#btn-advance").addEventListener("click", function () {
    if (stage === 3) {
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

document.querySelector("#btn-previous").addEventListener("click", function () {

    if (stage == 0) {
        if (confirm("Deseas cancelar el proceso?")) {
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
            document.querySelector(".form-vehiculo ").style.display = "block";
            document.querySelector(".form-plans").style.display = "none";
            document.querySelector(".form-payment").style.display = "none";
            document.querySelector(".form-result").style.display = "none";
            document.querySelector("#descargarConstancia").style.display = "none";
            document.querySelector("#btn-previous").style.display = "block";
            break;
        case 1:
            document.querySelector(".form-vehiculo ").style.display = "none";
            document.querySelector(".form-plans").style.display = "block";
            document.querySelector(".form-payment").style.display = "none";
            document.querySelector(".form-result").style.display = "none";
            document.querySelector("#descargarConstancia").style.display = "none";
            document.querySelector("#btn-previous").style.display = "block";
            loadPlans();
            break;
        case 2:
            document.querySelector(".form-vehiculo ").style.display = "none";
            document.querySelector(".form-plans").style.display = "none";
            document.querySelector(".form-payment").style.display = "block";
            document.querySelector(".form-result").style.display = "none";
            document.querySelector("#descargarConstancia").style.display = "none";
            document.querySelector("#btn-previous").style.display = "block";
            loadTarjeta();
            break;
        case 3:
            document.querySelector(".form-vehiculo ").style.display = "none";
            document.querySelector(".form-plans").style.display = "none";
            document.querySelector(".form-payment").style.display = "none";
            document.querySelector(".form-result").style.display = "block";
            document.querySelector("#descargarConstancia").style.display = "block";
            document.querySelector("#btn-previous").style.display = "none";
            guardar();
            loadResumen();
            break;
    }
}

function loadPlans() {
    fetch(GLOBAL_URL + '/planSOAT/listarActivos')
        .then(response => response.json())
        .then(data => {
            const planContainer = document.querySelector('.content-plan');
            planContainer.innerHTML = '';
            data.forEach(plan => {
                const planDiv = document.createElement('div');
                planDiv.classList.add('plan-soat');

                const heading = document.createElement('h2');
                heading.innerText = plan.nombrePlan;
                planDiv.appendChild(heading);

                const price = document.createElement('h1');
                price.innerText = `S/.${plan.precio}`;
                planDiv.appendChild(price);

                const descriptionList = document.createElement('ul');
                descriptionList.classList.add('plan-soat-description');

                const coverage = document.createElement('li');
                coverage.innerText = `Cobertura completa hasta S/.${plan.cobertura}`;
                descriptionList.appendChild(coverage);

                const discount = document.createElement('li');
                discount.innerText = 'Descuento del 30% en Repsol y Primax';
                descriptionList.appendChild(discount);

                const ley = document.createElement('li');
                ley.innerText = 'SOAT de acuerdo a la ley.';
                descriptionList.appendChild(ley);

                planDiv.appendChild(descriptionList);

                const selectButton = document.createElement('input');
                selectButton.type = 'radio';
                selectButton.name = 'select-plan';
                selectButton.classList.add('button-red-white-back');
                selectButton.value = plan.id;
                planDiv.appendChild(selectButton);

                planContainer.appendChild(planDiv);
            });
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });
}

function loadResumen() {
    document.querySelector("#txt-res-nombre").innerText = document.querySelector("#txt-nombres").value + ", " + document.querySelector("#txt-apdPaterno").value + " " + document.querySelector("#txt-apdMaterno").value;
    document.querySelector("#txt-res-placa").innerText = localStorage.getItem("placa");
    document.querySelector("#txt-res-plan").innerText = document.querySelector('input[name="select-plan"]:checked').parentElement.querySelector('h2').innerText;
    document.querySelector("#txt-res-precio").innerText = document.querySelector('input[name="select-plan"]:checked').parentElement.querySelector('h1').innerText;
    document.querySelector("#txt-res-fecha").innerText = document.querySelector("#date-picker").value + " - " + document.querySelector("#date-picker").value.addYears(1);
}

function loadTarjeta() {
    document.querySelectorAll('input[name="select-plan"]').forEach((plan) => {
        if (plan.checked) {
            document.querySelector("#total-a-pagar").innerText = 'Total: ' + plan.parentElement.querySelector('h1').innerText;
        }
    });
}

function verificacion() {
    const apdPaterno = document.querySelector("#txt-apdPaterno").value;
    const apdMaterno = document.querySelector("#txt-apdMaterno").value;
    const nombres = document.querySelector("#txt-nombres").value;
    const marca = document.querySelector("#select-marca").value;
    const modelo = document.querySelector("#select-modelo").value;
    const anio = document.querySelector("#txt-anio").value;
    const numAsiento = document.querySelector("#txt-asientos").value;
    const uso = document.querySelector("#select-uso").value;
    const numSerie = document.querySelector("#txt-serie").value;
    const fecha = document.querySelector("#date-picker").value;




    switch (stage) {
        case 0:
            if (apdPaterno == "" || nombres == "" || marca == "" || modelo == "" || anio == "" || uso == "" || numAsiento == "" || numSerie == "" || fecha == "") {
                alert("Falta completar campos");
                return false;
            }

            if (!/^[0-9]+$/.test(numAsiento) ) {
                document.querySelector("#txt-asientos").focus();
                alert("El número de asientos debe ser numérico");
                return false;
            }

            if (numAsiento < 1 || numAsiento > 20) {
                document.querySelector("#txt-asientos").focus();
                alert("El número de asientos debe estar entre 1 y 20");
                return false;
            }

            if (!/^[0-9]+$/.test(anio)) {
                document.querySelector("#txt-anio").focus();
                alert("El año debe ser numérico");
                return false;
            }
            

            if (anio < 2000 || anio > new Date().getFullYear()) {
                document.querySelector("#txt-anio").focus();
                alert("El año debe estar entre 2000 y " + new Date().getFullYear());
                return false;
            }

            if (numSerie.length != 17) {
                document.querySelector("#txt-serie").focus();
                alert("El número de serie debe tener 17 caracteres");
                return false;
            }

            if (!/^[A-Za-z]+$/.test(apdPaterno) || !/^[A-Za-z]+$/.test(apdMaterno) || !/^[A-Za-z ]+$/.test(nombres)) {
                if (apdMaterno != "-") {
                    document.querySelector("#txt-apdPaterno").focus();
                    alert("Los nombres y apellidos no deben contener caracteres especiales");
                    return false;
                }
            }
            break;
        case 1:
            //verificar que se haya seleccionado un plan
            var cont = 0;
            document.querySelectorAll('input[name="select-plan"]').forEach((plan) => {
                if (plan.checked) {
                    cont++;
                }
            });
            if (cont == 0) {
                alert("Debe seleccionar un plan");
                return false;
            }

            break;
        case 2:
            //verificar que se haya llenado los datos de la tarjeta
            const numTarjeta = document.querySelector("#txt-num-tarjeta").value;
            const cvv = document.querySelector("#txt-CVV").value;
            const fechaVencimiento = document.querySelector("#txt-fecha-venc").value;
            const nombreTitular = document.querySelector("#txt-tarjeta-nombre").value;
            const email = document.querySelector("#txt-email").value;
            const moneda = document.querySelector("#select-moneda").value;

            if (numTarjeta == "" || cvv == "" || fechaVencimiento == "" || nombreTitular == "" || email == "" || moneda == "") {
                alert("Falta completar campos");
                return false;
            }

            if (numTarjeta.length != 16) {
                document.querySelector("#txt-num-tarjeta").focus();
                alert("El número de tarjeta debe tener 16 caracteres");
                return false;
            }

            if (!/^[0-9]+$/.test(numTarjeta)) {
                document.querySelector("#txt-num-tarjeta").focus();
                alert("El número de tarjeta debe ser numérico");
                return false;
            }
            
            if (!validateCardExpiration(fechaVencimiento)) {
                document.querySelector("#txt-fecha-venc").focus();
                alert("La fecha de vencimiento no es válido (MM/YY)");
                return false;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                document.querySelector("#txt-email").focus();
                alert("El correo electrónico no es válido");
                return false;
            }

            if (cvv.length != 3) {
                document.querySelector("#txt-CVV").focus();
                alert("El CVV debe tener 3 caracteres");
                return false;
            }

            if (!/^[0-9]+$/.test(cvv)) {
                document.querySelector("#txt-CVV").focus();
                alert("El CVV debe ser numérico");
                return false;
            }

            if (!/^[A-Za-z ]+$/.test(nombreTitular)) {
                document.querySelector("#txt-tarjeta-nombre").focus();
                alert("El nombre del titular no debe contener caracteres especiales");
                return false;
            }

            break;
        case 3:
            break;
    }
    return true;
}
function validateCardExpiration(expirationDate) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
    const currentYear = currentDate.getFullYear() % 100; // Getting the last two digits of the current year
  
    // Check if the expiration date has the correct format MM/yy
    const datePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!datePattern.test(expirationDate)) {
      return false;
    }
  
    // Extract month and year from the expiration date
    const [expirationMonth, expirationYear] = expirationDate.split('/').map(Number);
  
    // Check if the expiration date is greater than the current date
    if (expirationYear < currentYear || (expirationYear === currentYear && expirationMonth <= currentMonth)) {
      return false;
    }
  
    return true;
  }
  
async function guardar() {
    await insertarCliente();
    
    await insertarMetodDePago();
    await insertarPoliza();

    localStorage.clear();
}

async function insertarCliente(){
    const apdPaterno = document.querySelector("#txt-apdPaterno").value;
    const apdMaterno = document.querySelector("#txt-apdMaterno").value;
    const nombres = document.querySelector("#txt-nombres").value;
    const fecha = document.querySelector("#date-picker").value;
    const dateParts = fecha.split('-');
    const yyyy = dateParts[0];
    const mm = dateParts[1];
    const dd = dateParts[2];
    const formattedDate = `${yyyy}-${mm}-${dd}`;


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
            .then(data => {
                if (data) {
                   localStorage.setItem("idCliente", data.id_cliente);
                    insertarVehiculo();
                } else {
                    alert("No se ha podido guardar cliente");
                    return;
                }
            })
            
            .catch(error => {
                // Handle the error
                console.error(error);
            });

    } 
}

async function insertarVehiculo(){
    const marca = document.querySelector("#select-marca").value;
    const modelo = document.querySelector("#select-modelo").value;
    const anio = document.querySelector("#select-anio").value;
    const uso = document.querySelector("#select-uso").value;
    const numAsiento = document.querySelector("#txt-asientos").value;
    const numSerie = document.querySelector("#txt-serie").value;

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
            .then(data => {
                if (data) {
                    localStorage.setItem("idVehiculo", data.id_vehiculo);
                    insertarMetodDePago();
                } else {
                    alert("No se ha podido guardar vehiculo");
                    return;
                }
            })
            .catch(error => {
                // Handle the error
                console.error(error);
            });
    }
}

async function insertarMetodDePago(){
    const numTarjeta = document.querySelector("#txt-num-tarjeta").value;
    const cvv = document.querySelector("#txt-CVV").value;
    const fechaVencimiento = document.querySelector("#txt-fecha-venc").value;
    const nombreTitular = document.querySelector("#txt-tarjeta-nombre").value;
    const email = document.querySelector("#txt-email").value;
    const [month, year] = fechaVencimiento.split('/');
    const date = `${20 + year}-${month}-01`;

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
        .then(data => {
            if (data) {
                localStorage.setItem("idMetodo", data.id_metodo);
                insertarPoliza();
            } else {
                alert("No se ha podido guardar metodo de pago");
                return;
            }
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });
    
}

async function insertarPoliza(){
    const fecha = document.querySelector("#date-picker").value;
    const dateParts = fecha.split('-');
    const yyyy = dateParts[0];
    const mm = dateParts[1];
    const dd = dateParts[2];
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const moneda = document.querySelector("#select-moneda").value;

    const plan = document.querySelector('input[name="select-plan"]:checked').value;


    const infoPoliza = {
        "fidMoneda": {
            "id": moneda
        },
        "fidMetodo": {
            "id": localStorage.getItem("idMetodo")
        },
        "fidVehiculo": {
            "id": localStorage.getItem("idVehiculo")
        },
        "fidCliente": {
            "id": localStorage.getItem("idCliente")
        },
        "precioBase": document.querySelector('input[name="select-plan"]:checked').parentElement.querySelector('h1').innerText.slice(2),
        "fechaVigenciaDesde": formattedDate,
        "fechaVigenciaFin": `${parseInt(yyyy) + 1}-${mm}-${dd}`,
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
                alert("Se ha guardado correctamente");
            } else {
                alert("No se ha podido guardar");
                return;
            }
        })
    
}