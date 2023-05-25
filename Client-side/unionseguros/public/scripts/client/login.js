import {GLOBAL_URL} from './conection.js';

var stage = 0;

window.onload = function () {
    localStorage.setItem("idCliente", 0);
    localStorage.setItem("idVehiculo", 0);


    document.querySelector("#dpFecha").value = new Date().toISOString().split("T")[0];

    const today = new Date();

    document.querySelector("#dpFecha").min = today.toISOString().split("T")[0];

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
