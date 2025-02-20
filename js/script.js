function validateForm() {
  var mobile = document.getElementById("mobile").value.trim();
  var vehicle = document.getElementById("vehicle").value.trim();

  if (mobile === "" || vehicle === "") {
    showToast("error", "⚠️ All fields are mandatory!");
  } else {
    showToast("success", "✅ Vehicle Registration successful!");
  }
}

function showToast(type, message) {
  var toastContainer = document.querySelector(".toast-container");
  var toast = document.createElement("div");
  toast.classList.add("toast", type, "show");
  var text = document.createElement("span");
  text.innerText = message;
  var closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✖";
  closeBtn.classList.add("close-btn");
  closeBtn.onclick = function () {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  };
  var progressBar = document.createElement("div");
  progressBar.classList.add("progress-bar");
  toast.appendChild(text);
  toast.appendChild(closeBtn);
  toast.appendChild(progressBar);
  toastContainer.appendChild(toast);
  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function searchVehicle() {
  let input = document.getElementById("searchInput").value.trim().toLowerCase();
  let detailsSections = document.querySelectorAll("details");

  detailsSections.forEach((details) => {
    let table = details.querySelector("table");
    if (!table) return;

    let rows = table.querySelectorAll("tbody tr");
    let found = false;

    rows.forEach((row) => {
      let text = row.textContent.trim().toLowerCase(); // Use textContent and trim whitespace
      if (text.includes(input)) {
        row.style.display = ""; // Show matching row
        found = true;
      } else {
        row.style.display = "none"; // Hide non-matching rows
      }
    });

    // Open or close the <details> section based on search results
    if (found) {
      details.setAttribute("open", true);
    } else {
      details.removeAttribute("open");
    }
  });
}

function registrationScreen() {
  window.location.href = "/registration.html";
}

function dataTableScreen() {
  window.location.href = "/dataTable.html";
}

function frequentlyMovingScree() {
  window.location.href = "/moving.html";
}

function checkinScreen() {
  window.location.href = "checkin.html";
}

function checkoutScreen() {
  window.location.href = "checkout.html";
}

function logIn() {
  window.location.href = "dashboard.html";
}
