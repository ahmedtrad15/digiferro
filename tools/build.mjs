// Générateur du site Digiferro.
// Usage : node tools/build.mjs
// Lit data/formations.json et écrit des fichiers HTML statiques à la racine du projet.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page, SPRITE } from './partials.mjs';
import { home } from './home.mjs';
import { formationPage, packPage } from './item.mjs';
import { catalogue, aPropos, contact, faqPage, mentions, cgv, confidentialite, notFound } from './pages.mjs';
import { mediaReport } from './media.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(ROOT, 'data/formations.json'), 'utf8'));

const out = [];
const write = ({ ctx, main }) => {
  const file = join(ROOT, ctx.path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(ctx, data, main));
  if (!ctx.noindex) out.push(ctx.path);
};

write(home(data));
write(catalogue(data));
for (const f of data.formations) write(formationPage(data, f));
for (const k of data.packs) write(packPage(data, k));
for (const build of [aPropos, contact, faqPage, mentions, cgv, confidentialite, notFound]) write(build(data));

// Plan du site et robots.txt, à partir des pages indexables générées
const base = data.site.base_url.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${out
    .map((path) => `  <url><loc>${base}/${path === 'index.html' ? '' : path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

// Liste des contenus à compléter, page par page (hors en-tête et pied communs)
const todoRe = /<span class="todo[^"]*">\[À COMPLÉTER: ([^\]]+)\]<\/span>/g;
const lines = ['# Contenus à compléter', '', 'Fichier généré par `node tools/build.mjs` à partir des pages : ne pas modifier à la main.', 'Chaque ligne correspond à un encadré « [À COMPLÉTER] » visible sur le site. La plupart se règlent dans `data/formations.json`.', ''];
for (const path of [...out, '404.html']) {
  const html = readFileSync(join(ROOT, path), 'utf8');
  const mainHtml = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  const labels = [...new Set([...mainHtml.matchAll(todoRe)].map((m) => m[1]))];
  if (labels.length) lines.push(`## ${path}`, '', ...labels.map((l) => `- ${l}`), '');
}
const shared = [...new Set([...readFileSync(join(ROOT, 'index.html'), 'utf8').split('<main')[0].matchAll(todoRe)].map((m) => m[1]))];
lines.push('## En-tête (méga-menu) et pied de page, communs à toutes les pages', '', ...shared.map((l) => `- ${l} (durées non publiées dans le méga-menu)`), '');
const LABELS = { duree: 'durée', tarif: 'tarif (« Sur devis »)', objectifs: 'objectifs', public: 'public', prerequis: 'prérequis', programme: 'programme', methodes: 'méthodes pédagogiques', evaluation: 'évaluation', validite: 'validité', effectif: 'effectif', modalites: 'modalités et lieux', 'modalites.dates': 'dates', delai_acces: 'délai d’accès', financement: 'financement', parcours_note: 'note de planning du parcours' };
lines.push('# Valeurs provisoires à confirmer', '', 'Rédigées pour compléter les fiches en attendant les informations de Digivoda. Elles s’affichent normalement sur le site : à vérifier et corriger dans `data/formations.json` (champ `provisoire` de chaque fiche).', '');
for (const x of [...data.formations, ...data.packs]) {
  if (x.provisoire?.length) lines.push(`- **${x.titre_court}** (\`${x.page}\`) : ${x.provisoire.map((k) => LABELS[k] || k).join(', ')}`);
}
lines.push('');
const media = mediaReport();
lines.push('# Photos', '', media.total ? `${media.total} photo(s) dans media/.` : 'Aucune photo dans media/ : les visuels provisoires sont utilisés partout (voir media/README.md).', '');
if (media.unused.length) lines.push('Photos qui ne correspondent à aucune fiche (vérifier leur nom) :', '', ...media.unused.map((f) => `- ${f}`), '');
writeFileSync(join(ROOT, 'A-COMPLETER.md'), lines.join('\n'));

// Pictogrammes : copie autonome du sprite, réutilisable hors du site
writeFileSync(join(ROOT, 'assets/svg/pictogrammes.svg'), SPRITE.replace(' class="sprite" aria-hidden="true" focusable="false"', '') + '\n');

console.log(`${out.length} page(s) indexable(s) + 404 générées`);
