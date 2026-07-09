// Logique métier pure — compatible Node (require) ET navigateur (script tag)
// Dépend de utils.js (chargé avant en navigateur, ou via require en Node).

const _utils = typeof require !== 'undefined' ? require('./utils.js') : window;
const { stripAccents, normCommune, normalizeDate, normalizeHoraire, normalizeCommune, normalizeMat } = _utils;

// ── Statuts et constantes ─────────────────────────────────────────────────────

const STATUTS_VALIDES = ['Planifié', 'Réalisé', 'Annulé', 'Non réalisé', 'Reporté'];

// ── KPI ───────────────────────────────────────────────────────────────────────

function computeKpi(entries) {
  const realises  = entries.filter(e => e.statut === 'Réalisé');
  const annules   = entries.filter(e => e.statut === 'Annulé');
  const planifies = entries.filter(e => e.statut === 'Planifié');
  const inscrits  = realises.reduce((s, e) => s + (parseInt(e.inscrits) || 0), 0);
  const presents  = realises.reduce((s, e) => s + (parseInt(e.presents) || 0), 0);
  const tx        = inscrits > 0 ? Math.round(presents / inscrits * 100) : 0;
  return {
    total:    entries.length,
    realises: realises.length,
    annules:  annules.length,
    planifies:planifies.length,
    inscrits,
    presents,
    tx,
  };
}

// ── Validation formulaire ─────────────────────────────────────────────────────

const REQUIRED_FIELDS = ['statut','date','horaire','ampm','commune','lieu','thematique','conseiller','orienteur','public'];

function validateEntry(form) {
  const errors = {};
  for (const f of REQUIRED_FIELDS) {
    if (!String(form[f] || '').trim()) errors[f] = 'Requis';
  }
  if (form.inscrits === '' || form.inscrits == null) errors.inscrits = 'Requis';
  return errors;
}

function validateLotShared(form) {
  const errors = {};
  const shared = ['statut','commune','lieu','orienteur','public'];
  for (const f of shared) {
    if (!String(form[f] || '').trim()) errors[f] = 'Requis';
  }
  return errors;
}

function validateLotRow(row) {
  const errors = {};
  for (const f of ['date','horaire','ampm','thematique']) {
    if (!String(row[f] || '').trim()) errors[f] = 'Requis';
  }
  return errors;
}

// ── Matériel ──────────────────────────────────────────────────────────────────

// Normalise un tableau de matériels en pipe-string pour l'API
function normalizeMateriel(arr) {
  if (!Array.isArray(arr)) return String(arr || '');
  return arr.filter(Boolean).join('|');
}

// ── Filtres ───────────────────────────────────────────────────────────────────

function applyFilters(entries, filters) {
  const { statut, mois, commune, conseiller, public: pub, dateFrom, dateTo, search } = filters;
  return entries.filter(e => {
    if (statut    && e.statut    !== statut)    return false;
    if (conseiller && e.conseiller !== conseiller) return false;
    if (pub       && e.public    !== pub)        return false;
    if (commune   && normCommune(e.commune)     !== normCommune(commune)) return false;
    if (mois      && e.date && !e.date.startsWith(mois)) return false;
    if (dateFrom  && e.date && e.date < dateFrom) return false;
    if (dateTo    && e.date && e.date > dateTo)   return false;
    if (search) {
      const q = stripAccents(search);
      const hay = stripAccents([e.commune, e.lieu, e.thematique, e.conseiller, e.orienteur, e.remarques].join(' '));
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// ── Normalisation d'une entrée importée (CSV / XLSX) ─────────────────────────

function normalizeImportRow(raw) {
  return {
    statut:       String(raw.statut      || '').trim(),
    date:         normalizeDate(raw.date),
    horaire:      normalizeHoraire(raw.horaire),
    ampm:         String(raw.ampm        || '').trim(),
    commune:      normalizeCommune(String(raw.commune || '').trim()),
    lieu:         String(raw.lieu        || '').trim(),
    thematique:   String(raw.thematique  || '').trim(),
    conseiller:   String(raw.conseiller  || '').trim(),
    co_animateur: String(raw.co_animateur|| '').trim(),
    orienteur:    String(raw.orienteur   || '').trim(),
    public:       String(raw.public      || '').trim(),
    inscrits:     raw.inscrits !== '' && raw.inscrits != null ? parseInt(raw.inscrits) || '' : '',
    presents:     raw.presents !== '' && raw.presents != null ? parseInt(raw.presents) || '' : '',
    materiel:     Array.isArray(raw.materiel) ? raw.materiel : [],
    residence:    String(raw.residence   || '').trim(),
    remarques:    String(raw.remarques   || '').trim(),
  };
}

// ── Compatible Node (tests) ET navigateur (script tag) ────────────────────────

if (typeof module !== 'undefined') {
  module.exports = {
    STATUTS_VALIDES, REQUIRED_FIELDS,
    computeKpi,
    validateEntry, validateLotShared, validateLotRow,
    normalizeMateriel,
    applyFilters,
    normalizeImportRow,
  };
}
