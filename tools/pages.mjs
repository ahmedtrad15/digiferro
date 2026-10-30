// Pages transverses : catalogue filtrable, à propos, contact, FAQ, pages légales, 404.
import { esc, icon, todo, show, priceHTML, dureeHTML, savingBadge, jsonld } from './util.mjs';
import { breadcrumb, devisHref, groupsOf } from './partials.mjs';
import { img, formationCard, faqHTML, faqLD, mapFigure, ctaBand } from './home.mjs';
import { formBox } from './item.mjs';

const breadcrumbLD = (data, trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.label,
    ...(t.href ? { item: `${data.site.base_url}/${t.href.replace(/^index\.html/, '')}` } : {}),
  })),
});

// En-tête de page commun aux pages transverses
const pageHero = (p, trail, { station, title, lead, aside = '', mod = '' }) => `<div class="page-hero${mod ? ' page-hero--' + mod : ''}">
  <svg class="page-hero__wires" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 18 Q360 58 720 18 T1440 18"/><path d="M0 42 H1440"/><path d="M180 34 V42 M360 38 V42 M540 34 V42 M900 34 V42 M1080 38 V42 M1260 34 V42"/></svg>
  <div class="wrap">
    ${breadcrumb(p, trail)}
    <div class="page-hero__grid">
      <div>
        <p class="station">${esc(station)}</p>
        <h1>${esc(title)}</h1>
        ${lead ? `<p class="page-hero__lead">${esc(lead)}</p>` : ''}
      </div>
      ${aside}
    </div>
  </div>
</div>`;

const crumbs = (label, href) => [{ label: 'Accueil', href: 'index.html' }, { label, href }];

/* ---------------------------------------------------------------- Catalogue */

const norm = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

const dureeBucket = (d) => {
  const j = d?.jours;
  if (j == null) return 'nc';
  if (j < 1) return 'court';
  if (j < 5) return 'moyen';
  return 'long';
};

const DUREES = [
  ['court', 'Moins d’une journée'],
  ['moyen', '1 à 4 jours'],
  ['long', '5 jours et plus'],
  ['nc', 'Durée à confirmer'],
];
const TYPES = [
  ['formation', 'Formation initiale'],
  ['recyclage', 'Recyclage'],
  ['e-learning', 'E-learning'],
  ['pack', 'Pack'],
];

function packCard(p, k) {
  const [name, sub] = k.titre.split(' – ');
  return `<article class="fcard fcard--pack">
  <div class="fcard__media" data-ph>${img(p, k.images?.[0] || 'ph-train-face')}<span class="fcard__type">Pack</span></div>
  <div class="fcard__body">
    <p class="fcard__meta"><span class="fcard__dur">${icon('clock', 'icon icon--xs')}${dureeHTML(k.duree, 'todo--xs')}</span>${savingBadge(k.tarif)}</p>
    <h3 class="fcard__title"><a href="${p}${k.page}">${esc(name)}</a></h3>
    ${sub ? `<p class="fcard__sub">${esc(sub)}</p>` : ''}
    <p class="fcard__sum">${esc(k.modules_publies.join(' · '))}</p>
    <div class="fcard__foot"><span class="fcard__price">${priceHTML(k.tarif)}</span><span class="fcard__more" aria-hidden="true">Voir le pack${icon('arrow', 'icon icon--sm')}</span></div>
  </div>
</article>`;
}

const chipGroup = (name, legend, options, counts) => `<fieldset class="filters__group">
  <legend>${legend}</legend>
  <div class="chips-select">
    <label class="chip-opt"><input type="radio" name="${name}" value="" checked><span>Tout</span></label>
    ${options
      .map(([v, l]) => `<label class="chip-opt"><input type="radio" name="${name}" value="${v}"><span>${esc(l)}<small>${counts[v] || 0}</small></span></label>`)
      .join('')}
  </div>
</fieldset>`;

export function catalogue(data) {
  const p = '../';
  const groups = groupsOf(data);
  const packs = data.packs.slice().sort((a, b) => a.ordre - b.ordre);
  const themeLabel = Object.fromEntries(data.themes.map((t) => [t.id, t.label]));
  const items = [
    ...groups.flatMap((g) => g.items).map((f) => ({ kind: f.type, theme: f.theme, duree: dureeBucket(f.duree), x: f })),
    ...packs.map((k) => ({ kind: 'pack', theme: 'pack', duree: dureeBucket(k.duree), x: k })),
  ];
  const count = (key) => items.reduce((acc, it) => ((acc[it[key]] = (acc[it[key]] || 0) + 1), acc), {});
  const cKind = count('kind');
  const cTheme = count('theme');
  const cDuree = count('duree');

  const list = items
    .map((it) => {
      const x = it.x;
      const text = norm([x.titre, x.titre_court, x.code || '', x.resume, (x.modules_publies || []).join(' '), themeLabel[x.theme] || 'pack'].join(' '));
      return `<li class="catalogue__item" data-type="${it.kind}" data-theme="${it.theme}" data-duree="${it.duree}" data-text="${esc(text)}">${it.kind === 'pack' ? packCard(p, x) : formationCard(p, x, { heading: 'h3' })}</li>`;
    })
    .join('\n');

  const trail = [{ label: 'Accueil', href: 'index.html' }, { label: 'Catalogue', href: 'formations/index.html' }];
  const hero = pageHero(p, trail, {
    station: 'Catalogue',
    title: 'Toutes les formations ferroviaires',
    lead: `${data.formations.length} formations et ${packs.length} packs, filtrables par type, thème et durée. Les tarifs affichés sont TTC, par personne.`,
    aside: `<div class="page-hero__help"><p>Pas sûr de la formation à choisir ?</p><a class="page-hero__phone" href="tel:${data.organisme.telephone_e164}">${icon('phone', 'icon icon--sm')}${esc(data.organisme.telephone)}</a><a class="link-arrow" href="${devisHref(p)}">Décrire mon besoin${icon('arrow', 'icon icon--sm')}</a></div>`,
  });

  const body = `${hero}
<section class="section catalogue" aria-labelledby="catalogue-title">
  <h2 class="sr-only" id="catalogue-title">Résultats</h2>
  <div class="wrap catalogue__grid">
    <div class="filters">
      <form class="filters__form" data-filter-form role="search" aria-label="Filtrer le catalogue" hidden>
        <div class="field filters__search">
          <label for="cat-q">Rechercher une formation</label>
          <input type="search" id="cat-q" name="q" placeholder="SECUFER, caténaire, C0…" autocomplete="off" enterkeyhint="search">
        </div>
        <button class="filters__toggle" type="button" aria-expanded="false" aria-controls="filters-panel">${icon('menu', 'icon icon--sm')}Filtres<span class="filters__active" data-filter-active></span></button>
        <div class="filters__panel" id="filters-panel">
          ${chipGroup('type', 'Type', TYPES, cKind)}
          ${chipGroup('theme', 'Thème', [...data.themes.map((t) => [t.id, t.label]), ['pack', 'Packs']], cTheme)}
          ${chipGroup('duree', 'Durée', DUREES, cDuree)}
          <button class="filters__reset" type="reset">Réinitialiser les filtres</button>
        </div>
      </form>
    </div>
    <div class="catalogue__results">
      <p class="catalogue__count" data-filter-count role="status" aria-live="polite">${items.length} résultats</p>
      <ul class="catalogue__list" data-filter-list>
${list}
      </ul>
      <div class="catalogue__empty" data-filter-empty hidden>
        <p class="catalogue__empty-title">Voie sans issue</p>
        <p>Aucune formation ne correspond à ces critères. Élargissez la recherche, ou posez directement la question à Digivoda.</p>
        <p class="catalogue__empty-actions"><button class="btn btn--ghost btn--sm" type="button" data-filter-clear>Réinitialiser les filtres</button><a class="link-arrow" href="tel:${data.organisme.telephone_e164}">${esc(data.organisme.telephone)}</a></p>
      </div>
    </div>
  </div>
</section>
${ctaBand(p, data.organisme, { title: 'Vous formez toute une équipe ?', text: 'En intra, la session se tient sur votre site et ne réunit que vos agents. Indiquez le nombre de participants pour recevoir un devis.' })}`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catalogue des formations ferroviaires Digiferro',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: `${data.site.base_url}/${it.x.page}`, name: it.x.titre })),
  };

  return {
    ctx: {
      p,
      path: 'formations/index.html',
      title: 'Catalogue des formations ferroviaires | Digiferro',
      description: `${data.formations.length} formations et ${packs.length} packs ferroviaires : SECUFER, TCS M, C0, RSO, AIPR, TES F, caténaire. Filtres par type, thème et durée, tarifs TTC.`,
      bodyClass: 'page-catalogue',
      scripts: ['filter'],
      jsonld: [jsonld(ld), jsonld(breadcrumbLD(data, trail))],
    },
    main: body,
  };
}

/* ---------------------------------------------------------------- À propos */

export function aPropos(data) {
  const p = '';
  const o = data.organisme;
  const trail = crumbs('À propos', 'a-propos.html');
  const body = `${pageHero(p, trail, {
    station: 'À propos',
    title: 'Qui forme vos équipes ?',
    lead: 'Digiferro présente l’offre ferroviaire de DIGIVODA, organisme de formation certifié Qualiopi. Les sessions sont assurées par Digivoda, dans ses centres ou sur le site de ses clients.',
  })}
<section class="section about" aria-labelledby="about-who">
  <div class="wrap about__grid">
    <div>
      <span class="pk" aria-hidden="true"><small>PK</small>01</span>
      <h2 id="about-who">Digiferro et Digivoda</h2>
      <p class="about__lead">Deux noms, deux rôles. Le site vous aide à choisir. L’organisme de formation, lui, forme vos agents et remet les attestations.</p>
    </div>
    <dl class="roles">
      <div class="roles__item">
        <dt><span class="station">Digiferro</span></dt>
        <dd>Le site dédié aux formations ferroviaires : catalogue, packs, demandes de devis. ${todo('statut juridique de Digiferro et lien avec Digivoda')}</dd>
      </div>
      <div class="roles__item roles__item--dark">
        <dt><span class="station station--light">DIGIVODA</span></dt>
        <dd>L’organisme de formation qui dispense les sessions et remet les attestations. Certification Qualiopi au titre des actions de formation et des actions de formation par apprentissage.</dd>
      </div>
    </dl>
  </div>
</section>
<section class="section band band--steel principles" aria-labelledby="about-how">
  <div class="wrap">
    <header class="principles__head"><h2 id="about-how">Notre façon de former</h2><span class="pk pk--steel" aria-hidden="true"><small>PK</small>02</span></header>
    <ol class="principles__list">
      <li><h3>Le terrain comme référence</h3><p>La TCS M se termine par une mise en situation sur chantier pédagogique. Une annonce se travaille au bord d’une voie, pas seulement au tableau.</p></li>
      <li><h3>Trois formats</h3><p>En centre Digivoda avec d’autres entreprises, sur votre site en intra, ou en e-learning pour les modules qui le permettent.</p></li>
      <li><h3>Des prix lisibles</h3><p>Les tarifs sont affichés TTC, par personne. Les packs indiquent leur prix initial et la remise appliquée.</p></li>
      <li><h3>Une attestation à la clé</h3><p>Chaque formation donne lieu à une attestation. L’employeur s’appuie dessus pour délivrer l’habilitation.</p></li>
    </ol>
  </div>
</section>
<section class="section places" aria-labelledby="about-where">
  <div class="wrap places__grid">
    <div class="places__map">${mapFigure({ id: 'carte-apropos' })}</div>
    <div>
      <span class="pk" aria-hidden="true"><small>PK</small>03</span>
      <h2 id="about-where">Où ont lieu les formations</h2>
      <p class="about__lead">Dans les centres Digivoda partout en France, ou directement sur le site du client en intra.</p>
      <dl class="spec spec--wide">
        <div><dt>Siège</dt><dd>${esc(o.adresse_siege)}</dd></div>
        <div><dt>Centre de formation</dt><dd>${esc(o.adresse_centre)}</dd></div>
        <div><dt>Autres centres</dt><dd>${todo('liste des centres Digivoda')}</dd></div>
        <div><dt>Intra</dt><dd>Sur votre site, partout en France</dd></div>
      </dl>
    </div>
  </div>
</section>
<section class="section band band--paper commitments" aria-labelledby="about-quality">
  <div class="wrap commitments__grid">
    <div>
      <span class="pk" aria-hidden="true"><small>PK</small>04</span>
      <h2 id="about-quality">Qualité et accessibilité</h2>
    </div>
    <div class="commitments__body">
      <figure class="qualiopi qualiopi--light">
        <img src="${p}${esc(o.qualiopi.logo)}" alt="Logo Qualiopi, processus certifié, République française" width="200" height="104" loading="lazy" decoding="async">
        <figcaption>${esc(o.qualiopi.mention)}</figcaption>
      </figure>
      <div class="commitments__access">
        <h3>Personnes en situation de handicap</h3>
        <p>Digivoda dispose d’un référent handicap et publie un registre public d’accessibilité. Signalez votre besoin dès la demande de devis : la session peut être adaptée.</p>
        <p>Référent handicap : ${todo('coordonnées du référent handicap')}</p>
        <a class="link-arrow" href="${esc(o.sources.referent_handicap)}" rel="noopener">Registre d’accessibilité (digivoda.com)${icon('arrow', 'icon icon--sm')}</a>
      </div>
    </div>
  </div>
</section>
${ctaBand(p, o, { title: 'Une question avant de vous lancer ?', text: 'Appelez ou écrivez : vous aurez en face de vous des gens qui connaissent les chantiers ferroviaires.' })}`;
  return {
    ctx: {
      p,
      path: 'a-propos.html',
      title: 'À propos : Digiferro et Digivoda | Digiferro',
      description: 'Digiferro présente les formations ferroviaires de DIGIVODA, organisme certifié Qualiopi : centres partout en France, intra sur site, e-learning.',
      bodyClass: 'page-about',
      scripts: ['map'],
      jsonld: [jsonld(breadcrumbLD(data, trail))],
    },
    main: body,
  };
}

/* ---------------------------------------------------------------- Contact */

const CONTACT_FAQ = [
  { q: 'Sous quel délai s’inscrire ?', a: 'Pour la TCS M et le recyclage SECUFER en inter-entreprises, au moins 11 jours ouvrés avant la session. Une session intra s’organise en 30 à 45 jours.' },
  { q: 'Les tarifs sont-ils HT ou TTC ?', a: 'Les tarifs affichés sont TTC, par personne.' },
  { q: 'Pouvez-vous venir sur notre site ?', a: 'Oui, en intra : la session se tient chez vous et ne réunit que vos agents.' },
];

export function contact(data) {
  const p = '';
  const o = data.organisme;
  const trail = crumbs('Contact', 'contact.html');
  const osm = `https://www.openstreetmap.org/search?query=${encodeURIComponent(o.adresse_centre)}`;
  const body = `${pageHero(p, trail, {
    station: 'Contact',
    title: 'Parlons de votre besoin de formation',
    lead: 'Un agent à habiliter, une équipe à former avant un chantier, un recyclage à planifier : décrivez votre besoin, Digivoda vous répond avec un devis.',
  })}
<section class="section contact" aria-label="Coordonnées et formulaire">
  <div class="wrap contact__grid">
    <div class="contact__info">
      <div class="contact__card contact__card--phone">
        <p class="contact__label">Par téléphone</p>
        <a class="contact__phone" href="tel:${o.telephone_e164}">${icon('phone', 'icon')}${esc(o.telephone)}</a>
        <p class="contact__small">Horaires : ${todo('horaires d’ouverture')}</p>
      </div>
      <div class="contact__card">
        <p class="contact__label">Par e-mail</p>
        <a class="contact__mail" href="mailto:${esc(o.email)}">${icon('mail', 'icon icon--sm')}${esc(o.email)}</a>
      </div>
      <div class="contact__card">
        <p class="contact__label">Adresses</p>
        <dl class="spec">
          <div><dt>Siège</dt><dd>${esc(o.adresse_siege)}</dd></div>
          <div><dt>Centre</dt><dd>${esc(o.adresse_centre)}</dd></div>
        </dl>
      </div>
      <div class="map-ph">
        <svg class="map-ph__grid" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true"><path d="M0 160 L400 120 M0 60 L400 90 M120 0 L160 220 M300 0 L260 220"/><path class="map-ph__rail" d="M0 190 C120 170 220 150 400 40"/></svg>
        <span class="map-ph__pin">${icon('pin', 'icon')}</span>
        <p class="map-ph__text">${todo('plan d’accès (carte interactive) du centre')}</p>
        <a class="link-arrow" href="${osm}" rel="noopener">Ouvrir dans OpenStreetMap${icon('arrow', 'icon icon--sm')}</a>
      </div>
    </div>
    <div class="contact__form" id="devis">
      <h2 class="contact__form-title">Demande de devis</h2>
      <p class="contact__form-lead">Tous les champs marqués d’un astérisque sont obligatoires. La formation choisie sur une fiche est déjà présélectionnée.</p>
      ${formBox(data, null, p)}
    </div>
  </div>
</section>
<section class="section band band--steel contact-more" aria-labelledby="contact-faq">
  <div class="wrap faq-home__grid">
    <div class="faq-home__head">
      <h2 id="contact-faq">Avant d’envoyer votre demande</h2>
      <a class="link-arrow" href="faq.html">Toutes les questions${icon('arrow', 'icon icon--sm')}</a>
    </div>
    ${faqHTML(CONTACT_FAQ, 'faq-contact')}
  </div>
</section>`;
  return {
    ctx: {
      p,
      path: 'contact.html',
      title: 'Contact et demande de devis | Digiferro',
      description: `Demandez un devis pour une formation ferroviaire : SECUFER, TCS M, C0, RSO, packs. Téléphone ${o.telephone}, e-mail ou formulaire, réponse de Digivoda.`,
      bodyClass: 'page-contact',
      scripts: ['form'],
      devis: '#devis',
      jsonld: [
        jsonld({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Digiferro',
          mainEntity: { '@type': 'Organization', name: 'DIGIVODA', telephone: o.telephone_e164, email: o.email, address: { '@type': 'PostalAddress', streetAddress: '4 allée des Garays', postalCode: '91120', addressLocality: 'Palaiseau', addressCountry: 'FR' } },
        }),
        jsonld(faqLD(CONTACT_FAQ)),
        jsonld(breadcrumbLD(data, trail)),
      ],
    },
    main: body,
  };
}

/* ---------------------------------------------------------------- FAQ */

export const FAQ_GROUPS = [
  {
    id: 'inscription',
    title: 'Inscription et délais',
    items: [
      { q: 'Comment demander un devis ?', a: 'Par le formulaire de contact ou par téléphone. Indiquez la formation ou le pack, le nombre d’agents et le format souhaité : centre, intra ou e-learning.' },
      { q: 'Sous quel délai s’inscrire à une session inter-entreprises ?', a: 'Pour la TCS M et le recyclage SECUFER, au moins 11 jours ouvrés avant la session.' },
      { q: 'Combien de temps faut-il pour organiser une session intra ?', a: 'Comptez 30 à 45 jours pour organiser une session intra sur votre site.' },
      { q: 'Les tarifs affichés sont-ils HT ou TTC ?', a: 'TTC, par personne.' },
    ],
  },
  {
    id: 'validite',
    title: 'Validité et recyclage',
    items: [
      { q: 'Combien de temps l’attestation SECUFER reste-t-elle valable ?', a: 'Trois ans. Le recyclage SECUFER, une demi-journée de 3 h 30, la renouvelle pour trois ans de plus.' },
      { q: 'Jusqu’à quand peut-on faire le recyclage SECUFER ?', a: 'Avec une attestation initiale encore valide, ou expirée depuis moins de 6 mois, et une aptitude médicale en cours de validité.' },
      { q: 'La TCS M doit-elle être renouvelée ?', a: 'Oui. Une évaluation annuelle des compétences est obligatoire pour que l’employeur maintienne l’habilitation Annonceur Sentinelle / ASP.' },
      { q: 'Qui délivre l’habilitation : l’organisme ou l’employeur ?', a: 'L’organisme de formation remet l’attestation de formation. L’habilitation est délivrée par l’employeur.' },
    ],
  },
  {
    id: 'modalites',
    title: 'Lieux et modalités',
    items: [
      { q: 'Où ont lieu les formations ?', a: 'Dans les centres Digivoda partout en France, ou sur le site du client en intra.' },
      { q: 'Quelles formations existent à distance ?', a: 'La SECUFER existe en e-learning. Le recyclage SECUFER peut se suivre en présentiel, à distance ou en e-learning.' },
      { q: 'Combien de stagiaires par session ?', a: 'Le recyclage SECUFER accueille 4 à 12 stagiaires. La TCS M réunit en moyenne une douzaine de stagiaires.' },
      { q: 'Quelles conditions pour suivre la TCS M ?', a: 'Une aptitude médicale et psychotechnique délivrée par un médecin du travail, un niveau de français B1 à l’oral et à l’écrit, et être majeur. Aucun diplôme n’est requis.' },
    ],
  },
  {
    id: 'financement',
    title: 'Financement',
    items: [
      { q: 'Qui peut financer la formation ?', a: 'Pour un salarié, l’OPCO de l’entreprise ou le plan de développement des compétences de l’employeur. Pour la TCS M, un financement par France Travail est aussi mentionné pour les demandeurs d’emploi.' },
      { q: 'Le devis suffit-il pour une demande de prise en charge ?', a: 'Le devis TTC sert de base à la demande de prise en charge auprès de votre financeur.' },
    ],
  },
  {
    id: 'packs',
    title: 'Packs',
    items: [
      { q: 'Qu’est-ce qu’un pack ?', a: 'Plusieurs formations enchaînées dans un même parcours, avec une seule inscription. Trois des quatre packs affichent une remise sur leur prix initial.' },
      { q: 'Que contient le Pack Sentinelle Complet ?', a: 'La formation aux risques électriques C0 et la TCS M complète (Annonceur + ASP), en 5 jours, pour 1 080 € TTC.' },
      { q: 'Quel est le pack le plus complet ?', a: 'Le Pack Ferroviaire Premium : 10 jours, TCS M + ASP, Agent prestataire LAM et S9, et APEC CH1-CB1, pour 2 500 € TTC au lieu de 2 900 €.' },
    ],
  },
];

export function faqPage(data) {
  const p = '';
  const trail = crumbs('FAQ', 'faq.html');
  const all = FAQ_GROUPS.flatMap((g) => g.items);
  const body = `${pageHero(p, trail, {
    station: 'FAQ',
    title: 'Questions fréquentes',
    lead: 'Inscription, validité des attestations, lieux, financement, packs : les réponses aux questions posées le plus souvent avant une formation.',
  })}
<section class="section faq-page" aria-label="Questions par thème">
  <div class="wrap faq-page__grid">
    <nav class="faq-page__nav line-index" aria-label="Thèmes de la FAQ">
      <ol>${FAQ_GROUPS.map((g) => `<li><a href="#${g.id}"><span class="line-index__stop" aria-hidden="true"></span><span>${esc(g.title)}</span><span class="line-index__n">${g.items.length}</span></a></li>`).join('')}</ol>
    </nav>
    <div class="faq-page__groups">
      ${FAQ_GROUPS.map((g) => `<section class="faq-page__group" aria-labelledby="${g.id}"><h2 id="${g.id}">${esc(g.title)}</h2>${faqHTML(g.items, 'faq-' + g.id).replace(' open', '')}</section>`).join('\n')}
    </div>
  </div>
</section>
${ctaBand(p, data.organisme, { title: 'Votre question n’est pas dans la liste ?', text: 'Posez-la directement : par téléphone ou dans le message du formulaire de devis.' })}`;
  return {
    ctx: {
      p,
      path: 'faq.html',
      title: 'Questions fréquentes sur les formations | Digiferro',
      description: 'SECUFER, TCS M, recyclage, délais d’inscription, lieux, financement et packs : les réponses aux questions fréquentes sur les formations ferroviaires.',
      bodyClass: 'page-faq',
      jsonld: [jsonld(faqLD(all)), jsonld(breadcrumbLD(data, trail))],
    },
    main: body,
  };
}

/* ---------------------------------------------------------------- Pages légales */

const reviewBanner = `<div class="review-banner" role="note">
  <p class="review-banner__title">${icon('signal', 'icon icon--sm')}Page à faire relire avant la mise en ligne</p>
  <p>Ce contenu doit être complété à partir des documents publiés par Digivoda, puis validé par le client. Point clé : préciser qui édite le site Digiferro (Digivoda ou une autre entité).</p>
</div>`;

function legalPage(data, { path, title, seoTitle, description, lead, sections }) {
  const p = '';
  const trail = crumbs(title, path);
  const body = `${pageHero(p, trail, { station: 'Informations légales', title, lead, mod: 'legal' })}
<section class="section legal">
  <div class="wrap legal__grid">
    <nav class="legal__toc" aria-label="Sommaire">
      <p class="legal__toc-title">Sommaire</p>
      <ol>${sections.map((s, i) => `<li><a href="#art-${i + 1}">${esc(s.title)}</a></li>`).join('')}</ol>
    </nav>
    <div class="legal__body prose">
      ${reviewBanner}
      ${sections.map((s, i) => `<section id="art-${i + 1}" aria-labelledby="art-${i + 1}-t"><h2 id="art-${i + 1}-t"><span class="legal__n">${String(i + 1).padStart(2, '0')}</span>${esc(s.title)}</h2>${s.html}</section>`).join('\n')}
      <p class="legal__updated">Dernière mise à jour : ${todo('date de validation')}</p>
    </div>
  </div>
</section>`;
  return {
    ctx: { p, path, title: seoTitle, description, bodyClass: 'page-legal', jsonld: [jsonld(breadcrumbLD(data, trail))] },
    main: body,
  };
}

export function mentions(data) {
  const o = data.organisme;
  return legalPage(data, {
    path: 'mentions-legales.html',
    title: 'Mentions légales',
    seoTitle: 'Mentions légales | Digiferro',
    description: 'Mentions légales du site Digiferro : éditeur, organisme de formation DIGIVODA, hébergeur, propriété intellectuelle et données personnelles.',
    lead: 'Informations prévues par la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique.',
    sections: [
      {
        title: 'Éditeur du site',
        html: `<dl class="spec spec--wide">
  <div><dt>Éditeur</dt><dd>${todo('raison sociale de l’éditeur de Digiferro')}</dd></div>
  <div><dt>Forme et capital</dt><dd>${todo('forme juridique et capital social')}</dd></div>
  <div><dt>Siège</dt><dd>${todo('adresse du siège de l’éditeur')}</dd></div>
  <div><dt>RCS et SIRET</dt><dd>${todo('numéro RCS et SIRET')}</dd></div>
  <div><dt>TVA</dt><dd>${todo('numéro de TVA intracommunautaire ou mention d’exonération')}</dd></div>
  <div><dt>Directeur de la publication</dt><dd>${todo('nom du directeur de la publication')}</dd></div>
  <div><dt>Contact</dt><dd><a href="tel:${o.telephone_e164}">${esc(o.telephone)}</a> · <a href="mailto:${esc(o.email)}">${esc(o.email)}</a></dd></div>
</dl>`,
      },
      {
        title: 'Organisme de formation',
        html: `<p>Les formations présentées sur ce site sont dispensées par <strong>DIGIVODA</strong>.</p>
<dl class="spec spec--wide">
  <div><dt>Siège</dt><dd>${esc(o.adresse_siege)}</dd></div>
  <div><dt>Centre de formation</dt><dd>${esc(o.adresse_centre)}</dd></div>
  <div><dt>Identifiants</dt><dd>${todo('SIREN / SIRET de DIGIVODA, à reprendre de ses mentions légales')}</dd></div>
  <div><dt>Déclaration d’activité</dt><dd>Enregistrée sous le numéro ${todo('numéro de déclaration d’activité')} auprès du préfet de région ${todo('région')}. Cet enregistrement ne vaut pas agrément de l’État.</dd></div>
  <div><dt>Qualité</dt><dd>${esc(o.qualiopi.mention)}</dd></div>
</dl>`,
      },
      {
        title: 'Hébergement',
        html: `<p>${todo('nom, adresse et téléphone de l’hébergeur du site')}</p>`,
      },
      {
        title: 'Propriété intellectuelle',
        html: `<p>Les textes, pictogrammes, illustrations et la charte graphique de ce site sont protégés. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.</p>
<p>Les crédits des visuels sont listés dans le fichier des crédits du site. Le logo Qualiopi est la propriété du ministère chargé de la formation professionnelle.</p>`,
      },
      {
        title: 'Données personnelles et cookies',
        html: `<p>Le traitement des données transmises par le formulaire de devis est décrit dans la <a href="politique-confidentialite.html">politique de confidentialité</a>.</p>
<p>Ce site ne dépose aucun cookie de mesure d’audience ni de cookie publicitaire.</p>`,
      },
      {
        title: 'Liens',
        html: `<p>Les liens vers des sites extérieurs, dont digivoda.com, sont fournis pour information. Digiferro n’est pas responsable de leur contenu.</p>`,
      },
    ],
  });
}

export function cgv(data) {
  return legalPage(data, {
    path: 'cgv.html',
    title: 'Conditions générales de vente',
    seoTitle: 'Conditions générales de vente | Digiferro',
    description: 'Conditions générales de vente des formations ferroviaires dispensées par DIGIVODA : inscription, tarifs, paiement, annulation, attestation.',
    lead: 'Conditions applicables aux formations présentées sur Digiferro et dispensées par DIGIVODA.',
    sections: [
      { title: 'Objet', html: `<p>Les présentes conditions s’appliquent aux formations inter-entreprises, intra-entreprise et en e-learning présentées sur ce site et dispensées par DIGIVODA.</p><p>${todo('reprendre l’article « objet » des CGV publiées par Digivoda')}</p>` },
      { title: 'Inscription', html: `<p>Pour les sessions inter-entreprises de la TCS M et du recyclage SECUFER, l’inscription se fait au moins 11 jours ouvrés avant la session. Une session intra s’organise en 30 à 45 jours.</p><p>${todo('modalités d’inscription : devis, convention ou contrat de formation, confirmation')}</p>` },
      { title: 'Tarifs', html: `<p>Les tarifs affichés sur le site sont exprimés TTC, par personne.</p><p>${todo('conditions tarifaires de l’intra, frais de déplacement, validité des devis')}</p>` },
      { title: 'Paiement', html: `<p>${todo('échéances, moyens de paiement, pénalités de retard')}</p>` },
      { title: 'Annulation, report et absence', html: `<p>${todo('conditions d’annulation ou de report par le client et par l’organisme, absence d’un stagiaire')}</p>` },
      { title: 'Prise en charge par un financeur', html: `<p>Le devis TTC sert de base à la demande de prise en charge auprès d’un OPCO ou d’un autre financeur.</p><p>${todo('règles en cas de prise en charge partielle ou de refus du financeur')}</p>` },
      { title: 'Attestation de formation', html: `<p>Une attestation de formation est remise au stagiaire à l’issue de la formation. L’habilitation éventuelle est délivrée par l’employeur.</p>` },
      { title: 'Accessibilité', html: `<p>Les personnes en situation de handicap peuvent signaler leur besoin dès la demande de devis. Référent handicap : ${todo('coordonnées')}.</p>` },
      { title: 'Supports pédagogiques', html: `<p>${todo('droits d’utilisation des supports remis aux stagiaires')}</p>` },
      { title: 'Données personnelles', html: `<p>Voir la <a href="politique-confidentialite.html">politique de confidentialité</a>.</p>` },
      { title: 'Droit applicable et litiges', html: `<p>${todo('droit applicable, médiation et juridiction compétente')}</p>` },
    ],
  });
}

export function confidentialite(data) {
  const o = data.organisme;
  return legalPage(data, {
    path: 'politique-confidentialite.html',
    title: 'Politique de confidentialité',
    seoTitle: 'Politique de confidentialité | Digiferro',
    description: 'Données collectées par le formulaire de devis Digiferro, finalités, durée de conservation, destinataires et droits RGPD : accès, rectification, effacement.',
    lead: 'Ce que deviennent les informations que vous transmettez par le formulaire de devis.',
    sections: [
      { title: 'Responsable du traitement', html: `<p>${todo('responsable du traitement : Digiferro ou DIGIVODA')}</p><p>Contact pour toute question sur vos données : <a href="mailto:${esc(o.email)}">${esc(o.email)}</a>.</p>` },
      { title: 'Données collectées', html: `<p>Le formulaire de devis recueille votre nom, votre adresse e-mail, votre numéro de téléphone, le nom de votre entreprise, la formation ou le pack choisi, le nombre de participants et votre message. Aucun compte n’est créé, aucune autre donnée n’est collectée.</p>` },
      { title: 'Finalités et base légale', html: `<p>Ces données servent à répondre à votre demande de devis et, si vous donnez suite, à organiser la formation. Le traitement repose sur les mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).</p>` },
      { title: 'Destinataires', html: `<p>DIGIVODA, organisme qui dispense les formations. ${todo('prestataire d’envoi du formulaire (Formspree, Netlify…) et hébergeur')}</p>` },
      { title: 'Durée de conservation', html: `<p>${todo('durée de conservation ; la CNIL retient en général 3 ans après le dernier contact pour un prospect')}</p>` },
      { title: 'Vos droits', html: `<p>Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation du traitement et de portabilité de vos données. Pour l’exercer, écrivez à <a href="mailto:${esc(o.email)}">${esc(o.email)}</a>.</p><p>Vous pouvez aussi adresser une réclamation à la CNIL (<a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).</p>` },
      { title: 'Cookies et services tiers', html: `<p>Ce site ne dépose aucun cookie de mesure d’audience ni de cookie publicitaire. La vidéo et les images sont hébergées sur le site lui-même.</p><p>Les polices de caractères sont chargées depuis les serveurs de Google Fonts, ce qui transmet votre adresse IP à Google. ${todo('héberger les polices sur le site, ou le mentionner ici comme sous-traitant')}</p>` },
    ],
  });
}

/* ---------------------------------------------------------------- 404 */

export function notFound(data) {
  const p = '/';
  const body = `<section class="section notfound">
  <div class="wrap notfound__grid">
    <div>
      <p class="station station--signal">Erreur 404</p>
      <h1>Voie sans issue</h1>
      <p class="notfound__lead">La page demandée n’existe pas, ou elle a changé d’adresse. Reprenez depuis l’un de ces points d’arrêt.</p>
      <ul class="notfound__links">
        <li><a class="btn btn--signal" href="${p}formations/index.html">Catalogue des formations</a></li>
        <li><a class="btn btn--ghost" href="${p}index.html">Accueil</a></li>
        <li><a class="link-arrow" href="${p}contact.html">Contact${icon('arrow', 'icon icon--sm')}</a></li>
      </ul>
    </div>
    <svg class="notfound__buffer" viewBox="0 0 240 160" aria-hidden="true"><path d="M10 150 H230"/><path d="M40 150 V70 H200 V150"/><path class="a" d="M40 70 H200 V100 H40 Z"/><path d="M60 70 V100 M90 70 V100 M120 70 V100 M150 70 V100 M180 70 V100"/><path d="M0 150 H40 M200 150 H240" stroke-dasharray="4 8"/></svg>
  </div>
</section>`;
  return {
    ctx: { p, path: '404.html', title: 'Page introuvable | Digiferro', description: 'La page demandée n’existe pas. Retrouvez le catalogue des formations ferroviaires Digiferro.', bodyClass: 'page-404', noindex: true },
    main: body,
  };
}
