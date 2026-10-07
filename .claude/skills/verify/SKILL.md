# Verify skill — Ateliers CD47 NextStep

Projet statique (HTML/JS/CSS), pas de build step. Serveur local + Playwright.

## Lancer le serveur local

Le serveur des tests e2e (port 7474, ignore le `?v=N` comme GitHub Pages) :

```bash
cd /home/user/ateliers-cd47_NextStep
node e2e/server.js &
```

## Playwright (Chromium pré-installé)

```js
const { chromium } = require('playwright');
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
await page.goto('http://localhost:7474/index.html', { waitUntil: 'networkidle', timeout: 15000 });
```

## Flows à vérifier

- `index.html` : globals d'`utils.js` présents (`fmtDate`, `normCommune`, `buildICS`…)
- `admin.html` : globals d'`utils.js` + `logic.js` présents (`findOrdinateursConflicts`, `periodePretMateriel`…)
- Pas d'erreur de redéclaration `const` → `node --test integration.test.js`

## Note sandbox

Les bibliothèques (React, XLSX, Leaflet, ECharts…) sont servies depuis
`vendor/` : la page se rend en local. Les appels à l'API Alwaysdata ne passent
pas depuis la session : les simuler avec `page.route()`, comme
`e2e/smoke.test.js`, pour aller au-delà de l'écran de connexion.
