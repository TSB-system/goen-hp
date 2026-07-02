/* 語縁 GOEN — "線と余白で導く" 抑制された演出
   静かに浮かび上がる / 線が伸びる / 上品なアコーディオン */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- ヘッダー（スクロールで墨黒ブラー）＋レール進捗 ---- */
  const nav = document.querySelector("[data-nav]");
  const railProgress = document.querySelector("[data-rail-progress]");
  const railBead = document.querySelector("[data-rail-bead]");

  const onScroll = () => {
    const y = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;
    if (nav) nav.classList.toggle("is-scrolled", y > 40);
    if (railProgress) railProgress.style.transform = `scaleY(${ratio})`;
    if (railBead) {
      railBead.style.top = (ratio * 100) + "%";
      railBead.style.opacity = y > 80 ? "1" : "0";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---- モバイルメニュー ---- */
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (toggle && links) {
    const close = () => {
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-locked");
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      document.body.classList.toggle("is-locked", !open);
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  }

  /* ---- 静かに浮かび上がるリビール ---- */
  const reveals = [...document.querySelectorAll(".reveal:not(.is-in)")];
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(el => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(el => io.observe(el));
  }

  /* ---- スクロールに合わせて伸びる導線（SYSTEM / FLOW）---- */
  const growGroups = [...document.querySelectorAll("[data-growline]")].map(g => ({
    el: g,
    fill: g.querySelector("[data-growfill]")
  })).filter(g => g.fill);

  const updateGrow = () => {
    const vh = window.innerHeight;
    growGroups.forEach(({ el, fill }) => {
      const r = el.getBoundingClientRect();
      // 0 = セクション上端が画面中央, 1 = 下端が画面中央
      const start = vh * 0.85;
      const end = vh * 0.35;
      const total = r.height + (start - end);
      const passed = start - r.top;
      const ratio = Math.min(1, Math.max(0, passed / total));
      fill.style.transform = `scaleY(${reduce ? 1 : ratio})`;
    });
  };
  if (growGroups.length) {
    if (reduce) { growGroups.forEach(g => g.fill.style.transform = "scaleY(1)"); }
    else {
      window.addEventListener("scroll", updateGrow, { passive: true });
      window.addEventListener("resize", updateGrow);
      updateGrow();
    }
  }

  /* ---- ヒーロー微パララックス（pointer環境のみ・軽量）---- */
  const parallax = document.querySelector("[data-parallax]");
  if (parallax && !reduce) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) parallax.style.transform = `scale(1.06) translateY(${y * 0.08}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---- FAQ アコーディオン（ゆっくり上品に）---- */
  const faq = document.querySelector("[data-faq]");
  if (faq) {
    const items = [...faq.querySelectorAll(".faq__item")];
    items.forEach(item => {
      const q = item.querySelector(".faq__q");
      const a = item.querySelector(".faq__a");
      q.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove("open");
            other.querySelector(".faq__a").style.maxHeight = null;
            other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
          }
        });
        item.classList.toggle("open", !isOpen);
        q.setAttribute("aria-expanded", String(!isOpen));
        a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
      });
    });
    window.addEventListener("resize", () => {
      const open = faq.querySelector(".faq__item.open .faq__a");
      if (open) open.style.maxHeight = open.scrollHeight + "px";
    });
  }
})();
