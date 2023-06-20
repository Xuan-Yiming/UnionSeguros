window.onload = function() {
    

    

    
}


document.querySelector("#btn-actualizar").addEventListener("click", function() {
        
        
    if (confirm("Deseas actualizar la información?")) {

        window.location.href = "/usuarioMiCuentaEditar";
        return;
    } else {
        return;
    }

});

document.querySelector("#regresar").addEventListener("click", function() {
        
    window.location.href = '/usuario';

    

});


//Q&A

function toggleAnswer(answerId) {
    var answer = document.getElementById('answer' + answerId);
    var toggleIcon = document.getElementById('toggle-icon' + answerId);
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

    if(tipoDocumento === "0"){

        alert("Por favor ingrese el documento correcto.");
        return true;
    }else if (tipoDocumento === "5") {
        if((documento.length !== 11 || !/^[0-9]+$/.test(documento)) || (documento.substring(0, 2) !== "10" && documento.substring(0, 2) !== "20")){
            document.querySelector("#txt-documento").focus();
            alert("Por favor ingrese un RUC correcto.");
            return true;
        }
    }else if (tipoDocumento === "1") {
        if (documento.length !== 8 || !/^[0-9]+$/.test(documento)) {
            document.querySelector("#txt-documento").focus();
            alert("Por favor ingrese un DNI correcto.");
            return true;
        }
    }else if (tipoDocumento === "2") {
        if (documento.length !== 9 || !/^[0-9]+$/.test(documento)){
            document.querySelector("#txt-documento").focus();
            alert("Por favor ingrese un CE correcto.");
            return true;
        }
    }else if (tipoDocumento === "3") {
        document.querySelector("#txt-documento").focus();
        if ( !/^[A-Z0-9]+$/.test(documento) ){
            alert("Por favor ingrese un pasaporte correcto.");
            return true;
        }
    }
    if (placa === "" || placa.length !== 6 || !/^[A-Za-z0-9]+$/.test(placa)) {
        document.querySelector("#txt-placa").focus();
        alert("Por favor ingrese la placa correcta.");
        return true;
    }

    return false
}