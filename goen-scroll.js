/* ============================================================
   語縁 GOEN — scroll-driven typography
   Problem scene: scattered characters align into structure
   as the visitor scrolls — the copy's meaning made motion.
   ============================================================ */
(function () {
  "use strict";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lines = document.querySelectorAll("[data-scatter]");
  if (!lines.length || REDUCED) return; // reduced motion: text stays static & visible

  const chars = [];
  let idx = 0;

  function split(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (const ch of node.textContent) {
        const s = document.createElement("span");
        s.className = "sc-ch";
        s.textContent = ch;
        const seed = Math.sin(++idx * 12.9898) * 43758.5453;
        const r = seed - Math.floor(seed);
        const seed2 = Math.sin(idx * 78.233) * 12543.853;
        const r2 = seed2 - Math.floor(seed2);
        chars.push({
          el: s,
          dx: (r - 0.5) * 130,
          dy: (r2 - 0.5) * 90 - 20,
          rot: (r - 0.5) * 40,
          last: -1,
        });
        frag.appendChild(s);
      }
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(split);
    }
  }
  lines.forEach((l) => split(l));

  const section = document.getElementById("problem");
  if (!section) return;

  function progress() {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when section top hits viewport bottom; 1 when section center reaches 48% of viewport
    const start = vh * 0.96;
    const end = vh * 0.48 - r.height * 0.3;
    return Math.max(0, Math.min(1, (start - r.top) / Math.max(1, start - end)));
  }

  function apply() {
    const p = progress();
    const e = p * p * (3 - 2 * p);
    const q = Math.round(e * 200) / 200;
    for (const c of chars) {
      if (c.last === q) continue;
      c.last = q;
      if (q >= 1) {
        c.el.style.transform = "";
        c.el.style.opacity = "";
      } else {
        const k = 1 - q;
        c.el.style.transform = `translate(${(c.dx * k).toFixed(1)}px, ${(c.dy * k).toFixed(1)}px) rotate(${(c.rot * k).toFixed(2)}deg)`;
        c.el.style.opacity = (0.15 + 0.85 * q).toFixed(3);
      }
    }
  }

  let raf = 0;
  window.addEventListener("scroll", () => {
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; apply(); });
  }, { passive: true });
  window.addEventListener("resize", apply);
  apply();
})();
