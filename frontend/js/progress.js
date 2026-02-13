// ===== Auth Guard =====
if (!requireAuth()) {
  // redirect handled in requireAuth
}

// ===== Load Progress =====
document.addEventListener("DOMContentLoaded", loadProgress);

async function loadProgress() {
  try {
    var entries = await apiRequest("/progress");
    renderProgress(entries);
    renderSummary(entries);
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ===== Render Summary =====
function renderSummary(entries) {
  var summary = document.getElementById("progressSummary");

  if (entries.length === 0) {
    summary.style.display = "none";
    return;
  }

  summary.style.display = "";
  document.getElementById("totalEntries").textContent = entries.length;

  // Find latest entry with weight
  var latestWeight = "--";
  var latestBodyFat = "--";
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].weight && latestWeight === "--") {
      latestWeight = entries[i].weight;
    }
    if (entries[i].bodyFat && latestBodyFat === "--") {
      latestBodyFat = entries[i].bodyFat + "%";
    }
    if (latestWeight !== "--" && latestBodyFat !== "--") break;
  }

  document.getElementById("latestWeight").textContent = latestWeight;
  document.getElementById("latestBodyFat").textContent = latestBodyFat;
}

// ===== Render Progress Table =====
function renderProgress(entries) {
  var table = document.getElementById("progressTable");
  var empty = document.getElementById("progressEmpty");
  var tbody = document.getElementById("progressBody");

  if (entries.length === 0) {
    table.style.display = "none";
    empty.style.display = "";
    return;
  }

  table.style.display = "";
  empty.style.display = "none";

  var moodIcons = {
    great: '<span class="text-success"><i class="bi bi-emoji-laughing-fill"></i> Great</span>',
    good: '<span class="text-success"><i class="bi bi-emoji-smile-fill"></i> Good</span>',
    okay: '<span class="text-warning"><i class="bi bi-emoji-neutral-fill"></i> Okay</span>',
    bad: '<span class="text-danger"><i class="bi bi-emoji-frown-fill"></i> Bad</span>',
    terrible: '<span class="text-danger"><i class="bi bi-emoji-angry-fill"></i> Terrible</span>',
  };

  var html = "";
  entries.forEach(function (p) {
    html +=
      "<tr>" +
      "<td>" + formatDate(p.date) + "</td>" +
      "<td>" + (p.weight ? p.weight : "--") + "</td>" +
      "<td>" + (p.bodyFat ? p.bodyFat : "--") + "</td>" +
      "<td>" + (moodIcons[p.mood] || p.mood) + "</td>" +
      "<td>" + (p.notes ? '<small>' + p.notes + '</small>' : "--") + "</td>" +
      "<td>" +
        '<div class="btn-group btn-group-sm">' +
          '<button class="btn btn-outline-primary" onclick="editProgress(\'' + p._id + "')\"><i class=\"bi bi-pencil\"></i></button>" +
          '<button class="btn btn-outline-danger" onclick="deleteProgressEntry(\'' + p._id + "')\"><i class=\"bi bi-trash\"></i></button>" +
        "</div>" +
      "</td>" +
      "</tr>";
  });
  tbody.innerHTML = html;
}

// ===== Open Modal =====
function openProgressModal(data) {
  document.getElementById("progressId").value = data ? data._id : "";
  document.getElementById("progressWeight").value = data && data.weight ? data.weight : "";
  document.getElementById("progressBodyFat").value = data && data.bodyFat ? data.bodyFat : "";
  document.getElementById("progressMood").value = data ? data.mood : "okay";
  document.getElementById("progressNotes").value = data ? data.notes : "";
  document.getElementById("progressModalTitle").textContent = data ? "Edit Progress" : "Log Progress";

  var modal = new bootstrap.Modal(document.getElementById("progressModal"));
  modal.show();
}

// ===== Edit Progress =====
async function editProgress(id) {
  try {
    var data = await apiRequest("/progress/" + id);
    openProgressModal(data);
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ===== Delete Progress =====
async function deleteProgressEntry(id) {
  if (!confirm("Delete this progress entry?")) return;
  try {
    await apiRequest("/progress/" + id, "DELETE");
    showToast("Progress entry deleted.");
    loadProgress();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ===== Form Submit =====
document.getElementById("progressForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  var id = document.getElementById("progressId").value;
  var weightVal = document.getElementById("progressWeight").value;
  var bodyFatVal = document.getElementById("progressBodyFat").value;

  var body = {
    weight: weightVal ? Number(weightVal) : null,
    bodyFat: bodyFatVal ? Number(bodyFatVal) : null,
    mood: document.getElementById("progressMood").value,
    notes: document.getElementById("progressNotes").value,
  };

  try {
    if (id) {
      await apiRequest("/progress/" + id, "PUT", body);
      showToast("Progress updated.");
    } else {
      await apiRequest("/progress", "POST", body);
      showToast("Progress logged.");
    }
    bootstrap.Modal.getInstance(document.getElementById("progressModal")).hide();
    loadProgress();
  } catch (err) {
    showToast(err.message, "error");
  }
});
