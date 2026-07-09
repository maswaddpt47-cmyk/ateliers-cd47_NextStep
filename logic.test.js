const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  STATUTS_VALIDES,
  computeKpi,
  validateEntry, validateLotShared, validateLotRow,
  normalizeMateriel,
  applyFilters,
  normalizeImportRow,
} = require('./logic.js');

// ── STATUTS_VALIDES ───────────────────────────────────────────────────────────
describe('STATUTS_VALIDES', () => {
  it('contient les 5 statuts attendus', () => {
    for (const s of ['Planifié','Réalisé','Annulé','Non réalisé','Reporté']) {
      assert.ok(STATUTS_VALIDES.includes(s));
    }
  });
});

// ── computeKpi ────────────────────────────────────────────────────────────────
describe('computeKpi', () => {
  const entries = [
    { statut: 'Réalisé',  inscrits: 10, presents: 8  },
    { statut: 'Réalisé',  inscrits: 5,  presents: 5  },
    { statut: 'Annulé',   inscrits: 3,  presents: 0  },
    { statut: 'Planifié', inscrits: '',  presents: '' },
  ];

  it('compte les totaux correctement', () => {
    const k = computeKpi(entries);
    assert.equal(k.total,     4);
    assert.equal(k.realises,  2);
    assert.equal(k.annules,   1);
    assert.equal(k.planifies, 1);
  });

  it('inscrits/presents = Réalisés uniquement (ignore Annulé)', () => {
    const k = computeKpi(entries);
    assert.equal(k.inscrits, 15);
    assert.equal(k.presents, 13);
  });

  it('taux de présence calculé correctement', () => {
    const k = computeKpi(entries);
    assert.equal(k.tx, Math.round(13 / 15 * 100));
  });

  it('pas de division par zéro si inscrits = 0', () => {
    const k = computeKpi([{ statut: 'Réalisé', inscrits: 0, presents: 0 }]);
    assert.equal(k.tx, 0);
  });

  it('inscrits="" ignoré dans le calcul', () => {
    const k = computeKpi([{ statut: 'Réalisé', inscrits: '', presents: '' }]);
    assert.equal(k.inscrits, 0);
    assert.equal(k.tx, 0);
  });

  it('tableau vide → tout à 0', () => {
    const k = computeKpi([]);
    assert.equal(k.total, 0);
    assert.equal(k.tx, 0);
  });
});

// ── validateEntry ─────────────────────────────────────────────────────────────
describe('validateEntry', () => {
  const valid = {
    statut: 'Planifié', date: '2026-07-09', horaire: '09:00', ampm: 'AM',
    commune: 'Agen', lieu: 'MJC', thematique: 'Internet', conseiller: 'Paul',
    orienteur: 'CAF', public: 'Tous publics', inscrits: 4,
  };

  it('formulaire complet → aucune erreur', () => {
    assert.deepEqual(validateEntry(valid), {});
  });

  it('champ manquant → erreur sur ce champ', () => {
    const errors = validateEntry({ ...valid, commune: '' });
    assert.ok('commune' in errors);
  });

  it('inscrits="" → erreur inscrits', () => {
    const errors = validateEntry({ ...valid, inscrits: '' });
    assert.ok('inscrits' in errors);
  });

  it('inscrits=0 est valide (≠ inscrits="")', () => {
    const errors = validateEntry({ ...valid, inscrits: 0 });
    assert.ok(!('inscrits' in errors));
  });
});

// ── validateLotRow ────────────────────────────────────────────────────────────
describe('validateLotRow', () => {
  const valid = { date: '2026-07-09', horaire: '09:00', ampm: 'AM', thematique: 'Internet' };

  it('ligne complète → aucune erreur', () => assert.deepEqual(validateLotRow(valid), {}));
  it('date manquante → erreur',        () => assert.ok('date'       in validateLotRow({ ...valid, date: '' })));
  it('thematique manquante → erreur',  () => assert.ok('thematique' in validateLotRow({ ...valid, thematique: '' })));
});

// ── normalizeMateriel ─────────────────────────────────────────────────────────
describe('normalizeMateriel', () => {
  it('tableau → pipe-string',          () => assert.equal(normalizeMateriel(['A', 'B']), 'A|B'));
  it('tableau vide → chaîne vide',     () => assert.equal(normalizeMateriel([]), ''));
  it('filtre les valeurs falsy',       () => assert.equal(normalizeMateriel(['A', '', 'B']), 'A|B'));
  it('string passthrough',             () => assert.equal(normalizeMateriel('A|B'), 'A|B'));
  it('null → chaîne vide',             () => assert.equal(normalizeMateriel(null), ''));
});

// ── applyFilters ──────────────────────────────────────────────────────────────
describe('applyFilters', () => {
  const entries = [
    { statut: 'Réalisé',  commune: 'Agen (47000)',         conseiller: 'Paul', public: 'Tous publics', date: '2026-06-01', thematique: 'Internet', lieu: '', orienteur: '', remarques: '' },
    { statut: 'Annulé',   commune: 'Villeneuve sur lot',   conseiller: 'Marie', public: 'Séniors',     date: '2026-07-15', thematique: 'Email',    lieu: '', orienteur: '', remarques: '' },
    { statut: 'Planifié', commune: 'Agen (47000)',         conseiller: 'Paul', public: 'Tous publics', date: '2026-08-10', thematique: 'Sécurité', lieu: '', orienteur: '', remarques: '' },
  ];

  it('filtre par statut',      () => assert.equal(applyFilters(entries, { statut: 'Annulé' }).length, 1));
  it('filtre par conseiller',  () => assert.equal(applyFilters(entries, { conseiller: 'Paul' }).length, 2));
  it('filtre par mois',        () => assert.equal(applyFilters(entries, { mois: '2026-06' }).length, 1));
  it('filtre par commune (ignore code postal)', () => assert.equal(applyFilters(entries, { commune: 'Agen (47000)' }).length, 2));
  it('filtre par dateFrom/dateTo', () => {
    const r = applyFilters(entries, { dateFrom: '2026-07-01', dateTo: '2026-07-31' });
    assert.equal(r.length, 1);
    assert.equal(r[0].statut, 'Annulé');
  });
  it('filtre textuel (stripAccents)', () => {
    const r = applyFilters(entries, { search: 'email' });
    assert.equal(r.length, 1);
  });
  it('filtres combinés = intersection', () => {
    const r = applyFilters(entries, { statut: 'Réalisé', conseiller: 'Paul' });
    assert.equal(r.length, 1);
  });
  it('aucun filtre → tout', () => assert.equal(applyFilters(entries, {}).length, 3));
});

// ── normalizeImportRow ────────────────────────────────────────────────────────
describe('normalizeImportRow', () => {
  it('normalise tous les champs', () => {
    const r = normalizeImportRow({
      statut: ' Réalisé ', date: '16/06/2026', horaire: '09H00',
      inscrits: '10', presents: '8', materiel: ['Tablette'],
    });
    assert.equal(r.statut,   'Réalisé');
    assert.equal(r.date,     '2026-06-16');
    assert.equal(r.horaire,  '09:00');
    assert.equal(r.inscrits, 10);
    assert.equal(r.presents, 8);
    assert.deepEqual(r.materiel, ['Tablette']);
  });

  it('inscrits="" reste ""', () => {
    const r = normalizeImportRow({ inscrits: '' });
    assert.equal(r.inscrits, '');
  });
});
