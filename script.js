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
  if (event.key === "Escape" && nav?.classList.contains("is-open")) {
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

const galleryGroups = [
  ...[...document.querySelectorAll(".gallery-grid")]
    .map((grid) => [...grid.querySelectorAll(".gallery-item")]),
  ...[...document.querySelectorAll("[data-carousel]")]
    .map((carousel) => [...carousel.querySelectorAll(".carousel-slide img")])
].filter((items) => items.length);
const videoLinks = [...document.querySelectorAll(
  "[data-video-lightbox], .episode-card[href*='youtube.com'], .cta-row .button-link[href*='youtube.com']"
)];

if (galleryGroups.length || videoLinks.length) {
  const labels = isEnglish
    ? { close: "Close", previous: "Previous", next: "Next", dialog: "Media viewer" }
    : { close: "Fermer", previous: "Précédente", next: "Suivante", dialog: "Visionneuse média" };
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", labels.dialog);
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <div class="lightbox-dialog">
      <button class="lightbox-close" type="button" aria-label="${labels.close}">×</button>
      <button class="lightbox-previous" type="button" aria-label="${labels.previous}">←</button>
      <div class="lightbox-stage"></div>
      <button class="lightbox-next" type="button" aria-label="${labels.next}">→</button>
      <p class="lightbox-caption" aria-live="polite"></p>
    </div>`;
  document.body.append(lightbox);

  const stage = lightbox.querySelector(".lightbox-stage");
  const caption = lightbox.querySelector(".lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const previousButton = lightbox.querySelector(".lightbox-previous");
  const nextButton = lightbox.querySelector(".lightbox-next");
  let activeItems = [];
  let activeIndex = 0;
  let returnFocus = null;
  let touchStartX = 0;

  const youtubeId = (url) => {
    try {
      const parsed = new URL(url, window.location.href);
      if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
      if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2];
      return parsed.searchParams.get("v");
    } catch {
      return null;
    }
  };

  const showItem = (index) => {
    if (!activeItems.length) return;
    activeIndex = (index + activeItems.length) % activeItems.length;
    const item = activeItems[activeIndex];
    const type = item.matches("[data-video-lightbox], [href*='youtube.com'], [href*='youtu.be']") ? "video" : "image";
    stage.replaceChildren();

    if (type === "video") {
      const id = youtubeId(item.href);
      if (!id) return;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = item.dataset.videoTitle || item.textContent.trim();
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      stage.append(iframe);
      caption.textContent = iframe.title;
    } else {
      const thumbnail = item.matches("img") ? item : item.querySelector("img");
      const image = document.createElement("img");
      image.src = item.href || thumbnail?.currentSrc || thumbnail?.src;
      image.alt = thumbnail?.alt || "";
      stage.append(image);
      caption.textContent = item.dataset.caption || thumbnail?.alt || "";
    }

    lightbox.dataset.single = String(activeItems.length < 2);
  };

  const openLightbox = (items, index, trigger) => {
    activeItems = items;
    returnFocus = trigger;
    showItem(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  const closeLightbox = () => {
    if (!lightbox.classList.contains("is-open")) return;
    stage.replaceChildren();
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    returnFocus?.focus();
  };

  galleryGroups.forEach((items) => {
    items.forEach((item, index) => {
      if (item.matches("img")) {
        item.tabIndex = 0;
        item.setAttribute("role", "button");
        item.setAttribute("aria-label", `${isEnglish ? "Enlarge image" : "Agrandir l’image"} ${index + 1}`);
      }
      const activate = (event) => {
        event.preventDefault();
        openLightbox(items, index, item);
      };
      item.addEventListener("click", activate);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") activate(event);
      });
    });
  });

  videoLinks.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(videoLinks, videoLinks.indexOf(item), item);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showItem(activeIndex - 1));
  nextButton.addEventListener("click", () => showItem(activeIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 45 || activeItems.length < 2) return;
    showItem(activeIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showItem(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showItem(activeIndex + 1);
    } else if (event.key === "Tab") {
      const controls = [...lightbox.querySelectorAll("button, iframe")]
        .filter((control) => control.offsetParent !== null);
      const current = controls.indexOf(document.activeElement);
      if (event.shiftKey && current <= 0) {
        event.preventDefault();
        controls.at(-1)?.focus();
      } else if (!event.shiftKey && current === controls.length - 1) {
        event.preventDefault();
        controls[0]?.focus();
      }
    }
  });
}
