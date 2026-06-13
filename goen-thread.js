/* ============================================================
   語縁 GOEN — 縁の糸
   A single golden thread, drawn by scroll, weaves through
   every scene from hero to finale.
   ============================================================ */
(function () {
  "use strict";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";

  const ANCHORS = window.GOEN_THREAD_ANCHORS || [
    { sel: "#hero", x: 0.67, y: 0.62 },
    { sel: "#connectScene", x: 0.5, y: 0.5 },
    { sel: "#problem", x: 0.3, y: 0.52 },
    { sel: "#system", x: 0.5, y: 0.55 },
    { sel: "#philosophy", x: 0.5, y: 0.5 },
    { sel: "#services", x: 0.27, y: 0.62 },
    { sel: "#why", x: 0.72, y: 0.5 },
    { sel: "#contact", x: 0.5, y: 0.5 },
  ];

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "thread-svg");
  svg.setAttribute("aria-hidden", "true");
  const glowPath = document.createElementNS(NS, "path");
  glowPath.setAttribute("class", "thread-glow");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("class", "thread-line");
  const headGlow = document.createElementNS(NS, "circle");
  headGlow.setAttribute("class", "thread-head-glow");
  headGlow.setAttribute("r", "9");
  const head = document.createElementNS(NS, "circle");
  head.setAttribute("class", "thread-head");
  head.setAttribute("r", "2.4");
  svg.appendChild(glowPath);
  svg.appendChild(path);
  svg.appendChild(headGlow);
  svg.appendChild(head);
  document.body.appendChild(svg);

  let L = 0, built = false;

  /* ---------- 縁の糸の節目 — 認知→信頼→相談→成約→継続 ---------- */
  const LABELS = window.GOEN_THREAD_LABELS || [];
  let labelEls = [];
  function pointAtY(targetY) {
    let lo = 0, hi = L;
    for (let k = 0; k < 26; k++) {
      const mid = (lo + hi) / 2;
      if (path.getPointAtLength(mid).y < targetY) lo = mid; else hi = mid;
    }
    return path.getPointAtLength((lo + hi) / 2);
  }
  function buildLabels() {
    labelEls.forEach((el) => el.remove());
    labelEls = [];
    if (!LABELS.length || !L) return;
    const w = document.documentElement.clientWidth;
    for (const cfgL of LABELS) {
      const sec = document.querySelector(cfgL.sel);
      if (!sec) continue;
      const top = sec.getBoundingClientRect().top + window.scrollY;
      const pt = pointAtY(top + (cfgL.oy || 48));
      const d = document.createElement("div");
      d.className = "thread-label" + (cfgL.dk ? " dk" : "") + (pt.x > w * 0.5 ? " flip" : "");
      d.innerHTML = '<i></i><span>' + cfgL.text + "</span>";
      d.style.left = pt.x + "px";
      d.style.top = pt.y + "px";
      document.body.appendChild(d);
      labelEls.push(d);
    }
  }

  function build() {
    const docH = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const w = document.documentElement.clientWidth;
    svg.setAttribute("width", w);
    svg.setAttribute("height", docH);
    svg.setAttribute("viewBox", `0 0 ${w} ${docH}`);
    svg.style.height = docH + "px";

    const pts = [];
    for (const a of ANCHORS) {
      const el = document.querySelector(a.sel);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      pts.push({ x: a.x * w, y: top + r.height * a.y });
    }
    if (pts.length < 2) return;

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1], p1 = pts[i];
      const my = (p0.y + p1.y) / 2;
      d += ` C ${p0.x.toFixed(1)} ${my.toFixed(1)}, ${p1.x.toFixed(1)} ${my.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    path.setAttribute("d", d);
    glowPath.setAttribute("d", d);
    L = path.getTotalLength();
    path.style.strokeDasharray = L;
    glowPath.style.strokeDasharray = L;
    built = true;
    buildLabels();
    update();
  }

  function update() {
    if (!built || !L) return;
    let prog = 1;
    if (!REDUCED) {
      const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      prog = Math.max(0.02, Math.min(1, (window.scrollY + window.innerHeight * 0.7) / (docH + window.innerHeight * 0.7)));
    }
    const off = L * (1 - prog);
    path.style.strokeDashoffset = off;
    glowPath.style.strokeDashoffset = off;
    const pt = path.getPointAtLength(L * prog);
    head.setAttribute("cx", pt.x);
    head.setAttribute("cy", pt.y);
    headGlow.setAttribute("cx", pt.x);
    headGlow.setAttribute("cy", pt.y);
    const done = prog >= 1;
    head.style.opacity = done ? 0 : 1;
    headGlow.style.opacity = done ? 0 : 1;
  }

  let raf = 0;
  window.addEventListener("scroll", () => {
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); });
  }, { passive: true });

  let rsT;
  window.addEventListener("resize", () => {
    clearTimeout(rsT);
    rsT = setTimeout(build, 200);
  });

  // document height can change as fonts/images settle
  window.addEventListener("load", () => setTimeout(build, 300));
  setTimeout(build, 1200);
  setTimeout(build, 3500);
  build();
})();
