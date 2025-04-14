const hotspots = document.querySelectorAll('.hotspot');
const modal = document.getElementById('infoModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.getElementById('closeModal');

// モーダル用
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

// マップ切り替え
document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".toggle-btn");

  toggleButtons.forEach(button => {
    const targetId = button.dataset.target;
    const panelToShow = document.getElementById(targetId);
    const panelToHide = document.getElementById(targetId === "schedulePanel" ? "mapPanel" : "schedulePanel");

    if (!panelToShow || !panelToHide) {
      console.error(`要素が見つかりません: #${targetId}`);
      return;
    }

    button.addEventListener("click", () => {
      const isOpen = panelToShow.classList.contains("open");

      panelToShow.classList.toggle("open", !isOpen);
      panelToHide.classList.toggle("open", isOpen);

      if (!isOpen) {
        button.textContent = "マップに戻る";
      } else {
        button.textContent = "スケジュールを確認する";
      }
    });
  });
});