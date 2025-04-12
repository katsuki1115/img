const messages = [];
const chatBox = document.getElementById("chatMessages");
const input = document.getElementById("chatInput");

function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;
  
  messages.push(text);
  input.value = "";
  updateMessages();
}

function updateMessages() {
  chatBox.innerHTML = "";
  messages.forEach(msg => {
    const p = document.createElement("p");
    p.textContent = msg;
    chatBox.appendChild(p);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

const toggleBtn = document.getElementById("toggleChat");
const chatMessages = document.getElementById("chatMessages");

toggleBtn.addEventListener("click", () => {
  const isHidden = chatMessages.classList.toggle("hidden");
  toggleBtn.textContent = isHidden ? "▼ チャットを開く" : "▲ チャットを閉じる";
});
