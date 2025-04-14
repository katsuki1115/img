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
      marker.classList.add("meeting-marker-first", "with-label");

      const label = document.createElement("div");
      label.classList.add("marker-label");
      label.textContent = "朝の集合場所";

      marker.appendChild(label);
      mapContainer.appendChild(marker);
      const wrapper = document.createElement("div");
      wrapper.classList.add("marker-wrapper");

      addButton.textContent = "次の集合場所を表示";
    } else if (markerState === 2) {
      marker = document.createElement("div");
      marker.classList.add("meeting-marker-second", "with-label");

      const label = document.createElement("div");
      label.classList.add("marker-label");
      label.textContent = "次の集合場所";

      marker.appendChild(label);
      mapContainer.appendChild(marker);
      const wrapper = document.createElement("div");
      wrapper.classList.add("marker-wrapper");

      addButton.textContent = "非表示";
    } else {
      addButton.textContent = "朝の集合場所を表示";
    }
  });
});