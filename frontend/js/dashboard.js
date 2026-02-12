// ===== Auth Guard =====
if (!requireAuth()) {
  // redirect handled in requireAuth
}

// ===== Load Dashboard Data =====
document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {
  try {
    var workouts = await apiRequest("/workouts");
    var exercises = await apiRequest("/exercises");
    var goals = await apiRequest("/goals");
    var progress = await apiRequest("/progress");

    // Update stats
    document.getElementById("workoutCount").textContent = workouts.length;
    document.getElementById("exerciseCount").textContent = exercises.length;

    var activeGoals = goals.filter(function (g) {
      return g.status === "active";
    });
    document.getElementById("goalCount").textContent = activeGoals.length;
    document.getElementById("progressCount").textContent = progress.length;

    // Render recent items
    renderRecentWorkouts(workouts.slice(0, 5));
    renderRecentExercises(exercises.slice(0, 5));
    renderActiveGoals(activeGoals.slice(0, 5));
    renderRecentProgress(progress.slice(0, 5));
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ===== Render Recent Workouts =====
function renderRecentWorkouts(workouts) {
  var container = document.getElementById("recentWorkouts");

  if (workouts.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="bi bi-activity"></i><p>No workouts yet.</p></div>';
    return;
  }

  var html = '<div class="list-group list-group-flush">';
  workouts.forEach(function (w) {
    html +=
      '<div class="list-group-item d-flex justify-content-between align-items-center">' +
      "<div>" +
      '<strong>' + w.title + "</strong>" +
      '<br><small class="text-muted">' + w.type + " &bull; " + w.duration + " min &bull; " + formatDate(w.date) + "</small>" +
      "</div>" +
      getStatusBadge(w.status) +
      "</div>";
  });
  html += "</div>";
  container.innerHTML = html;
}

// ===== Render Recent Exercises =====
function renderRecentExercises(exercises) {
  var container = document.getElementById("recentExercises");

  if (exercises.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="bi bi-list-check"></i><p>No exercises logged.</p></div>';
    return;
  }

  var html = '<div class="list-group list-group-flush">';
  exercises.forEach(function (ex) {
    var detail = "";
    if (ex.sets > 0 || ex.reps > 0) {
      detail = ex.sets + " sets x " + ex.reps + " reps";
      if (ex.weight > 0) detail += " @ " + ex.weight + "kg";
    } else if (ex.duration > 0) {
      detail = ex.duration + " min";
    }

    html +=
      '<div class="list-group-item d-flex justify-content-between align-items-center">' +
      "<div>" +
      "<strong>" + ex.name + "</strong>" +
      '<br><small class="text-muted">' + ex.category + " &bull; " + detail + " &bull; " + formatDate(ex.date) + "</small>" +
      "</div>" +
      '<div class="btn-group btn-group-sm">' +
      '<button class="btn btn-outline-primary" onclick="editExercise(\'' + ex._id + "')\" title=\"Edit\"><i class=\"bi bi-pencil\"></i></button>" +
      '<button class="btn btn-outline-danger" onclick="deleteExercise(\'' + ex._id + "')\" title=\"Delete\"><i class=\"bi bi-trash\"></i></button>" +
      "</div>" +
      "</div>";
  });
  html += "</div>";
  container.innerHTML = html;
}

// ===== Render Active Goals =====
function renderActiveGoals(goals) {
  var container = document.getElementById("activeGoals");

  if (goals.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="bi bi-bullseye"></i><p>No active goals.</p></div>';
    return;
  }

  var html = '<div class="list-group list-group-flush">';
  goals.forEach(function (g) {
    var progress = g.targetValue > 0 ? Math.round((g.currentValue / g.targetValue) * 100) : 0;
    if (progress > 100) progress = 100;

    html +=
      '<div class="list-group-item">' +
      '<div class="d-flex justify-content-between align-items-center mb-1">' +
      "<div><strong>" + g.title + "</strong></div>" +
      '<div class="btn-group btn-group-sm">' +
      '<button class="btn btn-outline-primary" onclick="editGoal(\'' + g._id + "')\" title=\"Edit\"><i class=\"bi bi-pencil\"></i></button>" +
      '<button class="btn btn-outline-danger" onclick="deleteGoal(\'' + g._id + "')\" title=\"Delete\"><i class=\"bi bi-trash\"></i></button>" +
      "</div>" +
      "</div>" +
      '<small class="text-muted">' + g.currentValue + " / " + g.targetValue + " " + g.unit + " &bull; Due: " + formatDate(g.deadline) + "</small>" +
      '<div class="progress mt-1" style="height: 6px">' +
      '<div class="progress-bar" style="width: ' + progress + '%"></div>' +
      "</div>" +
      "</div>";
  });
  html += "</div>";
  container.innerHTML = html;
}

// ===== Render Recent Progress =====
function renderRecentProgress(entries) {
  var container = document.getElementById("recentProgress");

  if (entries.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="bi bi-graph-up-arrow"></i><p>No progress entries.</p></div>';
    return;
  }

  var html = '<div class="list-group list-group-flush">';
  entries.forEach(function (p) {
    var details = [];
    if (p.weight) details.push(p.weight + " kg");
    if (p.bodyFat) details.push(p.bodyFat + "% body fat");
    details.push("Mood: " + p.mood);

    html +=
      '<div class="list-group-item d-flex justify-content-between align-items-center">' +
      "<div>" +
      "<strong>" + formatDate(p.date) + "</strong>" +
      '<br><small class="text-muted">' + details.join(" &bull; ") + "</small>" +
      (p.notes ? '<br><small class="text-muted"><em>' + p.notes + "</em></small>" : "") +
      "</div>" +
      '<div class="btn-group btn-group-sm">' +
      '<button class="btn btn-outline-primary" onclick="editProgress(\'' + p._id + "')\" title=\"Edit\"><i class=\"bi bi-pencil\"></i></button>" +
      '<button class="btn btn-outline-danger" onclick="deleteProgressEntry(\'' + p._id + "')\" title=\"Delete\"><i class=\"bi bi-trash\"></i></button>" +
      "</div>" +
      "</div>";
  });
  html += "</div>";
  container.innerHTML = html;
}

// ===== Exercise CRUD =====
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

async function editExercise(id) {
  try {
    var data = await apiRequest("/exercises/" + id);
    openExerciseModal(data);
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deleteExercise(id) {
  if (!confirm("Delete this exercise?")) return;
  try {
    await apiRequest("/exercises/" + id, "DELETE");
    showToast("Exercise deleted.");
    loadDashboard();
  } catch (err) {
    showToast(err.message, "error");
  }
}

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
    loadDashboard();
  } catch (err) {
    showToast(err.message, "error");
  }
});

// ===== Goal CRUD =====
function openGoalModal(data) {
  document.getElementById("goalId").value = data ? data._id : "";
  document.getElementById("goalTitle").value = data ? data.title : "";
  document.getElementById("goalDescription").value = data ? data.description : "";
  document.getElementById("goalTarget").value = data ? data.targetValue : "";
  document.getElementById("goalCurrent").value = data ? data.currentValue : 0;
  document.getElementById("goalUnit").value = data ? data.unit : "";
  document.getElementById("goalDeadline").value = data ? formatDateForInput(data.deadline) : "";
  document.getElementById("goalStatus").value = data ? data.status : "active";
  document.getElementById("goalModalTitle").textContent = data ? "Edit Goal" : "Add Goal";

  var modal = new bootstrap.Modal(document.getElementById("goalModal"));
  modal.show();
}

async function editGoal(id) {
  try {
    var data = await apiRequest("/goals/" + id);
    openGoalModal(data);
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deleteGoal(id) {
  if (!confirm("Delete this goal?")) return;
  try {
    await apiRequest("/goals/" + id, "DELETE");
    showToast("Goal deleted.");
    loadDashboard();
  } catch (err) {
    showToast(err.message, "error");
  }
}

document.getElementById("goalForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  var id = document.getElementById("goalId").value;
  var body = {
    title: document.getElementById("goalTitle").value,
    description: document.getElementById("goalDescription").value,
    targetValue: Number(document.getElementById("goalTarget").value),
    currentValue: Number(document.getElementById("goalCurrent").value),
    unit: document.getElementById("goalUnit").value,
    deadline: document.getElementById("goalDeadline").value,
    status: document.getElementById("goalStatus").value,
  };

  try {
    if (id) {
      await apiRequest("/goals/" + id, "PUT", body);
      showToast("Goal updated.");
    } else {
      await apiRequest("/goals", "POST", body);
      showToast("Goal added.");
    }
    bootstrap.Modal.getInstance(document.getElementById("goalModal")).hide();
    loadDashboard();
  } catch (err) {
    showToast(err.message, "error");
  }
});

// ===== Progress CRUD =====
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

async function editProgress(id) {
  try {
    var data = await apiRequest("/progress/" + id);
    openProgressModal(data);
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deleteProgressEntry(id) {
  if (!confirm("Delete this progress entry?")) return;
  try {
    await apiRequest("/progress/" + id, "DELETE");
    showToast("Progress entry deleted.");
    loadDashboard();
  } catch (err) {
    showToast(err.message, "error");
  }
}

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
    loadDashboard();
  } catch (err) {
    showToast(err.message, "error");
  }
});
