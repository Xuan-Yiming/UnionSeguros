const usuarioJSON = localStorage.getItem("userCliente");
const usuario = JSON.parse(usuarioJSON);
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
            data.forEach((soat) => {
                alert(soat.fidPoliza.fidVehiculo.placa);
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



















