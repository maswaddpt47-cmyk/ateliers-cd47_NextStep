const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  stripAccents, trunc,
  normCommune, normalizeCommune,
  normalizeDate, normalizeHoraire, fmtDate, fmtCardDate, todayLocal, addJoursIso,
  normalizeMat, matIncludes,
  escapeICS, foldICSLine, parseHoraireICS, parseDateICS, buildICS,
  resumeLogsTexte,
  suppressionAboutie,
  nouveautesNonVues,
  genererDatesCycle, joursFeries,
  evenementsOutlook, idOutlook,
  anneesListe,
  anneeReference,
  anneeIncluse,
  lsKey, migrerLocalStorage, purgerCacheAteliers,
  comparerHistorique,
  ampmDepuisHoraire, statutSelonDate,
  kpiHistorique,
} = require('./utils.js');

// ── stripAccents ──────────────────────────────────────────────────────────────
describe('stripAccents', () => {
  it('enlève les accents et met en minuscule', () => assert.equal(stripAccents('Éàüî'), 'eaui'));
  it('chaîne vide → chaîne vide',              () => assert.equal(stripAccents(''), ''));
  it('null → ne plante pas',                   () => assert.equal(stripAccents(null), ''));
});

// ── trunc ─────────────────────────────────────────────────────────────────────
describe('trunc', () => {
  it('tronque à n caractères, « … » compris',  () => assert.equal(trunc('abcdef', 4), 'abc…'));
  it('ne tronque pas si assez court',  () => assert.equal(trunc('abc', 10), 'abc'));
  it('null → chaîne vide',             () => assert.equal(trunc(null, 5), ''));
});

// ── normCommune ───────────────────────────────────────────────────────────────
describe('normCommune', () => {
  it('supprime le code postal entre parenthèses', () => assert.equal(normCommune('Agen (47000)'), 'Agen'));
  it('laisse la commune sans code inchangée',     () => assert.equal(normCommune('Agen'), 'Agen'));
  it('null → chaîne vide',                        () => assert.equal(normCommune(null), ''));
});

// ── normalizeCommune ──────────────────────────────────────────────────────────
describe('normalizeCommune', () => {
  it('applique le COMMUNE_MAP',        () => assert.equal(normalizeCommune('VILLENEUVE-SUR-LOT'), 'VILLENEUVE SUR LOT'));
  it('met en majuscules et retire le code « (47) »', () => assert.equal(normalizeCommune('Agen (47)'), 'AGEN'));
  it('null → chaîne vide',             () => assert.equal(normalizeCommune(null), ''));
});

// ── normalizeDate ─────────────────────────────────────────────────────────────
describe('normalizeDate', () => {
  it('yyyy-MM-dd reste inchangé',         () => assert.equal(normalizeDate('2026-06-16'), '2026-06-16'));
  it('ISO datetime → date seule',         () => assert.equal(normalizeDate('2026-06-16T09:00:00'), '2026-06-16'));
  it('dd/MM/yyyy → yyyy-MM-dd',           () => assert.equal(normalizeDate('16/06/2026'), '2026-06-16'));
  it('vide → chaîne vide',               () => assert.equal(normalizeDate(''), ''));
  it('null → chaîne vide',               () => assert.equal(normalizeDate(null), ''));
});

// ── normalizeHoraire ──────────────────────────────────────────────────────────
describe('normalizeHoraire', () => {
  it('HHhmm → HH:mm',                    () => assert.equal(normalizeHoraire('09H30'), '09:30'));
  it('HH:mm:ss → HH:mm',                 () => assert.equal(normalizeHoraire('14:00:00'), '14:00'));
  it('ISO time → HH:mm',                 () => assert.equal(normalizeHoraire('2026-06-16T09:30:00'), '09:30'));
  it('vide → chaîne vide',               () => assert.equal(normalizeHoraire(''), ''));
  it('null → chaîne vide',               () => assert.equal(normalizeHoraire(null), ''));
});

// ── fmtDate ───────────────────────────────────────────────────────────────────
describe('fmtDate', () => {
  it('retourne jour + date lisible',      () => assert.match(fmtDate('2026-07-09'), /^(Dim|Lun|Mar|Mer|Jeu|Ven|Sam) \d{2}\/\d{2}\/\d{4}$/));
  it('null → chaîne vide',               () => assert.equal(fmtDate(null), ''));
  it('nettoie un datetime ISO complet (colonne Date GAS non formatée)', () => {
    assert.equal(fmtDate('2026-10-04T22:00:00.000Z'), 'Dim 04/10/2026');
  });
});

// ── addJoursIso ──────────────────────────────────────────────────────────────
describe('addJoursIso', () => {
  it('ajoute des jours sans franchir de mois', () => assert.equal(addJoursIso('2026-09-17', 3), '2026-09-20'));
  it('franchit correctement une fin de mois',  () => assert.equal(addJoursIso('2026-09-29', 3), '2026-10-02'));
  it('franchit correctement une fin d\'année', () => assert.equal(addJoursIso('2026-12-30', 3), '2027-01-02'));
  it('n=0 retourne la même date',              () => assert.equal(addJoursIso('2026-09-17', 0), '2026-09-17'));
  it('retourne chaîne vide sur entrée vide',   () => assert.equal(addJoursIso('', 3), ''));
});

// ── fmtCardDate ───────────────────────────────────────────────────────────────
describe('fmtCardDate', () => {
  it('retourne {day, month, jour}',       () => {
    const r = fmtCardDate('2026-07-09');
    assert.equal(typeof r.day,   'string');
    assert.equal(typeof r.month, 'string');
    assert.equal(typeof r.jour,  'string');
  });
  it('null → objet vide',                () => {
    const r = fmtCardDate(null);
    assert.equal(r.day, '');
    assert.equal(r.month, '');
  });
});

// ── todayLocal ────────────────────────────────────────────────────────────────
describe('todayLocal', () => {
  it('retourne yyyy-MM-dd',              () => assert.match(todayLocal(), /^\d{4}-\d{2}-\d{2}$/));
});

// ── normalizeMat ──────────────────────────────────────────────────────────────
describe('normalizeMat', () => {
  it('enlève accents et espaces',         () => assert.equal(normalizeMat('Vidéoprojecteur'), 'videoprojecteur'));
  it('enlève le s final',                () => assert.equal(normalizeMat('tablettes'), 'tablette'));
  it('null → chaîne vide',               () => assert.equal(normalizeMat(null), ''));
});

// ── matIncludes ───────────────────────────────────────────────────────────────
describe('matIncludes', () => {
  it('trouve un item avec accents différents', () => assert.ok(matIncludes(['Vidéoprojecteur'], 'Videoprojecteur')));
  it('retourne false si absent',              () => assert.ok(!matIncludes(['Tablette'], 'Scanner')));
  it('tableau vide → false',                  () => assert.ok(!matIncludes([], 'Tablette')));
  it('null → false',                          () => assert.ok(!matIncludes(null, 'Tablette')));
});

// ── escapeICS ────────────────────────────────────────────────────────────────
describe('escapeICS', () => {
  it('échappe backslash',     () => assert.ok(escapeICS('a\\b').includes('\\\\')));
  it('échappe point-virgule', () => assert.ok(escapeICS('a;b').includes('\\;')));
  it('échappe virgule',       () => assert.ok(escapeICS('a,b').includes('\\,')));
  it('échappe newline',       () => assert.ok(escapeICS('a\nb').includes('\\n')));
  it('null → chaîne vide',    () => assert.equal(escapeICS(null), ''));
});

// ── foldICSLine ───────────────────────────────────────────────────────────────
describe('foldICSLine', () => {
  it('ligne ≤75 chars inchangée',     () => { const l = 'A'.repeat(75); assert.equal(foldICSLine(l), l); });
  it('ligne >75 chars foldée en \\r\\n', () => {
    const l = 'A'.repeat(100);
    assert.ok(foldICSLine(l).includes('\r\n'));
  });
});

// ── parseHoraireICS ───────────────────────────────────────────────────────────
describe('parseHoraireICS', () => {
  it('09H30 → {hh:"09", mm:"30"}', () => assert.deepEqual(parseHoraireICS('09H30'), { hh: '09', mm: '30' }));
  it('null → défaut 09:00',         () => assert.deepEqual(parseHoraireICS(null),   { hh: '09', mm: '00' }));
});

// ── parseDateICS ─────────────────────────────────────────────────────────────
describe('parseDateICS', () => {
  it('date ISO → {y, mo, j}',  () => assert.deepEqual(parseDateICS('2026-06-16'), { y:'2026', mo:'06', j:'16' }));
  it('chaîne vide → null',     () => assert.equal(parseDateICS(''), null));
  it('null → null',            () => assert.equal(parseDateICS(null), null));
});

// ── buildICS ──────────────────────────────────────────────────────────────────
describe('buildICS', () => {
  const evt = { _id: 'test-001', date: '2026-07-09', horaire: '09H00', thematique: 'Atelier', commune: 'Agen', statut: 'Planifié', conseiller: 'Paul' };
  it('produit un fichier ICS valide',    () => {
    const ics = buildICS([evt]);
    assert.ok(ics.startsWith('BEGIN:VCALENDAR'));
    assert.ok(ics.includes('BEGIN:VEVENT'));
    assert.ok(ics.includes('END:VEVENT'));
    // RFC 5545 : chaque ligne se termine par CRLF, la dernière aussi.
    assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  });
  it('ignore les événements sans date', () => {
    const ics = buildICS([{ _id: 'x', date: '', thematique: 'Test' }]);
    assert.ok(!ics.includes('BEGIN:VEVENT'));
  });
  it('tableau vide → pas de VEVENT',    () => {
    const ics = buildICS([]);
    assert.ok(!ics.includes('BEGIN:VEVENT'));
  });
});

// ── resumeLogsTexte ──────────────────────────────────────────────────────────
// Parsing du format écrit par logGas. Il cassera silencieusement le jour où ce
// format changera : c'est précisément ce que ces deux cas verrouillent.
describe('resumeLogsTexte', () => {
  // Lignes réelles du Journal Admin NextStep, 21/09/2026 — 3 connexions.
  const JOURNAL = [
    ['12:06:52', 'GAS getAll #2 — ok en 1.2 s'],
    ['12:06:50', 'GAS getAll #1 — HTTP 404 en 8.1 s'],
    ['12:06:36', 'GAS checkPassword #2 — ok en 2.1 s'],
    ['12:06:33', 'GAS checkPassword #1 — bloqué — abandonné après 12s en 12.0 s'],
    ['11:51:52', 'GAS logLogin #1 — bloqué — abandonné après 12s en 12.0 s'],
  ].map(([t, msg]) => {
    const [h, m, s] = t.split(':').map(Number);
    return { t, msg, type: 'info', ts: new Date(2026, 8, 21, h, m, s).getTime() };
  });

  it('compte les pertes et le temps passé à attendre des réponses mortes', () => {
    const txt = resumeLogsTexte(JOURNAL, 'NEXTSTEP');
    assert.match(txt, /^JOURNAL NEXTSTEP — 5 appels serveur/);
    assert.match(txt, /perdus : 3\/5 \(60%\)/);
    // 8.1 + 12.0 + 12.0 arrondi
    assert.match(txt, /reponses mortes : 32s/);
    // Un échec dont l'heure locale diffère de l'heure UTC ne doit pas changer
    // de tranche : le journal affiche l'heure locale, le résumé aussi.
    assert.match(txt, /par heure  \(perdus\/total\) : .*11: 1\/1/);
  });

  // Le suffixe « (file N s) » mesure l'attente AVANT le depart du fetch,
  // ajoutee le 22/09/2026 (AG-005). Deux pieges verrouilles ici :
  //  - le motif d'echec contient lui-meme « apres 12s », donc la regex doit
  //    trouver le BON « en N s » et ne pas se laisser prendre par le suffixe ;
  //  - les lignes deja dans le localStorage des conseillers n'ont pas ce
  //    suffixe, et doivent rester lisibles.
  // La file d'attente client a vécu du 22 au 23/09/2026 : ses lignes portent
  // un suffixe « (file N s) » qui ne doit ni les faire ignorer ni amputer le motif.
  it('lit les lignes à suffixe « (file N s) » du 22-23/09/2026', () => {
    const ts = (h, m, sec) => new Date(2026, 8, 22, h, m, sec).getTime();
    const avecFile = [
      { t: '12:19:43', ts: ts(12,19,43), type: 'err',
        msg: 'GAS getAll #1 — bloqué — abandonné après 12s en 12.0 s (file 24.3 s)' },
      { t: '12:19:31', ts: ts(12,19,31), type: 'ok',
        msg: 'GAS saveEntry #2 — ok en 1.4 s (file 12.1 s)' },
    ];
    const txt = resumeLogsTexte(avecFile, 'NEXTSTEP');
    assert.doesNotMatch(txt, /aucune au format attendu/);
    assert.match(txt, /bloqué — abandonné après 12s  12\.0s/);
  });

  // Un refus serveur (ok:false) a ete LIVRE : le compter comme perte ferait
  // monter le taux de pertes a chaque mot de passe errone (AG-004).
  it('compte les refus serveur a part, ni pertes ni durees livrees', () => {
    const avecRefus = [...JOURNAL, { t: '12:07:10', ts: new Date(2026, 8, 21, 12, 7, 10).getTime(), type: 'err',
      msg: 'GAS saveMany #1 — serveur : Écriture concurrente en cours, réessayez en 20.1 s' }];
    const txt = resumeLogsTexte(avecRefus, 'NEXTSTEP');
    assert.match(txt, /perdus : 3\/6/);
    assert.match(txt, /refus serveur \(livres, hors pertes\) : 1 — 12:07:10 saveMany serveur : Écriture concurrente/);
    assert.match(txt, /mediane 2\.1s/);
  });

  // Doublage porté le 23/09/2026. Un doublon annulé (le jumeau a répondu)
  // n'est ni une perte ni une réussite ; un « #Nb ok » est une lecture sauvée.
  it('compte les doublons : annulés hors compte, sauvetages à part', () => {
    const at = (sec) => new Date(2026, 8, 23, 10, 0, sec).getTime();
    const j = [
      { t: '10:00:30', ts: at(30), type: 'info', msg: 'GAS getComptes #1b — annulé — le jumeau a répondu en 2.0 s' },
      { t: '10:00:28', ts: at(28), type: 'ok',   msg: 'GAS getComptes #1 — ok en 9.0 s' },
      { t: '10:00:09', ts: at(9),  type: 'info', msg: 'GAS getAll #1 — annulé — le jumeau a répondu en 9.0 s' },
      { t: '10:00:09', ts: at(9),  type: 'ok',   msg: 'GAS getAll #1b — ok en 1.9 s' },
    ];
    const txt = resumeLogsTexte(j, 'NEXTSTEP');
    assert.match(txt, /perdus : 0\/2 \(0%\)  \[\+2 doublons annules, hors compte\]/);
    assert.match(txt, /doublons non annules : 1 — 1 ont sauve la lecture, 0 en echec  \(\+1 annules/);
  });

  it('lit les lignes « API » (depuis la bascule du 25/09/2026) comme les anciennes « GAS »', () => {
    const logs = [
      { t: '12:26:14', ts: Date.UTC(2026, 8, 25, 10, 26, 14), type: 'ok', msg: 'API getAll #1 — ok en 0.1 s' },
      { t: '12:26:11', ts: Date.UTC(2026, 8, 25, 10, 26, 11), type: 'ok', msg: 'GAS getComptes #1 — ok en 0.2 s' },
    ];
    assert.match(resumeLogsTexte(logs, 'NEXTSTEP'), /— 2 appels serveur/);
  });

  it('ignore les lignes qui ne sont pas des appels serveur, et le journal vide', () => {
    const melange = [...JOURNAL, { t: '12:00:00', msg: '221 ateliers chargés (2026)', type: 'ok', ts: Date.now() }];
    assert.match(resumeLogsTexte(melange, 'NEXTSTEP'), /— 5 appels serveur/);
    assert.equal(resumeLogsTexte([], 'NEWGEN'), 'JOURNAL NEWGEN : aucun appel serveur enregistré.');
  });
});

// ── Cloisonnement du stockage local ──────────────────────────────────────────
// Les deux applis partagent une origine GitHub Pages, donc un localStorage.
// Ces deux cas verrouillent ce qui a coûté cher le 21/09/2026 : des clés
// identiques faisaient écrire chaque appli dans les données de l'autre.
describe('lsKey / migrerLocalStorage', () => {
  // Faux localStorage : même contrat (getItem rend null si absent).
  const faire = (init) => {
    const d = Object.assign({}, init);
    return {
      getItem: (k) => (k in d ? d[k] : null),
      setItem: (k, v) => { d[k] = String(v); },
      removeItem: (k) => { delete d[k]; },
      _d: d,
    };
  };

  it('préfixe chaque clé par l\'appli, sans jamais rendre la clé nue', () => {
    assert.match(lsKey('adm_dark'), /^(nextstep|newgen):adm_dark$/);
    assert.notEqual(lsKey('adm_dark'), 'adm_dark');
  });

  it('migre les anciennes préférences sans écraser un réglage déjà cloisonné', () => {
    const s = faire({ adm_dark: '1', f_annee: '2025', [lsKey('f_annee')]: '2026' });
    const n = migrerLocalStorage(s);
    assert.equal(s.getItem(lsKey('adm_dark')), '1');   // repris
    assert.equal(s.getItem(lsKey('f_annee')), '2026'); // NON écrasé
    assert.equal(n, 1);
    // L'ancienne clé survit : un onglet resté sur la version précédente
    // l'utilise encore, la supprimer lui ferait perdre ses réglages.
    assert.equal(s.getItem('adm_dark'), '1');
    // Rejouer la migration ne change plus rien.
    assert.equal(migrerLocalStorage(s), 0);
  });

  it('ne ressuscite pas une clé que l\'utilisateur vient de supprimer', () => {
    // Régression du 22/09/2026 : « 👤 Changer » vide la clé cloisonnée, mais
    // l'ancienne clé partagée subsiste. La migration, rejouée à chaque
    // chargement de page, la recopiait et faisait revenir l'identité quittée.
    const s = faire({ adm_conseiller: 'Michel Aswad' });
    assert.equal(migrerLocalStorage(s), 1);
    assert.equal(s.getItem(lsKey('adm_conseiller')), 'Michel Aswad');
    s.removeItem(lsKey('adm_conseiller'));        // l'utilisateur change d'identité
    assert.equal(migrerLocalStorage(s), 0);        // rechargement de page
    assert.equal(s.getItem(lsKey('adm_conseiller')), null);
  });
});

// ── suppressionAboutie ──────────────────────────────────────────────────────
// Le piège : « Feuille introuvable » contient aussi « introuvable », et c'est
// une vraie panne. Un test sur le mot seul la ferait passer pour un succès.
describe('suppressionAboutie', () => {
  it('compte « Entrée introuvable » comme une suppression faite, pas les autres refus', () => {
    assert.equal(suppressionAboutie({ ok: true }), true);
    assert.equal(suppressionAboutie({ ok: false, error: 'Entrée introuvable' }), true);
    assert.equal(suppressionAboutie({ ok: false, error: 'Feuille introuvable' }), false);
    assert.equal(suppressionAboutie({ ok: false, error: 'Écriture concurrente en cours, réessayez' }), false);
    assert.equal(suppressionAboutie(undefined), false);
  });
});

// ── Années chargées (AG-007) ──────────────────────────────────────────────
describe('années chargées', () => {
  it('relit l ancien format et le nouveau, normalise et choisit la plus récente', () => {
    assert.deepEqual(anneesListe('2026'), ['2026']);
    assert.deepEqual(anneesListe('2027, 2026,2026,x'), ['2026', '2027']);
    assert.deepEqual(anneesListe(''), [String(new Date().getFullYear())]);
    const c = new Date().getFullYear();
    // L'année en cours si elle est chargée, sinon la plus récente (AG-007).
    assert.equal(anneeReference(`${c+1},${c},${c-1}`), String(c));
    assert.equal(anneeReference(`${c-2},${c-1}`), String(c-1));
    assert.equal(anneeIncluse('2026,2027', '2027-03-15'), true);
    assert.equal(anneeIncluse('2026', '2027-03-15'), false);
  });
});

// ── comparerHistorique ─────────────────────────────────────
describe('comparerHistorique', () => {
  const liste = [
    { _id: 'a', date: '2026-11-02', horaire: '15:00', orienteur: 'Cité Scolaire - Collège Jean Monnet' },
    { _id: 'b', date: '2026-11-02', horaire: '9:30',  orienteur: 'Convergence' },
    { _id: 'c', date: '2026-11-02', horaire: '14:00', orienteur: 'Cité Scolaire - Collège Jean Monnet' },
    { _id: 'd', date: '2026-10-05', horaire: '09:30', orienteur: '' },
  ];
  it('même date : ordre chronologique, quel que soit l\'ordre d\'enregistrement', () => {
    assert.deepEqual([...liste].sort((x, y) => comparerHistorique(x, y, 1)).map(e => e._id), ['d', 'b', 'c', 'a']);
  });
  it('même date et même heure : orienteur départage', () => {
    const x = { date: '2026-11-02', horaire: '14:00', orienteur: 'Convergence' };
    const y = { date: '2026-11-02', horaire: '14:00', orienteur: 'Cité Scolaire' };
    assert.ok(comparerHistorique(y, x, 1) < 0);
  });
  it('date décroissante : les dates s\'inversent, pas l\'ordre à l\'intérieur d\'un jour', () => {
    assert.deepEqual([...liste].sort((x, y) => comparerHistorique(x, y, -1)).map(e => e._id), ['b', 'c', 'a', 'd']);
  });
});

// ── ampmDepuisHoraire ──────────────────────────────────────
describe('ampmDepuisHoraire', () => {
  it('seuil à 12:00 : 11:59 → AM, 12:00 → PM, 9:30 sans zéro → AM', () => {
    assert.deepEqual(['11:59', '12:00', '9:30', '14:30'].map(ampmDepuisHoraire), ['AM', 'PM', 'AM', 'PM']);
  });
  it('horaire vide ou illisible → rien (le champ n\'est pas touché)', () => {
    assert.deepEqual(['', null, 'matin', '25:00'].map(ampmDepuisHoraire), ['', '', '', '']);
  });
});

// ── kpiHistorique ──────────────────────────────────────────
describe('kpiHistorique', () => {
  const liste = [
    { statut: 'Planifié', inscrits: 8 },
    { statut: 'Réalisé', inscrits: 10, presents: 7 },
    { statut: 'Réalisé', inscrits: '6', presents: '5' },
    { statut: 'Annulé', inscrits: 4 },
    { statut: 'Reporté' },
    { statut: 'Non réalisé' },
  ];
  it('le total compte tous les statuts, et les tuiles s\'additionnent au total', () => {
    const k = kpiHistorique(liste);
    assert.equal(k.total, 6);
    assert.equal(k.planifies + k.realises + k.annules + k.autres, k.total);
    assert.deepEqual(k.pct, { planifies: 17, realises: 33, annules: 17, autres: 33 });
  });
  it('inscrits et présents sur les seuls réalisés (taux de présence)', () => {
    const k = kpiHistorique(liste);
    assert.deepEqual([k.inscrits, k.presents, k.tx], [16, 12, 75]);
    assert.equal(kpiHistorique([]).tx, 0);
  });
});

// ── conflitsDeLEntree (panneau latéral, 26/09/2026) ─────────────────────────
describe('conflitsDeLEntree', () => {
  const { conflitsDeLEntree } = require('./utils.js');
  const { findOrdinateursConflicts, findMobileClassConflicts } = require('./logic.js');
  const at = (id, conseiller, date, nb) => ({ _id: id, conseiller, date, horaire: '09:00', ampm: 'AM', statut: 'Planifié', materiel: ['Classe mobile'], nb_ordinateurs: nb });
  const autres = [at('a', 'Alice', '2026-10-05', 8)];
  it('déplacer un atelier sur une date déjà prise : conflit de stock et de Classe mobile signalés', () => {
    const c = conflitsDeLEntree(autres, at('b', 'Bruno', '2026-10-05', 6), findOrdinateursConflicts, findMobileClassConflicts);
    assert.equal(c.ordi.length, 1);
    assert.equal(c.ordi[0].total, 14);
    assert.equal(c.mobile.length, 1);
  });
  it('sur une date libre, ou déjà enregistré ailleurs dans la liste : rien, et pas compté deux fois', () => {
    const libre = conflitsDeLEntree(autres, at('b', 'Bruno', '2026-10-06', 6), findOrdinateursConflicts, findMobileClassConflicts);
    assert.deepEqual([libre.ordi.length, libre.mobile.length], [0, 0]);
    // L'ancienne version de l'atelier (même _id) est remplacée, pas additionnée.
    const deplace = conflitsDeLEntree([...autres, at('b', 'Bruno', '2026-10-05', 6)], at('b', 'Bruno', '2026-10-06', 6), findOrdinateursConflicts, findMobileClassConflicts);
    assert.deepEqual([deplace.ordi.length, deplace.mobile.length], [0, 0]);
  });
});

// ── matierePanneau (case Classe mobile du panneau latéral) ─────────────────
describe('matierePanneau', () => {
  const { matierePanneau } = require('./utils.js');
  it('cocher ajoute la Classe mobile une seule fois, décocher la retire, le reste est gardé', () => {
    assert.deepEqual(matierePanneau({ materiel: ['Ordinateur'] }, true), ['Ordinateur', 'Classe mobile']);
    assert.deepEqual(matierePanneau({ materiel: ['Classe mobile', 'Ordinateur'] }, true), ['Ordinateur', 'Classe mobile']);
    assert.deepEqual(matierePanneau({ materiel: ['classe mobiles', 'Ordinateur'] }, false), ['Ordinateur']);
  });
  it('accepte le texte « a|b » et un matériel absent', () => {
    assert.deepEqual(matierePanneau({ materiel: 'Ordinateur|Classe mobile' }, false), ['Ordinateur']);
    assert.deepEqual(matierePanneau({}, true), ['Classe mobile']);
  });
});

// ── ordiSansClasseMobile (onglet Anomalies) ────────────────────────────────
describe('ordiSansClasseMobile', () => {
  const { ordiSansClasseMobile } = require('./utils.js');
  it('signale un nombre d\'ordinateurs sans la case Classe mobile', () => {
    assert.equal(ordiSansClasseMobile({ nb_ordinateurs: 5, materiel: [] }), true);
    assert.equal(ordiSansClasseMobile({ nb_ordinateurs: '5', materiel: 'Ordinateur' }), true);
  });
  it('rien si la case est cochée ou si le nombre est vide/nul', () => {
    assert.equal(ordiSansClasseMobile({ nb_ordinateurs: 5, materiel: ['Classe mobile'] }), false);
    assert.equal(ordiSansClasseMobile({ nb_ordinateurs: 5, materiel: 'Ordinateur|classe mobiles' }), false);
    assert.equal(ordiSansClasseMobile({ nb_ordinateurs: '', materiel: [] }), false);
    assert.equal(ordiSansClasseMobile({ nb_ordinateurs: 0, materiel: [] }), false);
  });
});

describe('visibiliteEffective', () => {
  it('une clé absente vaut la même chose sur Index et dans l\'Admin (28/09/2026)', () => {
    const { visibiliteEffective } = require('./utils.js');
    const v = visibiliteEffective({ saisie: true });
    assert.equal(v.gestion_ordi, true);
    assert.equal(v.agenda, false);
    assert.equal(visibiliteEffective({ gestion_ordi: false }).gestion_ordi, false);
    assert.equal(visibiliteEffective({ gestion_ordi: 'false' }).gestion_ordi, false);
    assert.equal(visibiliteEffective(null).historique, true);
    assert.equal(visibiliteEffective({}).bilans, true, 'Mes bilans ouvert par défaut, masquable par l\'Admin (04/10/2026)');
    assert.equal(visibiliteEffective({ bilans: false }).bilans, false);
    assert.equal(visibiliteEffective({}).corbeille, false, 'Corbeille fermée sur Index sauf ouverture explicite (comme l\'API)');
  });
});

// ── statutSelonDate (lot 1 UX, 01/10/2026) ──────────────────
describe('statutSelonDate', () => {
  it('date passée → Réalisé, aujourd\'hui ou futur → Planifié', () => {
    assert.equal(statutSelonDate('2026-09-30', '2026-10-01'), 'Réalisé');
    assert.equal(statutSelonDate('2026-10-01', '2026-10-01'), 'Planifié');
    assert.equal(statutSelonDate('2026-12-31', '2026-10-01'), 'Planifié');
  });
  it('date vide ou illisible → rien', () => {
    assert.equal(statutSelonDate('', '2026-10-01'), '');
    assert.equal(statutSelonDate('01/10/2026', '2026-10-01'), '');
  });
});

// ── purgerCacheAteliers (audit du 01/10/2026) ──────────────
describe('purgerCacheAteliers', () => {
  // Faux localStorage avec length/key, comme le vrai.
  const faire = (init) => {
    const d = Object.assign({}, init);
    return {
      get length() { return Object.keys(d).length; },
      key: (i) => Object.keys(d)[i] ?? null,
      removeItem: (k) => { delete d[k]; },
      _d: d,
    };
  };
  it('efface toutes les copies d\'ateliers, et seulement elles', () => {
    const st = faire({ 'newgen:ateliers_cache_2026':'x', 'newgen:ateliers_cache_2025':'x',
      'ateliers_cache_2026':'x', 'newgen:f_dark':'1', 'ess-history':'[]', 'nextstep:f_annee':'2026' });
    assert.equal(purgerCacheAteliers(st), 3);
    assert.deepEqual(Object.keys(st._d).sort(), ['ess-history', 'newgen:f_dark', 'nextstep:f_annee']);
  });
  it('ne fait rien sans stockage', () => {
    assert.equal(purgerCacheAteliers(null), 0);
  });
});

describe('nouveautesNonVues', () => {
  const l = [{ id: 1 }, { id: 2 }, { id: 4 }];
  it('compte les nouveautés plus récentes que la dernière vue', () => {
    assert.equal(nouveautesNonVues(l, 0), 3);
    assert.equal(nouveautesNonVues(l, 2), 1);
    assert.equal(nouveautesNonVues(l, 4), 0);
  });
  it('valeur stockée absente ou illisible = tout est à lire', () => {
    assert.equal(nouveautesNonVues(l, null), 3);
    assert.equal(nouveautesNonVues(l, 'abc'), 3);
  });
});

describe('genererDatesCycle', () => {
  it('hebdomadaire : chaque mercredi, 4 séances', () => {
    const r = genererDatesCycle({ debut: '2026-10-07', mode: 'hebdo', intervalle: 1, jours: [3], nb: 4 });
    assert.deepEqual(r.dates, ['2026-10-07', '2026-10-14', '2026-10-21', '2026-10-28']);
  });
  it('toutes les 2 semaines, lundi et jeudi, jusqu\'à une date', () => {
    const r = genererDatesCycle({ debut: '2026-10-05', mode: 'hebdo', intervalle: 2, jours: [1, 4], jusquau: '2026-10-22' });
    assert.deepEqual(r.dates, ['2026-10-05', '2026-10-08', '2026-10-19', '2026-10-22']);
  });
  it('un jour coché avant la première date de la semaine n\'est pas pris', () => {
    const r = genererDatesCycle({ debut: '2026-10-07', mode: 'hebdo', jours: [1, 3], nb: 2 });
    assert.deepEqual(r.dates, ['2026-10-07', '2026-10-12']);
  });
  it('fériés sautés sans compter dans les N séances (11/11, Ascension 2027)', () => {
    const r = genererDatesCycle({ debut: '2026-11-04', mode: 'hebdo', jours: [3], nb: 3, sauterFeries: true });
    assert.deepEqual(r.dates, ['2026-11-04', '2026-11-18', '2026-11-25']);
    assert.deepEqual(r.feries, [{ date: '2026-11-11', libelle: 'Armistice' }]);
    assert.equal(joursFeries(2027)['2027-05-06'], 'Ascension');
    assert.equal(joursFeries(2027)['2027-03-29'], 'Lundi de Pâques');
  });
  it('mensuel : 2e mardi et dernier vendredi', () => {
    assert.deepEqual(genererDatesCycle({ debut: '2026-10-01', mode: 'mensuel', rang: 2, jourSemaine: 2, nb: 3 }).dates,
      ['2026-10-13', '2026-11-10', '2026-12-08']);
    assert.deepEqual(genererDatesCycle({ debut: '2026-10-01', mode: 'mensuel', rang: -1, jourSemaine: 5, nb: 2 }).dates,
      ['2026-10-30', '2026-11-27']);
  });
  it('plafond de 52 séances, et rien sans fin ni jour', () => {
    assert.equal(genererDatesCycle({ debut: '2026-01-05', mode: 'hebdo', jours: [1, 2, 3, 4, 5], nb: 200 }).dates.length, 52);
    assert.deepEqual(genererDatesCycle({ debut: '2026-10-07', mode: 'hebdo', jours: [3] }).dates, []);
    assert.deepEqual(genererDatesCycle({ debut: '2026-10-07', mode: 'hebdo', jours: [], nb: 3 }).dates, []);
  });
});

describe('import Outlook (.ics)', () => {
  const ICS = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VTIMEZONE', 'TZID:Romance Standard Time', 'END:VTIMEZONE',
    'BEGIN:VEVENT', 'UID:AAA', 'DTSTART;TZID=Romance Standard Time:20261007T140000',
    'SUMMARY:ATELIER Smartphone', 'LOCATION:Médiathèque\\, Agen', 'BEGIN:VALARM', 'TRIGGER:-PT15M', 'END:VALARM', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:BBB', 'DTSTART;TZID=Romance Standard Time:20261008T090000', 'SUMMARY:Réunion de service', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:CCC', 'DTSTART;TZID=Romance Standard Time:20261012T100000',
    'RRULE:FREQ=WEEKLY;COUNT=4;BYDAY=MO', 'EXDATE;TZID=Romance Standard Time:20261019T100000',
    'SUMMARY:Atelier Tablette pour les seniors du quartier du Pin', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:CCC', 'RECURRENCE-ID;TZID=Romance Standard Time:20261026T100000',
    'DTSTART;TZID=Romance Standard Time:20261027T140000', 'SUMMARY:Atelier Tablette pour les seniors du quartier du Pin', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:DDD', 'DTSTART:20261110T130000Z', 'SUMMARY:atélier Mail', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:EEE', 'DTSTART;VALUE=DATE:20261111', 'SUMMARY:ATELIER journée', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:FFF', 'DTSTART:20261013T080000Z', 'RRULE:FREQ=WEEKLY;BYDAY=TU', 'SUMMARY:Atelier sans fin', 'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const r = evenementsOutlook(ICS, 'atelier', '2026-10-01');
  it('ne garde que les rendez-vous au mot-clé, journées entières exclues', () => {
    assert.ok(!r.occurrences.some(o => /Réunion|journée/.test(o.titre)));
    assert.deepEqual(r.occurrences[0], { cle: 'AAA|2026-10-07', cleStable: 'AAA', date: '2026-10-07', horaire: '14:00', duree: '', titre: 'ATELIER Smartphone', lieu: 'Médiathèque, Agen', ferie: '' });
  });
  it('développe une série : EXDATE retirée, occurrence déplacée prise une seule fois', () => {
    const tab = r.occurrences.filter(o => o.cle.startsWith('CCC')).map(o => o.date + ' ' + o.horaire);
    assert.deepEqual(tab, ['2026-10-12 10:00', '2026-10-27 14:00', '2026-11-02 10:00']);
  });
  it('heure UTC convertie à l\'heure de Paris (après le changement d\'heure)', () => {
    assert.equal(r.occurrences.find(o => o.cle.startsWith('DDD')).horaire, '14:00');
  });
  it('série sans fin signalée, pas importée', () => {
    assert.deepEqual(r.ignores, ['Atelier sans fin']);
  });
  it('identifiant stable et court', () => {
    assert.equal(idOutlook('AAA|2026-10-07'), idOutlook('AAA|2026-10-07'));
    assert.notEqual(idOutlook('AAA|2026-10-07'), idOutlook('AAA|2026-10-14'));
    assert.ok(idOutlook('x'.repeat(300)).length <= 64);
  });
});

describe('import Outlook — jours fériés', () => {
  const ics = ['BEGIN:VCALENDAR', 'BEGIN:VEVENT', 'UID:F', 'DTSTART;TZID="Romance Standard Time":20261104T093000',
    'RRULE:FREQ=WEEKLY;COUNT=3;BYDAY=WE', 'SUMMARY:ATELIER test', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  it('occurrence un jour férié gardée et signalée', () => {
    const o = evenementsOutlook(ics, 'atelier', '').occurrences;
    assert.deepEqual(o.map(x => [x.date, x.ferie]), [['2026-11-04', ''], ['2026-11-11', 'Armistice'], ['2026-11-18', '']]);
  });
});

// ── ateliersPartenaire (Export Partenaire, Admin) ──────────────────────────
describe('ateliersPartenaire', () => {
  const { ateliersPartenaire } = require('./utils.js');
  const E = [
    { _id: 'a', date: '2026-03-10', orienteur: 'CAF ' }, { _id: 'b', date: '2026-01-05', orienteur: 'CAF' },
    { _id: 'c', date: '2026-06-30T00:00:00.000Z', orienteur: 'CAF' }, { _id: 'd', date: '2026-07-01', orienteur: 'MSA' },
    { _id: 'e', date: '', orienteur: 'CAF' },
  ];
  it('bornes incluses, orienteur, tri par date, sans les ateliers non datés', () => {
    assert.deepEqual(ateliersPartenaire(E, 'CAF', '2026-01-05', '2026-06-30').map(e => e._id), ['b', 'a', 'c']);
    assert.deepEqual(ateliersPartenaire(E, 'CAF', '2026-03-11', '').map(e => e._id), ['c']);
  });
  it('statut', () => {
    const S = [{ _id: 'p', date: '2026-02-01', statut: 'Planifié' }, { _id: 'r', date: '2026-01-01', statut: 'Réalisé' }];
    assert.deepEqual(ateliersPartenaire(S, '', '', '', 'Planifié').map(e => e._id), ['p']);
  });
  it('sans filtre : tous les ateliers datés', () => {
    assert.deepEqual(ateliersPartenaire(E, '', '', '').map(e => e._id), ['b', 'a', 'c', 'd']);
  });
});

// ── Durée d'un atelier (AG-017) ─────────────────────────────────────────────
describe('durée', () => {
  const U = require('./utils.js');
  it('arrondi à la demi-heure, bornes 30 min – 8 h, affichage', () => {
    assert.deepEqual([U.dureeArrondie(80), U.dureeArrondie(10), U.dureeArrondie(900), U.dureeArrondie(0)], [90, 30, 480, '']);
    assert.deepEqual([U.fmtDuree(90), U.fmtDuree(120), U.fmtDuree(30), U.fmtDuree('')], ['1 h 30', '2 h', '30 min', '']);
  });
  it('export .ics : fin = début + durée, 1 h 30 si non saisie', () => {
    const e = { _id: 'x', date: '2026-10-05', horaire: '09:30', thematique: 'T' };
    assert.ok(U.buildICS([e]).includes('DTEND:20261005T110000'));
    assert.ok(U.buildICS([{ ...e, duree: 120 }]).includes('DTEND:20261005T113000'));
  });
  it('import Outlook : durée tirée de DTEND ou DURATION', () => {
    const ics = ['BEGIN:VCALENDAR',
      'BEGIN:VEVENT', 'UID:A', 'SUMMARY:Atelier', 'DTSTART;TZID=Romance Standard Time:20261012T140000', 'DTEND;TZID=Romance Standard Time:20261012T160000', 'END:VEVENT',
      'BEGIN:VEVENT', 'UID:B', 'SUMMARY:Atelier', 'DTSTART;TZID=Romance Standard Time:20261013T093000', 'DURATION:PT1H30M', 'END:VEVENT',
      'END:VCALENDAR'].join('\r\n');
    assert.deepEqual(U.evenementsOutlook(ics, 'atelier', '').occurrences.map(o => o.duree), [120, 90]);
  });
});

// ── Planning (frise hebdomadaire) ──────────────────────────────────────────
describe('planning', () => {
  const { minutesHoraire, voiesPlanning } = require('./utils.js');
  it('horaire en minutes', () => {
    assert.deepEqual([minutesHoraire('9:30'), minutesHoraire('14H00'), minutesHoraire('08:05'), minutesHoraire(''), minutesHoraire('25:00')], [570, 840, 485, null, null]);
  });
  it('ateliers qui se chevauchent : voies différentes ; bout à bout : même voie', () => {
    const a = { debut: 540, fin: 630 }, b = { debut: 600, fin: 690 }, c = { debut: 630, fin: 720 };
    assert.equal(voiesPlanning([b, a, c]), 2);
    assert.deepEqual([a.voie, b.voie, c.voie], [0, 1, 0]);
  });
});

// ── Réimport Outlook : modifiés, supprimés ─────────────────────────────────
describe('rapprocherOutlook', () => {
  const { rapprocherOutlook, idOutlook } = require('./utils.js');
  const base = { conseiller: 'Alice', statut: 'Planifié', horaire: '09:30', duree: 90 };
  const E = [
    { ...base, _id: idOutlook('A'), date: '2026-10-05' },                       // déplacé dans Outlook
    { ...base, _id: idOutlook('S|2026-10-06'), date: '2026-10-06' },            // occurrence de série, ancien identifiant
    { ...base, _id: idOutlook('X|2026-10-08'), date: '2026-10-08' },            // supprimé d'Outlook
    { ...base, _id: idOutlook('R'), date: '2026-10-09', statut: 'Réalisé' },    // réalisé : jamais modifié
    { ...base, _id: idOutlook('Y|2026-10-07'), date: '2026-10-07', conseiller: 'Bruno' },  // autre conseiller
    { ...base, _id: 'entry_1', date: '2026-10-07' },                            // saisi à la main
  ];
  const O = [
    { cle: 'A|2026-10-12', cleStable: 'A', date: '2026-10-12', horaire: '10:00', duree: 120 },
    { cle: 'S|2026-10-06', cleStable: 'S|2026-10-06', date: '2026-10-06', horaire: '09:30', duree: '' },
    { cle: 'R|2026-10-09', cleStable: 'R', date: '2026-10-09', horaire: '14:00', duree: 90 },
    { cle: 'N|2026-10-10', cleStable: 'N', date: '2026-10-10', horaire: '09:00', duree: 90 },
  ];
  const r = rapprocherOutlook(O, E, { de: '2026-10-01', a: '2026-10-31' }, '');
  it('déplacé reconnu malgré le changement de date ; ancien identifiant reconnu', () => {
    assert.deepEqual(r.modifies.map(m => [m.e.date, m.ch, m.bloque]), [['2026-10-05', { date: '2026-10-12', horaire: '10:00', duree: 120 }, false], ['2026-10-09', { horaire: '14:00' }, true]]);
    assert.equal(r.identiques.length, 1);
    assert.deepEqual(r.nouveaux.map(n => n.o.cle), ['N|2026-10-10']);
  });
  it('supprimé : seulement un atelier importé, du même conseiller, planifié, dans la période', () => {
    assert.deepEqual(r.supprimes.map(s => s.e.date), ['2026-10-08']);
  });
});

// ── Bac à sable : aiguillage de l'API (AG-019) ─────────────────────────────
describe('urlApiPour', () => {
  const { urlApiPour } = require('./utils.js');
  const PROD = 'https://ateliers-numeriques.alwaysdata.net/api/index.php';
  it('production (GitHub Pages, tests) : jamais l\'API du bac à sable', () => {
    for (const [h, c] of [['maswaddpt47-cmyk.github.io', '/ATELIERS_NEWGEN/sandbox/index.html'], ['maswaddpt47-cmyk.github.io', '/ateliers-cd47_NextStep/'], ['localhost', '/sandbox/'], ['ateliers-numeriques.alwaysdata.net', '/sandboxx/']])
      assert.equal(urlApiPour(h, c), PROD, h + c);
  });
  it('pages du bac à sable : API du bac à sable', () => {
    assert.equal(urlApiPour('ateliers-numeriques.alwaysdata.net', '/sandbox/index.html'), 'https://ateliers-numeriques.alwaysdata.net/api-sandbox/index.php');
  });
});

// ── Fiche bilan : listes identiques à celles de l'API (AG-020) ──────────────
describe('BILAN_CHOIX', () => {
  it('mêmes choix que BILAN_CHOIX de l\'API', () => {
    const fs = require('fs'), path = require('path');
    const php = path.join(__dirname, 'api/lib/ecriture.php');
    if (!fs.existsSync(php)) return;   // NextStep : l'API vit dans NEWGEN
    const { BILAN_CHOIX } = require('./utils.js');
    const bloc = fs.readFileSync(php, 'utf8').match(/const BILAN_CHOIX = \[([\s\S]*?)\];/)[1];
    const api = {};
    for (const m of bloc.matchAll(/'(\w+)' => \[([^\]]*)\]/g)) api[m[1]] = [...m[2].matchAll(/'([^']*)'/g)].map(x => x[1]);
    assert.deepEqual(api, BILAN_CHOIX);
  });
});

// ── Avis des stagiaires : adresse du QR code (AG-021) ──────────────────────
describe('urlAvisPour', () => {
  const { urlAvisPour } = require('./utils.js');
  it('NEWGEN et NextStep → avis.html de NEWGEN ; bac à sable → le sien', () => {
    const J = '0123456789abcdef0123456789abcdef';
    assert.equal(urlAvisPour('https://maswaddpt47-cmyk.github.io', '/ateliers-cd47_NextStep/index.html', J), 'https://maswaddpt47-cmyk.github.io/ATELIERS_NEWGEN/avis.html#' + J);
    assert.equal(urlAvisPour('https://maswaddpt47-cmyk.github.io', '/ATELIERS_NEWGEN/', J), 'https://maswaddpt47-cmyk.github.io/ATELIERS_NEWGEN/avis.html#' + J);
    assert.equal(urlAvisPour('https://ateliers-numeriques.alwaysdata.net', '/sandbox/admin.html', J), 'https://ateliers-numeriques.alwaysdata.net/sandbox/avis.html#' + J);
    assert.ok(!urlAvisPour('https://maswaddpt47-cmyk.github.io', '/', J).includes('?'), 'jeton jamais dans la partie envoyée au serveur');
  });
});

// ── Fiche bilan : appuis successifs (bug du 04/10/2026 : « Autre » coché
// remplaçait la liste par une chaîne, découpée ensuite en lettres) ──────────
describe('basculerBilan', () => {
  const { basculerBilan } = require('./utils.js');
  it('choix multiples restent des listes, « Autre » compris', () => {
    let b = basculerBilan({}, 'difficultes', 'Autre');
    b = { ...b, difficultes_autre: 'A' };
    b = basculerBilan(b, 'difficultes', 'Niveau hétérogène');
    assert.deepEqual(b, { difficultes: ['Autre', 'Niveau hétérogène'], difficultes_autre: 'A' });
    b = basculerBilan(b, 'difficultes', 'Autre');
    assert.deepEqual(b, { difficultes: ['Niveau hétérogène'] });
    assert.deepEqual(basculerBilan({}, 'supports', 'Vidéo'), { supports: ['Vidéo'] });
  });
  it('choix unique : un second appui retire', () => {
    assert.deepEqual(basculerBilan(basculerBilan({}, 'niveau', 'Avancé'), 'niveau', 'Avancé'), {});
  });
});
