const usuarioJSON = localStorage.getItem("userCliente");
const usuario = JSON.parse(usuarioJSON);

window.onload = function(){
    loadPlans();
};

function loadPlans() {
    let params = new URLSearchParams(location.search);
    params.append("busqueda", usuario.id);
    fetch(GLOBAL_URL + "/SOAT/listarSoatPorPlan?" + params.toString())
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.status + " " + response.statusText);
            } else {
                try {
                    return response.json();
                } catch (error) {
                    return null;
                }
            }
        })
        .then((data) => {
            const soatContainer = document.querySelector(".info-productos-wrapper-carousel");
            soatContainer.innerHTML = "";
            data.forEach((soat) => {
                if(soat.activo){
                    const soatDiv = document.createElement("div");
                    soatDiv.classList.add("wrapper-carousel-item");
                    let placaInicial = soat.fidPoliza.fidVehiculo.placa;
                    let placaFormateada = placaInicial.substring(0, 3) + "-" + placaInicial.substring(3);
                    const nombreSoat = document.createElement("h2");
                    nombreSoat.innerText = `${soat.fidPlanSoat.nombrePlan}`;
                    soatDiv.appendChild(nombreSoat);

                    const placaSoat = document.createElement("p");
                    placaSoat.innerText = `Placa: ${placaFormateada}`;
                    soatDiv.appendChild(placaSoat);

                    const vigenciaSoat = document.createElement("p");
                    vigenciaSoat.innerText = `Vigencia hasta ${soat.fidPoliza.fechaVigenciaFin}`;
                    soatDiv.appendChild(vigenciaSoat);

                    const descargarButton = document.createElement("button");
                    descargarButton.type = "button";
                    descargarButton.classList.add("button-red");
                    descargarButton.textContent = "Descargar";
                    descargarButton.setAttribute("dataSoat", JSON.stringify(soat));

                    descargarButton.addEventListener("click", function (event) {
                         const soatData = JSON.parse(event.target.getAttribute("dataSoat"));
                         generarPDF(soatData);
                    });
                    soatDiv.appendChild(descargarButton);
                    soatContainer.appendChild(soatDiv);
                }
            });
        })
        .catch((error) => {
            alert("Ha ocurrido un error de comunicación con el servidor listar SOAT");
            console.error(error);
        });
}

/*---------------------------------------------------------------------------------------------------------CAROUSEL-*/

const carousel = document.querySelector(".info-productos-wrapper-carousel"),
    firstitem = carousel.querySelectorAll(".wrapper-carousel-item")[0],
    arrowIcons = document.querySelectorAll(".info-productos-wrapper i");

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;

const showHideIcons = () => {
    // showing and hiding prev/next icon according to carousel scroll left value
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
}

arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        let firstitemWidth = firstitem.clientWidth + 14; // getting first item width & adding 14 margin value
        // if clicked icon is left, reduce width value from the carousel scroll left else add to it
        carousel.scrollLeft += icon.id == "left" ? -firstitemWidth : firstitemWidth;
        setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
    });
});

const autoSlide = () => {
    // if there is no item left to scroll then return from here
    if(carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 || carousel.scrollLeft <= 0) return;

    positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
    let firstitemWidth = firstitem.clientWidth + 14;
    // getting difference value that needs to add or reduce from carousel left to take middle item center
    let valDifference = firstitemWidth - positionDiff;

    if(carousel.scrollLeft > prevScrollLeft) { // if user is scrolling to the right
        return carousel.scrollLeft += positionDiff > firstitemWidth / 3 ? valDifference : -positionDiff;
    }
    // if user is scrolling to the left
    carousel.scrollLeft -= positionDiff > firstitemWidth / 3 ? valDifference : -positionDiff;
}

const dragStart = (e) => {
    // updatating global variables value on mouse down event
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    // scrolling itemes/carousel to left according to mouse pointer
    if(!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
}

const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");

    if(!isDragging) return;
    isDragging = false;
    autoSlide();
}

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);

/*-------------------------------------------------------------------------------------------------------GENERAR PDF-*/

async function generarPDF(soatData) {
    // Extraigo datos necesarios para el pdf
    const {
        fidPlanSoat: { cobertura, precio, nombrePlan },
        fidPoliza: {
            fidMoneda: { abreviatura },
            fidVehiculo: {
                fidTipoUso: { nombreTipoUso },
                fidModelo: {
                    fidMarcaVehiculo: {marca},
                    modelo,
                },
                fidPersona: {
                    nombre,
                    apellidoPaterno,
                    apellidoMaterno,
                    numeroDocumento,
                    fidTipoDocumento: {nombre: nombreTipoDocumento},
                    email,
                },
                placa,
                serie,
            },
            precioBase,
            fechaVigenciaDesde,
            fechaVigenciaFin,
        },
    } = soatData;

    let placaFormateada = placa.substring(0, 3) + "-" + placa.substring(3);
    const imageURL = 'public/resources/logos/logo-transparent-back.png';
    const imageDataURL = await getImageDataURL(imageURL);
    const fechaVigenciaDesdeConvertida = new Date(fechaVigenciaDesde).toLocaleDateString('es-ES');
    const fechaVigenciaFinConvertida = new Date(fechaVigenciaFin).toLocaleDateString('es-ES');

    // contenido del PDF
    const content = [

        // Título
        { text: 'Detalle SOAT', style: 'header' },

        // Logo
        { image: imageDataURL, width: 140, alignment: 'center',
            margin: [5, 5] },

        // Separación notable
        { text: '', margin: [0, 0, 0, 20] },

        // VIGENCIA DE LA PÓLIZA
        { text: 'VIGENCIA DE LA PÓLIZA', style: 'subheader' },
        { text: 'Desde', style: 'subtitle' },
        { text: fechaVigenciaDesdeConvertida },
        { text: 'Hasta', style: 'subtitle' },
        { text: fechaVigenciaFinConvertida, margin: [0, 0, 0, 20] },

        // PLAN SOAT
        { text: 'PLAN SOAT', style: 'subheader' },
        { text: 'Plan Escogido', style: 'subtitle' },
        { text: nombrePlan },
        { text: 'Precio', style: 'subtitle' },
        { text: `${precio} ${abreviatura}` },
        { text: 'Cobertura', style: 'subtitle' },
        { text: `${cobertura} ${abreviatura}`, margin: [0, 0, 0, 20] },

        // VEHÍCULO ASEGURADO
        { text: 'VEHÍCULO ASEGURADO', style: 'subheader' },
        { text: 'Marca', style: 'subtitle' },
        { text: marca },
        { text: 'Modelo', style: 'subtitle' },
        { text: modelo },
        { text: 'Placa', style: 'subtitle' },
        { text: placaFormateada },
        { text: 'Serie', style: 'subtitle' },
        { text: serie },
        { text: 'Uso', style: 'subtitle' },
        { text: nombreTipoUso, margin: [0, 0, 0, 20] },

        // CONTRATANTE/ASEGURADO
        { text: 'CONTRATANTE/ASEGURADO', style: 'subheader' },
        { text: 'Nombre', style: 'subtitle' },
        { text: nombre },
        { text: 'Apellidos', style: 'subtitle' },
        { text: `${apellidoPaterno} ${apellidoMaterno}` },
        { text: 'Documento', style: 'subtitle' },
        { text: `${nombreTipoDocumento} ${numeroDocumento}` },
    ];

    // Definir los estilos del PDF
    const styles = {
        header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10],
        },
        subheader: {
            fontSize: 15,
            bold: true,
            margin: [0, 10, 0, 5],
            color: '#122757',
        },
        subtitle: {
            fontSize: 14,
            bold: true,
            margin: [0, 0, 0, 3],
        },
    };

    // Definir el documento PDF
    const docDefinition = {
        content,
        styles,
        pageMargins: [80, 40, 80, 40],
    };

    // Genero el PDF
    const nombreArchivo = `${placaFormateada}_SOAT.pdf`;
    pdfMake.createPdf(docDefinition).download(nombreArchivo);
}

function getImageDataURL(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
}