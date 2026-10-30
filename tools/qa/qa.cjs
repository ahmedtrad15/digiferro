// Contrôle qualité complet du site Digiferro.
// Prérequis : cd tools/qa && npm install ; serveur local sur http://localhost:8080
// Usage : node tools/qa/qa.cjs [liens] [debordement] [axe] [sousnav]   (sans argument : tout)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const BASE = 'http://localhost:8080/';
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const pages = [
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')),
  ...['formations', 'packs'].flatMap((d) => fs.readdirSync(path.join(ROOT, d)).filter((f) => f.endsWith('.html')).map((f) => `${d}/${f}`)),
];

// 1. Liens, fichiers et ancres internes
function checkLinks() {
  const ids = new Map();
  const idsOf = (f) => ids.get(f) || ids.set(f, new Set([...fs.readFileSync(path.join(ROOT, f), 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))).get(f);
  const bad = [];
  let n = 0;
  for (const pg of pages) {
    const html = fs.readFileSync(path.join(ROOT, pg), 'utf8');
    for (const [, url0] of html.matchAll(/\s(?:href|src|data-src|poster)="([^"]+)"/g)) {
      const url = url0.replace(/&amp;/g, '&');
      if (/^(https?:|mailto:|tel:|data:|#i-)/.test(url)) continue;
      const [p0, hash] = url.split('#');
      const p = p0.split('?')[0];
      if (!p) {
        if (hash && !idsOf(pg).has(hash)) bad.push(`${pg} → #${hash}`);
        continue;
      }
      n++;
      const target = p.startsWith('/') ? p.slice(1) : path.normalize(path.join(path.dirname(pg), decodeURIComponent(p)));
      if (!fs.existsSync(path.join(ROOT, target))) bad.push(`${pg} → ${url}`);
      else if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) bad.push(`${pg} → ${url}`);
    }
  }
  console.log(`Liens et fichiers : ${n} vérifiés, ${bad.length} en erreur`, bad.slice(0, 10));
}

const only = process.argv.slice(2);
const run = (name) => !only.length || only.includes(name);

(async () => {
  if (run('liens')) checkLinks();
  const b = await chromium.launch();

  // 2. Débordement horizontal
  if (run('debordement')) {
  const ov = [];
  for (const w of [360, 375, 768, 1024, 1280, 1536]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    for (const u of pages) {
      await p.goto(BASE + u, { waitUntil: 'load' });
      const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (o > 0) ov.push(`${w}px ${u} (+${o})`);
    }
    await p.close();
  }
  console.log('Débordements horizontaux :', ov.length ? ov : 'aucun');
  }

  // 3. Accessibilité (axe, WCAG 2.2 AA + bonnes pratiques)
  if (run('axe')) {
  let axeBad = 0;
  for (const w of [375, 1280]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    for (const u of pages) {
      await p.goto(BASE + u, { waitUntil: 'networkidle' });
      await p.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
      await p.evaluate(() => document.querySelectorAll('.reveal,[data-map]').forEach((e) => e.classList.add('is-visible')));
      await p.addScriptTag({ content: axeSrc });
      const v = await p.evaluate(async () =>
        (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] })).violations.map(
          (x) => `${x.id} (${x.nodes.length}) ${x.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' ; ')}`
        )
      );
      if (v.length) {
        axeBad++;
        console.log(`axe ${w}px ${u}`, v);
      }
    }
    await p.close();
  }
  console.log(`axe : ${axeBad} page(s) en erreur sur ${pages.length * 2} contrôles`);
  }

  // 4. Sous-navigation des fiches : chaque lien amène bien à sa section
  if (run('sousnav')) {
  const subBad = [];
  const items = pages.filter((u) => /^(formations|packs)\/(?!index)/.test(u));
  for (const [w, mobile] of [[1280, false], [375, true]]) {
    const p = await b.newPage({ viewport: { width: w, height: 800 }, isMobile: mobile, hasTouch: mobile });
    for (const u of items) {
      await p.goto(BASE + u, { waitUntil: 'load' });
      const ids = await p.$$eval('.subnav a', (as) => as.map((a) => a.hash.slice(1)));
      for (const id of [ids[2], ids[ids.length - 1]]) {
        await p.locator(`.subnav a[href="#${id}"]`).click({ force: true });
        await p.waitForTimeout(1800);
        const gap = await p.evaluate((id) => Math.round(document.getElementById(id).getBoundingClientRect().top - document.querySelector('.subnav').getBoundingClientRect().bottom), id);
        if (gap < 0 || gap > 80) subBad.push(`${w}px ${u} #${id} (écart ${gap} px)`);
      }
    }
    await p.close();
  }
  console.log(`Sous-navigation : ${items.length * 4} clics testés, ${subBad.length} en erreur`, subBad);
  }
  await b.close();
})();
