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

function login() {
  const username = document.getElementById("Username").value.trim();
  const password = document.getElementById("password").value.trim();
  // let securePassword = protectPassword(password);

  fetch(
    "https://script.google.com/macros/s/AKfycbw_hRF19adLanumubBdH4RUiQYwulbkozvxx22JjJJgt8rpXyN6tR7JtcmcLIZbXgm5/exec",
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
        window.location.href = "dashboard.html";
      }
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
      showToast("error", error.message);
    });
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
