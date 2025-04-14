document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.querySelector(".map-container");
  const toggleHotspotsBtn = document.getElementById("toggleHotspotsBtn");

  let hotspotsVisible = false;
  let hotspotElements = [];

  const hotspotData = [
    { top: "40%", left: "50%", title: "中央広場", description: "ゆったりと花見が楽しめるスポットです。" },
    { top: "55%", left: "30%", title: "水回廊", description: "木陰でのんびりできる癒し空間。" },
    { top: "65%", left: "60%", title: "展望デッキ", description: "景色が最高！集合写真に◎" }
  ];

  toggleHotspotsBtn.addEventListener("click", () => {
    if (!hotspotsVisible) {
      // スポットを追加
      hotspotElements = hotspotData.map(data => {
        const el = document.createElement("div");
        el.classList.add("hotspot");
        el.style.top = data.top;
        el.style.left = data.left;
        el.dataset.title = data.title;
        el.dataset.description = data.description;
        el.addEventListener("click", () => {
          modalTitle.textContent = data.title;
          modalDescription.textContent = data.description;
          modal.style.display = 'flex';
        });
        mapContainer.appendChild(el);
        return el;
      });

      toggleHotspotsBtn.textContent = "おすすめスポットを非表示";
      hotspotsVisible = true;

    } else {
      // スポットを削除
      hotspotElements.forEach(el => el.remove());
      hotspotElements = [];
      toggleHotspotsBtn.textContent = "おすすめスポットを表示";
      hotspotsVisible = false;
    }
  });
});