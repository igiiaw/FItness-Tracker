// ===== Auth Guard =====
if (!requireAuth()) {
  // redirect handled in requireAuth
}

var allGoals = [];
var currentFilter = "all";

// ===== Load Goals =====
document.addEventListener("DOMContentLoaded", loadGoals);

async function loadGoals() {
  try {
    allGoals = await apiRequest("/goals");
    renderGoals();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ===== Filter Goals =====
function filterGoals(status, tabEl) {
  currentFilter = status;

  // Update active tab
  var tabs = document.querySelectorAll("#goalTabs .nav-link");
  tabs.forEach(function (t) { t.classList.remove("active"); });
  if (tabEl) tabEl.classList.add("active");

  renderGoals();
  return false;
}

// ===== Render Goals =====
function renderGoals() {
  var filtered = allGoals;
  if (currentFilter !== "all") {
    filtered = allGoals.filter(function (g) { return g.status === currentFilter; });
  }

  var table = document.getElementById("goalsTable");
  var empty = document.getElementById("goalsEmpty");
  var tbody = document.getElementById("goalsBody");

  if (filtered.length === 0) {
    table.style.display = "none";
    empty.style.display = "";
    return;
  }

  table.style.display = "";
  empty.style.display = "none";

  var html = "";
  filtered.forEach(function (g) {
    var progress = g.targetValue > 0 ? Math.round((g.currentValue / g.targetValue) * 100) : 0;
    if (progress > 100) progress = 100;

    html +=
      "<tr>" +
      "<td>" +
        "<strong>" + g.title + "</strong>" +
        (g.description ? '<br><small class="text-muted">' + g.description + "</small>" : "") +
      "</td>" +
      "<td style='min-width:120px'>" +
        '<div class="progress" style="height: 8px">' +
          '<div class="progress-bar" style="width: ' + progress + '%"></div>' +
        "</div>" +
        '<small class="text-muted">' + progress + "%</small>" +
      "</td>" +
      "<td>" + g.currentValue + " / " + g.targetValue + " " + g.unit + "</td>" +
      "<td>" + formatDate(g.deadline) + "</td>" +
      "<td>" + getStatusBadge(g.status) + "</td>" +
      "<td>" +
        '<div class="btn-group btn-group-sm">' +
          '<button class="btn btn-outline-primary" onclick="editGoal(\'' + g._id + "')\"><i class=\"bi bi-pencil\"></i></button>" +
          '<button class="btn btn-outline-danger" onclick="deleteGoal(\'' + g._id + "')\"><i class=\"bi bi-trash\"></i></button>" +
        "</div>" +
      "</td>" +
      "</tr>";
  });
  tbody.innerHTML = html;
}

// ===== Open Modal =====
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

// ===== Edit Goal =====
async function editGoal(id) {
  try {
    var data = await apiRequest("/goals/" + id);
    openGoalModal(data);
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ===== Delete Goal =====
async function deleteGoal(id) {
  if (!confirm("Delete this goal?")) return;
  try {
    await apiRequest("/goals/" + id, "DELETE");
    showToast("Goal deleted.");
    loadGoals();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ===== Form Submit =====
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
    loadGoals();
  } catch (err) {
    showToast(err.message, "error");
  }
});
