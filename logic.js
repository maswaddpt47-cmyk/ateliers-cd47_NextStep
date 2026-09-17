// Logique métier pure — compatible Node (require) ET navigateur (script tag)
// Dépend de utils.js (chargé avant en navigateur, ou via require en Node).

// En Node : on importe utils.js. En navigateur : les fonctions sont déjà en global (utils.js chargé avant).
if (typeof require !== 'undefined') {
  const _u = require('./utils.js');
  var stripAccents     = _u.stripAccents;
  var normCommune      = _u.normCommune;
  var normalizeDate    = _u.normalizeDate;
  var normalizeHoraire = _u.normalizeHoraire;
  var normalizeCommune = _u.normalizeCommune;
  var normalizeMat     = _u.normalizeMat;
  var matIncludes      = _u.matIncludes;
  var addJoursIso      = _u.addJoursIso;
}

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

// ── Visibilité matériel ──────────────────────────────────────────────────────

// Un matériel masqué (Admin → Listes → Matériels) disparaît des nouvelles
// cases à cocher du formulaire de saisie, mais reste affiché s'il est déjà
// sélectionné sur l'entrée en cours (édition) — jamais de perte de
// visibilité sur une donnée existante. Extrait de VueSaisie (inline
// jusqu'ici) pour être testable, même principe que sur ATELIERS_NEWGEN
// (filterMaterielsVisibles).
function filterMaterielsVisibles(materiels, masques, selectionnes) {
  return (materiels || []).filter(m => !matIncludes(masques, m) || matIncludes(selectionnes, m));
}

// ── Conflits matériel ─────────────────────────────────────────────────────────

// Repère les dates où 2+ conseillers distincts ont réservé "Classe mobile" —
// matériel physique partagé, ne peut être utilisé qu'à un seul endroit à la
// fois. Alerte informative uniquement (jamais bloquante à la saisie) : les
// Annulés sont exclus, un atelier annulé n'immobilise plus le matériel.
function findMobileClassConflicts(entries) {
  const parDate = {};
  entries.forEach(e => {
    if (e.statut === 'Annulé') return;
    if (!e.date) return;
    if (!matIncludes(e.materiel, 'Classe mobile')) return;
    (parDate[e.date] = parDate[e.date] || []).push(e);
  });
  return Object.keys(parDate)
    .map(date => ({ date, entries: parDate[date] }))
    .filter(g => new Set(g.entries.map(e => e.conseiller)).size >= 2)
    .sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
}

// ── Conflits stock ordinateurs ──────────────────────────────────────────────
// Porté depuis ATELIERS_NEWGEN. Contrairement à findMobileClassConflicts
// (même jour uniquement, matériel considéré comme unique/indivisible), ici
// la quantité (nb_ordinateurs, saisie manuelle) et la date de retour
// (date_retour_materiel) forment une période de prêt : deux ateliers à des
// dates différentes peuvent quand même se disputer le stock si le premier
// n'a pas rendu le matériel avant que le second en ait besoin. On étale
// chaque atelier sur les jours qu'il occupe (date → date_retour_materiel
// inclus, ou juste date si pas de retour renseigné), on cumule les
// quantités par jour, puis on fusionne les jours consécutifs en conflit en
// un seul bloc (date de début → date de fin) — pour ne pas répéter les
// mêmes conseillers sur chaque jour d'un même chevauchement de plusieurs
// jours. Chaque conseiller d'un bloc est en conflit avec tous les autres
// conseillers du même bloc.
// let (pas const) : écrasée par la config GAS (stockOrdinateurs renvoyé par
// getAll) dans loadData (app.js/admin_app.js), modifiable depuis Admin.
let STOCK_ORDINATEURS = 10;

// Cumul du jour à partir d'une liste d'items {conseiller, qte} — au max par
// conseiller, pas en somme : un même conseiller qui enchaîne deux ateliers
// dos-à-dos (retour du premier = prélèvement du second, sans repasser par
// le local) n'a physiquement qu'un seul jeu d'ordinateurs en main ce
// jour-là, jamais deux fois sa quantité. La contention réelle du stock ne
// vient que de conseillers DIFFÉRENTS qui en ont besoin en même temps.
function totalJourParConseiller(items) {
  const parConseiller = {};
  (items || []).forEach(x => { parConseiller[x.conseiller] = Math.max(parConseiller[x.conseiller] || 0, x.qte); });
  return Object.values(parConseiller).reduce((s, q) => s + q, 0);
}

// Période réelle d'indisponibilité du matériel pour un atelier : du
// prélèvement (peut précéder la date de l'atelier — ex. retrait le mardi
// pour un atelier le vendredi) au retour. Repli sur la date de l'atelier de
// chaque côté si le champ correspondant est vide (rétrocompatible avec les
// ateliers saisis avant l'ajout de ces deux champs).
function periodePretMateriel(e) {
  const debut = (e.date_prelevement_materiel && e.date_prelevement_materiel < e.date) ? e.date_prelevement_materiel : e.date;
  const fin = (e.date_retour_materiel && e.date_retour_materiel > e.date) ? e.date_retour_materiel : e.date;
  return { debut, fin };
}

function findOrdinateursConflicts(entries, stock = STOCK_ORDINATEURS) {
  const parJour = {};
  (entries || []).forEach(e => {
    if (e.statut === 'Annulé') return;
    if (!e.date) return;
    if (!matIncludes(e.materiel, 'Classe mobile')) return;
    const qte = parseInt(e.nb_ordinateurs) || 0;
    if (qte <= 0) return;
    const { debut, fin } = periodePretMateriel(e);
    // Garde-fou : une date de prélèvement/retour saisie à la main peut être
    // erronée (année oubliée, inversion jour/mois...) — on plafonne à 90
    // jours pour ne jamais boucler indéfiniment sur une période aberrante.
    let d = debut, garde = 0;
    while (d <= fin && garde < 90) {
      (parJour[d] = parJour[d] || []).push({
        _id: e._id, conseiller: e.conseiller, qte,
        commune: e.commune || '', lieu: e.lieu || '',
        dateDebut: debut, dateFin: fin,
      });
      d = addJoursIso(d, 1);
      garde++;
    }
  });
  const joursConflit = Object.keys(parJour)
    .map(date => ({ date, entries: parJour[date], total: totalJourParConseiller(parJour[date]) }))
    .filter(g => g.total > stock)
    .sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

  const blocs = [];
  joursConflit.forEach(g => {
    const dernier = blocs[blocs.length - 1];
    if (dernier && addJoursIso(dernier.dateFin, 1) === g.date) {
      dernier.dateFin = g.date;
      dernier.total = Math.max(dernier.total, g.total);
      g.entries.forEach(e => { if (!dernier._vus.has(e._id)) { dernier._vus.add(e._id); dernier.entries.push(e); } });
    } else {
      blocs.push({ date: g.date, dateFin: g.date, total: g.total, entries: [...g.entries], _vus: new Set(g.entries.map(e => e._id)) });
    }
  });
  return blocs.map(({ _vus, ...b }) => b);
}

// Liste tous les prêts Classe mobile (période prélèvement → retour), pas
// seulement les jours en conflit (findOrdinateursConflicts ne renvoie que
// ça) — sert à la frise/Gantt où on veut voir tous les prêts pour repérer
// les chevauchements visuellement, pas uniquement ceux déjà détectés en
// dépassement de stock.
function getPretsMateriel(entries) {
  return (entries || [])
    .filter(e => e.statut !== 'Annulé' && e.date
      && matIncludes(e.materiel, 'Classe mobile')
      && (parseInt(e.nb_ordinateurs) || 0) > 0)
    .map(e => {
      const { debut, fin } = periodePretMateriel(e);
      return {
        _id: e._id, conseiller: e.conseiller, qte: parseInt(e.nb_ordinateurs) || 0,
        commune: e.commune || '', lieu: e.lieu || '', thematique: e.thematique || '',
        dateAtelier: e.date, debut, fin,
      };
    })
    .sort((a, b) => a.debut < b.debut ? -1 : a.debut > b.debut ? 1 : 0);
}

// Cumul des ordinateurs réservés pour chaque jour de `jours` (tableau de
// dates ISO) — sert à teinter la frise là où le cumul dépasse le stock.
function totauxParJourMateriel(prets, jours) {
  const totaux = {};
  (jours || []).forEach(j => {
    totaux[j] = totalJourParConseiller((prets || []).filter(p => j >= p.debut && j <= p.fin));
  });
  return totaux;
}

// Un conflit (issu de findMobileClassConflicts ou findOrdinateursConflicts)
// devient "historique" une fois sa période entièrement passée — plus rien à
// arbitrer une fois que l'atelier a eu lieu. dateFin est absent sur un
// conflit Classe mobile (toujours un seul jour) : on retombe sur date.
function estConflitPasse(conflit, today) {
  return (conflit.dateFin || conflit.date) < today;
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
    findMobileClassConflicts,
    filterMaterielsVisibles,
    STOCK_ORDINATEURS, totalJourParConseiller, periodePretMateriel, findOrdinateursConflicts,
    getPretsMateriel, totauxParJourMateriel, estConflitPasse,
  };
}
