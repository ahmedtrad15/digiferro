// Helpers partagés par le générateur. Aucune dépendance externe.

export const TODO_PREFIX = '[À COMPLÉTER';

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const isTodo = (v) => typeof v === 'string' && v.startsWith(TODO_PREFIX);

export const isMissing = (v) =>
  v == null ||
  v === '' ||
  isTodo(v) ||
  (Array.isArray(v) && (v.length === 0 || v.every(isMissing)));

// Placeholder visible : même libellé partout, pour pouvoir le retrouver par recherche.
export const todo = (label, cls = '') =>
  `<span class="todo${cls ? ' ' + cls : ''}">[À COMPLÉTER: ${esc(label)}]</span>`;

export const show = (v, label) => (isMissing(v) ? todo(label) : esc(v));

export const nbsp = '\u00a0';
export const eur = (n) =>
  Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 2 }).replace(/\u202f/g, nbsp) + nbsp + '€';

export function priceHTML(t, { size = '' } = {}) {
  if (!t || t.montant == null) return todo('tarif');
  const old = t.ancien_prix
    ? `<span class="sr-only">Au lieu de </span><del class="price__old">${eur(t.ancien_prix)}</del> <span class="sr-only">, désormais </span>`
    : '';
  return `<span class="price${size ? ' price--' + size : ''}">${old}<strong class="price__now">${eur(t.montant)}</strong><span class="price__tax">${esc(t.regime || 'TTC')}</span></span>`;
}

export const dureeHTML = (d, cls = '') => (d && !isMissing(d.libelle) ? esc(d.libelle) : todo('durée', cls));

export const savingBadge = (t) =>
  t && t.remise
    ? `<span class="saving" aria-label="Économie de ${t.remise} euros">−${eur(t.remise)}</span>`
    : '';

export const listHTML = (arr, label, cls = 'list') =>
  isMissing(arr) ? `<p>${todo(label)}</p>` : `<ul class="${cls}">${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;

export const icon = (name, cls = 'icon') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

export const truncateAt = (s, max) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
};

export const jsonld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
