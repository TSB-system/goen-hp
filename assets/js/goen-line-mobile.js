(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !reduce && window.gsap && window.ScrollTrigger;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  const nav = document.querySelector("[data-mobile-nav]");
  const menuButton = document.querySelector("[data-menu-button]");
  const drawer = document.querySelector("[data-menu-drawer]");

  /* ---- ヘッダー：スクロールでブラー化 ＋ 下スクロールで隠す/上スクロールで出す ---- */
  let lastY = window.scrollY;
  const updateNav = () => {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 80);
      if (y < 60) {
        nav.classList.remove("is-hidden");
      } else if (y > lastY + 2) {
        nav.classList.add("is-hidden");
      } else if (y < lastY - 2) {
        nav.classList.remove("is-hidden");
      }
    }
    lastY = y;
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

  /* ---- アンカーリンクのイージング付きスムーススクロール ---- */
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const scrollToTarget = (target) => {
    const headerHeight = nav ? nav.offsetHeight : 0;
    const startY = window.scrollY;
    const destY = target.getBoundingClientRect().top + startY - headerHeight - 8;
    if (reduce) { window.scrollTo(0, destY); return; }
    const distance = destY - startY;
    const duration = Math.min(900, Math.max(400, Math.abs(distance) * 0.5));
    const startTime = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - startTime) / duration);
      window.scrollTo(0, startY + distance * easeInOutCubic(p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const hash = a.getAttribute("href");
    if (!hash || hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToTarget(target);
      history.pushState(null, "", hash);
    });
  });

  /* ---- リビール ---- */
  const reveals = [...document.querySelectorAll(".gm-reveal:not([data-hero-reveal])")];
  if (!hasGsap) {
    reveals.forEach(item => item.classList.add("is-visible"));
  } else {
    reveals.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => el.classList.add("is-visible")
      });
    });
  }

  /* ---- Works画像：進入時にclip-path + scaleが解ける ---- */
  const shotImgs = [...document.querySelectorAll(".gm-shot img")];
  if (!hasGsap) {
    shotImgs.forEach(img => img.classList.add("is-in"));
  } else {
    shotImgs.forEach(img => {
      ScrollTrigger.create({
        trigger: img,
        start: "top 90%",
        once: true,
        onEnter: () => img.classList.add("is-in")
      });
    });
  }

  /* ---- ステップ番号の点灯（System / Flow）---- */
  if (hasGsap) {
    document.querySelectorAll(".gm-step > span, .gm-flow > span").forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        onEnter: () => el.classList.add("is-lit"),
        onLeaveBack: () => el.classList.remove("is-lit")
      });
    });
  } else {
    document.querySelectorAll(".gm-step > span, .gm-flow > span").forEach(el => el.classList.add("is-lit"));
  }

  /* ---- ヒーロー：画像の静かなズームアウト + キャッチコピーの立ち上がり ---- */
  const heroImg = document.querySelector("[data-hero-img]");
  const heroReveals = [...document.querySelectorAll("[data-hero-reveal]")];

  if (!hasGsap) {
    heroReveals.forEach(el => el.classList.add("is-visible"));
  } else if (heroImg) {
    gsap.set(heroImg, { opacity: 0, scale: 1.06 });
    const tl = gsap.timeline();
    tl.to(heroImg, { opacity: 1, scale: 1.02, duration: 1.6, ease: "power2.out" });
    const delays = [0, 0.15, 0.30, 0.60, 0.75];
    heroReveals.forEach(el => {
      const order = parseInt(el.dataset.heroReveal, 10) || 0;
      tl.call(() => el.classList.add("is-visible"), null, 0.4 + (delays[order] ?? order * 0.15));
    });
  } else {
    heroReveals.forEach(el => el.classList.add("is-visible"));
  }

  /* ---- FAQ ---- */
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
