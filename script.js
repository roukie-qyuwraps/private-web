const container = document.getElementById("agendaContainer");
const datePicker = document.getElementById("datePicker");

datePicker.valueAsDate = new Date();
loadAgenda();

datePicker.addEventListener("change", loadAgenda);

function getData() {
  return JSON.parse(localStorage.getItem("agendaData") || "{}");
}

function saveData(data) {
  localStorage.setItem("agendaData", JSON.stringify(data));
}

function loadAgenda() {
  container.innerHTML = "";
  const data = getData();
  const day = datePicker.value;
  (data[day] || []).forEach(item => createAgenda(item));
}

function addAgenda(item = { title: "", notes: "" }) {
  createAgenda(item);
}

function createAgenda(item) {
  const div = document.createElement("div");
  div.className = "agenda";

  div.innerHTML = `
    <input placeholder="Judul" value="${item.title}">
    <textarea placeholder="Catatan">${item.notes}</textarea>
    <button>Simpan</button>
  `;

  div.querySelector("button").onclick = () => {
    const data = getData();
    const day = datePicker.value;
    if (!data[day]) data[day] = [];

    data[day].push({
      title: div.querySelector("input").value,
      notes: div.querySelector("textarea").value
    });

    saveData(data);
    alert("Tersimpan");
    loadAgenda();
  };

  container.appendChild(div);
}

/* EXPORT */
function exportData() {
  const data = localStorage.getItem("agendaData");
  if (!data) return alert("Tidak ada data");

  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "agenda-backup.json";
  a.click();
}

/* IMPORT */
document.getElementById("importFile").addEventListener("change", e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("agendaData", reader.result);
    loadAgenda();
    alert("Data berhasil di-import");
  };
  reader.readAsText(file);
});
