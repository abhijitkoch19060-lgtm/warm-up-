/* ===== Helpers ===== */
const $ = (id) => document.getElementById(id);
const store = {
  get users() { try { return JSON.parse(localStorage.getItem("users")) || {}; } catch { return {}; } },
  set users(v) { localStorage.setItem("users", JSON.stringify(v)); },
  get session() { return localStorage.getItem("session"); },
  set session(v) { v ? localStorage.setItem("session", v) : localStorage.removeItem("session"); },
};

/* ===== Page routing (hash based) ===== */
const pages = ["home", "about", "map", "login", "profile"];
let mapInstance = null;

function showPage() {
  let id = location.hash.replace("#", "") || "home";
  if (!pages.includes(id)) id = "home";

  document.querySelectorAll(".page").forEach((p) => p.classList.toggle("active", p.id === id));
  document.querySelectorAll("[data-link]").forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + id && a.id !== "loginLink")
  );

  $("navLinks").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (id === "map") initMap();
  if (id === "profile") renderProfile();
}
window.addEventListener("hashchange", showPage);

/* ===== Mobile menu ===== */
$("menuToggle").addEventListener("click", () => $("navLinks").classList.toggle("open"));

/* ===== Map (Leaflet + OpenStreetMap) ===== */
function initMap() {
  if (mapInstance) { setTimeout(() => mapInstance.invalidateSize(), 100); return; }
  if (typeof L === "undefined") { $("mapBox").textContent = "Map library failed to load. Check your internet connection."; return; }

  mapInstance = L.map("mapBox").setView([27.9881, 86.925], 6);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapInstance);

  // ADD YOUR OWN PLACES HERE: [name, latitude, longitude, description]
  const places = [
    ["Mount Everest", 27.9881, 86.925, "Highest mountain on Earth."],
    ["Kanchenjunga", 27.7025, 88.1475, "Third highest mountain in the world."],
    ["Annapurna", 28.5961, 83.8203, "Famous trekking region in Nepal."],
    ["Nanda Devi", 30.3753, 79.9708, "Highest peak entirely within India."],
  ];
  places.forEach(([name, lat, lng, desc]) =>
    L.marker([lat, lng]).addTo(mapInstance).bindPopup(`<b>${name}</b><br>${desc}`)
  );
}

$("locateBtn").addEventListener("click", () => {
  initMap();
  if (!navigator.geolocation) return alert("Geolocation is not supported by your browser.");
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      mapInstance.setView([latitude, longitude], 12);
      L.marker([latitude, longitude]).addTo(mapInstance).bindPopup("You are here").openPopup();
    },
    () => alert("Could not get your location. Please allow location access.")
  );
});

/* ===== Login / Sign up (demo using localStorage) ===== */
let signupMode = false;

function setAuthMode(signup) {
  signupMode = signup;
  $("authTitle").textContent = signup ? "Sign up" : "Login";
  $("authSubmit").textContent = signup ? "Create account" : "Login";
  $("nameRow").hidden = !signup;
  $("switchText").textContent = signup ? "Already have an account?" : "No account?";
  $("switchLink").textContent = signup ? "Login" : "Sign up";
  $("authMsg").textContent = "";
}

$("switchLink").addEventListener("click", (e) => { e.preventDefault(); setAuthMode(!signupMode); });

// Simple hash so passwords are not saved as plain text (still NOT secure; demo only)
async function hash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function authMessage(text, ok = false) {
  const el = $("authMsg");
  el.textContent = text;
  el.className = "msg " + (ok ? "ok" : "error");
}

$("authForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("emailInput").value.trim().toLowerCase();
  const pass = await hash($("passInput").value);
  const users = store.users;

  if (signupMode) {
    if (users[email]) return authMessage("An account with this email already exists.");
    users[email] = { name: $("nameInput").value.trim() || email.split("@")[0], pass, bio: "" };
    store.users = users;
    store.session = email;
    authMessage("Account created!", true);
  } else {
    if (!users[email] || users[email].pass !== pass) return authMessage("Invalid email or password.");
    store.session = email;
    authMessage("Welcome back!", true);
  }

  $("authForm").reset();
  updateNav();
  setTimeout(() => (location.hash = "#profile"), 500);
});

function updateNav() {
  const link = $("loginLink");
  if (store.session) {
    link.textContent = "Logout";
    link.setAttribute("href", "#home");
  } else {
    link.textContent = "Login";
    link.setAttribute("href", "#login");
  }
}

$("loginLink").addEventListener("click", () => {
  if (store.session) { store.session = null; updateNav(); renderProfile(); }
});

/* ===== Profile ===== */
function renderProfile() {
  const email = store.session;
  const user = email && store.users[email];
  $("profileLoggedOut").hidden = !!user;
  $("profileLoggedIn").hidden = !user;
  if (!user) return;

  $("avatar").textContent = user.name.charAt(0).toUpperCase();
  $("pName").value = user.name;
  $("pEmail").value = email;
  $("pBio").value = user.bio || "";
}

$("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const users = store.users;
  const email = store.session;
  users[email].name = $("pName").value.trim();
  users[email].bio = $("pBio").value.trim();
  store.users = users;
  $("avatar").textContent = users[email].name.charAt(0).toUpperCase();
  const m = $("profileMsg");
  m.textContent = "Profile saved!";
  m.className = "msg ok";
});

$("logoutBtn").addEventListener("click", () => {
  store.session = null;
  updateNav();
  location.hash = "#home";
});

/* ===== Init ===== */
$("year").textContent = new Date().getFullYear();
updateNav();
showPage();
