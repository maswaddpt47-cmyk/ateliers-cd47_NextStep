// Fil de discussion des tickets (25/11/2026) : l'Admin et l'auteur ajoutent des commentaires sans changer le statut ;
// les autres membres de l'équipe lisent seulement. Serveur simulé (forme complète de getTickets, règle 74).
const { test, expect } = require('@playwright/test');

const T1 = { id: 'tk_a', cree_le: '2026-11-24 09:00:00', auteur: 'Alice Martin', site: 'nextstep', version: '', appareil: 'PC', type: 'Question', onglet: '', gene: '', titre: 'Où voir mes ateliers ?', description: 'Je ne les trouve pas.', statut: 'En cours', reponse: 'Regardez dans Historique.', repondu_le: '2026-11-24 10:00:00', repondu_par: 'Michel Aswad', doublon_de: '', clos_le: null };
const T2 = { ...T1, id: 'tk_b', auteur: 'Bruno Durand', titre: 'Un bug de date', description: 'La date saute.', statut: 'Vu', reponse: '', repondu_le: null, repondu_par: '' };
const FIL_A = [
  { id: 'm1', cree_le: '2026-11-24 10:00:00', auteur: 'Michel Aswad', par_admin: 1, texte: 'Regardez dans Historique.' },
  { id: 'm2', cree_le: '2026-11-24 11:30:00', auteur: 'Alice Martin', par_admin: 0, texte: 'Je ne vois toujours rien.' },
];

// role : 'admin' (page Admin) ou 'user' (page Index) ; moi : personne connectée.
async function serveur(page, { moi, role, tickets = [T1, T2], messages = { tk_a: FIL_A, tk_b: [] } } = {}) {
  const etat = { commentaires: [], reponses: [], messages: JSON.parse(JSON.stringify(messages)) };
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const q = new URLSearchParams(route.request().postData() || ''); const url = route.request().url();
    const action = q.get('action') || new URL(url).searchParams.get('action');
    let r = { ok: true };
    if (action === 'checkPassword') r = { ok: true, role, token: 'd'.repeat(64) };
    else if (action === 'getComptes') r = { ok: true, comptes: [{ conseiller: moi, role: role === 'admin' ? 'admin' : 'user', actif: 'OUI' }], maintenance: false, maintenance_msg: '' };
    else if (action === 'getAll') r = { ok: true, years: [2026], entries: [], lists: { statuts: ['Réalisé'], conseillers: [moi], publics: [], materiels: [], structures: [] }, visibility: { saisie: true, historique: true, dashboard: true, carte: true, bingo: true, calendrier: true, agenda: true, roadmap: true, gestion_ordi: true }, conseiller_colors: {}, conseillers_inactifs: [], stockOrdinateurs: 10, materielsCaches: [], tickets: { nouveaux: 0, derniere_reponse: '' } };
    else if (action === 'getTickets') r = { ok: true, tickets, moi, nouveaux: 0, messages: etat.messages, ...(role === 'admin' ? { mail_demandeur: true } : {}) };
    else if (action === 'commenterTicket') {
      const e = { _id: q.get('_id'), _mid: q.get('_mid'), texte: q.get('texte') }; etat.commentaires.push(e);
      const par_admin = role === 'admin' ? 1 : 0;
      (etat.messages[e._id] = etat.messages[e._id] || []).push({ id: e._mid, cree_le: '2026-11-25 16:00:00', auteur: moi, par_admin, texte: e.texte });
      r = { ok: true, nouveau: true, mail: role === 'admin' ? 'envoye' : 'envoye', nouveaux: 0, ticket: tickets.find(t => t.id === e._id), messages: etat.messages[e._id] };
    } else if (action === 'repondreTicket') { etat.reponses.push({ statut: q.get('statut'), reponse: q.get('reponse') }); r = { ok: true, ticket: { ...tickets[0], statut: q.get('statut') }, mail: 'inchange', mail_a: '', nouveaux: 0, messages: etat.messages.tk_a }; }
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(r) });
  });
  return etat;
}

async function ouvrirAdmin(page, baseURL) {
  await page.goto(baseURL + '/admin.html', { waitUntil: 'networkidle', timeout: 20000 });
  const pwd = page.locator('input[type="password"]').first();
  await pwd.waitFor({ timeout: 10000 });
  await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});
  await pwd.fill('test'); await page.getByRole('button', { name: 'Connexion' }).click();
  await page.getByRole('button', { name: /Tickets/ }).first().click();
}
async function ouvrirIndex(page, baseURL) {
  await page.goto(baseURL + '/index.html', { waitUntil: 'networkidle', timeout: 20000 });
  const pwd = page.locator('input[type="password"]').first();
  if (await pwd.isVisible({ timeout: 4000 }).catch(() => false)) {
    await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});
    await pwd.fill('test'); await page.getByRole('button', { name: /Connexion/ }).click(); await page.waitForTimeout(1200);
  }
  const acces = page.getByText('Accéder à mes ateliers');
  if (await acces.isVisible({ timeout: 2000 }).catch(() => false)) { await page.locator('select.accueil-select').selectOption({ index: 1 }); await acces.click(); await page.waitForTimeout(600); }
  await page.getByRole('button', { name: 'Contribuer', exact: true }).dispatchEvent('click');   // NextStep : bouton hors de l'écran à 1280x720
}
test('Admin — fil : messages dans l\'ordre, marqueur « à répondre », commentaire sans changer le statut', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const etat = await serveur(page, { moi: 'Michel Aswad', role: 'admin' });
  await ouvrirAdmin(page, baseURL);
  // Le dernier mot est à l'auteur (Alice) : le ticket attend une réponse ; celui de Bruno (aucun message) non.
  await expect(page.getByText('💬 à répondre')).toHaveCount(1);
  await page.getByText('Où voir mes ateliers ?').click();
  const messages = page.locator('[data-message]');
  await expect(messages).toHaveCount(2);
  await expect(messages.nth(0)).toContainText('Regardez dans Historique.');
  await expect(messages.nth(0)).toHaveAttribute('data-message', 'admin');
  await expect(messages.nth(1)).toContainText('Je ne vois toujours rien.');
  await expect(messages.nth(1)).toHaveAttribute('data-message', 'auteur');
  await page.getByLabel('Ajouter un commentaire').fill('Essayez le filtre « Mes ateliers ».');
  await page.getByRole('button', { name: '💬 Envoyer' }).click();
  await expect.poll(() => etat.commentaires.length).toBe(1);
  expect(etat.commentaires[0]).toMatchObject({ _id: 'tk_a', texte: 'Essayez le filtre « Mes ateliers ».' });
  expect(etat.commentaires[0]._mid).toMatch(/^msg_/);
  expect(etat.reponses).toEqual([]);   // aucun changement de statut envoyé
  await expect(messages).toHaveCount(3);
  await expect(messages.nth(2)).toContainText('Essayez le filtre');
  await expect(page.getByText('💬 à répondre')).toHaveCount(0);   // l'Admin a eu le dernier mot
  expect(errs).toEqual([]);
});

test('Admin — changement de statut : le message est facultatif et n\'est envoyé que s\'il est rempli', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const etat = await serveur(page, { moi: 'Michel Aswad', role: 'admin' });
  await ouvrirAdmin(page, baseURL);
  await page.getByText('Où voir mes ateliers ?').click();
  await expect(page.getByPlaceholder('Message avec le changement de statut (facultatif)…')).toHaveValue('');
  await page.getByRole('button', { name: /Enregistrer/ }).first().click();
  await expect.poll(() => etat.reponses.length).toBe(1);
  expect(etat.reponses[0].reponse).toBeNull();   // champ absent : l'API ne touche pas au fil
  expect(errs).toEqual([]);
});

test('Index — l\'auteur voit le fil et peut y écrire ; sur le ticket d\'un autre, il lit seulement', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  const etat = await serveur(page, { moi: 'Alice Martin', role: 'user' });
  await ouvrirIndex(page, baseURL);
  await page.getByText('Où voir mes ateliers ?').click();
  await expect(page.locator('[data-message]')).toHaveCount(2);
  await expect(page.getByLabel('Ajouter un commentaire')).toHaveCount(1);   // son ticket
  await page.getByLabel('Ajouter un commentaire').fill('Merci, trouvé !');
  await page.getByRole('button', { name: '💬 Envoyer' }).click();
  await expect.poll(() => etat.commentaires.length).toBe(1);
  await expect(page.locator('[data-message]')).toHaveCount(3);
  expect(errs).toEqual([]);
  // Le ticket de Bruno : lecture seule (aucune zone de commentaire une fois le sien refermé).
  await page.getByText('Où voir mes ateliers ?').click();
  await page.getByText('Un bug de date').click();
  await expect(page.getByText('La date saute.')).toBeVisible();
  await expect(page.getByLabel('Ajouter un commentaire')).toHaveCount(0);
});

test('Index — une API d\'avant le fil (sans `messages`) : la réponse unique s\'affiche, aucune zone de commentaire', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const q = new URLSearchParams(route.request().postData() || ''); const action = q.get('action') || new URL(route.request().url()).searchParams.get('action');
    let r = { ok: true };
    if (action === 'checkPassword') r = { ok: true, role: 'user', token: 'd'.repeat(64) };
    else if (action === 'getComptes') r = { ok: true, comptes: [{ conseiller: 'Alice Martin' }], maintenance: false, maintenance_msg: '' };
    else if (action === 'getAll') r = { ok: true, years: [2026], entries: [], lists: { statuts: ['Réalisé'], conseillers: ['Alice Martin'], publics: [], materiels: [] }, visibility: { saisie: true, historique: true, dashboard: true, carte: true, bingo: true, calendrier: true, agenda: true, roadmap: true, gestion_ordi: true }, conseiller_colors: {}, conseillers_inactifs: [], stockOrdinateurs: 10, materielsCaches: [], tickets: { nouveaux: 0, derniere_reponse: '' } };
    else if (action === 'getTickets') r = { ok: true, tickets: [T1], moi: 'Alice Martin', nouveaux: 0 };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(r) });
  });
  await ouvrirIndex(page, baseURL);
  await page.getByText('Où voir mes ateliers ?').click();
  await expect(page.locator('[data-message]')).toHaveCount(1);
  await expect(page.locator('[data-message]').first()).toContainText('Regardez dans Historique.');
  await expect(page.getByLabel('Ajouter un commentaire')).toHaveCount(0);
  expect(errs).toEqual([]);
});
