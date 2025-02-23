function searchVehicle() {
  let input = document.getElementById("searchInput").value.trim().toLowerCase();
  let detailsSections = document.querySelectorAll("details");

  detailsSections.forEach((details) => {
    let table = details.querySelector("table");
    if (!table) return;

    let rows = table.querySelectorAll("tbody tr");
    let found = false;

    rows.forEach((row) => {
      let text = row.textContent.trim().toLowerCase();
      if (text.includes(input)) {
        row.style.display = "";
        found = true;
      } else {
        row.style.display = "none";
      }
    });

    if (found) {
      details.setAttribute("open", true);
    } else {
      details.removeAttribute("open");
    }
  });
}

function registrationScreen() {
  window.location.href = "registration.html";
}

function dataTableScreen() {
  window.location.href = "dataTable.html";
}

function frequentlyMovingScree() {
  window.location.href = "moving.html";
}

function checkinScreen() {
  window.location.href = "checkin.html";
}

function checkoutScreen() {
  window.location.href = "checkout.html";
}

async function login() {
  const username = document.getElementById("Username").value.trim();
  const securePassword = document.getElementById("password").value.trim();
  let password = await protectPassword(securePassword);

  fetch(
    "https://script.google.com/macros/s/AKfycbzbNZUo06FEi_wBb9D8vywVXblYBHEzzNrk_qw-KmoTBbkRc4B4q1qIJriNVPHJ_YRF/exec",
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({ username, password }),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      showToast(result.status, result.message || "Unknown error occurred!");
      if (result.status === "success") {
        sessionStorage.setItem("username", result.username);
        sessionStorage.setItem("roleID", result.roleId);
        let roleID = sessionStorage.getItem("roleID");
        window.location.href =
          roleID === "Admin" ? "dashboard.html" : "user.html";
      }
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
      showToast("error", error.message);
    });
}
function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}
function validate(data) {
  return !!data && typeof data == "string" && data.trim().length > 0;
}

function registration() {
  let mobile = document.getElementById("mobile").value;
  let vehicle = document.getElementById("vehicle").value;
  if (!validate(mobile) && !validate(mobile)) {
    showToast("All fields are imprtant");
  } else {
  }
}

function previewAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("avatarPreview").src = e.target.result; // Update the avatar
    };
    reader.readAsDataURL(file);
  }
}

async function protectPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  console.log("🔐 Hashed Password:", hashHex);
  return hashHex;
}
document.addEventListener("DOMContentLoaded", function () {
  let username = sessionStorage.getItem("username");
  let roleID = sessionStorage.getItem("roleID");
  let currentPage = window.location.pathname.split("/").pop();
  if (!username || !roleID) {
    if (currentPage !== "index.html") {
      window.location.href = "index.html";
    }
    return;
  }
  let sessionElement = document.getElementById("session-name");
  if (sessionElement) {
    let now = new Date();
    let date = now.toLocaleDateString();
    let time = now.toLocaleTimeString();
    sessionElement.textContent = `${username} ${date} ${time}`;
  }
  const allowedPagesForUsers = [
    "checkin.html",
    "checkout.html",
    "registration.html",
    "user.html",
    "index.html",
    "dataTable.html",
  ];
  if (roleID !== "Admin" && !allowedPagesForUsers.includes(currentPage)) {
    alert("🚫 Access Denied! You are not authorized to view this page.");
    sessionStorage.clear();
    window.location.href = "index.html";
  }
});

function checkAccess() {
  let roleIds = sessionStorage.getItem("roleID");
  if (roleIds != "Admin") {
    window.location.href = "user.html";
  } else {
    window.location.href = "dashboard.html";
  }
}

function showToast(message, type = "error") {
  const toastContainer =
    document.querySelector(".toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast ${
    type === "success" ? "success-toast" : "error-toast"
  } show`;
  toast.innerHTML = `
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
        <div class="toast-progress"></div>
    `;

  toastContainer.appendChild(toast);
  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.remove();
  });
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement("div");
  container.className = "toast-container";
  document.body.appendChild(container);
  return container;
}

function validateData(data) {
  return !!data & (typeof data === "string") && data.trim().length > 0;
}

function registerVehicle() {
  let mobile = document.getElementById("mobile").value.trim();
  let vehicle = document.getElementById("vehicle").value.trim();

  if (!validate(mobile)) {
    showToast("⚠️ Invalid Mobile Number! Enter a valid 10-digit number.");
    return;
  }

  if (!validate(vehicle)) {
    showToast("⚠️ Invalid Vehicle Number! Enter a valid vehicle number.");
    return;
  }

  showToast("✅ Vehicle Registered Successfully!", "success");
}
