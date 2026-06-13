/* ============================================================
   語縁 GOEN v3 — contact form (demo handler)
   ============================================================ */
(function () {
  "use strict";
  const form = document.getElementById("contactForm");
  const done = document.getElementById("contactDone");
  if (!form || !done) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.hidden = true;
    done.hidden = false;
    done.classList.add("show");
  });
})();
