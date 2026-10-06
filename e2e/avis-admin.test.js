// Suppression d'un avis isolé, page Admin seulement (04/10/2026) : la ligne
// dépliée montre les avis un par un ; « Supprimer » appelle supprimerAvis puis
// recharge le tableau. Serveur simulé, action par action.
const { test, expect } = require('@playwright/test');
const auj = new Date().toISOString().slice(0,10);
test('Admin — avis par atelier : avis un par un, suppression d\'un avis', async ({ page, baseURL }) => {
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  let supprime = 0;
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const body = route.request().postData() || ''; const url = route.request().url();
    const action = (new URLSearchParams(body).get('action')) || new URL(url).searchParams.get('action');
    let r = { ok: true };
    if (action === 'checkPassword') r = { ok: true, role: 'admin', token: 'a'.repeat(64) };
    else if (action === 'getAll') r = { ok: true, entries: [{ _id: 'x1', date: auj, statut: 'Réalisé', thematique: 'IA', commune: 'AGEN', conseiller: 'Alice Martin' }],
      lists: { statuts: ['Réalisé'], conseillers: ['Alice Martin'], publics: [], materiels: [] }, config: {}, role: 'admin', comptes: [], visibility: {}, colors: {} };
    else if (action === 'avisParAtelier') r = { ok: true, ateliers: supprime ? [] : [{ atelier_id: 'x1', n: 1, papier: 0, attentes: 5, clarte: 4, rythme_ok: 1, rythme_n: 1, aise_oui: 1, aise_n: 1, autonomie_oui: 0, autonomie_n: 1, remarques: ['Merci; à bientôt'],
      detail: { rythme: { 'Trop lent': 0, 'Adapté': 1, 'Trop rapide': 0 }, aise: { 'Non': 0, 'Un peu': 0, 'Oui': 1 }, autonomie: { 'Oui': 0, "Avec de l'aide": 0, 'Non': 1 } } }] };
    else if (action === 'avisAtelier') r = { ok: true, avis: supprime ? [] : [{ id: 7, cree_le: auj, source: 'qr', attentes: 5, clarte: 4, rythme: 'Adapté', aise: 'Oui', autonomie: 'Non', sujet: 'Autre', sujet_autre: 'Tablette', remarque: 'Merci' }] };
    else if (action === 'supprimerAvis') { supprime = 1; r = { ok: true }; }
    else if (action === 'getComptes') r = { ok: true, comptes: [{ conseiller: 'Alice Martin', role: 'admin', actif: 'OUI' }] };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(r) });
  });
  page.on('dialog', d => d.accept());
  await page.goto(baseURL + '/admin.html');
  const pwd = page.locator('input[type="password"]').first();
  await pwd.waitFor({ timeout: 10000 });
  await page.locator('select').first().selectOption({ index: 1 }).catch(() => {});
  await pwd.fill('test'); await page.getByText('Connexion', { exact: true }).click();
  await page.waitForSelector('.sidebar-btn', { timeout: 10000 });
  await page.locator('.sidebar-btn', { hasText: 'Dashboard' }).first().click();
  await page.mouse.move(900, 400);  // la barre latérale, ouverte au survol, couvrirait les onglets
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: '💬 Avis par atelier', exact: true }).click();
  // Détail des réponses et export CSV (06/10/2026).
  await expect(page.locator('td', { hasText: '1 adapté' })).toBeVisible();
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: '⬇️ Export CSV' }).click()]);
  const csv = require('fs').readFileSync(await dl.path(), 'utf8').split('\r\n');
  expect(csv[0]).toContain('Rythme : Adapté;Rythme : Trop lent');
  expect(csv[1]).toContain(';1;0;5;4;1;0;0;1;0;0;0;0;1;"Merci; à bientôt"');
  await page.locator('td', { hasText: 'AGEN' }).first().click();
  await expect(page.getByText('Rythme : Adapté')).toBeVisible();
  await expect(page.getByText('Sujet : Autre — Tablette')).toBeVisible();
  await page.getByRole('button', { name: '🗑️ Supprimer' }).click();
  await expect(page.getByText('Aucun avis pour les ateliers de cette période.')).toBeVisible();
  expect(errs).toEqual([]);
});
