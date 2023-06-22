const usuarioJSON = localStorage.getItem("userCliente");
const usuario = JSON.parse(usuarioJSON);
/*
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
*/
loadPlans();
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
                const soatDiv = document.createElement("div");
                soatDiv.classList.add("wrapper-carousel-item");

                const nombreSoat = document.createElement("h2");
                nombreSoat.innerText = `${soat.NOMBRESOAT}`;
                soatDiv.appendChild(nombreSoat);

                const placaSoat = document.createElement("p");
                placaSoat.innerText = `${soat.PLACA}`;
                soatDiv.appendChild(placaSoat);

                const vigenciaSoat = document.createElement("p");
                vigenciaSoat.innerText = `Vigencia hasta ${soat.VIGENCIA}`;
                soatDiv.appendChild(vigenciaSoat);

                const descargarButton = document.createElement("button");
                descargarButton.type = "button";
                descargarButton.classList.add("button-red");
                descargarButton.textContent = "Descargar";
                descargarButton.setAttribute("dataSoat", JSON.stringify(soat));

                descargarButton.addEventListener("click", function (event) {
                    // const soatData = JSON.parse(event.target.getAttribute("data-soat"));
                    // generarPDF(soatData);
                });
                soatDiv.appendChild(descargarButton);

                soatContainer.appendChild(soatDiv);
            });
        })
        .catch((error) => {
            alert("Ha ocurrido un error de comunicación con el servidor listar SOAT");
            console.error(error);
        });
}


const carousel = document.querySelector(".info-productos-wrapper-carousel"),
    firstitem = carousel.querySelectorAll(".wrapper-carousel-item")[0],
    arrowIcons = document.querySelectorAll(".info-productos-wrapper i");

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff;

const showHideIcons = () => {

    let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
}

arrowIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        let firstitemWidth = firstitem.clientWidth + 14;

        carousel.scrollLeft += icon.id == "left" ? -firstitemWidth : firstitemWidth;
        setTimeout(() => showHideIcons(), 60);
    });
});

const autoSlide = () => {
    // si no hay itema  la izquierda termina
    if(carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 || carousel.scrollLeft <= 0) return;

    positionDiff = Math.abs(positionDiff); // haciendo la diferencia de posicion positiva
    let firstitemWidth = firstitem.clientWidth + 14;
    // la diferencia de valor
    let valDifference = firstitemWidth - positionDiff;

    if(carousel.scrollLeft > prevScrollLeft) { // si el usuario hace scroll a la derecha
        return carousel.scrollLeft += positionDiff > firstitemWidth / 3 ? valDifference : -positionDiff;
    }
    // si el usuario hace scroll a la izquierda
    carousel.scrollLeft -= positionDiff > firstitemWidth / 3 ? valDifference : -positionDiff;
}

const dragStart = (e) => {
    // actualiza variables globales
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    // hace el scroll
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

/*--------------------------------------------------------------------------------------------------------*/

function generarPDF(soatData) {
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



    // contenido del PDF
    const content = [
        // Título
        { text: 'SOAT', style: 'header' },

        // Compañía de seguros
        { text: 'Compañía de seguros: Union Seguros', margin: [0, 20, 0, 10] },

        // Separación notable
        { text: '', margin: [0, 0, 0, 20] },

        // VIGENCIA DE LA PÓLIZA
        { text: 'VIGENCIA DE LA PÓLIZA', style: 'subheader' },
        { text: 'Desde', style: 'subsubtitle' },
        { text: fechaVigenciaDesde },
        { text: 'Hasta', style: 'subsubtitle' },
        { text: fechaVigenciaFin, margin: [0, 0, 0, 20] },

        // PLAN SOAT
        { text: 'PLAN SOAT', style: 'subheader' },
        { text: 'Plan Escogido', style: 'subtitle' },
        { text: nombrePlan },
        { text: 'Precio', style: 'subtitle' },
        { text: `${precio}${abreviatura}` },
        { text: 'Cobertura', style: 'subtitle' },
        { text: cobertura, margin: [0, 0, 0, 20] },

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
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5],
        },
        subtitle: {
            fontSize: 12,
            bold: true,
            margin: [0, 0, 0, 3],
        },
        subsubtitle: {
            fontSize: 10,
            bold: true,
            margin: [0, 0, 0, 2],
        },
    };

    // Definir el documento PDF
    const docDefinition = {
        content,
        styles,
    };

    // Genero el PDF
    const nombreArchivo = `${serie}_SOAT.pdf`;
    pdfMake.createPdf(docDefinition).download(nombreArchivo);
}
















