document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const authError = document.getElementById("authError");

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    authError.hidden = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      // Get existing accounts from LocalStorage
      const users = JSON.parse(localStorage.getItem("streamhub_users") || "[]");

      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
      }

      // Check if this is an Admin account
      const role = (email.toLowerCase().includes("admin") || email.endsWith("@streamhub.com")) ? "admin" : "user";

      // Save user record
      const newUser = { name, email, password, role };
      users.push(newUser);
      localStorage.setItem("streamhub_users", JSON.stringify(users));

      // Save active session
      const session = { name: newUser.name, email: newUser.email, role: newUser.role };
      localStorage.setItem("streamhub_session", JSON.stringify(session));

      // Redirect based on role
      if (session.role === "admin") {
        window.location.href = "admin-module/admin.html";
      } else {
        window.location.href = "index.html";
      }
    } catch (err) {
      authError.textContent = err.message;
      authError.hidden = false;
    }
  });
});