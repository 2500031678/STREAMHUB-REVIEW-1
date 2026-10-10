// Get stored users array from LocalStorage
function getUsers() {
  return JSON.parse(localStorage.getItem("streamhub_users") || "[]");
}

// Create new account with Role Assignment
function createAccount(name, email, password) {
  const users = getUsers();
  
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }

  // Assign admin role if email contains 'admin' or ends with @streamhub.com
  const role = (email.toLowerCase().includes("admin") || email.endsWith("@streamhub.com")) ? "admin" : "user";

  const newUser = { name, email, password, role };
  users.push(newUser);
  localStorage.setItem("streamhub_users", JSON.stringify(users));
  return newUser;
}

// Login User
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const session = { name: user.name, email: user.email, role: user.role };
  localStorage.setItem("streamhub_session", JSON.stringify(session));
  return session;
}

// Get active session
function getSession() {
  return JSON.parse(localStorage.getItem("streamhub_session") || "null");
}

// Route Guard for Protected User Pages
function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

// Route Guard for Admin Module
function requireAdminAuth() {
  const session = requireAuth();
  if (session && session.role !== "admin") {
    alert("Access Denied: Admin privileges required.");
    window.location.href = "../index.html";
    return null;
  }
  return session;
}

// Logout
function logoutUser() {
  localStorage.removeItem("streamhub_session");
  window.location.href = "login.html";
}

// Render Header Auth Component
function renderAuthNav() {
  const navAuth = document.getElementById("navAuth");
  if (!navAuth) return;

  const session = getSession();
  if (session) {
    let adminLink = session.role === "admin" ? `<a href="admin-module/admin.html" style="color: #e50914; font-weight: 600; margin-right: 1rem;">[Admin Panel]</a>` : "";
    navAuth.innerHTML = `
      ${adminLink}
      <span style="margin-right:0.75rem; color:#a1a1aa;">Hi, <strong>${session.name}</strong></span>
      <button onclick="logoutUser()" class="btn" style="padding:0.4rem 0.8rem; font-size:0.85rem;">Log out</button>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="login.html" class="btn">Log in</a>
      <a href="signup.html" class="btn btn--active" style="margin-left:0.5rem;">Sign up</a>
    `;
  }
}