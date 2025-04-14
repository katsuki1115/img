document.addEventListener("DOMContentLoaded", () => {
  const script = document.currentScript || document.querySelector('script[src$="footer.js"]');
  const path = script.dataset.footerPath;

  fetch(path)
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-container").innerHTML = data;
    })
    .catch(err => console.error("フッター読み込み失敗:", err));
});