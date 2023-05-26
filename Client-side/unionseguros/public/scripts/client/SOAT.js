const GLOBAL_URL = 'http://localhost:3000/api/'
//Q&A
window.onload = function () {
    //reset the inputs
    document.querySelector("#select-documento").value = "";
    document.querySelector("#txt-documento").value = "";
    document.querySelector("#txt-placa").value = "";

    let selectDocumento = document.querySelector("#select-documento");
    let txtDocumento = document.querySelector("#txt-documento");
    document.querySelector("#select-documento").addEventListener("change", function () {

        txtDocumento.disabled = false;
        if (selectDocumento.value == "1") {
            txtDocumento.maxLength = "8";
        } else if (selectDocumento.value == "2") {
            txtDocumento.maxLength = "9";
        } else if (selectDocumento.value == "3") {
            txtDocumento.maxLength = "11";
        }

        document.querySelector("#txt-placa").maxLength = "6";
    });


    document.querySelector("#btn-cotizar").addEventListener("click", function () {
        if (verificacion()) {
            return;
        }

        localStorage.setItem("placa", document.querySelector("#txt-placa").value);
        localStorage.setItem("documento", document.querySelector("#txt-documento").value);
        localStorage.setItem("tipoDocumento", document.querySelector("#select-documento").value);

        window.location.href = "/SOATPRoceso";
    });
};

function toggleAnswer(answerId) {
    var answer = document.getElementById('client-soat-section-faq-answer' + answerId);
    var toggleIcon = document.getElementById('client-soat-section-faq-toggle-icon' + answerId);
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        toggleIcon.classList.remove('active');
    } else {
        answer.style.display = 'block';
        toggleIcon.classList.add('active');
    }
}

function verificacion() {
    var placa = document.querySelector("#txt-placa").value;
    var documento = document.querySelector("#txt-documento").value;
    var tipoDocumento = document.querySelector("#select-documento").value;

    //verificacion de tipo de documento
    if (tipoDocumento == "") {
        document.querySelector("#select-documento").focus();
        alert("Por favor elegir el tipo de documento.");
        return true;
    } 

    //verificacion de documento
    if (tipoDocumento == "1") {
        if (documento.length !== 8 || !/^[0-9]+$/.test(documento)) {
            alert("Por favor ingrese el documento correcto.");
            document.querySelector("#txt-documento").focus();
            return true;
        }
    } else if (tipoDocumento == "2") {
        if (documento.length !== 9 || !/^[0-9]+$/.test(documento)) {
            alert("Por favor ingrese el documento correcto.");
            document.querySelector("#txt-documento").focus();
            return true;
        }
    } else if (tipoDocumento == "3") {
        if ((documento.length !== 11 || !/^[0-9]+$/.test(documento)) || (documento.substring(0, 2) !== "10" && documento.substring(0, 2) !== "20")) {
            alert("Por favor ingrese el documento correcto.");
            document.querySelector("#txt-documento").focus();
            return true;
        }
    }
    
    //verificacion de placa
    if (placa == "" || placa.length !== 6 || !/^[A-Za-z0-9]+$/.test(placa)) {
        alert("Por favor ingrese la placa correcta.");
        document.querySelector("#txt-placa").focus();
        return true;
    }
    return false
}

