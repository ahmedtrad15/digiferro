// Photos fournies par le client, rangées dans le dossier media/ à la racine du projet.
// Une photo est associée à une formation ou à un pack quand son nom de fichier reprend
// l'identifiant, le slug, le code ou le nom court (casse, accents et séparateurs ignorés) :
//   media/secufer.jpg, media/formations/tcs-m.webp, media/AIPR.png, media/pack-catenaire.jpg…
// Les fichiers dont le chemin contient « palaiseau » ou « centre » vont dans la galerie du centre,
// celui dont le nom contient « qualiopi » remplace l'emplacement du logo.
// Sans photo, le visuel provisoire (SVG) est utilisé.
import { readdirSync, statSync, openSync, readSync, closeSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, extname, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'media');
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']);

export const norm = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const f = join(dir, name);
    if (name.startsWith('.')) return [];
    return statSync(f).isDirectory() ? walk(f) : EXT.has(extname(name).toLowerCase()) ? [f] : [];
  });
}

// Dimensions sans dépendance : PNG, JPEG, WebP, GIF, SVG
function imageSize(file) {
  const ext = extname(file).toLowerCase();
  if (ext === '.svg') {
    const s = readFileSync(file, 'utf8');
    const vb = s.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
    return vb ? { w: Math.round(+vb[1]), h: Math.round(+vb[2]) } : { w: 600, h: 400 };
  }
  const fd = openSync(file, 'r');
  const buf = Buffer.alloc(Math.min(statSync(file).size, 256 * 1024));
  readSync(fd, buf, 0, buf.length, 0);
  closeSync(fd);
  if (buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf.toString('ascii', 0, 3) === 'GIF') return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8X') return { w: buf.readUIntLE(24, 3) + 1, h: buf.readUIntLE(27, 3) + 1 };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  return { w: 1200, h: 800 };
}

const files = walk(DIR).map((f) => {
  const rel = relative(ROOT, f).split('\\').join('/');
  return { abs: f, src: rel, key: norm(basename(f, extname(f))), path: norm(rel) };
});
const used = new Set();

const toImage = (f) => ({ src: f.src, ...imageSize(f.abs) });

// Photo d'une formation ou d'un pack (photos supplémentaires : suffixe -2, -3…)
// Priorité : identifiant, slug, nom court, puis code (le code « SECUFER » est partagé par le
// recyclage et l'e-learning : ils reprennent la photo SECUFER s'ils n'ont pas la leur).
export function mediaFor(item) {
  const keys = [item.id, item.slug, item.titre_court, item.code].filter(Boolean).map(norm);
  const rank = (f) => keys.findIndex((k) => f.key === k || new RegExp(`^${k}-\\d+$`).test(f.key));
  const scored = files.filter((f) => !/qualiopi|palaiseau|centre/.test(f.path)).map((f) => ({ f, r: rank(f) })).filter((x) => x.r >= 0);
  const best = Math.min(...scored.map((x) => x.r));
  const hits = scored
    .filter((x) => x.r === best)
    .map((x) => x.f)
    .sort((a, b) => a.key.length - b.key.length || a.key.localeCompare(b.key));
  hits.forEach((f) => used.add(f.src));
  return hits.map(toImage);
}

export function centreImages() {
  const hits = files.filter((f) => /palaiseau|centre/.test(f.path)).sort((a, b) => a.src.localeCompare(b.src));
  hits.forEach((f) => used.add(f.src));
  return hits.map(toImage);
}

export function qualiopiLogo() {
  const f = files.find((x) => /qualiopi/.test(x.key));
  if (!f) return null;
  used.add(f.src);
  return toImage(f);
}

export const mediaReport = () => ({ total: files.length, unused: files.filter((f) => !used.has(f.src)).map((f) => f.src) });

// Photos référencées dans data/formations.json (champ « photos » des fiches, galerie du centre…).
// Le manifeste produit par tools/photos.py fournit des variantes WebP (600 px, pleine largeur) ;
// sans manifeste, l'original est servi tel quel.
const MANIFEST_FILE = join(ROOT, 'assets/photos/manifest.json');
const manifest = existsSync(MANIFEST_FILE) ? JSON.parse(readFileSync(MANIFEST_FILE, 'utf8')) : {};
const DATA = JSON.parse(readFileSync(join(ROOT, 'data/formations.json'), 'utf8'));
export const altFor = (file) => DATA.photos?.[file] || '';

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const url = (s) => s.split('/').map(encodeURIComponent).join('/');

export function photoTag(p, file, { alt, sizes = '100vw', eager = false, cls = '' } = {}) {
  const m = manifest[file];
  let src = p + url(file);
  let srcset = '';
  let w = 1200;
  let h = 800;
  if (m) {
    const vs = Object.entries(m.variants).sort((a, b) => +a[0] - +b[0]);
    src = p + vs[vs.length - 1][1];
    srcset = vs.map(([vw, f]) => `${p}${f} ${vw}w`).join(', ');
    ({ width: w, height: h } = m);
  } else if (existsSync(join(ROOT, file))) {
    ({ w, h } = imageSize(join(ROOT, file)));
  }
  return `<img${cls ? ` class="${cls}"` : ''} src="${src}"${srcset ? ` srcset="${srcset}" sizes="${sizes}"` : ''} alt="${attr(alt ?? altFor(file))}" width="${w}" height="${h}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}

export const photoSize = (file) => (manifest[file] ? { w: manifest[file].width, h: manifest[file].height } : existsSync(join(ROOT, file)) ? imageSize(join(ROOT, file)) : null);
