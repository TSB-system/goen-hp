/* ============================================================
   語縁 GOEN — node visuals
   Scene 05 services constellation / Scene 06 growing network /
   Scene 07 converging circle
   ============================================================ */
(function () {
  "use strict";
  const UTIL = window.GOEN_UTIL;
  if (!UTIL) return;
  const REDUCED = UTIL.reduced;

  /* ============================================================
     SCENE 05 — services constellation
     ============================================================ */
  (function services() {
    const canvas = document.getElementById("svcCanvas");
    const detail = document.getElementById("svcDetail");
    if (!canvas || !detail) return;
    const ctx = canvas.getContext("2d");

    const DATA = window.GOEN_SVC_DATA || [
      { jp: "Webサイト設計", en: "WEBSITE", desc: "事業の核となる「信頼の拠点」を設計します。見た目の装飾ではなく、誰に・何を・どう伝えるかという構造から。" },
      { jp: "ランディングページ", en: "LANDING PAGE", desc: "一つの目的に、一つのページ。広告や検索から訪れた人が、迷わず行動に至る導線を磨き上げます。" },
      { jp: "MEO対策", en: "LOCAL SEO / MEO", desc: "「近くの誰か」に見つけてもらう。検索と地図の上に、ビジネスとの最初の接点をつくります。" },
      { jp: "LINEマーケティング", en: "LINE MARKETING", desc: "一度の出会いを、続く関係へ。距離の近いコミュニケーションで、再訪と指名につなげます。" },
      { jp: "SNS運用", en: "SOCIAL MEDIA", desc: "日々の発信を、流れて消えるものではなく資産に。認知が信頼へ育つ場所を運用します。" },
    ];

    let W = 0, H = 0, sel = 0, hover = -1;
    let pulses = [];

    function layout() {
      const s = UTIL.fit(canvas);
      W = s.w; H = s.h;
    }

    function nodePos(i, time) {
      const cx = W / 2, cy = H / 2;
      const r = Math.min(W, H) * 0.36;
      const a = -Math.PI / 2 + (i * Math.PI * 2) / DATA.length;
      return {
        x: cx + Math.cos(a) * r + Math.sin(time * 0.5 + i * 1.7) * 7,
        y: cy + Math.sin(a) * r + Math.cos(time * 0.42 + i * 2.1) * 7,
      };
    }

    function draw(now) {
      const AC = UTIL.accent();
      const CW = UTIL.cream();
      const time = REDUCED ? 0 : now * 0.001;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const pts = DATA.map((_, i) => nodePos(i, time));

      // ring edges between adjacent services
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const j = (i + 1) % pts.length;
        ctx.strokeStyle = "rgba(255,255,255,0.07)";
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
      // spokes
      for (let i = 0; i < pts.length; i++) {
        const on = i === sel;
        ctx.strokeStyle = on
          ? `rgba(${AC.r},${AC.g},${AC.b},0.55)`
          : "rgba(255,255,255,0.14)";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      }

      // pulses centre -> selected node
      if (!REDUCED && Math.random() < 0.05 && pulses.length < 6) {
        pulses.push({ t: 0 });
      }
      const sp = pts[sel];
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pl = pulses[i];
        pl.t += 0.014;
        if (pl.t >= 1) { pulses.splice(i, 1); continue; }
        const x = cx + (sp.x - cx) * pl.t;
        const y = cy + (sp.y - cy) * pl.t;
        UTIL.dot(ctx, x, y, 2.4, AC.r, AC.g, AC.b, Math.sin(pl.t * Math.PI) * 0.95);
      }

      // centre node 語縁 — layered halo + double ring
      const haloG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      haloG.addColorStop(0, `rgba(${AC.r},${AC.g},${AC.b},0.16)`);
      haloG.addColorStop(0.55, `rgba(${AC.r},${AC.g},${AC.b},0.05)`);
      haloG.addColorStop(1, `rgba(${AC.r},${AC.g},${AC.b},0)`);
      ctx.fillStyle = haloG;
      ctx.fillRect(cx - 90, cy - 90, 180, 180);
      ctx.strokeStyle = `rgba(${AC.r},${AC.g},${AC.b},0.55)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 44, 0, 6.2832);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${AC.r},${AC.g},${AC.b},${(0.18 + Math.sin(time * 1.2) * 0.08).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 52 + Math.sin(time * 1.2) * 2, 0, 6.2832);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.font = '700 19px "Zen Old Mincho", serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("語縁", cx, cy + 1);

      // service nodes + labels
      for (let i = 0; i < pts.length; i++) {
        const on = i === sel, hv = i === hover;
        const q = pts[i];
        if (on) {
          ctx.strokeStyle = `rgba(${AC.r},${AC.g},${AC.b},0.35)`;
          ctx.beginPath();
          ctx.arc(q.x, q.y, 15 + Math.sin(time * 1.6) * 2, 0, 6.2832);
          ctx.stroke();
        }
        if (on) UTIL.dot(ctx, q.x, q.y, 6, AC.r, AC.g, AC.b, 1);
        else if (hv) UTIL.dot(ctx, q.x, q.y, 4.5, CW.r, CW.g, CW.b, 0.9);
        else UTIL.dot(ctx, q.x, q.y, 3.6, CW.r, CW.g, CW.b, 0.42);

        const above = q.y < cy;
        ctx.fillStyle = on
          ? `rgba(${AC.r},${AC.g},${AC.b},0.95)`
          : "rgba(181,188,199,0.85)";
        ctx.font = '600 13px "Shippori Mincho", serif';
        ctx.textBaseline = above ? "bottom" : "top";
        ctx.fillText(DATA[i].jp, q.x, q.y + (above ? -16 : 16));
      }
      ctx.textBaseline = "alphabetic";
    }

    function select(i) {
      if (i === sel) return;
      sel = i;
      pulses = [];
      const inner = detail.querySelector(".svc-detail-inner");
      inner.classList.add("swap");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detail.querySelector(".svc-detail-en").textContent = "0" + (i + 1) + " — " + DATA[i].en;
          detail.querySelector(".svc-detail-name").textContent = DATA[i].jp;
          detail.querySelector(".svc-detail-desc").textContent = DATA[i].desc;
          const metaEl = detail.querySelector(".svc-meta");
          if (metaEl) {
            metaEl.innerHTML = (DATA[i].meta || [])
              .map((r) => '<div class="svc-meta-row"><dt>' + r[0] + "</dt><dd>" + r[1] + "</dd></div>")
              .join("");
          }
          inner.classList.remove("swap");
        });
      });
      document.querySelectorAll(".svc-tab").forEach((b, j) =>
        b.classList.toggle("on", j === i)
      );
      if (REDUCED) draw(performance.now());
    }

    function hitTest(e) {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const time = REDUCED ? 0 : performance.now() * 0.001;
      for (let i = 0; i < DATA.length; i++) {
        const q = nodePos(i, time);
        const dx = q.x - x, dy = q.y - y;
        if (dx * dx + dy * dy < 28 * 28) return i;
      }
      return -1;
    }
    canvas.addEventListener("pointermove", (e) => {
      hover = hitTest(e);
      canvas.classList.toggle("is-hot", hover >= 0);
    });
    canvas.addEventListener("pointerleave", () => { hover = -1; canvas.classList.remove("is-hot"); });
    canvas.addEventListener("click", (e) => {
      const i = hitTest(e);
      if (i >= 0) select(i);
    });
    document.querySelectorAll(".svc-tab").forEach((b, i) =>
      b.addEventListener("click", () => select(i))
    );

    layout();
    let rsT;
    window.addEventListener("resize", () => {
      clearTimeout(rsT);
      rsT = setTimeout(() => { layout(); if (REDUCED) draw(performance.now()); }, 150);
    });
    if (REDUCED) draw(performance.now());
    else UTIL.run(canvas.parentElement, draw);
    window.addEventListener("goen:config", () => { if (REDUCED) draw(performance.now()); });
  })();

  /* ============================================================
     SCENE 06 — growing network
     ============================================================ */
  (function growth() {
    const canvas = document.getElementById("whyCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0;
    let nodes = [], links = [], pulses = [];
    let frame = 0;
    const MAX = 34;

    function layout() {
      const s = UTIL.fit(canvas);
      W = s.w; H = s.h;
      nodes = [];
      links = [];
      pulses = [];
      frame = 0;
      addNode(W / 2, H / 2);
    }
    function addNode(fx, fy) {
      const x = fx != null ? fx : W * (0.1 + Math.random() * 0.8);
      const y = fy != null ? fy : H * (0.1 + Math.random() * 0.8);
      const n = { x, y, born: frame, ph: Math.random() * 6.28 };
      if (nodes.length) {
        const near = nodes
          .map((m, j) => ({ j, d: (m.x - x) ** 2 + (m.y - y) ** 2 }))
          .sort((a, b) => a.d - b.d)
          .slice(0, nodes.length > 6 && Math.random() < 0.3 ? 2 : 1);
        for (const o of near) links.push({ a: nodes.length, b: o.j, born: frame });
      }
      nodes.push(n);
    }

    function draw(now) {
      const AC = UTIL.accent();
      const CW = UTIL.cream();
      const time = REDUCED ? 0 : now * 0.001;
      frame++;
      if (!REDUCED && nodes.length < MAX && frame % 34 === 0) addNode();
      ctx.clearRect(0, 0, W, H);

      const pos = (i) => ({
        x: nodes[i].x + Math.sin(time * 0.4 + nodes[i].ph) * 5,
        y: nodes[i].y + Math.cos(time * 0.35 + nodes[i].ph) * 5,
      });

      ctx.lineWidth = 1;
      for (const l of links) {
        const age = Math.min(1, (frame - l.born) / 40);
        const a = pos(l.a), b = pos(l.b);
        const bx = a.x + (b.x - a.x) * age, by = a.y + (b.y - a.y) * age;
        ctx.strokeStyle = `rgba(255,255,255,${(0.05 + age * 0.08).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      if (!REDUCED && links.length > 2 && Math.random() < 0.05 && pulses.length < 12) {
        pulses.push({ l: (Math.random() * links.length) | 0, t: 0 });
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pl = pulses[i];
        pl.t += 0.012;
        if (pl.t >= 1) { pulses.splice(i, 1); continue; }
        const a = pos(links[pl.l].a), b = pos(links[pl.l].b);
        UTIL.dot(ctx, a.x + (b.x - a.x) * pl.t, a.y + (b.y - a.y) * pl.t, 2.2, AC.r, AC.g, AC.b, Math.sin(pl.t * Math.PI) * 0.9);
      }

      for (let i = 0; i < nodes.length; i++) {
        const q = pos(i);
        const fresh = Math.min(1, (frame - nodes[i].born) / 30);
        const isRoot = i === 0;
        if (isRoot) UTIL.dot(ctx, q.x, q.y, 4.2, AC.r, AC.g, AC.b, 1);
        else UTIL.dot(ctx, q.x, q.y, 1.6 + fresh * 1.2, CW.r, CW.g, CW.b, 0.24 + fresh * 0.4);
      }
    }

    layout();
    if (REDUCED) {
      // build the full network instantly, draw once
      frame = 10000;
      while (nodes.length < MAX) addNode();
      frame += 100;
      draw(performance.now());
    } else {
      UTIL.run(canvas.parentElement, draw);
    }
    let rsT;
    window.addEventListener("resize", () => {
      clearTimeout(rsT);
      rsT = setTimeout(() => {
        layout();
        if (REDUCED) {
          frame = 10000;
          while (nodes.length < MAX) addNode();
          frame += 100;
          draw(performance.now());
        }
      }, 150);
    });
  })();

  /* ============================================================
     SCENE 07 — particles converge into a perfect circle
     ============================================================ */
  (function finale() {
    const canvas = document.getElementById("finaleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, parts = [], conv = 0, rot = 0, seen = false;

    function layout() {
      const s = UTIL.fit(canvas);
      W = s.w; H = s.h;
      parts = [];
      const N = 300;
      for (let i = 0; i < N; i++) {
        parts.push({
          sx: Math.random() * W,
          sy: Math.random() * H,
          a: (i / N) * Math.PI * 2,
          j: (Math.random() - 0.5) * 0.05,
          s: 0.8 + Math.random() * 1.4,
          d: Math.random() * 0.5,
        });
      }
    }

    function draw(now) {
      const AC = UTIL.accent();
      const CW = UTIL.cream();
      if (!seen) {
        const r = canvas.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.8 && r.bottom > 0) seen = true;
      }
      if (seen && conv < 1) conv = Math.min(1, conv + 0.006);
      rot += 0.0012;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const R = Math.min(W, H) * 0.36;

      const ringPts = [];
      for (const p of parts) {
        const f = Math.max(0, Math.min(1, (conv - p.d) / 0.5));
        const e = f * f * (3 - 2 * f);
        const ang = p.a + rot + p.j;
        const tx = cx + Math.cos(ang) * R;
        const ty = cy + Math.sin(ang) * R;
        const x = p.sx + (tx - p.sx) * e;
        const y = p.sy + (ty - p.sy) * e;
        ringPts.push({ x, y, e });
        const cr = Math.round(255 - (255 - AC.r) * e);
        const cg = Math.round(255 - (255 - AC.g) * e);
        const cb = Math.round(255 - (255 - AC.b) * e);
        UTIL.dot(ctx, x, y, p.s * (1 + e * 0.7), cr, cg, cb, 0.3 + e * 0.62);
      }

      // join neighbours once mostly converged
      if (conv > 0.55) {
        const a = (conv - 0.55) / 0.45;
        ctx.strokeStyle = `rgba(${AC.r},${AC.g},${AC.b},${(a * 0.3).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < ringPts.length; i++) {
          const q = ringPts[i];
          if (i === 0) ctx.moveTo(q.x, q.y);
          else ctx.lineTo(q.x, q.y);
        }
        ctx.closePath();
        ctx.stroke();
        // luminous ring glow behind the perfect circle
        const gg = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.18);
        gg.addColorStop(0, `rgba(${AC.r},${AC.g},${AC.b},0)`);
        gg.addColorStop(0.5, `rgba(${AC.r},${AC.g},${AC.b},${(a * 0.07).toFixed(3)})`);
        gg.addColorStop(1, `rgba(${AC.r},${AC.g},${AC.b},0)`);
        ctx.fillStyle = gg;
        ctx.fillRect(cx - R * 1.3, cy - R * 1.3, R * 2.6, R * 2.6);
      }
    }

    layout();
    new IntersectionObserver((es) => {
      if (es[0].isIntersecting) seen = true;
    }, { threshold: 0.3 }).observe(canvas);

    if (REDUCED) {
      seen = true; conv = 1;
      draw(performance.now());
    } else {
      UTIL.run(canvas, draw);
    }
    let rsT;
    window.addEventListener("resize", () => {
      clearTimeout(rsT);
      rsT = setTimeout(() => {
        layout();
        if (REDUCED) { conv = 1; draw(performance.now()); }
      }, 150);
    });
  })();
})();
