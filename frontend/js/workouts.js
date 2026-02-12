if (!requireAuth()) {
  // redirect handled
}

document.addEventListener("DOMContentLoaded", loadWorkouts);

async function loadWorkouts() {
  try {
    var workouts = await apiRequest("/workouts");
    renderWorkouts(workouts);
  } catch (err) {
    showToast(err.message, "error");
  }
}

function renderWorkouts(workouts) {
  var table = document.getElementById("workoutsTable");
  var empty = document.getElementById("workoutsEmpty");
  var tbody = document.getElementById("workoutsBody");

  if (workouts.length === 0) {
    table.style.display = "none";
    empty.style.display = "block";
    return;
  }

  table.style.display = "table";
  empty.style.display = "none";

  var html = "";
  workouts.forEach(function (w) {
    html +=
      "<tr>" +
      "<td><strong>" + w.title + "</strong>" +
      (w.description ? '<br><small class="text-muted">' + w.description + "</small>" : "") +
      "</td>" +
      "<td>" + w.type + "</td>" +
      "<td>" + w.duration + " min</td>" +
      "<td>" + w.caloriesBurned + "</td>" +
      "<td>" + formatDate(w.date) + "</td>" +
      "<td>" + getStatusBadge(w.status) + "</td>" +
      "<td>" +
      '<div class="btn-group btn-group-sm">' +
      '<button class="btn btn-outline-primary" onclick="editWorkout(\'' + w._id + "')\"><i class=\"bi bi-pencil\"></i></button>" +
      '<button class="btn btn-outline-danger" onclick="deleteWorkout(\'' + w._id + "')\"><i class=\"bi bi-trash\"></i></button>" +
      "</div>" +
      "</td>" +
      "</tr>";
  });
  tbody.innerHTML = html;
}

function openWorkoutModal(data) {
  document.getElementById("workoutId").value = data ? data._id : "";
  document.getElementById("workoutTitle").value = data ? data.title : "";
  document.getElementById("workoutDescription").value = data ? data.description : "";
  document.getElementById("workoutType").value = data ? data.type : "cardio";
  document.getElementById("workoutStatus").value = data ? data.status : "planned";
  document.getElementById("workoutDuration").value = data ? data.duration : "";
  document.getElementById("workoutCalories").value = data ? data.caloriesBurned : 0;
  document.getElementById("workoutDate").value = data ? formatDateForInput(data.date) : formatDateForInput(new Date());
  document.getElementById("workoutModalTitle").textContent = data ? "Edit Workout" : "Add Workout";

  var modal = new bootstrap.Modal(document.getElementById("workoutModal"));
  modal.show();
}

async function editWorkout(id) {
  try {
    var data = await apiRequest("/workouts/" + id);
    openWorkoutModal(data);
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deleteWorkout(id) {
  if (!confirm("Delete this workout?")) return;
  try {
    await apiRequest("/workouts/" + id, "DELETE");
    showToast("Workout deleted.");
    loadWorkouts();
  } catch (err) {
    showToast(err.message, "error");
  }
}

document.getElementById("workoutForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  var id = document.getElementById("workoutId").value;
  var body = {
    title: document.getElementById("workoutTitle").value,
    description: document.getElementById("workoutDescription").value,
    type: document.getElementById("workoutType").value,
    status: document.getElementById("workoutStatus").value,
    duration: Number(document.getElementById("workoutDuration").value),
    caloriesBurned: Number(document.getElementById("workoutCalories").value),
    date: document.getElementById("workoutDate").value,
  };

  try {
    if (id) {
      await apiRequest("/workouts/" + id, "PUT", body);
      showToast("Workout updated.");
    } else {
      await apiRequest("/workouts", "POST", body);
      showToast("Workout created.");
    }
    bootstrap.Modal.getInstance(document.getElementById("workoutModal")).hide();
    loadWorkouts();
  } catch (err) {
    showToast(err.message, "error");
  }
});
