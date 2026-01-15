function saveAgenda() {
  const date = document.getElementById("date").value;
  const title = document.getElementById("title").value;
  const note = document.getElementById("note").value;

  if (!date) {
    alert("Pilih tanggal dulu");
    return;
  }

  const data = { title, note };
  localStorage.setItem("agenda-" + date, JSON.stringify(data));

  alert("Tersimpan ✅");
}

function loadAgenda() {
  const date = document.getElementById("date").value;
  if (!date) return;

  const saved = localStorage.getItem("agenda-" + date);

  if (saved) {
    const data = JSON.parse(saved);
    document.getElementById("title").value = data.title || "";
    document.getElementById("note").value = data.note || "";
  } else {
    document.getElementById("title").value = "";
    document.getElementById("note").value = "";
  }
}
