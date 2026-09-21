// Fonctions utilitaires pures — compatibles Node (require) ET navigateur (script tag)
// Pas de DOM, pas de React, pas d'état global mutable.
// MOIS, JOURS, COMMUNE_MAP sont déclarés localement dans chaque fonction pour éviter
// tout conflit de redéclaration avec shared.js en navigateur.

// ── Texte ─────────────────────────────────────────────────────────────────────

function stripAccents(str) {
  return String(str || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function trunc(s, n) {
  s = String(s || '');
  return s.length > n ? s.slice(0, n) + '…' : s;
}

// ── Communes ──────────────────────────────────────────────────────────────────

function normCommune(s) {
  if (!s) return '';
  return s.replace(/\s*\(\d+\)\s*/g, '').trim();
}

function normalizeCommune(c) {
  const _map = {'TEMPLE SUR LOT':'LE TEMPLE SUR LOT','VILLENEUVE-SUR-LOT':'VILLENEUVE SUR LOT'};
  return _map[String(c || '').trim()] || String(c || '').trim();
}

// ── Dates ─────────────────────────────────────────────────────────────────────

function normalizeDate(val) {
  if (!val) return '';
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return s.split('T')[0];
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return s;
}

function normalizeHoraire(val) {
  if (!val) return '';
  const s = String(val).trim();
  const iso = s.match(/T(\d{2}:\d{2})/);
  if (iso) return iso[1];
  if (/^\d{1,2}[Hh]\d{2}$/.test(s)) return s.replace(/[Hh]/, ':');
  if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(s)) return s.slice(0, 5);
  return s;
}

function fmtDate(d) {
  if (!d) return '';
  // normalizeDate tronque un éventuel suffixe ISO datetime (T10:00:00.000Z) —
  // GAS peut renvoyer ce format pour une colonne Date non explicitement
  // formatée côté serveur.
  d = normalizeDate(d);
  const _j = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const [y, m, j] = d.split('-');
  const jour = _j[new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(j, 10)).getDay()];
  return `${jour} ${j}/${m}/${y}`;
}

function addJoursIso(d, n) {
  if (!d) return '';
  const [y, m, j] = d.split('-').map(Number);
  const dt = new Date(y, m - 1, j + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function fmtCardDate(d) {
  if (!d) return { day: '', month: '', jour: '' };
  const _j = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const _m = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  const [y, m, j] = d.split('-');
  const jour = _j[new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(j, 10)).getDay()];
  return { day: j, month: _m[parseInt(m, 10) - 1], jour };
}

function todayLocal() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ── Matériel ──────────────────────────────────────────────────────────────────

function normalizeMat(s) {
  return stripAccents(String(s || '')).replace(/\s+/g, '').replace(/s$/, '');
}

function matIncludes(arr, m) {
  const nm = normalizeMat(m);
  return (arr || []).some(a => normalizeMat(a) === nm);
}

// ── Export ICS ────────────────────────────────────────────────────────────────

function escapeICS(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function foldICSLine(line) {
  if (line.length <= 75) return line;
  const c = [line.slice(0, 75)];
  let i = 75;
  while (i < line.length) { c.push(' ' + line.slice(i, i + 74)); i += 74; }
  return c.join('\r\n');
}

function parseHoraireICS(h) {
  const s = String(h || '09H00').toUpperCase().replace('H', ':');
  const p = s.split(':');
  return { hh: String(parseInt(p[0] || 9, 10)).padStart(2, '0'), mm: String(parseInt(p[1] || 0, 10)).padStart(2, '0') };
}

function parseDateICS(d) {
  const m = String(d || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? { y: m[1], mo: m[2], j: m[3] } : null;
}

function buildICS(evts) {
  const out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ateliers Numerique 47//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const e of evts) {
    const pd = parseDateICS(e.date); if (!pd) continue;
    const { hh, mm } = parseHoraireICS(e.horaire);
    const startH = parseInt(hh, 10);
    const dts = `${pd.y}${pd.mo}${pd.j}T${hh}${mm}00`;
    let dte;
    if (startH < 23) {
      dte = `${pd.y}${pd.mo}${pd.j}T${String(startH + 1).padStart(2, '0')}${mm}00`;
    } else {
      const next = new Date(parseInt(pd.y, 10), parseInt(pd.mo, 10) - 1, parseInt(pd.j, 10) + 1);
      dte = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, '0')}${String(next.getDate()).padStart(2, '0')}T000000`;
    }
    const summary  = escapeICS([e.thematique, e.commune].filter(Boolean).join(' | '));
    const location = escapeICS([e.lieu, e.commune].filter(Boolean).join(', '));
    const descParts = [
      e.conseiller  && 'Conseiller : '  + e.conseiller,
      e.orienteur   && 'Orienteur : '   + e.orienteur,
      e.statut      && 'Statut : '      + e.statut,
      e.public      && 'Public : '      + e.public,
      (e.inscrits !== '' && e.inscrits != null) && 'Inscrits : ' + e.inscrits,
      (e.presents !== '' && e.presents != null) && 'Présents : ' + e.presents,
      e.remarques   && 'Remarques : '   + e.remarques,
    ].filter(Boolean);
    out.push('BEGIN:VEVENT', 'DTSTART:' + dts, 'DTEND:' + dte, 'SUMMARY:' + summary);
    if (location)       out.push('LOCATION:' + location);
    if (descParts.length) out.push('DESCRIPTION:' + escapeICS(descParts.join('\n')));
    out.push('UID:' + e._id + '@ateliers-newgen', 'END:VEVENT');
  }
  out.push('END:VCALENDAR');
  return out.map(foldICSLine).join('\r\n');
}

// ── Compatible Node (tests) ET navigateur (script tag) ────────────────────────

// Sortie compacte du Journal, à coller dans une conversation avec Claude.
// Coller 200 lignes brutes coûte cher et noie l'information : ce qui sert au
// diagnostic, c'est le taux de perte, le temps réellement passé à attendre
// des réponses mortes, et SURTOUT la répartition dans le temps — la panne de
// livraison Apps Script frappe par fenêtres (mesuré le 18/09/2026), pas par
// appel. L'appli est nommée dans l'en-tête : les deux journaux sont
// identiques à l'écran, et des mesures ont déjà été attribuées au mauvais
// projet le 19/09/2026.
function resumeLogsTexte(logs, appli){
  var gas = (logs||[]).filter(function(l){ return l && typeof l.msg === 'string' && l.msg.indexOf('GAS ') === 0; });
  if(!gas.length) return 'JOURNAL ' + appli + ' : aucun appel GAS enregistré.';
  var lus = [];
  gas.forEach(function(l){
    var m = l.msg.match(/^GAS (\S+) #(\S+) — (.+) en ([\d.]+) s$/);
    if(!m) return;
    var d = l.ts ? new Date(l.ts) : null;
    lus.push({
      action: m[1], essai: m[2], motif: m[3], sec: parseFloat(m[4]),
      ko: m[3].indexOf('ok') !== 0,
      heure: l.t || (d ? d.toLocaleTimeString('fr-FR') : '?'),
      h: d ? ('0' + d.getHours()).slice(-2) : '??',
      jour: d ? d.toLocaleDateString('fr-FR', {day:'2-digit', month:'2-digit'}) : ''
    });
  });
  if(!lus.length) return 'JOURNAL ' + appli + ' : ' + gas.length + ' lignes GAS, aucune au format attendu.';
  var ko = lus.filter(function(x){ return x.ko; });
  var okSec = lus.filter(function(x){ return !x.ko; }).map(function(x){ return x.sec; }).sort(function(a,b){ return a-b; });
  var med = okSec.length ? okSec[Math.floor(okSec.length/2)] : 0;
  var p90 = okSec.length ? okSec[Math.min(okSec.length-1, Math.floor(okSec.length*0.9))] : 0;
  var perdu = ko.reduce(function(a,x){ return a + x.sec; }, 0);
  var grouper = function(cle){
    var g = {};
    lus.forEach(function(x){ g[x[cle]] = g[x[cle]] || {ko:0, n:0}; g[x[cle]].n++; if(x.ko) g[x[cle]].ko++; });
    return Object.keys(g).sort().map(function(k){ return k + ': ' + g[k].ko + '/' + g[k].n; }).join('  ');
  };
  var prem = lus[lus.length-1], der = lus[0];
  var l = [];
  l.push('JOURNAL ' + appli + ' — ' + lus.length + ' appels GAS');
  l.push('periode (heure locale) : ' + prem.jour + ' ' + prem.heure + ' -> ' + der.jour + ' ' + der.heure);
  l.push('perdus : ' + ko.length + '/' + lus.length + ' (' + Math.round(ko.length/lus.length*100) + '%)');
  l.push('durees livrees : mediane ' + med.toFixed(1) + 's | p90 ' + p90.toFixed(1) + 's');
  l.push('temps passe a attendre des reponses mortes : ' + Math.round(perdu) + 's');
  l.push('');
  l.push('par action (perdus/total) : ' + grouper('action'));
  l.push('par heure  (perdus/total) : ' + grouper('h'));
  if(ko.length){
    l.push('');
    l.push('echecs' + (ko.length > 25 ? ' (25 derniers sur ' + ko.length + ')' : '') + ' :');
    ko.slice(0, 25).forEach(function(x){
      l.push('  ' + x.jour + ' ' + x.heure + '  ' + x.action + ' #' + x.essai + '  ' + x.motif + '  ' + x.sec.toFixed(1) + 's');
    });
  }
  return l.join('\n');
}

// admin_app.js l'appelle via window ; les tests Node via module.exports.
if (typeof window !== 'undefined') window.resumeLogsTexte = resumeLogsTexte;

// ── Cloisonnement du stockage local ─────────────────────────────────────────
// Les deux applis (ateliers-cd47_NextStep et ATELIERS_NEWGEN) sont servies
// depuis la MÊME origine GitHub Pages — maswaddpt47-cmyk.github.io — et
// localStorage est cloisonné par origine, PAS par chemin. Des clés identiques
// des deux côtés les font donc écrire l'une sur l'autre.
// Constaté le 21/09/2026 sur le journal des opérations : les lignes des deux
// projets n'en formaient qu'une seule série, ce qui rendait toute mesure de
// latence inattribuable. Mêmes collisions sur le conseiller connecté, le
// thème, l'année filtrée, le minuteur d'inactivité et le cache d'ateliers.
// Toute clé de stockage passe désormais par lsKey().
const APP_NS = 'nextstep';
function lsKey(k) { return APP_NS + ':' + k; }

// Migration unique depuis les clés d'avant le cloisonnement, pour ne pas
// réinitialiser les préférences des conseillers. On ne copie que si la clé
// cloisonnée est absente : rejouer la migration ne doit jamais écraser un
// réglage déjà fait. Les anciennes clés sont laissées en place — un onglet
// resté sur la version précédente les écrit encore, et les supprimer ici lui
// ferait perdre ses réglages en cours de session.
// 'adm_logs' est volontairement exclu : ses lignes mélangent les deux projets,
// elles ne sont attribuables à aucun des deux, donc pas exploitables.
const LS_A_MIGRER = [
  'adm_conseiller', 'adm_dark', 'adm_sidebar_pinned', 'adm_last_activity',
  'cal_moisDeb', 'cal_moisFin', 'f_annee', 'f_dark', 'sidebar_pinned',
];
function migrerLocalStorage(store) {
  if (!store) return 0;
  var n = 0;
  LS_A_MIGRER.forEach(function (k) {
    try {
      if (store.getItem(lsKey(k)) === null && store.getItem(k) !== null) {
        store.setItem(lsKey(k), store.getItem(k));
        n++;
      }
    } catch (e) {}
  });
  return n;
}
if (typeof window !== 'undefined') {
  try { migrerLocalStorage(window.localStorage); } catch (e) {}
}

if (typeof module !== 'undefined') {
  module.exports = {
    stripAccents, trunc,
    normCommune, normalizeCommune,
    normalizeDate, normalizeHoraire, fmtDate, fmtCardDate, todayLocal, addJoursIso,
    normalizeMat, matIncludes,
    escapeICS, foldICSLine, parseHoraireICS, parseDateICS, buildICS,
    resumeLogsTexte,
  lsKey, migrerLocalStorage, LS_A_MIGRER,
  };
}
