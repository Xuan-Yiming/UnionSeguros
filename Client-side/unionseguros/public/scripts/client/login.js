

var stage = 0;
localStorage.setItem("idCliente", null);
localStorage.setItem("idVehiculo", null);

var flagCorreo = false;
var flagEnviarPIN = false;

window.onload = function () {
    fetch(GLOBAL_URL + '/tipoDocumento/listarActivos')
        .then(response => response.json())
        .then(data => {
            document.querySelector('#select-documento').innerHTML = '';
            data.forEach(tipoDocumento => {
                const option = document.createElement('option');
                option.value = tipoDocumento.id;
                option.innerText = tipoDocumento.nombre;
                document.querySelector('#select-documento').appendChild(option);
            });
        })
        .catch(error => {
            // Handle the error
            console.error(error);
        });
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


document.querySelector("#btn-advance").addEventListener("click", async function () {
    if (verificacion()) {
        return;
    }
    if(stage===0){
        const validacionRegistroResult = await validacionRegistro();
        if(validacionRegistroResult){ //AGREGAR ! FALTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            alert("Ya existe una cuenta con tal documento");
            return;
        }
    }
    if(stage===1){
        await validacionCorreo();
        if(!flagCorreo){
            return;
        }else{
            await enviarPIN();
            if(!flagEnviarPIN){
                return;
            }
        }
    }
    if(stage===2){
        const validarPINResult = await validarPIN();
        if(!validarPINResult){
            return;
        }
    }
    if (stage === 4) {
        window.location.href = "/";
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
    if (stage === 0) {
        if (confirm("Deseas cancelar el proceso de registro?")) {
            window.location.href = "/iniciarSesion";
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
            document.querySelector(".form-registro").style.display = "block";
            document.querySelector(".form-correo").style.display = "none";
            document.querySelector(".form-validacion").style.display = "none";
            document.querySelector(".form-contrasena").style.display = "none";
            document.querySelector(".form-result").style.display = "none";
            document.querySelector("#btn-previous").style.display = "block";
            break;
        case 1:
            document.querySelector(".form-registro").style.display = "none";
            document.querySelector(".form-correo").style.display = "block";
            document.querySelector(".form-validacion").style.display = "none";
            document.querySelector(".form-contrasena").style.display = "none";
            document.querySelector(".form-result").style.display = "none";
            document.querySelector("#btn-previous").style.display = "block";
            break;
        case 2:
            document.querySelector(".form-registro").style.display = "none";
            document.querySelector(".form-correo").style.display = "none";
            document.querySelector(".form-validacion").style.display = "block";
            document.querySelector(".form-contrasena").style.display = "none";
            document.querySelector(".form-result").style.display = "none";
            document.querySelector("#btn-previous").style.display = "block";
            break;
        case 3:
            document.querySelector(".form-registro").style.display = "none";
            document.querySelector(".form-correo").style.display = "none";
            document.querySelector(".form-validacion").style.display = "none";
            document.querySelector(".form-contrasena").style.display = "block";
            document.querySelector(".form-result").style.display = "none";
            document.querySelector("#btn-previous").style.display = "block";
            break;
        case 4:
            document.querySelector(".form-registro").style.display = "none";
            document.querySelector(".form-correo").style.display = "none";
            document.querySelector(".form-validacion").style.display = "none";
            document.querySelector(".form-contrasena").style.display = "none";
            document.querySelector(".form-result").style.display = "block";
            document.querySelector("#btn-previous").style.display = "none";
            guardar();
            if (localStorage.getItem("error")==="1"){
                return;
            }
            break;
    }
}

function validateNumericInput(input) {
    input.value = input.value.replace(/\D/g, ''); // Eliminar caracteres que no sean números
}

function verificacion() {
    const apdPaterno = document.querySelector("#txt-apdPaterno").value;
    const apdMaterno = document.querySelector("#txt-apdMaterno").value;
    const nombres = document.querySelector("#txt-nombres").value;

    switch (stage) {
        case 0:
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
            return false;

            break;
        case 1:
            const email = document.querySelector("#txt-correo").value;
            if (  email === "" || apdPaterno === "" || nombres === "" ) {
                alert("Falta completar campos");
                return true;
            }

            if (!/^[A-Za-z]+$/.test(apdPaterno) || !/^[A-Za-z]+$/.test(apdMaterno) || !/^[A-Za-z ]+$/.test(nombres)) {
                if (apdMaterno !== "-") {
                    document.querySelector("#txt-apdPaterno").focus();
                    alert("Los nombres y apellidos no deben contener caracteres especiales");
                    return true;
                }
            }

            if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
                alert("El correo electrónico no es válido");
                return true;
            }
            return false;
            break;
        case 2:
            const pin = document.querySelector("#txt-PIN").value;

            if (  pin === "" ) {
                alert("Falta completar el campo");
                return true;
            }

            if (pin.length !== 6) {
                alert("El PIN debe tener 6 dígitos");
                return true;
            }

            if (!/^[0-9]+$/.test(pin)) {
                alert("El PIN debe ser numérico");
                return true;
            }
            return false;
            break;
        case 3:
            const contrasena = document.querySelector("#txt-contrasena").value;
            if (  contrasena === "" ) {
                alert("Falta completar el campo");
                return true;
            }
            return false;
            break;

        case 4:
            break;
    }
    return true;
}

/****APIS****/
async function validacionRegistro() {
    const numero_documento = document.querySelector("#txt-documento").value;
    const id_tipo_documento = document.querySelector("#select-documento").value;
    const informacion = [numero_documento, id_tipo_documento]
    const url = GLOBAL_URL + "/usuario/verificarExistenciaDeCliente?informacion=" + encodeURIComponent(JSON.stringify(informacion));

    try {
        const response = await fetch(url);
        const element = await response.json();

        if (element != null) { // ya está registrado
            localStorage.setItem('user', JSON.stringify(element));
            const contrasena = element.contrasena;
            if (contrasena === "") { // no tiene contraseña
                document.querySelector("#txt-nombres").value = element.nombre;
                document.querySelector("#txt-apdPaterno").value = element.apellidoPaterno;
                document.querySelector("#txt-apdMaterno").value = element.apellidoMaterno;
                document.querySelector("#txt-correo").value = element.email;

                document.querySelector("#txt-nombres").disabled = true;
                document.querySelector("#txt-apdPaterno").disabled = true;
                document.querySelector("#txt-apdMaterno").disabled = true;
                document.querySelector("#txt-correo").disabled = true;

                return true;
            } else { // ya tiene contraseña, está listo
                return false;
            }
        } else { // no está registrado
            return true;
        }
    } catch (error) {
        console.error(error);
        localStorage.setItem("error", "1");
        return false;
    }
}


async function validacionCorreo() {
    const email = document.querySelector("#txt-correo").value;

    try {
        const response = await fetch(GLOBAL_URL + '/usuario/verificarEmailIngresadoDisponible?correoIngresado=' + email);
        const data = await response.json();

        if(!data) {
            flagCorreo = false;
            alert("El correo ingresado ya esta en uso. Ingrese otro.")
        } else {
            flagCorreo = true;
        }

        // Aquí puedes colocar el código que quieres que se ejecute después de validacionCorreo()
    } catch (error) {
        console.error(error);
        flagCorreo = false;
    }
}


async function enviarPIN() {
    const email = document.querySelector("#txt-correo").value;

    try {
        let data = [
            email
        ];
        console.log(JSON.stringify(data));
        fetch(GLOBAL_URL + '/email/generarToken', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(element => {
                alert(Object.keys(element));
                alert(element);
                if (element === "SE ENVIO EL TOKEN") {
                    flagEnviarPIN = true;
                }
            })
            .catch(error => {
                // Handle the error
                console.error(error);
                localStorage.setItem("error", "1");
            });

    } catch (error) {
        console.error('Error:', error);
        localStorage.setItem("error", "1");
        flagEnviarPIN = false;
    }
}


async function validarPIN(){

}
function guardar(){

}