// ===== Configuration =====
const API_URL = "https://fitness-tracker-api-fms7.onrender.com/api";

// ===== Token Management =====
function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function isLoggedIn() {
  return !!getToken();
}

function logout() {
  removeToken();
  window.location.href = "/index.html";
}

// ===== API Helper =====
async function apiRequest(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const options = { method, headers };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API_URL + endpoint, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// ===== Toast Notifications =====
function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "alert alert-" + (type === "error" ? "danger" : type) + " alert-dismissible fade show";
  toast.setAttribute("role", "alert");
  toast.innerHTML =
    message +
    '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, 3000);
}

// ===== Navigation Update =====
function updateNavbar() {
  var authNav = document.getElementById("authNav");
  var userNav = document.getElementById("userNav");

  if (!authNav || !userNav) return;

  if (isLoggedIn()) {
    var user = getUser();
    authNav.style.display = "none";
    userNav.style.display = "";

    var usernameSpan = document.getElementById("navUsername");
    if (usernameSpan && user) {
      usernameSpan.textContent = user.username;
    }

    // Show admin link if admin
    var adminLink = document.getElementById("adminNav");
    if (adminLink && user && user.role === "admin") {
      adminLink.style.display = "";
    }
  } else {
    authNav.style.display = "";
    userNav.style.display = "none";
  }
}

// ===== Auth Guard =====
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "/pages/login.html";
    return false;
  }
  return true;
}

// ===== Date Formatting =====
function formatDate(dateStr) {
  var date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateForInput(dateStr) {
  var date = new Date(dateStr);
  return date.toISOString().split("T")[0];
}

// ===== Badge Helper =====
function getStatusBadge(status) {
  var badgeClass = "badge-" + status;
  return '<span class="badge ' + badgeClass + '">' + status + "</span>";
}

// ===== Initialize navbar on every page =====
document.addEventListener("DOMContentLoaded", function () {
  updateNavbar();
});
