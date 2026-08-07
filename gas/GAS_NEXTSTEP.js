
// ── GAS Backend v10.11.0 ──────────────────────────────────────
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
var SS_ID = '1WQdb2PQ40600CW9eaIQ_mKUEqLU3FQPdaAi3W0eW-mo';
// Actions qui exigent désormais un token valide ET un rôle admin/superviseur.
var ADMIN_ONLY_ACTIONS = [
  'saveLists','saveConfig','setConfig',
  'saveVisibility','saveColors','saveEmails',
  'saveCompte','resetPassword','setPassword',
  'getLogs'
];
var ADMIN_ROLES = ['admin','superviseur'];
var TOKEN_TTL_SECONDS = 8 * 60 * 60;
function _generateToken(conseiller, role){
  var token = Utilities.getUuid();
  CacheService.getScriptCache().put('token_' + token,
    JSON.stringify({conseiller:conseiller, role:role, ts:new Date().getTime()}),
    TOKEN_TTL_SECONDS);
  return token;
}
// Ne vérifie que la validité du token et le rôle qu'il porte — jamais une
// correspondance avec un paramètre "conseiller" de la requête (voir note
// v10.10.0 ci-dessus sur les actions admin ciblant un autre conseiller).
function _verifyToken(token){
  if(!token) return {ok:false, error:'Token manquant'};
  var raw = CacheService.getScriptCache().get('token_' + token);
  if(!raw) return {ok:false, error:'Token invalide ou expiré'};
  try{
    var payload = JSON.parse(raw);
    return {ok:true, role:payload.role, conseiller:payload.conseiller};
  }catch(_){ return {ok:false, error:'Token corrompu'}; }
}
function _requireAdminRole(p){
  var tokenCheck = _verifyToken(p.token);
  if(!tokenCheck.ok) return {ok:false, error:'Non autorisé : ' + tokenCheck.error};
  if(ADMIN_ROLES.indexOf(tokenCheck.role) === -1) return {ok:false, error:'Non autorisé : réservé aux administrateurs'};
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
                if(h === 'date'){
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
              conseiller_colors:conseiller_colors, emails:emails};
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
  return {ok:false, error:'action inconnue: '+action};
}
function actionSaveEntry(p){
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
function actionSaveMany(p){
  var entries = p.entries;
  if(typeof entries === 'string'){
    try{ entries = JSON.parse(entries); }catch(_){ return {ok:false,error:'JSON invalide'}; }
  }
  if(!Array.isArray(entries)) return {ok:false,error:'entries doit être un tableau'};
  var errors = [];
  entries.forEach(function(entry, idx){
    try{ actionSaveEntry({entry: entry}); }
    catch(e){ errors.push({idx:idx, error:String(e)}); }
  });
  if(errors.length > 0) return {ok:false, error:'Erreurs batch: '+JSON.stringify(errors)};
  return {ok:true, count:entries.length};
}
function actionDelete(p){
  var ss = _ss();
  var sh = ss.getSheetByName('Ateliers_next_step');
  if(!sh) return {ok:false,error:'Feuille introuvable'};
  var id = p._id||'';
  if(!id) return {ok:false,error:'ID manquant'};
  var ids = sh.getRange(1,1,sh.getLastRow(),1).getValues();
  for(var i=1;i<ids.length;i++){
    if(ids[i][0]===id){ sh.deleteRow(i+1); _logAction('delete','',id); _viderCache(); return {ok:true}; }
  }
  return {ok:false,error:'Entrée introuvable'};
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
    var isFormatB = (col1==='login'||col1==='loginFail'||col1==='saveEntry'||col1==='delete'||col1==='accesIndex');
    var conseiller, role, success, tentatives, ua;
    if(isFormatB){
      conseiller = String(r[2]||'');
      role       = String(r[4]||'user');
      ua         = String(r[5]||'');
      var sv     = r[6];
      success    = (sv===true||sv==='TRUE'||sv==='true'||sv===1||sv==='1');
      tentatives = parseInt(r[7]||0);
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
    }
    return {
      timestamp:ts, conseiller:conseiller, role:role,
      success:success, tentatives:tentatives, user_agent:ua,
      source:String(r[8]||'')
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
function keepAlive() {
  try {
    var an = String(new Date().getFullYear());
    var frais = _getAllFrais({year:an});
    _cacherGetAll(an, frais);
  } catch(err) {
    Logger.log('keepAlive erreur : ' + err);
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
