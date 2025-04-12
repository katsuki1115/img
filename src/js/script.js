const hotspots = document.querySelectorAll('.hotspot');
const modal = document.getElementById('infoModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.getElementById('closeModal');

hotspots.forEach(spot => {
  spot.addEventListener('click', () => {
    modalTitle.textContent = spot.dataset.title;
    modalDescription.textContent = spot.dataset.description;
    modal.style.display = 'flex';
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
