import { esc, icon, priceHTML, dureeHTML, jsonld, isMissing, phoneLinks } from './util.mjs';
import { groupsOf, devisHref } from './partials.mjs';
import { franceMap } from './map.mjs';
import { mediaFor, centreImages, photoTag } from './media.mjs';

export const IMG_ALT = {
  'ph-voie-perspective': 'Voie ferrée en perspective, rails et traverses sur ballast',
  'ph-salle-formation': 'Salle de formation avec un schéma de voie projeté au tableau',
  'ph-e-learning': 'Ordinateur portable affichant un module de formation ferroviaire',
  'ph-sentinelle-annonce': 'Annonceur sentinelle avec trompe et drapeau au bord de la voie',
  'ph-agent-epi': "Agent en casque et gilet haute visibilité au bord d'une voie ferrée",
  'ph-catenaire': 'Poteaux et fils de caténaire au-dessus d’une voie',
  'ph-signal-electrique': 'Signal lumineux et installations électriques de traction',
  'ph-chantier-coordination': 'Chantier ferroviaire avec agents en équipement de protection',
  'ph-reseaux': 'Tranchée laissant voir des réseaux enterrés près des voies',
  'ph-passage-niveau': 'Passage à niveau avec croix de Saint-André et barrière',
  'ph-train-face': 'Train vu de face arrivant sur la voie',
  'ph-catenaire-perche': 'Intervention sur caténaire avec perche de mise à la terre',
};

export const img = (p, key, { w = 600, h = 400, cls = '', eager = false, alt } = {}) =>
  `<img${cls ? ` class="${cls}"` : ''} src="${p}assets/img/${key}.svg" alt="${esc(alt ?? IMG_ALT[key] ?? '')}" width="${w}" height="${h}"${eager ? '' : ' loading="lazy"'} decoding="async">`;

// Visuel d'une formation ou d'un pack : photo du dossier media/ si elle existe, sinon visuel provisoire.
// Renvoie le conteneur complet ; la mention « Photo à fournir » (data-ph) n'apparaît que sur les provisoires.
export const CARD_SIZES = '(min-width: 80em) 23rem, (min-width: 40em) 45vw, 100vw';
export const HERO_SIZES = '(min-width: 64em) 38vw, 100vw';

export function visual(p, item, { tag = 'div', cls = '', w = 600, h = 400, eager = false, extra = '', photo, sizes = CARD_SIZES } = {}) {
  // 1. photos choisies dans les données ; 2. dossier media/ ; 3. visuel provisoire
  if (item.photos?.length) return `<${tag} class="${cls}">${photoTag(p, item.photos[0], { eager, sizes })}${extra}</${tag}>`;
  const m = photo || mediaFor(item)[0];
  const alt = item.image_alt || `Formation ${item.titre_court}`;
  const image = m
    ? `<img src="${p}${m.src}" alt="${esc(alt)}" width="${m.w}" height="${m.h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`
    : img(p, item.images?.[0] || 'ph-voie-perspective', { w, h, eager });
  return `<${tag} class="${cls}"${m ? '' : ' data-ph'}>${image}${extra}</${tag}>`;
}

// Photo générique d'une section (centre, intra…) : photo fournie sinon visuel provisoire
export const sectionVisual = (p, photo, key, { tag = 'div', cls = '', w = 480, h = 320, alt, sizes = '(min-width: 64em) 30vw, 100vw' } = {}) =>
  typeof photo === 'string'
    ? `<${tag} class="${cls}">${photoTag(p, photo, { sizes })}</${tag}>`
    : photo
      ? `<${tag} class="${cls}"><img src="${p}${photo.src}" alt="${esc(alt || IMG_ALT[key] || '')}" width="${photo.w}" height="${photo.h}" loading="lazy" decoding="async"></${tag}>`
      : `<${tag} class="${cls}" data-ph>${img(p, key, { w, h, alt })}</${tag}>`;

export function formationCard(p, f, { heading = 'h4' } = {}) {
  return `<article class="fcard reveal${f.type !== 'formation' ? ' fcard--' + f.type : ''}">
  ${visual(p, f, { cls: 'fcard__media', extra: f.type !== 'formation' ? `<span class="fcard__type">${f.type === 'recyclage' ? 'Recyclage' : 'E-learning'}</span>` : '' })}
  <div class="fcard__body">
    <p class="fcard__meta"><span class="code">${esc(f.code)}</span><span class="fcard__dur">${icon('clock', 'icon icon--xs')}${dureeHTML(f.duree, 'todo--xs')}</span></p>
    <${heading} class="fcard__title"><a href="${p}${f.page}">${esc(f.titre)}</a></${heading}>
    <p class="fcard__sum">${esc(f.resume)}</p>
    <div class="fcard__foot"><span class="fcard__price">${priceHTML(f.tarif)}</span><span class="fcard__more" aria-hidden="true">Voir la formation${icon('arrow', 'icon icon--sm')}</span></div>
  </div>
</article>`;
}

export function packTicket(p, k, data, { heading = 'h3' } = {}) {
  const [name, sub] = k.titre.split(' – ');
  return `<article class="ticket reveal">
  <div class="ticket__main">
    <p class="ticket__kicker"><span>Pack</span><span>${dureeHTML(k.duree, 'todo--xs')}</span></p>
    <${heading} class="ticket__title"><a href="${p}${k.page}">${esc(name)}</a></${heading}>
    ${sub ? `<p class="ticket__sub">${esc(sub)}</p>` : ''}
    <ol class="ticket__line" aria-label="Formations incluses">${k.modules_publies.map((m) => `<li>${esc(m)}</li>`).join('')}</ol>
  </div>
  <div class="ticket__stub">
    <p class="ticket__price">${priceHTML(k.tarif, { size: 'lg' })}</p>
    <a class="btn btn--signal btn--block" href="${devisHref(p, k.id)}">Réserver ce pack</a>
    <a class="btn btn--ghost btn--block" href="${p}${k.page}">Voir la formation</a>
  </div>
</article>`;
}

export const HOME_FAQ = [
  {
    q: "Combien de temps l'attestation SECUFER reste-t-elle valable ?",
    a: "Trois ans. Le recyclage SECUFER, une demi-journée de 3 h 30, renouvelle l'attestation pour trois ans de plus. Il faut s'y inscrire avec une attestation initiale encore valide, ou expirée depuis moins de 6 mois.",
  },
  {
    q: "Qui délivre l'habilitation : l'organisme de formation ou l'employeur ?",
    a: "L'organisme de formation remet l'attestation de formation. L'habilitation, elle, est délivrée par l'employeur, sur la base de cette attestation.",
  },
  {
    q: 'La TCS M doit-elle être renouvelée ?',
    a: "Oui. Une évaluation annuelle des compétences est obligatoire pour que l'employeur maintienne l'habilitation Annonceur Sentinelle / ASP. C'est l'objet du recyclage TCS M.",
  },
  {
    q: 'Pouvez-vous former nos agents sur notre site ?',
    a: "Oui, en intra, sur le site du client. Comptez 30 à 45 jours pour organiser une session intra. En inter-entreprises, l'inscription se fait au moins 11 jours ouvrés avant la session.",
  },
  {
    q: 'Les tarifs affichés sont-ils HT ou TTC ?',
    a: 'Les tarifs indiqués sur le site sont TTC, par personne.',
  },
];

export const faqHTML = (items, id = 'faq') =>
  `<div class="accordion">${items
    .map(
      (it, i) => `<details class="accordion__item"${i === 0 ? ' open' : ''}>
  <summary id="${id}-q${i + 1}"><span>${esc(it.q)}</span><span class="accordion__sign" aria-hidden="true"></span></summary>
  <div class="accordion__body"><p>${esc(it.a)}</p></div>
</details>`
    )
    .join('')}</div>`;

export const faqLD = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((it) => ({ '@type': 'Question', name: it.q, acceptedAnswer: { '@type': 'Answer', text: it.a } })),
});

export function mapFigure({ id = 'carte', compact = false } = {}) {
  return `<figure class="map-figure${compact ? ' map-figure--compact' : ''}">
  ${franceMap({ id, compact })}
  <figcaption class="map-legend">
    <span class="map-legend__item"><span class="map-legend__pin" aria-hidden="true"></span>Centre Digivoda, Palaiseau (91)</span>
    <span class="map-legend__item"><span class="map-legend__line" aria-hidden="true"></span>Centres Digivoda partout en France</span>
    <span class="map-legend__item"><span class="map-legend__train" aria-hidden="true"></span>Sur site client en intra</span>
  </figcaption>
</figure>`;
}

export function home(data) {
  const p = '';
  const o = data.organisme;
  const groups = groupsOf(data);
  const packs = data.packs.slice().sort((a, b) => a.ordre - b.ordre);

  const hero = `<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media" aria-hidden="true">
    <img class="hero__poster" src="assets/img/hero-voie-poster.webp" alt="" width="1280" height="720" fetchpriority="high">
    <video class="hero__video" muted loop playsinline preload="metadata" poster="assets/img/hero-voie-poster.webp" data-hero-video tabindex="-1">
      <source data-src="assets/video/hero-voie.webm" type="video/webm">
      <source data-src="assets/video/hero-voie.mp4" type="video/mp4">
    </video>
  </div>
  <svg class="hero__wires" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 28 Q360 70 720 28 T1440 28"/><path d="M0 52 H1440"/><path d="M180 44 V52 M360 49 V52 M540 44 V52 M900 44 V52 M1080 49 V52 M1260 44 V52"/></svg>
  <div class="wrap hero__in">
    <p class="station station--light">Formations sécurité ferroviaire</p>
    <h1 class="hero__title" id="hero-title">Former vos équipes avant qu’elles ne posent le pied sur la voie.</h1>
    <p class="hero__lead">SECUFER, TCS M, risques électriques C0, RSO, AIPR, caténaire : ${data.formations.length} formations et ${data.packs.length} packs pour les entreprises ferroviaires, leurs sous-traitants et les agents qui travaillent sur le réseau. Les sessions sont assurées par DIGIVODA.</p>
    <div class="hero__cta">
      <a class="btn btn--signal btn--lg" href="#formations">Voir les formations${icon('arrow', 'icon icon--sm')}</a>
      <a class="btn btn--ghost-light btn--lg" href="${devisHref(p)}">S’inscrire</a>
    </div>
    <ul class="chips" aria-label="Garanties">
      <li class="chip">${icon('shield', 'icon icon--sm')}Organisme certifié Qualiopi</li>
      <li class="chip">${icon('helmet', 'icon icon--sm')}Intra sur votre site</li>
      <li class="chip">${icon('pin', 'icon icon--sm')}Centres partout en France</li>
    </ul>
  </div>
  <div class="hero__board">
    <div class="wrap hero__board-in">
      <dl class="board">
        <div><dt>Formations</dt><dd>${data.formations.length}</dd></div>
        <div><dt>Packs</dt><dd>${packs.length}</dd></div>
        <div><dt>Modalités</dt><dd class="board__txt">Inter · Intra · E-learning</dd></div>
        <div><dt>Tarifs</dt><dd class="board__txt">TTC, par personne</dd></div>
      </dl>
      <button class="video-toggle" type="button" data-video-toggle hidden data-paused="false"><span class="video-toggle__pause">${icon('pause', 'icon icon--sm')}<span>Pause vidéo</span></span><span class="video-toggle__play">${icon('play', 'icon icon--sm')}<span>Lire la vidéo</span></span></button>
    </div>
  </div>
</section>`;

  const catalogue = `<section class="section cat-home" id="formations" aria-labelledby="formations-title">
  <div class="wrap cat-home__grid">
    <div class="cat-home__side">
      <div class="cat-home__sticky">
        <span class="pk" aria-hidden="true"><small>PK</small>01</span>
        <h2 class="cat-home__title" id="formations-title">Douze formations, rangées par poste</h2>
        <p>Commencez par le poste à tenir sur le chantier : la bonne formation en découle. Chaque fiche donne le code, la durée, le tarif et les conditions d’accès.</p>
        <nav class="line-index" aria-label="Thèmes de formation">
          <ol>${groups
            .map((g) => `<li><a href="#theme-${g.id}"><span class="line-index__stop" aria-hidden="true"></span><span>${esc(g.label)}</span><span class="line-index__n">${g.items.length}</span></a></li>`)
            .join('')}</ol>
        </nav>
        <a class="link-arrow" href="formations/index.html">Catalogue avec filtres${icon('arrow', 'icon icon--sm')}</a>
      </div>
    </div>
    <div class="cat-home__groups">
      ${groups
        .map(
          (g) => `<section class="theme-group theme-group--n${g.items.length}" id="theme-${g.id}" aria-labelledby="th-${g.id}">
        <header class="theme-group__head">
          <h3 class="station" id="th-${g.id}">${esc(g.label)}</h3>
          <span class="theme-group__count">${g.items.length} formation${g.items.length > 1 ? 's' : ''}</span>
        </header>
        <div class="cards">${g.items.map((f) => formationCard(p, f)).join('')}</div>
      </section>`
        )
        .join('')}
    </div>
  </div>
</section>`;

  const packsSec = `<section class="section band band--night band--cut packs-home" id="packs" aria-labelledby="packs-title">
  <svg class="band__catenary" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 18 Q240 58 480 18 T960 18 T1440 18"/><path d="M0 44 H1440"/><path d="M120 34 V44 M240 38 V44 M360 34 V44 M600 34 V44 M720 38 V44 M840 34 V44 M1080 34 V44 M1200 38 V44 M1320 34 V44"/></svg>
  <div class="wrap">
    <header class="packs-home__head">
      <div>
        <span class="pk pk--night" aria-hidden="true"><small>PK</small>02</span>
        <h2 id="packs-title">Les packs : plusieurs habilitations, une seule inscription</h2>
      </div>
      <p>Un nouvel agent à habiliter de A à Z, ou une équipe qui part sur un chantier RFN ? Les packs enchaînent les formations dans un même parcours.</p>
    </header>
    <div class="tickets">${packs.map((k) => packTicket(p, k, data)).join('')}</div>
  </div>
</section>`;

  const why = `<section class="section why" aria-labelledby="why-title">
  <div class="wrap why__grid">
    <div class="why__statement">
      <span class="pk" aria-hidden="true"><small>PK</small>03</span>
      <h2 id="why-title">Sur une voie ouverte aux circulations, personne ne s’improvise sentinelle.</h2>
      <p>Un train lancé met plusieurs centaines de mètres à s’arrêter. Entre l’annonce et son passage, l’équipe n’a que quelques secondes pour dégager la voie. Ce délai se calcule, il se prépare et il s’apprend en formation. C’est aussi ce que vérifie le donneur d’ordre avant d’ouvrir son chantier.</p>
      ${sectionVisual(p, data.site.photos?.pourquoi, 'ph-agent-epi', { tag: 'figure', cls: 'offset-media', w: 720, h: 480, sizes: '(min-width: 64em) 45vw, 100vw' })}
    </div>
    <div class="why__panel">
      <h3 id="why-rules" class="why__panel-title">Ce que prévoient les textes</h3>
      <dl class="rules">
        <div><dt>SECUFER</dt><dd>Socle de la sécurité ferroviaire, adossé au décret n° 2017-694. L’attestation se renouvelle tous les 3 ans.</dd></div>
        <div><dt>TCS M</dt><dd>Missions d’Annonceur Sentinelle et d’ASP encadrées par l’arrêté du 7 mai 2015. Évaluation annuelle des compétences pour maintenir l’habilitation.</dd></div>
        <div><dt>Habilitation</dt><dd>L’organisme forme et remet l’attestation. L’habilitation est délivrée par l’employeur.</dd></div>
      </dl>
      <h3 class="why__panel-title">Ce que vos équipes y gagnent</h3>
      <ul class="ticks">
        <li>${icon('check', 'icon icon--sm')}Chacun sait qui annonce, qui protège et qui décide sur le chantier.</li>
        <li>${icon('check', 'icon icon--sm')}Des attestations à jour, prêtes à montrer au donneur d’ordre.</li>
        <li>${icon('check', 'icon icon--sm')}Des agents qui savent travailler près de la caténaire et du rail conducteur.</li>
        <li>${icon('check', 'icon icon--sm')}Un recyclage planifié avant l’expiration, et non le lendemain.</li>
      </ul>
    </div>
  </div>
</section>`;

  const steps = [
    ['Votre demande', 'Par le formulaire ou par téléphone. Indiquez la formation, le nombre d’agents et le lieu souhaité.'],
    ['Devis et convention', 'Vous recevez un devis TTC. Il sert aussi de base à une demande de prise en charge auprès de votre financeur.'],
    ['La formation', 'En centre Digivoda, sur votre site en intra, ou en e-learning pour les modules qui le permettent.'],
    ['L’attestation', 'Remise à l’issue des évaluations. L’employeur s’appuie dessus pour délivrer l’habilitation.'],
  ];
  const parcours = `<section class="section band band--steel parcours" aria-labelledby="parcours-title">
  <div class="wrap">
    <header class="parcours__head">
      <h2 id="parcours-title">De la demande à l’attestation : quatre arrêts</h2>
      <span class="pk pk--steel" aria-hidden="true"><small>PK</small>04</span>
    </header>
    <div class="parcours__track" data-rail-progress>
      <svg class="parcours__rail" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true">
        <path class="parcours__ties" d="M0 12 H1000"/>
        <path class="parcours__rail-a" d="M0 6 H1000" pathLength="1"/>
        <path class="parcours__rail-b" d="M0 18 H1000" pathLength="1"/>
      </svg>
      <ol class="parcours__steps">${steps
        .map(
          ([t, d], i) => `<li class="step reveal" style="--d:${i * 90}ms"><span class="step__light" aria-hidden="true"><span></span><span></span></span><span class="step__n">Arrêt ${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`
        )
        .join('')}</ol>
    </div>
    <p class="parcours__note">${icon('clock', 'icon icon--sm')}En inter-entreprises, l’inscription se fait au moins 11 jours ouvrés avant la session. Une session intra s’organise en 30 à 45 jours.</p>
  </div>
</section>`;

  const modes = `<section class="section modes" id="lieux" aria-labelledby="modes-title">
  <div class="wrap modes__grid">
    <div class="modes__map">${mapFigure({ id: 'carte-home' })}</div>
    <div class="modes__list">
      <span class="pk" aria-hidden="true"><small>PK</small>05</span>
      <h2 id="modes-title">En centre, sur votre site ou à distance</h2>
      <p class="modes__intro">Trois façons de suivre une formation. Le choix dépend surtout du nombre d’agents et de vos contraintes de chantier.</p>
      <article class="mode">
        ${sectionVisual(p, data.site.photos?.centre || centreImages()[0], 'ph-salle-formation', { cls: 'mode__media', alt: 'Salle du centre de formation Digivoda de Palaiseau', sizes: '11rem' })}
        <div class="mode__body">
          <h3>Centres Digivoda partout en France</h3>
          <p>Sessions inter-entreprises : vos agents rejoignent un groupe déjà constitué. C’est la formule la plus simple pour une ou deux personnes. Le centre de Palaiseau accueille les stagiaires au 4 allée des Garays.</p>
        </div>
      </article>
      <article class="mode mode--flip">
        ${sectionVisual(p, data.site.photos?.intra, 'ph-chantier-coordination', { cls: 'mode__media', sizes: '11rem' })}
        <div class="mode__body">
          <h3>Sur site client, en intra</h3>
          <p>Le formateur se déplace chez vous et la session ne réunit que vos agents. Prévoyez 30 à 45 jours pour caler la date.</p>
        </div>
      </article>
      <article class="mode mode--compact">
        ${sectionVisual(p, data.site.photos?.distance, 'ph-e-learning', { cls: 'mode__media', sizes: '7rem' })}
        <div class="mode__body">
          <h3>E-learning</h3>
          <p>La SECUFER existe en e-learning, et le recyclage SECUFER peut aussi se suivre à distance. Pratique pour les agents en horaires décalés.</p>
          <a class="link-arrow" href="formations/secufer-e-learning.html">SECUFER en e-learning${icon('arrow', 'icon icon--sm')}</a>
        </div>
      </article>
    </div>
  </div>
</section>`;

  const funding = `<section class="section band band--paper funding" aria-labelledby="funding-title">
  <div class="wrap funding__grid">
    <div class="funding__q">
      <p class="eyebrow"><span class="pk pk--inline" aria-hidden="true"><small>PK</small>06</span> Financement</p>
      <h2 id="funding-title">Qui paie la formation ?</h2>
      <p>Cela dépend du statut de l’agent, pas de la formation choisie. Voici les trois cas les plus fréquents. Chaque fiche formation précise les dispositifs publiés pour elle.</p>
    </div>
    <div class="ledger-wrap">
      <table class="ledger">
        <caption class="sr-only">Dispositifs de financement selon la situation de l’agent</caption>
        <thead><tr><th scope="col">Situation</th><th scope="col">Dispositif</th><th scope="col">À savoir</th></tr></thead>
        <tbody>
          <tr><th scope="row">Salarié d’une entreprise</th><td>OPCO de l’entreprise</td><td>Le devis sert de base à la demande de prise en charge.</td></tr>
          <tr><th scope="row">Entreprise qui forme ses équipes</th><td>Plan de développement des compétences</td><td>Formation intégrée au budget formation de l’employeur, en inter ou en intra.</td></tr>
          <tr><th scope="row">Demandeur d’emploi</th><td>France Travail</td><td>Mentionné pour la TCS M, souvent la première étape d’une reconversion vers la voie.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`;

  const faq = `<section class="section faq-home" aria-labelledby="faq-title">
  <div class="wrap faq-home__grid">
    <div class="faq-home__head">
      <span class="pk" aria-hidden="true"><small>PK</small>07</span>
      <h2 id="faq-title">Avant de vous inscrire</h2>
      <p>Les cinq questions qui reviennent le plus au téléphone.</p>
      <a class="link-arrow" href="faq.html">Toutes les questions${icon('arrow', 'icon icon--sm')}</a>
    </div>
    ${faqHTML(HOME_FAQ, 'faq-home')}
  </div>
</section>`;

  const cta = ctaBand(p, o);

  const ld = [
    jsonld({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'DIGIVODA',
      url: 'https://digivoda.com/',
      brand: { '@type': 'Brand', name: 'Digiferro' },
      email: o.email,
      telephone: o.telephone_e164,
      contactPoint: (o.telephones || []).map((t) => ({ '@type': 'ContactPoint', telephone: t.e164, contactType: t.label, areaServed: 'FR', availableLanguage: 'French' })),
      address: { '@type': 'PostalAddress', streetAddress: '5 rue Jules Barbier', postalCode: '92290', addressLocality: 'Châtenay-Malabry', addressCountry: 'FR' },
      logo: `${data.site.base_url}/assets/favicon/apple-touch-icon.png`,
    }),
    jsonld(faqLD(HOME_FAQ)),
  ];

  return {
    ctx: {
      p,
      path: 'index.html',
      title: 'Formations sécurité ferroviaire SECUFER, TCS M | Digiferro',
      description:
        `SECUFER, TCS M, C0, RSO, AIPR, caténaire : ${data.formations.length} formations et ${data.packs.length} packs ferroviaires, en centre, en intra ou en e-learning. Tarifs TTC.`,
      bodyClass: 'page-home',
      scripts: ['video', 'map'],
      jsonld: ld,
      preload: '<link rel="preload" as="image" href="assets/img/hero-voie-poster.webp" fetchpriority="high">',
    },
    main: [hero, catalogue, packsSec, why, parcours, modes, funding, faq, cta].join('\n'),
  };
}

export function ctaBand(p, o, { title = 'Un démarrage de chantier approche ?', text = 'Indiquez la formation, le nombre d’agents et le lieu. Digivoda vous confirme votre inscription et les prochaines sessions.', href } = {}) {
  return `<section class="cta-band" aria-labelledby="cta-title">
  <svg class="cta-band__rails" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <path d="M370 0 L120 400 M430 0 L680 400"/>
    <path class="cta-band__ties" d="M362 13h76M350 32h100M335 56h130M315 88h170M290 128h220M257 181h286M213 251h374M150 352h500"/>
  </svg>
  <div class="wrap cta-band__in">
    <h2 id="cta-title">${esc(title)}</h2>
    <p>${esc(text)}</p>
    <div class="cta-band__actions">
      <a class="btn btn--signal btn--lg" href="${href || devisHref(p)}">S’inscrire</a>
      <a class="cta-band__phone" href="tel:${o.telephone_e164}">${icon('phone', 'icon')}<span><small>Par téléphone</small>${esc(o.telephone)}</span></a>
      ${(o.telephones || []).length > 1 ? `<div class="cta-band__phone cta-band__phone--group">${icon('phone', 'icon')}<span><small>${esc(o.telephones[1].label)}</small><span class="cta-band__nums">${o.telephones.slice(1).map((t) => `<a href="tel:${t.e164}">${esc(t.affichage)}</a>`).join('')}</span></span></div>` : ''}
    </div>
  </div>
</section>`;
}
