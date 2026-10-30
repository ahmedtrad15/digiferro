/* Digiferro · carte de France : trains animés seulement quand la carte est visible */
(() => {
  const maps = document.querySelectorAll('[data-map]');
  if (!maps.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  maps.forEach((svg) => {
    if (typeof svg.pauseAnimations !== 'function') return;
    svg.pauseAnimations();
    if (reduced.matches) return;
    if (!('IntersectionObserver' in window)) {
      svg.unpauseAnimations();
      return;
    }
    new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting && !reduced.matches) svg.unpauseAnimations();
        else svg.pauseAnimations();
      },
      { threshold: 0.2 }
    ).observe(svg);
  });
})();
