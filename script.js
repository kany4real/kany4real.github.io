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

const isEnglish = document.documentElement.lang === "en";
const footer = document.querySelector(".site-footer");

document.querySelectorAll('.main-nav a[href="/#about"], .main-nav a[href="/en/#about"]').forEach((link) => {
  link.href = isEnglish ? "/en/about/" : "/about/";
});

if (footer && !footer.querySelector(".social-links")) {
  const socialNav = document.createElement("nav");
  socialNav.className = "social-links";
  socialNav.setAttribute("aria-label", isEnglish ? "Social media" : "Réseaux sociaux");
  socialNav.innerHTML = `
    <a href="https://www.facebook.com/kany4real/" target="_blank" rel="me noopener">Facebook</a>
    <a href="https://www.linkedin.com/in/kanyjhenry/" target="_blank" rel="me noopener">LinkedIn</a>
    <a href="https://www.youtube.com/@kany4real" target="_blank" rel="me noopener">YouTube</a>
    <a href="https://www.instagram.com/kany4real/" target="_blank" rel="me noopener">Instagram</a>
    <a href="https://x.com/kany4real" target="_blank" rel="me noopener">X</a>`;
  footer.append(socialNav);
}

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const previous = carousel.querySelector("[data-carousel-previous]");
  const next = carousel.querySelector("[data-carousel-next]");
  const status = carousel.querySelector("[data-carousel-status]");
  let activeIndex = 0;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.hidden = !active;
      slide.setAttribute("aria-hidden", String(!active));
    });
    if (status) status.textContent = `${activeIndex + 1} / ${slides.length}`;
  };

  previous?.addEventListener("click", () => showSlide(activeIndex - 1));
  next?.addEventListener("click", () => showSlide(activeIndex + 1));
  showSlide(0);
}
