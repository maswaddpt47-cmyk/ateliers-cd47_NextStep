#!/usr/bin/env node
// Écrit sur la sortie standard le version.json publié avec les pages (bandeau
// « nouvelle version », shared.js verifierPagePerimee, 16/11/2026) : pour chaque
// page, les src des scripts chargés avec ?v=, tels que la page les porte.
// Usage (deploy.yml, avant l'envoi des pages) : node scripts/version-json.js > version.json
const fs = require('fs');
const path = require('path');
const racine = path.join(__dirname, '..');
const scripts = html => Array.from(html.matchAll(/<script[^>]*\ssrc="([^"]+\?v=\d+)"/g)).map(m => m[1]);
const out = {};
for (const [cle, fichier] of [['index', 'index.html'], ['admin', 'admin.html']]) {
  out[cle] = scripts(fs.readFileSync(path.join(racine, fichier), 'utf8'));
  if (out[cle].length === 0) { console.error('version-json : aucun script ?v= dans ' + fichier); process.exit(1); }
}
out.ecrit = new Date().toISOString();
process.stdout.write(JSON.stringify(out) + '\n');
