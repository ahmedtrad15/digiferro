// Captures d'écran de contrôle : node tools/qa/shots.cjs "page@largeur@nom@hauteurMax" ...
// Prérequis : serveur local sur http://localhost:8080 (python3 -m http.server 8080)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const job of process.argv.slice(2)) {
    const [u, w, name, maxh] = job.split('@');
    const p = await b.newPage({ viewport: { width: +w, height: 900 } });
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e)));
    p.on('response', (r) => r.status() >= 400 && errs.push(r.status() + ' ' + r.url()));
    await p.goto('http://localhost:8080/' + u, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
    await p.evaluate(() => {
      document.querySelectorAll('.reveal,[data-map]').forEach((e) => e.classList.add('is-visible'));
      document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
    });
    await p.waitForTimeout(800);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await p.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true, clip: { x: 0, y: 0, width: +w, height: Math.min(H, +(maxh || 2400)) } });
    console.log(`${u} @${w} débordement=${ov}${errs.length ? ' ' + errs.join(' | ') : ''}`);
    await p.close();
  }
  await b.close();
})();
