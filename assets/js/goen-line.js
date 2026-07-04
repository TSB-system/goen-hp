/* 語縁 GOEN — "線と余白で導く" 抑制された演出
   静かに浮かび上がる / 線が伸びる / 上品なアコーディオン */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !reduce && window.gsap && window.ScrollTrigger;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  const nav = document.querySelector("[data-nav]");
  const railProgress = document.querySelector("[data-rail-progress]");

  /* ---- 数字のカウントアップ（PRICE / STEP / FLOW の番号を軽やかに）---- */
  const countUpFirstTextNode = (el, duration = 900) => {
    const node = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim() !== "");
    if (!node) return;
    const original = node.nodeValue;
    const target = parseInt(original, 10);
    if (Number.isNaN(target)) return;
    const pad = /^0/.test(original.trim()) ? original.trim().length : 0;
    const startTime = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      let text = String(Math.round(target * eased));
      if (pad) text = text.padStart(pad, "0");
      node.nodeValue = text;
      if (p < 1) requestAnimationFrame(step);
      else node.nodeValue = original;
    };
    requestAnimationFrame(step);
  };
  const railBead = document.querySelector("[data-rail-bead]");

  /* ---- ヘッダー：スクロールでブラー化 ＋ 下スクロールで隠す/上スクロールで出す ---- */
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 100);
      if (y < 80) {
        nav.classList.remove("is-hidden");
      } else if (y > lastY + 2) {
        nav.classList.add("is-hidden");
      } else if (y < lastY - 2) {
        nav.classList.remove("is-hidden");
      }
    }
    if (railProgress) railProgress.style.transform = `scaleY(${ratio})`;
    if (railBead) {
      railBead.style.top = (ratio * 100) + "%";
      railBead.style.opacity = y > 80 ? "1" : "0";
    }
    lastY = y;
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

  /* ---- 静かに浮かび上がるリビール ---- */
  const reveals = [...document.querySelectorAll(".reveal:not([data-hero-reveal])")];
  if (!hasGsap) {
    reveals.forEach(el => el.classList.add("is-in"));
  } else {
    reveals.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => el.classList.add("is-in")
      });
    });
  }

  /* ---- 罫線（.flow-line）：進入時に左から引かれる ---- */
  const flowLines = [...document.querySelectorAll(".flow-line")];
  if (!hasGsap) {
    flowLines.forEach(el => el.classList.add("is-in"));
  } else {
    flowLines.forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => el.classList.add("is-in")
      });
    });
  }

  /* ---- Works画像：進入時にclip-path + scaleが解ける ---- */
  const workImgs = [...document.querySelectorAll(".work-shot img")];
  if (!hasGsap) {
    workImgs.forEach(img => img.classList.add("is-in"));
  } else {
    workImgs.forEach(img => {
      ScrollTrigger.create({
        trigger: img,
        start: "top 88%",
        once: true,
        onEnter: () => img.classList.add("is-in")
      });
    });
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

  /* ---- ステップ番号の点灯（System / Flow）---- */
  if (hasGsap) {
    document.querySelectorAll(".step__no, .flow-step__no").forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        onEnter: () => { el.classList.add("is-lit"); countUpFirstTextNode(el, 700); },
        onLeaveBack: () => el.classList.remove("is-lit")
      });
    });
    document.querySelectorAll(".price__fig").forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => countUpFirstTextNode(el, 900)
      });
    });
  } else {
    document.querySelectorAll(".step__no, .flow-step__no").forEach(el => el.classList.add("is-lit"));
  }

  /* ---- ヒーロー：画像の静かなズームアウト + キャッチコピーの立ち上がり + 浅いパララックス ---- */
  const heroImg = document.querySelector("[data-parallax]");
  const heroReveals = [...document.querySelectorAll("[data-hero-reveal]")];
  const heroSection = document.querySelector(".hero");

  if (!hasGsap) {
    heroReveals.forEach(el => el.classList.add("is-in"));
  } else if (heroImg) {
    gsap.set(heroImg, { opacity: 0, scale: 1.09 });
    const tl = gsap.timeline();
    tl.to(heroImg, { opacity: 1, scale: 1.05, duration: 1.6, ease: "power2.out" });
    heroReveals.forEach(el => {
      const order = parseFloat(el.dataset.heroReveal) || 0;
      const delays = [0, 0.15, 0.30, 0.60];
      tl.call(() => el.classList.add("is-in"), null, 0.4 + (delays[order] || order * 0.15));
    });

    gsap.to(heroImg, {
      y: () => heroImg.offsetHeight * 0.05,
      ease: "none",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  } else {
    heroReveals.forEach(el => el.classList.add("is-in"));
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
