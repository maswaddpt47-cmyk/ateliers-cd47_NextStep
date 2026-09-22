
// ── GAS Backend v10.18.0 ──────────────────────────────────────
// v10.18.0 : keepAlive ne prend plus le verrou de script (AG-004 tranché le
//            22/09/2026) : un keepAlive bloqué 8 min par la plateforme aurait
//            refusé toutes les écritures pendant 8 min. Anti-empilement par
//            drapeau CacheService. Voir le commentaire au-dessus de keepAlive.
// v10.16.0 : PERF — keepAlive relisait la feuille ENTIÈRE toutes les 5 min,
//            24 h/24, sans regarder si le cache était déjà chaud : ~288
//            lectures complètes par jour, la quasi-totalité pour rien.
//            ATELIERS_NEWGEN portait déjà les deux garde-fous qui manquaient
//            ici — `tryLock(0)` (jamais deux exécutions empilées) et le saut
//            immédiat quand `_lireCacheGetAll` répond. Alignement.
//            (Le tryLock(0) de cette version est retiré en v10.18.0.)
// ⚠️ CETTE COPIE EST EN AVANCE SUR LA PRODUCTION (22/09/2026).
//    v10.15.0 et v10.14.0 ne sont PAS déployées. Le déploiement se fait à la
//    main (script.google.com → coller ce fichier → publier une version), voir
//    gas/README.md. Tant que ce bandeau est là, le verrou d'écriture décrit
//    ci-dessous n'existe pas en ligne. Le retirer une fois le déploiement
//    confirmé, pas avant.
//
// v10.15.0 : SÉCURITÉ DONNÉES — verrou serveur sur les trois actions qui
//            modifient la feuille Ateliers (saveEntry, saveMany, delete), via
//            LockService.getScriptLock().waitLock(20 s) et releaseLock() en
//            finally. Jusqu'ici RIEN ne les protégeait côté serveur : la
//            sérialisation vivait dans la file d'attente du client (_gasQueue),
//            qui ne voit qu'un seul onglet — ni les autres onglets du même
//            poste, ni les autres postes de l'équipe. Deux risques réels,
//            présents aujourd'hui en production :
//              - deux saveEntry simultanés sur le même _id peuvent tous deux
//                conclure « ligne absente » et faire chacun leur appendRow
//                (atelier en double) ;
//              - deux delete simultanés : le second a lu son index AVANT la
//                suppression du premier, toutes les lignes suivantes ont
//                décalé d'un rang → il supprime ou écrase l'atelier voisin.
//            Constaté dans l'analyse AG-003 (AGORA.md, ATELIERS_NEWGEN),
//            verdict « amendé » : ce verrou est le préalable au retrait de
//            _gasQueue et au portage du doublage de lecture.
//            saveMany prend UN seul verrou pour tout le lot (pas un par
//            entrée) et renvoie l'erreur du verrou si elle survient — sans
//            cela il aurait renvoyé {ok:true} sans avoir rien écrit.
//            keepAlive ne partage PAS ce verrou (v10.18.0, AG-004).
//            Rejouer une écriture reste sûr : le client génère l'_id avant
//            l'envoi, actionSaveEntry retrouve la ligne au lieu d'en créer
//            une seconde.
// v10.14.0 : NON DÉPLOYÉ — préparé sur branche feat/port-newgen-gestion-ordi,
//            en attente d'accès à script.google.com pour déploiement.
//            Portage depuis ATELIERS_NEWGEN (v11.30-11.34) : suivi du prêt du
//            stock d'ordinateurs (Classe mobile). Deux champs simples sur
//            chaque atelier — nb_ordinateurs (quantité prêtée, saisie
//            manuelle) et date_retour_materiel (date de retour prévue) —
//            plus date_prelevement_materiel (date de retrait, peut précéder
//            la date de l'atelier). _getAllFrais formate ces deux dates comme
//            'date' (_fmtDate) au lieu de tomber dans le else générique
//            (v.toISOString(), même bug que celui trouvé et corrigé sur
//            NEWGEN v11.33 — corrigé ici directement, jamais introduit).
//            Nouvelle config 'stock_ordinateurs' (générique, via setConfig),
//            renvoyée dans getAll (stockOrdinateurs, défaut 10). Aucun
//            changement à actionSaveEntry/saveMany : les deux écrivent déjà
//            n'importe quelle colonne présente dans la feuille dont le nom
//            correspond à une clé de l'entrée (d[h]) — contrairement à
//            NEWGEN, pas de FIXED_COLS à mettre à jour ici. Migration
//            ajouterColonnesPretMateriel() à lancer une fois manuellement
//            (menu Exécuter) après déploiement — voir gas/README.md.
// v10.11.3 : FEAT — actionGetLogs renvoie maintenant le champ action (delete,
//            saveEntry, login, alertesRetard...) au frontend, qui l'affiche dans
//            une colonne dédiée de l'onglet Connexions. Auparavant impossible de
//            distinguer une ligne de suppression d'une ligne de connexion.
// v10.11.2 : CORRECTIF — actionDelete journalisait toujours 'delete' avec un
//            conseiller vide (_logAction('delete','',id) codé en dur), rendant
//            impossible de savoir qui avait supprimé un atelier en consultant
//            les logs. Le conseiller est maintenant lu sur la ligne juste avant
//            sa suppression et transmis au log.
// v10.11.1 : PRÉVENTIF — 'alertesRetard' ajouté à isFormatB dans actionGetLogs.
//            envoyerAlertesRetard() n'appelle actuellement aucun _logAction ici
//            (contrairement à NewGen), donc sans effet visible aujourd'hui —
//            corrige juste le même trou que celui trouvé et corrigé sur NewGen
//            (v11.16), pour ne pas le redécouvrir en prod si cette journalisation
//            est ajoutée un jour.
// v10.11.0 : PERF — checkPassword n'écrit plus dans Comptes (FailCount/
//            LockUntil) pour son propre rate-limit, ni ne journalise plus
//            un succès de façon synchrone : voir le commentaire détaillé
//            au-dessus de actionCheckPassword. Nouvelle action logLogin,
//            appelée en fire-and-forget par le frontend après connexion.
// v10.10.0 : SÉCURITÉ — aucune action admin (saveConfig, resetPassword,
//            saveCompte, getLogs, saveLists, saveVisibility, saveColors,
//            saveEmails, setConfig, setPassword) n'était vérifiée côté
//            serveur : la restriction "réservé aux admins" n'existait qu'à
//            l'écran (admin_app.js), donc n'importe qui connaissant l'URL
//            /exec pouvait les appeler directement sans authentification —
//            y compris lire tous les logs de connexion ou réinitialiser le
//            mot de passe d'un conseiller. checkPassword génère maintenant
//            un token (CacheService, 8h) vérifié par doGet/doPost pour
//            toute action de ADMIN_ONLY_ACTIONS. saveEntry/saveMany/delete
//            restent ouverts sans token : Index ne passe jamais par un
//            écran de connexion. Contrairement à NewGen (v11.13/14), la
//            vérification ne compare PAS le conseiller du token à un
//            paramètre "conseiller" de la requête : plusieurs actions admin
//            ciblent un AUTRE conseiller que l'admin connecté (saveCompte
//            pour activer/désactiver un compte, resetPassword pour un
//            collègue) — comparer les deux aurait bloqué ces cas d'usage
//            légitimes à chaque fois. Seul le rôle du token est vérifié.
// v10.9.8 : SS caché au scope global — openById une seule fois par instance GAS
// v10.9.7 : log source (admin.html/index.html) dans Logs_Connexion
// v10.9.6 : fix matériel — normMat par codepoint Unicode, alias pluriel, logs debug
// ✅ AUDIT SÉCURITÉ 02/09/2026 — RÉSOLU 15/09/2026 : saveEntry/saveMany/delete
// étaient accessibles sans aucun token, y compris en simple GET. Testé en
// conditions réelles sur le sandbox index2.html (v10.13.0, verrou scopé
// source==='index2') avant promotion en production le 15/09 : voir
// _checkStrictWrite plus bas, désormais inconditionnel (index.html a un
// login depuis cette même date). Même architecture que ATELIERS_NEWGEN
// (OPEN_WRITE_ACTIONS fermé, gas/GAS_NEWGEN.js).
var SS_ID = '1WQdb2PQ40600CW9eaIQ_mKUEqLU3FQPdaAi3W0eW-mo';
// Actions qui exigent désormais un token valide ET un rôle admin/superviseur.
var ADMIN_ONLY_ACTIONS = [
  'saveLists','saveConfig','setConfig',
  'saveVisibility','saveColors','saveEmails',
  'saveCompte','resetPassword','setPassword',
  'getLogs'
];
var ADMIN_ROLES = ['admin','superviseur'];
// v10.12.1 : CORRECTIF — tokens passés de CacheService à PropertiesService.
// Contexte, hypothèse non vérifiée avec certitude sur CE script précis (pas
// d'accès aux Exécutions Apps Script depuis cette session) : "Non autorisé :
// Token invalide ou expiré" observé en production sur l'onglet Connexions
// (admin.html), 21/08. Deux éléments objectifs, eux confirmés dans ce
// fichier avant correctif : (1) même symptôme exact que l'incident résolu
// sur ATELIERS_NEWGEN le même jour, où CacheService.put() suivi d'un get()
// dans la même exécution s'est avéré échouer systématiquement (preuve
// directe obtenue via un diagnostic temporaire, voir historique NEWGEN) ;
// (2) TOKEN_TTL_SECONDS valait ici 8*60*60 (28800s), au-dessus de la limite
// documentée de CacheService.put() (21600s/6h max) — exactement la même
// configuration fautive que NEWGEN avant son correctif. Le rate-limit de
// connexion (rlKey/rlData dans actionCheckPassword) reste sur CacheService
// à dessein, comme sur NEWGEN : donnée courte durée (16 min), un échec de
// lecture y est sans gravité (au pire un verrou de brute-force ne "prend"
// pas), contrairement au token qui bloque tout accès si sa lecture échoue.
var TOKEN_TTL_SECONDS = 6 * 60 * 60;
function _generateToken(conseiller, role){
  var token = Utilities.getUuid();
  var props = PropertiesService.getScriptProperties();
  var now = new Date().getTime();
  var payload = JSON.stringify({conseiller:conseiller, role:role, ts:now, exp:now + TOKEN_TTL_SECONDS*1000});
  props.setProperty('token_' + token, payload);
  return token;
}
// Ne vérifie que la validité du token et le rôle qu'il porte — jamais une
// correspondance avec un paramètre "conseiller" de la requête (voir note
// v10.10.0 ci-dessus sur les actions admin ciblant un autre conseiller).
// PropertiesService n'a pas de TTL natif comme CacheService.put() : l'expiration
// est vérifiée manuellement via le champ exp du payload, propriété nettoyée
// si dépassée.
function _verifyToken(token){
  if(!token) return {ok:false, error:'Token manquant'};
  var props = PropertiesService.getScriptProperties();
  var raw = props.getProperty('token_' + token);
  if(!raw) return {ok:false, error:'Token invalide ou expiré'};
  try{
    var payload = JSON.parse(raw);
    if(payload.exp && new Date().getTime() > payload.exp){
      props.deleteProperty('token_' + token);
      return {ok:false, error:'Token expiré'};
    }
    return {ok:true, role:payload.role, conseiller:payload.conseiller};
  }catch(_){ return {ok:false, error:'Token corrompu'}; }
}
function _requireAdminRole(p){
  var tokenCheck = _verifyToken(p.token);
  if(!tokenCheck.ok) return {ok:false, error:'Non autorisé : ' + tokenCheck.error};
  if(ADMIN_ROLES.indexOf(tokenCheck.role) === -1) return {ok:false, error:'Non autorisé : réservé aux administrateurs'};
  return {ok:true};
}
// v10.13.0 : verrou token sur saveEntry/saveMany/delete. Testé d'abord scopé
// au sandbox index2.html (p.source==='index2', déployé et validé en
// conditions réelles le 15/09/2026 — token valide accepté, token absent/
// invalide rejeté, zéro régression sur index.html qui n'envoyait jamais ce
// paramètre). index2 promu en index.html officiel le même jour : le
// scoping par source n'a plus lieu d'être, la vérification s'applique
// maintenant à toute requête, quelle que soit son origine (index.html et
// admin.html ont tous deux un login désormais, donc un token dès qu'un
// utilisateur est connecté).
var STRICT_WRITE_ACTIONS = ['saveEntry','saveMany','delete'];
function _checkStrictWrite(p, action){
  if(STRICT_WRITE_ACTIONS.indexOf(action) === -1) return {ok:true};
  var tokenCheck = _verifyToken(p.token);
  if(!tokenCheck.ok) return {ok:false, error:'Non autorisé : ' + tokenCheck.error};
  return {ok:true};
}
// CORRECTION 1 — ouverture paresseuse du classeur.
// `var SS = SpreadsheetApp.openById(SS_ID)` au scope global ne conserve rien
// entre les requetes : Apps Script reevalue tout le fichier a CHAQUE appel,
// donc openById s'executait avant doGet pour toutes les actions, meme celles
// qui n'y touchent pas. Ici l'ouverture n'a lieu qu'au premier usage reel.
var _SS_CACHE = null;
function _ss(){
  if(!_SS_CACHE) _SS_CACHE = SpreadsheetApp.openById(SS_ID);
  return _SS_CACHE;
}
// CORRECTION 2 — cache de reponse, decoupe en segments.
// getAll relit tout le classeur a chaque appel. CacheService refuse toute
// valeur > 100 Ko (put() leve "Argument too large: value" — confirme en
// production), et le JSON d'une annee complete depasse cette limite meme
// apres retrait des colonnes materiel redondantes (CORRECTION 5). Chaque
// annee est donc stockee sous plusieurs cles getAll_<annee>_p0, _p1... plus
// une cle getAll_<annee>_n qui indique le nombre de segments, et recombinee
// a la lecture (_lireCacheGetAll). Ecriture centralisee dans _cacherGetAll,
// utilisee a la fois par doGet et par keepAlive.
var CACHE_CHUNK_SIZE = 80000; // marge large sous la limite reelle de 100 Ko (102400 octets)
function _viderCache(){
  try{
    var cache = CacheService.getScriptCache();
    var an = new Date().getFullYear();
    [an-1, an, an+1].forEach(function(y){ _viderCacheAnnee(cache, String(y)); });
  }catch(_){}
}
function _viderCacheAnnee(cache, an){
  try{
    var nbStr = cache.get('getAll_' + an + '_n');
    var nb = nbStr ? parseInt(nbStr,10) : 6; // marge si compteur absent/deja expire
    var cles = ['getAll_' + an, 'getAll_' + an + '_n']; // 'getAll_'+an : compat ancien format non decoupe
    for(var i=0;i<nb;i++) cles.push('getAll_' + an + '_p' + i);
    cache.removeAll(cles);
  }catch(_){}
}
function _lireCacheGetAll(an){
  var cache = CacheService.getScriptCache();
  var nbStr = cache.get('getAll_' + an + '_n');
  if(!nbStr) return null;
  var nb = parseInt(nbStr, 10);
  if(!nb || nb < 1) return null;
  var cles = [];
  for(var i=0;i<nb;i++) cles.push('getAll_' + an + '_p' + i);
  var segments = cache.getAll(cles);
  var out = '';
  for(var j=0;j<nb;j++){
    var seg = segments['getAll_' + an + '_p' + j];
    if(seg === undefined || seg === null) return null; // segment manquant/expire : cache miss
    out += seg;
  }
  return out;
}
function _cacherGetAll(an, frais){
  if(!frais || !frais.ok) return false;
  var payload = JSON.stringify(frais);
  Logger.log('cache getAll ' + an + ' : payload=' + payload.length + ' caracteres');
  var nb = Math.max(1, Math.ceil(payload.length / CACHE_CHUNK_SIZE));
  var valeurs = {};
  valeurs['getAll_' + an + '_n'] = String(nb);
  for(var i=0;i<nb;i++){
    valeurs['getAll_' + an + '_p' + i] = payload.substr(i*CACHE_CHUNK_SIZE, CACHE_CHUNK_SIZE);
  }
  try{
    CacheService.getScriptCache().putAll(valeurs, 600);
    Logger.log('cache getAll ' + an + ' : ECRIT OK (' + nb + ' segment(s))');
    return true;
  }catch(err){
    Logger.log('cache getAll ' + an + ' : ECHEC put() — ' + err);
    return false;
  }
}
// CORRECTION 3 — formatage des dates en JavaScript pur.
// Utilities.formatDate est un appel de service facture au coup par coup. Dans
// la boucle de getAll il partait 2 fois par ligne : sur 212 ateliers cela fait
// plus de 400 appels de service, soit l'essentiel des 12 a 16 s mesurees. Le
// fuseau du script etant Europe/Paris, les accesseurs locaux de Date donnent
// exactement le meme resultat sans aucun appel de service.
function _fmtDate(d){
  var m = d.getMonth()+1, j = d.getDate();
  return d.getFullYear() + '-' + (m<10?'0':'') + m + '-' + (j<10?'0':'') + j;
}
function _fmtHeure(d){
  var h = d.getHours(), mi = d.getMinutes();
  return (h<10?'0':'') + h + ':' + (mi<10?'0':'') + mi;
}
var APP_URL = 'https://maswaddpt47-cmyk.github.io/ateliers-cd47_NextStep/';
function json(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
function doGet(e){
  var p = e.parameter || {};
  var action = p.action || 'getAll';
  if(action === 'getAll'){
    // Cache lu avant tout travail : une reponse servie ici coute ~200 ms.
    var an = p.year || String(new Date().getFullYear());
    var enCache = null;
    try{ enCache = _lireCacheGetAll(an); }catch(_){}
    if(enCache){
      Logger.log('cache getAll ' + an + ' : HIT (' + enCache.length + ' caracteres)');
      return ContentService.createTextOutput(enCache)
        .setMimeType(ContentService.MimeType.JSON);
    }
    var frais = _getAllFrais(p);
    _cacherGetAll(an, frais);
    return json(frais);
  }
  if(ADMIN_ONLY_ACTIONS.indexOf(action) !== -1){
    var roleCheck = _requireAdminRole(p);
    if(!roleCheck.ok) return json(roleCheck);
  }
  var strictCheck = _checkStrictWrite(p, action);
  if(!strictCheck.ok) return json(strictCheck);
  return json(handleAction(p));
}
// Le mode maintenance n'est jamais mis en cache : il sort de _getAllFrais avec
// ok:false, donc la branche ci-dessus ne le stocke pas.
function _getAllFrais(p){
    try{
      var ss = _ss();
      var year = p.year || String(new Date().getFullYear());
      var cfg = {};
      try{
        var cfgSh = ss.getSheetByName('Config');
        if(cfgSh){
          var cfgData = cfgSh.getDataRange().getValues();
          cfgData.forEach(function(r){ if(r[0]) cfg[String(r[0]).trim()] = r[1]; });
        }
      }catch(_){}
      var isAdmin = (p.source === 'admin');
      if(!isAdmin && (cfg['maintenance']==='true'||cfg['maintenance']===true||cfg['maintenance']==='TRUE')){
        return {ok:false,maintenance:true,msg:cfg['maintenance_msg']||''};
      }
      var lists = {statuts:[],conseillers:[],publics:[],materiels:[]};
      if(cfg['list_statuts']||cfg['list_conseillers']){
        lists.statuts     = _parseList(cfg['list_statuts']);
        lists.conseillers = _parseList(cfg['list_conseillers']);
        lists.publics     = _parseList(cfg['list_publics']);
        lists.materiels   = _parseList(cfg['list_materiels']);
      } else if(cfg['lists']){
        try{
          var ol = JSON.parse(cfg['lists']);
          lists.statuts     = ol.statuts     || [];
          lists.conseillers = ol.conseillers || [];
          lists.publics     = ol.publics     || [];
          lists.materiels   = ol.materiels   || [];
        }catch(_){}
      }
      var visibility = {};
      try{ if(cfg['visibility']) visibility = JSON.parse(cfg['visibility']); }catch(_){}
      var conseiller_colors = {};
      try{ if(cfg['conseiller_colors']) conseiller_colors = JSON.parse(cfg['conseiller_colors']); }catch(_){}
      var emails = {};
      try{ if(cfg['emails']) emails = JSON.parse(cfg['emails']); }catch(_){}
      // Matériels masqués du formulaire de saisie sans être retirés de la
      // liste canonique (lists.materiels) — reutilise l'action generique
      // setConfig pour l'ecriture, aucune nouvelle action GAS necessaire.
      var materiels_masques = [];
      try{ if(cfg['materiels_masques']) materiels_masques = JSON.parse(cfg['materiels_masques']); }catch(_){}
      // Stock d'ordinateurs prêtés (défaut 10, modifiable depuis Admin →
      // Config). parseInt sur une valeur absente/invalide retombe sur le défaut.
      var stockOrdinateurs = parseInt(cfg['stock_ordinateurs'], 10) || 10;
      var entries = [];
      try{
        var sh = ss.getSheetByName('Ateliers_next_step');
        if(sh){
          var data = sh.getDataRange().getValues();
          var headers = data[0].map(function(h){ return String(h).trim(); });
          var dateIdx = headers.indexOf('date');
          // CORRECTION 5 — retrait des colonnes materiel individuelles de la
          // reponse JSON. Ne touche ni le sheet (colonnes intactes) ni
          // l'ecriture (actionSaveEntry garde son propre MAT_COLS, inchange) :
          // uniquement la serialisation de sortie de getAll, ou ces 9 colonnes
          // ('OUI'/'') faisaient double emploi avec obj.materiel (tableau)
          // deja construit plus bas — un facteur non negligeable dans le
          // depassement probable des 100 Ko max par valeur CacheService qui
          // empeche le cache de s'ecrire (voir logs ajoutes dans doGet).
          var MAT_COLS = ['Videoprojecteur','Ecran','Classe mobile','Boitier 4G','Tablette','Scanner','Multiprise','Ordinateur','Autre'];
          var MAT_COLS_SET = {};
          MAT_COLS.forEach(function(c){ MAT_COLS_SET[c] = true; });
          for(var i=1; i<data.length; i++){
            var row = data[i];
            if(!row[0]) continue;
            if(dateIdx >= 0){
              var entryYear = '';
              try{
                var d = row[dateIdx];
                if(d instanceof Date) entryYear = String(d.getFullYear());
                else entryYear = String(d).substring(0,4);
              }catch(_){}
              if(year && entryYear !== String(year)) continue;
            }
            var obj = {};
            headers.forEach(function(h,j){
              if(MAT_COLS_SET[h]) return; // redondant avec obj.materiel, exclu de la sortie API uniquement
              var v = row[j];
              if(v instanceof Date){
                if(h === 'date' || h === 'date_retour_materiel' || h === 'date_prelevement_materiel'){
                  obj[h] = _fmtDate(v);      // etait Utilities.formatDate
                } else if(h === 'horaire'){
                  obj[h] = _fmtHeure(v);     // etait Utilities.formatDate
                } else {
                  obj[h] = v.toISOString();
                }
              } else {
                obj[h] = v;
              }
            });
            var mat = [];
            MAT_COLS.forEach(function(col){
              var idx = headers.indexOf(col);
              if(idx >= 0 && row[idx] && String(row[idx]).trim().toUpperCase() === 'OUI'){
                mat.push(col);
              }
            });
            obj['materiel'] = mat;
            entries.push(obj);
          }
        }
      }catch(err){ Logger.log('entries error: '+err); }
      return {ok:true, entries:entries, lists:lists, visibility:visibility,
              conseiller_colors:conseiller_colors, emails:emails,
              materiels_masques:materiels_masques, stockOrdinateurs:stockOrdinateurs};
    }catch(err){
      return {ok:false, error:String(err)};
    }
}
function doPost(e){
  var p = {};
  try{ p = JSON.parse(e.postData.contents); }catch(_){ p = e.parameter||{}; }
  var action = p.action || '';
  if(ADMIN_ONLY_ACTIONS.indexOf(action) !== -1){
    var roleCheck = _requireAdminRole(p);
    if(!roleCheck.ok) return json(roleCheck);
  }
  var strictCheck = _checkStrictWrite(p, action);
  if(!strictCheck.ok) return json(strictCheck);
  return json(handleAction(p));
}
function handleAction(p){
  var action = p.action||'';
  if(action==='checkPassword')   return actionCheckPassword(p);
  if(action==='saveEntry')       return actionSaveEntry(p);
  if(action==='delete')          return actionDelete(p);
  if(action==='saveLists')       return actionSaveLists(p);
  if(action==='saveConfig')      return actionSaveConfig(p);
  if(action==='setConfig')       return actionSetConfig(p);
  if(action==='getConfig')       return actionGetConfig(p);
  if(action==='getComptes')      return actionGetComptes(p);
  if(action==='saveCompte')      return actionSaveCompte(p);
  if(action==='resetPassword')   return actionResetPassword(p);
  if(action==='setPassword')     return actionSetPassword(p);
  if(action==='getLogs')         return actionGetLogs(p);
  if(action==='logLogin')        return actionLogLogin(p);
  if(action==='saveVisibility')  return actionSaveVisibility(p);
  if(action==='getVisibility')   return actionGetVisibility(p);
  if(action==='saveColors')      return actionSaveColors(p);
  if(action==='saveEmails')      return actionSaveEmails(p);
  if(action==='logAccesIndex')   return actionLogAccesIndex(p);
  if(action==='saveMany')        return actionSaveMany(p);
  if(action==='selfSetPassword') return actionSelfSetPassword(p);
  return {ok:false, error:'action inconnue: '+action};
}
// v10.12.0 : FEAT — nouvelle action selfSetPassword : un conseiller connecté
// (n'importe quel rôle) peut changer SON PROPRE mot de passe. Volontairement
// hors ADMIN_ONLY_ACTIONS — la protection vient de _verifyToken : le
// conseiller ciblé est toujours celui du token (tokenCheck.conseiller),
// jamais un p.conseiller envoyé par le client, donc impossible de changer le
// mot de passe de quelqu'un d'autre par ce chemin. Sert le nouveau flux
// "mot de passe par défaut détecté à la connexion → changement obligatoire"
// sur index2.html (sandbox, voir gas/README.md). Politique appliquée
// uniquement ici et à setPassword — pas à resetPassword, dont le mot de
// passe par défaut (cd47+prénom) est volontairement faible mais temporaire.
var PWD_POLICY_MSG = 'Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.';
function _pwdPolicyOk(pwd){
  return typeof pwd === 'string' && pwd.length >= 12 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd);
}
function actionSelfSetPassword(p){
  var tokenCheck = _verifyToken(p.token);
  if(!tokenCheck.ok) return {ok:false, error:'Non autorisé : ' + tokenCheck.error};
  var nom = tokenCheck.conseiller;
  var pwd = String(p.password||'').trim();
  if(!pwd) return {ok:false, error:'Mot de passe manquant'};
  if(!_pwdPolicyOk(pwd)) return {ok:false, error:PWD_POLICY_MSG};
  var row = _findCompte(nom);
  if(!row) return {ok:false, error:'Conseiller introuvable'};
  var sh = _ss().getSheetByName('Comptes');
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]
                  .map(function(h){return String(h).trim();});
  sh.getRange(row.rowIndex, headers.indexOf('Hash')+1).setValue(_sha256(pwd));
  return {ok:true};
}
// ── Verrou d'écriture ─────────────────────────────────────────
// Sérialise côté SERVEUR les trois actions qui modifient la feuille
// Ateliers (saveEntry, saveMany, delete). Jusqu'ici rien ne les protégeait :
// la sérialisation vivait côté client (file d'attente d'un seul onglet), donc
// elle ne voyait pas les autres onglets ni les autres postes. Deux exécutions
// simultanées peuvent :
//   - conclure toutes les deux « ligne absente » pour le même _id et faire
//     chacune leur appendRow → atelier en double ;
//   - se croiser sur un deleteRow : la seconde a lu son index AVANT la
//     suppression de la première, toutes les lignes suivantes ont décalé
//     d'un rang, elle supprime ou écrase l'atelier voisin.
// waitLock (et non tryLock) : une écriture doit attendre son tour, pas être
// abandonnée. Au-delà du délai on renvoie une erreur explicite — le client
// rejoue sans risque, il génère l'_id avant l'envoi.
// 20 s : volontairement au-delà du plafond client en écriture (12 s), pour
// couvrir un saveMany en cours (plafond client 25 s) qui tiendrait le verrou.
// Ce n'est PAS un rallongement de plafond au sens de CLAUDE.md : aucun écran
// d'attente ne s'allonge côté usager, le client abandonne toujours à 12 s. Si
// le serveur finit après cet abandon, l'écriture est bien appliquée et le
// rejeu du client la retrouve par son _id au lieu d'en créer une seconde.
var ECRITURE_LOCK_MS = 20000;
function _avecVerrouEcriture(fn) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(ECRITURE_LOCK_MS);
  } catch (e) {
    return {ok:false, error:'Écriture concurrente en cours, réessayez'};
  }
  try {
    return fn();
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
function _saveEntryInterne(p){
  var d = p;
  if(p.entry){
    try{ d = typeof p.entry === 'string' ? JSON.parse(p.entry) : p.entry; }catch(_){ d = p; }
  }
  var ss = _ss();
  var sh = ss.getSheetByName('Ateliers_next_step');
  if(!sh) return {ok:false,error:'Feuille introuvable'};
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]
                  .map(function(h){return String(h).trim();});
  var id = d._id||('entry_'+new Date().getTime()+'_'+Math.floor(Math.random()*10000));
  var isNew = !d._id;
  var rowIdx = -1;
  if(!isNew){
    var ids = sh.getRange(1,1,sh.getLastRow(),1).getValues();
    for(var i=1;i<ids.length;i++){ if(ids[i][0]===id){ rowIdx=i+1; break; } }
  }
  var materiel = d.materiel || [];
  if(typeof materiel === 'string'){
    try{ materiel = JSON.parse(materiel); }catch(_){ materiel = []; }
  }
  Logger.log('saveEntry materiel: '+JSON.stringify(materiel));
  var MAT_COLS = ['Videoprojecteur','Ecran','Classe mobile','Boitier 4G',
                  'Tablette','Scanner','Multiprise','Ordinateur','Autre'];
  function normMat(s){
    var r = String(s).trim().toLowerCase();
    var from = ['à','â','ä','é','è','ê','ë','î','ï','ô','ö','ù','û','ü','ç'];
    var to   = ['a','a','a','e','e','e','e','i','i','o','o','u','u','u','c'];
    for(var k=0;k<from.length;k++) r = r.split(from[k]).join(to[k]);
    return r;
  }
  var matSet = {};
  materiel.forEach(function(m){
    var nm = normMat(m);
    var nms = nm.replace(/s$/, '');
    MAT_COLS.forEach(function(col){
      var nc = normMat(col);
      if(nm === nc || nms === nc) matSet[col] = true;
    });
  });
  Logger.log('saveEntry matSet: '+JSON.stringify(matSet));
  var row = headers.map(function(h){
    if(h==='_id') return id;
    if(h==='_n') return isNew ? sh.getLastRow() : (d._n||'');
    if(MAT_COLS.indexOf(h) >= 0) return matSet[h] ? 'OUI' : '';
    return d[h]!==undefined ? d[h] : '';
  });
  if(rowIdx>0){
    sh.getRange(rowIdx,1,1,row.length).setValues([row]);
  } else {
    sh.appendRow(row);
  }
  _logAction('saveEntry', d.conseiller||'', id);
  _viderCache();  // CORRECTION 4
  return {ok:true, _id:id};
}
function actionSaveEntry(p) {
  return _avecVerrouEcriture(function() { return _saveEntryInterne(p); });
}
function actionSaveMany(p){
  var entries = p.entries;
  if(typeof entries === 'string'){
    try{ entries = JSON.parse(entries); }catch(_){ return {ok:false,error:'JSON invalide'}; }
  }
  if(!Array.isArray(entries)) return {ok:false,error:'entries doit être un tableau'};
  var errors = [];
  // Un seul verrou pour tout le lot (et non un par entrée) : moins d'attente,
  // et le lot ne peut pas s'entrelacer avec une autre écriture.
  var verrou = _avecVerrouEcriture(function() {
    entries.forEach(function(entry, idx){
      try{ _saveEntryInterne({entry: entry}); }
      catch(e){ errors.push({idx:idx, error:String(e)}); }
    });
    return {ok:true};
  });
  if(!verrou.ok) return verrou;  // verrou non obtenu : rien n'a été écrit
  if(errors.length > 0) return {ok:false, error:'Erreurs batch: '+JSON.stringify(errors)};
  return {ok:true, count:entries.length};
}
function _deleteInterne(p){
  var ss = _ss();
  var sh = ss.getSheetByName('Ateliers_next_step');
  if(!sh) return {ok:false,error:'Feuille introuvable'};
  var id = p._id||'';
  if(!id) return {ok:false,error:'ID manquant'};
  var ids = sh.getRange(1,1,sh.getLastRow(),1).getValues();
  for(var i=1;i<ids.length;i++){
    if(ids[i][0]===id){
      // conseiller lu sur la ligne avant suppression : _logAction('delete','',id)
      // codait ce champ en dur en chaine vide, rendant impossible de savoir qui
      // avait supprime un atelier en consultant les logs.
      var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(h){return String(h).trim();});
      var iCons = headers.indexOf('conseiller');
      var conseiller = iCons>=0 ? String(sh.getRange(i+1,iCons+1).getValue()||'') : '';
      sh.deleteRow(i+1);
      _logAction('delete',conseiller,id);
      _viderCache();
      return {ok:true};
    }
  }
  return {ok:false,error:'Entrée introuvable'};
}
function actionDelete(p) {
  return _avecVerrouEcriture(function() { return _deleteInterne(p); });
}
function actionSaveLists(p){
  var lists = p.lists ? (typeof p.lists==='string'?JSON.parse(p.lists):p.lists) : {};
  _setConfig('list_statuts',    (lists.statuts||[]).join('\n'));
  _setConfig('list_conseillers',(lists.conseillers||[]).join('\n'));
  _setConfig('list_publics',    (lists.publics||[]).join('\n'));
  _setConfig('list_materiels',  (lists.materiels||[]).join('\n'));
  (lists.conseillers||[]).forEach(function(nom){ _ensureCompte(nom); });
  return {ok:true};
}
function actionSaveConfig(p){
  var key = p.key||''; var val = p.value||'';
  if(!key) return {ok:false,error:'Clé manquante'};
  _setConfig(key,val);
  return {ok:true};
}
function actionSetConfig(p){
  var key = p.key||''; var val = p.value;
  if(!key) return {ok:false,error:'Clé manquante'};
  _setConfig(key, val!==undefined ? val : '');
  return {ok:true};
}
function actionGetConfig(p){
  var ss = _ss();
  var sh = ss.getSheetByName('Config');
  if(!sh) return {ok:false,error:'Config introuvable'};
  var data = sh.getDataRange().getValues();
  var config = {};
  data.forEach(function(r){ if(r[0]) config[String(r[0]).trim()] = r[1]; });
  return {ok:true, config:config};
}
function actionSaveVisibility(p){
  var vis = p.visibility||'{}';
  _setConfig('visibility', typeof vis==='string' ? vis : JSON.stringify(vis));
  return {ok:true};
}
function actionGetVisibility(p){
  var ss = _ss();
  var sh = ss.getSheetByName('Config');
  if(!sh) return {ok:true, visibility:{}};
  var data = sh.getDataRange().getValues();
  var vis = {};
  for(var i=0;i<data.length;i++){
    if(String(data[i][0]).trim()==='visibility'){
      try{ vis=JSON.parse(data[i][1]||'{}'); }catch(_){}
      break;
    }
  }
  return {ok:true, visibility:vis};
}
function actionSaveColors(p){
  var colors = p.colors||'{}';
  _setConfig('conseiller_colors', typeof colors==='string' ? colors : JSON.stringify(colors));
  return {ok:true};
}
function actionSaveEmails(p){
  var emails = p.emails||'{}';
  _setConfig('emails', typeof emails==='string' ? emails : JSON.stringify(emails));
  return {ok:true};
}
function actionGetComptes(p){
  var ss = _ss();
  var sh = ss.getSheetByName('Comptes');
  if(!sh) return {ok:true,comptes:[]};
  var data = sh.getDataRange().getValues();
  if(data.length<2) return {ok:true,comptes:[]};
  var headers = data[0].map(function(h){return String(h).trim();});
  var iC = headers.indexOf('Conseiller');
  var iR = headers.indexOf('Role');
  var iA = headers.indexOf('Actif');
  var comptes = [];
  for(var i=1;i<data.length;i++){
    var r=data[i];
    if(!r[iC]) continue;
    comptes.push({conseiller:r[iC],role:r[iR]||'user',actif:r[iA]||'OUI'});
  }
  return {ok:true,comptes:comptes};
}
function actionSaveCompte(p){
  var nom = String(p.conseiller||'').trim();
  if(!nom) return {ok:false,error:'Nom manquant'};
  var ss = _ss();
  var sh = ss.getSheetByName('Comptes');
  if(!sh) return {ok:false,error:'Feuille Comptes introuvable'};
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var iC = headers.indexOf('Conseiller');
  var iR = headers.indexOf('Role');
  var iA = headers.indexOf('Actif');
  var ids = sh.getRange(1,iC+1,sh.getLastRow(),1).getValues();
  for(var i=1;i<ids.length;i++){
    if(String(ids[i][0]).trim()===nom){
      if(p.role!==undefined)  sh.getRange(i+1,iR+1).setValue(p.role);
      if(p.actif!==undefined) sh.getRange(i+1,iA+1).setValue(p.actif);
      return {ok:true};
    }
  }
  return {ok:false,error:'Compte introuvable'};
}
function actionResetPassword(p){
  var nom = String(p.conseiller||'').trim();
  if(!nom) return {ok:false,error:'Nom manquant'};
  var row = _findCompte(nom);
  if(!row) return {ok:false,error:'Conseiller introuvable'};
  var sh = _ss().getSheetByName('Comptes');
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]
                  .map(function(h){return String(h).trim();});
  var iHash = headers.indexOf('Hash');
  var newPwd = defaultPwd(nom);
  sh.getRange(row.rowIndex, iHash+1).setValue(newPwd);
  return {ok:true, newPassword:newPwd};
}
function actionSetPassword(p){
  var nom = String(p.conseiller||'').trim();
  var pwd = String(p.password||'').trim();
  if(!nom||!pwd) return {ok:false,error:'Paramètres manquants'};
  var row = _findCompte(nom);
  if(!row) return {ok:false,error:'Conseiller introuvable'};
  var sh = _ss().getSheetByName('Comptes');
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]
                  .map(function(h){return String(h).trim();});
  var iHash = headers.indexOf('Hash');
  sh.getRange(row.rowIndex, iHash+1).setValue(_sha256(pwd));
  return {ok:true};
}
// v10.11.0 : rate-limit sur CacheService au lieu des colonnes FailCount/
// LockUntil de Comptes, et plus de _logAuth synchrone sur un succès — même
// correctif que NewGen (v11.10). Avant ça, une connexion réussie écrivait
// jusqu'à 3 cellules Sheets (FailCount, LockUntil, + l'appendRow de
// _logAuth) avant de répondre au navigateur ; un échec en écrivait 1 à 2.
// CacheService.put()/get() est un ordre de grandeur plus rapide qu'un
// Sheets.setValue() — sans rapport avec la lenteur/volatilité de getAll
// déjà chassée cette session (causes différentes, voir Exécutions Apps
// Script), mais un gain net sur ce qui reste sous notre contrôle. Le
// journal de connexion réussie part maintenant en fire-and-forget via
// l'action logLogin, appelée par le frontend après coup (onLoginSuccess) —
// checkPassword ne journalise plus lui-même que les échecs (sécurité
// brute-force, volume largement plus faible).
// Lecture unique de la feuille Comptes (getDataRange) au lieu de deux
// lectures séparées (_findCompte + une deuxième pour les en-têtes).
function actionCheckPassword(p){
  var nom = String(p.conseiller||'').trim();
  var pwd = String(p.password||'').trim();
  if(!nom||!pwd) return {ok:false,error:'Paramètres manquants'};
  var cache = CacheService.getScriptCache();
  var rlKey = 'rl_' + nom.replace(/\s/g, '_');
  var rlData = cache.get(rlKey) ? JSON.parse(cache.get(rlKey)) : {count:0, lockUntil:0};
  if(rlData.lockUntil && new Date().getTime() < rlData.lockUntil){
    return {ok:false, error:'Trop de tentatives. Réessayez dans ' + Math.ceil((rlData.lockUntil - new Date().getTime()) / 60000) + ' min.'};
  }
  var sh = _ss().getSheetByName('Comptes');
  if(!sh) return {ok:false,error:'Feuille Comptes introuvable'};
  var data = sh.getDataRange().getValues();
  var headers = data[0].map(function(h){return String(h).trim();});
  var iC = headers.indexOf('Conseiller'), iHash = headers.indexOf('Hash');
  var iRole = headers.indexOf('Role'), iActif = headers.indexOf('Actif');
  var rowIndex = -1, rowData = null;
  for(var i=1;i<data.length;i++){
    if(String(data[i][iC]).trim()===nom){ rowIndex=i+1; rowData=data[i]; break; }
  }
  if(!rowData) return {ok:false,error:'Conseiller introuvable'};
  if(String(rowData[iActif]||'OUI').trim()==='NON') return {ok:false,error:'Compte désactivé'};
  var storedHash = String(rowData[iHash]||'').trim();
  var ok = storedHash.length < 64 ? (pwd === storedHash) : (_sha256(pwd) === storedHash);
  // hash upgrade (plain → SHA256) : écriture unique, une seule fois par compte
  if(storedHash.length < 64 && ok) sh.getRange(rowIndex, iHash+1).setValue(_sha256(pwd));
  if(!ok){
    rlData.count = (rlData.count||0) + 1;
    if(rlData.count >= 5){ rlData.lockUntil = new Date().getTime() + 15*60*1000; rlData.count = 0; }
    cache.put(rlKey, JSON.stringify(rlData), 16*60);
    _logAuth(nom, false, rlData.count, '', p.userAgent||'', p.source||'');
    return {ok:false,error:'Mot de passe incorrect'};
  }
  cache.remove(rlKey);
  var role = String(rowData[iRole]||'user').trim();
  var token = _generateToken(nom, role);
  // pas de _logAuth ici — le frontend appelle logLogin en fire-and-forget
  return {ok:true, role:role, token:token};
}
// ── logLogin : appelé par le frontend après une connexion réussie ──────────
function actionLogLogin(p){
  try{
    _logAuth(String(p.conseiller||''), true, 0, String(p.role||'user'), String(p.userAgent||''), String(p.source||''));
    return {ok:true};
  }catch(e){ return {ok:false, error:e.message}; }
}
function actionLogAccesIndex(p){
  try{
    var ss = _ss();
    var sh = ss.getSheetByName('Logs_Connexion');
    if(!sh) return {ok:false, error:'Feuille Logs_Connexion introuvable'};
    sh.appendRow([new Date(),'accesIndex',p.conseiller||'','','user',p.userAgent||'',true,0,'index.html']);
    return {ok:true};
  }catch(e){ return {ok:false, error:e.message}; }
}
function actionGetLogs(p){
  var n = parseInt(p.n) || 100;
  var ss = _ss();
  var sh = ss.getSheetByName('Logs_Connexion');
  if(!sh) return {ok:false, error:'Feuille Logs_Connexion introuvable'};
  var data = sh.getDataRange().getValues();
  if(data.length < 2) return {ok:true, logs:[]};
  var rows = data.slice(1);
  if(rows.length > n) rows = rows.slice(rows.length - n);
  rows = rows.reverse();
  var ROLE_VALS = ['admin','user',''];
  var logs = rows.map(function(r){
    var ts = r[0] || '';
    if(ts instanceof Date) ts = ts.toISOString();
    else if(ts && !isNaN(Date.parse(String(ts)))) ts = new Date(String(ts)).toISOString();
    var col1 = String(r[1] || '').trim();
    var isFormatB = (col1==='login'||col1==='loginFail'||col1==='saveEntry'||col1==='delete'||col1==='accesIndex'||col1==='alertesRetard');
    var conseiller, role, success, tentatives, ua, action;
    if(isFormatB){
      conseiller = String(r[2]||'');
      role       = String(r[4]||'user');
      ua         = String(r[5]||'');
      var sv     = r[6];
      success    = (sv===true||sv==='TRUE'||sv==='true'||sv===1||sv==='1');
      tentatives = parseInt(r[7]||0);
      action     = col1;
    } else {
      conseiller = String(r[1]||'');
      var rawRole= String(r[2]||'').trim();
      ua         = String(r[4]||r[3]||'');
      tentatives = parseInt(r[5]||0);
      role = ROLE_VALS.indexOf(rawRole.toLowerCase())>=0 ? rawRole : 'user';
      var sv3 = String(r[3]||'').trim().toUpperCase();
      if(sv3==='OUI'||sv3==='TRUE'||sv3==='1') success=true;
      else if(sv3==='NON'||sv3==='FALSE'||sv3==='0') success=false;
      else success=(rawRole==='OK'||rawRole==='admin'||rawRole==='user');
      // Format historique (avant l'ajout de la colonne action dédiée) : col1 est
      // ici le nom du conseiller, pas une action — checkPassword est la seule
      // action connue à avoir jamais utilisé ce format.
      action = 'checkPassword';
    }
    return {
      timestamp:ts, conseiller:conseiller, role:role,
      success:success, tentatives:tentatives, user_agent:ua,
      source:String(r[8]||''), action:action
    };
  });
  return {ok:true, logs:logs};
}
// ── Utilitaires ───────────────────────────────────────────────
function _stripAccents(s){
  return String(s).trim().toLowerCase()
    .replace(/[àâä]/g,'a').replace(/[éèêë]/g,'e')
    .replace(/[îï]/g,'i').replace(/[ôö]/g,'o')
    .replace(/[ùûü]/g,'u').replace(/ç/g,'c');
}
function _parseList(val){
  if(!val) return [];
  var s = String(val).trim();
  if(s.charAt(0) === '['){
    try{ return JSON.parse(s); }catch(_){}
  }
  return s.split('\n').map(function(x){return x.trim();}).filter(function(x){return x.length>0;});
}
function _setConfig(key,val){
  var ss = _ss();
  var sh = ss.getSheetByName('Config');
  if(!sh){ sh = ss.insertSheet('Config'); sh.appendRow(['key','value']); }
  var data = sh.getDataRange().getValues();
  for(var i=0;i<data.length;i++){
    if(String(data[i][0]).trim()===key){ sh.getRange(i+1,2).setValue(val); return; }
  }
  sh.appendRow([key,val]);
  _viderCache();  // CORRECTION 4 - toute ecriture purge le cache
}
function _findCompte(nom){
  var ss = _ss();
  var sh = ss.getSheetByName('Comptes');
  if(!sh) return null;
  var data = sh.getDataRange().getValues();
  var headers = data[0].map(function(h){return String(h).trim();});
  var iC = headers.indexOf('Conseiller');
  if(iC<0) return null;
  for(var i=1;i<data.length;i++){
    if(String(data[i][iC]).trim()===nom) return {rowIndex:i+1, data:data[i]};
  }
  return null;
}
function _ensureCompte(nom){
  if(_findCompte(nom)) return;
  var ss = _ss();
  var sh = ss.getSheetByName('Comptes');
  if(!sh) return;
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]
                  .map(function(h){return String(h).trim();});
  var row = headers.map(function(h){
    if(h==='Conseiller') return nom;
    if(h==='Hash')       return defaultPwd(nom);
    if(h==='Role')       return 'user';
    if(h==='Actif')      return 'OUI';
    if(h==='FailCount')  return 0;
    if(h==='LockUntil')  return '';
    return '';
  });
  sh.appendRow(row);
}
function defaultPwd(nom){
  var prenom = nom.split(' ')[0]||nom;
  prenom = prenom.toLowerCase()
    .replace(/[àâä]/g,'a').replace(/[éèêë]/g,'e')
    .replace(/[îï]/g,'i').replace(/[ôö]/g,'o')
    .replace(/[ùûü]/g,'u').replace(/ç/g,'c');
  return 'cd47'+prenom;
}
function _sha256(str){
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,
              str, Utilities.Charset.UTF_8);
  return bytes.map(function(b){
    return ('0'+(b<0?b+256:b).toString(16)).slice(-2);
  }).join('');
}
function _logAction(action, conseiller, ref){
  try{
    var ss = _ss();
    var sh = ss.getSheetByName('Logs_Connexion');
    if(!sh) return;
    sh.appendRow([new Date(), action, conseiller, ref, '', '', true, 0, '']);
  }catch(_){}
}
function _logAuth(conseiller, success, tentatives, role, userAgent, source){
  try{
    var ss = _ss();
    var sh = ss.getSheetByName('Logs_Connexion');
    if(!sh) return;
    sh.appendRow([new Date(), success?'login':'loginFail', conseiller, '',
                  role||'user', userAgent||'', success, tentatives||0, source||'']);
  }catch(_){}
}
function _getFullConfig(ss){
  var cfg = {};
  try{
    var sh = ss.getSheetByName('Config');
    if(sh){
      var data = sh.getDataRange().getValues();
      data.forEach(function(r){ if(r[0]) cfg[String(r[0]).trim()] = r[1]; });
    }
  }catch(_){}
  return cfg;
}
function _getAteliersRetard(ss){
  var retards = [];
  var today = new Date(); today.setHours(0,0,0,0);
  try{
    var sh = ss.getSheetByName('Ateliers_next_step');
    if(!sh) return retards;
    var data = sh.getDataRange().getValues();
    var headers = data[0].map(function(h){ return String(h).trim(); });
    var iDate=headers.indexOf('date'),iStatut=headers.indexOf('statut'),
        iThema=headers.indexOf('thematique'),iCons=headers.indexOf('conseiller'),
        iCommune=headers.indexOf('commune'),iLieu=headers.indexOf('lieu'),
        iHoraire=headers.indexOf('horaire');
    for(var i=1;i<data.length;i++){
      var row=data[i];
      if(!row[0]) continue;
      if(String(row[iStatut]||'').trim()!=='Planifié') continue;
      var dateVal=row[iDate];
      var dateAtelier=dateVal instanceof Date?new Date(dateVal):new Date(String(dateVal));
      dateAtelier.setHours(0,0,0,0);
      if(dateAtelier<today){
        retards.push({
          thematique:String(row[iThema]||'—'),
          date:Utilities.formatDate(dateAtelier,'Europe/Paris','dd/MM/yyyy'),
          horaire:String(row[iHoraire]||''),
          conseiller:String(row[iCons]||'—'),
          commune:String(row[iCommune]||'—'),
          lieu:String(row[iLieu]||'—'),
          statut:'Planifié'
        });
      }
    }
  }catch(err){ Logger.log('_getAteliersRetard error: '+err); }
  retards.sort(function(a,b){ return a.date>b.date?1:-1; });
  return retards;
}
function _envoyerEmail(destinataireName, email, retards, isTest){
  var prefix = isTest?'[TEST] ':'';
  var sujet = prefix+'⚠️ '+retards.length+' atelier(s) en attente de mise à jour';
  var lignes = retards.map(function(r){
    return '<tr>'+
      '<td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;">'+r.date+(r.horaire?' '+r.horaire:'')+'</td>'+
      '<td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;font-weight:600;">'+r.thematique+'</td>'+
      '<td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;">'+r.conseiller+'</td>'+
      '<td style="padding:6px 10px;border-bottom:1px solid #e2e8f0;color:#718096;">'+r.commune+'</td>'+
      '</tr>';
  }).join('');
  var html='<div style="font-family:sans-serif;max-width:640px;margin:0 auto;">'+
    '<div style="background:#1e3a8a;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0;">'+
    '<h2 style="margin:0;font-size:18px;">⚠️ Ateliers en attente de mise à jour</h2>'+
    (isTest?'<p style="margin:6px 0 0;font-size:12px;opacity:.8;">— EMAIL DE TEST —</p>':'')+
    '</div><div style="background:#fff;padding:20px 24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">'+
    '<p style="color:#4a5568;">Bonjour '+destinataireName+',</p>'+
    '<p style="color:#4a5568;">Les ateliers suivants ont le statut <strong>Planifié</strong> mais leur date est passée :</p>'+
    '<table style="width:100%;border-collapse:collapse;font-size:13px;">'+
    '<thead><tr style="background:#f7fafc;">'+
    '<th style="padding:8px 10px;text-align:left;color:#718096;font-weight:600;">Date</th>'+
    '<th style="padding:8px 10px;text-align:left;color:#718096;font-weight:600;">Thématique</th>'+
    '<th style="padding:8px 10px;text-align:left;color:#718096;font-weight:600;">Conseiller</th>'+
    '<th style="padding:8px 10px;text-align:left;color:#718096;font-weight:600;">Commune</th>'+
    '</tr></thead><tbody>'+lignes+'</tbody></table>'+
    '<p style="margin-top:20px;color:#718096;font-size:12px;">Cliquez sur le bouton ci-dessous pour accéder à l\'application et clôturer ces ateliers rapidement.</p>'+
    '<div style="text-align:center;margin-top:16px;">'+
    '<a href="'+APP_URL+'" style="display:inline-block;background:#1e3a8a;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">📋 Ouvrir l\'application</a>'+
    '</div></div></div>';
  try{ MailApp.sendEmail({to:email,subject:sujet,htmlBody:html}); Logger.log('Email envoyé à '+email); }
  catch(err){ Logger.log('Erreur envoi email à '+email+' : '+err); }
}
function envoyerAlertesRetard(){
  var ss  = _ss();
  var cfg = _getFullConfig(ss);
  var rappelsActifs = cfg['rappels_actifs'];
  if(rappelsActifs==='false'||rappelsActifs===false){ Logger.log('Rappels désactivés.'); return; }
  var emails = {};
  try{ emails=JSON.parse(cfg['emails']||'{}'); }catch(_){}
  var destinataires = [];
  for(var conseiller in emails){
    var info=emails[conseiller];
    var adresse=typeof info==='object'?(info.email||''):String(info);
    var actif=typeof info==='object'?(info.actif!==false):true;
    if(actif&&adresse&&adresse.indexOf('@')>-1) destinataires.push({conseiller:conseiller,email:adresse});
  }
  if(destinataires.length===0){ Logger.log('Aucun destinataire actif.'); return; }
  var retards=_getAteliersRetard(ss);
  if(retards.length===0){ Logger.log('Aucun atelier en retard.'); return; }
  destinataires.forEach(function(dest){
    var retardsDest=retards.filter(function(r){ return r.conseiller===dest.conseiller; });
    if(retardsDest.length===0) return;
    _envoyerEmail(dest.conseiller,dest.email,retardsDest,false);
  });
  Logger.log('Alertes envoyées à '+destinataires.length+' destinataire(s).');
}
function testerAlerteEmail(){
  var EMAIL_TEST='m.aswad.dpt47@gmail.com';
  var ss=_ss();
  var retards=_getAteliersRetard(ss);
  if(retards.length===0){
    retards=[{thematique:'TEST — Atelier exemple',date:'01/06/2026',horaire:'09:00',conseiller:'Michel Aswad',commune:'FUMEL (47500)',lieu:'Convergence',statut:'Planifié'}];
  }
  _envoyerEmail('Michel Aswad',EMAIL_TEST,retards,true);
  Logger.log('TEST envoyé à '+EMAIL_TEST);
}
function initComptes(){
  var ss=_ss();
  var sh=ss.getSheetByName('Comptes');
  if(!sh){ sh=ss.insertSheet('Comptes'); sh.appendRow(['Conseiller','Hash','Role','Actif','FailCount','LockUntil']); }
  var noms=['Michel Aswad','Eva Capelle','Cynthia Pineau','Corentin Tual','Caroline Montoux'];
  noms.forEach(function(nom){ _ensureCompte(nom); });
  var row=_findCompte('Michel Aswad');
  if(row){
    var headers=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(h){return String(h).trim();});
    sh.getRange(row.rowIndex,headers.indexOf('Role')+1).setValue('admin');
  }
  Logger.log('initComptes OK');
}
function debugEntries(){
  var ss=_ss();
  var sh=ss.getSheetByName('Ateliers_next_step');
  if(!sh){ Logger.log('FEUILLE INTROUVABLE'); return; }
  var data=sh.getDataRange().getValues();
  Logger.log('Nb lignes: '+data.length);
  Logger.log('Headers: '+JSON.stringify(data[0]));
  var d=data[1][data[0].indexOf('date')];
  Logger.log('Type date: '+typeof d+' instanceof Date: '+(d instanceof Date));
  Logger.log('getFullYear: '+(d instanceof Date?d.getFullYear():String(d).substring(0,4)));
}
// À lancer une fois manuellement (menu Exécuter) après déploiement de
// v10.14.0, pour le suivi du prêt du stock d'ordinateurs (Classe mobile) :
// nb_ordinateurs (quantité prêtée, saisie manuelle), date_prelevement_materiel
// (date de retrait, peut précéder la date de l'atelier) et
// date_retour_materiel (date de retour prévue). Sans cette migration les
// colonnes n'existent pas encore et actionSaveEntry ne peut rien y écrire —
// elles restent silencieusement vides (d[h] undefined → ''). Idempotente
// (relançable sans risque : ne recrée pas une colonne déjà présente).
function ajouterColonnesPretMateriel(){
  var sh = _ss().getSheetByName('Ateliers_next_step');
  if(!sh){ Logger.log('Feuille introuvable'); return; }
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(h){return String(h).trim();});
  ['nb_ordinateurs','date_prelevement_materiel','date_retour_materiel'].forEach(function(col){
    if(headers.indexOf(col) !== -1){ Logger.log('Colonne '+col+' déjà présente'); return; }
    sh.getRange(1, sh.getLastColumn()+1).setValue(col);
    headers.push(col);
    Logger.log('Colonne '+col+' ajoutée en fin');
  });
}
// ── Keep-alive : remplit reellement le cache getAll pour l'annee en cours ──
// Historique : une premiere version appelait _getAllFrais pour 2 annees
// (courante + suivante) a chaque passage. Resultat mesure : une execution a
// fini par depasser les 6 minutes (limite dure d'Apps Script) et a ete tuee
// de force par Google, en boucle toutes les 5 min — ces executions bloquees
// coincidaient avec les 404/blocages 30-35 s observes cote utilisateurs. Le
// trigger etait alors revenu a un simple ping sans effet sur le cache.
// Cette version ne traite qu'UNE SEULE annee (la courante — cas tres
// largement majoritaire) et reutilise _cacherGetAll (CORRECTION 2, decoupee
// en segments sous 100 Ko) — le meme chemin d'ecriture que doGet, pour ne
// plus jamais diverger entre "ce que dit le commentaire" et "ce que fait le
// code" (c'est exactement ce desalignement qui avait rendu le premier
// prechauffage inoperant sans que ca se voie a la lecture).
// Declencheur : Base sur le temps → toutes les 5 minutes (seul palier
// disponible sous les 10 min du TTL — Apps Script n'autorise que 5 ou 10 min
// pour ce type de declencheur). Avec 5 min, le cache est reecrit deux fois
// avant chaque expiration (TTL 600 s = 10 min) : toujours au moins 5 min de
// marge, y compris si une execution est legerement retardee par Google.
// Ne PAS regler ce trigger sur 10 min : l'ecriture suivante tomberait alors
// quasiment pile sur l'expiration, avec un risque de fenetre a cache froid.
// v10.16.0 (22/09/2026) — alignement sur ATELIERS_NEWGEN, qui portait deja ces
// deux garde-fous. Cette version relisait la feuille ENTIERE toutes les 5 min,
// 24 h/24, sans jamais regarder si le cache etait deja chaud : ~288 lectures
// completes par jour, dont la quasi-totalite pour rien. Le commentaire
// ci-dessus rappelle qu'une version trop lourde avait deja ete bloquee de
// force par Google en boucle, et que ces blocages coincidaient avec les
// 404/blocages de 30-35 s cote utilisateurs.
// ⚠️ HYPOTHESE NON VERIFIEE : rien ne prouve que ce soit la cause des
// demarrages laborieux signales le 22/09/2026. Ce correctif se justifie sur
// son propre cout (moitie moins de lectures completes), pas sur ce symptome.
// A recouper dans les Executions Apps Script : lignes keepAlive presentes
// toutes les 5 min et sous 3 s = il fait son travail.
// v10.18.0 (22/09/2026, AG-004 tranché) — keepAlive NE PREND PLUS le verrou
// de script. Les mails « Summary of failures » des 19-21/09 montrent trois
// keepAlive bloqués 8 min 00 s chacun, arrêtés par la plateforme (le code
// déployé avait déjà tout dans un try/catch : ce n'est pas une erreur JS).
// Avec tryLock pris AVANT la lecture, un tel blocage aurait tenu le verrou
// des écritures (v10.15.0) pendant 8 min : chaque saveEntry/delete refusé.
// L'anti-empilement passe par un drapeau CacheService. Pas atomique : sa pire
// défaillance est deux lectures simultanées, jamais une écriture refusée.
// TTL 360 s : si la plateforme tue l'exécution, le finally ne s'exécute pas ;
// le drapeau expire alors avant le 2e passage suivant (grille de 5 min).
var KEEPALIVE_DRAPEAU = 'keepalive_en_cours';
var KEEPALIVE_DRAPEAU_S = 360;
function keepAlive() {
  var cache = null, pose = false;
  try {
    var an = String(new Date().getFullYear());
    // Cache deja chaud : rien a faire. A 5 min de declencheur contre 10 min de
    // TTL, un passage sur deux tombe ici et ne coute qu'un cache.get().
    if (_lireCacheGetAll(an)) { Logger.log('keepAlive : cache ' + an + ' deja chaud.'); return; }
    cache = CacheService.getScriptCache();
    if (cache.get(KEEPALIVE_DRAPEAU)) { Logger.log('keepAlive : passage precedent encore en cours, saute.'); return; }
    cache.put(KEEPALIVE_DRAPEAU, '1', KEEPALIVE_DRAPEAU_S);
    pose = true;
    var t0 = new Date().getTime();
    var frais = _getAllFrais({year:an});
    _cacherGetAll(an, frais);
    Logger.log('keepAlive : cache ' + an + ' rechauffe en ' + (new Date().getTime()-t0) + ' ms');
  } catch(err) {
    Logger.log('keepAlive erreur : ' + err);
  } finally {
    if (pose) { try { cache.remove(KEEPALIVE_DRAPEAU); } catch(_) {} }
  }
}
// ── Test manuel de la vérification de token/rôle (v10.10.0) ────────────────
// À exécuter une fois depuis l'éditeur Apps Script après déploiement, pour
// vérifier que la protection fonctionne avant de considérer le correctif
// validé. Les résultats s'affichent dans Affichage > Journaux d'exécution.
function testerSecuriteDoGet() {
  Logger.log('=== TEST SÉCURITÉ doGet/doPost ===');
  ADMIN_ONLY_ACTIONS.forEach(function(action){
    var fakeEvent = { parameter: { action: action, _id: 'test' } };
    var result = JSON.parse(doGet(fakeEvent).getContent());
    var bloque = result.ok === false && result.error && result.error.indexOf('Non autorisé') !== -1;
    Logger.log((bloque ? '✅' : '❌') + ' ' + action + ' sans token → ' + JSON.stringify(result).substring(0,100));
  });
  // saveEntry/saveMany/delete exclus de cet appel réel : actionSaveEntry
  // écrit sans condition dans la feuille dès qu'on l'appelle (même vide),
  // un vrai appel de test y laisserait une ligne parasite (déjà arrivé lors
  // du premier test de ce fichier — voir historique). Vérification par
  // lecture de la liste plutôt que par exécution.
  ['getAll','checkPassword','getConfig','getComptes'].forEach(function(action){
    var fakeEvent = { parameter: { action: action } };
    var result = JSON.parse(doGet(fakeEvent).getContent());
    Logger.log((result.ok !== false || !/Non autorisé/.test(result.error||'') ? '✅' : '❌') + ' ' + action + ' sans token → non bloqué (attendu)');
  });
  ['saveEntry','saveMany','delete'].forEach(function(action){
    var ouvert = ADMIN_ONLY_ACTIONS.indexOf(action) === -1;
    Logger.log((ouvert ? '✅' : '❌') + ' ' + action + ' absent de ADMIN_ONLY_ACTIONS → non bloqué (attendu, non exécuté réellement)');
  });
  // Un token valide mais de rôle "user" doit être refusé sur les actions admin.
  var userToken = _generateToken('__test_user__', 'user');
  var fakeEvent2 = { parameter: { action: 'saveConfig', token: userToken, key: 'test', value: 'x' } };
  var result2 = JSON.parse(doGet(fakeEvent2).getContent());
  var bloqueRole = result2.ok === false && result2.error && result2.error.indexOf('administrateurs') !== -1;
  Logger.log((bloqueRole ? '✅' : '❌') + ' saveConfig avec token rôle "user" → ' + JSON.stringify(result2).substring(0,100));
  // Un token de rôle "admin" doit être accepté (sans exécuter d'écriture réelle,
  // resetPassword sur un conseiller inexistant renvoie une erreur métier propre,
  // pas une erreur d'autorisation — c'est ce qui distingue les deux ici).
  var adminToken = _generateToken('__test_admin__', 'admin');
  var fakeEvent3 = { parameter: { action: 'resetPassword', token: adminToken, conseiller: '__conseiller_inexistant__' } };
  var result3 = JSON.parse(doGet(fakeEvent3).getContent());
  var autoriseRole = !(result3.error && result3.error.indexOf('Non autorisé') !== -1);
  Logger.log((autoriseRole ? '✅' : '❌') + ' resetPassword avec token rôle "admin" → autorisé (erreur métier attendue : ' + JSON.stringify(result3) + ')');
  Logger.log('=== FIN ===');
}
