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
  anneesListe,
  anneeReference,
  anneeIncluse,
  lsKey, migrerLocalStorage,
} = require('./utils.js');

// ── stripAccents ──────────────────────────────────────────────────────────────
describe('stripAccents', () => {
  it('enlève les accents et met en minuscule', () => assert.equal(stripAccents('Éàüî'), 'eaui'));
  it('chaîne vide → chaîne vide',              () => assert.equal(stripAccents(''), ''));
  it('null → ne plante pas',                   () => assert.equal(stripAccents(null), ''));
});

// ── trunc ─────────────────────────────────────────────────────────────────────
describe('trunc', () => {
  it('tronque à n caractères avec …',  () => assert.equal(trunc('abcdef', 4), 'abcd…'));
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
  it('retourne la valeur telle quelle si absente du map', () => assert.equal(normalizeCommune('Agen'), 'Agen'));
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
    assert.ok(ics.endsWith('END:VCALENDAR'));
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
  it('lit l attente en file, sans casser les lignes anterieures', () => {
    const ts = (h, m, sec) => new Date(2026, 8, 22, h, m, sec).getTime();
    const avecFile = [
      { t: '12:19:43', ts: ts(12,19,43), type: 'err',
        msg: 'GAS getAll #1 — bloqué — abandonné après 12s en 12.0 s (file 24.3 s)' },
      { t: '12:19:31', ts: ts(12,19,31), type: 'ok',
        msg: 'GAS saveEntry #2 — ok en 1.4 s (file 12.1 s)' },
    ];
    const txt = resumeLogsTexte(avecFile, 'NEXTSTEP');
    assert.match(txt, /temps passe en file avant de partir : 36s/);
    assert.match(txt, /pire cas 24\.3s, sur 2\/2 appels mesures/);
    // Le motif n'a pas ete ampute par le suffixe.
    assert.match(txt, /bloqué — abandonné après 12s  12\.0s  \+ 24\.3s de file/);

    // Format d'avant : aucune attente connue, et on le dit plutot que
    // d'afficher 0 s, qui se lirait comme « la file ne coute rien ».
    const txtAncien = resumeLogsTexte(JOURNAL, 'NEXTSTEP');
    assert.match(txtAncien, /temps passe en file : non mesure/);
    assert.doesNotMatch(txtAncien, /avant de partir/);
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
