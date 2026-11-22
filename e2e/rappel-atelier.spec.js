const { test, expect } = require('@playwright/test');

const CONSEILLER = 'Conseiller de test';
const MOT_DE_PASSE = 'MotDePasseFictif2026!';
const JETON = 'b'.repeat(64);
const ATELIER_PLANIFIE = {
  _id: 'autre:2026', _n: 1, statut: 'Planifié', date: '2026-12-01', horaire: '09:00',
  duree: 90, ampm: 'AM', orienteur: 'CCAS', commune: 'AGEN (47000)', lieu: 'Mairie',
  thematique: 'Atelier ordinaire fictif', inscrits: 8, presents: '', public: 'Séniors',
  conseiller: CONSEILLER, co_animateur: '', residence: '', remarques: '', materiel: [],
  nb_ordinateurs: '', ouvert_a_tous: 'Non', fiche_bilan: '', liens: [],
};
const ATELIER_RAPPELE = {
  ...ATELIER_PLANIFIE, _id: 'rappel:2025', _n: 2, statut: 'Réalisé', date: '2025-10-06',
  thematique: 'Atelier du rappel fictif', presents: 8,
  liens: [{ titre: 'Support fictif de l’atelier rappelé', url: 'https://partage.lotetgaronne.fr/s/rappel-fictif' }],
};

async function installerApiFictive(page) {
  const lectures = [];
  await page.route('**/ateliers-numeriques.alwaysdata.net/**', async route => {
    const parametres = new URLSearchParams(route.request().postData() || '');
    const action = parametres.get('action') || new URL(route.request().url()).searchParams.get('action');
    let reponse = { ok: true };
    if (action === 'getComptes') {
      reponse = { ok: true, comptes: [{ conseiller: CONSEILLER, role: 'user' }], maintenance: false, maintenance_msg: '' };
    } else if (action === 'checkPassword') {
      reponse = parametres.get('conseiller') === CONSEILLER && parametres.get('password') === MOT_DE_PASSE
        ? { ok: true, role: 'user', token: JETON }
        : { ok: false, error: 'Identification fictive refusée.' };
    } else if (action === 'getAll') {
      const annees = (parametres.get('years') || parametres.get('year') || '').split(',');
      const authentifie = parametres.get('token') === JETON;
      lectures.push({ annees, authentifie });
      reponse = authentifie ? {
        ok: true,
        years: annees.map(Number),
        entries: [ATELIER_PLANIFIE, ATELIER_RAPPELE].filter(atelier => annees.includes(atelier.date.slice(0, 4))),
        lists: { statuts: ['Planifié', 'Réalisé'], conseillers: [CONSEILLER], publics: ['Séniors'], materiels: [] },
        visibility: { saisie: true, historique: true, dashboard: true, carte: true, bingo: true, calendrier: true, agenda: true, roadmap: true, gestion_ordi: true },
        conseiller_colors: {}, conseillers_inactifs: [], stockOrdinateurs: 10, materielsCaches: [],
        rappelsFiches: null, vacances: {}, tickets: { nouveaux: 0, derniere_reponse: '' },
        lu: { nouveautes_index: 0, nouveautes_admin: 0, tickets: '', ateliers_index: {}, ateliers_admin: {} },
      } : { ok: false, auth: true };
    }
    await route.fulfill({ json: reponse });
  });
  return lectures;
}

async function connecter(page, url, lectures) {
  await page.goto(url);
  const formulaire = page.locator('form', { has: page.getByPlaceholder('Mot de passe', { exact: true }) });
  await expect(formulaire).toBeVisible();
  await expect(page).toHaveURL(url);
  expect(lectures).toEqual([]);
  await formulaire.getByRole('combobox').selectOption(CONSEILLER);
  await formulaire.getByPlaceholder('Mot de passe', { exact: true }).fill(MOT_DE_PASSE);
  await formulaire.getByRole('button', { name: /Connexion/ }).click();
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-22T12:00:00Z'));
  await page.addInitScript(() => {
    for (const app of ['newgen', 'nextstep']) {
      const cle = `${app}:f_annee`;
      if (localStorage.getItem(cle) === null) localStorage.setItem(cle, '2026');
      localStorage.setItem(`${app}:f_annee_plus_2027`, '1');
    }
  });
});

test('Lien de rappel Reporting : passe la connexion et ouvre la fiche de la bonne année une fois', async ({ page, baseURL }) => {
  const erreurs = [];
  page.on('pageerror', erreur => erreurs.push(erreur.message));
  const lectures = await installerApiFictive(page);
  const index = new URL('/index.html', baseURL).href;
  await connecter(page, `${index}#atelier=${encodeURIComponent(ATELIER_RAPPELE._id)}&annee=2025&volet=reporting`, lectures);

  await expect.poll(() => lectures).toContainEqual({ annees: ['2025'], authentifie: true });
  const panneau = page.locator('.side-panel.open');
  await expect(panneau.getByRole('tab', { name: /Reporting/ })).toHaveAttribute('aria-selected', 'true');
  await expect(panneau.getByRole('link', { name: /Support fictif de l’atelier rappelé/ })).toBeVisible();
  const fiche = panneau.locator('#fiche-bilan-volet');
  await expect(fiche.getByText("Bilan de l'atelier")).toBeVisible();
  const niveau = fiche.getByRole('button', { name: 'Débutant', exact: true });
  await niveau.click();
  await expect(niveau).toHaveAttribute('aria-pressed', 'true');

  await panneau.getByRole('button', { name: '✕', exact: true }).click();
  await expect(panneau).toHaveCount(0);
  await expect(page).toHaveURL(index);
  expect(await page.evaluate(() => localStorage.getItem(lsKey('f_annee')))).toBe('2026');
  await page.reload();
  await expect.poll(() => lectures).toContainEqual({ annees: ['2026'], authentifie: true });
  await expect(page.getByText(ATELIER_PLANIFIE.thematique, { exact: true })).toBeVisible();
  await expect(panneau).toHaveCount(0);
  expect(erreurs).toEqual([]);
});

test('Lien de rappel Détail : un atelier introuvable est signalé après connexion', async ({ page, baseURL }) => {
  const lectures = await installerApiFictive(page);
  const index = new URL('/index.html', baseURL).href;
  await connecter(page, `${index}#atelier=atelier-fictif-absent&annee=2026&volet=detail`, lectures);

  await expect(page.getByText('Cet atelier est introuvable ou inaccessible.', { exact: true })).toBeVisible();
  expect(lectures).toContainEqual({ annees: ['2026'], authentifie: true });
  await expect(page.locator('.side-panel.open')).toHaveCount(0);
  await expect(page).toHaveURL(index);
});
