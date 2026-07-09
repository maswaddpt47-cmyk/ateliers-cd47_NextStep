const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeMateriel, STATUTS_VALIDES } = require('./logic.js');
const { normalizeDate } = require('./utils.js');

// Modèle canonique d'une entrée envoyée à l'API GAS via saveEntry
function buildEntry(overrides = {}) {
  return {
    _id:          'atelier_1234567890_abc01',
    _n:           '',                   // vide à la création, row number en modification
    statut:       'Planifié',
    date:         '2026-07-09',         // toujours ISO yyyy-MM-dd
    horaire:      '09:00',              // toujours HH:mm
    ampm:         'AM',
    commune:      'Agen',
    lieu:         'MJC Agen',
    thematique:   'Internet',
    conseiller:   'Paul Dupont',
    co_animateur: '',
    orienteur:    'CAF',
    public:       'Tous publics',
    inscrits:     4,                    // number ou '' — jamais null/undefined
    presents:     '',
    materiel:     'Videoprojecteur|Tablette', // pipe-string, jamais Array
    residence:    '',
    remarques:    '',
    ...overrides,
  };
}

// ── date ──────────────────────────────────────────────────────────────────────
describe('date', () => {
  it('est au format ISO yyyy-MM-dd',       () => assert.match(buildEntry().date, /^\d{4}-\d{2}-\d{2}$/));
  it('normalizeDate(ISO) → inchangé',      () => assert.equal(normalizeDate('2026-07-09'), '2026-07-09'));
  it('format lisible détecté comme invalide', () => {
    assert.ok(!/^\d{4}-\d{2}-\d{2}$/.test('Jeu 09/07/2026'));
  });
});

// ── horaire ───────────────────────────────────────────────────────────────────
describe('horaire', () => {
  it('est au format HH:mm',               () => assert.match(buildEntry().horaire, /^\d{2}:\d{2}$/));
});

// ── statut ────────────────────────────────────────────────────────────────────
describe('statut', () => {
  it('appartient aux valeurs autorisées',  () => assert.ok(STATUTS_VALIDES.includes(buildEntry().statut)));
  it('valeur arbitraire rejetée',          () => assert.ok(!STATUTS_VALIDES.includes('En cours')));
});

// ── materiel ──────────────────────────────────────────────────────────────────
describe('materiel', () => {
  it('est une string, jamais un Array',    () => {
    assert.equal(typeof buildEntry().materiel, 'string');
    assert.ok(!Array.isArray(buildEntry().materiel));
  });
  it('normalizeMateriel(Array) → pipe-string', () => {
    assert.equal(normalizeMateriel(['Videoprojecteur', 'Tablette']), 'Videoprojecteur|Tablette');
  });
  it('normalizeMateriel([]) → chaîne vide',     () => assert.equal(normalizeMateriel([]), ''));
  it('séparateur est | (jamais virgule, jamais espace)', () => {
    const m = normalizeMateriel(['A', 'B', 'C']);
    assert.ok(!m.includes(','));
    assert.ok(m.includes('|'));
  });
});

// ── inscrits / presents ───────────────────────────────────────────────────────
describe('inscrits / presents', () => {
  it('inscrits jamais null ou undefined',  () => {
    const e = buildEntry();
    assert.ok(e.inscrits !== null && e.inscrits !== undefined);
  });
  it('presents jamais null ou undefined',  () => {
    const e = buildEntry();
    assert.ok(e.presents !== null && e.presents !== undefined);
  });
  it('inscrits=0 est valide (≠ inscrits="")', () => {
    assert.notEqual(buildEntry({ inscrits: 0 }).inscrits, '');
  });
  it('inscrits="" est autorisé (pas encore rempli)', () => {
    assert.equal(buildEntry({ inscrits: '' }).inscrits, '');
  });
});

// ── _id ───────────────────────────────────────────────────────────────────────
describe('_id', () => {
  it('est une string non vide',            () => {
    const id = buildEntry()._id;
    assert.equal(typeof id, 'string');
    assert.ok(id.length > 0);
  });
});

// ── ampm ──────────────────────────────────────────────────────────────────────
describe('ampm', () => {
  it('est AM ou PM',                       () => {
    assert.ok(['AM', 'PM'].includes(buildEntry().ampm));
  });
});
