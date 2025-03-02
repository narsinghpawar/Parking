const apiUrl =
  "https://script.google.com/macros/s/AKfycbySSLi3HXGH9LVe-elTKPj4VCD0gEZRpHAb3Sahn4nsu_aftfUzPU70kZKb575d37vn/exec";
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

  // Reload Button

  // Check-In Button
  let checkInButton = document.createElement("button");
  checkInButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Check In';
  checkInButton.classList.add("check-in-btn");
  checkInButton.onclick = () => handleCheckIn(vehicle);

  // Check-Out Button
  let checkOutButton = document.createElement("button");
  checkOutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Check Out';
  checkOutButton.classList.add("check-out-btn");
  checkOutButton.onclick = () => handleCheckOut(vehicle);

  // Append buttons to the container
  // actionsContainer.appendChild(reloadButton);
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
async function handleCheckIn(vehicle) {
  console.log(`Checked in: ${vehicle}`);
  try {
    const type = 4;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({ vehicle, type }),
    });
    const result = await response.json();
    if (result.status === 200) {
      showToast("✅".concat(result.message), "success");
    } else {
      showToast("❌".concat(result.message), "error");
    }
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

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
      // getUniqueVehicleCount(data);
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

function getUniqueVehicleCount(data) {
  let uniqueVehicles = {};

  for (let i = 1; i < data.length; i++) {
    let vehicleNumber = data[i].vehicle;
    if (vehicleNumber) {
      console.log("unique code ");
      let cleanNumber = vehicleNumber.trim().toUpperCase();
      uniqueVehicles[cleanNumber] = true;
    }
  }
  return Object.keys(uniqueVehicles);
}

function getParkedVehicleCount(data) {
  let uniqueVehicles = {};
  for (let i = 1; i < data.length; i++) {
    let vehicleNumber = data[i].vehicle;
    let checkIn = data[i].checkin;
    let checkOut = data[i].checkout;
    if (vehicleNumber && checkIn && !checkOut) {
      let cleanNumber = vehicleNumber.trim().toUpperCase();
      uniqueVehicles[cleanNumber] = true;
    }
  }
  return Object.keys(uniqueVehicles);
}

function getDetaisForDashboard() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received:", data);
      let countReg = getUniqueVehicleCount(data);
      let parkedCount = getParkedVehicleCount(data);
      console.log("Hello Wolrd !");
      document.getElementById("registeredCount").innerHTML = countReg.length;
      document.getElementById("parkedCount").innerHTML = parkedCount.length;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function viewGhrap() {
  window.location.href = "viewghrap.html";
}

let allBikeData = [];
function getDataPlotGhrap() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received----:", data);
      allBikeData = data;
      // updateChart(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function updateGhrap() {
  const bikeNumber = document.getElementById("searchInput").value.trim();
  if (!bikeNumber) {
    alert("Please enter a bike number!");
    return;
  }

  updateChart(allBikeData, bikeNumber);
}
// const bikeData = {
//   "KA 38 Y 5151": [
//     {
//       name: "Narsingh",
//       image: "",
//       checkin: "26/02/2025, 6:43:14 PM",
//       checkout: "26/02/2025, 6:50:00 PM",
//     },
//     {
//       name: "Narsingh",
//       image: "",
//       checkin: "26/02/2025, 8:00:00 PM",
//       checkout: "26/02/2025, 8:45:30 PM",
//     },
//     {
//       name: "Narsingh",
//       image: "",
//       checkin: "26/02/2025, 9:15:45 PM",
//       checkout: "26/02/2025, 9:50:10 PM",
//     },
//     {
//       name: "Narsingh",
//       image: "",
//       checkin: "26/02/2025, 10:30:00 PM",
//       checkout: "26/02/2025, 11:05:00 PM",
//     },
//     {
//       name: "Narsingh",
//       image: "",
//       checkin: "26/02/2025, 11:45:00 PM",
//       checkout: "27/02/2025, 12:30:00 AM",
//     },
//   ],
//   "KA 45 X 9999": [
//     {
//       name: "Sainath",
//       image: "",
//       checkin: "26/02/2025, 7:00:00 PM",
//       checkout: "26/02/2025, 7:40:00 PM",
//     },
//     {
//       name: "Sainath",
//       image: "",
//       checkin: "26/02/2025, 8:30:00 PM",
//       checkout: "26/02/2025, 9:15:00 PM",
//     },
//   ],
// };

// Function to parse datetime string into Date object
function parseDateTime(dateTimeStr) {
  return new Date(dateTimeStr.replace(/(\d+)\/(\d+)\/(\d+),/, "$3-$2-$1"));
}

// Function to format time difference as hh:mm:ss
function formatTimeSpent(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds %= 60;
  minutes %= 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

let chartInstance = null; // Store chart instance

function parseCustomDate(dateStr) {
  // Convert "26/2/2025, 6:43:14 pm" → "2025-02-26T18:43:14"
  let parts = dateStr.match(
    /(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2}) (am|pm)/i
  );

  if (!parts) {
    console.error("❌ Invalid date format:", dateStr);
    return null;
  }

  let [_, day, month, year, hour, minute, second, period] = parts;

  // Convert values to numbers
  day = parseInt(day);
  month = parseInt(month);
  year = parseInt(year);
  hour = parseInt(hour);
  minute = parseInt(minute);
  second = parseInt(second);

  // Convert 12-hour format to 24-hour
  if (period.toLowerCase() === "pm" && hour !== 12) {
    hour += 12;
  } else if (period.toLowerCase() === "am" && hour === 12) {
    hour = 0;
  }

  // Ensure two-digit formatting
  let formattedDateStr = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")}:${String(second).padStart(2, "0")}`;

  return new Date(formattedDateStr);
}

function updateChart(records, bikeNumber) {
  document.getElementById("canvas-data").style.display = "block";

  let bikeData = records.filter(
    (entry) =>
      entry.vehicle.trim().toUpperCase() === bikeNumber.trim().toUpperCase() &&
      entry.checkout // Exclude parked bikes
  );

  if (bikeData.length === 0) {
    alert("No valid check-out data found for this bike!");
    return;
  }

  let dataPoints = bikeData
    .map((entry) => {
      let checkinTime = parseCustomDate(entry.checkin);
      let checkoutTime = parseCustomDate(entry.checkout);

      if (!checkinTime || !checkoutTime) {
        console.error("❌ Invalid date in entry:", entry);
        return null;
      }

      let timeSpentMs = checkoutTime - checkinTime;

      return {
        x: checkinTime,
        y: timeSpentMs / 1000, // Convert to seconds
        checkinFormatted: checkinTime.toLocaleString("en-GB", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
        timeFormatted: formatTimeSpent(timeSpentMs),
      };
    })
    .filter(Boolean);

  if (dataPoints.length === 0) {
    alert("No valid data points found!");
    return;
  }

  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  const ctx = document.getElementById("scatterChart").getContext("2d");
  window.chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: `Check-in vs Time Spent - ${bikeNumber}`,
          data: dataPoints,
          backgroundColor: "red",
          borderColor: "blue",
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: false,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: { size: 14 },
          bodyFont: { size: 14 },
          padding: 10,
          displayColors: false,
          callbacks: {
            title: function (tooltipItems) {
              return `Check-in: ${tooltipItems[0].raw.checkinFormatted}`;
            },
            label: function (tooltipItem) {
              return `Time Spent: ${tooltipItem.raw.timeFormatted}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: { unit: "hour", displayFormats: { hour: "MMM dd, h a" } },
          title: { display: true, text: "Check-in Time" },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: "Time Spent (hh:mm:ss)" },
          ticks: {
            callback: function (value) {
              return formatTimeSpent(value * 1000);
            },
          },
        },
      },
    },
  });
}

function creatUser() {
  window.location.href = "createUser.html";
}

async function creatUserRole() {
  let username = document.getElementById("username").value.trim();
  const securePassword = document.getElementById("password").value.trim();
  const type = 6;
  let role = document.getElementById("role").value;
  let password = await protectPassword(securePassword);
  console.log("username " + username + "password " + password + "role " + role);
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify({ username, password, type, role }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      if (result.statusCode === 200) {
        showToast("✅ User Role Created Successfully", "success");
      }
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
      showToast("error", error.message);
    });
}

function syncData() {
  showToast("✅ Data Synced Successfully", "success");
  setInterval(() => {
    location.reload();
  }, 3000);
}
