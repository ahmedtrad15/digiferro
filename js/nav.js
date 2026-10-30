/* Digiferro · navigation : en-tête collant, tiroir mobile, retour en haut, repérage de section */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('[data-header]');
  const toTop = document.querySelector('[data-to-top]');

  // En-tête qui se resserre au défilement + bouton retour en haut
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-condensed', y > 80);
    if (toTop) toTop.hidden = y < 700;
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
      const main = document.getElementById('contenu');
      if (main) main.focus({ preventScroll: true });
    });
  }

  // Tiroir mobile : dialogue modal avec piège de focus
  const drawer = document.getElementById('drawer');
  const opener = document.querySelector('[data-drawer-open]');
  if (drawer && opener) {
    const panel = drawer.querySelector('.drawer__panel');
    const closeBtn = drawer.querySelector('[data-drawer-close]');
    const outside = [header, document.querySelector('main'), document.querySelector('.site-footer'), document.querySelector('.mobile-bar'), document.querySelector('.topbar')].filter(Boolean);
    opener.setAttribute('role', 'button');
    opener.setAttribute('aria-expanded', 'false');

    const focusables = () =>
      [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (el) => el.offsetParent !== null
      );

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'Tab') {
        const f = focusables();
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const open = () => {
      drawer.hidden = false;
      document.body.classList.add('drawer-open');
      opener.setAttribute('aria-expanded', 'true');
      outside.forEach((el) => el.setAttribute('inert', ''));
      document.addEventListener('keydown', onKey);
      closeBtn.focus();
    };
    const close = (restore = true) => {
      drawer.hidden = true;
      document.body.classList.remove('drawer-open');
      opener.setAttribute('aria-expanded', 'false');
      outside.forEach((el) => el.removeAttribute('inert'));
      document.removeEventListener('keydown', onKey);
      if (restore) opener.focus();
    };

    opener.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
    opener.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
    closeBtn.addEventListener('click', () => close());
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) close(false);
    });
    drawer.querySelectorAll('.drawer__toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        document.getElementById(btn.getAttribute('aria-controls')).hidden = expanded;
      });
    });
    matchMedia('(min-width: 68.75em)').addEventListener('change', (e) => {
      if (e.matches && !drawer.hidden) close(false);
    });
  }

  // Sous-navigation des fiches : défilement horizontal propre à la barre.
  // Important : on ne fait jamais défiler la page depuis ici (un scrollIntoView
  // interromprait le défilement doux déclenché par un clic sur un lien d'ancre).
  const subUl = document.querySelector('.subnav ul');
  let spyLockedUntil = 0;
  const centerInSubnav = (a) => {
    if (!subUl || subUl.scrollWidth <= subUl.clientWidth) return;
    const r = a.getBoundingClientRect();
    const u = subUl.getBoundingClientRect();
    subUl.scrollBy({ left: r.left + r.width / 2 - (u.left + u.width / 2), behavior: reduced.matches ? 'auto' : 'smooth' });
  };
  const nav = subUl && subUl.closest('.subnav');
  if (subUl) {
    const edges = () => {
      nav.classList.toggle('can-left', subUl.scrollLeft > 4);
      nav.classList.toggle('can-right', subUl.scrollLeft + subUl.clientWidth < subUl.scrollWidth - 4);
    };
    subUl.addEventListener('scroll', edges, { passive: true });
    addEventListener('resize', edges, { passive: true });
    edges();
    subUl.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      subUl.querySelectorAll('a').forEach((x) => x.classList.toggle('is-current', x === a));
      centerInSubnav(a);
      // Pendant le défilement vers l'ancre, le repérage automatique est suspendu
      spyLockedUntil = Date.now() + 1500;
      const target = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      addEventListener(
        'scrollend',
        () => {
          spyLockedUntil = 0;
          // Si la mise en page a bougé pendant le défilement (polices, images), on recale le titre
          if (!target) return;
          const gap = target.getBoundingClientRect().top - nav.getBoundingClientRect().bottom;
          if (gap < -2 || gap > 64) target.scrollIntoView({ block: 'start' });
        },
        { once: true }
      );
    });
  }

  // Repérage de la section courante (sous-navigation des fiches, index des thèmes)
  const spyLinks = [...document.querySelectorAll('.subnav a[href^="#"], .line-index a[href^="#"]')];
  if (spyLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map();
    spyLinks.forEach((a) => {
      const el = document.getElementById(decodeURIComponent(a.hash.slice(1)));
      if (!el) return;
      const target = el.closest('section') || el;
      if (!byId.has(target)) byId.set(target, []);
      byId.get(target).push(a);
    });
    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < spyLockedUntil) return;
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const links = byId.get(en.target) || [];
          const group = links[0] && links[0].closest('ul, ol');
          if (group) group.querySelectorAll('a').forEach((a) => a.classList.remove('is-current'));
          links.forEach((a) => a.classList.add('is-current'));
          const sub = links.find((a) => a.closest('.subnav'));
          if (sub) centerInSubnav(sub);
        });
      },
      { rootMargin: '-35% 0px -60% 0px' }
    );
    byId.forEach((_, el) => io.observe(el));
  }
})();
