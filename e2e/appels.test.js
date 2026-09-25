// Compte les appels GAS réellement émis sur les parcours sensibles.
//
// Porté d'ATELIERS_NEWGEN (appels.test.js), qui parle au même backend Apps
// Script. Deux différences assumées avec l'original :
//
//  1. Écrit avec @playwright/test plutôt qu'avec un harnais autonome
//     (chromium.launch + serveur HTTP maison). NextStep a déjà e2e/smoke.test.js
//     dans ce style, lancé par `npx playwright test` et branché en CI : un
//     second style voudrait dire un second mock et une seconde ligne de CI à
//     maintenir en parallèle. addInitScript suffit à intercepter gasLogHook,
//     et context.newPage() à simuler deux onglets.
//
//  2. Le scénario d'ouverture vérifie ce que NextStep garantit réellement —
//     aucun appel lourd AVANT la connexion — et non l'absence de getConfig.
//     NEWGEN a supprimé getConfig (le drapeau maintenance voyage dans getAll) ;
//     NextStep l'appelle encore, après connexion. Porter le scénario tel quel
//     aurait produit un échec, ou pire un test qui passe pour une autre raison.
//
// Ce que ce fichier protège : les appels supprimés par les correctifs de
// latence du 18/09/2026 ne doivent pas réapparaître à la faveur d'une
// retouche. Chaque appel GAS rétabli au démarrage se paie sur le terrain.

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const TODAY = new Date().toISOString().slice(0, 10);

// getAll renvoie TOUT en un seul payload — entries, listes, visibilité,
// couleurs. NextStep n'a pas d'action getEntries/getLists séparée : le mock
// doit répondre à getAll, sinon loadData reste vide et les scénarios passent
// pour de mauvaises raisons.
const MOCK_GETALL = {
  ok: true,
  entries: [
    { _id:'e1', _n:1, date:TODAY, horaire:'09H00', ampm:'AM', statut:'Planifié',
      conseiller:'Michel Aswad', commune:'Agen', lieu:'CMS', thematique:'Numérique',
      inscrits:4, presents:0, materiel:[], orienteur:'CAF', public:'Adultes', remarques:'' },
  ],
  lists: {
    statuts:['Planifié','Réalisé','Annulé','Reporté','Non réalisé'],
    conseillers:['Michel Aswad','Cynthia Pineau'],
    publics:['Adultes','Seniors'],
    materiels:['Tablette','Ordinateur'],
  },
  visibility:{ saisie:true, historique:true, dashboard:true, carte:true, bingo:true, gestion_ordi:true },
  conseiller_colors:{}, emails:{}, materiels_masques:[], stockOrdinateurs:10,
};

function reponseGas(action) {
  if (action === 'getAll')         return MOCK_GETALL;
  if (action === 'checkPassword')  return { ok:true, role:'admin', token:'jeton-de-test' };
  if (action === 'getComptes')     return { ok:true, comptes:[
    { conseiller:'Michel Aswad', role:'admin', actif:'OUI' },
    { conseiller:'Cynthia Pineau', role:'user', actif:'OUI' },
  ]};
  if (action === 'getConfig')      return { ok:true, config:{} };
  if (action === 'logLogin')       return { ok:true };
  if (action === 'getVisibility')  return { ok:true, visibility:MOCK_GETALL.visibility };
  if (action === 'getLogs')        return { ok:true, logs:[] };
  if (action === 'saveEntry')      return { ok:true, _id:'e1' };
  return { ok:true };
}

const REACT_JS     = fs.readFileSync(path.join(__dirname, '../node_modules/react/umd/react.production.min.js'), 'utf8');
const REACT_DOM_JS = fs.readFileSync(path.join(__dirname, '../node_modules/react-dom/umd/react-dom.production.min.js'), 'utf8');
const STUBS = `window.L={map:()=>({setView:()=>({on:()=>{},addLayer:()=>{}})}),tileLayer:()=>({addTo:()=>{}}),marker:()=>({addTo:()=>{},bindPopup:()=>({}),openPopup:()=>{},remove:()=>{}}),Icon:{Default:{mergeOptions:()=>{}}},latLngBounds:()=>({isValid:()=>false}),divIcon:()=>({})};
window.echarts={init:()=>({setOption:()=>{},resize:()=>{},dispose:()=>{},on:()=>{}})};
window.XLSX={utils:{book_new:()=>({}),aoa_to_sheet:()=>({}),book_append_sheet:()=>{}},writeFile:()=>{}};`;

// Installe les mocks CDN/GAS sur une page et retourne son compteur d'appels.
async function instrumenter(page) {
  const appels = [];
  await page.route('**/react.production.min.js', r =>
    r.fulfill({ status:200, contentType:'application/javascript', body:REACT_JS }));
  await page.route('**/react-dom.production.min.js', r =>
    r.fulfill({ status:200, contentType:'application/javascript', body:REACT_DOM_JS }));
  for (const p of ['**/vendor/leaflet-*/leaflet.js', '**/echarts.min.js', '**/xlsx.full.min.js']) {
    await page.route(p, r => r.fulfill({ status:200, contentType:'application/javascript', body:STUBS }));
  }
  // geo.api.gouv.fr : coordonnees (fetchGPSCommune) et contours de communes.
  // Jamais intercepte jusqu'ici — un vrai appel sortait pendant les suites.
  await page.route('**/geo.api.gouv.fr/**', route => route.abort());
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const action = new URL(route.request().url()).searchParams.get('action') || '';
    appels.push(action);
    await route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify(reponseGas(action)) });
  });
  return appels;
}

const compte = (appels, action) => appels.filter(a => a === action).length;

// Paramètres d'un appel à l'API : action dans l'URL, le reste dans le corps
// POST (depuis la bascule du 25/09/2026, plus rien dans l'URL).
function paramsAppel(route) {
  const p = new URLSearchParams(route.request().postData() || '');
  new URL(route.request().url()).searchParams.forEach((v, k) => { if (!p.has(k)) p.set(k, v); });
  return p;
}

// ── 1. Rien de lourd avant la connexion (index.html) ────────────────────────
// Avant le 18/09/2026, index.html lançait getComptes + getConfig + un getAll
// complet au montage, puis checkPassword partait en concurrence avec eux.
test('index — aucun appel lourd tant que personne n\'est connecté', async ({ page }) => {
  const appels = await instrumenter(page);
  await page.goto('/index.html');
  await page.waitForSelector('input[type="password"]', { timeout:10000 });
  await page.waitForTimeout(1500); // laisse partir d'éventuels appels différés

  expect(compte(appels,'getAll'),
    `getAll ne doit pas partir avant la connexion — appels vus : ${appels.join(', ')}`).toBe(0);
  expect(compte(appels,'getConfig'),
    `getConfig ne doit pas partir avant la connexion — appels vus : ${appels.join(', ')}`).toBe(0);
  // getComptes est le seul autorisé : il alimente le menu déroulant de
  // connexion, et c'est lui qui a permis de sortir getAll de ce parcours.
  expect(compte(appels,'getComptes')).toBeLessThanOrEqual(1);
});

// ── 2. Une écriture ne déclenche aucun rechargement complet ─────────────────
// L'entrée sauvegardée est appliquée en local ; le getAll qui suivait chaque
// saveEntry repartait systématiquement sur un cache serveur vide.
test('index — modifier un atelier émet saveEntry seul, sans getAll derrière', async ({ page }) => {
  const appels = await instrumenter(page);
  await page.goto('/index.html');
  await page.waitForSelector('input[type="password"]', { timeout:10000 });

  // Le conseiller doit être choisi explicitement. Le menu déroulant conserve
  // la valeur initiale (CONSEILLERS_DEFAULT[0]) dès lors qu'elle figure aussi
  // dans les comptes renvoyés par getComptes — on se retrouvait connecté sous
  // un autre nom que l'auteur de l'atelier de test, que le filtre par
  // conseiller masquait alors tout à fait légitimement.
  const selectConseiller = page.locator('select').first();
  await expect(selectConseiller.locator('option', { hasText:'Michel Aswad' }))
    .toHaveCount(1, { timeout:10000 });
  await selectConseiller.selectOption('Michel Aswad');

  await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});  // aucun nom présélectionné (25/09/2026)
  await page.fill('input[type="password"]', 'test');
  await page.getByText('🔓 Connexion', { exact:true }).click();
  await page.waitForSelector('.sidebar-btn', { timeout:10000 });
  await page.locator('.sidebar-btn', { hasText:'Historique' }).first().click();
  await page.waitForSelector('.atelier-card', { timeout:10000 });

  appels.length = 0;  // on ne compte que ce qui suit l'écriture

  await page.locator('.atelier-card').first().click();
  const enregistrer = page.getByText('💾 Enregistrer', { exact:true });
  await enregistrer.waitFor({ timeout:10000 });
  await enregistrer.click();
  await page.waitForTimeout(2000);

  expect(compte(appels,'saveEntry'),
    `appels vus : ${appels.join(', ') || '(aucun)'}`).toBe(1);
  expect(compte(appels,'getAll'),
    `un rechargement complet a suivi l'écriture — appels vus : ${appels.join(', ')}`).toBe(0);
});

// ── 3. Deux onglets Admin ne s'effacent pas mutuellement le journal ─────────
// adm_logs_nextstep est partagé par tous les onglets du navigateur. addLog y recopiait
// son seul état React : le dernier à journaliser effaçait les lignes de
// l'autre. Le journal servant à mesurer les appels GAS, des lignes manquantes
// faussent le diagnostic lui-même.
test('admin — deux onglets écrivent dans le journal sans s\'écraser', async ({ context }) => {
  const ongletA = await context.newPage();
  const ongletB = await context.newPage();
  for (const p of [ongletA, ongletB]) {
    await instrumenter(p);
    await p.goto('/admin.html');
    await p.waitForSelector('input[type="password"]', { timeout:10000 });
    await p.locator('select').first().selectOption({ index: 1 }).catch(() => {});  // aucun nom présélectionné (25/09/2026)
    await p.fill('input[type="password"]', 'test');
    await p.getByText('Connexion', { exact:true }).click();
    await p.waitForSelector('.sidebar-btn', { timeout:10000 });
  }

  // gasLogHook est le point d'entrée réel du journal : chaque appel GAS y
  // passe. On le sollicite en alternance depuis les deux onglets.
  const journaliser = (p, prefixe, n) => p.evaluate(([pre, nb]) => {
    for (let i = 0; i < nb; i++) {
      window.gasLogHook({ action:`${pre}${i}`, attempt:1, ms:1000, issue:'ok' });
    }
  }, [prefixe, n]);

  await journaliser(ongletA, 'A_', 3);
  await ongletA.waitForTimeout(300);
  await journaliser(ongletB, 'B_', 3);
  await ongletB.waitForTimeout(300);
  await journaliser(ongletA, 'A2_', 2);
  await ongletA.waitForTimeout(500);

  const stocke = await ongletA.evaluate(() => localStorage.getItem('nextstep:adm_logs') || '[]');
  const lignes = JSON.parse(stocke).map(e => e.msg).join('\n');

  for (const attendu of ['A_0','A_1','A_2','B_0','B_1','B_2','A2_0','A2_1']) {
    expect(lignes, `la ligne « ${attendu} » a été effacée par l'autre onglet`).toContain(attendu);
  }

  // Et la fusion ne doit pas dupliquer ce qui existait déjà.
  const ids = JSON.parse(stocke).map(e => e.id).filter(Boolean);
  expect(new Set(ids).size, 'des entrées ont été dupliquées par la fusion').toBe(ids.length);
});

// ── 4. Plus de getConfig dédié sur index ───────────────────────────────────
// Le drapeau maintenance voyage dans getAll : un appel getConfig séparé était
// un aller-retour de plus à chaque connexion, et avec la file d'attente de
// gasUnAppel il retardait le getAll dont l'utilisateur attend le résultat.
test('index — aucun getConfig, le drapeau maintenance voyage dans getAll', async ({ page }) => {
  const appels = await instrumenter(page);
  await page.goto('/index.html');
  await page.waitForSelector('input[type="password"]', { timeout:10000 });
  await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});  // aucun nom présélectionné (25/09/2026)
  await page.fill('input[type="password"]', 'test');
  await page.getByText('🔓 Connexion', { exact:true }).click();
  await page.waitForSelector('.sidebar-btn', { timeout:10000 });
  await page.waitForTimeout(1500);

  expect(compte(appels,'getConfig'),
    `getConfig ne doit plus partir depuis index — appels vus : ${appels.join(', ')}`).toBe(0);
  expect(compte(appels,'getAll'), 'getAll doit bien partir après connexion').toBe(1);
});

// ── 5. La maintenance reste détectée malgré la suppression de getConfig ────
// Supprimer un appel ne doit pas supprimer la fonctionnalité qu'il portait :
// le GAS répond {ok:false, maintenance:true, msg} à tout appelant non-admin.
test('index — le mode maintenance s\'affiche toujours, via getAll seul', async ({ page }) => {
  await instrumenter(page);
  // On réécrit la seule réponse getAll pour simuler la maintenance active.
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const action = new URL(route.request().url()).searchParams.get('action') || '';
    const corps = action === 'getAll'
      ? { ok:false, maintenance:true, msg:'Mise à jour en cours, merci de revenir plus tard.' }
      : reponseGas(action);
    await route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify(corps) });
  });

  await page.goto('/index.html');
  await page.waitForSelector('input[type="password"]', { timeout:10000 });
  await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});  // aucun nom présélectionné (25/09/2026)
  await page.fill('input[type="password"]', 'test');
  await page.getByText('🔓 Connexion', { exact:true }).click();

  await expect(page.getByText('Mise à jour en cours, merci de revenir plus tard.'))
    .toBeVisible({ timeout:15000 });
  // Et surtout : pas de message d'erreur générique à la place.
  await expect(page.getByText(/Impossible de charger/)).toHaveCount(0);
});

// ── 5-6. Lectures doublées, écritures jamais (porté de NEWGEN le 23/09/2026) ─
// La panne réelle : la réponse n'arrive JAMAIS (livraison perdue après
// exécution). On la simule en ne répondant pas au premier appel d'une action.
// Route enregistrée après instrumenter : Playwright essaie d'abord la plus
// récente, fallback() rend la main au mock général pour le reste.
// Renvoie le nombre d'appels vus pour cette action (le premier, muet, ne
// passe jamais par le compteur d'instrumenter).
async function premierAppelMuet(page, actionVisee) {
  const vus = { n:0 };
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const action = new URL(route.request().url()).searchParams.get('action') || '';
    if (action !== actionVisee) return route.fallback();
    vus.n++;
    if (vus.n === 1) return;  // jamais de réponse : le client doit s'en passer
    return route.fallback();
  });
  return vus;
}

test('lecture muette — le doublon part à 7 s et rapporte la réponse', async ({ page }) => {
  await instrumenter(page);
  const vus = await premierAppelMuet(page, 'getVisibility');
  await page.goto('/index.html');
  await page.waitForSelector('input[type="password"]', { timeout:10000 });

  const r = await page.evaluate(async () => {
    const t0 = Date.now();
    const req = window.requeteServeur(new URLSearchParams({ action:'getVisibility' }));
    const data = await window.gasAppel(req.url, 'getVisibility', req.corps);
    return { ok:data.ok, ms:Date.now()-t0, journal:window.__gasLog.map(e => `${e.action} #${e.attempt} ${e.issue}`) };
  });

  expect(r.ok).toBe(true);
  // Sans doublage, il fallait attendre l'abandon à 12 s puis une reprise.
  expect(r.ms, `réponse obtenue en ${r.ms} ms`).toBeLessThan(10000);
  expect(r.journal, r.journal.join(' | ')).toContain('getVisibility #1b ok');
  expect(vus.n, 'l\'original et son doublon, pas plus').toBe(2);
});

test('écriture muette — jamais doublée pendant qu\'elle est en vol', async ({ page }) => {
  await instrumenter(page);
  const vus = await premierAppelMuet(page, 'saveEntry');
  await page.goto('/index.html');
  await page.waitForSelector('input[type="password"]', { timeout:10000 });

  await page.evaluate(() => {
    const req = window.requeteServeur(new URLSearchParams({ action:'saveEntry' }));
    window.gasAppel(req.url, 'saveEntry', req.corps).catch(() => {});
  });
  // Au-delà de GAS_HEDGE_MS : une lecture aurait déjà son doublon.
  await page.waitForTimeout(8500);
  expect(vus.n,
    'deux saveEntry en vol en même temps peuvent créer deux lignes').toBe(1);
});

// ── 7. Recliquer après un échec ne duplique pas un cycle ───────────────────
// Incident du 23/09/2026 : cycle de 8 ateliers, réponse de saveMany perdue,
// toast rouge, second clic = 16 lignes dans le classeur. Chaque clic tirait de
// nouveaux _id ; le serveur remplace une ligne dont l'_id existe déjà, donc
// garder les mêmes _id d'un clic à l'autre suffit à rendre le reclic sûr.
test('cycle — un second clic après échec renvoie les mêmes _id', async ({ page }) => {
  await instrumenter(page);
  const lots = [];
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const u = { searchParams: paramsAppel(route) };
    if (u.searchParams.get('action') !== 'saveMany') return route.fallback();
    lots.push(JSON.parse(u.searchParams.get('entries')).map(e => e._id));
    // Premier envoi : échec définitif immédiat (pas de reprise automatique),
    // l'usager voit l'erreur et reclique.
    if (lots.length === 1) return route.fulfill({ status:403, body:'' });
    return route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({ ok:true }) });
  });

  await page.goto('/index.html');
  const selectConseiller = page.locator('select').first();
  await expect(selectConseiller.locator('option', { hasText:'Michel Aswad' })).toHaveCount(1, { timeout:10000 });
  await selectConseiller.selectOption('Michel Aswad');
  await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});  // aucun nom présélectionné (25/09/2026)
  await page.fill('input[type="password"]', 'test');
  await page.getByText('🔓 Connexion', { exact:true }).click();
  await page.waitForSelector('.sidebar-btn', { timeout:10000 });
  await page.locator('.sidebar-btn', { hasText:'Nouveau' }).first().click();
  await page.mouse.move(1000, 400);
  await page.getByText('🔄 Saisie par cycle').click();

  const F = '[data-saisie] ';
  // Le tableau démarre avec deux lignes ; la seconde reste VIDE exprès :
  // elle ne doit ni bloquer l'envoi, ni partir dans le lot.
  await page.locator("input[placeholder^='Nom de l']").fill('CAF');
  await page.locator('input[placeholder="Code postal ou commune…"]').click();
  await page.keyboard.type('Agen');
  await page.locator('.combo-item').first().dispatchEvent('mousedown');
  await page.locator('input[placeholder^="Salle"]').fill('CMS');
  const sels = page.locator(F + 'select');
  await sels.nth(0).selectOption('Michel Aswad');
  await sels.nth(2).selectOption({ index:1 });
  await page.locator(F + 'input[type="date"]').first().fill('2026-11-02');
  await page.locator(F + 'input[type="time"]').first().fill('14:00');
  await sels.nth(3).selectOption('AM');
  await page.locator('input[placeholder="Thème de la séance"]').first().fill('TBD');

  const creer = page.getByText(/💾 Créer \d+ atelier/);
  await creer.click();
  await expect(page.getByText(/recliquez sur Enregistrer/)).toBeVisible({ timeout:10000 });
  await creer.click();
  await expect(page.getByText(/atelier\(s\) créé\(s\)/)).toBeVisible({ timeout:10000 });

  expect(lots.length, 'deux envois attendus').toBe(2);
  expect(lots[1], 'le second clic doit renvoyer les mêmes ateliers, pas de nouveaux').toEqual(lots[0]);
});

// ── 8. Réponse perdue, mais ateliers bien écrits : succès sans second clic ─
// Incident du 23/09/2026 : cycle de 8 ateliers, réponse de saveMany perdue,
// toast rouge, second clic = 16 lignes dans le classeur. Chaque clic tirait de
// nouveaux _id ; le serveur remplace une ligne dont l'_id existe déjà, donc
// garder les mêmes _id d'un clic à l'autre suffit à rendre le reclic sûr.
test('cycle — réponse perdue mais ateliers dans la feuille : succès affiché', async ({ page }) => {
  await instrumenter(page);
  const lots = [];
  let verifs = 0;
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const u = { searchParams: paramsAppel(route) };
    const action = u.searchParams.get('action');
    if (action === 'saveMany') {
      lots.push(JSON.parse(u.searchParams.get('entries')).map(e => e._id));
      return route.fulfill({ status:403, body:'' });  // réponse jamais exploitable
    }
    if (action === 'verifierIds') {
      verifs++;
      // Le serveur a bien écrit : tous les identifiants demandés sont présents.
      const ids = u.searchParams.get('ids').split(',');
      return route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({ ok:true, presents:ids }) });
    }
    return route.fallback();
  });

  await page.goto('/index.html');
  const selectConseiller = page.locator('select').first();
  await expect(selectConseiller.locator('option', { hasText:'Michel Aswad' })).toHaveCount(1, { timeout:10000 });
  await selectConseiller.selectOption('Michel Aswad');
  await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});  // aucun nom présélectionné (25/09/2026)
  await page.fill('input[type="password"]', 'test');
  await page.getByText('🔓 Connexion', { exact:true }).click();
  await page.waitForSelector('.sidebar-btn', { timeout:10000 });
  await page.locator('.sidebar-btn', { hasText:'Nouveau' }).first().click();
  await page.mouse.move(1000, 400);
  await page.getByText('🔄 Saisie par cycle').click();

  const F = '[data-saisie] ';
  // Le tableau démarre avec deux lignes ; la seconde reste VIDE exprès :
  // elle ne doit ni bloquer l'envoi, ni partir dans le lot.
  await page.locator("input[placeholder^='Nom de l']").fill('CAF');
  await page.locator('input[placeholder="Code postal ou commune…"]').click();
  await page.keyboard.type('Agen');
  await page.locator('.combo-item').first().dispatchEvent('mousedown');
  await page.locator('input[placeholder^="Salle"]').fill('CMS');
  const sels = page.locator(F + 'select');
  await sels.nth(0).selectOption('Michel Aswad');
  await sels.nth(2).selectOption({ index:1 });
  await page.locator(F + 'input[type="date"]').first().fill('2026-11-02');
  await page.locator(F + 'input[type="time"]').first().fill('14:00');
  await sels.nth(3).selectOption('AM');
  await page.locator('input[placeholder="Thème de la séance"]').first().fill('TBD');

  await page.getByText(/💾 Créer \d+ atelier/).click();
  await expect(page.getByText(/confirmé dans le classeur/)).toBeVisible({ timeout:10000 });
  expect(lots.length, 'un seul envoi : aucun second clic nécessaire').toBe(1);
  expect(verifs).toBe(1);
});

// ── 9. Plusieurs années cochées : un seul getAll avec years= ───────────────
// AG-007 : un appel par année cochée doublerait l'exposition aux pertes de
// livraison à l'ouverture. Le serveur fusionne, le client n'émet qu'un appel.
test('années — cocher une seconde année recharge en UN appel years=', async ({ page }) => {
  await instrumenter(page);
  const getAlls = [];
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const u = { searchParams: paramsAppel(route) };
    if (u.searchParams.get('action') === 'getAll')
      getAlls.push(u.searchParams.get('years') || 'year=' + u.searchParams.get('year'));
    return route.fallback();
  });
  await page.goto('/index.html');
  const selectConseiller = page.locator('select').first();
  await expect(selectConseiller.locator('option', { hasText:'Michel Aswad' })).toHaveCount(1, { timeout:10000 });
  await selectConseiller.selectOption('Michel Aswad');
  await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});  // aucun nom présélectionné (25/09/2026)
  await page.fill('input[type="password"]', 'test');
  await page.getByText('🔓 Connexion', { exact:true }).click();
  await page.waitForSelector('.sidebar-btn', { timeout:10000 });
  await page.waitForTimeout(500);
  getAlls.length = 0;

  const c = new Date().getFullYear();
  await page.locator('button.sidebar-year').click();
  await page.getByRole('checkbox').nth(2).check();   // année suivante
  await page.getByRole('button', { name:'OK', exact:true }).click();
  await page.waitForTimeout(1000);

  expect(getAlls, getAlls.join(' | ')).toEqual([`${c},${c+1}`]);
  await expect(page.locator('button.sidebar-year')).toContainText(`${c} + ${c+1}`);
});

// ── Bascule du 25/09/2026 : plus aucun appel au GAS ────────────────────────
// Le classeur Google est abandonné à la bascule ; un appel oublié y écrirait
// sans que personne ne le voie. Toute requête vers script.google.com fait
// échouer ce test (connexion Index puis Admin, chargement des ateliers).
test('bascule — plus aucun appel au GAS, sur Index comme sur Admin', async ({ page }) => {
  await instrumenter(page);
  const gas = [];
  await page.route('**/script.google.com/**', route => { gas.push(route.request().url()); return route.abort(); });
  await page.goto('/index.html');
  await page.waitForSelector('input[type="password"]', { timeout:10000 });
  await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});  // aucun nom présélectionné (25/09/2026)
  await page.fill('input[type="password"]', 'test');
  await page.getByText('🔓 Connexion', { exact:true }).click();
  await page.waitForTimeout(1500);
  await page.goto('/admin.html');
  await page.waitForSelector('input[type="password"]', { timeout:10000 });
  await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});  // aucun nom présélectionné (25/09/2026)
  await page.fill('input[type="password"]', 'test');
  await page.getByText('Connexion', { exact:true }).click();
  await page.waitForTimeout(1500);
  expect(gas, gas.join(' | ')).toEqual([]);
});
