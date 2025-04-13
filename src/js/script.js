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

// 星表示切り替え
document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.querySelector(".map-container");
  const addButton = document.getElementById("addMeetingSpotBtn");

  let marker = null;
  let markerState = 0;

  addButton.addEventListener("click", () => {
    if (marker) {
      marker.remove();
      marker = null;
    }

    markerState = (markerState + 1) % 3;

    if (markerState === 1) {
      marker = document.createElement("div");
      marker.classList.add("meeting-marker-first");
      mapContainer.appendChild(marker);
      addButton.textContent = "次の集合場所を表示";
    } else if (markerState === 2) {
      marker = document.createElement("div");
      marker.classList.add("meeting-marker-second");
      mapContainer.appendChild(marker);
      addButton.textContent = "非表示";
    } else {
      addButton.textContent = "朝の集合場所を表示";
    }
  });
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