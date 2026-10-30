/* Digiferro · vidéo du héros
   La vidéo n'est chargée que sur écran ≥ 768 px, hors mode économie de données
   et hors préférence « mouvement réduit ». Sinon, l'image d'affiche reste seule. */
(() => {
  const video = document.querySelector('[data-hero-video]');
  if (!video) return;
  const btn = document.querySelector('[data-video-toggle]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 47.99em)');
  const conn = navigator.connection || {};
  const saveData = conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || '');

  if (reduced.matches || small.matches || saveData) return;

  const sources = [...video.querySelectorAll('source[data-src]')];
  let userPaused = false;

  const setPaused = (paused) => {
    if (btn) btn.dataset.paused = String(paused);
  };
  const fail = () => {
    video.classList.remove('is-playing');
    if (btn) btn.hidden = true;
  };

  sources.forEach((s) => (s.src = s.dataset.src));
  // Si toutes les sources échouent, l'erreur remonte sur la dernière <source>
  if (sources.length) sources[sources.length - 1].addEventListener('error', fail);
  video.load();

  video.addEventListener('playing', () => {
    video.classList.add('is-playing');
    if (btn) btn.hidden = false;
    setPaused(false);
  });

  const play = () => video.play().catch(fail);
  play();

  if (btn) {
    btn.addEventListener('click', () => {
      if (video.paused) {
        userPaused = false;
        play();
        setPaused(false);
      } else {
        userPaused = true;
        video.pause();
        setPaused(true);
      }
    });
  }

  // Économie : pause quand le héros sort de l'écran
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => {
      if (userPaused) return;
      if (en.isIntersecting) play();
      else video.pause();
    }).observe(video);
  }

  reduced.addEventListener('change', (e) => {
    if (e.matches) {
      userPaused = true;
      video.pause();
      setPaused(true);
    }
  });
})();
