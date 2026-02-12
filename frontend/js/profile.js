if (!requireAuth()) {
  // redirect handled
}

document.addEventListener("DOMContentLoaded", loadProfile);

async function loadProfile() {
  try {
    var user = await apiRequest("/users/profile");

    document.getElementById("profileAvatar").textContent = user.username
      .charAt(0)
      .toUpperCase();
    document.getElementById("profileName").textContent = user.username;
    document.getElementById("profileRole").textContent = user.role;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileUsername").value = user.username;
    document.getElementById("profileEmailInput").value = user.email;
    document.getElementById("profileAge").value = user.age || "";
    document.getElementById("profileWeight").value = user.weight || "";
    document.getElementById("profileHeight").value = user.height || "";
  } catch (err) {
    showToast(err.message, "error");
  }
}

document.getElementById("profileForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  var errorDiv = document.getElementById("profileError");
  var successDiv = document.getElementById("profileSuccess");
  errorDiv.style.display = "none";
  successDiv.style.display = "none";

  var ageVal = document.getElementById("profileAge").value;
  var weightVal = document.getElementById("profileWeight").value;
  var heightVal = document.getElementById("profileHeight").value;

  var body = {
    username: document.getElementById("profileUsername").value,
    email: document.getElementById("profileEmailInput").value,
    age: ageVal ? Number(ageVal) : null,
    weight: weightVal ? Number(weightVal) : null,
    height: heightVal ? Number(heightVal) : null,
  };

  try {
    var data = await apiRequest("/users/profile", "PUT", body);

    // Update local storage
    var storedUser = getUser();
    storedUser.username = data.user.username;
    storedUser.email = data.user.email;
    setUser(storedUser);

    successDiv.textContent = "Profile updated successfully!";
    successDiv.style.display = "block";
    updateNavbar();
    loadProfile();
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.style.display = "block";
  }
});
