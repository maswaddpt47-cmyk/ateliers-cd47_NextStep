# Verify skill — Ateliers CD47 NextStep

Projet statique (HTML/JS/CSS), pas de build step. Serveur local + Playwright.

## Lancer le serveur local

```bash
cd /home/user/ateliers-cd47_NextStep
npx serve . -p 4321 &
sleep 2
```

## Playwright (Chromium pré-installé)

```js
const { chromium } = require('playwright');
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const page = await browser.newPage();
// CDN React/Leaflet/ECharts non disponibles en sandbox — utiliser le serveur local
// Les fonctions utils.js/logic.js sont testables via page.evaluate() après chargement
await page.goto('http://localhost:4321/index.html', { waitUntil: 'networkidle', timeout: 15000 });
```

## Flows à vérifier

- `index.html` : globals utils.js présents (fmtDate, normCommune, buildICS…)
- `admin.html` : globals utils.js + logic.js présents (computeKpi, validateEntry…)
- Bouton 📅 ICS dans VueHistorique
- Pas d'erreur de redéclaration `const` → `node --test integration.test.js`

## Note sandbox

Les CDN externes (React, XLSX, Leaflet, ECharts) sont bloqués → page vide en navigateur local.
Vérifier le rendu complet sur GitHub Pages uniquement.
Utiliser `page.evaluate()` pour tester les globals JS indépendamment du rendu React.
