/* ============================================================
   語縁 GOEN — luxury interactions
   intro sequence / custom cursor / magnetic buttons /
   scene rail / nav hide-on-scroll
   ============================================================ */
(function () {
  "use strict";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia("(pointer: fine)").matches;

  /* ---------- intro sequence ---------- */
  const intro = document.getElementById("intro");
  if (intro) {
    if (REDUCED) {
      intro.style.display = "none";
    } else {
      setTimeout(() => intro.classList.add("out"), 2000);
      // hard failsafe: remove from flow even if transitions never run
      setTimeout(() => { intro.style.display = "none"; }, 3400);
    }
  }

  /* ---------- custom cursor ---------- */
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (dot && ring && FINE && !REDUCED) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    let active = false, raf = 0;
    function loop() {
      raf = 0;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      if (Math.abs(mx - rx) > 0.2 || Math.abs(my - ry) > 0.2 || active) {
        raf = requestAnimationFrame(loop);
      } else {
        active = false;
      }
    }
    function kick() { if (!raf) { active = true; raf = requestAnimationFrame(loop); } }
    document.addEventListener("pointermove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      document.body.classList.remove("cursor-hide");
      const t = e.target;
      const hot =
        (t.closest && t.closest("a, button, .svc-tab, .nav-cta")) ||
        (t.tagName === "CANVAS" && t.classList.contains("is-hot"));
      ring.classList.toggle("hot", !!hot);
      kick();
    });
    document.addEventListener("pointerleave", () => document.body.classList.add("cursor-hide"));
    document.addEventListener("pointerdown", () => { ring.classList.add("hot"); });
    document.addEventListener("pointerup", () => { ring.classList.remove("hot"); });
  } else if (dot && ring) {
    dot.style.display = "none";
    ring.style.display = "none";
    document.body.classList.add("no-custom-cursor");
  }

  /* ---------- magnetic buttons + 一筆書き border draw ---------- */
  const NS = "http://www.w3.org/2000/svg";
  document.querySelectorAll(".btn").forEach((el) => {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "btn-draw");
    svg.setAttribute("aria-hidden", "true");
    const rect = document.createElementNS(NS, "rect");
    rect.setAttribute("pathLength", "100");
    svg.appendChild(rect);
    el.appendChild(svg);
  });
  if (FINE && !REDUCED) {
    document.querySelectorAll(".btn, .nav-cta").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(dx * 0.16).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- 金の波紋 — click ripple ---------- */
  if (!REDUCED) {
    document.addEventListener("pointerdown", (e) => {
      const rp = document.createElement("div");
      rp.className = "click-ripple";
      rp.style.left = e.clientX + "px";
      rp.style.top = e.clientY + "px";
      document.body.appendChild(rp);
      setTimeout(() => rp.remove(), 800);
    });
  }

  /* ---------- scene rail ---------- */
  const rail = document.getElementById("rail");
  if (rail) {
    const links = Array.from(rail.querySelectorAll("a[data-target]"));
    const sections = links
      .map((a) => ({ a, el: document.getElementById(a.dataset.target) }))
      .filter((o) => o.el);
    let railRaf = 0;
    function railUpdate() {
      railRaf = 0;
      const probe = window.innerHeight * 0.42;
      let current = sections[0];
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top <= probe) current = s;
      }
      for (const s of sections) s.a.classList.toggle("on", s === current);
    }
    window.addEventListener("scroll", () => {
      if (!railRaf) railRaf = requestAnimationFrame(railUpdate);
    }, { passive: true });
    setInterval(railUpdate, 1000);
    railUpdate();
  }

  /* ---------- nav: hide on scroll down, return on scroll up ---------- */
  const nav = document.getElementById("siteNav");
  if (nav) {
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y > 420 && y > lastY + 4) nav.classList.add("away");
      else if (y < lastY - 4 || y <= 420) nav.classList.remove("away");
      lastY = y;
    }, { passive: true });
  }
})();
