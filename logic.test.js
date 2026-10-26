const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  findMobileClassConflicts,
  filterMaterielsVisibles,
  totalJourParConseiller, periodePretMateriel, findOrdinateursConflicts,
  getPretsMateriel, totauxParJourMateriel, estConflitPasse,
  demiJourneeAtelier, totauxParDemiJourneeMateriel, occupeCreneauMateriel,
  estWeekend, veilleOuvree, lendemainOuvre,
} = require('./logic.js');
const { presentsSuperieursInscrits } = require('./utils.js');

describe('Analyse : comparaison annuelle', () => {
  const { comparaisonAnnuelle } = require('./logic.js');
  it('compare les mêmes dates passées et ramène le 29 février au 28 de N−1', () => {
    const entries = [
      { date: '2024-02-29', statut: 'Réalisé' }, { date: '2023-02-28', statut: 'Réalisé' },
      { date: '2024-03-01', statut: 'Réalisé' }, { date: '2023-03-01', statut: 'Réalisé' },
      { date: '2024-02-30', statut: 'Réalisé' }, { date: '2023-02-29', statut: 'Réalisé' },
      { date: '2024-02-27', statut: 'Annulé' }
    ];
    const options = { year: 2024, today: '2024-03-01', loadedYears: [2023, 2024] };
    const cmp = comparaisonAnnuelle(entries, options);
    assert.equal(cmp.status, 'ready');
    assert.equal(cmp.current.to, '2024-02-29');
    assert.equal(cmp.previous.to, '2023-02-28');
    assert.deepEqual(cmp.current.monthly, [0, 1, ...Array(10).fill(null)]);
    assert.deepEqual(cmp.previous.monthly, [0, 1, ...Array(10).fill(null)]);
    assert.equal(cmp.current.total, 1);
    assert.equal(cmp.previous.total, 1);
    assert.equal(cmp.current.records, 3); // date du jour et Annulé : historique, pas activité réalisée passée
    const leapDay = comparaisonAnnuelle(entries, { ...options, from: '2024-02-29', to: '2024-02-29' });
    assert.equal(leapDay.previous.from, '2023-02-28');
    assert.equal(leapDay.previous.to, '2023-02-28');
    assert.equal(leapDay.previous.total, 1);
  });
  it('distingue année non chargée, année vide et zéro connu dans la période filtrée', () => {
    const entries = [{ date: '2023-04-01', statut: 'Planifié' }, { date: '2022-04-01', statut: 'Annulé' }];
    const options = { year: 2023, from: '2023-03-10', to: '2023-03-20', today: '2026-10-25', loadedYears: ['2022', '2023'] };
    const knownZero = comparaisonAnnuelle(entries, options);
    assert.equal(knownZero.status, 'ready');
    assert.equal(knownZero.previous.hasData, true);
    assert.deepEqual(knownZero.previous.monthly, [null, null, 0, ...Array(9).fill(null)]);
    const unloaded = comparaisonAnnuelle(entries, { ...options, loadedYears: [2023] });
    assert.equal(unloaded.status, 'unloaded');
    assert.equal(unloaded.previous.loaded, false);
    assert.ok(unloaded.previous.monthly.every(v => v === null));
    const empty = comparaisonAnnuelle(entries.slice(0, 1), options);
    assert.equal(empty.status, 'empty');
    assert.equal(empty.previous.hasData, false);
    assert.ok(empty.previous.monthly.every(v => v === null));
    const fullPastYear = comparaisonAnnuelle(entries, { ...options, from: '', to: '' });
    assert.equal(fullPastYear.current.to, '2023-12-31');
    assert.equal(fullPastYear.previous.to, '2022-12-31');
    assert.equal(comparaisonAnnuelle(entries, { ...options, year: 2027, from: '', to: '' }).status, 'outside');
    assert.equal(comparaisonAnnuelle(entries, { ...options, from: '2022-12-01' }).status, 'invalid-range');
    assert.equal(comparaisonAnnuelle(entries, { ...options, from: '2023-02-30' }).status, 'invalid-range');
  });
});

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
      { statut: 'Planifié', date: '2026-10-01', conseiller: 'Alice', materiel: ['Classe mobile'] },
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
      { statut: 'Planifié', date: '2026-10-05', date_prelevement_materiel: '2026-10-05', date_retour_materiel: '2026-10-05', conseiller: 'Alice', materiel: ['Classe mobile'], nb_ordinateurs: 6 },
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
    assert.deepEqual(prets[0], { _id: 'a1', conseiller: 'Alice', qte: 6, commune: 'FUMEL', lieu: 'MFR', thematique: 'Bureautique', dateAtelier: '2026-11-20', debut: '2026-11-17', fin: '2026-11-24', demi: null, demis: ['AM', 'PM'], creneau: null });
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
      pret('a', 'Bruno', 6, '2026-09-25', '2026-09-24', '2026-09-29'),
      pret('b', 'Michel',   5, '2026-09-30', '2026-09-29', '2026-10-02'),
    ];
    const totaux = totauxParJourMateriel(getPretsMateriel(entries), ['2026-09-28', '2026-09-29', '2026-09-30']);
    assert.equal(totaux['2026-09-28'], 6);  // Bruno seul
    assert.equal(totaux['2026-09-29'], 5);  // Bruno a rendu le matin, Michel prélève
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

describe('presentsSuperieursInscrits', () => {
  it('signale plus de présents que d\'inscrits, en nombres et non en texte ("9" > "10")', () => {
    assert.equal(presentsSuperieursInscrits({ presents: '11', inscrits: '10' }), true);
    assert.equal(presentsSuperieursInscrits({ presents: 9, inscrits: 10 }), false);
    assert.equal(presentsSuperieursInscrits({ presents: '9', inscrits: '10' }), false);
    assert.equal(presentsSuperieursInscrits({ presents: '10', inscrits: '10' }), false);
  });
  it('ignore les champs vides ou non numériques', () => {
    assert.equal(presentsSuperieursInscrits({ presents: '5', inscrits: '' }), false);
    assert.equal(presentsSuperieursInscrits({ presents: '', inscrits: '3' }), false);
    assert.equal(presentsSuperieursInscrits({ presents: '5', inscrits: 'n/c' }), false);
    assert.equal(presentsSuperieursInscrits({}), false);
  });
});

// ── Bilan trimestriel (04/10/2026) ───────────────────────────────────────────
const {bornesTrimestre, trimestreCourant, trimestrePrecedent, bilanTrimestriel} = require('./logic.js');
describe('bilanTrimestriel — décisions AG-032 (26/10/2026)', () => {
  const at = (id, o) => ({_id: id, statut: 'Réalisé', date: '2026-10-15', thematique: 'Courriel', commune: 'Agen', inscrits: '5', presents: '3', duree: 90, ...o});
  it('présents vides hors du total, couverture comptée ; durée vide = 1 h 30', () => {
    const b = bilanTrimestriel([at('a'), at('b', {presents: '', duree: ''})], '2026-10-01', '2026-12-31', [], '2026-12-31');
    assert.equal(b.activite.presents, 3);
    assert.equal(b.activite.presentsSaisis, 1);
    assert.equal(b.activite.heures, 3);
    assert.equal(b.activite.dureesParDefaut, 1);
  });
  it('communes normalisées ; thématique « constructor » comptée sans planter', () => {
    const b = bilanTrimestriel([at('a', {commune: 'AGEN (47000)'}), at('b', {commune: 'Agen'}), at('c', {thematique: 'constructor'})],
      '2026-10-01', '2026-12-31', [{atelier_id: 'c', attentes: 4}], '2026-12-31');
    assert.equal(b.activite.communes, 1);
    assert.deepEqual(b.parTheme.map(t => [t.theme, t.ateliers, t.avis]), [['Courriel', 2, 0], ['constructor', 1, 1]]);
  });
  it('non-réponses aux questions d\'avis comptées à part', () => {
    const av = [{atelier_id: 'a', autonomie: 'Oui'}, {atelier_id: 'a', autonomie: null}, {atelier_id: 'a'}];
    const b = bilanTrimestriel([at('a')], '2026-10-01', '2026-12-31', av, '2026-12-31');
    assert.deepEqual(b.avis.autonomie, {Oui: 1});
    assert.equal(b.avis.sansReponse.autonomie, 2);
  });
});
describe('trimestreCourant et Planifié passés (26/10/2026)', () => {
  it('trimestre de la date du jour', () => {
    assert.deepEqual(trimestreCourant('2026-10-26'), {annee: 2026, t: 4});
    assert.deepEqual(trimestreCourant('2027-01-01'), {annee: 2027, t: 1});
  });
  it('seuls les « Planifié » de date passée sont à mettre à jour', () => {
    const e = [{_id: 'a', statut: 'Planifié', date: '2026-10-20'}, {_id: 'b', statut: 'Planifié', date: '2026-11-20'}];
    const b = bilanTrimestriel(e, '2026-10-01', '2026-12-31', [], '2026-10-26');
    assert.equal(b.activite.statuts['Planifié'], 2);
    assert.equal(b.activite.planifiesPasses, 1);
  });
});
describe('bilan trimestriel', () => {
  it('bornes et trimestre précédent, y compris le passage d\'année', () => {
    assert.deepEqual(bornesTrimestre(2026, 1), ['2026-01-01', '2026-03-31']);
    assert.deepEqual(bornesTrimestre(2028, 1), ['2028-01-01', '2028-03-31']);
    assert.deepEqual(bornesTrimestre(2026, 3), ['2026-07-01', '2026-09-30']);
    assert.deepEqual(trimestrePrecedent('2026-10-04'), {annee: 2026, t: 3});
    assert.deepEqual(trimestrePrecedent('2027-02-15'), {annee: 2026, t: 4});
  });
  it('fiches et avis comptés sur les seuls ateliers réalisés de la période', () => {
    const E = [
      {_id: 'a', date: '2026-07-02', statut: 'Réalisé', thematique: 'IA', inscrits: 8, presents: 6, duree: 90, commune: 'AGEN',
       fiche_bilan: {objectif: 'Oui', difficultes: ['Connexion', 'Autre'], difficultes_autre: 'Panne', supports: ['Vidéo']}},
      {_id: 'b', date: '2026-08-10', statut: 'Réalisé', thematique: 'IA', inscrits: 4, presents: '', duree: 120, commune: 'AGEN', fiche_bilan: ''},
      {_id: 'c', date: '2026-09-01', statut: 'Annulé', thematique: 'IA', inscrits: 5, fiche_bilan: {objectif: 'Non'}},
      {_id: 'd', date: '2026-10-01', statut: 'Réalisé', thematique: 'IA', presents: 9, fiche_bilan: {objectif: 'Non'}},
    ];
    const avis = [{atelier_id: 'a', attentes: 5, aise: 'Oui'}, {atelier_id: 'a', attentes: 4, aise: 'Oui'},
                  {atelier_id: 'c', attentes: 1}, {atelier_id: 'd', attentes: 1}];
    const b = bilanTrimestriel(E, '2026-07-01', '2026-09-30', avis);
    assert.equal(b.activite.realises, 2);
    assert.deepEqual(b.activite.statuts, {'Réalisé': 2, 'Annulé': 1});
    assert.equal(b.activite.presents, 6);
    assert.equal(b.activite.tauxPresence, 75);   // b : présents non saisis, hors taux
    assert.equal(b.activite.heures, 3.5);
    assert.equal(b.fiches.remplies, 1);
    assert.deepEqual(b.fiches.objectif, {Oui: 1});
    assert.deepEqual(b.fiches.difficultes, {Connexion: 1, Autre: 1});
    assert.deepEqual(b.fiches.autres, ['Panne']);
    assert.equal(b.avis.n, 2);
    assert.equal(b.avis.attentes, 4.5);
    assert.deepEqual(b.avis.aise, {Oui: 2});
    assert.deepEqual(b.parTheme, [{theme: 'IA', ateliers: 2, presents: 6, avis: 2, attentes: 4.5}]);
  });
});

// ── Conflits à l'heure près (AG-022, 04/10/2026) ─────────────────────────────
// Ordinateurs : créneau réel + 30 min de marge ; Classe mobile : demi-journées
// touchées par l'horaire. Le cas de 11:00–12:30 contre 12:00 passait avant.
describe('conflits de matériel à l\'heure près', () => {
  const H = (cons, qte, horaire, duree) => ({
    _id: cons + horaire, statut: 'Planifié', conseiller: cons, commune: 'AGEN', date: '2026-10-05',
    materiel: ['Classe mobile'], nb_ordinateurs: qte, horaire, duree,
  });
  it('ordinateurs : un atelier qui déborde sur midi chevauche celui de 12:00', () => {
    const c = findOrdinateursConflicts([H('Alice', 6, '11:00', 90), H('Bruno', 6, '12:00', 90)]);
    assert.equal(c.length, 1);
    assert.equal(c[0].total, 12);
    assert.deepEqual([c[0].de, c[0].a], [720, 780]);   // de 12:00 à 13:00 (12:30 + marge)
  });
  it('ordinateurs : deux ateliers successifs du matin ne se gênent plus, la marge de 30 min compte', () => {
    assert.deepEqual(findOrdinateursConflicts([H('Alice', 6, '09:00', 60), H('Bruno', 6, '10:30', 60)]), []);
    assert.equal(findOrdinateursConflicts([H('Alice', 6, '09:00', 60), H('Bruno', 6, '10:15', 60)]).length, 1);
  });
  it('Classe mobile : la demi-journée reste l\'unité, toutes celles que l\'horaire touche', () => {
    assert.equal(findMobileClassConflicts([H('Alice', 6, '11:00', 90), H('Bruno', 6, '14:00', 60)]).length, 1);
    assert.equal(findMobileClassConflicts([H('Alice', 6, '09:00', 60), H('Bruno', 6, '10:30', 60)]).length, 1);
    assert.deepEqual(findMobileClassConflicts([H('Alice', 6, '09:00', 60), H('Bruno', 6, '14:00', 60)]), []);
  });
});

// ── Créneaux libres (11/10/2026) ─────────────────────────────────────────────
const {creneauxLibres} = require('./logic.js');
describe('creneauxLibres', () => {
  const at = (date, horaire, extra) => ({date, horaire, conseiller:'Alice', statut:'Planifié', ...extra});
  const base = {conseiller:'Alice', du:'2026-10-12', au:'2026-10-18', jours:[1,4], moments:['AM','PM']};
  it('seuls les jours choisis, demi-journées occupées retirées', () => {
    // lundi 12 matin occupé ; jeudi 15 libre ; mardi 13 non demandé
    const r = creneauxLibres([at('2026-10-12','09:30'), at('2026-10-13','14:00')], base);
    assert.deepEqual(r, [{date:'2026-10-12',demi:'PM'},{date:'2026-10-15',demi:'AM'},{date:'2026-10-15',demi:'PM'}]);
  });
  it('annulé ou reporté libère ; co-animation occupe ; sans horaire occupe la journée ; autre conseiller ignoré', () => {
    const r = creneauxLibres([
      at('2026-10-12','09:00',{statut:'Annulé'}),
      at('2026-10-12','14:00',{conseiller:'Bruno', co_animateur:'Alice'}),
      at('2026-10-15','',{ampm:''}),
      at('2026-10-15','09:00',{conseiller:'Bruno'}),
    ], base);
    assert.deepEqual(r, [{date:'2026-10-12',demi:'AM'}]);
  });
  it('demi-journées bloquées (Outlook) retirées', () => {
    const r = creneauxLibres([], {...base, bloques:['2026-10-12|AM','2026-10-15|PM']});
    assert.deepEqual(r, [{date:'2026-10-12',demi:'PM'},{date:'2026-10-15',demi:'AM'}]);
  });
  it('férié exclu, matin seulement', () => {
    const r = creneauxLibres([], {...base, du:'2026-11-09', au:'2026-11-12', jours:[1,3], moments:['AM'], estFerie: d => d === '2026-11-11' ? 'Armistice' : ''});
    assert.deepEqual(r, [{date:'2026-11-09',demi:'AM'}]);
  });
});

// Ce qui occupe une demi-journée (20/10/2026) : le partenaire, sinon « Outlook ».
const {creneauxPris} = require('./logic.js');
describe('creneauxPris', () => {
  it('orienteur de l\'atelier, Outlook seul, annulé ignoré, deux ateliers joints', () => {
    const at = (date, horaire, extra) => ({date, horaire, conseiller:'Alice', statut:'Planifié', ...extra});
    const r = creneauxPris([
      at('2026-10-22','14:00',{orienteur:'La Régie'}),
      at('2026-10-27','09:00',{orienteur:'CMS', statut:'Annulé'}),
      at('2026-10-29','09:00',{orienteur:'', lieu:'Médiathèque'}),
      at('2026-10-29','10:30',{orienteur:'CCAS'}),
    ], {conseiller:'Alice', du:'2026-10-20', au:'2026-11-16', bloques:['2026-10-27|AM']});
    assert.deepEqual(r, {'2026-10-22|PM':'La Régie', '2026-10-27|AM':'Outlook', '2026-10-29|AM':'Médiathèque + CCAS'});
  });
});

// ── Contrôles de saisie (12/10/2026) ─────────────────────────────────────────
const {conflitsConseiller, demiSaisie} = require('./logic.js');
describe('conflitsConseiller', () => {
  const e = (id, date, horaire, extra) => ({_id:id, date, horaire, conseiller:'Alice', statut:'Planifié', ...extra});
  const base = [e('a','2026-10-14','09:30'), e('b','2026-10-14','14:00',{statut:'Annulé'}), e('c','2026-10-14','15:00',{conseiller:'Bruno', co_animateur:'Alice'}), e('d','2026-10-15','',{ampm:''})];
  it('même matinée : conflit ; annulé ignoré ; co-animation compte', () => {
    assert.deepEqual(conflitsConseiller(base, {_id:'n', date:'2026-10-14', horaire:'10:30', conseiller:'Alice'}).map(x=>x._id), ['a']);
    assert.deepEqual(conflitsConseiller(base, {_id:'n', date:'2026-10-14', horaire:'14:30', conseiller:'Alice'}).map(x=>x._id), ['c']);
  });
  it('l\'atelier lui-même exclu ; journée sans horaire bloque ; autre conseiller libre', () => {
    assert.deepEqual(conflitsConseiller(base, {_id:'a', date:'2026-10-14', horaire:'09:30', conseiller:'Alice'}), []);
    assert.deepEqual(conflitsConseiller(base, {_id:'n', date:'2026-10-15', horaire:'16:00', conseiller:'Alice'}).map(x=>x._id), ['d']);
    assert.deepEqual(conflitsConseiller(base, {_id:'n', date:'2026-10-14', horaire:'09:00', conseiller:'Chloé'}), []);
  });
  it('demiSaisie : l\'heure tapée prime sur l\'AM/PM enregistré', () => {
    assert.equal(demiSaisie({horaire:'10:30', ampm:'PM'}), 'AM');
    assert.equal(demiSaisie({horaire:'', ampm:'PM'}), 'PM');
  });
});

// ── Cycle : la 1re séance donne le ton (13/10/2026) ──────────────────────────
global.ampmDepuisHoraire = require('./utils.js').ampmDepuisHoraire;
const {propagerPremiereLigne, basculerDemiLigne} = require('./logic.js');
describe('propagerPremiereLigne', () => {
  const r = (id, extra) => ({id, date:'', horaire:'', ampm:'', duree:120, ...extra});
  it('horaire et durée de la 1re ligne recopiés ; une ligne modifiée à la main garde la sienne', () => {
    let rows = [r('a'), r('b'), r('c', {horaire:'14:00', ampm:'PM'})];
    rows = propagerPremiereLigne(rows, 'a', 'horaire', '09:30');
    assert.deepEqual(rows.map(x => x.horaire), ['09:30', '09:30', '14:00']);
    assert.equal(rows[1].ampm, 'AM');
    rows = propagerPremiereLigne(rows, 'a', 'horaire', '10:00');
    assert.deepEqual(rows.map(x => x.horaire), ['10:00', '10:00', '14:00']);
    rows = propagerPremiereLigne(rows, 'a', 'duree', 90);
    assert.deepEqual(rows.map(x => x.duree), [90, 90, 90]);
  });
  it('rien ne part d\'une autre ligne ; pas d\'horaire du matin sur un créneau d\'après-midi', () => {
    const rows = [r('a'), r('b'), r('c', {creneau:'PM'})];
    assert.deepEqual(propagerPremiereLigne(rows, 'b', 'horaire', '09:30').map(x => x.horaire), ['', '09:30', '']);
    assert.deepEqual(propagerPremiereLigne(rows, 'a', 'horaire', '09:30').map(x => x.horaire), ['09:30', '09:30', '']);
  });
});
describe('cycle alterné matin / après-midi', () => {
  const r = (id, extra) => ({id, date:'', horaire:'', ampm:'', duree:120, ...extra});
  it('1re ligne du matin pour les matins, 1re de l\'après-midi pour les après-midis', () => {
    let rows = [r('a'), r('b', {creneau:'PM'}), r('c'), r('d', {creneau:'PM'})];
    rows = propagerPremiereLigne(rows, 'a', 'horaire', '09:30');
    assert.deepEqual(rows.map(x => x.horaire), ['09:30', '', '09:30', '']);
    rows = propagerPremiereLigne(rows, 'b', 'horaire', '14:00');
    assert.deepEqual(rows.map(x => x.horaire), ['09:30', '14:00', '09:30', '14:00']);
    rows = propagerPremiereLigne(rows, 'b', 'horaire', '13:30');
    assert.deepEqual(rows.map(x => x.horaire), ['09:30', '13:30', '09:30', '13:30']);
  });
  it('bouton 🌙 : la ligne prend l\'horaire des après-midis ; ☀️ celui des matins', () => {
    let rows = [r('a', {horaire:'09:30', ampm:'AM'}), r('b', {horaire:'14:00', ampm:'PM', creneau:'PM'}), r('c', {horaire:'09:30', ampm:'AM'})];
    rows = basculerDemiLigne(rows, 'c', 'PM');
    assert.equal(rows[2].horaire, '14:00'); assert.equal(rows[2].creneau, 'PM');
    rows = basculerDemiLigne(rows, 'c', 'AM');
    assert.equal(rows[2].horaire, '09:30');
    assert.equal(basculerDemiLigne([r('a'), r('b')], 'b', 'PM')[1].horaire, '', 'aucun après-midi connu : vide');
  });
});

// ── Un même chiffre, une même population (20/10/2026) ─────────────────────────
// Le « taux de présence » est calculé à trois endroits : kpiHistorique()
// (utils.js, onglet Historique), bilanTrimestriel() (logic.js, bilan de la
// superviseure) et bilan_chiffres() (api/lib/bilan.php, mail mensuel). Ces
// tests ne les font pas passer pour identiques : ils fixent ce qui doit
// concorder et rendent visible l'écart qui reste. Ajoutés après l'audit Codex
// de GDINV2 du 20/10/2026 (251 tests verts, 14 défauts de calcul) —
// MD-LIB `chiffres-diffuses.md`, familles B et E.
describe('même population : kpiHistorique et bilanTrimestriel', () => {
  const { kpiHistorique } = require('./utils.js');
  const atelier = (id, date, statut, inscrits, presents) => ({
    _id: id, date, statut, thematique: 'IA', inscrits, presents, duree: 60, commune: 'AGEN', fiche_bilan: '',
  });
  const PERIODE = ['2026-07-01', '2026-09-30'];

  it('ateliers réalisés, inscrits et présents concordent quand tout est saisi', () => {
    const E = [
      atelier('a', '2026-07-02', 'Réalisé', 8, 6), atelier('b', '2026-08-10', 'Réalisé', 4, 4),
      atelier('c', '2026-09-01', 'Annulé', 5, null), atelier('d', '2026-10-01', 'Réalisé', 9, 9),   // hors période
    ];
    const dansPeriode = E.filter(e => e.date >= PERIODE[0] && e.date <= PERIODE[1]);
    const k = kpiHistorique(dansPeriode);
    const b = bilanTrimestriel(E, PERIODE[0], PERIODE[1], []);
    assert.equal(b.activite.realises, k.realises);
    assert.equal(b.activite.presents, k.presents);
    assert.equal(b.activite.tauxPresence, k.tx);
  });

  it('les statuts du bilan retrouvent le total de l\'Historique', () => {
    const E = [atelier('a', '2026-07-02', 'Réalisé', 8, 6), atelier('c', '2026-09-01', 'Annulé', 5, null), atelier('p', '2026-09-15', 'Planifié', 4, null)];
    const k = kpiHistorique(E);
    const b = bilanTrimestriel(E, PERIODE[0], PERIODE[1], []);
    assert.equal(Object.values(b.activite.statuts).reduce((x, y) => x + y, 0), k.total);
  });

  // Règle arrêtée par l'utilisateur le 20/10/2026 : le taux porte sur les seuls
  // ateliers réalisés dont les présents sont saisis (75 %, pas 50 %). Le même
  // nombre sort de l'Historique, du bilan trimestriel et du mail mensuel
  // (api/lib/bilan.php, testé sur MySQL par api-tests/bilan.test.php).
  it('présents non saisis : 75 % partout, jamais 50 %', () => {
    const E = [atelier('a', '2026-07-02', 'Réalisé', 8, 6), atelier('b', '2026-08-10', 'Réalisé', 4, '')];
    assert.equal(kpiHistorique(E).tx, 75);
    assert.equal(bilanTrimestriel(E, PERIODE[0], PERIODE[1], []).activite.tauxPresence, 75);
  });
  it('0 présent saisi compte ; présents absents (null, vide) sortent du taux', () => {
    const E = [atelier('a', '2026-07-02', 'Réalisé', 10, 0), atelier('b', '2026-08-10', 'Réalisé', 10, null), atelier('c', '2026-08-11', 'Réalisé', 10, undefined)];
    assert.equal(kpiHistorique(E).tx, 0);
    assert.equal(bilanTrimestriel(E, PERIODE[0], PERIODE[1], []).activite.tauxPresence, 0);
  });
  it('un atelier sans inscrits n\'entre pas dans le taux', () => {
    const E = [atelier('a', '2026-07-02', 'Réalisé', 0, 5), atelier('b', '2026-08-10', 'Réalisé', 10, 5)];
    assert.equal(kpiHistorique(E).tx, 50);
    assert.equal(bilanTrimestriel(E, PERIODE[0], PERIODE[1], []).activite.tauxPresence, 50);
  });
  it('seuls les ateliers réalisés comptent', () => {
    const E = [atelier('a', '2026-07-02', 'Annulé', 10, 0), atelier('b', '2026-08-10', 'Réalisé', 10, 10)];
    assert.equal(kpiHistorique(E).tx, 100);
  });
});
