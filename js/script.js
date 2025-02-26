const apiUrl =
  "https://script.google.com/macros/s/AKfycbxIELBAA9gDQw_vgwhXJExriP23WeQ0S_DG0T2rOKvX1ernv4_Tz0gZCl-RWL5K3tjY/exec";
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
  const type = 1;
  let password = await protectPassword(securePassword);

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify({ username, password, type }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      showToast(result.status, result.message || "Unknown error occurred!");
      if (result.statusCode === 200) {
        sessionStorage.setItem("username", result.message);
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

let profilePic;
function previewAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      profilePic = e.target.result;
      document.getElementById("avatarPreview").src = profilePic;
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

  function updateSessionTime() {
    if (sessionElement) {
      let now = new Date();
      let date = now.toLocaleDateString();
      let time = now.toLocaleTimeString();
      sessionElement.textContent = `${username} ${date} ${time}`;
    }
  }

  // Initial time update
  updateSessionTime();

  // Update time every second
  setInterval(updateSessionTime, 1000);

  const allowedPagesForUsers = [
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

  if (!validate(profilePic)) {
    showToast("⚠️ Upload Profile Picture.");
    return;
  }
  if (!validate(mobile)) {
    showToast("⚠️ Invalid Mobile Number! Enter a valid 10-digit number.");
    return;
  }

  if (!validate(vehicle)) {
    showToast("⚠️ Invalid Vehicle Number! Enter a valid vehicle number.");
    return;
  }

  let = requestData = {
    mobile: mobile,
    vehicle: vehicle,
    profilePic: profilePic,
    type: 2,
  };

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.status === "success") {
        showToast("✅ Vehicle registered successfully!", "success");
        document.getElementById("mobile").value = "";
        document.getElementById("vehicle").value = "";
        document.getElementById("avatarPreview").src = "images/male.png";
      } else {
        showToast("❌" + data.message + "error");
        document.getElementById("mobile").value = "";
        document.getElementById("vehicle").value = "";
        document.getElementById("avatarPreview").src = "images/male.png";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showToast("❌ Server error! Please try again later.", "error");
    });
}

function generateVehicleTable(data) {
  let container = document.getElementById("vehicle-list");
  container.innerHTML = ""; // Clear previous content

  if (!data || !Array.isArray(data)) {
    console.error("Error: Data is not an array or is undefined", data);
    return;
  }

  let vehicleMap = groupRecordsByVehicle(data);

  Object.keys(vehicleMap).forEach((vehicle) => {
    let records = vehicleMap[vehicle];

    // Create <details> element
    let details = document.createElement("details");

    // Create <summary> element
    let summary = document.createElement("summary");
    summary.classList.add("vehicle-summary");

    // Vehicle title
    let vehicleTitle = document.createElement("span");
    vehicleTitle.textContent = vehicle;

    // Create action buttons and add to summary
    let actionsContainer = createActionButtons(vehicle);

    summary.appendChild(vehicleTitle);
    summary.appendChild(actionsContainer);
    details.appendChild(summary);

    // Create and populate the table
    let tableContainer = document.createElement("div");
    tableContainer.classList.add("table-container");
    let table = createVehicleTable(records);

    tableContainer.appendChild(table);
    details.appendChild(tableContainer);
    container.appendChild(details);
  });
}

// Function to group records by vehicle
function groupRecordsByVehicle(data) {
  let vehicleMap = {};
  data.forEach((record) => {
    if (!record.vehicle) {
      console.error("Error: Missing vehicle in", record);
      return;
    }
    if (!vehicleMap[record.vehicle]) {
      vehicleMap[record.vehicle] = [];
    }
    vehicleMap[record.vehicle].push(record);
  });
  return vehicleMap;
}

// Function to create Check-in and Check-out buttons
function createActionButtons(vehicle) {
  let actionsContainer = document.createElement("span");
  actionsContainer.classList.add("actions-container");

  let reloadButton = document.createElement("button");
  reloadButton.textContent = "Reload";
  reloadButton.classList.add("reload-btn");

  let checkInButton = document.createElement("button");
  checkInButton.textContent = "Check In";
  checkInButton.classList.add("check-in-btn");
  checkInButton.onclick = () => handleCheckIn(vehicle);

  let checkOutButton = document.createElement("button");
  checkOutButton.textContent = "Check Out";
  checkOutButton.classList.add("check-out-btn");
  checkOutButton.onclick = () => handleCheckOut(vehicle);

  actionsContainer.appendChild(reloadButton);
  actionsContainer.appendChild(checkInButton);
  actionsContainer.appendChild(checkOutButton);

  return actionsContainer;
}

// Function to create the vehicle data table
function createVehicleTable(records) {
  let table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <th>Photo</th>
      <th>Mobile Number</th>
      <th>Vehicle</th>
      <th>Check in</th>
      <th>Check out</th>
      <th>Status</th>
    </tr>
  `;

  records.forEach((record) => {
    let row = document.createElement("tr");

    let statusHTML =
      record.checkout && record.checkout.trim() !== ""
        ? `<td class="status"><i class="fas fa-sign-out-alt moved-out"></i> Moved Out</td>`
        : `<td class="status"><i class="fas fa-motorcycle fa-lg parked"></i> Parked</td>`;

    row.innerHTML = `
      <td><img src="${
        record.profilePic || "images/male.png"
      }" alt="User Avatar" class="avatar"></td>
      <td>${record.mobile || "N/A"}</td>
      <td>${record.vehicle}</td>
      <td>${record.checkin || "N/A"}</td>
      <td>${record.checkout || "N/A"}</td>
      ${statusHTML}
    `;

    table.appendChild(row);
  });

  return table;
}

// Dummy functions for Check-in and Check-out
async function handleCheckIn(vehicle) {}

async function handleCheckOut(vehicle) {
  try {
    const type = 3;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({ vehicle, type }),
    });
    const result = await response.json();
    console.log(result);
    if (result.status == "success") {
      showToast("✅".concat(result.message), "success");
    } else {
      showToast("❌".concat(result.message), "error");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  console.log(`Checked out: ${vehicle}`);
}

// Fetch Data and Generate Table
function getVehicleDetails() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received:", data);
      generateVehicleTable(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function searchVehicleTable() {
  let searchInput = document.getElementById("searchInput").value.toLowerCase();
  let detailsElements = document
    .getElementById("vehicle-list")
    .getElementsByTagName("details");

  for (let i = 0; i < detailsElements.length; i++) {
    let details = detailsElements[i];
    let summaryText = details
      .getElementsByTagName("summary")[0]
      .textContent.toLowerCase();
    let rows = details.getElementsByTagName("tr");
    console.log(rows);
    let rowMatch = false;

    for (let j = 1; j < rows.length; j++) {
      let cells = rows[j].getElementsByTagName("td");
      for (let k = 0; k < cells.length; k++) {
        let cellText = cells[k].textContent || cells[k].innerText;
        if (cellText.toLowerCase().includes(searchInput)) {
          rowMatch = true;
          break;
        }
      }
      rows[j].style.display = rowMatch ? "" : "none";
    }

    details.style.display =
      rowMatch || summaryText.includes(searchInput) ? "" : "none";
  }
}
