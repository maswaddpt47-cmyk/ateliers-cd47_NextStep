// Fonctions pures extraites de shared.js — testables avec Node.js (node --test)
// Ces fonctions ne dépendent ni du DOM, ni de React, ni d'un état mutable.

// ── Constantes partagées ───────────────────────────────────
const MOIS  = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const COMMUNE_MAP = {
  'TEMPLE SUR LOT':'LE TEMPLE SUR LOT',
  'VILLENEUVE-SUR-LOT':'VILLENEUVE SUR LOT',
};

// ── Communes ───────────────────────────────────────────────
function normCommune(s){
  if(!s)return'';
  return s.replace(/\s*\(\d+\)\s*/g,'').trim();
}
function normalizeCommune(c){
  const stripped=normCommune(String(c||'').toUpperCase());
  return COMMUNE_MAP[stripped]||stripped||String(c||'').trim();
}

// ── Texte ──────────────────────────────────────────────────
function stripAccents(str){
  return String(str||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
}
// Libellés de graphiques : n caractères au plus, « … » compris.
function trunc(s,n){
  s=String(s||'');
  return s.length>n?s.slice(0,n-1)+'…':s;
}
function htmlEsc(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Dates ──────────────────────────────────────────────────
function todayLocal(){
  const d=new Date();
  return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function normalizeDate(val){
  if(!val)return'';
  const s=String(val).trim();
  if(/^\d{4}-\d{2}-\d{2}$/.test(s))return s;
  if(/^\d{4}-\d{2}-\d{2}T/.test(s))return s.split('T')[0];
  const m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if(m)return`${m[3]}-${m[2]}-${m[1]}`;
  return s;
}
function normalizeHoraire(val){
  if(!val)return'';
  const s=String(val).trim();
  const iso=s.match(/T(\d{2}:\d{2})/);
  if(iso)return iso[1];
  if(/^\d{1,2}[Hh]\d{2}$/.test(s))return s.replace(/[Hh]/,':');
  if(/^\d{1,2}:\d{2}(:\d{2})?$/.test(s))return s.slice(0,5);
  return s;
}
function fmtDate(d){
  if(!d)return'';
  // normalizeDate tronque un éventuel suffixe ISO datetime (T10:00:00.000Z) —
  // GAS peut renvoyer ce format pour une colonne Date non explicitement
  // formatée côté serveur (v11.33 : date_retour_materiel notamment).
  d=normalizeDate(d);
  const[y,m,j]=d.split('-');
  const jour=JOURS[new Date(parseInt(y,10),parseInt(m,10)-1,parseInt(j,10)).getDay()];
  return`${jour} ${j}/${m}/${y}`;
}
function addJoursIso(d,n){
  if(!d)return'';
  const[y,m,j]=d.split('-').map(Number);
  const dt=new Date(y,m-1,j+n);
  return`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
}
function fmtCardDate(d){
  if(!d)return{day:'',month:'',jour:''};
  const[y,m,j]=d.split('-');
  const jour=JOURS[new Date(parseInt(y,10),parseInt(m,10)-1,parseInt(j,10)).getDay()];
  return{day:j,month:MOIS[parseInt(m,10)-1],jour};
}

// ── Export ICS ─────────────────────────────────────────────
function escapeICS(s){
  return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
}
function foldICSLine(line){
  if(line.length<=75)return line;
  const c=[];
  c.push(line.slice(0,75));
  let i=75;
  while(i<line.length){c.push(' '+line.slice(i,i+74));i+=74;}
  return c.join('\r\n');
}
function parseHoraireICS(h){
  const s=String(h||'09H00').toUpperCase().replace('H',':');
  const p=s.split(':');
  return{hh:String(parseInt(p[0]||9,10)).padStart(2,'0'),mm:String(parseInt(p[1]||0,10)).padStart(2,'0')};
}
function parseDateICS(d){
  const m=String(d||'').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m?{y:m[1],mo:m[2],j:m[3]}:null;
}
function buildICS(evts){
  const out=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Ateliers Numerique 47//FR','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
  for(const e of evts){
    const pd=parseDateICS(e.date);if(!pd)continue;
    const{hh,mm}=parseHoraireICS(e.horaire);
    const startH=parseInt(hh,10);
    const dts=`${pd.y}${pd.mo}${pd.j}T${hh}${mm}00`;
    let dte;
    if(startH<23){dte=`${pd.y}${pd.mo}${pd.j}T${String(startH+1).padStart(2,'0')}${mm}00`;}
    else{const next=new Date(parseInt(pd.y,10),parseInt(pd.mo,10)-1,parseInt(pd.j,10)+1);dte=`${next.getFullYear()}${String(next.getMonth()+1).padStart(2,'0')}${String(next.getDate()).padStart(2,'0')}T000000`;}
    const summary=escapeICS([e.thematique,e.commune].filter(Boolean).join(' | '));
    const location=escapeICS([e.lieu,e.commune].filter(Boolean).join(', '));
    const descParts=[
      e.conseiller&&'Conseiller : '+e.conseiller,
      e.orienteur&&'Orienteur : '+e.orienteur,
      e.statut&&'Statut : '+e.statut,
      e.public&&'Public : '+e.public,
      (e.inscrits!==''&&e.inscrits!=null)&&'Inscrits : '+e.inscrits,
      (e.presents!==''&&e.presents!=null)&&'Présents : '+e.presents,
      e.remarques&&'Remarques : '+e.remarques,
    ].filter(Boolean);
    out.push('BEGIN:VEVENT','DTSTART:'+dts,'DTEND:'+dte,'SUMMARY:'+summary);
    if(location)out.push('LOCATION:'+location);
    if(descParts.length)out.push('DESCRIPTION:'+escapeICS(descParts.join('\n')));
    out.push('UID:'+e._id+'@ateliers-newgen','END:VEVENT');
  }
  out.push('END:VCALENDAR');
  return out.map(foldICSLine).join('\r\n') + '\r\n';
}

// Sortie compacte du Journal, à coller dans une conversation avec Claude.
// Coller 200 lignes brutes coûte cher et noie l'information : ce qui sert au
// diagnostic, c'est le taux de perte, le temps réellement passé à attendre
// des réponses mortes, et SURTOUT la répartition dans le temps — la panne de
// livraison Apps Script frappe par fenêtres (mesuré le 18/09/2026), pas par
// appel. L'appli est nommée dans l'en-tête : les deux journaux sont
// identiques à l'écran, et des mesures ont déjà été attribuées au mauvais
// projet le 19/09/2026.
function resumeLogsTexte(logs, appli){
  var gas = (logs||[]).filter(function(l){ return l && typeof l.msg === 'string' && /^(GAS|API) /.test(l.msg); });
  if(!gas.length) return 'JOURNAL ' + appli + ' : aucun appel serveur enregistré.';
  var lus = [];
  gas.forEach(function(l){
    // Suffixe « (file N s) » toléré : lignes journalisées du 22 au 23/09/2026.
    var m = l.msg.match(/^(?:GAS|API) (\S+) #(\S+) — (.+) en ([\d.]+) s(?: \(file [\d.]+ s\))?$/);
    if(!m) return;
    var d = l.ts ? new Date(l.ts) : null;
    lus.push({
      action: m[1], essai: m[2], motif: m[3], sec: parseFloat(m[4]),
      // 'annulé' : le jumeau a repondu, l'appel a ete arrete. Ni reussite ni
      // perte — il sort des deux comptes (AG-006).
      annule: m[3].indexOf('annulé') === 0,
      ko: m[3].indexOf('ok') !== 0 && m[3].indexOf('annulé') !== 0 && m[3].indexOf('serveur') !== 0,
      // Refus serveur (ok:false, motif « serveur : ») : livre, donc ni une
      // perte ni un succes — compte a part (AG-004, 22/09/2026).
      refus: m[3].indexOf('serveur') === 0,
      // Le doublon d'une lecture porte le numero de son jumeau suivi de 'b'
      // (gasLectureDoublee, shared.js). C'est la seule trace du doublage dans
      // le journal, et elle suffit a le mesurer — voir plus bas.
      doublon: /b$/.test(m[2]),
      heure: l.t || (d ? d.toLocaleTimeString('fr-FR') : '?'),
      h: d ? ('0' + d.getHours()).slice(-2) : '??',
      jour: d ? d.toLocaleDateString('fr-FR', {day:'2-digit', month:'2-digit'}) : ''
    });
  });
  if(!lus.length) return 'JOURNAL ' + appli + ' : ' + gas.length + ' lignes d\'appel, aucune au format attendu.';
  var ko = lus.filter(function(x){ return x.ko; });
  var refus = lus.filter(function(x){ return x.refus; });
  var okSec = lus.filter(function(x){ return !x.ko && !x.annule && !x.refus; }).map(function(x){ return x.sec; }).sort(function(a,b){ return a-b; });
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
  l.push('JOURNAL ' + appli + ' — ' + lus.length + ' appels serveur');
  l.push('periode (heure locale) : ' + prem.jour + ' ' + prem.heure + ' -> ' + der.jour + ' ' + der.heure);
  var reels = lus.filter(function(x){ return !x.annule; });
  l.push('perdus : ' + ko.length + '/' + reels.length + ' (' + Math.round(ko.length/reels.length*100) + '%)'
    + (reels.length !== lus.length ? '  [+' + (lus.length-reels.length) + ' doublons annules, hors compte]' : ''));
  if(refus.length) l.push('refus serveur (livres, hors pertes) : ' + refus.length + ' — '
    + refus.slice(0, 5).map(function(x){ return x.heure + ' ' + x.action + ' ' + x.motif; }).join(' | '));
  l.push('durees livrees : mediane ' + med.toFixed(1) + 's | p90 ' + p90.toFixed(1) + 's');
  l.push('temps passe a attendre des reponses mortes : ' + Math.round(perdu) + 's');
  // ── Ce que rapporte le doublage, et pourquoi le taux ci-dessus trompe ──
  // Quand l'un des deux appels aboutit, gasLectureDoublee ANNULE l'autre, et
  // un appel annule n'est pas journalise (shared.js, branche ctrl.inutile).
  // Consequence, relevee le 22/09/2026 : si le doublon gagne, l'original
  // perdu DISPARAIT du journal. Le taux de pertes affiche ci-dessus est donc
  // SOUS-ESTIME ici, alors qu'il est complet sur ateliers-cd47_NextStep, qui
  // ne double pas. Ne jamais comparer les deux taux directement.
  // En contrepartie, chaque ligne « #Nb ok » est une lecture que le doublage a
  // sauvee : le doublon n'est lance qu'au bout de GAS_HEDGE_MS, et s'il gagne
  // c'est que l'original n'avait toujours pas repondu.
  var doublons = lus.filter(function(x){ return x.doublon; });
  if(doublons.length){
    var sauves = doublons.filter(function(x){ return !x.ko && !x.annule && !x.refus; }).length;
    var dAnnules = doublons.filter(function(x){ return x.annule; }).length;
    // « non annules » et non « partis » : un doublon annule par un original
    // tardif ne comptait pas, ce qui rendait ce taux incomparable a celui du
    // banc, calcule lui sur ok/(ok+ko+annules) — AG-006, amendements 2 et 3.
    l.push('doublons non annules : ' + (doublons.length - dAnnules)
      + ' — ' + sauves + ' ont sauve la lecture, '
      + (doublons.length - dAnnules - sauves) + ' en echec'
      + (dAnnules ? '  (+' + dAnnules + ' annules, le jumeau avait repondu)' : ''));
    // Le taux de sauvetage n'est pas une constante de la strategie : si les
    // pertes etaient independantes, un doublon reussirait avec la probabilite
    // 1 - p. Le rapport des deux dit lequel des deux modeles colle :
    // proche de 1 = pertes independantes, nettement < 1 = pertes correlees
    // dans le temps, et c'est la que le doublage rapporte le moins.
    var base = doublons.length - dAnnules;
    if(base){
      var tauxSauv = sauves / base;
      var attendu = 1 - (ko.length / reels.length);
      l.push('  taux de sauvetage ' + Math.round(tauxSauv*100) + '%'
        + ' vs ' + Math.round(attendu*100) + '% attendu si les pertes etaient independantes'
        + (attendu > 0 ? '  (rapport ' + (tauxSauv/attendu).toFixed(2) + ')' : ''));
      l.push('  a lire avec le taux de pertes du meme releve, jamais seul :'
        + ' il suit 1 - pertes, ce n est pas une constante du doublage');
    }
  }else{
    l.push('doublons non annules : aucun — toutes les lectures ont repondu avant le doublage');
  }
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

// ── Années chargées (AG-007, 23/09/2026) ────────────────────────────────────
// La valeur d'année est une chaîne « 2026 » ou « 2026,2027 » (plusieurs années
// chargées en un seul appel getAll?years=). Stockée telle quelle dans f_annee :
// une ancienne valeur « 2026 » se relit sans migration.
function anneesListe(s) {
  var vues = {}, l = [];
  String(s || '').split(',').forEach(function (x) {
    x = String(x).trim();
    if (/^\d{4}$/.test(x) && !vues[x]) { vues[x] = true; l.push(x); }
  });
  l.sort();
  return l.length ? l : [String(new Date().getFullYear())];
}
// Année de référence des vues qui n'en gèrent qu'une (Roadmap, Admin) :
// l'année EN COURS si elle est chargée, sinon la plus récente. « La plus
// récente » seule ouvrait Roadmap sur 2027 en septembre 2026, activité réelle
// hors plage (AG-007, amendement de la session B, point 3).
function anneeReference(s) {
  var l = anneesListe(s), c = String(new Date().getFullYear());
  return l.indexOf(c) >= 0 ? c : l[l.length - 1];
}
function anneeIncluse(s, date) { return anneesListe(s).indexOf(String(date || '').slice(0, 4)) >= 0; }
if (typeof window !== 'undefined') {
  window.anneesListe = anneesListe; window.anneeReference = anneeReference;
  window.anneeIncluse = anneeIncluse;
}

// Une suppression dont la réponse s'est perdue a quand même été faite : son
// renvoi automatique reçoit alors « Entrée introuvable » (constaté le
// 23/09/2026 : delete #1 perdu à 12 s, #2 refusé, ❌ affiché alors que
// l'atelier avait bien disparu du classeur). L'atelier n'existe plus, c'est le
// résultat voulu. SEUL ce message compte comme réussite : « Feuille
// introuvable » reste une vraie panne.
function suppressionAboutie(res) {
  return !!res && (res.ok === true || res.error === 'Entrée introuvable');
}
if (typeof window !== 'undefined') window.suppressionAboutie = suppressionAboutie;

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
// Nom affiché dans les titres (connexion, accueil) : le code des écrans est
// identique dans les deux applis, seul APP_NS les distingue.
const NOM_APPLI = APP_NS === 'newgen' ? 'NewGen' : 'NextStep';
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
// Nom du drapeau, cloisonné comme le reste.
const LS_MIGRATION_FAITE = '_migration_faite';
function migrerLocalStorage(store) {
  if (!store) return 0;
  // UNE SEULE FOIS par navigateur. Rejouée à chaque chargement, la migration
  // ressuscitait une clé que l'utilisateur venait de supprimer : « 👤 Changer »
  // vide la clé cloisonnée, l'ancienne clé partagée existe toujours, et le
  // rechargement suivant la recopiait — l'identité quittée revenait
  // (constaté le 22/09/2026).
  try { if (store.getItem(lsKey(LS_MIGRATION_FAITE))) return 0; } catch (e) { return 0; }
  var n = 0;
  LS_A_MIGRER.forEach(function (k) {
    try {
      if (store.getItem(lsKey(k)) === null && store.getItem(k) !== null) {
        store.setItem(lsKey(k), store.getItem(k));
        n++;
      }
    } catch (e) {}
  });
  try { store.setItem(lsKey(LS_MIGRATION_FAITE), String(Date.now())); } catch (e) {}
  return n;
}
if (typeof window !== 'undefined') {
  try { migrerLocalStorage(window.localStorage); } catch (e) {}
}

// ── Anomalie de chiffres : plus de présents que d'inscrits ───────────────────
// Repris de l'ancienne « Vérification cohérence » de l'Admin (retirée le
// 25/09/2026) : seul de ses contrôles que l'onglet Anomalies ne faisait pas.
// Ici et non dans logic.js : NEWGEN ne charge pas logic.js dans ses pages.
// Un champ vide ou non numérique n'est pas une anomalie de chiffres.
function presentsSuperieursInscrits(e) {
  const txt = v => String(v == null ? '' : v).trim();
  if (!/^\d+$/.test(txt(e && e.presents)) || !/^\d+$/.test(txt(e && e.inscrits))) return false;
  return parseInt(txt(e.presents), 10) > parseInt(txt(e.inscrits), 10);
}

// Ordre de l'Historique : date (sens choisi par l'utilisateur), puis, pour
// une même date, ordre chronologique (horaire), puis orienteur pour
// départager deux ateliers à la même heure — toujours croissants. Sans ça,
// deux ateliers du même jour sortaient dans l'ordre d'enregistrement
// (demande de l'utilisateur, 26/09/2026). Horaire ou orienteur vide en dernier.
function comparerHistorique(a, b, sens) {
  const s = sens === -1 ? -1 : 1;
  const da = (a && a.date) || '', db = (b && b.date) || '';
  if (da !== db) return da < db ? -s : s;
  const h = e => String((e && e.horaire) || '').trim().replace(/^(\d):/, '0$1:');
  const ha = h(a), hb = h(b);
  if (ha !== hb) {
    if (!ha) return 1;
    if (!hb) return -1;
    return ha < hb ? -1 : 1;
  }
  const oa = String((a && a.orienteur) || '').trim(), ob = String((b && b.orienteur) || '').trim();
  if (oa === ob) return 0;
  if (!oa) return 1;
  if (!ob) return -1;
  return oa.localeCompare(ob, 'fr', { sensitivity: 'base' });
}

// AM/PM déduit de l'horaire saisi : avant 12:00 → AM, à partir de 12:00 → PM
// (même seuil que la répartition du Dashboard). Pré-remplit le champ, qui
// reste modifiable à la main (décision de l'utilisateur, 26/09/2026).
// Horaire illisible → '' (le champ n'est alors pas touché).
function ampmDepuisHoraire(h) {
  const m = /^\s*(\d{1,2})\s*[:hH]/.exec(String(h == null ? '' : h));
  if (!m) return '';
  const heure = parseInt(m[1], 10);
  if (heure > 23) return '';
  return heure < 12 ? 'AM' : 'PM';
}

// Tuiles de l'Historique (demande de l'utilisateur, 26/09/2026) : calculées
// sur la liste filtrée SANS le filtre de statut, sinon « Total » ne comptait
// que le statut affiché et Réalisés/Annulés tombaient à 0. Pourcentages sur le
// total. Reportés + Non réalisés regroupés en « autres ». Inscrits et présents
// comptés sur les seuls ateliers réalisés : le taux de présence n'a de sens
// que pour un atelier qui a eu lieu.
// Matériel d'un atelier d'après la case « Classe mobile » du panneau latéral
// (26/09/2026) : ajoute ou retire la Classe mobile, garde le reste. Accepte
// une liste ou un texte « a|b ». Renvoie toujours une liste.
function matierePanneau(entree, mobile) {
  const norm = x => String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').replace(/s$/, '');
  const brut = entree && entree.materiel;
  const mat = Array.isArray(brut) ? brut : String(brut || '').split('|').map(x => x.trim()).filter(Boolean);
  const sans = mat.filter(m => norm(m) !== 'classemobile');
  return mobile ? [...sans, 'Classe mobile'] : sans;
}

// Anomalie : des ordinateurs prêtés saisis sans « Classe mobile » cochée
// (26/09/2026). Ce nombre n'est compté nulle part dans le stock : à corriger
// (cocher la case, ou vider le nombre).
function ordiSansClasseMobile(e) {
  if (!e || !(parseInt(e.nb_ordinateurs, 10) > 0)) return false;
  const liste = Array.isArray(e.materiel) ? e.materiel
    : String(e.materiel || '').split('|').map(x => x.trim()).filter(Boolean);
  // matierePanneau(…, false) retire la Classe mobile : rien de retiré = absente.
  return matierePanneau(e, false).length === liste.length;
}

// Conflits de matériel où figurerait un atelier modifié, avant de
// l'enregistrer (panneau latéral de l'Historique et du Calendrier, 26/09/2026 :
// date et ordinateurs y sont modifiables, sans passer par le formulaire).
// Les deux détecteurs sont passés en paramètre : ils vivent dans shared.js
// (pages) et logic.js (tests). Avertissement seulement, jamais bloquant.
function conflitsDeLEntree(entries, entree, trouverOrdi, trouverMobile) {
  const liste = (entries || []).filter(e => e._id !== entree._id).concat([entree]);
  const concerne = g => (g.entries || []).some(x => x && x._id === entree._id);
  return {
    ordi: (typeof trouverOrdi === 'function' ? trouverOrdi(liste) : []).filter(concerne),
    mobile: (typeof trouverMobile === 'function' ? trouverMobile(liste) : []).filter(concerne),
  };
}

function kpiHistorique(liste) {
  const k = { total: 0, planifies: 0, realises: 0, annules: 0, autres: 0, inscrits: 0, presents: 0 };
  (liste || []).forEach(e => {
    k.total++;
    const s = (e && e.statut) || '';
    if (s === 'Planifié') k.planifies++;
    else if (s === 'Réalisé') {
      k.realises++;
      k.inscrits += parseInt(e.inscrits, 10) || 0;
      k.presents += parseInt(e.presents, 10) || 0;
    } else if (s === 'Annulé') k.annules++;
    else k.autres++;
  });
  const pct = n => (k.total ? Math.round(n / k.total * 100) : 0);
  k.pct = { planifies: pct(k.planifies), realises: pct(k.realises), annules: pct(k.annules), autres: pct(k.autres) };
  k.tx = k.inscrits ? Math.round(k.presents / k.inscrits * 100) : 0;
  return k;
}


// ── Matériel (déplacé de shared.js le 26/09/2026, AG-015 lot 0) ─────────────
// Versions exécutées par NEWGEN, reprises telles quelles. NextStep a les
// siennes (utils.js) : écart à aligner au lot 1, pas ici.
function normalizeMat(s){return stripAccents(s).replace(/\s+/g,'').replace(/s$/,'');}
// Le format « a|b » (époque GAS) est accepté : l'API renvoie des tableaux
// (api/lib/api.php:339), mais une chaîne rendait « aucun conflit » en silence
// — logic.test.js l'exigeait d'une version que les pages n'exécutaient pas.
function matIncludes(arr,m){if(typeof arr==='string')arr=arr.split('|').filter(Boolean);if(!Array.isArray(arr))return false;const nm=normalizeMat(m);return arr.some(x=>x===m||normalizeMat(x)===nm);}
if (typeof module !== 'undefined') {
  module.exports={
    normalizeMat, matIncludes,
    normCommune,normalizeCommune,stripAccents,htmlEsc,trunc,
    normalizeDate,normalizeHoraire,fmtDate,fmtCardDate,todayLocal,addJoursIso,
    escapeICS,foldICSLine,parseHoraireICS,parseDateICS,buildICS,
    resumeLogsTexte,
    suppressionAboutie,
    anneesListe,
    anneeReference,
    anneeIncluse,
  lsKey, migrerLocalStorage, LS_A_MIGRER,
  comparerHistorique,
  ampmDepuisHoraire,
  kpiHistorique,
  conflitsDeLEntree,
  matierePanneau,
  ordiSansClasseMobile,
    presentsSuperieursInscrits,
  };
}
