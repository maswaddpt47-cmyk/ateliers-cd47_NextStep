#!/usr/bin/env node
// Écrit sur la sortie standard le version.json publié avec les pages (bandeau
// « nouvelle version », shared.js verifierPagePerimee, 16/11/2026) : pour chaque
// page, les src des scripts chargés avec ?v=, ainsi que le commit du dépôt publié.
// Usage : node scripts/version-json.js [chemin-du-depot] > version.json
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('node:child_process');
const racine = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..');
const scripts = html => Array.from(html.matchAll(/<script[^>]*\ssrc="([^"]+\?v=\d+)"/g)).map(m => m[1]);
const out = {};
for (const [cle, fichier] of [['index', 'index.html'], ['admin', 'admin.html']]) {
  out[cle] = scripts(fs.readFileSync(path.join(racine, fichier), 'utf8'));
  if (out[cle].length === 0) { console.error('version-json : aucun script ?v= dans ' + fichier); process.exit(1); }
}
out.sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: racine, encoding: 'utf8' }).trim();
out.ecrit = new Date().toISOString();
process.stdout.write(JSON.stringify(out) + '\n');
