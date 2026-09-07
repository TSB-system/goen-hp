/* Section backgrounds are independent of the hero/video carousel. */
(() => {
  'use strict';
  const root = document.querySelector('.watercolor-content');
  const picture = root?.querySelector('.continuous-scape');
  const image = picture?.querySelector('img');
  const source = picture?.querySelector('source');
  if (!root || !image || !source) return;
  const scenes = ['quality', 'problem', 'system', 'service', 'works', 'insight', 'plans', 'flow', 'faq', 'about', 'contact'];
  const sections = [...root.querySelectorAll(':scope > section[id]')].filter(section => scenes.includes(section.id));
  const mobile = matchMedia('(max-width: 768px)');
  const path = (id, small) => `assets/images/section-watercolors/${id}-v1${small ? '-900' : ''}.webp`;
  const cache = new Map();
  let requested = '', revision = 0, frame = 0;
  const ready = url => {
    if (!cache.has(url)) cache.set(url, new Promise((resolve, reject) => {
      const preload = new Image();
      preload.onload = () => preload.decode().then(resolve, reject);
      preload.onerror = reject;
      preload.src = url;
    }).catch(error => { cache.delete(url); throw error; }));
    return cache.get(url);
  };
  async function show(section, index) {
    const small = mobile.matches;
    const key = `${section.id}:${small}`;
    if (key === requested) return;
    requested = key;
    const ticket = ++revision;
    try {
      await ready(path(section.id, small));
      if (ticket !== revision) return;
      source.srcset = path(section.id, true);
      image.src = path(section.id, false);
      picture.dataset.section = section.id;
      const next = sections[index + 1];
      if (next) ready(path(next.id, small)).catch(() => {});
    } catch {
      if (ticket === revision) requested = '';
      // Keep the previous successfully loaded painting if a resource fails.
    }
  }
  function update() {
    frame = 0;
    const marker = Math.max(90, innerHeight * .34);
    let index = 0;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= marker) index = i;
    });
    if (sections[index]) show(sections[index], index);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('pageshow', schedule);
  mobile.addEventListener('change', schedule);
  new ResizeObserver(schedule).observe(root);
  update();
})();
