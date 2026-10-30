// Générateur du site Digiferro.
// Usage : node tools/build.mjs            (toutes les pages disponibles)
// Lit data/formations.json et écrit des fichiers HTML statiques à la racine du projet.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { page, SPRITE } from './partials.mjs';
import { home } from './home.mjs';
import { formationPage, packPage } from './item.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(ROOT, 'data/formations.json'), 'utf8'));

// Pages livrées à ce stade (validation) : accueil, une formation, un pack.
const FORMATIONS = ['tcs-m'];
const PACKS = ['pack-sentinelle-complet'];

const out = [];
const write = ({ ctx, main }) => {
  const file = join(ROOT, ctx.path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(ctx, data, main));
  out.push(ctx.path);
};

write(home(data));
for (const id of FORMATIONS) write(formationPage(data, data.formations.find((f) => f.id === id)));
for (const id of PACKS) write(packPage(data, data.packs.find((k) => k.id === id)));

// Plan du site et robots.txt, à partir des pages réellement générées
const base = data.site.base_url.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${out
    .map((path) => `  <url><loc>${base}/${path === 'index.html' ? '' : path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

// Pictogrammes : copie autonome du sprite, réutilisable hors du site
writeFileSync(join(ROOT, 'assets/svg/pictogrammes.svg'), SPRITE.replace(' class="sprite" aria-hidden="true" focusable="false"', '') + '\n');

console.log(`${out.length} page(s) générée(s) :\n  ${out.join('\n  ')}`);
