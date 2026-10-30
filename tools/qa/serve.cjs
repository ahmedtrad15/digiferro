// Serveur local avec compression gzip et cache, proche d'un hébergement réel.
// Usage : node tools/qa/serve.cjs [port]   (défaut 8081)
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const root = path.join(__dirname, '..', '..');
const port = +(process.argv[2] || 8081);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain' };
http
  .createServer((req, res) => {
    let f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!f.startsWith(root)) return res.writeHead(403).end();
    if (f.endsWith(path.sep)) f += 'index.html';
    fs.readFile(f, (e, buf) => {
      if (e) {
        res.writeHead(404, { 'Content-Type': types['.html'] });
        return res.end(fs.readFileSync(path.join(root, '404.html')));
      }
      const ext = path.extname(f);
      const h = { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=604800' };
      if (/\.(html|css|js|svg|json|xml|txt)$/.test(f) && /gzip/.test(req.headers['accept-encoding'] || '')) {
        h['Content-Encoding'] = 'gzip';
        buf = zlib.gzipSync(buf, { level: 9 });
      }
      res.writeHead(200, h).end(buf);
    });
  })
  .listen(port, () => console.log(`Digiferro : http://localhost:${port}`));
