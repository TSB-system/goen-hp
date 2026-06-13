/* ============================================================
   語縁 GOEN — scenes: shared utils, reveals, nav,
   Scene 01 (connection) sticky canvas, Scene 03 flow system
   ============================================================ */
(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- shared utilities ---------- */
  const UTIL = (window.GOEN_UTIL = {
    reduced: REDUCED,
    accent() {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent").trim().replace("#", "");
      if (v.length >= 6) {
        return {
          r: parseInt(v.slice(0, 2), 16),
          g: parseInt(v.slice(2, 4), 16),
          b: parseInt(v.slice(4, 6), 16),
        };
      }
      return { r: 217, g: 182, b: 109 };
    },
    cream() {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--particle").trim().replace("#", "");
      if (v.length >= 6) {
        return { r: parseInt(v.slice(0,2),16), g: parseInt(v.slice(2,4),16), b: parseInt(v.slice(4,6),16) };
      }
      return { r: 235, g: 240, b: 248 };
    },
    /* memoized radial glow sprite — gives every dot a luminous core + halo */
    _sprites: {},
    glow(r, g, b, coreA) {
      const key = r + "," + g + "," + b + "," + coreA;
      let c = this._sprites[key];
      if (c) return c;
      const S = 64;
      c = document.createElement("canvas");
      c.width = S; c.height = S;
      const x = c.getContext("2d");
      const grad = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      grad.addColorStop(0, `rgba(${r},${g},${b},${coreA})`);
      grad.addColorStop(0.18, `rgba(${r},${g},${b},${coreA * 0.5})`);
      grad.addColorStop(0.45, `rgba(${r},${g},${b},${coreA * 0.12})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      x.fillStyle = grad;
      x.fillRect(0, 0, S, S);
      this._sprites[key] = c;
      return c;
    },
    /* draw a glowing dot: sharp core + soft halo */
    dot(ctx, x, y, rad, r, g, b, alpha) {
      const sp = this.glow(r, g, b, 0.95);
      const sz = rad * 7 + 3;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.drawImage(sp, x - sz / 2, y - sz / 2, sz, sz);
      ctx.restore();
      ctx.fillStyle = `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 40)},${Math.min(1, alpha * 1.1).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(0.8, rad * 0.62), 0, 6.2832);
      ctx.fill();
    },
    fit(canvas) {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w: r.width, h: r.height };
    },
    /* run cb(now) every frame while el is on screen */
    run(el, cb) {
      let visible = false, raf = 0;
      function loop(now) {
        raf = 0;
        cb(now);
        if (visible) raf = requestAnimationFrame(loop);
      }
      function kick() { if (!raf && visible) raf = requestAnimationFrame(loop); }
      function check() {
        const r = el.getBoundingClientRect();
        const vis = r.bottom > -80 && r.top < window.innerHeight + 80;
        if (vis !== visible) {
          visible = vis;
          if (visible) kick();
        }
      }
      new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
        if (visible) kick();
      }, { rootMargin: "80px" }).observe(el);
      // positional fallback in case IO never fires in this context
      let chkRaf = 0;
      window.addEventListener("scroll", () => {
        if (!chkRaf) chkRaf = requestAnimationFrame(() => { chkRaf = 0; check(); });
      }, { passive: true });
      setInterval(check, 1200);
      check();
      document.addEventListener("visibilitychange", () => { if (!document.hidden) kick(); });
      return { kick };
    },
  });

  /* ---------- nav state ---------- */
  const nav = document.getElementById("siteNav");
  function navState() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", navState, { passive: true });
  navState();

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.18 }
  );
  document.querySelectorAll(".rv").forEach((el) => io.observe(el));

  /* ---------- flow steps (Scene 03) ---------- */
  const fio = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          fio.unobserve(e.target);
        }
      }
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".flow-step").forEach((el) => fio.observe(el));

  /* ---------- resilience fallbacks ----------
     Some embedded contexts never start CSS keyframe animations and
     never fire IntersectionObserver callbacks. Critical content must
     not stay hidden in that case. */

  // 1) hero keyframe watchdog: if animations never get a startTime,
  //    force the hero copy visible via a CSS override class.
  setTimeout(() => {
    try {
      const anims = document.getAnimations ? document.getAnimations() : [];
      const stuck = anims.length &&
        anims.every((a) => a.startTime === null && (a.currentTime === 0 || a.currentTime === null));
      if (stuck) document.body.classList.add("anims-stuck");
    } catch (e) {
      document.body.classList.add("anims-stuck");
    }
  }, 5000);

  // 2) reveal fallback: position-based check in case IO never fires.
  function revealSweep() {
    const vh = window.innerHeight;
    let pending = 0;
    document.querySelectorAll(".rv:not(.in), .flow-step:not(.in)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.85 && r.bottom > 0) el.classList.add("in");
      else pending++;
    });
    return pending;
  }
  let sweepRaf = 0;
  window.addEventListener("scroll", () => {
    if (!sweepRaf) sweepRaf = requestAnimationFrame(() => { sweepRaf = 0; revealSweep(); });
  }, { passive: true });
  const sweepTimer = setInterval(() => {
    const start = document.querySelectorAll(".rv:not(.in), .flow-step:not(.in)").length;
    revealSweep();
    if (document.querySelectorAll(".rv:not(.in), .flow-step:not(.in)").length === 0) clearInterval(sweepTimer);
    void start;
  }, 900);

  /* ============================================================
     SCENE 01 — connection (scroll-driven sticky canvas)
     ============================================================ */
  const scene = document.getElementById("connectScene");
  const canvas = document.getElementById("connectCanvas");
  if (!scene || !canvas) return;
  const ctx = canvas.getContext("2d");
  const words = Array.from(scene.querySelectorAll(".connect-words p"));

  let W = 0, H = 0;
  let nodes = [], edges = [], pulses = [];

  function buildNetwork() {
    const size = UTIL.fit(canvas);
    W = size.w; H = size.h;
    nodes = [];
    const N = W > 760 ? 26 : 16;
    const minD = Math.min(W, H) * 0.13;
    let guard = 0;
    while (nodes.length < N && guard < 4000) {
      guard++;
      const x = W * (0.08 + Math.random() * 0.84);
      const y = H * (0.14 + Math.random() * 0.72);
      let ok = true;
      for (const n of nodes) {
        const dx = n.x - x, dy = n.y - y;
        if (dx * dx + dy * dy < minD * minD) { ok = false; break; }
      }
      if (ok) nodes.push({ x, y, ph: Math.random() * 6.28, r: 1.6 + Math.random() * 1.8 });
    }
    // edges: each node to its 2 nearest
    const set = new Set();
    edges = [];
    nodes.forEach((n, i) => {
      const near = nodes
        .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const o of near) {
        const key = Math.min(i, o.j) + "-" + Math.max(i, o.j);
        if (!set.has(key)) {
          set.add(key);
          edges.push({ a: i, b: o.j });
        }
      }
    });
    // growth order: BFS from the node nearest center
    let seed = 0, best = Infinity;
    nodes.forEach((n, i) => {
      const d = (n.x - W / 2) ** 2 + (n.y - H / 2) ** 2;
      if (d < best) { best = d; seed = i; }
    });
    const adj = new Map();
    edges.forEach((e, idx) => {
      (adj.get(e.a) || adj.set(e.a, []).get(e.a)).push(idx);
      (adj.get(e.b) || adj.set(e.b, []).get(e.b)).push(idx);
    });
    const seen = new Set([seed]);
    const usedE = new Set();
    const order = [];
    let frontier = [seed];
    while (frontier.length) {
      const next = [];
      for (const v of frontier) {
        for (const ei of adj.get(v) || []) {
          if (usedE.has(ei)) continue;
          usedE.add(ei);
          order.push(edges[ei]);
          const e = edges[ei];
          const o = e.a === v ? e.b : e.a;
          if (!seen.has(o)) { seen.add(o); next.push(o); }
        }
      }
      frontier = next;
    }
    // append any unreached edges
    edges.forEach((e, ei) => { if (!usedE.has(ei)) order.push(e); });
    edges = order;
    pulses = [];
  }

  function progress() {
    const r = scene.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = r.height - vh;
    if (total <= 0) return 0;
    return Math.max(0, Math.min(1, -r.top / total));
  }

  function wordAlpha(p, lo, hi) {
    const fade = 0.07;
    if (p < lo || p > hi) return 0;
    if (p < lo + fade) return (p - lo) / fade;
    if (p > hi - fade) return (hi - p) / fade;
    return 1;
  }

  function drawConnect(now) {
    const p = REDUCED ? 1 : progress();
    const AC = UTIL.accent();
      const CW = UTIL.cream();
    const time = now * 0.001;
    ctx.clearRect(0, 0, W, H);

    const ease = p * p * (3 - 2 * p);
    const shown = Math.min(edges.length, Math.floor(ease * 1.18 * edges.length));
    const litNodes = new Set();
    for (let i = 0; i < shown; i++) {
      litNodes.add(edges[i].a);
      litNodes.add(edges[i].b);
    }

    const pos = (i) => {
      const n = nodes[i];
      return {
        x: n.x + Math.sin(time * 0.4 + n.ph) * 6,
        y: n.y + Math.cos(time * 0.33 + n.ph) * 6,
      };
    };

    // edges
    ctx.lineWidth = 1;
    for (let i = 0; i < shown; i++) {
      const fadeIn = Math.min(1, (ease * 1.18 * edges.length - i));
      const a = pos(edges[i].a), b = pos(edges[i].b);
      ctx.strokeStyle = `rgba(255,255,255,${(0.14 * fadeIn).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // pulses of light travelling along revealed edges
    if (!REDUCED && shown > 1 && Math.random() < 0.07 && pulses.length < 22) {
      pulses.push({ e: (Math.random() * shown) | 0, t: 0, sp: 0.006 + Math.random() * 0.008 });
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const pl = pulses[i];
      pl.t += pl.sp;
      if (pl.t >= 1 || pl.e >= shown) { pulses.splice(i, 1); continue; }
      const a = pos(edges[pl.e].a), b = pos(edges[pl.e].b);
      const x = a.x + (b.x - a.x) * pl.t;
      const y = a.y + (b.y - a.y) * pl.t;
      const fade = Math.sin(pl.t * Math.PI);
      UTIL.dot(ctx, x, y, 2.2, AC.r, AC.g, AC.b, fade * 0.95);
    }

    // nodes
    for (let i = 0; i < nodes.length; i++) {
      const lit = litNodes.has(i);
      const q = pos(i);
      if (lit) {
        UTIL.dot(ctx, q.x, q.y, nodes[i].r + 0.6, AC.r, AC.g, AC.b, 0.9);
        ctx.strokeStyle = `rgba(${AC.r},${AC.g},${AC.b},0.22)`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, nodes[i].r + 6 + Math.sin(time * 1.4 + nodes[i].ph) * 1.6, 0, 6.2832);
        ctx.stroke();
      } else {
        UTIL.dot(ctx, q.x, q.y, nodes[i].r * 0.8, CW.r, CW.g, CW.b, 0.3);
      }
    }

    // word phases
    const wins = [[0.02, 0.32], [0.36, 0.64], [0.68, 0.98]];
    words.forEach((el, i) => {
      const a = REDUCED ? (i === 2 ? 1 : 0) : wordAlpha(p, wins[i][0], wins[i][1]);
      el.style.opacity = a.toFixed(3);
      el.style.transform = `translateY(${((1 - a) * 18).toFixed(1)}px)`;
    });
  }

  buildNetwork();
  let rsT;
  window.addEventListener("resize", () => {
    clearTimeout(rsT);
    rsT = setTimeout(buildNetwork, 150);
  });

  if (REDUCED) {
    drawConnect(performance.now());
  } else {
    UTIL.run(scene.querySelector(".connect-sticky"), drawConnect);
  }
})();
