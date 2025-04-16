import { STAMP_STYLES } from "../data/stampStyles.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5oH3ySCY4b1Q_lbzqDBGn3vZnxI3fzA",
  authDomain: "no1sevents-hanami.firebaseapp.com",
  databaseURL: "https://no1sevents-hanami-default-rtdb.firebaseio.com",
  projectId: "no1sevents-hanami",
  storageBucket: "no1sevents-hanami.appspot.com",
  messagingSenderId: "125275181215",
  appId: "1:125275181215:web:6e1720d3412e8b18c6ab2a"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.app().storage("no1sevents-hanami.firebasestorage.app");
const db = firebase.database();
const chatRef = db.ref("chat");

const chatMessages = document.getElementById("chatMessages");
const input = document.getElementById("chatInput");
const imageInput = document.getElementById("imageInput");

let selectedImageFile = null;

// 画像読み込み用
imageInput.addEventListener("change", (event) => {
  selectedImageFile = event.target.files[0];

  if (selectedImageFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById("imagePreview").src = e.target.result;
      document.getElementById("imagePreviewContainer").classList.remove("hidden");
    };
    reader.readAsDataURL(selectedImageFile);
  } else {
    clearImagePreview();
  }
});

// プレビュー非表示
document.getElementById("cancelPreview").addEventListener("click", () => {
  selectedImageFile = null;
  imageInput.value = "";
  clearImagePreview();
});

function clearImagePreview() {
  document.getElementById("imagePreview").src = "";
  document.getElementById("imagePreviewContainer").classList.add("hidden");
}

// 送信
async function sendMessage() {
  const text = input.value.trim();

  if (text !== "") {
    await chatRef.push({
      text: text,
      timestamp: Date.now()
    });
    input.value = "";
  }

  if (selectedImageFile) {
    const file = selectedImageFile;
    const storageRef = storage.ref("chat-images/" + Date.now() + "_" + file.name);
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();

    await chatRef.push({
      imageUrl: url,
      timestamp: Date.now()
    });

    // 入力クリア
    clearImagePreview();
    selectedImageFile = null;
    imageInput.value = "";
  }
}

document.getElementById("sendButton").addEventListener("click", sendMessage);

/*
受信（リアルタイム）
*/
chatRef.on("child_added", (snapshot) => {
  const msg = snapshot.val();
  const div = document.createElement("div");
  div.className = "chat-message";
  div.dataset.id = snapshot.key;

  if (msg.deleted) {
    div.textContent = "このメッセージは削除されました";
  } else {
    if (msg.text) {
      const text = document.createElement("p");
      text.textContent = msg.text;
      div.appendChild(text);
    }

    if (msg.imageUrl) {
      const img = document.createElement("img");
      img.src = msg.imageUrl;
      img.style.maxWidth = "100%";
      div.appendChild(img);
    }

    if (msg.stampId && STAMP_STYLES[msg.stampId]) {
      const style = STAMP_STYLES[msg.stampId];
      const stampDiv = document.createElement("div");
      stampDiv.className = "stamp";
      stampDiv.style.backgroundImage = `url(${style.bg})`;
      stampDiv.style.backgroundPosition = style.pos;
      stampDiv.style.backgroundSize = style.size;
      div.appendChild(stampDiv);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.className = "delete-button";
    deleteBtn.onclick = () => {
      const isImage = !!msg.imageUrl;

      showModal(
        isImage ? "この画像を削除しますか？" : "このメッセージを削除しますか？",
        [
          {
            label: "はい",
            className: "confirm",
            onClick: () => {
              if (isImage) {
                showModal("削除方法を選んでください", [
                  {
                    label: "論理削除",
                    className: "confirm",
                    onClick: () => {
                      chatRef.child(snapshot.key).update({ deleted: true });
                    }
                  },
                  {
                    label: "物理削除",
                    className: "confirm",
                    onClick: async () => {
                      const fileRef = firebase.storage().refFromURL(msg.imageUrl);
                      await fileRef.delete();
                      chatRef.child(snapshot.key).update({ deleted: true });
                    }
                  },
                  {
                    label: "キャンセル",
                    className: "cancel",
                    onClick: () => {}
                  }
                ]);
              } else {
                chatRef.child(snapshot.key).update({ deleted: true });
              }
            }
          },
          {
            label: "いいえ",
            className: "cancel",
            onClick: () => {}
          }
        ]
      );
    };

    div.appendChild(deleteBtn);
  }

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// チャット内容表示
chatRef.on("child_changed", (snapshot) => {
  const msg = snapshot.val();
  const key = snapshot.key;

  const existingDiv = document.querySelector(`[data-id="${key}"]`);
  if (!existingDiv) return;

  existingDiv.innerHTML = "";
  existingDiv.className = "chat-message";

  if (msg.deleted) {
    existingDiv.textContent = "このメッセージは削除されました";
  } else {
    if (msg.text) {
      const text = document.createElement("p");
      text.textContent = msg.text;
      existingDiv.appendChild(text);
    }

    if (msg.imageUrl) {
      const img = document.createElement("img");
      img.src = msg.imageUrl;
      img.style.maxWidth = "100%";
      existingDiv.appendChild(img);
    }

    if (msg.stampId && STAMP_STYLES[msg.stampId]) {
      const style = STAMP_STYLES[msg.stampId];
      const stampDiv = document.createElement("div");
      stampDiv.className = "stamp";
      stampDiv.style.backgroundImage = `url(${style.bg})`;
      stampDiv.style.backgroundPosition = style.pos;
      stampDiv.style.backgroundSize = style.size;
      existingDiv.appendChild(stampDiv);
    }
  }
});

// モーダル表示
function showModal(message, buttons = []) {
  const overlay = document.getElementById("modalOverlay");
  const msg = document.getElementById("modalMessage");
  const btns = document.getElementById("modalButtons");

  msg.textContent = message;
  btns.innerHTML = "";

  buttons.forEach(({ label, className, onClick }) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = className;
    btn.onclick = () => {
      overlay.classList.add("hidden");
      onClick();
    };
    btns.appendChild(btn);
  });

  overlay.classList.remove("hidden");
}

/*
スタンプ用
*/
const stampBtn = document.getElementById("stampButton");
const stampPanel = document.getElementById("stampPanel");

stampBtn.addEventListener("click", () => {
  stampPanel.classList.toggle("hidden");
});

document.querySelectorAll("#stampPanel .stamp").forEach((img) => {
  img.addEventListener("click", () => {
    const stampId = img.dataset.stampid;
    if (!stampId) return;

    chatRef.push({
      stampId: stampId,
      timestamp: Date.now()
    });

    stampPanel.classList.add("hidden");
  });
});