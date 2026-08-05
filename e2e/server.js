// Serveur HTTP statique minimal pour les tests Playwright
const http = require('http');
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 7474;

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.ics':  'text/calendar',
};

const server = http.createServer((req, res) => {
  // Un vrai serveur (GitHub Pages inclus) ignore la query string pour
  // résoudre le fichier ; ce serveur minimal doit faire pareil, sinon
  // shared.js?v=1 est cherché tel quel comme nom de fichier sur disque.
  const urlPath = req.url.split('?')[0];
  const filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`e2e server on http://localhost:${PORT}`));
