/* Digiferro · méga-menu « Formations » : survol, clic et clavier ; fermeture par Échap et clic extérieur */
(() => {
  const item = document.querySelector('[data-mega]');
  if (!item) return;
  const btn = item.querySelector('.nav__toggle');
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  let timer;

  const isOpen = () => item.classList.contains('is-open');
  const open = () => {
    clearTimeout(timer);
    item.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
  };
  const close = (focusButton = false) => {
    clearTimeout(timer);
    item.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    if (focusButton) btn.focus();
  };

  btn.addEventListener('click', () => (isOpen() ? close() : open()));

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      open();
      const first = panel.querySelector('a');
      if (first) requestAnimationFrame(() => first.focus());
    }
  });

  // Navigation par flèches entre les liens du panneau
  panel.addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const links = [...panel.querySelectorAll('a')];
    const i = links.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const next =
      e.key === 'Home' ? 0 : e.key === 'End' ? links.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
    links[next].focus();
  });

  item.addEventListener('mouseenter', () => {
    if (!hover.matches) return;
    clearTimeout(timer);
    timer = setTimeout(open, 90);
  });
  item.addEventListener('mouseleave', () => {
    if (!hover.matches) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!item.contains(document.activeElement) || document.activeElement === btn) close();
    }, 220);
  });

  item.addEventListener('focusout', (e) => {
    if (isOpen() && !item.contains(e.relatedTarget)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close(item.contains(document.activeElement));
  });
  document.addEventListener('click', (e) => {
    if (isOpen() && !item.contains(e.target)) close();
  });
  matchMedia('(min-width: 68.75em)').addEventListener('change', () => close());
})();
