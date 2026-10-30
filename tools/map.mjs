// Carte de France animée (SVG inline) : contour simplifié, grandes lignes
// ferroviaires illustratives, centre Digivoda et trains en mouvement.
// Coordonnées en degrés (lon, lat), projetées en équirectangulaire corrigée.

const K = 60;
const LON0 = -5.3;
const LAT0 = 51.35;
const COS = Math.cos((46.5 * Math.PI) / 180);
const pr = ([lon, lat]) => [+((lon - LON0) * COS * K).toFixed(1), +((LAT0 - lat) * K).toFixed(1)];

const FRANCE = [
  [2.54, 51.09], [3.1, 50.79], [3.7, 50.3], [4.2, 50.27], [4.83, 50.15], [4.86, 49.8], [5.47, 49.5], [6.36, 49.47],
  [6.73, 49.17], [7.4, 49.17], [8.23, 48.97], [7.8, 48.5], [7.58, 48.0], [7.59, 47.59], [7.0, 47.45], [6.95, 47.25],
  [6.45, 46.95], [6.1, 46.6], [5.97, 46.22], [6.8, 46.4], [6.85, 46.0], [7.05, 45.9], [6.8, 45.7], [7.15, 45.4],
  [6.65, 45.1], [6.95, 44.85], [6.85, 44.5], [7.0, 44.2], [7.65, 44.15], [7.5, 43.78], [7.25, 43.68], [6.95, 43.48],
  [6.65, 43.25], [6.15, 43.05], [5.85, 43.1], [5.35, 43.22], [4.85, 43.35], [4.4, 43.45], [3.9, 43.52], [3.3, 43.28],
  [3.05, 42.95], [3.03, 42.6], [3.17, 42.44], [2.6, 42.35], [1.95, 42.45], [1.45, 42.6], [0.7, 42.85], [0.0, 42.7],
  [-0.75, 42.95], [-1.4, 43.05], [-1.78, 43.37], [-1.5, 43.55], [-1.3, 44.2], [-1.2, 44.65], [-1.15, 45.15],
  [-1.05, 45.6], [-1.2, 46.0], [-1.25, 46.25], [-1.8, 46.5], [-2.1, 46.85], [-2.15, 47.15], [-2.55, 47.3],
  [-2.95, 47.55], [-3.5, 47.7], [-3.95, 47.85], [-4.37, 47.8], [-4.73, 48.04], [-4.4, 48.25], [-4.78, 48.35],
  [-4.75, 48.55], [-4.3, 48.65], [-3.95, 48.72], [-3.5, 48.83], [-3.0, 48.78], [-2.75, 48.55], [-2.3, 48.65],
  [-2.0, 48.65], [-1.55, 48.65], [-1.6, 49.2], [-1.85, 49.7], [-1.25, 49.7], [-1.15, 49.35], [-0.6, 49.35],
  [-0.2, 49.3], [0.2, 49.45], [0.15, 49.7], [0.6, 49.85], [1.2, 49.98], [1.55, 50.2], [1.6, 50.7], [1.85, 50.95],
];
const CORSE = [
  [9.4, 43.0], [9.45, 42.7], [9.55, 42.35], [9.4, 42.0], [9.28, 41.6], [9.15, 41.38], [8.8, 41.6], [8.65, 41.9],
  [8.6, 42.35], [8.75, 42.57], [9.1, 42.72], [9.3, 42.95],
];

const C = {
  paris: [2.35, 48.86], palaiseau: [2.25, 48.71], lille: [3.06, 50.63], amiens: [2.3, 49.89], reims: [4.03, 49.26],
  metz: [6.18, 49.12], strasbourg: [7.75, 48.58], mulhouse: [7.34, 47.75], besancon: [6.02, 47.24], dijon: [5.04, 47.32],
  lyon: [4.84, 45.76], grenoble: [5.72, 45.19], avignon: [4.81, 43.95], marseille: [5.37, 43.3], nice: [7.26, 43.7],
  nimes: [4.36, 43.84], montpellier: [3.88, 43.61], perpignan: [2.9, 42.7], toulouse: [1.44, 43.6], bordeaux: [-0.58, 44.84],
  bayonne: [-1.47, 43.49], poitiers: [0.34, 46.58], tours: [0.69, 47.39], orleans: [1.91, 47.9], limoges: [1.26, 45.83],
  clermont: [3.08, 45.78], lemans: [0.2, 48.0], rennes: [-1.68, 48.11], brest: [-4.49, 48.39], nantes: [-1.55, 47.22],
  rouen: [1.1, 49.44], lehavre: [0.11, 49.49], caen: [-0.37, 49.18], ajaccio: [8.74, 41.92], bastia: [9.45, 42.7],
};

const LINES = [
  ['nord', ['paris', 'amiens', 'lille'], 7],
  ['est', ['paris', 'reims', 'metz', 'strasbourg'], 9],
  ['sud-est', ['paris', 'dijon', 'lyon', 'avignon', 'marseille', 'nice'], 13],
  ['atlantique', ['paris', 'tours', 'poitiers', 'bordeaux', 'toulouse'], 11],
  ['bretagne', ['paris', 'lemans', 'rennes', 'brest'], 10],
  ['loire', ['lemans', 'nantes'], 0],
  ['normandie', ['paris', 'rouen', 'lehavre'], 0],
  ['caen', ['paris', 'caen'], 0],
  ['centre', ['paris', 'orleans', 'limoges', 'toulouse'], 0],
  ['auvergne', ['paris', 'clermont'], 0],
  ['sud', ['bordeaux', 'toulouse', 'montpellier', 'nimes', 'avignon'], 12],
  ['basque', ['bordeaux', 'bayonne'], 0],
  ['catalogne', ['montpellier', 'perpignan'], 0],
  ['alpes', ['lyon', 'grenoble'], 0],
  ['rhin', ['dijon', 'besancon', 'mulhouse', 'strasbourg'], 0],
  ['corse', ['ajaccio', 'bastia'], 0],
];

const LABELS = ['lille', 'strasbourg', 'lyon', 'marseille', 'bordeaux', 'toulouse', 'nantes', 'rennes', 'nice', 'brest', 'dijon'];

const poly = (pts) => 'M' + pts.map((pt) => pr(pt).join(' ')).join('L') + 'Z';

// Catmull-Rom → Bézier pour des lignes souples, comme sur un plan de réseau.
function smooth(pts) {
  const P = pts.map(pr);
  if (P.length === 2) return `M${P[0].join(' ')}L${P[1].join(' ')}`;
  let d = `M${P[0].join(' ')}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1.map((n) => n.toFixed(1)).join(' ')} ${c2.map((n) => n.toFixed(1)).join(' ')} ${p2.join(' ')}`;
  }
  return d;
}

export function franceMap({ id = 'carte', compact = false } = {}) {
  const [w, h] = [Math.round((9.9 - LON0) * COS * K), Math.round((LAT0 - 41.2) * K)];
  const lines = LINES.map(
    ([name, stops]) =>
      `<path id="${id}-l-${name}" class="map__line" d="${smooth(stops.map((s) => C[s]))}" pathLength="1"/>`
  ).join('');
  const ties = LINES.map(([name, stops]) => `<path class="map__ties" d="${smooth(stops.map((s) => C[s]))}"/>`).join('');
  const trains = LINES.filter(([, , dur]) => dur)
    .map(
      ([name, , dur], i) =>
        `<g class="map__train"><rect x="-9" y="-3.5" width="18" height="7" rx="2"/><rect class="map__train-nose" x="5" y="-3.5" width="4" height="7" rx="1.5"/><animateMotion dur="${dur}s" begin="-${((i * 2.3) % dur).toFixed(1)}s" repeatCount="indefinite" rotate="auto"${i % 2 ? ' keyPoints="1;0" keyTimes="0;1" calcMode="linear"' : ''}><mpath href="#${id}-l-${name}"/></animateMotion></g>`
    )
    .join('');
  const stations = Object.entries(C)
    .filter(([k]) => k !== 'palaiseau')
    .map(([k, c]) => {
      const [x, y] = pr(c);
      return `<circle class="map__stop${k === 'paris' ? ' map__stop--hub' : ''}" cx="${x}" cy="${y}" r="${k === 'paris' ? 6 : 3.2}"/>`;
    })
    .join('');
  const labels = LABELS.map((k) => {
    const [x, y] = pr(C[k]);
    const name = { lille: 'Lille', strasbourg: 'Strasbourg', lyon: 'Lyon', marseille: 'Marseille', bordeaux: 'Bordeaux', toulouse: 'Toulouse', nantes: 'Nantes', rennes: 'Rennes', nice: 'Nice', montpellier: 'Montpellier', brest: 'Brest', dijon: 'Dijon' }[k];
    const right = !['nice', 'strasbourg', 'marseille', 'montpellier'].includes(k);
    return `<text class="map__label" x="${x + (right ? 8 : -8)}" y="${y - 6}" text-anchor="${right ? 'start' : 'end'}">${name}</text>`;
  }).join('');
  const [px, py] = pr(C.palaiseau);
  const [lx, ly] = pr([-3.9, 50.55]);
  return `<svg class="map${compact ? ' map--compact' : ''}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-t ${id}-d" data-map>
  <title id="${id}-t">Carte des lieux de formation</title>
  <desc id="${id}-d">Carte de France avec les grandes lignes ferroviaires. Un repère signale le centre Digivoda de Palaiseau, dans l'Essonne. Les formations ont lieu dans les centres Digivoda partout en France ou sur le site du client, en intra.</desc>
  <path class="map__land" d="${poly(FRANCE)} ${poly(CORSE)}"/>
  <g class="map__network">${ties}${lines}</g>
  <g class="map__stops">${stations}</g>
  <g class="map__labels">${labels}</g>
  <g class="map__trains">${trains}</g>
  <g class="map__centre">
    <path class="map__callout" d="M${px} ${py}L${px - 40} ${py - 40}L${lx + 150} ${ly + 14}"/>
    <circle class="map__ring" cx="${px}" cy="${py}" r="9"/>
    <circle class="map__pin" cx="${px}" cy="${py}" r="5"/>
    <g transform="translate(${lx} ${ly})"><rect class="map__tag" width="150" height="40" rx="2"/><text class="map__tag-t" x="10" y="17">CENTRE DIGIVODA</text><text class="map__tag-s" x="10" y="32">Palaiseau (91)</text></g>
  </g>
</svg>`;
}
