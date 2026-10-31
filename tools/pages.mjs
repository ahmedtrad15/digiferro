// Pages transverses : catalogue filtrable, à propos, contact, FAQ, pages légales, 404.
import { esc, icon, todo, show, priceHTML, dureeHTML, jsonld, phoneLinks, phoneGroups } from './util.mjs';
import { breadcrumb, devisHref, groupsOf, qualiopiFigure } from './partials.mjs';
import { img, visual, sectionVisual, formationCard, faqHTML, faqLD, mapFigure, ctaBand } from './home.mjs';
import { centreImages, qualiopiLogo } from './media.mjs';
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
  return `<article class="fcard fcard--pack reveal">
  ${visual(p, k, { cls: 'fcard__media', extra: '<span class="fcard__type">Pack</span>' })}
  <div class="fcard__body">
    <p class="fcard__meta"><span class="fcard__dur">${icon('clock', 'icon icon--xs')}${dureeHTML(k.duree, 'todo--xs')}</span></p>
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
    aside: (() => {
      const o = data.organisme;
      const gest = (o.telephones || []).slice(1);
      return `<div class="page-hero__help"><p>Pas sûr de la formation à choisir ? Parlez-en au gestionnaire de formations ferroviaires.</p>${gest.map((t) => `<a class="page-hero__phone" href="tel:${t.e164}">${icon('phone', 'icon icon--sm')}${esc(t.affichage)}</a>`).join('')}<p class="page-hero__alt">Standard : <a href="tel:${o.telephone_e164}">${esc(o.telephone)}</a></p><a class="link-arrow" href="${devisHref(p)}">Décrire mon besoin${icon('arrow', 'icon icon--sm')}</a></div>`;
    })(),
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

// Plan d'accès Google Maps chargé seulement à la demande (pas de cookie tiers avant le clic)
export function mapsAccess(o, { title = 'Plan d’accès au centre Digivoda de Palaiseau' } = {}) {
  return `<div class="maps-access" data-maps-embed="${esc(o.maps_embed)}" data-maps-title="${esc(title)}">
  <svg class="maps-access__grid" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true"><path d="M0 160 L400 120 M0 60 L400 90 M120 0 L160 220 M300 0 L260 220"/><path class="maps-access__rail" d="M0 190 C120 170 220 150 400 40"/></svg>
  <span class="maps-access__pin">${icon('pin', 'icon')}</span>
  <div class="maps-access__body">
    <p class="maps-access__addr"><strong>Centre de formation Digivoda</strong><br>${esc(o.adresse_centre)}</p>
    <div class="maps-access__actions">
      <button class="btn btn--signal btn--sm" type="button" data-maps-load>Afficher la carte</button>
      <a class="link-arrow" href="${esc(o.maps_url)}" target="_blank" rel="noopener">Ouvrir dans Google Maps${icon('arrow', 'icon icon--sm')}<span class="sr-only"> (nouvel onglet)</span></a>
    </div>
    <p class="maps-access__note">La carte est fournie par Google : elle ne se charge qu’après votre clic.</p>
  </div>
</div>`;
}

export function aPropos(data) {
  const p = '';
  const o = data.organisme;
  const trail = crumbs('À propos', 'a-propos.html');
  const photos = o.centre_photos?.length ? o.centre_photos : centreImages();
  const ALTS = ['Salle de formation du centre Digivoda de Palaiseau', 'Espace de formation du centre de Palaiseau', 'Équipements pédagogiques du centre de Palaiseau', 'Accueil du centre Digivoda de Palaiseau'];
  const gallery = (photos.length ? photos : [null, null, null])
    .slice(0, 6)
    .map((ph, i) => sectionVisual(p, ph, ['ph-salle-formation', 'ph-agent-epi', 'ph-e-learning'][i % 3], { tag: 'figure', cls: `centre-gallery__item centre-gallery__item--${i + 1}`, w: 720, h: 480, alt: typeof ph === 'string' ? undefined : ALTS[i % ALTS.length], sizes: i === 0 ? '(min-width: 64em) 30vw, 100vw' : '(min-width: 64em) 15vw, 50vw' }))
    .join('');
  const body = `${pageHero(p, trail, {
    station: 'À propos',
    title: 'Qui forme vos équipes ?',
    lead: 'Digiferro présente l’offre ferroviaire de DIGIVODA, organisme de formation certifié Qualiopi. Les sessions ont lieu dans ses centres, en classe virtuelle ou sur le site de ses clients.',
  })}
<section class="section centre" aria-labelledby="about-centre">
  <div class="wrap centre__grid">
    <div class="centre__text">
      <span class="pk" aria-hidden="true"><small>PK</small>01</span>
      <h2 id="about-centre">Le centre de Palaiseau</h2>
      <p class="about__lead">C’est là que se tiennent les sessions inter-entreprises d’Île-de-France : salles équipées pour la théorie, supports et matériel pour les exercices pratiques.</p>
      <dl class="spec spec--wide">
        <div><dt>Adresse</dt><dd>${esc(o.adresse_centre)}</dd></div>
        <div><dt>Téléphone</dt><dd>${phoneGroups(o.telephones || []).map((g) => `<span class="facts__line">${g.items.map((t) => `<a href="tel:${t.e164}">${esc(t.affichage)}</a>`).join(' · ')} <small>(${esc(g.label)})</small></span>`).join('')}</dd></div>
        <div><dt>Accès</dt><dd><a href="${esc(o.maps_url)}" target="_blank" rel="noopener">Itinéraire Google Maps<span class="sr-only"> (nouvel onglet)</span></a></dd></div>
      </dl>
    </div>
    <div class="centre-gallery centre-gallery--n${Math.min(photos.length || 3, 6)}">${gallery}</div>
  </div>
</section>
<section class="section band band--steel principles" aria-labelledby="about-how">
  <div class="wrap">
    <header class="principles__head"><h2 id="about-how">Notre façon de former</h2><span class="pk pk--steel" aria-hidden="true"><small>PK</small>02</span></header>
    <ol class="principles__list">
      <li><h3>Le terrain comme référence</h3><p>La TCS M se termine par une mise en situation sur chantier pédagogique. Une annonce se travaille au bord d’une voie, pas seulement au tableau.</p></li>
      <li><h3>Plusieurs formats</h3><p>En centre Digivoda avec d’autres entreprises, en classe virtuelle, sur votre site en intra, ou en e-learning pour les modules qui le permettent.</p></li>
      <li><h3>Des prix lisibles</h3><p>Les tarifs sont affichés TTC, par personne. En intra, le prix est établi sur devis selon le nombre d’agents et le lieu.</p></li>
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
      <p class="about__lead">Dans les centres Digivoda partout en France, en classe virtuelle, ou directement sur le site du client en intra.</p>
      ${mapsAccess(o)}
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
      ${qualiopiFigure(p, o, 'qualiopi qualiopi--light')}
      <div class="commitments__access">
        <h3>Personnes en situation de handicap</h3>
        <p>Digivoda dispose d’un référent handicap et publie un registre public d’accessibilité. Signalez votre besoin dès l’inscription : la session peut être adaptée.</p>
        <p>Pour joindre le référent handicap : <a href="mailto:${esc(o.email)}">${esc(o.email)}</a> ou <a href="tel:${o.telephone_e164}">${esc(o.telephone)}</a>.</p>
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
      title: 'À propos : le centre de formation Digivoda | Digiferro',
      description: 'Digiferro présente les formations ferroviaires de DIGIVODA, organisme certifié Qualiopi : centre de Palaiseau, classe virtuelle, intra sur site, e-learning.',
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
  const body = `${pageHero(p, trail, {
    station: 'Contact',
    title: 'Parlons de votre besoin de formation',
    lead: 'Un agent à habiliter, une équipe à former avant un chantier, un recyclage à planifier : inscrivez-vous en ligne, Digivoda vous confirme votre inscription et les dates.',
  })}
<section class="section contact" aria-label="Coordonnées et formulaire">
  <div class="wrap contact__grid">
    <div class="contact__info">
      <div class="contact__card contact__card--phone">
        <p class="contact__label">Par téléphone</p>
        <a class="contact__phone" href="tel:${o.telephone_e164}">${icon('phone', 'icon')}${esc(o.telephone)}</a>
        ${phoneLinks(o, { cls: 'phones phones--dark', skipFirst: true })}
        <p class="contact__small">Numéro non surtaxé</p>
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
      ${mapsAccess(o)}
    </div>
    <div class="contact__form" id="inscription">
      <h2 class="contact__form-title">Inscription</h2>
      <p class="contact__form-lead">Tous les champs marqués d’un astérisque sont obligatoires. La formation choisie sur une fiche est déjà présélectionnée.</p>
      ${formBox(data, null, p)}
    </div>
  </div>
</section>
<section class="section band band--steel contact-more" aria-labelledby="contact-faq">
  <div class="wrap faq-home__grid">
    <div class="faq-home__head">
      <h2 id="contact-faq">Avant d’envoyer votre inscription</h2>
      <a class="link-arrow" href="faq.html">Toutes les questions${icon('arrow', 'icon icon--sm')}</a>
    </div>
    ${faqHTML(CONTACT_FAQ, 'faq-contact')}
  </div>
</section>`;
  return {
    ctx: {
      p,
      path: 'contact.html',
      title: 'Contact et inscription | Digiferro',
      description: `Inscrivez-vous à une formation ferroviaire : SECUFER, TCS M, C0, RSO, packs. Téléphone ${o.telephone}, e-mail ou formulaire, réponse de Digivoda.`,
      bodyClass: 'page-contact',
      scripts: ['form'],
      devis: '#inscription',
      jsonld: [
        jsonld({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Digiferro',
          mainEntity: { '@type': 'Organization', name: 'DIGIVODA', telephone: o.telephone_e164, email: o.email, contactPoint: (o.telephones || []).map((t) => ({ '@type': 'ContactPoint', telephone: t.e164, contactType: t.label, areaServed: 'FR', availableLanguage: 'French' })), address: { '@type': 'PostalAddress', streetAddress: '4 allée des Garays', postalCode: '91120', addressLocality: 'Palaiseau', addressCountry: 'FR' } },
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
    id: 'choisir',
    title: 'Choisir sa formation',
    items: [
      { q: 'Par quelle formation commencer quand on débute dans le ferroviaire ?', a: 'Par la SECUFER : c’est le socle de sécurité demandé à tout intervenant sur les emprises. Elle ouvre ensuite la voie aux habilitations de poste : TCS M, TES F, LAM, S9, caténaire.' },
      { q: 'Quelle différence entre la SECUFER et la TCS M ?', a: 'La SECUFER donne les règles de sécurité de base à tout intervenant. La TCS M forme à un poste précis : Annonceur Sentinelle et Agent Sécurité du Personnel, chargés de protéger l’équipe des circulations.' },
      { q: 'Annonceur Sentinelle ou ASP : quelle différence ?', a: 'L’Annonceur Sentinelle surveille les circulations et donne l’alerte. L’Agent Sécurité du Personnel organise la protection du personnel sur le chantier. La TCS M prépare aux deux missions.' },
      { q: 'C0 ou caténaire CH1-CB1 : laquelle choisir ?', a: 'Le C0 suffit pour travailler à proximité des installations électriques sans y intervenir. La formation Percheur / Aide Monteur CH1-CB1 prépare aux opérations de perchage et de protection électrique de la caténaire.' },
      { q: 'Quelle formation pour protéger un passage à niveau ?', a: 'La TES F, qui forme à protéger les circulations ferroviaires vis-à-vis des circulations routières, et réciproquement, aux passages à niveau.' },
      { q: 'Qui doit avoir l’AIPR ?', a: 'Toute personne qui intervient à proximité de réseaux enterrés ou aériens, y compris sur les emprises ferroviaires : opérateurs, conducteurs d’engins, encadrants, concepteurs. Elle est obligatoire depuis le 1er janvier 2018.' },
    ],
  },
  {
    id: 'inscription',
    title: 'Inscription, délais et tarifs',
    items: [
      { q: 'Comment s’inscrire ?', a: 'Par le formulaire d’inscription de la page Contact ou au 01 89 70 55 70. Indiquez la formation ou le pack, le nombre d’agents et le format souhaité : centre, classe virtuelle, intra ou e-learning.' },
      { q: 'Sous quel délai s’inscrire à une session inter-entreprises ?', a: 'Au moins 11 jours ouvrés avant la date de la session.' },
      { q: 'Combien de temps faut-il pour organiser une session intra ?', a: 'Comptez 30 à 45 jours pour organiser une session sur votre site.' },
      { q: 'Les tarifs affichés sont-ils HT ou TTC ?', a: 'TTC, par personne, pour les sessions inter-entreprises, en classe virtuelle ou en e-learning.' },
      { q: 'Comment est calculé le prix d’une session intra ?', a: 'Sur devis, selon le nombre d’agents, la formation choisie et le lieu de la session.' },
      { q: 'Un particulier peut-il s’inscrire ?', a: 'Oui. Un demandeur d’emploi peut aussi solliciter une prise en charge par France Travail, selon son éligibilité.' },
    ],
  },
  {
    id: 'prerequis',
    title: 'Prérequis et aptitude',
    items: [
      { q: 'Faut-il une aptitude médicale ?', a: 'Oui pour intervenir sur les voies. Pour la TCS M, la TES F et l’Agent S9A3, une aptitude médicale et psychotechnique délivrée par un médecin du travail est demandée.' },
      { q: 'Quel niveau de français est demandé ?', a: 'Le niveau B1 à l’oral et à l’écrit pour les tâches de sécurité comme la TCS M : il faut comprendre les consignes et se faire comprendre sans ambiguïté.' },
      { q: 'Faut-il un diplôme ?', a: 'Non, aucune de ces formations n’exige de diplôme. Pour la TCS M, il faut être majeur.' },
      { q: 'Faut-il une expérience du ferroviaire ?', a: 'Pas pour la SECUFER ni pour la TCS M, souvent la porte d’entrée dans le métier. La RSO s’adresse en revanche à des agents expérimentés.' },
    ],
  },
  {
    id: 'deroulement',
    title: 'Déroulement et évaluation',
    items: [
      { q: 'Où ont lieu les formations ?', a: 'Dans les centres Digivoda partout en France, dont le centre de Palaiseau, ou sur le site du client en intra. La SECUFER existe aussi en classe virtuelle et en e-learning.' },
      { q: 'Comment se passe une classe virtuelle ?', a: 'La session a lieu en direct avec le formateur, à distance. Il faut un ordinateur avec caméra, micro et connexion internet.' },
      { q: 'Quelles formations existent à distance ?', a: 'La SECUFER en classe virtuelle ou en e-learning, et le recyclage SECUFER à distance ou en e-learning.' },
      { q: 'Y a-t-il de la pratique ?', a: 'Oui. La TCS M se termine par une mise en situation sur chantier pédagogique ; la plupart des formations de poste comportent des exercices et des mises en situation.' },
      { q: 'Comment est-on évalué ?', a: 'Selon la formation : QCM, évaluation pratique, ou les deux. Pour la TCS M, trois modules certificatifs avec au moins 12/20 à chacun.' },
      { q: 'Combien de stagiaires par session ?', a: 'En général de 4 à 12 stagiaires ; une douzaine en moyenne pour la TCS M.' },
    ],
  },
  {
    id: 'validite',
    title: 'Attestations, validité et recyclage',
    items: [
      { q: 'Qui délivre l’habilitation : l’organisme ou l’employeur ?', a: 'L’organisme de formation remet l’attestation de formation. L’habilitation est délivrée par l’employeur, sur la base de cette attestation.' },
      { q: 'Combien de temps l’attestation SECUFER reste-t-elle valable ?', a: 'Trois ans. Le recyclage SECUFER, une demi-journée de 3 h 30, la renouvelle pour trois ans de plus.' },
      { q: 'Jusqu’à quand peut-on faire le recyclage SECUFER ?', a: 'Avec une attestation initiale encore valide, ou expirée depuis moins de 6 mois, et une aptitude médicale en cours de validité.' },
      { q: 'La TCS M doit-elle être renouvelée ?', a: 'Oui. Une évaluation annuelle des compétences est obligatoire pour que l’employeur maintienne l’habilitation : c’est le recyclage TCS M.' },
      { q: 'Combien de temps l’AIPR est-elle valable ?', a: '5 ans au maximum. Elle se renouvelle par un nouvel examen.' },
      { q: 'Faut-il recycler le C0 et la formation caténaire ?', a: 'Un recyclage tous les 3 ans est recommandé, comme le prévoit la norme NF C 18-510 pour les habilitations électriques.' },
    ],
  },
  {
    id: 'financement',
    title: 'Financement',
    items: [
      { q: 'Qui peut financer la formation ?', a: 'Pour un salarié, l’OPCO de l’entreprise ou le plan de développement des compétences de l’employeur. Pour un demandeur d’emploi, France Travail, selon son éligibilité.' },
      { q: 'Le devis suffit-il pour une demande de prise en charge ?', a: 'Le devis TTC sert de base à la demande de prise en charge auprès de votre financeur.' },
      { q: 'Les formations en e-learning sont-elles finançables ?', a: 'Oui, dans les mêmes conditions que les formations en salle.' },
    ],
  },
  {
    id: 'packs',
    title: 'Packs',
    items: [
      { q: 'Qu’est-ce qu’un pack ?', a: 'Plusieurs formations enchaînées dans un même parcours, avec une seule inscription.' },
      { q: 'Que contient le Pack Sentinelle Complet ?', a: 'La formation aux risques électriques C0 et la TCS M complète (Annonceur + ASP), en 5 jours, pour 1 080 € TTC.' },
      { q: 'Que contient le Pack Caténaire ?', a: 'La TCS M complète et l’Agent de Protection Électrique Caténaire (APEC), pour 1 800 € TTC.' },
      { q: 'Quel est le pack le plus complet ?', a: 'Le Pack Ferroviaire Premium : 10 jours, TCS M + ASP, Agent prestataire LAM et S9, et APEC CH1-CB1, pour 2 500 € TTC au lieu de 2 900 €.' },
      { q: 'Peut-on suivre un pack en intra ?', a: 'Oui, sur votre site ; le tarif est alors établi sur devis.' },
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
    lead: 'Choisir sa formation, prérequis, déroulement, validité des attestations, financement, packs : les réponses aux questions posées le plus souvent avant une formation ferroviaire.',
  })}
<section class="section faq-page" aria-label="Questions par thème">
  <div class="wrap faq-page__grid">
    <nav class="faq-page__nav line-index" aria-label="Thèmes de la FAQ">
      <ol>${FAQ_GROUPS.map((g) => `<li><a href="#${g.id}"><span class="line-index__stop" aria-hidden="true"></span><span>${esc(g.title)}</span><span class="line-index__n">${g.items.length}</span></a></li>`).join('')}<li><a href="#par-formation"><span class="line-index__stop" aria-hidden="true"></span><span>FAQ par formation</span><span class="line-index__n">${data.formations.length + data.packs.length}</span></a></li></ol>
    </nav>
    <div class="faq-page__groups">
      ${FAQ_GROUPS.map((g) => `<section class="faq-page__group" aria-labelledby="${g.id}"><h2 id="${g.id}">${esc(g.title)}</h2>${faqHTML(g.items, 'faq-' + g.id).replace(' open', '')}</section>`).join('\n')}
      <section class="faq-page__group" aria-labelledby="par-formation">
        <h2 id="par-formation">FAQ par formation</h2>
        <p class="faq-page__intro">Chaque fiche a ses propres questions fréquentes : contenu, prérequis, évaluation, tarif, validité.</p>
        <ul class="faq-index">${[...groupsOf(data).flatMap((g) => g.items), ...data.packs.slice().sort((a, b) => a.ordre - b.ordre)]
          .map((x) => `<li><a href="${x.page}#faq"><span class="code">${esc(x.code || 'Pack')}</span><span>${esc(x.titre_court)}</span><small>${(x.editorial?.faq || []).length} questions</small></a></li>`)
          .join('')}</ul>
      </section>
    </div>
  </div>
</section>
${ctaBand(p, data.organisme, { title: 'Votre question n’est pas dans la liste ?', text: 'Posez-la directement : par téléphone ou dans le message du formulaire d’inscription.' })}`;
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

const UPDATED = '31 octobre 2026';

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
      ${sections.map((s, i) => `<section id="art-${i + 1}" aria-labelledby="art-${i + 1}-t"><h2 id="art-${i + 1}-t"><span class="legal__n">${String(i + 1).padStart(2, '0')}</span>${esc(s.title)}</h2>${s.html}</section>`).join('\n')}
      <p class="legal__updated">Dernière mise à jour : ${UPDATED}</p>
    </div>
  </div>
</section>`;
  return {
    ctx: { p, path, title: seoTitle, description, bodyClass: 'page-legal', jsonld: [jsonld(breadcrumbLD(data, trail))] },
    main: body,
  };
}

const contactLinks = (o) => `${(o.telephones || []).map((t) => `<a href="tel:${t.e164}">${esc(t.affichage)}</a>`).join(' · ')} · <a href="mailto:${esc(o.email)}">${esc(o.email)}</a>`;

export function mentions(data) {
  const o = data.organisme;
  return legalPage(data, {
    path: 'mentions-legales.html',
    title: 'Mentions légales',
    seoTitle: 'Mentions légales | Digiferro',
    description: 'Mentions légales du site Digiferro : éditeur DIGIVODA, organisme de formation, hébergement, propriété intellectuelle et données personnelles.',
    lead: 'Informations prévues par la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique.',
    sections: [
      {
        title: 'Éditeur du site',
        html: `<p>Le site Digiferro est édité par <strong>DIGIVODA</strong>.</p>
<dl class="spec spec--wide">
  <div><dt>Forme et capital</dt><dd>${esc(o.forme_juridique)}</dd></div>
  <div><dt>Siège social</dt><dd>${esc(o.adresse_siege)}</dd></div>
  <div><dt>Immatriculation</dt><dd>${esc(o.rcs)}</dd></div>
  <div><dt>SIRET (siège)</dt><dd>${esc(o.siret)}</dd></div>
  <div><dt>Directeur de la publication</dt><dd>${esc(o.directeur_publication)}</dd></div>
  <div><dt>Contact</dt><dd>${contactLinks(o)}</dd></div>
</dl>`,
      },
      {
        title: 'Organisme de formation',
        html: `<p>Les formations présentées sur ce site sont conçues et dispensées par DIGIVODA.</p>
<dl class="spec spec--wide">
  <div><dt>Centre de formation</dt><dd>${esc(o.adresse_centre)}</dd></div>
  <div><dt>Déclaration d’activité</dt><dd>${esc(o.declaration_activite)}</dd></div>
  <div><dt>Qualité</dt><dd>${esc(o.qualiopi.mention)}</dd></div>
</dl>`,
      },
      {
        title: 'Hébergement',
        html: `<p>Le site est un site statique, hébergé par un prestataire spécialisé. Ses coordonnées sont communiquées sur simple demande adressée à <a href="mailto:${esc(o.email)}">${esc(o.email)}</a>.</p>`,
      },
      {
        title: 'Propriété intellectuelle',
        html: `<p>Les textes, photographies, pictogrammes, illustrations et la charte graphique de ce site sont protégés par le droit d’auteur. Toute reproduction, totale ou partielle, sans autorisation écrite préalable de DIGIVODA est interdite.</p>
<p>Le logo Qualiopi est la propriété du ministère chargé de la formation professionnelle ; il est reproduit sans modification.</p>`,
      },
      {
        title: 'Données personnelles et cookies',
        html: `<p>Le traitement des données transmises par le formulaire d’inscription est décrit dans la <a href="politique-confidentialite.html">politique de confidentialité</a>.</p>
<p>Ce site ne dépose aucun cookie de mesure d’audience ni de cookie publicitaire.</p>`,
      },
      {
        title: 'Liens',
        html: `<p>Les liens vers des sites extérieurs, dont digivoda.com, sont fournis pour information. DIGIVODA n’est pas responsable de leur contenu.</p>`,
      },
    ],
  });
}

export function cgv(data) {
  const o = data.organisme;
  return legalPage(data, {
    path: 'cgv.html',
    title: 'Conditions générales de vente',
    seoTitle: 'Conditions générales de vente | Digiferro',
    description: 'Conditions générales de vente des formations ferroviaires dispensées par DIGIVODA : inscription, tarifs, paiement, annulation, financement, attestation.',
    lead: 'Conditions applicables aux formations présentées sur Digiferro et dispensées par DIGIVODA.',
    sections: [
      { title: 'Objet', html: `<p>Les présentes conditions générales de vente s’appliquent à toutes les formations présentées sur le site Digiferro et dispensées par DIGIVODA : sessions inter-entreprises, sessions intra-entreprise, classes virtuelles et parcours en e-learning. Toute inscription implique leur acceptation sans réserve.</p>` },
      { title: 'Inscription', html: `<p>La demande d’inscription se fait par le formulaire d’inscription du site, par téléphone ou par e-mail. Pour une session inter-entreprises, elle doit parvenir au moins 11 jours ouvrés avant la date de la session ; une session intra s’organise en 30 à 45 jours.</p><p>L’inscription devient définitive à la signature du devis et de la convention de formation (entreprise) ou du contrat de formation (particulier). Une convocation précisant le lieu, les horaires et les modalités d’accès est ensuite adressée au stagiaire.</p>` },
      { title: 'Tarifs', html: `<p>Les tarifs affichés sur le site sont exprimés TTC, par personne, pour les sessions inter-entreprises, les classes virtuelles et l’e-learning.</p><p>Les sessions intra-entreprise font l’objet d’un devis, établi selon la formation, le nombre d’agents, le lieu et les éventuels frais de déplacement. Le devis précise sa durée de validité.</p>` },
      { title: 'Paiement', html: `<p>Les modalités de paiement (échéances, moyens de paiement) figurent sur le devis et la convention ou le contrat de formation.</p><p>Pour les clients professionnels, tout retard de paiement entraîne l’application des pénalités prévues à l’article L. 441-10 du Code de commerce, ainsi que de l’indemnité forfaitaire de 40 € pour frais de recouvrement.</p>` },
      { title: 'Annulation, report et absence', html: `<p>Toute demande d’annulation ou de report doit être adressée par écrit, par e-mail à <a href="mailto:${esc(o.email)}">${esc(o.email)}</a>, avant le début de la formation. Les conditions applicables, notamment les délais et les éventuels frais, sont précisées dans la convention ou le contrat de formation.</p><p>Une personne qui finance elle-même sa formation dispose d’un délai de rétractation de dix jours à compter de la signature du contrat (article L. 6353-5 du Code du travail).</p><p>DIGIVODA peut reporter une session en cas de nombre de participants insuffisant ou de force majeure. Les stagiaires sont alors prévenus au plus tôt et une nouvelle date leur est proposée.</p>` },
      { title: 'Prise en charge par un financeur', html: `<p>Lorsque la formation est financée par un OPCO ou un autre organisme, il appartient au client d’effectuer la demande de prise en charge avant le début de la formation et de l’indiquer lors de l’inscription. Le devis TTC sert de base à cette demande.</p><p>En cas de prise en charge partielle ou de refus du financeur, le montant restant est facturé au client.</p>` },
      { title: 'Attestation de formation', html: `<p>Une attestation de formation est remise au stagiaire à l’issue de la formation. L’habilitation éventuelle est délivrée par l’employeur, sur la base de cette attestation.</p>` },
      { title: 'Accessibilité', html: `<p>Les personnes en situation de handicap peuvent signaler leur besoin dès l’inscription. Le référent handicap de DIGIVODA étudie avec elles les adaptations possibles : contact par e-mail à <a href="mailto:${esc(o.email)}">${esc(o.email)}</a> ou au <a href="tel:${o.telephone_e164}">${esc(o.telephone)}</a>.</p>` },
      { title: 'Supports pédagogiques', html: `<p>Les supports remis aux stagiaires sont réservés à leur usage personnel. Toute reproduction, diffusion ou exploitation commerciale sans autorisation écrite de DIGIVODA est interdite.</p>` },
      { title: 'Données personnelles', html: `<p>Voir la <a href="politique-confidentialite.html">politique de confidentialité</a>.</p>` },
      { title: 'Droit applicable et litiges', html: `<p>Les présentes conditions sont soumises au droit français. En cas de différend, les parties recherchent d’abord une solution amiable. Le client consommateur peut recourir gratuitement à un médiateur de la consommation.</p><p>À défaut d’accord, les tribunaux compétents sont ceux du ressort du siège de DIGIVODA, sous réserve des règles protectrices applicables aux consommateurs.</p>` },
    ],
  });
}

export function confidentialite(data) {
  const o = data.organisme;
  return legalPage(data, {
    path: 'politique-confidentialite.html',
    title: 'Politique de confidentialité',
    seoTitle: 'Politique de confidentialité | Digiferro',
    description: 'Données collectées par le formulaire d’inscription Digiferro, finalités, durée de conservation, destinataires et droits RGPD : accès, rectification, effacement.',
    lead: 'Ce que deviennent les informations que vous transmettez par le formulaire d’inscription.',
    sections: [
      { title: 'Responsable du traitement', html: `<p>Le responsable du traitement est <strong>DIGIVODA</strong>, ${esc(o.forme_juridique)}, dont le siège est situé ${esc(o.adresse_siege)} (${esc(o.rcs)}).</p><p>Pour toute question sur vos données : <a href="mailto:${esc(o.email)}">${esc(o.email)}</a>.</p>` },
      { title: 'Données collectées', html: `<p>Le formulaire d’inscription recueille votre nom, votre adresse e-mail, votre numéro de téléphone, le nom de votre entreprise, la formation ou le pack choisi, le nombre de participants et votre message. Aucun compte n’est créé, aucune autre donnée n’est collectée.</p>` },
      { title: 'Finalités et base légale', html: `<p>Ces données servent à traiter votre demande d’inscription et, si vous donnez suite, à organiser la formation. Le traitement repose sur les mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).</p>` },
      { title: 'Destinataires', html: `<p>Les données sont destinées à DIGIVODA, qui dispense les formations. Elles peuvent être traitées par ses sous-traitants techniques, uniquement pour les besoins de leur mission : l’hébergeur du site, et Web3Forms, le service qui transmet par e-mail les demandes envoyées depuis le formulaire. Elles ne sont ni vendues ni cédées.</p>` },
      { title: 'Durée de conservation', html: `<p>Les données d’une demande sans suite sont conservées 3 ans à compter du dernier contact. Si vous devenez client, elles sont conservées pendant la durée de la relation, puis archivées selon les obligations légales applicables.</p>` },
      { title: 'Vos droits', html: `<p>Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation du traitement et de portabilité de vos données. Pour l’exercer, écrivez à <a href="mailto:${esc(o.email)}">${esc(o.email)}</a>.</p><p>Vous pouvez aussi adresser une réclamation à la CNIL (<a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).</p>` },
      { title: 'Cookies et services tiers', html: `<p>Ce site ne dépose aucun cookie de mesure d’audience ni de cookie publicitaire. La vidéo et les images sont hébergées sur le site lui-même.</p><p>Les polices de caractères sont chargées depuis les serveurs de Google Fonts : votre adresse IP est alors transmise à Google pour l’affichage du site.</p><p>Le plan d’accès Google Maps des pages Contact et À propos ne se charge que si vous cliquez sur « Afficher la carte ». Google peut alors déposer ses propres cookies et recevoir votre adresse IP, selon sa politique de confidentialité.</p>` },
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
