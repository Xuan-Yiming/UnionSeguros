function openModal(config) {
    document.getElementById('modalOverlay').style.display = 'flex';
}

function closeModal(finalize) {
    if (finalize()) {
        document.getElementById('modalOverlay').style.display = 'none';
    }
}