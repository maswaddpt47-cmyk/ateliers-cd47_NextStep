// Structures partenaires co-animatrices (AG-069, 25/11/2026) : liste tenue par l'Admin, proposée dans « Co-animateur »
// dans un groupe à part, enregistrée dans une colonne séparée (jamais comme conseiller). Serveur simulé.
const { test, expect } = require('@playwright/test');

const ENTREE = { _id: 'e1', _n: 1, statut: 'Planifié', date: '2026-12-01', horaire: '09:00', ampm: 'AM', orienteur: 'CCAS', commune: 'AGEN (47000)', lieu: 'Mairie', thematique: 'Démarches en ligne', inscrits: 8, presents: 0, public: 'Séniors', conseiller: 'Alice Martin', co_animateur: '', structure_partenaire: '', residence: '', remarques: '', materiel: [], nb_ordinateurs: '', ouvert_a_tous: 'Non' };
const STRUCTURES = ['France Services Santé', 'Mission locale'];

async function serveur(page, { role = 'user', entree = ENTREE } = {}) {
  const etat = { ecritures: [], listes: [] };
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const q = new URLSearchParams(route.request().postData() || ''); const url = route.request().url();
    const action = q.get('action') || new URL(url).searchParams.get('action');
    let r = { ok: true };
    if (action === 'checkPassword') r = { ok: true, role, token: 'c'.repeat(64) };
    else if (action === 'getComptes') r = { ok: true, comptes: [{ conseiller: 'Alice Martin', role: 'admin', actif: 'OUI' }, { conseiller: 'Bruno Durand', role: 'user', actif: 'OUI' }], maintenance: false, maintenance_msg: '' };
    else if (action === 'getAll') r = { ok: true, years: [2026], entries: [entree], lists: { statuts: ['Planifié', 'Réalisé'], conseillers: ['Alice Martin', 'Bruno Durand', 'Claire Petit'], publics: ['Séniors'], materiels: [], structures: STRUCTURES }, visibility: { saisie: true, historique: true, dashboard: true, carte: true, bingo: true, calendrier: true, agenda: true, roadmap: true, gestion_ordi: true }, conseiller_colors: {}, conseillers_inactifs: [], stockOrdinateurs: 10, materielsCaches: [], tickets: { nouveaux: 0, derniere_reponse: '' } };
    else if (action === 'saveEntry') { const e = JSON.parse(q.get('entry') || '{}'); etat.ecritures.push(e); r = { ok: true, _id: e._id }; }
    else if (action === 'saveLists') { etat.listes.push(JSON.parse(q.get('lists') || '{}')); }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(r) });
  });
  return etat;
}

async function connecter(page, baseURL, pageHtml = 'index.html') {
  await page.goto(baseURL + '/' + pageHtml, { waitUntil: 'networkidle', timeout: 20000 });
  const pwd = page.locator('input[type="password"]').first();
  if (await pwd.isVisible({ timeout: 4000 }).catch(() => false)) {
    await page.locator('select').first().selectOption({ label: 'Alice Martin' }).catch(() => {});   // l'animatrice de l'atelier témoin
    await pwd.fill('test');
    await page.getByRole('button', { name: /Connexion/ }).click();
    await page.waitForTimeout(1200);
  }
  const acces = page.getByText('Accéder à mes ateliers');
  if (await acces.isVisible({ timeout: 2000 }).catch(() => false)) {
    await page.locator('select.accueil-select').selectOption({ index: 1 });
    await acces.click();
    await page.waitForTimeout(600);
  }
}

test('Index — volet : une structure partenaire se choisit comme co-animateur, groupe à part, enregistrée à part', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('dialog', d => d.accept());
  const etat = await serveur(page);
  await connecter(page, baseURL);
  await page.getByText('Démarches en ligne').first().click();
  const volet = page.locator('.side-panel.open');
  const menu = volet.locator('.sp-field', { has: page.getByText('Co-animateur', { exact: true }) }).locator('select');
  // Groupe « Structures partenaires » après les conseillers ; l'animateur principal n'est pas proposé en co-animateur.
  await expect(menu.locator('optgroup[label="Structures partenaires"] option')).toHaveText(STRUCTURES);
  await expect(menu.locator('> option')).toHaveText(['— Aucun —', 'Bruno Durand', 'Claire Petit']);
  await menu.selectOption({ label: 'France Services Santé' });
  await volet.getByRole('button', { name: /Enregistrer/ }).click();
  await expect.poll(() => etat.ecritures.length).toBe(1);
  expect(etat.ecritures[0]).toMatchObject({ _id: 'e1', co_animateur: '', structure_partenaire: 'France Services Santé', conseiller: 'Alice Martin' });
  expect(errs).toEqual([]);
});

test('Index — volet : choisir une structure efface le conseiller co-animateur (un seul co-animateur)', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('dialog', d => d.accept());
  const etat = await serveur(page, { entree: { ...ENTREE, co_animateur: 'Claire Petit' } });
  await connecter(page, baseURL);
  await page.getByText('Démarches en ligne').first().click();
  const volet = page.locator('.side-panel.open');
  const menu = volet.locator('.sp-field', { has: page.getByText('Co-animateur', { exact: true }) }).locator('select');
  await expect(menu).toHaveValue('Claire Petit');
  await menu.selectOption({ label: 'Mission locale' });
  await volet.getByRole('button', { name: /Enregistrer/ }).click();
  await expect.poll(() => etat.ecritures.length).toBe(1);
  expect(etat.ecritures[0]).toMatchObject({ co_animateur: '', structure_partenaire: 'Mission locale' });
  expect(errs).toEqual([]);
});

test('Index — volet : choisir un conseiller co-animateur garde le volet ouvert et efface la structure', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  page.on('dialog', d => d.accept());
  const etat = await serveur(page, { entree: { ...ENTREE, structure_partenaire: 'Mission locale' } });
  await connecter(page, baseURL);
  await page.getByText('Démarches en ligne').first().click();
  const volet = page.locator('.side-panel.open');
  const menu = volet.locator('.sp-field', { has: page.getByText('Co-animateur', { exact: true }) }).locator('select');
  await expect(menu).toHaveValue('§Mission locale');
  await menu.selectOption({ label: 'Claire Petit' });   // NextStep : refermait le volet (filtre conseiller changé) avant le 25/11/2026
  await expect(volet).toHaveCount(1);
  await volet.getByRole('button', { name: /Enregistrer/ }).click();
  await expect.poll(() => etat.ecritures.length).toBe(1);
  expect(etat.ecritures[0]).toMatchObject({ co_animateur: 'Claire Petit', structure_partenaire: '' });
  expect(errs).toEqual([]);
});

test('Admin — Listes : onglet « Structures partenaires », ajout enregistré avec les autres listes, sans compte', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const etat = await serveur(page, { role: 'admin' });
  await connecter(page, baseURL, 'admin.html');
  await page.locator('[aria-label="Listes"], [title="Gérer les listes déroulantes"]').first().dispatchEvent('click');   // barre du bas (NEWGEN) ou barre latérale (NextStep)
  await page.locator('.listes-tab', { hasText: 'Structures partenaires' }).click();
  await expect(page.getByText('jamais comptés dans les statistiques')).toBeVisible();
  for (const nom of STRUCTURES) await expect(page.locator('.listes-name', { hasText: nom })).toBeVisible();
  await page.getByPlaceholder('Ajouter dans Structures partenaires…').fill('CPAM 47');
  await page.getByPlaceholder('Ajouter dans Structures partenaires…').press('Enter');
  await page.getByRole('button', { name: /Enregistrer/ }).first().click();
  await expect.poll(() => etat.listes.length).toBe(1);
  expect(etat.listes[0].structures).toEqual([...STRUCTURES, 'CPAM 47']);
  expect(etat.listes[0].conseillers).toEqual(['Alice Martin', 'Bruno Durand', 'Claire Petit']);   // aucune structure parmi les conseillers
  expect(errs).toEqual([]);
});
