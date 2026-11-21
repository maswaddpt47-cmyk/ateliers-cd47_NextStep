// Mémoire « déjà lu » côté serveur (AG-066, 21/11/2026) : vider les données du site (le « hard reset » de
// l'utilisateur) ne rallume plus les pastilles Nouveautés et tickets, ni les étiquettes « Nouveau ».
// Revue Codex du 21/11 : le secours du navigateur est propre à chaque personne, un chargement des tickets en
// échec n'acquitte rien, l'acquittement suit la dernière réponse LIVRÉE.
// Serveur simulé : getAll renvoie `lu` (une mémoire par personne), marquerLu l'enregistre sans jamais le diminuer.
const { test, expect } = require('@playwright/test');

const ENTREE = { _id: 'e1', _n: 1, statut: 'Planifié', date: '2026-12-01', horaire: '09:00', ampm: 'AM', orienteur: 'CCAS', commune: 'AGEN (47000)', lieu: 'Mairie', thematique: 'Démarches en ligne', inscrits: 8, presents: 0, public: 'Séniors', conseiller: 'Alice Martin', co_animateur: '', residence: '', remarques: '', materiel: [], nb_ordinateurs: '' };
const DERNIERE_REPONSE = '2026-11-20 10:00:00';
const VIDE = () => ({ nouveautes_index: 0, nouveautes_admin: 0, tickets: '', ateliers_index: 0, ateliers_admin: 0 });
// Atelier créé par une collègue (numéro 2) : c'est lui que la pastille « nouveaux ateliers » signale.
const AUTRE = { ...ENTREE, _id: 'e2', _n: 2, conseiller: 'Eva Fictive', thematique: 'Atelier ajouté par une collègue' };

async function serveur(page, { avecLu = true, ticketsEnEchec = false, luInitial = {} } = {}) {
  const etat = { lu: JSON.parse(JSON.stringify(luInitial)), marquages: [], courant: 'Alice Martin' };
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const q = new URLSearchParams(route.request().postData() || ''); const url = route.request().url();
    const action = q.get('action') || new URL(url).searchParams.get('action');
    let r = { ok: true };
    if (action === 'checkPassword') { etat.courant = q.get('conseiller') || etat.courant; r = { ok: true, role: 'user', token: 'b'.repeat(64) }; }
    else if (action === 'getComptes') r = { ok: true, comptes: [{ conseiller: 'Alice Martin' }, { conseiller: 'Bruno Durand' }], maintenance: false, maintenance_msg: '' };
    else if (action === 'getAll') {
      r = { ok: true, years: [2026], entries: [ENTREE, AUTRE], lists: { statuts: ['Planifié', 'Réalisé'], conseillers: ['Alice Martin', 'Bruno Durand'], publics: ['Séniors'], materiels: [] }, visibility: { saisie: true, historique: true, dashboard: true, carte: true, bingo: true, calendrier: true, agenda: true, roadmap: true, gestion_ordi: true }, conseiller_colors: {}, conseillers_inactifs: [], stockOrdinateurs: 10, materielsCaches: [], tickets: { nouveaux: 0, derniere_reponse: DERNIERE_REPONSE } };
      if (avecLu) r.lu = { ...VIDE(), ...(etat.lu[etat.courant] || {}) };
    } else if (action === 'getTickets') {
      r = ticketsEnEchec ? { ok: false, error: 'Erreur serveur' }
        : { ok: true, moi: etat.courant, tickets: [{ id: 'tk1', cree_le: '2026-11-10 09:00:00', auteur: etat.courant, type: 'Question', titre: 'Essai', description: 'x', statut: 'Vu', reponse: 'Fait.', repondu_le: DERNIERE_REPONSE, repondu_par: 'Admin', doublon_de: '' }] };
    } else if (action === 'marquerLu') {
      const cle = q.get('cle'), valeur = q.get('valeur');
      etat.marquages.push({ cle, valeur, par: etat.courant });
      const l = etat.lu[etat.courant] = { ...VIDE(), ...(etat.lu[etat.courant] || {}) };
      if (cle === 'tickets') { if (valeur > l.tickets) l.tickets = valeur; }
      else l[cle] = Math.max(l[cle], Number(valeur));
      r = { ok: true, lu: { ...l } };
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(r) });
  });
  return etat;
}

// personne : 1 = Alice Martin, 2 = Bruno Durand (rang dans la liste de connexion)
async function connecter(page, baseURL, personne = 1) {
  await page.goto(baseURL + '/index.html', { waitUntil: 'networkidle', timeout: 20000 });
  const pwd = page.locator('input[type="password"]').first();
  if (await pwd.isVisible({ timeout: 4000 }).catch(() => false)) {
    await page.locator('select').first().selectOption({ index: personne }).catch(() => {});
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

// NextStep : la pastille est voisine du bouton de la barre latérale, pas à l'intérieur.
const pastilleNouveautes = page => page.locator('div:has(> button[title="Nouveautés"]) > .nouv-blink');
const pastilleTickets = page => page.locator('[aria-label$="réponse(s) à vos contributions"]');
// Dernier numéro d'annonce de la page (NOUVEAUTES est une constante globale de shared.js).
const dernierNumero = page => page.evaluate(() => NOUVEAUTES.reduce((m, n) => Math.max(m, n.id), 0));

test('Index — mémoire « déjà lu » : après un nettoyage des données du site, ni pastille ni « Nouveau »', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const etat = await serveur(page);
  await connecter(page, baseURL);
  await expect(pastilleNouveautes(page)).toHaveCount(1);   // rien de lu : pastille allumée
  await expect(pastilleTickets(page)).not.toHaveCount(0);

  const dernier = await dernierNumero(page);
  await page.locator('button[title="Nouveautés"]').click();
  await expect.poll(() => etat.marquages.filter(m => m.cle === 'nouveautes_index')).toEqual([{ cle: 'nouveautes_index', valeur: String(dernier), par: 'Alice Martin' }]);
  await page.getByRole('button', { name: 'Contribuer', exact: true }).dispatchEvent('click');   // barre latérale NextStep : bouton hors de l'écran à 1280x720
  // Acquittement sur la dernière réponse LIVRÉE par getTickets (ici celle de son ticket).
  await expect.poll(() => etat.marquages.filter(m => m.cle === 'tickets')).toEqual([{ cle: 'tickets', valeur: DERNIERE_REPONSE, par: 'Alice Martin' }]);

  // « Hard reset » : données du site vidées (localStorage et sessionStorage), nouvelle connexion.
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  const avant = etat.marquages.length;
  await connecter(page, baseURL);
  await expect(pastilleNouveautes(page)).toHaveCount(0);
  await expect(pastilleTickets(page)).toHaveCount(0);
  await page.locator('button[title="Nouveautés"]').click();
  await expect(page.getByRole('heading', { name: /Nouveautés/ })).toBeVisible();
  const rubrique = page.locator('.card', { has: page.getByRole('heading', { name: /Nouveautés/ }) });
  await expect(rubrique.getByText('Nouveau', { exact: true })).toHaveCount(0);   // aucune étiquette « Nouveau » rallumée dans la rubrique
  expect(etat.marquages.length).toBe(avant);   // le serveur savait déjà : aucune écriture de plus
  expect(errs).toEqual([]);
});

test('Index — mémoire « déjà lu » : serveur sans le champ (ancienne API), le secours du navigateur tient', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await serveur(page, { avecLu: false });
  await connecter(page, baseURL);
  await expect(pastilleNouveautes(page)).toHaveCount(1);
  await page.locator('button[title="Nouveautés"]').click();
  await expect(pastilleNouveautes(page)).toHaveCount(0);   // la pastille s'éteint à l'ouverture, comme avant
  await connecter(page, baseURL);   // rechargement sans nettoyage
  await expect(pastilleNouveautes(page)).toHaveCount(0);
  expect(errs).toEqual([]);
});

test('Index — mémoire « déjà lu » : sur un navigateur partagé, ce que A a lu ne masque rien à B (Codex, AG-066)', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  // Ancienne API : seul le secours du navigateur joue, c'est lui qui était commun aux comptes.
  await serveur(page, { avecLu: false });
  await connecter(page, baseURL, 1);
  await page.locator('button[title="Nouveautés"]').click();
  await expect(pastilleNouveautes(page)).toHaveCount(0);
  await page.getByRole('button', { name: 'Contribuer', exact: true }).dispatchEvent('click');   // barre latérale NextStep : bouton hors de l'écran à 1280x720
  await expect(pastilleTickets(page)).toHaveCount(0);
  // B se connecte dans le même navigateur : localStorage gardé, seule la session change.
  await page.evaluate(() => sessionStorage.clear());
  await connecter(page, baseURL, 2);
  await expect(pastilleNouveautes(page)).toHaveCount(1);
  await expect(pastilleTickets(page)).not.toHaveCount(0);
  expect(errs).toEqual([]);
});

test('Index — tickets : un chargement en échec n\'acquitte aucune réponse (Codex, AG-066)', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const etat = await serveur(page, { ticketsEnEchec: true });
  await connecter(page, baseURL);
  await expect(pastilleTickets(page)).not.toHaveCount(0);
  await page.getByRole('button', { name: 'Contribuer', exact: true }).dispatchEvent('click');   // barre latérale NextStep : bouton hors de l'écran à 1280x720
  await expect(page.getByText('Erreur serveur')).toBeVisible();
  expect(etat.marquages.filter(m => m.cle === 'tickets')).toEqual([]);   // rien d'envoyé au serveur
  await expect(pastilleTickets(page)).not.toHaveCount(0);   // et la pastille reste allumée
  expect(errs).toEqual([]);
});

// Pastille « nouveaux ateliers » (extension AG-066, 21/11/2026) : sa mémoire passe aussi par le serveur.
const pastilleAteliers = page => page.locator('button:is(.topbar-notif-btn, .sidebar-notif-btn)');

test('Index — nouveaux ateliers : après un nettoyage des données du site, le serveur se souvient', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const etat = await serveur(page, { luInitial: { 'Alice Martin': { ateliers_index: 1 } } });   // déjà vu : jusqu'au numéro 1
  await connecter(page, baseURL);
  await expect(pastilleAteliers(page)).toHaveText(/1/);   // l'atelier n° 2 de la collègue est signalé, sans point de départ
  await pastilleAteliers(page).dispatchEvent('click');
  await expect.poll(() => etat.marquages.filter(m => m.cle === 'ateliers_index')).toEqual([{ cle: 'ateliers_index', valeur: '2', par: 'Alice Martin' }]);
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  const avant = etat.marquages.length;
  await connecter(page, baseURL);
  await expect(page.getByText('Démarches en ligne').first()).toBeVisible();
  await page.waitForTimeout(500);
  await expect(pastilleAteliers(page)).toHaveCount(0);   // rien de rallumé après le nettoyage
  expect(etat.marquages.length).toBe(avant);
  expect(errs).toEqual([]);
});

test('Index — nouveaux ateliers : première visite, rien signalé et point de départ noté au serveur', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const etat = await serveur(page);
  await connecter(page, baseURL);
  await expect.poll(() => etat.marquages.filter(m => m.cle === 'ateliers_index')).toEqual([{ cle: 'ateliers_index', valeur: '2', par: 'Alice Martin' }]);
  await expect(pastilleAteliers(page)).toHaveCount(0);
  expect(errs).toEqual([]);
});

test('Index — nouveaux ateliers : ancienne API (sans mémoire serveur), rien envoyé, comportement d\'avant', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const etat = await serveur(page, { avecLu: false });
  await connecter(page, baseURL);
  await expect(page.getByText('Démarches en ligne').first()).toBeVisible();
  await page.waitForTimeout(500);
  await expect(pastilleAteliers(page)).toHaveCount(0);   // première visite : point de départ, dans le navigateur seulement
  expect(etat.marquages.filter(m => m.cle === 'ateliers_index')).toEqual([]);
  expect(errs).toEqual([]);
});
