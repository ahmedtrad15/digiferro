/* Digiferro · apparitions au défilement et rails qui se tracent selon la progression */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll('.reveal, [data-map]');

  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
  }

  // --rail-progress : 1 = rail non tracé, 0 = rail complet
  const rails = [...document.querySelectorAll('[data-rail-progress]')];
  if (!rails.length) return;
  if (reduced) {
    rails.forEach((r) => r.style.setProperty('--rail-progress', '0'));
    return;
  }
  let ticking = false;
  const update = () => {
    const vh = innerHeight;
    rails.forEach((r) => {
      const top = r.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (vh * 0.95 - top) / (vh * 0.55)));
      r.style.setProperty('--rail-progress', (1 - p).toFixed(3));
    });
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
})();
