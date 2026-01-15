const datePicker = document.getElementById("datePicker");
const container = document.getElementById("agendaContainer");
const addBtn = document.getElementById("addBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importInput = document.getElementById("importInput");

// set tanggal hari ini
datePicker.valueAsDate = new Date();

// ---------- STORAGE ----------
function getAllData() {
  return JSON.parse(localStorage.getItem("agendaData") || "{}");
}

function saveAllData(data) {
  localStorage.setItem("agendaData", JSON.stringify(data));
}

// ---------- LOAD ----------
function loadAgenda() {
  container.innerHTML = "";
  const data = getAllData();
  const date = datePicker.value;

  if (!data[date]) return;

  data[date].forEach(item => createBox(item));
}

// ---------- CREATE BOX ----------
function createBox(item = { title: "", notes: "" }) {
  const box = document.createElement("div");
  box.className = "agenda-box";

  box.innerHTML = `
    <input placeholder="Judul agenda" value="${item.title}">
    <textarea placeholder="Catatan / deskripsi panjang">${item.notes}</textarea>

    <div class="agenda-actions">
      <button class="saveBtn">Simpan</button>
      <button class="deleteBtn">Hapus</button>
    </div>
  `;

  box.querySelector(".saveBtn").onclick = () => {
    saveBox(box);
  };

  box.querySelector(".deleteBtn").onclick = () => {
    box.remove();
    saveCurrentDate();
  };

  container.appendChild(box);
}

// ---------- SAVE ----------
function saveBox(box) {
  saveCurrentDate();
  alert("Agenda tersimpan");
}

function saveCurrentDate() {
  const data = getAllData();
  const date = datePicker.value;

  data[date] = [];

  container.querySelectorAll(".agenda-box").forEach(box => {
    data[date].push({
      title: box.querySelector("input").value,
      notes: box.querySelector("textarea").value
    });
  });

  saveAllData(data);
}

// ---------- EVENTS ----------
addBtn.onclick = () => createBox();

datePicker.onchange = loadAgenda;

// ---------- EXPORT ----------
exportBtn.onclick = () => {
  const data = localStorage.getItem("agendaData");
  if (!data) return alert("Tidak ada data");

  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "agenda-backup.json";
  link.click();
};

// ---------- IMPORT ----------
importBtn.onclick = () => importInput.click();

importInput.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("agendaData", reader.result);
    loadAgenda();
    alert("Data berhasil di-import");
  };
  reader.readAsText(file);
};

// INIT
loadAgenda();
