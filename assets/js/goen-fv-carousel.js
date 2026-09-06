/* 語縁 GOEN — FV スマホ縦動画カルーセル（PC / SP 共通・素の JS のみ）
   中央 1 台のみ再生。両隣は先読み、それ以外は読み込まない。
   自動送り / 矢印 / ドット / キーボード / スワイプ / 画面外・非表示タブで停止。 */
(() => {
  "use strict";
  const root = document.querySelector("[data-fv-carousel]");
  if (!root) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = navigator.connection;
  const saveData = !!(conn && conn.saveData);
  const noVideo = reduce || saveData;

  const items = [...root.querySelectorAll("[data-fv-item]")];
  const n = items.length;
  if (!n) return;

  const prevBtn = root.querySelector("[data-fv-prev]");
  const nextBtn = root.querySelector("[data-fv-next]");
  const dotsWrap = root.querySelector("[data-fv-dots]");
  const counter = root.querySelector("[data-fv-current]");
  const visible = parseInt(root.dataset.fvVisible || "5", 10);
  const interval = parseInt(root.dataset.fvInterval || "6000", 10);
  const half = Math.floor(visible / 2);

  let active = 0;
  let timer = null;
  let inView = true;
  let hovering = false;

  const videoOf = (el) => el.querySelector("video");
  const loaded = new WeakSet();
  const ensureLoaded = (v) => {
    if (!v || noVideo || loaded.has(v)) return;
    loaded.add(v);
    v.load();
  };
  const play = (v) => {
    if (!v || noVideo) return;
    ensureLoaded(v);
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };
  const pause = (v) => { if (v && !v.paused) v.pause(); };

  const dots = items.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `${i + 1}本目の動画を表示`);
    b.addEventListener("click", () => { active = i; render(); restart(); });
    if (dotsWrap) dotsWrap.appendChild(b);
    return b;
  });

  const render = () => {
    items.forEach((el, i) => {
      let off = i - active;
      if (off > n / 2) off -= n;
      if (off < -n / 2) off += n;
      const shown = Math.abs(off) <= half;
      el.dataset.pos = shown ? String(off) : "hidden";
      el.setAttribute("aria-hidden", off === 0 ? "false" : "true");
      const v = videoOf(el);
      if (off === 0) {
        if (inView && !document.hidden) play(v);
      } else {
        pause(v);
        if (Math.abs(off) === 1) ensureLoaded(v);
      }
    });
    dots.forEach((d, i) => d.setAttribute("aria-current", i === active ? "true" : "false"));
    if (counter) counter.textContent = String(active + 1).padStart(2, "0");
  };

  const go = (d) => { active = (active + d + n) % n; render(); restart(); };
  const tick = () => {
    if (!inView || hovering || document.hidden) return;
    active = (active + 1) % n;
    render();
  };
  const restart = () => {
    clearInterval(timer);
    if (reduce) return;
    timer = setInterval(tick, interval);
  };

  if (prevBtn) prevBtn.addEventListener("click", () => go(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => go(1));
  root.addEventListener("mouseenter", () => { hovering = true; });
  root.addEventListener("mouseleave", () => { hovering = false; });
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
  });
  items.forEach((el, i) => {
    el.addEventListener("click", () => {
      if (i === active) return;
      active = i; render(); restart();
    });
  });

  /* スワイプ */
  let sx = 0, sy = 0, swiping = false;
  root.addEventListener("touchstart", (e) => {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiping = true;
  }, { passive: true });
  root.addEventListener("touchend", (e) => {
    if (!swiping) return;
    swiping = false;
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* 画面外・非表示タブでは止める */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        inView = entry.isIntersecting;
        const v = videoOf(items[active]);
        if (inView) play(v); else pause(v);
      });
    }, { threshold: 0.2 }).observe(root);
  }
  document.addEventListener("visibilitychange", () => {
    const v = videoOf(items[active]);
    if (document.hidden) pause(v); else if (inView) play(v);
  });

  render();
  restart();
})();
