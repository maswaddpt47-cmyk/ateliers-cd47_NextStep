// ═══════════════════════════════════════════════════════════
// Code.gs — Ateliers CD47 v9.3
//
// Changements v9.3 :
//  · saveEmails() / getEmails() — stocke {conseiller: email} dans Config
//  · sendRappels() — détecte ateliers "Planifié" à date passée et envoie
//    un mail de rappel au conseiller concerné (Gmail)
//  · createRappelTrigger() — installe le trigger nightly (à lancer 1 fois)
//  · deleteRappelTrigger() — supprime le trigger si besoin
//  · Aucun changement de schéma — rétrocompatible total
// ═══════════════════════════════════════════════════════════

const SHEET_NAME   = 'Ateliers_next_step';  // ← prod : 'Ateliers'
const CONFIG_SHEET = 'Config';

// Colonnes dans l'ordre exact du Google Sheet
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
  saisie:      true,
  historique:  true,
  graphiques:  false,
  carte:       false,
  bingo:       false,
  calendrier:  false
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
  if (params.emails) {
    try { body.emails = JSON.parse(decodeURIComponent(params.emails)); } catch(_) {}
  }
  if (params._id && !body._id) {
    body._id = params._id;
  }

  const action = params.action || body.action || '';

  try {
    let result;
    switch (action) {
      case 'getAll':         result = getAll(params.year || '');             break;
      case 'save':           result = saveEntry(body.entry);                 break;
      case 'saveMany':       result = saveManyEntries(body.entries);         break;
      case 'delete':         result = deleteEntry(body._id);                 break;
      case 'getConfig':      result = getConfig();                           break;
      case 'setConfig':      result = setConfig(body.key, body.value);       break;
      case 'getLists':       result = getLists();                            break;
      case 'saveLists':      result = saveLists(body.lists);                 break;
      case 'getVisibility':  result = getVisibility();                       break;
      case 'saveVisibility': result = saveVisibility(body.visibility);       break;
      case 'saveColors':     result = saveColors(body.colors);               break;
      case 'getEmails':      result = getEmails();                           break;  // v9.3
      case 'saveEmails':     result = saveEmails(body.emails);               break;  // v9.3
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

function getAll(year) {
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

      ent.materiel = MATERIELS.filter(m => ent[m] === 'OUI');

      if (ent.date instanceof Date) {
        ent.date = Utilities.formatDate(ent.date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      } else if (ent.date) {
        ent.date = String(ent.date).slice(0, 10);
      }

      if (year && year !== 'all' && ent.date && !ent.date.startsWith(year)) continue;

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
  const emails            = getEmails().emails;   // v9.3
  return { ok: true, entries, lists, visibility, conseiller_colors, emails };
}

// ═══════════════════════════════════════════════════════════
// EMAILS CONSEILLERS — v9.3
// ═══════════════════════════════════════════════════════════

function getEmails() {
  try {
    const sheet = getConfigSheet();
    const data  = sheet.getDataRange().getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === 'conseiller_emails') {
        return { ok: true, emails: JSON.parse(String(data[i][1])) };
      }
    }
  } catch(_) {}
  return { ok: true, emails: {} };
}

function saveEmails(emails) {
  if (!emails || typeof emails !== 'object') return { ok: false, error: 'Emails invalides' };
  return setConfig('conseiller_emails', JSON.stringify(emails));
}

// ═══════════════════════════════════════════════════════════
// RAPPELS EMAIL AUTOMATIQUES — v9.3
//
// Logique :
//   - Parcourt tous les ateliers de l'année en cours
//   - Cible : statut "Planifié" ET date < aujourd'hui (atelier révolu)
//   - Envoie un email au conseiller si son email est renseigné
//   - Rappel envoyé chaque nuit tant que l'atelier n'est pas clôturé
// ═══════════════════════════════════════════════════════════

function sendRappels() {
  const today     = new Date();
  const todayStr  = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const year      = todayStr.slice(0, 4);

  // Charger les données
  const allData   = getAll(year);
  const entries   = allData.entries || [];
  const emails    = allData.emails  || {};

  // Filtrer les ateliers à rappeler (tous les Planifié à date passée, sans anti-doublon)
  const aRappeler = entries.filter(e =>
    e.statut === 'Planifié' &&
    e.date   &&
    e.date < todayStr
  );

  if (aRappeler.length === 0) {
    Logger.log('sendRappels : aucun atelier à rappeler.');
    return { ok: true, sent: 0 };
  }

  // Grouper par conseiller
  const parConseiller = {};
  aRappeler.forEach(e => {
    const c = e.conseiller || 'Inconnu';
    if (!parConseiller[c]) parConseiller[c] = [];
    parConseiller[c].push(e);
  });

  let sent = 0;

  Object.entries(parConseiller).forEach(([conseiller, ateliers]) => {
    const email = emails[conseiller];
    if (!email || !email.includes('@')) {
      Logger.log(`sendRappels : pas d'email pour ${conseiller}, ignoré.`);
      return;
    }

    // Construire le tableau HTML des ateliers à mettre à jour
    const lignes = ateliers.map(e => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${e.date}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${e.horaire || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${e.thematique || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${e.commune || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${e.lieu || '—'}</td>
      </tr>
    `).join('');

    const nb = ateliers.length;
    const sujet = `[Ateliers CD47] ⚠️ ${nb} atelier${nb > 1 ? 's' : ''} à clôturer — ${conseiller}`;

    const corps = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.1);">

    <!-- Header -->
    <div style="background:#197d89;padding:24px 28px;">
      <div style="font-size:18px;font-weight:700;color:#fff;">🖥️ Ateliers Inclusion Numérique</div>
      <div style="font-size:13px;color:rgba(255,255,255,.8);margin-top:4px;">Conseil Départemental du Lot-et-Garonne</div>
    </div>

    <!-- Corps -->
    <div style="padding:24px 28px;">
      <p style="font-size:15px;color:#1a202c;margin:0 0 8px;">Bonjour <strong>${conseiller}</strong>,</p>
      <p style="font-size:14px;color:#4a5568;margin:0 0 20px;">
        ${nb > 1
          ? `Vous avez <strong>${nb} ateliers</strong> planifiés dont la date est passée. Merci de les clôturer en indiquant le statut réel (Réalisé, Annulé, Reporté…) ainsi que le nombre de personnes présentes.`
          : `Vous avez <strong>1 atelier</strong> planifié dont la date est passée. Merci de le clôturer en indiquant le statut réel (Réalisé, Annulé, Reporté…) ainsi que le nombre de personnes présentes.`
        }
      </p>
      <p style="font-size:14px;color:#4a5568;margin:0 0 20px;">
        👉 <a href="https://maswaddpt47-cmyk.github.io/ateliers-cd47_NextStep/" style="color:#197d89;font-weight:700;">Accéder à l'application</a>
      </p>

      <!-- Tableau -->
      <div style="border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#1e3a8a;">
              <th style="padding:10px 12px;text-align:left;color:#fff;font-weight:600;">Date</th>
              <th style="padding:10px 12px;text-align:left;color:#fff;font-weight:600;">Heure</th>
              <th style="padding:10px 12px;text-align:left;color:#fff;font-weight:600;">Thématique</th>
              <th style="padding:10px 12px;text-align:left;color:#fff;font-weight:600;">Commune</th>
              <th style="padding:10px 12px;text-align:left;color:#fff;font-weight:600;">Lieu</th>
            </tr>
          </thead>
          <tbody>${lignes}</tbody>
        </table>
      </div>

      <p style="font-size:13px;color:#718096;margin:20px 0 0;">
        Merci de mettre à jour le statut de ces ateliers dès que possible.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:14px 28px;border-top:1px solid #e2e8f0;">
      <div style="font-size:11px;color:#a0aec0;">Ce message est envoyé automatiquement chaque nuit. Ne pas répondre directement.</div>
    </div>

  </div>
</body>
</html>`;

    try {
      GmailApp.sendEmail(email, sujet, '', { htmlBody: corps, name: 'Ateliers CD47' });
      sent++;
      Logger.log(`sendRappels : mail envoyé à ${email} (${nb} atelier(s))`);
    } catch(err) {
      Logger.log(`sendRappels : erreur envoi à ${email} — ${err.message}`);
    }
  });

  Logger.log(`sendRappels : ${sent} email(s) envoyé(s).`);
  return { ok: true, sent, count: aRappeler.length };
}

// ═══════════════════════════════════════════════════════════
// TRIGGER — installer / supprimer
// À exécuter UNE SEULE FOIS depuis l'éditeur Apps Script
// ═══════════════════════════════════════════════════════════

function createRappelTrigger() {
  // Supprimer les triggers existants sur sendRappels pour éviter les doublons
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'sendRappels') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Créer un trigger quotidien entre 7h et 8h
  ScriptApp.newTrigger('sendRappels')
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .create();

  Logger.log('✅ Trigger sendRappels créé — exécution quotidienne entre 7h et 8h.');
  SpreadsheetApp.getUi().alert('✅ Trigger installé !\nLes rappels seront envoyés automatiquement chaque matin vers 7h.');
}

function deleteRappelTrigger() {
  let deleted = 0;
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'sendRappels') {
      ScriptApp.deleteTrigger(t);
      deleted++;
    }
  });
  Logger.log(`deleteRappelTrigger : ${deleted} trigger(s) supprimé(s).`);
  SpreadsheetApp.getUi().alert(`${deleted} trigger(s) sendRappels supprimé(s).`);
}

// Réinitialise les IDs notifiés (utile pour tester)
function resetNotifiedIds() {
  setConfig('rappels_notified', '[]');
  Logger.log('resetNotifiedIds : liste vidée.');
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

function getConfigSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(CONFIG_SHEET);
  if (!sh) {
    sh = ss.insertSheet(CONFIG_SHEET);
    sh.getRange(1,1,1,2).setValues([['app_version','9.3']]);
    Logger.log('Feuille Config créée automatiquement');
  }
  return sh;
}

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
// INITIALISATION
// ═══════════════════════════════════════════════════════════

function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

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

  setConfig('app_version', '9.3');

  SpreadsheetApp.getUi().alert(
    '✅ Feuille "' + SHEET_NAME + '" prête.\n' +
    'Config partagée avec la prod (listes + visibilité inchangées).\n\n' +
    '→ Exécute createRappelTrigger() pour activer les rappels email.'
  );
}

// ═══════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════

function testGetAll() {
  const r = getAll();
  Logger.log('Feuille   : ' + SHEET_NAME);
  Logger.log('Entrées   : ' + r.entries.length);
  Logger.log('Listes    : ' + JSON.stringify(r.lists));
  Logger.log('Emails    : ' + JSON.stringify(r.emails));
}

// Test sendRappels sans envoyer de vrais mails (logs seulement)
function testSendRappels() {
  const todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const year     = todayStr.slice(0, 4);
  const allData  = getAll(year);
  const emails   = allData.emails || {};
  const aRappeler = (allData.entries || []).filter(e =>
    e.statut === 'Planifié' && e.date && e.date < todayStr
  );
  Logger.log(`testSendRappels : ${aRappeler.length} atelier(s) révolu(s) statut Planifié`);
  Logger.log('Emails configurés : ' + JSON.stringify(emails));
  aRappeler.forEach(e => Logger.log(` → ${e.date} | ${e.conseiller} | ${e.thematique}`));
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
    thematique: 'Internet et sécurité — test v9.3',
    inscrits: 8,
    presents: '',
    public: 'Tous publics',
    conseiller: 'Cynthia Pineau',
    materiel: ['Tablette', 'Videoprojecteur'],
    residence: '',
    remarques: 'Test automatique GAS v9.3'
  };
  const r = saveEntry(entry);
  Logger.log('Save : ' + JSON.stringify(r));
  if (r.ok) {
    const del = deleteEntry(entry._id);
    Logger.log('Delete : ' + JSON.stringify(del));
  }
}
