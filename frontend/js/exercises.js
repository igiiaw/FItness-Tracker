// ===== Auth Guard =====
if (!requireAuth()) {
  // redirect handled in requireAuth
}

var allExercises = [];
var currentFilter = "all";

// ===== Load Exercises =====
document.addEventListener("DOMContentLoaded", loadExercises);

async function loadExercises() {
  try {
    allExercises = await apiRequest("/exercises");
    renderExercises();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ===== Filter Exercises =====
function filterExercises(category, tabEl) {
  currentFilter = category;

  var tabs = document.querySelectorAll("#exerciseTabs .nav-link");
  tabs.forEach(function (t) { t.classList.remove("active"); });
  if (tabEl) tabEl.classList.add("active");

  renderExercises();
  return false;
}

// ===== Render Exercises =====
function renderExercises() {
  var filtered = allExercises;
  if (currentFilter !== "all") {
    filtered = allExercises.filter(function (ex) { return ex.category === currentFilter; });
  }

  var table = document.getElementById("exercisesTable");
  var empty = document.getElementById("exercisesEmpty");
  var tbody = document.getElementById("exercisesBody");

  if (filtered.length === 0) {
    table.style.display = "none";
    empty.style.display = "";
    return;
  }

  table.style.display = "";
  empty.style.display = "none";

  var html = "";
  filtered.forEach(function (ex) {
    var setsReps = "--";
    if (ex.sets > 0 || ex.reps > 0) {
      setsReps = ex.sets + " x " + ex.reps;
    }

    html +=
      "<tr>" +
      "<td>" +
        "<strong>" + ex.name + "</strong>" +
        (ex.notes ? '<br><small class="text-muted">' + ex.notes + "</small>" : "") +
      "</td>" +
      "<td><span class='badge bg-secondary'>" + ex.category + "</span></td>" +
      "<td>" + setsReps + "</td>" +
      "<td>" + (ex.weight > 0 ? ex.weight : "--") + "</td>" +
      "<td>" + (ex.duration > 0 ? ex.duration : "--") + "</td>" +
      "<td>" + formatDate(ex.date) + "</td>" +
      "<td>" +
        '<div class="btn-group btn-group-sm">' +
          '<button class="btn btn-outline-primary" onclick="editExercise(\'' + ex._id + "')\"><i class=\"bi bi-pencil\"></i></button>" +
          '<button class="btn btn-outline-danger" onclick="deleteExercise(\'' + ex._id + "')\"><i class=\"bi bi-trash\"></i></button>" +
        "</div>" +
      "</td>" +
      "</tr>";
  });
  tbody.innerHTML = html;
}

// ===== Open Modal =====
function openExerciseModal(data) {
  document.getElementById("exerciseId").value = data ? data._id : "";
  document.getElementById("exerciseName").value = data ? data.name : "";
  document.getElementById("exerciseCategory").value = data ? data.category : "strength";
  document.getElementById("exerciseSets").value = data ? data.sets : 0;
  document.getElementById("exerciseReps").value = data ? data.reps : 0;
  document.getElementById("exerciseWeight").value = data ? data.weight : 0;
  document.getElementById("exerciseDuration").value = data ? data.duration : 0;
  document.getElementById("exerciseNotes").value = data ? data.notes : "";
  document.getElementById("exerciseModalTitle").textContent = data ? "Edit Exercise" : "Add Exercise";

  var modal = new bootstrap.Modal(document.getElementById("exerciseModal"));
  modal.show();
}

// ===== Edit Exercise =====
async function editExercise(id) {
  try {
    var data = await apiRequest("/exercises/" + id);
    openExerciseModal(data);
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ===== Delete Exercise =====
async function deleteExercise(id) {
  if (!confirm("Delete this exercise?")) return;
  try {
    await apiRequest("/exercises/" + id, "DELETE");
    showToast("Exercise deleted.");
    loadExercises();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ===== Form Submit =====
document.getElementById("exerciseForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  var id = document.getElementById("exerciseId").value;
  var body = {
    name: document.getElementById("exerciseName").value,
    category: document.getElementById("exerciseCategory").value,
    sets: Number(document.getElementById("exerciseSets").value),
    reps: Number(document.getElementById("exerciseReps").value),
    weight: Number(document.getElementById("exerciseWeight").value),
    duration: Number(document.getElementById("exerciseDuration").value),
    notes: document.getElementById("exerciseNotes").value,
  };

  try {
    if (id) {
      await apiRequest("/exercises/" + id, "PUT", body);
      showToast("Exercise updated.");
    } else {
      await apiRequest("/exercises", "POST", body);
      showToast("Exercise added.");
    }
    bootstrap.Modal.getInstance(document.getElementById("exerciseModal")).hide();
    loadExercises();
  } catch (err) {
    showToast(err.message, "error");
  }
});
