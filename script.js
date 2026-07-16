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

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const previous = carousel.querySelector("[data-carousel-previous]");
  const next = carousel.querySelector("[data-carousel-next]");
  const status = carousel.querySelector("[data-carousel-status]");
  const dotsContainer = carousel.querySelector("[data-carousel-dots]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dots = [];
  let activeIndex = 0;
  let autoplayTimer = null;
  let userStoppedAutoplay = false;
  let touchStartX = 0;

  if (slides.length < 2) return;

  const stopAutoplay = () => {
    userStoppedAutoplay = true;
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  };

  const startAutoplay = () => {
    if (reducedMotion || userStoppedAutoplay || autoplayTimer) return;
    autoplayTimer = window.setInterval(() => showSlide(activeIndex + 1, false), 5000);
  };

  const showSlide = (index, announce = true) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.hidden = false;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === activeIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
    if (status) {
      status.textContent = `${activeIndex + 1} / ${slides.length}`;
      status.setAttribute("aria-live", announce ? "polite" : "off");
    }
  };

  slides.forEach((slide, index) => {
    slide.hidden = false;
    if (!dotsContainer) return;
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `${isEnglish ? "Show image" : "Afficher l’image"} ${index + 1}`);
    dot.addEventListener("click", () => {
      stopAutoplay();
      showSlide(index);
    });
    dotsContainer.append(dot);
    dots.push(dot);
  });

  previous?.addEventListener("click", () => {
    stopAutoplay();
    showSlide(activeIndex - 1);
  });
  next?.addEventListener("click", () => {
    stopAutoplay();
    showSlide(activeIndex + 1);
  });
  carousel.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    stopAutoplay();
    showSlide(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
  });
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  carousel.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 40) return;
    stopAutoplay();
    showSlide(activeIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    } else {
      startAutoplay();
    }
  });

  showSlide(0, false);
  startAutoplay();
});
