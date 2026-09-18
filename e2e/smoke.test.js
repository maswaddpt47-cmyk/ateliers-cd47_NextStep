// Tests Playwright — smoke test admin.html
// Objectif : détecter les ReferenceError (globals manquants) sur chaque onglet
// Sans vraie connexion GAS — tout est mocké via page.route()

const { test, expect } = require('@playwright/test');

// ── Données mock ─────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().slice(0, 10);
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

const MOCK_ENTRIES = [
  { _id: 'e1', date: TODAY,     horaire: '09H00', statut: 'Planifié',  conseiller: 'Michel Aswad',  commune: 'Agen',    thematique: 'Numérique', inscrits: 4, presents: 0, materiel: ['Tablette'], orienteur: 'CAF', public: 'Adultes', remarques: '' },
  { _id: 'e2', date: YESTERDAY, horaire: '14H00', statut: 'Réalisé',   conseiller: 'Cynthia Pineau', commune: 'Nérac',  thematique: 'Email',     inscrits: 6, presents: 5, materiel: ['PC'],       orienteur: 'MDPH', public: 'Seniors', remarques: '' },
  { _id: 'e3', date: YESTERDAY, horaire: '10H00', statut: 'Planifié',  conseiller: 'Corentin Tual', commune: 'Marmande', thematique: 'Démarches', inscrits: 3, presents: 0, materiel: [],          orienteur: 'Mairie', public: 'Adultes', remarques: '' },
];

const MOCK_LISTS = {
  ok: true,
  conseillers: ['Michel Aswad', 'Cynthia Pineau', 'Corentin Tual', 'Eva Capelle'],
  communes: ['Agen', 'Nérac', 'Marmande'],
  thematiques: ['Numérique', 'Email', 'Démarches'],
  orienteurs: ['CAF', 'MDPH', 'Mairie'],
  publics: ['Adultes', 'Seniors'],
};

// Répond à toutes les actions GAS
function mockGasResponse(action) {
  if (action === 'checkPassword')  return { ok: true, role: 'admin', nom: 'Michel Aswad' };
  if (action === 'getEntries')     return { ok: true, entries: MOCK_ENTRIES };
  if (action === 'getLists')       return MOCK_LISTS;
  if (action === 'getComptes')     return { ok: true, comptes: [] };
  if (action === 'getLogs')        return { ok: true, logs: [] };
  if (action === 'getVisibility')  return { ok: true, visibility: {} };
  if (action === 'getConfig')      return { ok: true, maintenance: false, maintenance_msg: '' };
  return { ok: true };
}

// ── Setup global : intercepte CDN + appels GAS ───────────────────────────────

const fs   = require('fs');
const path = require('path');

const REACT_JS     = fs.readFileSync(path.join(__dirname, '../node_modules/react/umd/react.production.min.js'), 'utf8');
const REACT_DOM_JS = fs.readFileSync(path.join(__dirname, '../node_modules/react-dom/umd/react-dom.production.min.js'), 'utf8');

// Stubs légers pour les libs non nécessaires au rendu React
const LEAFLET_STUB = `window.L={map:()=>({setView:()=>({on:()=>{},addLayer:()=>{}})}),tileLayer:()=>({addTo:()=>{}}),marker:()=>({addTo:()=>{},bindPopup:()=>({}),openPopup:()=>{},remove:()=>{}}),Icon:{Default:{mergeOptions:()=>{}}},latLngBounds:()=>({isValid:()=>false}),divIcon:()=>({})};`;
const ECHARTS_STUB = `window.echarts={init:()=>({setOption:()=>{},resize:()=>{},dispose:()=>{},on:()=>{}})};`;
const XLSX_STUB    = `window.XLSX={utils:{book_new:()=>({}),aoa_to_sheet:()=>({}),book_append_sheet:()=>{}},writeFile:()=>{}};`;

test.beforeEach(async ({ page }) => {
  // Sert React/ReactDOM depuis node_modules (CDN bloqué dans le sandbox)
  await page.route('**/react.production.min.js', route =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: REACT_JS }));
  await page.route('**/react-dom.production.min.js', route =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: REACT_DOM_JS }));
  // Stubs pour Leaflet, ECharts, XLSX CDN
  await page.route('**/leaflet.min.js', route =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: LEAFLET_STUB }));
  await page.route('**/echarts.min.js', route =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: ECHARTS_STUB }));
  await page.route('**/xlsx.full.min.js', route =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: XLSX_STUB }));
  // Intercepte script.google.com (GAS)
  await page.route('**/script.google.com/**', async route => {
    const url = new URL(route.request().url());
    const action = url.searchParams.get('action') || '';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockGasResponse(action)),
    });
  });

  // Collecte les erreurs console pour les assertions
  page._jsErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') page._jsErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    page._jsErrors.push(err.message);
  });
});

// ── Helper : se connecter et attendre le chargement ──────────────────────────

async function login(page) {
  await page.goto('/admin.html');
  // Attend que le formulaire de login soit visible
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  // Remplit et soumet
  await page.fill('input[type="password"]', 'test');
  await page.getByText('Connexion', { exact: true }).click();
  // Attend que la sidebar soit visible (= connexion réussie)
  await page.waitForSelector('.sidebar-btn', { timeout: 10000 });
}

// ── Helper : clique un onglet et vérifie l'absence de ReferenceError ─────────

async function clickTab(page, label) {
  const errsBefore = page._jsErrors.length;
  // Cherche le bouton par son label texte
  await page.locator('.sidebar-btn', { hasText: label }).first().click();
  // Attend que React re-rende (petit délai suffisant)
  await page.waitForTimeout(400);
  const newErrs = page._jsErrors.slice(errsBefore).filter(e => /ReferenceError|TypeError|is not defined/i.test(e));
  return newErrs;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test('admin.html — page se charge sans erreur JS', async ({ page }) => {
  await page.goto('/admin.html');
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  const errs = page._jsErrors.filter(e => /ReferenceError|is not defined/i.test(e));
  expect(errs, `Erreurs JS au chargement : ${errs.join(' | ')}`).toHaveLength(0);
});

test('index.html — page se charge sans erreur JS', async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForTimeout(1000);
  const errs = page._jsErrors.filter(e => /ReferenceError|is not defined/i.test(e));
  expect(errs, `Erreurs JS au chargement : ${errs.join(' | ')}`).toHaveLength(0);
});

test('admin — onglet Historique sans ReferenceError', async ({ page }) => {
  await login(page);
  const errs = await clickTab(page, 'Historique');
  expect(errs, `Historique : ${errs.join(' | ')}`).toHaveLength(0);
});

test('admin — onglet Agenda sans ReferenceError', async ({ page }) => {
  await login(page);
  const errs = await clickTab(page, 'Agenda');
  expect(errs, `Agenda : ${errs.join(' | ')}`).toHaveLength(0);
});

test('admin — onglet Calendrier sans ReferenceError', async ({ page }) => {
  await login(page);
  const errs = await clickTab(page, 'Calendrier');
  expect(errs, `Calendrier : ${errs.join(' | ')}`).toHaveLength(0);
});

test('admin — onglet Dashboard sans ReferenceError', async ({ page }) => {
  await login(page);
  const errs = await clickTab(page, 'Dashboard');
  expect(errs, `Dashboard : ${errs.join(' | ')}`).toHaveLength(0);
});

test('admin — onglet Bingo sans ReferenceError', async ({ page }) => {
  await login(page);
  const errs = await clickTab(page, 'Bingo');
  expect(errs, `Bingo : ${errs.join(' | ')}`).toHaveLength(0);
});

test('admin — onglet Admin sans ReferenceError (dont section Stock ordinateurs)', async ({ page }) => {
  await login(page);
  const errs = await clickTab(page, 'Admin');
  expect(errs, `Admin : ${errs.join(' | ')}`).toHaveLength(0);
  await expect(page.getByText('🖥️ Stock ordinateurs')).toBeVisible();
});

test('admin — onglet Anomalies sans ReferenceError (champs manquants/communes uniquement)', async ({ page }) => {
  await login(page);
  const errs = await clickTab(page, 'Anomalies');
  expect(errs, `Anomalies : ${errs.join(' | ')}`).toHaveLength(0);
  // Les conflits Classe mobile/stock ordinateurs ont été déplacés vers leur
  // propre onglet "Gestion ordi" (split Admin) — ne doivent plus apparaître ici.
  await expect(page.getByText('Conflits stock ordinateurs')).toHaveCount(0);
  await expect(page.getByText('Conflits Classe mobile')).toHaveCount(0);
});

test('admin — onglet Gestion ordi sans ReferenceError', async ({ page }) => {
  await login(page);
  const errs = await clickTab(page, 'Gestion ordi');
  expect(errs, `Gestion ordi : ${errs.join(' | ')}`).toHaveLength(0);
  await expect(page.getByText('Conflits Classe mobile')).toBeVisible();
  await expect(page.getByText('Stock ordinateurs dépassé')).toBeVisible();
});

test('admin — Frise du parc : rendu + bouton Agrandir (panneau plein écran via portail)', async ({ page }) => {
  await login(page);
  await clickTab(page, 'Gestion ordi');
  await page.waitForTimeout(200);
  await expect(page.getByText(/Frise du parc/).first()).toBeVisible();
  await expect(page.getByText('Aujourd\'hui')).toBeVisible();
  // Bouton Agrandir → panneau monté via ReactDOM.createPortal dans document.body,
  // en dehors du wrapper .view-anim (transform actif en permanence après son
  // animation d'entrée, qui piégerait un position:fixed classique dans sa largeur).
  await page.getByText('🔍 Agrandir').click();
  await page.waitForTimeout(200);
  const panelInBody = await page.evaluate(() => {
    const overlay = document.querySelector('.side-panel-overlay');
    return !!overlay && overlay.parentElement === document.body;
  });
  expect(panelInBody, 'Le panneau agrandi doit être un enfant direct de <body> (portail)').toBe(true);
  await expect(page.getByText('✕ Fermer')).toBeVisible();
  const errs = page._jsErrors.filter(e => /ReferenceError|TypeError|is not defined/i.test(e));
  expect(errs, `Panneau agrandi : ${errs.join(' | ')}`).toHaveLength(0);
  await page.getByText('✕ Fermer').click();
  await page.waitForTimeout(200);
  await expect(page.getByText('✕ Fermer')).toHaveCount(0);
});

test('admin — onglet Saisie sans ReferenceError', async ({ page }) => {
  await login(page);
  const errs = await clickTab(page, 'Nouveau');
  expect(errs, `Saisie : ${errs.join(' | ')}`).toHaveLength(0);
});

test('admin — One Shot : suggestions thématique au focus', async ({ page }) => {
  await login(page);
  await clickTab(page, 'Nouveau');
  // Cible spécifiquement le champ thématique par son placeholder
  const themeInput = page.locator('input[placeholder="Thème abordé lors de l\'atelier…"]');
  await themeInput.waitFor({ timeout: 5000 });
  await themeInput.click();
  await page.waitForTimeout(400);
  // Le dropdown doit apparaître avec au moins une suggestion du catalogue
  const items = await page.locator('.combo-dropdown .combo-item').count();
  expect(items, 'Aucune suggestion thématique en mode One Shot').toBeGreaterThan(0);
});

test('admin — Cycle : suggestions thématique au focus', async ({ page }) => {
  await login(page);
  await clickTab(page, 'Nouveau');
  // Bascule en mode Cycle
  await page.getByText('🔄 Saisie par cycle').click();
  await page.waitForTimeout(400);
  // Tape dans le champ thématique pour déclencher les suggestions
  const themeInput = page.locator('input[placeholder="Thème de la séance"]').first();
  await themeInput.waitFor({ timeout: 5000 });
  await themeInput.click();
  await themeInput.type('nav');
  await page.waitForTimeout(400);
  // Le dropdown portal est dans le body — cherche un thème connu
  const found = await page.evaluate(() => document.body.innerText.includes('Naviguer sur internet'));
  expect(found, 'Aucune suggestion thématique en mode Cycle (portal non rendu)').toBe(true);
});

test('admin — Classe mobile coché : champs ordinateurs prêtés apparaissent (One Shot)', async ({ page }) => {
  await login(page);
  await clickTab(page, 'Nouveau');
  await page.getByText('Classe mobile', { exact: true }).click();
  await page.waitForTimeout(200);
  await expect(page.getByText('Ordinateurs prêtés')).toBeVisible();
  await expect(page.getByText('Date de prélèvement ordi')).toBeVisible();
  await expect(page.getByText('Date de retour ordi')).toBeVisible();
});

test('admin — bouton Déconnexion manuel ramène à l\'écran de connexion', async ({ page }) => {
  await login(page);
  page.once('dialog', dialog => dialog.accept());
  await page.getByText('🚪 Déconnexion', { exact: true }).click();
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('admin — Classe mobile coché en Cycle : dates par séance, pas de date partagée', async ({ page }) => {
  await login(page);
  await clickTab(page, 'Nouveau');
  await page.getByText('🔄 Saisie par cycle').click();
  await page.waitForTimeout(200);
  await page.getByText('Classe mobile', { exact: true }).click();
  await page.waitForTimeout(200);
  await expect(page.getByText('Ordinateurs prêtés')).toBeVisible();
  // Pas de date de prélèvement/retour partagée en mode cycle (par séance uniquement)
  await expect(page.getByText('Date de prélèvement ordi')).toHaveCount(0);
  await expect(page.getByText('Les dates de prélèvement/retour se saisissent par séance')).toBeVisible();
  await expect(page.getByText('Prélèvement ordi').first()).toBeVisible();
  await expect(page.getByText('Retour ordi').first()).toBeVisible();
});
