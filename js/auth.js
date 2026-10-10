// ============ AUTH MODULE ============
// Handles account creation, login, session state, and route protection.
// Depends on `storage` helper defined in data.js — load data.js first.

const USERS_KEY = "streamhub_users";       // array of { name, email, password }
const SESSION_KEY = "streamhub_session";   // { name, email } or null

function getUsers() {
  return storage.get(USERS_KEY, []);
}

function signup(name, email, password) {
  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "An account with that email already exists." };
  }
  users.push({ name, email, password });
  storage.set(USERS_KEY, users);
  storage.set(SESSION_KEY, { name, email });
  return { ok: true };
}

function login(email, password) {
  const users = getUsers();
  const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!match) return { ok: false, error: "Incorrect email or password." };
  storage.set(SESSION_KEY, { name: match.name, email: match.email });
  return { ok: true };
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  location.href = "login.html";
}

function getSession() {
  return storage.get(SESSION_KEY, null);
}

// Call at the top of any protected page's script — redirects to login if
// no active session exists.
function requireAuth() {
  if (!getSession()) {
    location.href = "login.html";
  }
}

// Fills the #navAuth placeholder present in every page's nav bar.
function renderAuthNav() {
  const el = document.getElementById("navAuth");
  if (!el) return;
  const session = getSession();
  if (session) {
    el.innerHTML = `<span class="nav__user">Hi, ${escapeHTML(session.name)}</span><button id="logoutBtn" class="nav__logout">Log out</button>`;
    document.getElementById("logoutBtn").addEventListener("click", logout);
  } else {
    el.innerHTML = `<a href="login.html">Log in</a><a href="signup.html" class="nav__signup">Sign up</a>`;
  }
}

document.addEventListener("DOMContentLoaded", renderAuthNav);
