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
  demiJourneeAtelier, totauxParDemiJourneeMateriel, occupeCreneauMateriel,
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

  it('nb_ordinateurs manquant ou à 0 → 1 supposé (pas assez pour dépasser le stock par défaut à lui seul)', () => {
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'] },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 0 },
    ];
    assert.equal(findOrdinateursConflicts(entries).length, 0);
  });

  it('Classe mobile cochée sans quantité renseignée → comptée quand même (qte 1), peut dépasser un petit stock', () => {
    // Entrées historiques (antérieures au champ obligatoire) ou import : ne
    // doivent pas disparaître silencieusement du calcul de conflits — même
    // principe que ATELIERS_NEWGEN (confirmé en prod le 18/09/2026).
    const entries = [
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'] },
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 0 },
    ];
    assert.equal(findOrdinateursConflicts(entries, 1).length, 1);
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
    // Le 02/10 est un jour de retour, et le retour a lieu le matin : il ne
    // réserve plus le stock. Le bloc de conflit s'arrête donc au 01/10.
    assert.equal(conflits[0].dateFin, '2026-10-01');
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

  it('sans dates renseignées, deux ateliers à des jours différents ne se chevauchent plus', () => {
    // Alice vendredi 25/09, Bob lundi 28/09, aucune date saisie : chacun
    // prend et rend le jour même (22/09/2026). L'ancien repli veille/lendemain
    // ouvrés les faisait se chevaucher sur le week-end et fabriquait un
    // conflit que personne n'avait sur le terrain.
    const entries = [
      { statut: 'Planifié', date: '2026-09-25', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      { statut: 'Planifié', date: '2026-09-28', conseiller: 'Bob',   materiel: ['Classe mobile'], nb_ordinateurs: 6 },
    ];
    assert.deepEqual(findOrdinateursConflicts(entries), []);
  });
});

// ── periodePretMateriel ─────────────────────────────────────────────────────
describe('periodePretMateriel', () => {
  it('sans prélèvement ni retour, le prêt tient sur la seule journée de l\'atelier', () => {
    // Confirmé par l'utilisateur le 22/09/2026 : sans date saisie, le
    // matériel est pris et rendu le jour même. Remplace le repli
    // veille/lendemain ouvrés du 19/09, qui étendait chaque atelier à trois
    // jours et fabriquait des chevauchements inexistants.
    assert.deepEqual(periodePretMateriel({ date: '2026-09-21' }), { debut: '2026-09-21', fin: '2026-09-21' });
    // Un vendredi : plus aucun saut de week-end à prévoir.
    assert.deepEqual(periodePretMateriel({ date: '2026-11-20' }), { debut: '2026-11-20', fin: '2026-11-20' });
  });
  it('prélèvement avant la date de l\'atelier étend le début ; le retour non renseigné reste la date', () => {
    const p = periodePretMateriel({ date: '2026-11-20', date_prelevement_materiel: '2026-11-17' });
    assert.equal(p.debut, '2026-11-17');
    assert.equal(p.fin, '2026-11-20');
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
    assert.deepEqual(prets[0], { _id: 'a1', conseiller: 'Alice', qte: 6, commune: 'FUMEL', lieu: 'MFR', thematique: 'Bureautique', dateAtelier: '2026-11-20', debut: '2026-11-17', fin: '2026-11-24', demi: null });
  });
  it('ignore les ateliers Annulés ou sans Classe mobile', () => {
    const entries = [
      { statut: 'Annulé', date: '2026-11-01', conseiller: 'A', materiel: ['Classe mobile'], nb_ordinateurs: 4 },
      { statut: 'Planifié', date: '2026-11-01', conseiller: 'B', materiel: ['Tablette'], nb_ordinateurs: 4 },
    ];
    assert.deepEqual(getPretsMateriel(entries), []);
  });

  it('Classe mobile cochée sans quantité renseignée → figure quand même dans la liste (qte 1 par défaut)', () => {
    const entries = [
      { _id: 'c1', statut: 'Planifié', date: '2026-11-01', conseiller: 'C', materiel: ['Classe mobile'], nb_ordinateurs: 0 },
    ];
    const prets = getPretsMateriel(entries);
    assert.equal(prets.length, 1);
    assert.equal(prets[0].qte, 1);
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

// ── Passage de relais : retour et prélèvement le même jour ───────────────────
// Défaut trouvé le 21/09/2026 en regardant la Frise du parc, pas par un test :
// le jour du retour, le stock restait réservé alors que le retour a lieu le
// matin et que les machines repartent le jour même chez un autre conseiller.
// Avec un stock de 10, un retour de 6 et un prélèvement de 5 le même jour
// affichaient 11 → alerte rouge sur un enchaînement pourtant parfaitement
// réalisable.
describe('occupation du stock le jour du retour', () => {
  const pret = (id, conseiller, qte, date, prel, ret) => ({
    _id: id, statut: 'Planifié', conseiller, commune: 'AGEN',
    materiel: ['Classe mobile'], nb_ordinateurs: qte,
    date, date_prelevement_materiel: prel, date_retour_materiel: ret,
  });

  it('un retour et un prélèvement le même jour ne se cumulent pas (le matériel change de mains)', () => {
    const entries = [
      pret('a', 'Corentin', 6, '2026-09-25', '2026-09-24', '2026-09-29'),
      pret('b', 'Michel',   5, '2026-09-30', '2026-09-29', '2026-10-02'),
    ];
    const totaux = totauxParJourMateriel(getPretsMateriel(entries), ['2026-09-28', '2026-09-29', '2026-09-30']);
    assert.equal(totaux['2026-09-28'], 6);  // Corentin seul
    assert.equal(totaux['2026-09-29'], 5);  // Corentin a rendu le matin, Michel prélève
    assert.equal(totaux['2026-09-30'], 5);
    assert.deepEqual(findOrdinateursConflicts(entries), []);
  });

  it('un prêt d\'une seule journée occupe bien ce jour-là (il ne disparaît pas du cumul)', () => {
    const entries = [pret('a', 'Eva', 12, '2026-09-29', '2026-09-29', '2026-09-29')];
    const totaux = totauxParJourMateriel(getPretsMateriel(entries), ['2026-09-29']);
    assert.equal(totaux['2026-09-29'], 12);
    assert.equal(findOrdinateursConflicts(entries).length, 1);
  });
});

// ── Demi-journées (AM/PM) ────────────────────────────────────────────────────
// Confirmé par l'utilisateur le 22/09/2026 : deux ateliers le même jour, l'un
// le matin l'autre l'après-midi, ne se disputent pas le matériel — le premier
// rend à midi. Ces trois cas verrouillent la finesse ET ses deux limites.
describe('occupation à la demi-journée', () => {
  const A = (cons, qte, date, ampm, prel, ret) => ({
    _id: cons, statut: 'Planifié', conseiller: cons, commune: 'AGEN',
    materiel: ['Classe mobile'], nb_ordinateurs: qte, date, ampm,
    date_prelevement_materiel: prel || '', date_retour_materiel: ret || '',
  });

  it('matin et après-midi ne se cumulent pas, deux fois le matin si', () => {
    const separes = [A('Alice', 6, '2026-10-01', 'AM'), A('Bob', 6, '2026-10-01', 'PM')];
    const t = totauxParDemiJourneeMateriel(getPretsMateriel(separes), ['2026-10-01']);
    assert.deepEqual(t['2026-10-01'], { AM: 6, PM: 6 });
    assert.deepEqual(findOrdinateursConflicts(separes), []);
    assert.deepEqual(findMobileClassConflicts(separes), []);

    const memeCreneau = [A('Alice', 6, '2026-10-01', 'AM'), A('Bob', 6, '2026-10-01', 'AM')];
    const c = findOrdinateursConflicts(memeCreneau);
    assert.equal(c.length, 1);
    assert.equal(c[0].total, 12);
    assert.equal(c[0].demi, 'AM');   // le créneau à corriger, pas la journée
  });

  it('dès que le prêt dure plus d\'un jour, la journée entière est réservée', () => {
    // Alice garde le matériel du 30/09 au 02/10 : il ne revient pas à midi,
    // donc l'après-midi de Bob se cumule bien avec son matin.
    const entries = [A('Alice', 6, '2026-10-01', 'AM', '2026-09-30', '2026-10-02'), A('Bob', 6, '2026-10-01', 'PM')];
    const t = totauxParDemiJourneeMateriel(getPretsMateriel(entries), ['2026-10-01']);
    assert.deepEqual(t['2026-10-01'], { AM: 6, PM: 12 });
    assert.equal(findOrdinateursConflicts(entries)[0].demi, 'PM');
  });

  it('ampm absent : repli sur l\'horaire, sinon la journée entière', () => {
    assert.equal(demiJourneeAtelier({ ampm: 'PM' }), 'PM');
    assert.equal(demiJourneeAtelier({ horaire: '09H00' }), 'AM');
    assert.equal(demiJourneeAtelier({ horaire: '14H00' }), 'PM');
    assert.equal(demiJourneeAtelier({}), null);
    // null réserve les deux demi-journées : mieux vaut une alerte de trop
    // qu'un conflit matériel passé sous silence.
    const entries = [
      { _id: 'x', statut: 'Planifié', conseiller: 'Alice', date: '2026-10-01', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
      A('Bob', 6, '2026-10-01', 'PM'),
    ];
    const t = totauxParDemiJourneeMateriel(getPretsMateriel(entries), ['2026-10-01']);
    assert.deepEqual(t['2026-10-01'], { AM: 6, PM: 12 });
  });
});
