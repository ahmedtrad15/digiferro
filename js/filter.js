/* Digiferro · filtres du catalogue
   Sans JavaScript, tout le catalogue reste affiché (le formulaire est masqué).
   Les filtres sont reflétés dans l'URL (?type=pack&theme=…&duree=…&q=…) :
   une vue filtrée peut être partagée ou mise en favori. */
(() => {
  const form = document.querySelector('[data-filter-form]');
  const list = document.querySelector('[data-filter-list]');
  if (!form || !list) return;

  const items = [...list.children];
  const countEl = document.querySelector('[data-filter-count]');
  const empty = document.querySelector('[data-filter-empty]');
  const activeEl = form.querySelector('[data-filter-active]');
  const search = form.elements.q;
  const toggle = form.querySelector('.filters__toggle');
  const panel = document.getElementById(toggle.getAttribute('aria-controls'));
  const KEYS = ['type', 'theme', 'duree'];
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  form.hidden = false;

  // Petit écran : panneau de filtres repliable ; grand écran : toujours ouvert
  const wide = matchMedia('(min-width: 64em)');
  const setPanel = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };
  const syncLayout = () => {
    toggle.hidden = wide.matches;
    setPanel(wide.matches);
  };
  wide.addEventListener('change', syncLayout);
  syncLayout();
  toggle.addEventListener('click', () => setPanel(panel.hidden));

  // État initial lu dans l'URL
  const params = new URLSearchParams(location.search);
  KEYS.forEach((k) => {
    const v = params.get(k);
    const radio = v && [...form.elements[k]].find((r) => r.value === v);
    if (radio) radio.checked = true;
  });
  if (params.get('q')) search.value = params.get('q');

  const state = () => {
    const s = { q: search.value };
    KEYS.forEach((k) => (s[k] = form.elements[k].value));
    return s;
  };

  const apply = (updateUrl = true) => {
    const s = state();
    const words = norm(s.q).split(/\s+/).filter(Boolean);
    let n = 0;
    items.forEach((li) => {
      const d = li.dataset;
      const ok =
        (!s.type || d.type === s.type) &&
        (!s.theme || d.theme === s.theme) &&
        (!s.duree || d.duree === s.duree) &&
        words.every((w) => d.text.includes(w));
      li.hidden = !ok;
      if (ok) n++;
    });
    countEl.textContent = n === 0 ? 'Aucun résultat' : `${n} résultat${n > 1 ? 's' : ''}`;
    empty.hidden = n !== 0;
    const active = KEYS.filter((k) => s[k]).length + (words.length ? 1 : 0);
    activeEl.textContent = active ? ` (${active})` : '';
    if (updateUrl) {
      const url = new URL(location.href);
      ['q', ...KEYS].forEach((k) => (s[k] ? url.searchParams.set(k, s[k]) : url.searchParams.delete(k)));
      history.replaceState(null, '', url);
    }
  };

  let timer;
  form.addEventListener('change', (e) => {
    if (e.target !== search) apply();
  });
  search.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 250);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    apply();
  });
  form.addEventListener('reset', () => setTimeout(apply, 0));
  const clear = document.querySelector('[data-filter-clear]');
  if (clear)
    clear.addEventListener('click', () => {
      form.reset();
      search.focus();
    });

  apply(false);
})();
