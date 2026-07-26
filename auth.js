// ============================================================
// SHARED AUTH LOGIC
// Handles: updating nav based on login state, logout button,
// and protecting the dashboard page.
// ============================================================

import { auth } from "./firebaseinit.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const navAuthSlot = document.getElementById("navAuthSlot");
const isDashboard = document.body.dataset.protected === "true";

onAuthStateChanged(auth, (user) => {
  if (navAuthSlot) {
    if (user) {
      navAuthSlot.innerHTML = `
        <span class="nav-user">${user.email}</span>
        <button class="btn btn-ghost" id="logoutBtn">Log out</button>
      `;
      document.getElementById("logoutBtn").addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "index.html";
      });
    } else {
      navAuthSlot.innerHTML = `
        <a href="login.html" class="nav-link">Log in</a>
        <a href="signup.html" class="btn btn-primary btn-small">Sign up</a>
      `;
    }
  }

  // Route protection: bounce logged-out users away from the dashboard
  if (isDashboard && !user) {
    window.location.href = "login.html";
  }

  // If protected page and user IS logged in, fill in their info
  if (isDashboard && user) {
    const emailSlot = document.getElementById("userEmail");
    if (emailSlot) emailSlot.textContent = user.email;
    const createdSlot = document.getElementById("userCreated");
    if (createdSlot && user.metadata?.creationTime) {
      createdSlot.textContent = new Date(user.metadata.creationTime).toLocaleDateString();
    }
  }
});
