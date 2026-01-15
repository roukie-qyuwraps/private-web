const STORAGE_KEY = "agendaData";

function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadAgendaDay() {
  const date = document.getElementById("date").value;
  const list = document.getElementById("agendaList");
  list.innerHTML = "";

  if (!date) return;

  const data = getData();
  const agendas = data[date] || [];

  agendas.forEach((item, index) => {
    list.appendChild(createCard(item.title, item.note, index));
  });
}

function addAgenda() {
  const list = document.getElementById("agendaList");
  list.appendChild(createCard("", "", null));
}

function createCard(title, note, index) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <input placeholder="Judul kegiatan" value="${title}">
    <textarea placeholder="Catatan kegiatan">${note}</textarea>
    <button>Simpan</button>
  `;

  div.querySelector("button").onclick = () => saveAgenda(div, index);
  return div;
}

function saveAgenda(card, index) {
  const date = document.getElementById("date").value;
  if (!date) return alert("Pilih tanggal dulu");

  const title = card.querySelector("input").value;
  const note = card.querySelector("textarea").value;

  const data = getData();
  if (!data[date]) data[date] = [];

  if (index !== null) {
    data[date][index] = { title, note };
  } else {
    data[date].push({ title, note });
  }

  saveData(data);
  loadAgendaDay();
}

function exportData() {
  const data = getData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "agenda-admin.json";
  a.click();
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    saveData(JSON.parse(ev.target.result));
    alert("Data di-import ✅");
    loadAgendaDay();
  };
  reader.readAsText(file);
}
