const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  STATUTS_VALIDES,
  computeKpi,
  validateEntry, validateLotShared, validateLotRow,
  normalizeMateriel,
  applyFilters,
  normalizeImportRow,
  findMobileClassConflicts,
  filterMaterielsVisibles,
  totalJourParConseiller, periodePretMateriel, findOrdinateursConflicts,
  getPretsMateriel, totauxParJourMateriel, estConflitPasse,
  estWeekend, veilleOuvree, lendemainOuvre,
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

// ── findMobileClassConflicts ──────────────────────────────────────────────────
describe('findMobileClassConflicts', () => {
  it('détecte 2 conseillers distincts avec Classe mobile le même jour', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'] },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'] },
    ];
    const conflits = findMobileClassConflicts(entries);
    assert.equal(conflits.length, 1);
    assert.equal(conflits[0].date, '2026-10-01');
    assert.equal(conflits[0].entries.length, 2);
  });

  it('pas de conflit si un seul conseiller ce jour-là (même avec 2 ateliers)', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'] },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'] },
    ];
    assert.equal(findMobileClassConflicts(entries).length, 0);
  });

  it('pas de conflit si dates différentes', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'] },
      { statut: 'Planifié', date: '2026-10-02', conseiller: 'Bob',   materiel: ['Classe mobile'] },
    ];
    assert.equal(findMobileClassConflicts(entries).length, 0);
  });

  it('ignore les ateliers Annulés', () => {
    const entries = [
      { statut: 'Annulé',   date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'] },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'] },
    ];
    assert.equal(findMobileClassConflicts(entries).length, 0);
  });

  it('ignore les ateliers sans Classe mobile', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Tablette'] },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Videoprojecteur'] },
    ];
    assert.equal(findMobileClassConflicts(entries).length, 0);
  });

  it('insensible à la casse/pluriel (via matIncludes)', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['classe mobile'] },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe Mobiles'] },
    ];
    assert.equal(findMobileClassConflicts(entries).length, 1);
  });

  it('3 conseillers distincts le même jour → un seul groupe de conflit avec les 3 entrées', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'] },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'] },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Cynthia', materiel: ['Classe mobile'] },
    ];
    const conflits = findMobileClassConflicts(entries);
    assert.equal(conflits.length, 1);
    assert.equal(conflits[0].entries.length, 3);
  });

  it('tableau vide → aucun conflit', () => {
    assert.deepEqual(findMobileClassConflicts([]), []);
  });
});

// ── filterMaterielsVisibles ────────────────────────────────────────────────────
describe('filterMaterielsVisibles', () => {
  const materiels = ['Videoprojecteur', 'Ecran', 'Classe mobile', 'Scanner'];

  it('sans masqués, renvoie la liste complète', () => {
    assert.deepEqual(filterMaterielsVisibles(materiels, [], []), materiels);
  });
  it('retire les matériels masqués', () => {
    assert.deepEqual(filterMaterielsVisibles(materiels, ['Scanner'], []), ['Videoprojecteur', 'Ecran', 'Classe mobile']);
  });
  it('garde un matériel masqué s\'il est déjà sélectionné (édition)', () => {
    assert.deepEqual(filterMaterielsVisibles(materiels, ['Scanner'], ['Scanner']), materiels);
  });
  it('insensible à la casse/pluriel', () => {
    assert.deepEqual(filterMaterielsVisibles(materiels, ['scanners'], []), ['Videoprojecteur', 'Ecran', 'Classe mobile']);
  });
  it('masqués vide/absent → aucun filtrage', () => {
    assert.deepEqual(filterMaterielsVisibles(materiels, undefined, undefined), materiels);
  });
  it('liste de matériels vide → []', () => {
    assert.deepEqual(filterMaterielsVisibles([], ['Scanner'], []), []);
  });
});

// ── totalJourParConseiller ─────────────────────────────────────────────────────
describe('totalJourParConseiller', () => {
  it('additionne des conseillers différents', () => {
    assert.equal(totalJourParConseiller([{ conseiller: 'Alice', qte: 6 }, { conseiller: 'Bob', qte: 3 }]), 9);
  });
  it('prend le max, pas la somme, pour un même conseiller', () => {
    assert.equal(totalJourParConseiller([{ conseiller: 'Alice', qte: 6 }, { conseiller: 'Alice', qte: 6 }]), 6);
  });
  it('mélange conseillers identiques et différents', () => {
    assert.equal(totalJourParConseiller([{ conseiller: 'Alice', qte: 6 }, { conseiller: 'Alice', qte: 4 }, { conseiller: 'Bob', qte: 3 }]), 9);
  });
  it('liste vide → 0', () => {
    assert.equal(totalJourParConseiller([]), 0);
  });
});

// ── findOrdinateursConflicts ────────────────────────────────────────────────
describe('findOrdinateursConflicts', () => {
  it('pas de conflit si le cumul ne dépasse pas le stock (10)', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 5 },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 5 },
    ];
    assert.equal(findOrdinateursConflicts(entries).length, 0);
  });

  it('détecte un conflit si le cumul du même jour dépasse le stock', () => {
    // Prélèvement/retour pinnés au jour même de l'atelier pour isoler le cas
    // testé (cumul un jour donné) de la déduction veille/lendemain ouvrés
    // (testée séparément sur periodePretMateriel/veilleOuvree/lendemainOuvre).
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    const conflits = findOrdinateursConflicts(entries);
    assert.equal(conflits.length, 1);
    assert.equal(conflits[0].date, '2026-10-01');
    assert.equal(conflits[0].total, 12);
  });

  it('détecte un conflit sur une période de prêt qui chevauche (dates différentes)', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-10-05', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-10-03', date_prelevement_materiel: '2026-10-03', date_retour_materiel: '2026-10-03', conseiller: 'Bob', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    const conflits = findOrdinateursConflicts(entries);
    assert.equal(conflits.length, 1);
    assert.equal(conflits[0].date, '2026-10-03');
  });

  it('la période part du prélèvement, pas de la date de l\'atelier (ex. retrait avant l\'atelier)', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-11-20', date_prelevement_materiel: '2026-11-17', date_retour_materiel: '2026-11-24', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-11-18', date_prelevement_materiel: '2026-11-18', date_retour_materiel: '2026-11-18', conseiller: 'Bob', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    const conflits = findOrdinateursConflicts(entries);
    assert.equal(conflits.length, 1);
    assert.equal(conflits[0].date, '2026-11-18');
  });

  it('pas de conflit si le même conseiller enchaîne deux ateliers dos-à-dos (pas de double comptage)', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-09-25', date_prelevement_materiel: '2026-09-22', date_retour_materiel: '2026-09-29', conseiller: 'Michel Aswad', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-10-02', date_prelevement_materiel: '2026-09-29', conseiller: 'Michel Aswad', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    assert.deepEqual(findOrdinateursConflicts(entries), []);
  });

  it('pas de conflit si les périodes de prêt ne se chevauchent pas', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-10-02', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-10-03', date_prelevement_materiel: '2026-10-03', date_retour_materiel: '2026-10-03', conseiller: 'Bob', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    assert.equal(findOrdinateursConflicts(entries).length, 0);
  });

  it('ignore les ateliers Annulés', () => {
    const entries = [
      { statut: 'Annulé',   date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 8 },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 8 },
    ];
    assert.equal(findOrdinateursConflicts(entries).length, 0);
  });

  it('ignore les ateliers sans Classe mobile même avec nb_ordinateurs renseigné', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Tablette'], nb_ordinateurs: 20 },
    ];
    assert.equal(findOrdinateursConflicts(entries).length, 0);
  });

  it('ignore nb_ordinateurs manquant ou à 0', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'] },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 0 },
    ];
    assert.equal(findOrdinateursConflicts(entries).length, 0);
  });

  it('accepte un stock personnalisé en 2e argument', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 3 },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 3 },
    ];
    assert.equal(findOrdinateursConflicts(entries, 5).length, 1);
    assert.equal(findOrdinateursConflicts(entries, 10).length, 0);
  });

  it('date_retour_materiel antérieure ou égale à date n\'étend pas la période', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-09-28', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-10-02', date_prelevement_materiel: '2026-10-02', date_retour_materiel: '2026-10-02', conseiller: 'Bob', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    assert.equal(findOrdinateursConflicts(entries).length, 0);
  });

  it('tableau vide → aucun conflit', () => {
    assert.deepEqual(findOrdinateursConflicts([]), []);
  });

  it('fusionne les jours consécutifs en conflit en un seul bloc', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-10-04', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-10-02', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    const conflits = findOrdinateursConflicts(entries);
    assert.equal(conflits.length, 1);
    assert.equal(conflits[0].date, '2026-10-01');
    assert.equal(conflits[0].dateFin, '2026-10-02');
    assert.equal(conflits[0].entries.length, 2);
  });

  it('ne fusionne pas deux blocs séparés par un jour sans conflit', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-10-05', date_prelevement_materiel: '2026-10-05', date_retour_materiel: '2026-10-05', conseiller: 'Cynthia', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-10-05', date_prelevement_materiel: '2026-10-05', date_retour_materiel: '2026-10-05', conseiller: 'David',   materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    const conflits = findOrdinateursConflicts(entries);
    assert.equal(conflits.length, 2);
    assert.equal(conflits[0].date, '2026-10-01');
    assert.equal(conflits[1].date, '2026-10-05');
  });

  it('chaque entrée porte commune/lieu/dateDebut/dateFin pour l\'affichage', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-10-03', conseiller: 'Alice', commune: 'AGEN', lieu: 'MFR Agen', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-10-01', date_prelevement_materiel: '2026-10-01', date_retour_materiel: '2026-10-01', conseiller: 'Bob', commune: 'NERAC', lieu: 'CMS Nérac', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    const conflits = findOrdinateursConflicts(entries);
    const alice = conflits[0].entries.find(e => e.conseiller === 'Alice');
    assert.equal(alice.commune, 'AGEN');
    assert.equal(alice.lieu, 'MFR Agen');
    assert.equal(alice.dateDebut, '2026-10-01');
    assert.equal(alice.dateFin, '2026-10-03');
    const bob = conflits[0].entries.find(e => e.conseiller === 'Bob');
    assert.equal(bob.dateDebut, '2026-10-01');
    assert.equal(bob.dateFin, '2026-10-01');
  });

  it('sans dates renseignées, détecte un conflit à travers un week-end (veille/lendemain ouvrés)', () => {
    // Alice : atelier vendredi 2026-09-25, pas de dates → prêt du jeudi 09-24
    // au lundi 09-28 (lendemain ouvré, saute le week-end).
    // Bob : atelier lundi 2026-09-28, pas de dates → prêt du vendredi 09-25
    // (veille ouvrée) au mardi 09-29. Les deux périodes se chevauchent sur
    // le week-end alors qu'aucune date n'a été saisie par les conseillers.
    const entries = [
      { statut: 'Planifié', date: '2026-09-25', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-09-28', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    const conflits = findOrdinateursConflicts(entries);
    assert.equal(conflits.length, 1);
    assert.equal(conflits[0].date, '2026-09-25');
  });
});

// ── periodePretMateriel ─────────────────────────────────────────────────────
describe('periodePretMateriel', () => {
  it('sans prélèvement ni retour, on suppose veille/lendemain ouvrés (ex. atelier un lundi → prélèvement le vendredi)', () => {
    // 2026-09-21 est un lundi : la veille ouvrée saute dimanche (09-20) et
    // samedi (09-19) pour retomber sur vendredi (09-18).
    const p = periodePretMateriel({ date: '2026-09-21' });
    assert.deepEqual(p, { debut: '2026-09-18', fin: '2026-09-22' });
  });
  it('atelier un mercredi (jour ouvré des deux côtés) → veille/lendemain simples, pas de saut de week-end nécessaire', () => {
    const p = periodePretMateriel({ date: '2026-09-23' });
    assert.deepEqual(p, { debut: '2026-09-22', fin: '2026-09-24' });
  });
  it('prélèvement avant la date de l\'atelier étend le début ; le retour non renseigné retombe sur le lendemain ouvré', () => {
    // 2026-11-20 est un vendredi : le lendemain ouvré saute samedi/dimanche
    // et retombe sur lundi 2026-11-23.
    const p = periodePretMateriel({ date: '2026-11-20', date_prelevement_materiel: '2026-11-17' });
    assert.equal(p.debut, '2026-11-17');
    assert.equal(p.fin, '2026-11-23');
  });
  it('un prélèvement après la date de l\'atelier est ignoré (repli sur la date)', () => {
    const p = periodePretMateriel({ date: '2026-11-20', date_prelevement_materiel: '2026-11-25' });
    assert.equal(p.debut, '2026-11-20');
  });
  it('retour après la date de l\'atelier étend la fin', () => {
    const p = periodePretMateriel({ date: '2026-11-20', date_retour_materiel: '2026-11-24' });
    assert.equal(p.fin, '2026-11-24');
  });
  it('prélèvement et retour combinés', () => {
    const p = periodePretMateriel({ date: '2026-11-20', date_prelevement_materiel: '2026-11-17', date_retour_materiel: '2026-11-24' });
    assert.deepEqual(p, { debut: '2026-11-17', fin: '2026-11-24' });
  });
});

// ── estWeekend / veilleOuvree / lendemainOuvre ────────────────────────────────
describe('estWeekend', () => {
  it('samedi → true',   () => assert.equal(estWeekend('2026-09-19'), true));
  it('dimanche → true', () => assert.equal(estWeekend('2026-09-20'), true));
  it('lundi → false',   () => assert.equal(estWeekend('2026-09-21'), false));
  it('vendredi → false',() => assert.equal(estWeekend('2026-09-25'), false));
});

describe('veilleOuvree', () => {
  it('lundi → vendredi précédent (saute samedi/dimanche)', () => {
    assert.equal(veilleOuvree('2026-09-21'), '2026-09-18');
  });
  it('mardi à vendredi → simplement la veille (jour ouvré)', () => {
    assert.equal(veilleOuvree('2026-09-23'), '2026-09-22'); // mercredi → mardi
  });
  it('samedi → vendredi (le jour même, pas -2)', () => {
    assert.equal(veilleOuvree('2026-09-19'), '2026-09-18');
  });
});

describe('lendemainOuvre', () => {
  it('vendredi → lundi suivant (saute samedi/dimanche)', () => {
    assert.equal(lendemainOuvre('2026-09-25'), '2026-09-28');
  });
  it('lundi à jeudi → simplement le lendemain (jour ouvré)', () => {
    assert.equal(lendemainOuvre('2026-09-23'), '2026-09-24'); // mercredi → jeudi
  });
  it('dimanche → lundi (le jour même, pas +2)', () => {
    assert.equal(lendemainOuvre('2026-09-20'), '2026-09-21');
  });
});

// ── getPretsMateriel ─────────────────────────────────────────────────────────
describe('getPretsMateriel', () => {
  it('liste un prêt avec sa période complète', () => {
    const entries = [
      { _id: 'a1', statut: 'Planifié', date: '2026-11-20', date_prelevement_materiel: '2026-11-17', date_retour_materiel: '2026-11-24', conseiller: 'Alice', commune: 'FUMEL', lieu: 'MFR', thematique: 'Bureautique', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    const prets = getPretsMateriel(entries);
    assert.equal(prets.length, 1);
    assert.deepEqual(prets[0], { _id: 'a1', conseiller: 'Alice', qte: 6, commune: 'FUMEL', lieu: 'MFR', thematique: 'Bureautique', dateAtelier: '2026-11-20', debut: '2026-11-17', fin: '2026-11-24' });
  });
  it('ignore les ateliers Annulés, sans Classe mobile ou sans quantité', () => {
    const entries = [
      { statut: 'Annulé', date: '2026-11-01', conseiller: 'A', materiel: ['Classe mobile'], nb_ordinateurs: 4 },
      { statut: 'Planifié', date: '2026-11-01', conseiller: 'B', materiel: ['Tablette'], nb_ordinateurs: 4 },
      { statut: 'Planifié', date: '2026-11-01', conseiller: 'C', materiel: ['Classe mobile'], nb_ordinateurs: 0 },
    ];
    assert.deepEqual(getPretsMateriel(entries), []);
  });
  it('trie par date de début (prélèvement inclus)', () => {
    const entries = [
      { _id: 'x', statut: 'Planifié', date: '2026-11-20', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 2 },
      { _id: 'y', statut: 'Planifié', date: '2026-11-15', date_prelevement_materiel: '2026-11-10', conseiller: 'Bob', materiel: ['Classe mobile'], nb_ordinateurs: 2 },
    ];
    const prets = getPretsMateriel(entries);
    assert.deepEqual(prets.map(p => p._id), ['y', 'x']);
  });
  it('tableau vide → []', () => {
    assert.deepEqual(getPretsMateriel([]), []);
  });
});

// ── totauxParJourMateriel ─────────────────────────────────────────────────────
describe('totauxParJourMateriel', () => {
  it('cumule les prêts de conseillers différents qui couvrent chaque jour', () => {
    const prets = [
      { conseiller: 'Alice', qte: 6, debut: '2026-11-17', fin: '2026-11-20' },
      { conseiller: 'Bob',   qte: 3, debut: '2026-11-19', fin: '2026-11-22' },
    ];
    const totaux = totauxParJourMateriel(prets, ['2026-11-17', '2026-11-19', '2026-11-21']);
    assert.deepEqual(totaux, { '2026-11-17': 6, '2026-11-19': 9, '2026-11-21': 3 });
  });
  it('ne double-compte pas le même conseiller sur deux prêts qui se chevauchent (ateliers dos-à-dos)', () => {
    const prets = [
      { conseiller: 'Michel Aswad', qte: 6, debut: '2026-09-22', fin: '2026-09-29' },
      { conseiller: 'Michel Aswad', qte: 6, debut: '2026-09-29', fin: '2026-10-06' },
    ];
    assert.deepEqual(totauxParJourMateriel(prets, ['2026-09-29']), { '2026-09-29': 6 });
  });
  it('jour hors de toute période → 0', () => {
    const prets = [{ qte: 5, debut: '2026-11-01', fin: '2026-11-02' }];
    assert.deepEqual(totauxParJourMateriel(prets, ['2026-11-10']), { '2026-11-10': 0 });
  });
  it('aucun prêt → tous les jours à 0', () => {
    assert.deepEqual(totauxParJourMateriel([], ['2026-11-01', '2026-11-02']), { '2026-11-01': 0, '2026-11-02': 0 });
  });
});

// ── estConflitPasse ─────────────────────────────────────────────────────────
describe('estConflitPasse', () => {
  it('un conflit Classe mobile (sans dateFin) avant aujourd\'hui est passé', () => {
    assert.equal(estConflitPasse({ date: '2026-09-01' }, '2026-09-17'), true);
  });
  it('un conflit dont la date est aujourd\'hui n\'est pas passé', () => {
    assert.equal(estConflitPasse({ date: '2026-09-17' }, '2026-09-17'), false);
  });
  it('un conflit dont la date est dans le futur n\'est pas passé', () => {
    assert.equal(estConflitPasse({ date: '2026-10-01' }, '2026-09-17'), false);
  });
  it('un bloc stock ordinateurs (dateFin) : utilise dateFin, pas date', () => {
    assert.equal(estConflitPasse({ date: '2026-09-01', dateFin: '2026-09-20' }, '2026-09-17'), false);
  });
  it('un bloc stock ordinateurs entièrement passé (dateFin < today)', () => {
    assert.equal(estConflitPasse({ date: '2026-08-01', dateFin: '2026-08-05' }, '2026-09-17'), true);
  });
});
