/* ============================================================
   語縁 GOEN — hero particle field
   Thousands of drifting particles; connections form near the
   cursor; the field condenses into the 語縁 glyph.
   ============================================================ */
(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const host = canvas.parentElement;
  const root = document.documentElement;

  let W = 0, H = 0, DPR = 1;
  let particles = [];
  let glyphNorm = [];          // normalized glyph sample points
  let targetsReady = false;
  let lastDensity = null;
  let visible = true, rafId = 0;
  let t0 = performance.now();
  let ox = 0, oy = 0;            // smoothed glyph parallax offset
  let rings = [], ringT = 0;     // pulse rings after formation
  const mouse = { x: -9e3, y: -9e3 };

  /* ---------- glow sprites (pre-rendered) ---------- */
  let spW, spA, spStar, spJade; // ambient / glyph / star / jade glow
  function makeGlowSprite(r, g, b, coreA) {
    const S = 64, c = document.createElement("canvas");
    c.width = S; c.height = S;
    const x = c.getContext("2d");
    const grad = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    grad.addColorStop(0, `rgba(${r},${g},${b},${coreA})`);
    grad.addColorStop(0.18, `rgba(${r},${g},${b},${coreA * 0.5})`);
    grad.addColorStop(0.45, `rgba(${r},${g},${b},${coreA * 0.12})`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = grad;
    x.fillRect(0, 0, S, S);
    return c;
  }
  function makeStarSprite(r, g, b) {
    const S = 96, c = document.createElement("canvas");
    c.width = S; c.height = S;
    const x = c.getContext("2d");
    const cx = S / 2;
    const grad = x.createRadialGradient(cx, cx, 0, cx, cx, S * 0.22);
    grad.addColorStop(0, `rgba(255,255,255,0.9)`);
    grad.addColorStop(0.3, `rgba(${r},${g},${b},0.55)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = grad;
    x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = "lighter";
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      const lg = x.createLinearGradient(cx - dx * cx, cx - dy * cx, cx + dx * cx, cx + dy * cx);
      lg.addColorStop(0, `rgba(${r},${g},${b},0)`);
      lg.addColorStop(0.5, `rgba(${r},${g},${b},0.55)`);
      lg.addColorStop(1, `rgba(${r},${g},${b},0)`);
      x.strokeStyle = lg;
      x.lineWidth = 1.2;
      x.beginPath();
      x.moveTo(cx - dx * cx, cx - dy * cx);
      x.lineTo(cx + dx * cx, cx + dy * cx);
      x.stroke();
    }
    return c;
  }
  function buildSprites() {
    spW = makeGlowSprite(CR.r, CR.g, CR.b, 0.85);
    spA = makeGlowSprite(GLYPH.r, GLYPH.g, GLYPH.b, 0.95);
    spStar = makeStarSprite(AC.r, AC.g, AC.b);
    spJade = JD ? makeGlowSprite(JD.r, JD.g, JD.b, 0.9) : null;
  }

  const cfg = () => Object.assign({ density: 1, connect: 1 }, window.GOEN_CONFIG);

  /* ---------- color (theme-aware; falls back to GOEN black-gold) ---------- */
  let AC = { r: 217, g: 182, b: 109 };
  let CR = { r: 235, g: 240, b: 248 };   // ambient particle (生成り白)
  let JD = null;                          // optional jade particle
  let GLYPH = AC;                         // formed 語縁 glyph color
  let LINE_BASE = "255,255,255";          // faint web color
  function parseCol(name) {
    const v = getComputedStyle(root).getPropertyValue(name).trim();
    if (!v) return null;
    const m = v.replace("#", "");
    if (/^[0-9a-fA-F]{6}$/.test(m)) {
      return { r: parseInt(m.slice(0,2),16), g: parseInt(m.slice(2,4),16), b: parseInt(m.slice(4,6),16) };
    }
    const rgb = v.match(/(\d+)[ ,]+(\d+)[ ,]+(\d+)/);
    if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3] };
    return null;
  }
  function parseAccent() {
    const a = parseCol("--accent"); if (a) AC = a;
    CR = parseCol("--particle") || { r: 235, g: 240, b: 248 };
    JD = parseCol("--particle-2");
    GLYPH = parseCol("--glyph") || AC;
    LINE_BASE = JD ? (JD.r + "," + JD.g + "," + JD.b) : "255,255,255";
  }
  parseAccent();
  buildSprites();

  /* ---------- layout ---------- */
  function glyphFrame() {
    const wide = W > 900;
    return {
      gw: Math.min(W * (wide ? 0.44 : 0.84), 720),
      gx: wide ? W * 0.67 : W * 0.5,
      gy: wide ? H * 0.42 : H * 0.3,
    };
  }

  function resize() {
    const r = host.getBoundingClientRect();
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    assignTargets();
  }

  /* ---------- particles ---------- */
  function buildParticles() {
    const count = Math.round(
      Math.min(1300, Math.max(320, (W * H) / 2100)) * cfg().density
    );
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        s: 0.8 + Math.random() * 1.3,
        z: 0.55 + Math.random() * 1.0,   // depth layer: far(0.55) → near(1.55)
        ph: Math.random() * Math.PI * 2,
        star: Math.random() < 0.035, jade: Math.random() < 0.14,    // rare sparkling accent particles
        tw: 0.5 + Math.random() * 1.2,  // twinkle speed
        ti: -1,           // glyph target index
        tx: 0, ty: 0,
        delay: Math.random() * 0.6,
      });
    }
    lastDensity = cfg().density;
    assignTargets();
  }

  function assignTargets() {
    if (!glyphNorm.length || !particles.length) return;
    const { gw, gx, gy } = glyphFrame();
    const budget = Math.min(glyphNorm.length, Math.floor(particles.length * 0.72));
    // evenly sample glyph points down to budget
    const step = glyphNorm.length / budget;
    let gi = 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (i < budget) {
        const n = glyphNorm[Math.min(glyphNorm.length - 1, Math.floor(gi))];
        gi += step;
        p.ti = 1;
        p.tx = gx + n.x * gw;
        p.ty = gy + n.y * gw;
      } else {
        p.ti = -1;
      }
    }
    targetsReady = true;
  }

  /* ---------- glyph sampling ---------- */
  function sampleGlyph() {
    const gw = 960, gh = 460;
    const oc = document.createElement("canvas");
    oc.width = gw; oc.height = gh;
    const o = oc.getContext("2d", { willReadFrequently: true });
    o.fillStyle = "#fff";
    o.font = '900 320px "Zen Old Mincho", "Hiragino Mincho ProN", serif';
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.fillText("語縁", gw / 2, gh / 2 + 14);
    const data = o.getImageData(0, 0, gw, gh).data;
    const pts = [];
    const gap = 8;
    for (let y = 0; y < gh; y += gap) {
      for (let x = 0; x < gw; x += gap) {
        if (data[(y * gw + x) * 4 + 3] > 120) {
          pts.push({
            x: (x - gw / 2 + (Math.random() - 0.5) * 3) / gw,
            y: (y - gh / 2 + (Math.random() - 0.5) * 3) / gw,
          });
        }
      }
    }
    // shuffle so sequential sampling stays spatially uniform
    for (let i = pts.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [pts[i], pts[j]] = [pts[j], pts[i]];
    }
    glyphNorm = pts;
    assignTargets();
  }

  /* ---------- simulation ---------- */
  function formProgress(now) {
    if (REDUCED) return 1;
    if (!targetsReady) return 0;
    const t = (now - t0 - 2300) / 3200; // start 2.3s, run 3.2s
    return Math.max(0, Math.min(1, t));
  }

  function update(now, dt) {
    const fp = formProgress(now);
    const time = now * 0.001;
    const pxo = mouse.x > -1000 ? (mouse.x - W / 2) * -0.018 : 0;
    const pyo = mouse.y > -1000 ? (mouse.y - H / 2) * -0.018 : 0;
    ox += (pxo - ox) * 0.04;
    oy += (pyo - oy) * 0.04;
    for (const p of particles) {
      if (p.ti > 0 && fp > p.delay) {
        const f = Math.min(1, (fp - p.delay) / Math.max(0.001, 1 - p.delay));
        const e = f * f * (3 - 2 * f);
        const k = 0.002 + 0.05 * e;
        p.vx += (p.tx + ox - p.x) * k;
        p.vy += (p.ty + oy - p.y) * k;
        p.vx *= 0.8;
        p.vy *= 0.8;
        // gentle repel so cursor disturbs the glyph
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 4900 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const push = (1 - d / 70) * 1.4;
          p.vx += (dx / d) * push;
          p.vy += (dy / d) * push;
        }
        p.x += p.vx * dt + Math.sin(time * 0.8 + p.ph) * 0.05;
        p.y += p.vy * dt + Math.cos(time * 0.7 + p.ph) * 0.05;
      } else {
        // free drift through a soft flow field
        p.vx += Math.sin(p.y * 0.004 + time * 0.22 + p.ph) * 0.004;
        p.vy += Math.cos(p.x * 0.004 + time * 0.18) * 0.004;
        // light attraction toward cursor — connections gather
        const dx = mouse.x - p.x, dy = mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 32400 && d2 > 900) {
          const d = Math.sqrt(d2);
          p.vx += (dx / d) * 0.012;
          p.vy += (dy / d) * 0.012;
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx * dt * p.z;
        p.y += p.vy * dt * p.z;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
      }
    }
    return fp;
  }

  /* ---------- rendering ---------- */
  function draw(fp, now) {
    // translucent wipe instead of clear → light trails
    ctx.fillStyle = "rgba(5,5,5,0.5)";
    ctx.fillRect(0, 0, W, H);
    const connect = cfg().connect;
    const freeDist = 86 * connect;
    const { gw, gx, gy } = glyphFrame();
    const glyphDist = Math.max(18, gw * 0.042);

    // soft glow behind the forming glyph
    if (fp > 0.15) {
      const a = (fp - 0.15) * 0.045;
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gw * 0.62);
      g.addColorStop(0, `rgba(${AC.r},${AC.g},${AC.b},${a.toFixed(3)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(gx - gw, gy - gw, gw * 2, gw * 2);
    }

    // spatial grid
    const cell = Math.max(freeDist, 40);
    const grid = new Map();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const k = (((p.x / cell) | 0) + 1000) * 100000 + (((p.y / cell) | 0) + 1000);
      const b = grid.get(k);
      if (b) b.push(i); else grid.set(k, [i]);
    }

    // connections
    ctx.lineWidth = 1;
    let lines = 0;
    const maxLines = 3200;
    const mActive = mouse.x > -1000;
    for (let i = 0; i < particles.length && lines < maxLines; i++) {
      const p = particles[i];
      const pFormed = p.ti > 0 && fp > p.delay + 0.25;
      const cx = ((p.x / cell) | 0) + 1000, cy = ((p.y / cell) | 0) + 1000;
      for (let ox = 0; ox <= 1; ox++) {
        for (let oy = ox === 0 ? 0 : -1; oy <= 1; oy++) {
          const b = grid.get((cx + ox) * 100000 + (cy + oy));
          if (!b) continue;
          for (const j of b) {
            if (j <= i && ox === 0 && oy === 0) continue;
            if (ox === 0 && oy === 0 && j === i) continue;
            const q = particles[j];
            const qFormed = q.ti > 0 && fp > q.delay + 0.25;
            const lim = pFormed && qFormed ? glyphDist : freeDist;
            const dx = p.x - q.x, dy = p.y - q.y;
            const d2 = dx * dx + dy * dy;
            if (d2 > lim * lim) continue;
            const d = Math.sqrt(d2);
            let a = (1 - d / lim);
            if (pFormed && qFormed) {
              ctx.strokeStyle = `rgba(${AC.r},${AC.g},${AC.b},${(a * 0.2).toFixed(3)})`;
            } else if (mActive) {
              const mx = (p.x + q.x) / 2 - mouse.x, my = (p.y + q.y) / 2 - mouse.y;
              const md2 = mx * mx + my * my;
              if (md2 < 48400) {
                const boost = 1 - Math.sqrt(md2) / 220;
                ctx.strokeStyle = `rgba(${AC.r},${AC.g},${AC.b},${(a * (0.06 + boost * 0.28)).toFixed(3)})`;
              } else {
                ctx.strokeStyle = `rgba(${LINE_BASE},${(a * 0.05).toFixed(3)})`;
              }
            } else {
              ctx.strokeStyle = `rgba(${LINE_BASE},${(a * 0.05).toFixed(3)})`;
            }
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
            if (++lines >= maxLines) break;
          }
          if (lines >= maxLines) break;
        }
        if (lines >= maxLines) break;
      }
    }

    // particles — glowing sprites, additive blend
    ctx.globalCompositeOperation = "lighter";
    const time = now * 0.001;
    for (const p of particles) {
      const formed = p.ti > 0 && fp > p.delay;
      // gentle twinkle: each particle breathes at its own rate
      const tw = 0.72 + 0.28 * Math.sin(time * p.tw * 1.7 + p.ph * 3);
      if (formed) {
        const f = Math.min(1, (fp - p.delay) / Math.max(0.001, 1 - p.delay));
        const sz = (p.s * 6 + 4) * (0.85 + 0.15 * tw);
        ctx.globalAlpha = (0.32 + f * 0.5) * tw;
        ctx.drawImage(spA, p.x - sz / 2, p.y - sz / 2, sz, sz);
      } else if (p.star) {
        const sz = (22 + p.s * 10 * tw) * p.z;
        ctx.globalAlpha = (0.5 + 0.5 * tw) * (0.4 + p.z * 0.4);
        ctx.drawImage(spStar, p.x - sz / 2, p.y - sz / 2, sz, sz);
      } else {
        const sz = (p.s * 5.5 + 3) * p.z;
        ctx.globalAlpha = (0.5 * tw + 0.14) * (0.35 + p.z * 0.45);
        ctx.drawImage(p.jade && spJade ? spJade : spW, p.x - sz / 2, p.y - sz / 2, sz, sz);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // GOEN caption under the glyph once formed
    if (fp > 0.75) {
      const a = (fp - 0.75) * 4 * 0.5;
      ctx.fillStyle = `rgba(${AC.r},${AC.g},${AC.b},${Math.min(0.5, a).toFixed(3)})`;
      ctx.font = '600 16px "Cormorant Garamond", serif';
      ctx.textAlign = "center";
      const sp = "G O E N";
      ctx.fillText(sp, gx, gy + gw * 0.33);
    }

    // pulse rings (glyph heartbeat + tap ripples)
    if (fp >= 1 && !REDUCED) {
      ringT++;
      if (ringT % 260 === 40 && rings.length < 4) {
        rings.push({ x: gx, y: gy, r: gw * 0.2, a: 0.3, v: 1.3 });
      }
    }
    for (let i = rings.length - 1; i >= 0; i--) {
      const rg = rings[i];
      rg.r += rg.v;
      rg.a *= 0.988;
      if (rg.a < 0.012) { rings.splice(i, 1); continue; }
      ctx.strokeStyle = `rgba(${AC.r},${AC.g},${AC.b},${rg.a.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(rg.x, rg.y, rg.r, 0, 6.2832);
      ctx.stroke();
    }
  }

  /* ---------- loop ---------- */
  let lastNow = performance.now();
  function frame(now) {
    rafId = 0;
    const dt = Math.min(2.5, (now - lastNow) / 16.7);
    lastNow = now;
    const fp = update(now, dt);
    draw(fp, now);
    if (visible && !REDUCED) rafId = requestAnimationFrame(frame);
  }
  function kick() {
    if (!rafId && visible && !REDUCED) {
      lastNow = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  }

  function staticRender() {
    // reduced motion: glyph fully formed, single frame
    for (const p of particles) {
      if (p.ti > 0) { p.x = p.tx; p.y = p.ty; }
    }
    draw(1, performance.now());
  }

  /* ---------- events ---------- */
  host.addEventListener("pointermove", (e) => {
    const r = host.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  host.addEventListener("pointerleave", () => { mouse.x = -9e3; mouse.y = -9e3; });

  // tap / click: ripple ring + particles surge outward from the touch
  host.addEventListener("pointerdown", (e) => {
    if (REDUCED) return;
    const r = host.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    rings.push({ x, y, r: 8, a: 0.4, v: 2.6 });
    for (const p of particles) {
      const dx = p.x - x, dy = p.y - y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 19600 && d2 > 1) {
        const d = Math.sqrt(d2);
        const push = (1 - d / 140) * 3.2;
        p.vx += (dx / d) * push;
        p.vy += (dy / d) * push;
      }
    }
    kick();
  });

  let rsT;
  window.addEventListener("resize", () => {
    clearTimeout(rsT);
    rsT = setTimeout(() => { resize(); if (REDUCED) staticRender(); }, 150);
  });

  new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
    if (visible) kick();
  }).observe(host);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) kick();
  });

  window.addEventListener("goen:config", () => {
    parseAccent();
    buildSprites();
    if (cfg().density !== lastDensity) buildParticles();
    if (REDUCED) staticRender();
  });

  /* ---------- boot ---------- */
  resize();
  buildParticles();
  kick();

  const fontReady = Promise.race([
    document.fonts.load('900 320px "Zen Old Mincho"').then(() => document.fonts.ready),
    new Promise((res) => setTimeout(res, 2600)),
  ]);
  fontReady.then(() => {
    sampleGlyph();
    t0 = Math.max(t0, performance.now() - 2300); // formation may begin now
    if (REDUCED) staticRender();
  });
})();
