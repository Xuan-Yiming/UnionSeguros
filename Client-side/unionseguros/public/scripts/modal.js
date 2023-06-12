function openModal(config) {
    document.getElementById('modalOverlay').style.display = 'flex';
    config();
}

function closeModal(finalize) {
    if (finalize()) {
        document.getElementById('modalOverlay').style.display = 'none';
    }
}