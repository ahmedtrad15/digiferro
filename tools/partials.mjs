// En-tête, méga-menu, tiroir mobile, pied de page et sprite SVG.
// Le balisage est identique sur toutes les pages : seul le préfixe de chemin (p) change.
import { esc, icon, dureeHTML, priceHTML, todo, phoneLinks } from './util.mjs';
import { qualiopiLogo, photoTag, photoSize } from './media.mjs';

// Logo Qualiopi officiel (media/…qualiopi…) sinon emplacement réservé ; jamais redessiné
export function qualiopiFigure(p, o, cls = 'qualiopi') {
  // Le logo officiel porte déjà la mention des catégories : elle passe dans le texte alternatif
  const logo = qualiopiLogo();
  const src = logo ? logo.src : o.qualiopi.logo;
  const dim = logo || photoSize(src) || { w: 200, h: 104 };
  const official = !/a-fournir/.test(src);
  return `<figure class="${cls}${official ? ' qualiopi--official' : ''}">
        <img src="${p}${src.split('/').map(encodeURIComponent).join('/')}" alt="Qualiopi, processus certifié, République française. ${esc(o.qualiopi.mention)}" width="${dim.w}" height="${dim.h}" loading="lazy" decoding="async">
        ${official ? '' : `<figcaption>${esc(o.qualiopi.mention)}</figcaption>`}
      </figure>`;
}

// Pictogrammes : grille 48×48, trait 2, extrémités arrondies, sans remplissage.
// Les éléments .a reçoivent la couleur d'accent via la variable --accent.
export const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" class="sprite" aria-hidden="true" focusable="false">
<symbol id="i-train" viewBox="0 0 48 48"><path d="M19 10l5-6 5 6M17 4h14"/><path d="M12 38V18a8 8 0 0 1 8-8h8a8 8 0 0 1 8 8v20a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2z"/><path d="M15 23a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v5H15z"/><path class="a" d="M16 34h3M29 34h3"/><path d="M16 40l-4 6M32 40l4 6M6 46h36"/></symbol>
<symbol id="i-rails" viewBox="0 0 48 48"><path d="M19 9h10M17 16h14M15 24h18M12 33h24M9 43h30"/><path class="a" d="M21 4L9 46M27 4l12 42"/></symbol>
<symbol id="i-pylon" viewBox="0 0 48 48"><path d="M10 46V6M6 46h8M10 10h32M10 18l24-8"/><path class="a" d="M2 15q22 9 44 0"/><path d="M2 26h44M18 19v7M26 21v5M34 19v7"/></symbol>
<symbol id="i-signal" viewBox="0 0 48 48"><rect x="15" y="3" width="18" height="28" rx="4"/><circle class="a af" cx="24" cy="10.5" r="3.5"/><circle cx="24" cy="18" r="3.5"/><circle cx="24" cy="25.5" r="2.5"/><path d="M24 31v13M16 45h16"/></symbol>
<symbol id="i-helmet" viewBox="0 0 48 48"><path d="M8 30a16 16 0 0 1 32 0"/><path d="M4 30h40v4H4z"/><path class="a" d="M20 15v-2a4 4 0 0 1 8 0v2M24 15v15"/><path d="M14 41h20"/></symbol>
<symbol id="i-vest" viewBox="0 0 48 48"><path d="M17 5l-9 7v31h32V12l-9-7"/><path d="M17 5l7 12 7-12M24 17v26"/><path class="a" d="M8 29h32M8 36h32"/></symbol>
<symbol id="i-worker" viewBox="0 0 48 48"><path d="M17 10a7 7 0 0 1 14 0M15 10h18"/><circle cx="24" cy="14" r="4"/><path d="M17 21h14l2 15H15z"/><path class="a" d="M16 29h16"/><path d="M19 36l-2 10M29 36l2 10M17 22l-6 10M31 22l6-8"/><path class="a" d="M37 14V4l8 3-8 3"/></symbol>
<symbol id="i-pn" viewBox="0 0 48 48"><path d="M24 46V12"/><path class="a" d="M12 4l24 14M36 4L12 18"/><rect x="4" y="30" width="40" height="5"/><path class="a" d="M10 30v5M20 30v5M30 30v5M40 30v5"/></symbol>
<symbol id="i-horn" viewBox="0 0 48 48"><path d="M4 22h5l17-9v26L9 30H4z"/><path d="M26 13c3 4 3 22 0 26"/><path d="M9 30l2 9h5"/><path class="a" d="M36 44V6l9 4-9 4"/></symbol>
<symbol id="i-network" viewBox="0 0 48 48"><path d="M4 14h40"/><path class="a" d="M4 28c6-4 10 4 16 0s10 4 16 0 6 0 8 0"/><path d="M4 40h40M12 14v26M36 14v26" stroke-dasharray="2 4"/></symbol>
<symbol id="i-arrow" viewBox="0 0 48 48"><path d="M8 24h31M29 14l10 10-10 10"/></symbol>
<symbol id="i-chevron" viewBox="0 0 48 48"><path d="M14 19l10 10 10-10"/></symbol>
<symbol id="i-up" viewBox="0 0 48 48"><path d="M24 40V9M14 19L24 9l10 10"/></symbol>
<symbol id="i-close" viewBox="0 0 48 48"><path d="M13 13l22 22M35 13L13 35"/></symbol>
<symbol id="i-menu" viewBox="0 0 48 48"><path d="M8 14h32M8 24h32M8 34h20"/></symbol>
<symbol id="i-phone" viewBox="0 0 48 48"><path d="M15 6h6l3 9-4 3a24 24 0 0 0 10 10l3-4 9 3v6a4 4 0 0 1-4 4C21 37 11 27 11 10a4 4 0 0 1 4-4z"/></symbol>
<symbol id="i-mail" viewBox="0 0 48 48"><rect x="6" y="11" width="36" height="26" rx="2"/><path d="M6 13l18 13 18-13"/></symbol>
<symbol id="i-play" viewBox="0 0 48 48"><path d="M17 11l20 13-20 13z"/></symbol>
<symbol id="i-pause" viewBox="0 0 48 48"><path d="M18 11v26M30 11v26"/></symbol>
<symbol id="i-check" viewBox="0 0 48 48"><path d="M10 25l9 9 19-20"/></symbol>
<symbol id="i-pin" viewBox="0 0 48 48"><path d="M24 44s14-13 14-24a14 14 0 0 0-28 0c0 11 14 24 14 24z"/><circle cx="24" cy="20" r="5"/></symbol>
<symbol id="i-clock" viewBox="0 0 48 48"><circle cx="24" cy="24" r="18"/><path d="M24 13v11l7 5"/></symbol>
<symbol id="i-users" viewBox="0 0 48 48"><circle cx="18" cy="16" r="6"/><path d="M6 40c0-7 5-12 12-12s12 5 12 12"/><path d="M30 10a6 6 0 0 1 0 12M36 40c0-6-3-10-7-11"/></symbol>
<symbol id="i-euro" viewBox="0 0 48 48"><path d="M35 13a14 14 0 1 0 0 22M9 21h20M9 28h18"/></symbol>
<symbol id="i-shield" viewBox="0 0 48 48"><path d="M24 4l16 6v12c0 11-7 18-16 22C15 40 8 33 8 22V10z"/><path class="a" d="M17 24l5 5 9-10"/></symbol>
<symbol id="i-doc" viewBox="0 0 48 48"><path d="M12 4h18l8 8v32H12z"/><path d="M30 4v8h8M18 22h14M18 29h14M18 36h8"/></symbol>
<symbol id="i-calendar" viewBox="0 0 48 48"><rect x="6" y="9" width="36" height="33" rx="2"/><path d="M6 18h36M15 5v8M33 5v8"/><path class="a" d="M14 26h6M14 33h6M27 26h6"/></symbol>
<symbol id="i-laptop" viewBox="0 0 48 48"><rect x="9" y="9" width="30" height="21" rx="2"/><path d="M3 38h42l-4-8H7z"/><path class="a" d="M17 25l5-11M26 25l-1-11"/></symbol>
</svg>`;

export const LOGO_MARK = `<svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="3" fill="#0d151e"/><path d="M4 8h32" stroke="#8797a6" stroke-width="1.5"/><path d="M13 12h14M20 12l-6 8 6 8M12 28h16" stroke="#f5b41a" stroke-width="2.6" stroke-linecap="square" stroke-linejoin="miter" fill="none"/><path d="M5 33h30" stroke="#fff" stroke-width="2"/><path d="M9 33v3M15 33v3M21 33v3M27 33v3M33 33v3" stroke="#8797a6" stroke-width="2"/></svg>`;

export const brand = (p, tag = true) => `<a class="brand" href="${p}index.html">${LOGO_MARK}<span class="brand__text"><span class="brand__word">Digi<b>ferro</b></span>${tag ? '<span class="brand__tag">Formations ferroviaires</span>' : ''}</span><span class="sr-only">, retour à l'accueil</span></a>`;

const devisHref = (p, id) => `${p}contact.html${id ? `?formation=${encodeURIComponent(id)}` : ''}#devis`;
export { devisHref };

function groupsOf(data) {
  return data.themes
    .slice()
    .sort((a, b) => a.ordre - b.ordre)
    .map((t) => ({ ...t, items: data.formations.filter((f) => f.theme === t.id).sort((a, b) => a.ordre - b.ordre) }));
}
export { groupsOf };

const megaItem = (p, f) =>
  `<li><a class="mega__link" href="${p}${f.page}"><span class="mega__name">${esc(f.titre_court)}</span><span class="mega__meta">${f.code !== f.titre_court ? `<span class="code">${esc(f.code)}</span>` : ''}<span class="mega__dur">${dureeHTML(f.duree, 'todo--xs')}</span></span></a></li>`;

const megaPack = (p, k) =>
  `<li><a class="mega__link mega__link--pack" href="${p}${k.page}"><span class="mega__name">${esc(k.titre_court)}</span><span class="mega__meta"><span class="mega__dur">${dureeHTML(k.duree, 'todo--xs')}</span></span></a></li>`;

export function header(ctx, data) {
  const { p } = ctx;
  const o = data.organisme;
  const groups = groupsOf(data);
  const packs = data.packs.slice().sort((a, b) => a.ordre - b.ordre);
  const cur = (path) => (ctx.path === path ? ' aria-current="page"' : '');

  const mega = `<div class="mega" id="mega-formations" data-mega-panel>
  <div class="wrap mega__in">
    <div class="mega__groups">
      ${groups
        .map(
          (g) => `<div class="mega__group mega__group--${g.id}"><p class="mega__title" id="mg-${g.id}">${esc(g.label)}</p><ul aria-labelledby="mg-${g.id}">${g.items.map((f) => megaItem(p, f)).join('')}</ul></div>`
        )
        .join('')}
    </div>
    <div class="mega__packs"><p class="mega__title" id="mg-packs">Packs</p><ul aria-labelledby="mg-packs">${packs.map((k) => megaPack(p, k)).join('')}</ul></div>
    <div class="mega__aside">
      ${data.site.photos?.menu ? photoTag(p, data.site.photos.menu, { sizes: '16rem' }) : `<img src="${p}assets/img/ph-agent-epi.svg" alt="Agent en équipement de protection au bord d'une voie ferrée" width="480" height="320" loading="lazy" decoding="async">`}
      <p class="mega__aside-title">Une équipe entière à habiliter ?</p>
      <p>Session en centre ou sur votre site : décrivez votre besoin, Digivoda vous répond avec un devis.</p>
      <a class="btn btn--signal btn--sm" href="${devisHref(p)}">Demander un devis</a>
      <a class="mega__phone" href="tel:${o.telephone_e164}">${icon('phone', 'icon icon--sm')} ${esc(o.telephone)}</a>
      ${phoneLinks({ telephones: (o.telephones || []).slice(2) }, { cls: 'phones phones--compact' })}
    </div>
  </div>
  <div class="mega__foot"><div class="wrap"><a href="${p}formations/index.html">Voir tout le catalogue ${icon('arrow', 'icon icon--sm')}</a></div></div>
</div>`;

  const drawerGroup = (id, label, items) => `<li class="drawer__group">
  <button class="drawer__toggle" type="button" aria-expanded="false" aria-controls="dg-${id}">${esc(label)} <span class="drawer__count">${items.length}</span>${icon('chevron', 'icon icon--sm')}</button>
  <ul class="drawer__sub" id="dg-${id}" hidden>${items.join('')}</ul>
</li>`;
  const dItem = (f) =>
    `<li><a href="${p}${f.page}"><span>${esc(f.titre_court)}</span><span class="drawer__meta">${esc(f.code || '')} · ${dureeHTML(f.duree, 'todo--xs')}</span></a></li>`;
  const dPack = (k) =>
    `<li><a href="${p}${k.page}"><span>${esc(k.titre_court)}</span><span class="drawer__meta">${dureeHTML(k.duree, 'todo--xs')}</span></a></li>`;

  const drawer = `<div class="drawer" id="drawer" data-drawer hidden>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <div class="drawer__head">${brand(p, false)}<p class="sr-only" id="drawer-title">Menu</p><button class="drawer__close" type="button" data-drawer-close>${icon('close')}<span class="sr-only">Fermer le menu</span></button></div>
    <nav class="drawer__nav" aria-label="Navigation mobile">
      <p class="drawer__label">Formations</p>
      <ul class="drawer__list">
        ${groups.map((g) => drawerGroup(g.id, g.label, g.items.map(dItem))).join('')}
        ${drawerGroup('packs', 'Packs', packs.map(dPack))}
      </ul>
      <ul class="drawer__links">
        <li><a href="${p}formations/index.html">Catalogue complet</a></li>
        <li><a href="${p}a-propos.html">À propos</a></li>
        <li><a href="${p}faq.html">Questions fréquentes</a></li>
        <li><a href="${p}contact.html">Contact</a></li>
      </ul>
    </nav>
    <div class="drawer__foot">
      <a class="btn btn--ghost" href="tel:${o.telephone_e164}">${icon('phone', 'icon icon--sm')} Appeler</a>
      <a class="btn btn--signal" href="${devisHref(p)}">Demander un devis</a>
    </div>
  </div>
</div>`;

  return `<a class="skip-link" href="#contenu">Aller au contenu</a>
${SPRITE}
<aside class="topbar" aria-label="Coordonnées">
  <div class="wrap topbar__in">
    <p>Formations dispensées par <strong>DIGIVODA</strong>, organisme certifié Qualiopi</p>
    <ul class="topbar__links">
      <li><a href="tel:${o.telephone_e164}">${icon('phone', 'icon icon--xs')}${esc(o.telephone)}</a></li>
      ${(o.telephones || []).slice(2).map((t) => `<li><a href="tel:${t.e164}">${icon('phone', 'icon icon--xs')}<span class="topbar__label">Formations ferroviaires :</span>${esc(t.affichage)}</a></li>`).join('')}
      <li><a href="mailto:${esc(o.email)}">${icon('mail', 'icon icon--xs')}${esc(o.email)}</a></li>
    </ul>
  </div>
</aside>
<header class="site-header" data-header>
  <div class="wrap site-header__in">
    ${brand(p)}
    <nav class="nav" aria-label="Navigation principale">
      <ul class="nav__list">
        <li class="nav__item nav__item--mega" data-mega>
          <button class="nav__link nav__toggle${/^(formations|packs)\//.test(ctx.path) ? ' is-section' : ''}" type="button" aria-expanded="false" aria-controls="mega-formations">Formations${icon('chevron', 'icon icon--xs')}</button>
          ${mega}
        </li>
        <li class="nav__item"><a class="nav__link" href="${p}formations/index.html?type=pack">Packs</a></li>
        <li class="nav__item"><a class="nav__link" href="${p}a-propos.html"${cur('a-propos.html')}>À propos</a></li>
        <li class="nav__item"><a class="nav__link" href="${p}faq.html"${cur('faq.html')}>FAQ</a></li>
        <li class="nav__item"><a class="nav__link" href="${p}contact.html"${cur('contact.html')}>Contact</a></li>
      </ul>
    </nav>
    <div class="site-header__actions">
      <a class="site-header__phone" href="tel:${o.telephone_e164}">${icon('phone', 'icon icon--sm')}<span>${esc(o.telephone)}</span></a>
      <a class="btn btn--signal btn--sm site-header__cta" href="${ctx.devis || devisHref(p)}">Demander un devis</a>
      <a class="burger" href="#plan-du-site" data-drawer-open aria-controls="drawer">${icon('menu')}<span class="burger__label">Menu</span></a>
    </div>
  </div>
</header>
${drawer}`;
}

export function footer(ctx, data) {
  const { p } = ctx;
  const o = data.organisme;
  const groups = groupsOf(data);
  const packs = data.packs.slice().sort((a, b) => a.ordre - b.ordre);
  return `<footer class="site-footer" id="plan-du-site">
  <div class="track" aria-hidden="true"></div>
  <div class="wrap site-footer__grid">
    <div class="site-footer__brand">
      ${brand(p)}
      <p>Digiferro présente les formations à la sécurité ferroviaire et aux habilitations dispensées par DIGIVODA : SECUFER, TCS M, C0, RSO, AIPR, caténaire. Pour les entreprises du ferroviaire, leurs sous-traitants et les agents qui interviennent sur les voies.</p>
      ${qualiopiFigure(p, o)}
    </div>
    <nav class="site-footer__col site-footer__col--wide" aria-labelledby="ft-formations">
      <p class="site-footer__title" id="ft-formations">Formations</p>
      <ul class="site-footer__formations">
        ${groups.flatMap((g) => g.items).map((f) => `<li><a href="${p}${f.page}">${esc(f.titre_court)}</a></li>`).join('')}
      </ul>
    </nav>
    <div class="site-footer__col">
      <nav aria-labelledby="ft-packs">
        <p class="site-footer__title" id="ft-packs">Packs</p>
        <ul>${packs.map((k) => `<li><a href="${p}${k.page}">${esc(k.titre_court)}</a></li>`).join('')}</ul>
      </nav>
      <nav aria-labelledby="ft-utiles">
        <p class="site-footer__title" id="ft-utiles">Liens utiles</p>
        <ul>
          <li><a href="${p}formations/index.html">Catalogue</a></li>
          <li><a href="${p}a-propos.html">À propos</a></li>
          <li><a href="${p}faq.html">FAQ</a></li>
          <li><a href="${p}contact.html">Contact et devis</a></li>
        </ul>
      </nav>
    </div>
    <div class="site-footer__col site-footer__contact">
      <p class="site-footer__title">Contact</p>
      <p><a class="site-footer__phone" href="tel:${o.telephone_e164}">${icon('phone', 'icon icon--sm')}${esc(o.telephone)}</a></p>
      ${phoneLinks(o, { cls: 'phones phones--dark', skipFirst: true })}
      <p><a href="mailto:${esc(o.email)}">${icon('mail', 'icon icon--sm')}${esc(o.email)}</a></p>
      <p class="site-footer__addr"><span>Siège</span>${esc(o.adresse_siege)}</p>
      <p class="site-footer__addr"><span>Centre de formation</span>${esc(o.adresse_centre)}</p>
      <a class="btn btn--signal btn--sm" href="${devisHref(p)}">Demander un devis</a>
    </div>
  </div>
  <div class="site-footer__legal">
    <div class="wrap site-footer__legal-in">
      <p>© 2026 Digiferro. Formations dispensées par DIGIVODA.</p>
      <ul>
        <li><a href="${p}mentions-legales.html">Mentions légales</a></li>
        <li><a href="${p}cgv.html">CGV</a></li>
        <li><a href="${p}politique-confidentialite.html">Politique de confidentialité</a></li>
      </ul>
    </div>
  </div>
</footer>
<nav class="mobile-bar" aria-label="Actions rapides">
  <a class="mobile-bar__btn" href="tel:${o.telephone_e164}">${icon('phone', 'icon icon--sm')}Appeler</a>
  <a class="mobile-bar__btn mobile-bar__btn--signal" href="${ctx.devis || devisHref(p)}">${icon('doc', 'icon icon--sm')}Devis</a>
</nav>
<button class="to-top" type="button" data-to-top hidden>${icon('up')}<span class="sr-only">Revenir en haut de la page</span></button>`;
}

const FONTS = 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap';

export function head(ctx, data) {
  const { p } = ctx;
  const base = data.site.base_url.replace(/\/$/, '');
  const url = `${base}/${ctx.path === 'index.html' ? '' : ctx.path}`;
  const og = `${base}/assets/img/og-digiferro.jpg`;
  return `<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(ctx.title)}</title>
<meta name="description" content="${esc(ctx.description)}">${ctx.noindex ? '\n<meta name="robots" content="noindex">' : ''}
<link rel="canonical" href="${url}">
<meta property="og:type" content="${ctx.ogType || 'website'}">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Digiferro">
<meta property="og:title" content="${esc(ctx.title)}">
<meta property="og:description" content="${esc(ctx.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0d151e">
<link rel="icon" href="${p}assets/favicon/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${p}assets/favicon/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${p}assets/favicon/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONTS}" onload="this.onload=null;this.rel=&quot;stylesheet&quot;">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
${ctx.preload || ''}
<link rel="stylesheet" href="${p}css/base.css">
<link rel="stylesheet" href="${p}css/layout.css">
<link rel="stylesheet" href="${p}css/components.css">
<link rel="stylesheet" href="${p}css/pages.css">
<script>document.documentElement.className="js"</script>
${(ctx.jsonld || []).join('\n')}
</head>`;
}

// Typographie française : espace insécable avant : ; ! ? (hors code, le HTML n'en contient pas dans ces positions)
const frSpaces = (html) => html.replace(/ ([:;!?])(?=[\s<"& ]|$)/g, '\u00a0$1').replace(/'/g, '’');

export function page(ctx, data, main) {
  const scripts = ['nav', 'megamenu', 'reveal', ...(ctx.scripts || [])];
  return frSpaces(`${head(ctx, data)}
<body class="${ctx.bodyClass || ''}">
${header(ctx, data)}
<main id="contenu" tabindex="-1">
${main}
</main>
${footer(ctx, data)}
${scripts.map((s) => `<script src="${ctx.p}js/${s}.js" defer></script>`).join('\n')}
</body>
</html>
`);
}

export const breadcrumb = (p, trail) =>
  `<nav class="breadcrumb" aria-label="Fil d'Ariane"><ol>${trail
    .map((t, i) =>
      i === trail.length - 1
        ? `<li><span aria-current="page">${esc(t.label)}</span></li>`
        : `<li><a href="${p}${t.href}">${esc(t.label)}</a></li>`
    )
    .join('')}</ol></nav>`;

export { todo, priceHTML };
