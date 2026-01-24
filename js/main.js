// File: js/main.js

// Set year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Nav active
const path = window.location.pathname.split("/").pop(); // e.g. index.html
const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach((a) => {
  const href = a.getAttribute("href");
  if ((path === "" && href === "index.html") || href === path) {
    a.classList.add("active");
  }
});
