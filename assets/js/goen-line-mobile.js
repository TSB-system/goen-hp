(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.querySelector("[data-mobile-nav]");
  const menuButton = document.querySelector("[data-menu-button]");
  const drawer = document.querySelector("[data-menu-drawer]");

  const updateNav = () => {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  if (menuButton && drawer) {
    const closeMenu = () => {
      document.body.classList.remove("is-menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("is-menu-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    drawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });
  }

  const reveals = [...document.querySelectorAll(".gm-reveal")];
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(item => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(item => observer.observe(item));
  }

  document.querySelectorAll("[data-faq]").forEach(faq => {
    const items = [...faq.querySelectorAll(".gm-faq__item")];
    items.forEach(item => {
      const button = item.querySelector("button");
      const panel = item.querySelector("div");
      if (!button || !panel) return;

      button.addEventListener("click", () => {
        const nextOpen = !item.classList.contains("is-open");
        items.forEach(other => {
          const otherButton = other.querySelector("button");
          const otherPanel = other.querySelector("div");
          other.classList.remove("is-open");
          if (otherButton) otherButton.setAttribute("aria-expanded", "false");
          if (otherPanel) otherPanel.style.maxHeight = null;
        });
        item.classList.toggle("is-open", nextOpen);
        button.setAttribute("aria-expanded", String(nextOpen));
        panel.style.maxHeight = nextOpen ? `${panel.scrollHeight}px` : null;
      });
    });
  });
})();
