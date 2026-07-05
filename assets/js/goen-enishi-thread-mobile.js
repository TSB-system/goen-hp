/* 縁の糸 — 幹・ノード（モバイル。枝は出さない。素のJSのみ） */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const main = document.querySelector("main");
  const trunk = document.querySelector("[data-trunk]");
  const trunkFill = document.querySelector("[data-trunk-fill]");
  const trunkKnot = document.querySelector("[data-trunk-knot]");
  const hero = document.querySelector(".gm-hero");
  const contact = document.getElementById("contact");
  if (!main || !trunk || !hero || !contact) return;

  const io = "IntersectionObserver" in window;

  let trunkTop = 0;
  let trunkHeight = 1;
  const sizeTrunk = () => {
    const heroRect = hero.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const submitBtn = contact.querySelector('button[type="submit"]');
    const endEl = submitBtn || contact;
    const endRect = endEl.getBoundingClientRect();

    trunkTop = heroRect.bottom - mainRect.top;
    const endY = endRect.top - mainRect.top + endRect.height / 2;
    trunkHeight = Math.max(1, endY - trunkTop);

    trunk.style.top = trunkTop + "px";
    trunk.style.height = trunkHeight + "px";
    if (trunkKnot) trunkKnot.style.top = trunkHeight - 3.5 + "px";
  };

  let ticking = false;
  const updateFill = () => {
    ticking = false;
    if (!trunkFill) return;
    const mainRect = main.getBoundingClientRect();
    const trunkTopViewport = mainRect.top + trunkTop;
    const viewportRef = window.innerHeight * 0.35;
    const raw = (viewportRef - trunkTopViewport) / trunkHeight;
    const progress = Math.min(1, Math.max(0, raw)) * 0.9;
    trunkFill.style.transform = `scaleY(${progress})`;
  };
  const onScroll = () => {
    if (reduce || ticking) return;
    ticking = true;
    requestAnimationFrame(updateFill);
  };

  sizeTrunk();
  if (!reduce) updateFill();

  window.addEventListener("scroll", onScroll, { passive: true });
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      sizeTrunk();
      updateFill();
      layoutNodes();
    }, 200);
  });

  if (reduce || !io) {
    trunk.classList.add("is-visible");
  } else {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => trunk.classList.toggle("is-visible", !e.isIntersecting));
    }, { threshold: 0 }).observe(hero);
  }

  if (trunkKnot) {
    if (reduce || !io) {
      trunkKnot.classList.add("is-in");
    } else {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) trunkKnot.classList.add("is-in"); });
      }, { threshold: 0.15 }).observe(contact);
    }
  }

  /* ---- ノード：PROBLEM(gm-card) / FLOW(gm-flow) ---- */
  const nodeTargets = [
    ...document.querySelectorAll("#problem .gm-card"),
    ...document.querySelectorAll("#flow .gm-flow")
  ];
  const nodes = nodeTargets.map((el) => {
    const node = document.createElement("span");
    node.className = "enishi-trunk__node";
    node.setAttribute("aria-hidden", "true");
    trunk.appendChild(node);
    return { el, node };
  });

  function layoutNodes() {
    const mainRect = main.getBoundingClientRect();
    nodes.forEach(({ el, node }) => {
      const r = el.getBoundingClientRect();
      const y = r.top - mainRect.top + r.height / 2 - trunkTop;
      node.style.top = y + "px";
    });
  }
  layoutNodes();

  if (reduce || !io) {
    nodes.forEach(({ node }) => node.classList.add("is-lit"));
  } else {
    const nodeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const match = nodes.find((n) => n.el === entry.target);
        if (match) match.node.classList.toggle("is-lit", entry.isIntersecting);
      });
    }, { threshold: 0.4 });
    nodes.forEach(({ el }) => nodeObserver.observe(el));
  }

  /* ---- SP下部固定バー ---- */
  const stickybar = document.querySelector("[data-stickybar]");
  if (stickybar) {
    const quality = document.querySelector("#quality");
    const updateBar = () => {
      const shouldShow = quality
        ? quality.getBoundingClientRect().top <= window.innerHeight * 0.82
        : window.scrollY >= window.innerHeight * 0.75;
      stickybar.classList.toggle("is-shown", shouldShow);
    };
    updateBar();
    window.addEventListener("scroll", updateBar, { passive: true });
    window.addEventListener("resize", updateBar, { passive: true });
  }

  /* ---- FV内：始点の線 ---- */
})();
