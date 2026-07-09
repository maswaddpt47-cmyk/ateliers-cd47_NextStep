// Fonctions utilitaires pures — compatibles Node (require) ET navigateur (script tag)
// Pas de DOM, pas de React, pas d'état global mutable.

const MOIS  = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

const COMMUNE_MAP = {
  'TEMPLE SUR LOT':       'LE TEMPLE SUR LOT',
  'VILLENEUVE-SUR-LOT':   'VILLENEUVE SUR LOT',
};

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
  return COMMUNE_MAP[String(c || '').trim()] || String(c || '').trim();
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
  const [y, m, j] = d.split('-');
  const jour = JOURS[new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(j, 10)).getDay()];
  return `${jour} ${j}/${m}/${y}`;
}

function fmtCardDate(d) {
  if (!d) return { day: '', month: '', jour: '' };
  const [y, m, j] = d.split('-');
  const jour = JOURS[new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(j, 10)).getDay()];
  return { day: j, month: MOIS[parseInt(m, 10) - 1], jour };
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

if (typeof module !== 'undefined') {
  module.exports = {
    stripAccents, trunc,
    normCommune, normalizeCommune,
    normalizeDate, normalizeHoraire, fmtDate, fmtCardDate, todayLocal,
    normalizeMat, matIncludes,
    escapeICS, foldICSLine, parseHoraireICS, parseDateICS, buildICS,
    MOIS, JOURS, COMMUNE_MAP,
  };
}
