/* ============================================================
   語縁 GOEN v2 — interactions
   hamburger menu / misc v2 behaviors
   ============================================================ */
(function () {
  "use strict";
  const burger = document.getElementById("navBurger");
  const sheet = document.getElementById("navSheet");
  if (burger && sheet) {
    function setOpen(open) {
      burger.classList.toggle("open", open);
      sheet.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    }
    burger.addEventListener("click", () => setOpen(!sheet.classList.contains("open")));
    sheet.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setOpen(false))
    );
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) setOpen(false);
    });
  }

  // FAQ: close others when one opens (gentle accordion)
  const faqs = Array.from(document.querySelectorAll(".faq-item"));
  faqs.forEach((d) => {
    d.addEventListener("toggle", () => {
      if (d.open) faqs.forEach((o) => { if (o !== d && o.open) o.open = false; });
    });
  });

  /* ---------- scroll progress + nav glass + ivory-spread detection ---------- */
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  const nav = document.getElementById("siteNav");
  const inverts = Array.from(document.querySelectorAll(".scene--invert"));
  const mcta = document.getElementById("mobileCta");
  const contactSec = document.getElementById("contact");
  let sRaf = 0;
  function onScroll() {
    sRaf = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0).toFixed(4) + ")";
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
    const mid = window.innerHeight * 0.5;
    document.body.classList.toggle(
      "on-light",
      inverts.some((s) => {
        const r = s.getBoundingClientRect();
        return r.top < mid && r.bottom > mid;
      })
    );
    if (mcta && contactSec) {
      const cr = contactSec.getBoundingClientRect();
      const nearContact = cr.top < window.innerHeight * 0.92;
      const pastHero = window.scrollY > window.innerHeight * 0.7;
      mcta.classList.toggle("hide", nearContact || !pastHero);
    }
  }
  window.addEventListener("scroll", () => {
    if (!sRaf) sRaf = requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  /* ---------- mock tilt — the work floats toward the visitor ---------- */
  const FINE = window.matchMedia("(pointer: fine)").matches;
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (FINE && !REDUCED) {
    document.querySelectorAll(".mock").forEach((m) => {
      const inner = m.querySelector(".frame, .panel, .shell");
      if (!inner) return;
      m.addEventListener("pointermove", (e) => {
        const r = m.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        inner.style.transform =
          "perspective(900px) rotateX(" + ((0.5 - py) * 5).toFixed(2) + "deg) rotateY(" + ((px - 0.5) * 7).toFixed(2) + "deg)";
      });
      m.addEventListener("pointerleave", () => { inner.style.transform = ""; });
    });
  }
})();
