// Pages formation et pack.
import { esc, icon, todo, isMissing, show, priceHTML, dureeHTML, listHTML, jsonld, eur, tarifNote, phoneLinks, phoneGroups } from './util.mjs';
import { breadcrumb, devisHref, groupsOf } from './partials.mjs';
import { img, visual, formationCard, packTicket, faqHTML, faqLD, mapFigure, IMG_ALT, HERO_SIZES } from './home.mjs';
import { photoTag } from './media.mjs';

const gallery = (photos) =>
  photos?.length > 1
    ? `<div class="item-gallery item-gallery--n${Math.min(photos.length - 1, 3)}" role="group" aria-label="Photos">${photos.slice(1, 4).map((f) => `<figure>${photoTag(P, f, { sizes: '(min-width: 64em) 18rem, 50vw' })}</figure>`).join('')}</div>`
    : '';

const P = '../';
const WIRES = `<svg class="page-hero__wires" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 18 Q360 58 720 18 T1440 18"/><path d="M0 42 H1440"/><path d="M180 34 V42 M360 38 V42 M540 34 V42 M900 34 V42 M1080 38 V42 M1260 34 V42"/></svg>`;

const illus = (name) =>
  `<svg class="illus" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

const secHead = (n, id, title, intro) =>
  `<header class="sec-mini"><span class="sec-mini__n" aria-hidden="true">${n}</span><h2 id="${id}">${title}</h2></header>${intro ? `<p class="sec-intro">${esc(intro)}</p>` : ''}`;

const lieuxHTML = (m, data) =>
  isMissing(m?.lieux) ? todo('lieux') : m.lieux.map((l) => `<span class="facts__line">${esc(l)}</span>`).join('');

const regleHTML = (r) => `<div class="rule-plate">
  <p class="rule-plate__title">${icon('signal', 'icon icon--sm')}${esc(r.titre)}</p>
  <ul>${r.points.map((x) => `<li>${show(x, x.replace(/^\[À COMPLÉTER: |\]$/g, ''))}</li>`).join('')}</ul>
  ${r.note ? `<p class="rule-plate__note">${esc(r.note)}</p>` : ''}
</div>`;

function facts(rows) {
  return `<dl class="facts">${rows
    .map(([ic, dt, dd]) => `<div class="facts__item"><dt>${icon(ic, 'icon icon--sm')}${dt}</dt><dd>${dd}</dd></div>`)
    .join('')}</dl>`;
}

export function formBox(data, selectedId, p = P) {
  const groups = groupsOf(data);
  const packs = data.packs.slice().sort((a, b) => a.ordre - b.ordre);
  const opt = (x) => `<option value="${esc(x.titre_court)}" data-id="${x.id}"${x.id === selectedId ? ' selected' : ''}>${esc(x.titre_court)}</option>`;
  const cfg = data.site.formulaire || {};
  // Envoi via Web3Forms : sans JavaScript, le formulaire est posté directement à l'API ;
  // avec JavaScript, form.js valide les champs puis envoie en JSON et affiche le message de succès.
  return `<div class="devis__box">
      <form class="form" action="${esc(cfg.endpoint || '#')}" method="post" data-form data-endpoint="${esc(cfg.endpoint || '')}">
        <input type="hidden" name="access_key" value="${esc(cfg.access_key || '')}">
        <input type="hidden" name="subject" value="${esc(cfg.objet || 'Demande d’inscription')}" data-subject>
        <input type="hidden" name="from_name" value="${esc(cfg.from_name || 'Site Digiferro')}">
        <div class="form__hp" aria-hidden="true"><label for="f-botcheck">Ne pas cocher</label><input id="f-botcheck" name="botcheck" type="checkbox" tabindex="-1" autocomplete="off"></div>
        <div class="form__row">
          <div class="field"><label for="f-nom">Nom et prénom <span class="field__req" aria-hidden="true">*</span></label><input id="f-nom" name="Nom" type="text" autocomplete="name" required aria-describedby="f-nom-err"><p class="field__err" id="f-nom-err"></p></div>
          <div class="field"><label for="f-entreprise">Entreprise</label><input id="f-entreprise" name="Entreprise" type="text" autocomplete="organization"></div>
        </div>
        <div class="form__row">
          <div class="field"><label for="f-email">E-mail <span class="field__req" aria-hidden="true">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="f-email-err"><p class="field__err" id="f-email-err"></p></div>
          <div class="field"><label for="f-tel">Téléphone <span class="field__req" aria-hidden="true">*</span></label><input id="f-tel" name="Téléphone" type="tel" autocomplete="tel" required inputmode="tel" aria-describedby="f-tel-hint f-tel-err"><p class="field__hint" id="f-tel-hint">Pour vous rappeler au sujet de votre inscription.</p><p class="field__err" id="f-tel-err"></p></div>
        </div>
        <div class="form__row form__row--wide">
          <div class="field"><label for="f-formation">Formation ou pack <span class="field__req" aria-hidden="true">*</span></label>
            <select id="f-formation" name="Formation" required aria-describedby="f-formation-err">
              <option value="">Choisir dans la liste</option>
              ${groups.map((g) => `<optgroup label="${esc(g.label)}">${g.items.map(opt).join('')}</optgroup>`).join('')}
              <optgroup label="Packs">${packs.map(opt).join('')}</optgroup>
            </select><p class="field__err" id="f-formation-err"></p></div>
          <div class="field field--short"><label for="f-nb">Participants <span class="field__req" aria-hidden="true">*</span></label><input id="f-nb" name="Participants" type="number" min="1" max="500" step="1" value="1" required inputmode="numeric" aria-describedby="f-nb-hint f-nb-err"><p class="field__hint" id="f-nb-hint">Nombre d’agents</p><p class="field__err" id="f-nb-err"></p></div>
        </div>
        <div class="field"><label for="f-msg">Votre message</label><textarea id="f-msg" name="Message" rows="4" placeholder="Période souhaitée, lieu, centre ou intra…"></textarea></div>
        <input type="hidden" name="Page" value="" data-page>
        <p class="form__legal"><span aria-hidden="true">*</span> Champs obligatoires. Vos données servent uniquement à traiter votre inscription : voir la <a href="${p}politique-confidentialite.html">politique de confidentialité</a>.</p>
        <button class="btn btn--signal btn--lg" type="submit">Envoyer mon inscription${icon('arrow', 'icon icon--sm')}</button>
        <p class="form__status" role="status" aria-live="polite"></p>
      </form>
      <div class="form-success" tabindex="-1" hidden>
        ${icon('check', 'icon icon--lg')}
        <p class="form-success__title">Inscription envoyée</p>
        <p>Merci. Votre inscription est bien partie : Digiferro vous recontacte par e-mail ou par téléphone.</p>
      </div>
    </div>`;
}

export function devisForm(data, selectedId, { title, text, p = P } = {}) {
  const o = data.organisme;
  return `<section class="section band band--night devis" id="inscription" aria-labelledby="devis-title">
  <div class="wrap devis__grid">
    <div class="devis__intro">
      <p class="station station--light">Inscription</p>
      <h2 id="devis-title">${esc(title)}</h2>
      <p>${esc(text)}</p>
      <ul class="devis__contact">
        <li><a href="tel:${o.telephone_e164}">${icon('phone', 'icon icon--sm')}${esc(o.telephone)}</a></li>
        ${phoneGroups((o.telephones || []).slice(1)).map((g) => `<li class="devis__group"><span class="devis__label">${esc(g.label)}</span>${g.items.map((t) => `<a href="tel:${t.e164}">${icon('phone', 'icon icon--sm')}${esc(t.affichage)}</a>`).join('')}</li>`).join('')}
        <li><a href="mailto:${esc(o.email)}">${icon('mail', 'icon icon--sm')}${esc(o.email)}</a></li>
      </ul>
    </div>
    ${formBox(data, selectedId, p)}
  </div>
</section>`;
}

function aside(f, data, { packIds = [], devisLabel = 'S’inscrire' } = {}) {
  const o = data.organisme;
  const packs = packIds.map((id) => data.packs.find((k) => k.id === id)).filter(Boolean);
  return `<aside class="item-aside" aria-label="Réserver">
  <div class="devis-panel">
    <p class="devis-panel__kicker"><span class="code">${esc(f.code || 'Pack')}</span></p>
    <p class="devis-panel__price">${priceHTML(f.tarif, { size: 'lg' })}${tarifNote(f.tarif)}</p>
    <ul class="devis-panel__facts">
      <li>${icon('clock', 'icon icon--sm')}${dureeHTML(f.duree)}</li>
      <li>${icon('calendar', 'icon icon--sm')}${show(f.modalites?.dates, 'dates')}</li>
    </ul>
    <a class="btn btn--signal btn--block" href="#inscription">${devisLabel}</a>
    <a class="devis-panel__phone" href="tel:${o.telephone_e164}">${icon('phone', 'icon icon--sm')}${esc(o.telephone)}</a>
    ${phoneLinks(o, { cls: 'phones phones--compact', skipFirst: true })}
    ${
      packs.length
        ? `<div class="devis-panel__packs"><p>Aussi dans ${packs.length > 1 ? `${packs.length} packs` : 'un pack'} :</p><ul>${packs
            .map((k) => `<li><a href="${P}${k.page}">${esc(k.titre_court)}</a></li>`)
            .join('')}</ul></div>`
        : ''
    }
  </div>
</aside>`;
}

const crumbs = (data, f, kind) => {
  const theme = data.themes.find((t) => t.id === f.theme);
  return [
    { label: 'Accueil', href: 'index.html' },
    { label: 'Catalogue', href: 'formations/index.html' },
    ...(kind === 'pack' ? [{ label: 'Packs', href: 'formations/index.html?type=pack' }] : []),
    ...(theme ? [{ label: theme.label, href: `formations/index.html?theme=${theme.id}` }] : []),
    { label: f.titre_court },
  ];
};

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

function courseLD(data, f, extra = {}) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: f.titre,
    description: f.resume,
    inLanguage: 'fr',
    provider: { '@type': 'Organization', name: 'DIGIVODA', sameAs: 'https://digivoda.com/' },
    ...extra,
  };
  if (f.code) ld.courseCode = f.code;
  if (f.tarif?.montant != null)
    ld.offers = { '@type': 'Offer', category: 'Paid', price: String(f.tarif.montant), priceCurrency: 'EUR', url: `${data.site.base_url}/${f.page}` };
  const online = f.type === 'e-learning';
  const inst = online ? { '@type': 'CourseInstance', courseMode: 'Online' } : { '@type': 'CourseInstance', courseMode: 'Onsite', location: 'Centres Digivoda partout en France ou sur site client' };
  if (f.duree?.heures) inst.courseWorkload = `PT${f.duree.heures}H`;
  ld.hasCourseInstance = [inst];
  return ld;
}

export function formationPage(data, f) {
  const e = f.editorial || {};
  const theme = data.themes.find((t) => t.id === f.theme);
  const trail = crumbs(data, f, 'formation');
  const related = (f.formations_liees || []).map((id) => data.formations.find((x) => x.id === id)).filter(Boolean);
  const inPacks = (f.packs || []).map((id) => data.packs.find((k) => k.id === id)).filter(Boolean);
  const key = f.images?.[0] || 'ph-voie-perspective';
  const faq = e.faq || [];
  const recy = related.find((x) => x.type === 'recyclage');

  const hero = `<div class="item-hero">
  ${WIRES}
  <div class="wrap">
    ${breadcrumb(P, trail)}
    <div class="item-hero__grid">
      <div class="item-hero__text">
        <p class="station">${esc(theme?.label || '')}</p>
        <h1>${esc(e.titre_h1 || f.titre)}</h1>
        <p class="item-hero__lead">${esc(e.lead || f.resume)}</p>
        ${e.regle ? regleHTML(e.regle) : ''}
        <div class="item-hero__cta">
          <a class="btn btn--signal btn--lg" href="#inscription">S’inscrire</a>
          <a class="link-arrow" href="#programme">Voir le programme${icon('arrow', 'icon icon--sm')}</a>
        </div>
      </div>
      ${visual(P, f, { tag: 'figure', cls: 'item-hero__media', w: 720, h: 480, eager: true, sizes: HERO_SIZES, extra: `<span class="item-hero__badge">${illus(e.illustration || 'rails')}</span>` })}
    </div>
    ${facts([
      ['clock', 'Durée', dureeHTML(f.duree)],
      ['euro', 'Tarif', priceHTML(f.tarif) + tarifNote(f.tarif)],
      ['pin', 'Lieu', lieuxHTML(f.modalites, data)],
      ['users', 'Effectif', show(f.effectif, 'effectif')],
      ['shield', 'Validité', isMissing(f.validite) ? todo('validité') : `<a href="#validite">${esc(f.validite_court || 'Voir les règles')}</a>`],
    ])}
  </div>
</div>`;

  const subnav = `<nav class="subnav" aria-label="Sur cette page"><div class="wrap"><ul>
  <li><a href="#objectifs">Objectifs</a></li><li><a href="#public">Public et prérequis</a></li><li><a href="#programme">Programme</a></li><li><a href="#modalites">Modalités</a></li><li><a href="#evaluation">Évaluation</a></li><li><a href="#validite">Validité</a></li><li><a href="#financement">Financement</a></li><li><a href="#faq">FAQ</a></li>
</ul></div></nav>`;

  const prog = Array.isArray(f.programme) && f.programme.length && typeof f.programme[0] === 'object'
    ? `<ol class="timeline">${f.programme
        .map(
          (s, i) => `<li class="timeline__stop reveal" style="--d:${i * 70}ms"><span class="timeline__day">${esc(s.etape)}</span><div class="timeline__card"><h3>${esc(s.titre)}${s.duree ? ` <span class="timeline__dur">${esc(s.duree)}</span>` : ''}</h3><p>${esc(s.contenu)}</p></div></li>`
        )
        .join('')}</ol>`
    : listHTML(f.programme, 'programme');

  const main = `<div class="item-main">
  <section class="item-sec" aria-labelledby="objectifs">
    ${secHead('01', 'objectifs', 'Objectifs', e.objectifs_intro)}
    <ol class="objectives">${isMissing(f.objectifs) ? `<li>${todo('objectifs')}</li>` : f.objectifs.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
  </section>
  <section class="item-sec item-sec--split" aria-labelledby="public">
    ${secHead('02', 'public', 'Public et prérequis', e.public_intro)}
    <div class="split">
      <div class="split__col"><h3>Pour qui</h3>${listHTML(f.public, 'public concerné', 'list list--dash')}</div>
      <div class="split__col split__col--panel"><h3>Prérequis</h3>${listHTML(f.prerequis, 'prérequis', 'list list--check')}</div>
    </div>
  </section>
  <section class="item-sec" aria-labelledby="programme">
    ${secHead('03', 'programme', 'Programme', e.programme_intro)}
    ${prog}
    ${f.programme_note ? `<p class="sec-note">${esc(f.programme_note)}</p>` : ''}
    ${gallery(f.photos)}
  </section>
  <section class="item-sec" aria-labelledby="modalites">
    ${secHead('04', 'modalites', 'Modalités et lieux', e.modalites_intro)}
    <div class="modal-grid">
      <dl class="spec">
        <div><dt>Format</dt><dd>${show(f.modalites?.libelle, 'format')}</dd></div>
        <div><dt>Lieux</dt><dd>${lieuxHTML(f.modalites, data)}</dd></div>
        <div><dt>Dates</dt><dd>${show(f.modalites?.dates, 'dates')}</dd></div>
        <div><dt>Effectif</dt><dd>${show(f.effectif, 'effectif')}</dd></div>
        <div><dt>Délai d’accès</dt><dd>${show(f.delai_acces, 'délai d’accès')}</dd></div>
        <div><dt>Accessibilité</dt><dd>${show(f.accessibilite_pmr, 'accessibilité PMR')}</dd></div>
      </dl>
      ${mapFigure({ id: 'carte-' + f.id, compact: true })}
    </div>
  </section>
  <section class="item-sec" aria-labelledby="evaluation">
    ${secHead('05', 'evaluation', 'Méthodes et évaluation', e.evaluation_intro)}
    <div class="split">
      <div class="split__col"><h3>Méthodes pédagogiques</h3>${listHTML(f.methodes, 'méthodes pédagogiques', 'list list--dash')}</div>
      <div class="split__col split__col--panel"><h3>Évaluation</h3><p>${show(f.evaluation, 'modalités d’évaluation')}</p></div>
    </div>
  </section>
  <section class="item-sec item-sec--signal" aria-labelledby="validite">
    ${secHead('06', 'validite', 'Validité et recyclage')}
    <div class="validity">
      ${illus('signal')}
      <div>
        <p class="validity__rule">${show(f.validite, 'validité / recyclage')}</p>
        ${e.validite_texte ? `<p>${esc(e.validite_texte)}</p>` : ''}
        ${recy ? `<a class="link-arrow" href="${P}${recy.page}">${esc(recy.titre)}${icon('arrow', 'icon icon--sm')}</a>` : ''}
      </div>
    </div>
  </section>
  <section class="item-sec" aria-labelledby="financement">
    ${secHead('07', 'financement', 'Financement')}
    ${
      isMissing(f.financement)
        ? `<p>${todo('financement')}</p>`
        : `<ul class="tags">${f.financement.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><p class="sec-note">Le devis TTC sert de base à la demande de prise en charge auprès de votre financeur.</p>`
    }
  </section>
  <section class="item-sec" aria-labelledby="faq">
    ${secHead('08', 'faq', esc(e.faq_titre || 'Questions fréquentes'))}
    ${faq.length ? faqHTML(faq, 'faq-' + f.id) : `<p>${todo('FAQ spécifique')}</p>`}
  </section>
</div>`;

  const relatedSec = `<section class="section related" aria-labelledby="related-title">
  <div class="wrap">
    <header class="related__head"><h2 id="related-title">À suivre avant, après ou en même temps</h2></header>
    <div class="cards cards--3">${related.map((x) => formationCard(P, x, { heading: 'h3' })).join('')}</div>
    ${
      inPacks.length
        ? `<h2 class="related__sub">Cette formation fait aussi partie ${inPacks.length > 1 ? `de ${inPacks.length} packs` : 'd’un pack'}</h2><div class="tickets tickets--light">${inPacks.map((k) => packTicket(P, k, data)).join('')}</div>`
        : ''
    }
  </div>
</section>`;

  const body = `${hero}
${subnav}
<div class="wrap item-layout">
${main}
${aside(f, data, { packIds: f.packs })}
</div>
${relatedSec}
${devisForm(data, f.id, { title: e.devis_titre || `S’inscrire : ${f.titre_court}`, text: e.devis_texte || '' })}`;

  return {
    ctx: {
      p: P,
      path: f.page,
      title: e.seo_title || `${f.titre_court} | Digiferro`,
      description: e.seo_description || f.resume,
      bodyClass: 'page-item page-formation',
      scripts: ['map', 'form'],
      devis: '#inscription',
      ogType: 'article',
      jsonld: [jsonld(courseLD(data, f)), jsonld(breadcrumbLD(data, trail)), ...(faq.length ? [jsonld(faqLD(faq))] : [])],
    },
    main: body,
  };
}

export function packPage(data, k) {
  const e = k.editorial || {};
  const trail = crumbs(data, k, 'pack');
  const incl = k.formations_incluses.map((id) => data.formations.find((x) => x.id === id)).filter(Boolean);
  const key = k.images?.[0] || 'ph-voie-perspective';
  const faq = e.faq || [];
  const others = data.packs.filter((x) => x.id !== k.id).sort((a, b) => a.ordre - b.ordre);

  // Somme des tarifs à l'unité : affichée seulement si tous les tarifs sont publiés.
  const allPriced = incl.every((x) => x.tarif?.montant != null);
  const sum = allPriced ? incl.reduce((s, x) => s + x.tarif.montant, 0) : null;
  const diff = sum != null && k.tarif?.montant != null ? sum - k.tarif.montant : null;

  const stops = [
    ...k.modules_publies.map((m) => ({ t: m })),
    { t: 'Attestations de formation', end: true },
  ];

  const hero = `<div class="item-hero item-hero--pack">
  ${WIRES}
  <div class="wrap">
    ${breadcrumb(P, trail)}
    <div class="item-hero__grid">
      <div class="item-hero__text">
        <p class="station station--signal">Pack · ${dureeHTML(k.duree)}</p>
        <h1>${esc(e.titre_h1 || k.titre)}</h1>
        <p class="item-hero__lead">${esc(e.lead || k.resume)}</p>
        <div class="item-hero__cta">
          <a class="btn btn--signal btn--lg" href="#inscription">Réserver ce pack</a>
          <a class="link-arrow" href="#incluses">Formations incluses${icon('arrow', 'icon icon--sm')}</a>
        </div>
      </div>
      ${visual(P, k, { tag: 'figure', cls: 'item-hero__media', w: 720, h: 480, eager: true, sizes: HERO_SIZES, extra: `<span class="item-hero__badge">${illus(e.illustration || 'train')}</span>` })}
    </div>
    ${facts([
      ['clock', 'Durée totale', dureeHTML(k.duree)],
      ['euro', 'Tarif du pack', priceHTML(k.tarif) + tarifNote(k.tarif)],
      ['doc', 'Formations incluses', String(incl.length)],
      ['pin', 'Lieu', lieuxHTML(k.modalites, data)],
      ['users', 'Effectif', show(k.effectif, 'effectif')],
    ])}
  </div>
</div>`;

  const subnav = `<nav class="subnav" aria-label="Sur cette page"><div class="wrap"><ul>
  <li><a href="#incluses">Formations incluses</a></li><li><a href="#parcours">Parcours</a></li><li><a href="#prix">Prix</a></li><li><a href="#public">Public et prérequis</a></li><li><a href="#modalites">Modalités</a></li><li><a href="#financement">Financement</a></li><li><a href="#faq">FAQ</a></li>
</ul></div></nav>`;

  const main = `<div class="item-main">
  <section class="item-sec" aria-labelledby="incluses">
    ${secHead('01', 'incluses', 'Les formations du pack', e.incluses_intro)}
    <ul class="included">${incl
      .map(
        (x, i) => `<li class="included__item">
        <span class="included__n" aria-hidden="true">${i + 1}</span>
        <div class="included__body">
          <p class="included__meta"><span class="code">${esc(x.code)}</span>${dureeHTML(x.duree, 'todo--xs')}</p>
          <h3><a href="${P}${x.page}">${esc(x.titre)}</a></h3>
          <p>${esc(x.resume)}</p>
        </div>
        <a class="included__link" href="${P}${x.page}" aria-hidden="true" tabindex="-1">Voir la formation${icon('arrow', 'icon icon--sm')}</a>
      </li>`
      )
      .join('')}</ul>
  </section>
  <section class="item-sec" aria-labelledby="parcours">
    ${secHead('02', 'parcours', 'Le parcours du pack', e.parcours_intro)}
    <div class="line-diagram" data-rail-progress>
      <div class="line-diagram__head"><span class="line-diagram__term">Départ</span><span class="line-diagram__dur">${dureeHTML(k.duree)}</span><span class="line-diagram__term">Arrivée</span></div>
      <ol class="line-diagram__stops">${stops
        .map((s, i) => `<li class="line-diagram__stop${s.end ? ' line-diagram__stop--end' : ''}"><span class="line-diagram__dot" aria-hidden="true"></span><span class="line-diagram__label">${esc(s.t)}</span></li>`)
        .join('')}</ol>
      <p class="line-diagram__note">${show(k.parcours_note, 'répartition des journées')}</p>
    </div>
  </section>
  <section class="item-sec" aria-labelledby="prix">
    ${secHead('03', 'prix', 'Prix du pack et prix à l’unité', e.prix_intro || (k.tarif?.montant ? `Le pack est facturé ${eur(k.tarif.montant)} TTC par personne${k.tarif.ancien_prix ? `, au lieu de ${eur(k.tarif.ancien_prix)}` : ''}. Les formations incluses, prises séparément :` : ''))}
    <table class="price-table">
      <caption class="sr-only">Comparaison entre le prix du pack et la somme des tarifs à l’unité</caption>
      <thead><tr><th scope="col">Formation</th><th scope="col">Durée</th><th scope="col">Tarif à l’unité</th></tr></thead>
      <tbody>${incl
        .map((x) => `<tr><th scope="row"><a href="${P}${x.page}">${esc(x.titre_court)}</a></th><td>${dureeHTML(x.duree, 'todo--xs')}</td><td>${priceHTML(x.tarif)}</td></tr>`)
        .join('')}</tbody>
      <tfoot>
        ${sum != null && diff > 0 ? `<tr><th scope="row">Somme des tarifs à l’unité</th><td></td><td><strong>${eur(sum)}</strong> TTC</td></tr>` : ''}
        <tr class="price-table__pack"><th scope="row">${esc(k.titre_court)}</th><td>${dureeHTML(k.duree)}</td><td>${priceHTML(k.tarif, { size: 'lg' })}</td></tr>
        ${diff > 0 ? `<tr><th scope="row">Économie par rapport à l’achat à l’unité</th><td></td><td><strong>${eur(diff)}</strong></td></tr>` : ''}
      </tfoot>
    </table>
  </section>
  <section class="item-sec item-sec--split" aria-labelledby="public">
    ${secHead('04', 'public', 'Public et prérequis')}
    <div class="split">
      <div class="split__col"><h3>Pour qui</h3>${k.public_note ? `<p class="sec-note">${esc(k.public_note)}</p>` : ''}${listHTML(k.public, 'public concerné', 'list list--dash')}</div>
      <div class="split__col split__col--panel"><h3>Prérequis</h3>${k.prerequis_note ? `<p class="sec-note">${esc(k.prerequis_note)}</p>` : ''}${listHTML(k.prerequis, 'prérequis', 'list list--check')}</div>
    </div>
  </section>
  <section class="item-sec" aria-labelledby="modalites">
    ${secHead('05', 'modalites', 'Modalités et lieux')}
    <div class="modal-grid">
      <dl class="spec">
        <div><dt>Lieux</dt><dd>${lieuxHTML(k.modalites, data)}</dd></div>
        <div><dt>Dates</dt><dd>${show(k.modalites?.dates, 'dates')}</dd></div>
        <div><dt>Effectif</dt><dd>${show(k.effectif, 'effectif')}</dd></div>
        <div><dt>Validité</dt><dd>Selon chaque formation : voir les fiches ${incl.map((x) => `<a href="${P}${x.page}#validite">${esc(x.titre_court)}</a>`).join(' et ')}.</dd></div>
      </dl>
      ${mapFigure({ id: 'carte-' + k.id, compact: true })}
    </div>
  </section>
  <section class="item-sec" aria-labelledby="financement">
    ${secHead('06', 'financement', 'Financement')}
    ${isMissing(k.financement) ? `<p>${todo('financement')}</p>` : `<ul class="tags">${k.financement.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`}
  </section>
  <section class="item-sec" aria-labelledby="faq">
    ${secHead('07', 'faq', 'Questions sur ce pack')}
    ${faq.length ? faqHTML(faq, 'faq-' + k.id) : `<p>${todo('FAQ spécifique')}</p>`}
  </section>
</div>`;

  const relatedSec = `<section class="section band band--night related related--dark" aria-labelledby="related-title">
  <div class="wrap">
    <header class="related__head"><h2 id="related-title">Les autres packs</h2></header>
    <div class="tickets">${others.map((x) => packTicket(P, x, data)).join('')}</div>
  </div>
</section>`;

  const body = `${hero}
${subnav}
<div class="wrap item-layout">
${main}
${aside(k, data, { devisLabel: 'Réserver ce pack' })}
</div>
${relatedSec}
${devisForm(data, k.id, { title: `Réserver le ${k.titre_court}`, text: e.devis_texte || '' })}`;

  return {
    ctx: {
      p: P,
      path: k.page,
      title: e.seo_title || `${k.titre_court} | Digiferro`,
      description: e.seo_description || k.resume,
      bodyClass: 'page-item page-pack',
      scripts: ['map', 'form'],
      devis: '#inscription',
      ogType: 'article',
      jsonld: [
        jsonld(
          courseLD(data, { ...k, code: null }, {
            hasPart: incl.map((x) => ({ '@type': 'Course', name: x.titre, url: `${data.site.base_url}/${x.page}`, provider: { '@type': 'Organization', name: 'DIGIVODA' } })),
          })
        ),
        jsonld(breadcrumbLD(data, trail)),
        ...(faq.length ? [jsonld(faqLD(faq))] : []),
      ],
    },
    main: body,
  };
}
