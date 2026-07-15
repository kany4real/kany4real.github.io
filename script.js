const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#main-nav");

function setMenu(open) {
  menuButton?.setAttribute("aria-expanded", String(open));
  nav?.classList.toggle("is-open", open);
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    menuButton?.focus();
  }
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});
