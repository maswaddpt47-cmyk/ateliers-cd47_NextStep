// ═══════════════════════════════════════════════════════════
// Code.gs — Ateliers CD47 v9.0
// Mise à jour depuis v8.2 — compatible avec les données existantes
//
// Changements v9.0 :
//  · Feuille de données renommée → Ateliers_next_step (test)
//  · Suppression de ADMIN_PWD (géré côté client en SHA-256)
//  · Version bumped à 9.0
//  · Aucun changement de schéma — rétrocompatible total
//
// Pour revenir en production : changer SHEET_NAME → 'Ateliers'
// ═══════════════════════════════════════════════════════════

const SHEET_NAME   = 'Ateliers_next_step';  // ← prod : 'Ateliers'
const CONFIG_SHEET = 'Config';

// Colonnes dans l'ordre exact du Google Sheet
// ⚠️  Le matériel reste en colonnes séparées (OUI / '')
//     pour rétrocompatibilité avec les données existantes
const COLUMNS = [
  '_id', '_n', 'statut', 'date', 'horaire', 'ampm',
  'orienteur', 'commune', 'lieu', 'thematique',
  'inscrits', 'presents', 'public', 'conseiller',
  'Videoprojecteur', 'Ecran', 'Classe mobile', 'Boitier 4G',
  'Tablette', 'Scanner', 'Multiprise', 'Ordinateur',
  'residence', 'remarques'
];

const MATERIELS = [
  'Videoprojecteur', 'Ecran', 'Classe mobile', 'Boitier 4G',
  'Tablette', 'Scanner', 'Multiprise', 'Ordinateur'
];

const VISIBILITY_DEFAULTS = {
  saisie:     true,
  historique: true,
  graphiques: false,
  carte:      false,
  bingo:      false
};

const LISTS_DEFAULTS = {
  statuts:     ['Planifié','Réalisé','Annulé','Non réalisé','Reporté'],
  conseillers: ['Cynthia Pineau','Corentin Tual','Michel Aswad','Eva Capelle'],
  publics:     ['Tous publics','Personnes en situation de handicap','Jeunes','ATTEE',
                'Classe - 6A','Classe - 6B','Classe - 6C','Classe - 6D',
                'Elèves de 5è du collège','Parents isolés',
                'Professionnels des bibliothèques','Adhérents','BRSA',
                "Demandeur d'emploi",'Parents allophone','Collègiens','Autres'],
  materiels:   ['Videoprojecteur','Ecran','Classe mobile','Boitier 4G',
                'Tablette','Scanner','Multiprise','Ordinateur']
};

// ═══════════════════════════════════════════════════════════
// POINT D'ENTRÉE HTTP
// ═══════════════════════════════════════════════════════════

function doGet(e)  { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  if (!e) return jsonResponse({ ok: false, error: 'Appel direct non supporté' });

  const params = e.parameter || {};
  const body   = parseBody(e);

  if (params.entry) {
    try { body.entry = JSON.parse(decodeURIComponent(params.entry)); } catch(_) {}
  }
  if (params.entries) {
    try { body.entries = JSON.parse(decodeURIComponent(params.entries)); } catch(_) {}
  }
  if (params.lists) {
    try { body.lists = JSON.parse(decodeURIComponent(params.lists)); } catch(_) {}
  }
  if (params.visibility) {
    try { body.visibility = JSON.parse(decodeURIComponent(params.visibility)); } catch(_) {}
  }
  if (params.colors) {
    try { body.colors = JSON.parse(decodeURIComponent(params.colors.replace(/\+/g,' '))); } catch(_) {}
  }
  if (params._id && !body._id) {
    body._id = params._id;
  }

  const action = params.action || body.action || '';

  try {
    let result;
    switch (action) {
      case 'getAll':         result = getAll();                          break;
      case 'save':           result = saveEntry(body.entry);             break;
      case 'saveMany':       result = saveManyEntries(body.entries);     break;
      case 'delete':         result = deleteEntry(body._id);             break;
      case 'getConfig':      result = getConfig();                       break;
      case 'setConfig':      result = setConfig(body.key, body.value);   break;
      case 'getLists':       result = getLists();                        break;
      case 'saveLists':      result = saveLists(body.lists);             break;
      case 'getVisibility':  result = getVisibility();                   break;
      case 'saveVisibility': result = saveVisibility(body.visibility);   break;
      case 'saveColors':     result = saveColors(body.colors);           break;
      default: result = { ok: false, error: 'Action inconnue : ' + action };
    }
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

// ═══════════════════════════════════════════════════════════
// LECTURE
// ═══════════════════════════════════════════════════════════

function getAll() {
  const sheet = getSheet(SHEET_NAME);
  const data  = sheet.getDataRange().getValues();

  const entries = [];
  if (data.length > 1) {
    const headers = data[0];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;
      const ent = {};
      headers.forEach((h, idx) => {
        ent[h] = row[idx] === undefined ? '' : row[idx];
      });

      // Reconstituer le tableau materiel depuis les colonnes OUI/''
      ent.materiel = MATERIELS.filter(m => ent[m] === 'OUI');

      // Normaliser la date
      if (ent.date instanceof Date) {
        ent.date = Utilities.formatDate(ent.date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      } else if (ent.date) {
        ent.date = String(ent.date).slice(0, 10);
      }

      // Normaliser l'horaire
      if (ent.horaire instanceof Date) {
        ent.horaire = Utilities.formatDate(ent.horaire, Session.getScriptTimeZone(), 'HH:mm');
      } else if (ent.horaire) {
        const h = String(ent.horaire).trim();
        const m = h.match(/T(\d{2}:\d{2})/);
        if (m) ent.horaire = m[1];
        else if (/^\d{1,2}:\d{2}:\d{2}$/.test(h)) ent.horaire = h.slice(0, 5);
      }

      entries.push(ent);
    }
  }

  const lists             = getLists().lists;
  const visibility        = getVisibility().visibility;
  const conseiller_colors = getColors().colors;
  return { ok: true, entries, lists, visibility, conseiller_colors };
}

// ═══════════════════════════════════════════════════════════
// LISTES DÉROULANTES
// ═══════════════════════════════════════════════════════════

function getLists() {
  try {
    const sheet = getConfigSheet();
    const data  = sheet.getDataRange().getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === 'lists') {
        const parsed = JSON.parse(String(data[i][1]));
        return { ok: true, lists: Object.assign({}, LISTS_DEFAULTS, parsed) };
      }
    }
  } catch(_) {}
  return { ok: true, lists: Object.assign({}, LISTS_DEFAULTS) };
}

function saveLists(lists) {
  if (!lists || typeof lists !== 'object') {
    return { ok: false, error: 'Listes invalides' };
  }
  const required = ['statuts','conseillers','publics','materiels'];
  for (const k of required) {
    if (!Array.isArray(lists[k])) {
      return { ok: false, error: `Clé manquante ou invalide : ${k}` };
    }
  }
  return setConfig('lists', JSON.stringify(lists));
}

// ═══════════════════════════════════════════════════════════
// VISIBILITÉ FRONTEND
// ═══════════════════════════════════════════════════════════

function getVisibility() {
  try {
    const sheet = getConfigSheet();
    const data  = sheet.getDataRange().getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === 'frontend_visibility') {
        const parsed = JSON.parse(String(data[i][1]));
        return { ok: true, visibility: Object.assign({}, VISIBILITY_DEFAULTS, parsed) };
      }
    }
  } catch(_) {}
  return { ok: true, visibility: Object.assign({}, VISIBILITY_DEFAULTS) };
}

function saveVisibility(visibility) {
  if (!visibility || typeof visibility !== 'object') {
    return { ok: false, error: 'Visibilité invalide' };
  }
  return setConfig('frontend_visibility', JSON.stringify(visibility));
}

// ═══════════════════════════════════════════════════════════
// COULEURS CONSEILLERS
// ═══════════════════════════════════════════════════════════

function getColors() {
  try {
    const sheet = getConfigSheet();
    const data  = sheet.getDataRange().getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === 'conseiller_colors') {
        return { ok: true, colors: JSON.parse(String(data[i][1])) };
      }
    }
  } catch(_) {}
  return { ok: true, colors: null };
}

function saveColors(colors) {
  if (!colors || typeof colors !== 'object') return { ok: false, error: 'Couleurs invalides' };
  return setConfig('conseiller_colors', JSON.stringify(colors));
}

// ═══════════════════════════════════════════════════════════
// ÉCRITURE — UPSERT
// ═══════════════════════════════════════════════════════════

function saveEntry(entry) {
  if (!entry || !entry._id) return { ok: false, error: 'Entrée invalide (pas de _id)' };

  const sheet   = getSheet(SHEET_NAME);
  const data    = sheet.getDataRange().getValues();
  const headers = data.length > 0 ? data[0] : COLUMNS;

  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(entry._id).trim()) {
      rowIndex = i + 1;
      break;
    }
  }

  if (!entry._n || entry._n === 0) {
    entry._n = getNextN(data);
  }

  const row = buildRow(entry, headers);

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  SpreadsheetApp.flush();
  return { ok: true, _id: entry._id, _n: entry._n };
}

function saveManyEntries(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return { ok: false, error: "Pas d'entrées à importer" };
  }
  let saved = 0;
  for (const entry of entries) {
    try { saveEntry(entry); saved++; } catch(_) {}
  }
  return { ok: true, saved };
}

// ═══════════════════════════════════════════════════════════
// SUPPRESSION
// ═══════════════════════════════════════════════════════════

function deleteEntry(_id) {
  if (!_id) return { ok: false, error: 'Pas de _id fourni' };

  const sheet = getSheet(SHEET_NAME);
  const data  = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(_id).trim()) {
      sheet.deleteRow(i + 1);
      SpreadsheetApp.flush();
      return { ok: true };
    }
  }
  return { ok: false, error: 'Entrée non trouvée' };
}

// ═══════════════════════════════════════════════════════════
// CONFIG (clé/valeur générique)
// ═══════════════════════════════════════════════════════════

function getConfig() {
  const sheet = getConfigSheet();
  const data  = sheet.getDataRange().getValues();
  const config = {};
  data.forEach(row => { if (row[0]) config[row[0]] = row[1]; });
  return { ok: true, config };
}

function setConfig(key, value) {
  if (!key) return { ok: false, error: 'Clé manquante' };
  const sheet = getConfigSheet();
  const data  = sheet.getDataRange().getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return { ok: true };
    }
  }
  sheet.appendRow([key, value]);
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════
// UTILITAIRES
// ═══════════════════════════════════════════════════════════

function getSheet(name) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('Feuille introuvable : ' + name);
  return sheet;
}

// Config se crée automatiquement si absente
function getConfigSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(CONFIG_SHEET);
  if (!sh) {
    sh = ss.insertSheet(CONFIG_SHEET);
    sh.getRange(1,1,1,2).setValues([['app_version','9.0']]);
    Logger.log('Feuille Config créée automatiquement');
  }
  return sh;
}

// Construit une ligne dans l'ordre des headers
// Le matériel est éclaté en colonnes OUI/'' (schéma existant)
function buildRow(entry, headers) {
  return headers.map(h => {
    if (MATERIELS.includes(h)) {
      return (Array.isArray(entry.materiel) && entry.materiel.includes(h)) ? 'OUI' : '';
    }
    const v = entry[h];
    return v === undefined || v === null ? '' : v;
  });
}

function getNextN(data) {
  let max = 0;
  for (let i = 1; i < data.length; i++) {
    const n = parseInt(data[i][1]);
    if (!isNaN(n) && n > max) max = n;
  }
  return max + 1;
}

function parseBody(e) {
  try {
    if (e.postData && e.postData.contents) {
      return JSON.parse(e.postData.contents);
    }
  } catch(_) {}
  return e.parameter || {};
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════════════════════
// INITIALISATION — crée la feuille Ateliers_next_step
// À exécuter UNE seule fois depuis l'éditeur Apps Script
// Ne touche pas la feuille Ateliers (prod) ni Config
// ═══════════════════════════════════════════════════════════

function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Créer la feuille de test si absente
  let ateliers = ss.getSheetByName(SHEET_NAME);
  if (!ateliers) {
    ateliers = ss.insertSheet(SHEET_NAME);
    ateliers.appendRow(COLUMNS);
    ateliers.getRange(1, 1, 1, COLUMNS.length)
      .setFontWeight('bold')
      .setBackground('#1e3a8a')
      .setFontColor('#ffffff');
    ateliers.setFrozenRows(1);
  }

  // Mettre à jour la version dans Config (partagé prod + test)
  setConfig('app_version', '9.0');

  SpreadsheetApp.getUi().alert(
    '✅ Feuille "' + SHEET_NAME + '" prête.\n' +
    'Config partagée avec la prod (listes + visibilité inchangées).'
  );
}

// ═══════════════════════════════════════════════════════════
// TESTS — Exécuter depuis l'éditeur Apps Script
// ═══════════════════════════════════════════════════════════

function testGetAll() {
  const r = getAll();
  Logger.log('Feuille   : ' + SHEET_NAME);
  Logger.log('Entrées   : ' + r.entries.length);
  Logger.log('Listes    : ' + JSON.stringify(r.lists));
  Logger.log('Visibilité: ' + JSON.stringify(r.visibility));
}

function testSave() {
  const entry = {
    _id: 'test_' + Date.now(),
    statut: 'Planifié',
    date: '2025-06-15',
    horaire: '14:00',
    ampm: 'PM',
    orienteur: 'Test Orienteur',
    commune: 'AGEN (47000)',
    lieu: 'Médiathèque test',
    thematique: 'Internet et sécurité — test v9.0',
    inscrits: 8,
    presents: '',
    public: 'Tous publics',
    conseiller: 'Cynthia Pineau',
    materiel: ['Tablette', 'Videoprojecteur'],
    residence: '',
    remarques: 'Test automatique GAS v9.0'
  };
  const r = saveEntry(entry);
  Logger.log('Save : ' + JSON.stringify(r));
  if (r.ok) {
    const del = deleteEntry(entry._id);
    Logger.log('Delete : ' + JSON.stringify(del));
  }
}
