document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const authError = document.getElementById("authError");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    authError.hidden = true;

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const session = loginUser(email, password);
      
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