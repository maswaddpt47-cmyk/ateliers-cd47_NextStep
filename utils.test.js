const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  stripAccents, trunc,
  normCommune, normalizeCommune,
  normalizeDate, normalizeHoraire, fmtDate, fmtCardDate, todayLocal,
  normalizeMat, matIncludes,
  escapeICS, foldICSLine, parseHoraireICS, parseDateICS, buildICS,
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
