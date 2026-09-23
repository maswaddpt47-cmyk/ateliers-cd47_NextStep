// ── App Frontend (conseillers) v11.0 — login par mot de passe ───
// Login par conum (VueLoginIndex), changement de mot de passe obligatoire
// sur mot de passe par défaut, déconnexion — porté depuis ATELIERS_NEWGEN,
// validé en sandbox (index2.html/app2.js, 21/08-15/09/2026) puis promu ici
// en production après briefing de l'équipe. Avant ce changement, Index
// n'avait aucun écran de connexion (VueAccueilStatic — simple choix de nom).
var VIEW_META_F = {
  saisie:     {ico:'✏️',  label:'Nouveau',      group:'Action'},
  historique: {ico:'📋',  label:'Historique',   group:'Voir'},
  dashboard:  {ico:'📊',  label:'Dashboard',    group:'Voir'},
  agenda:     {ico:'🗓️', label:'Agenda',        group:'Voir'},
  calendrier: {ico:'📅',  label:'Calendrier',   group:'Voir'},
  carte:      {ico:'🗺️', label:'Carte',        group:'Voir'},
  roadmap:    {ico:'🛣️', label:'Roadmap',      group:'Voir'},
  gestion_ordi:{ico:'🖥️', label:'Gestion ordi', group:'Voir'},
  graphiques: {ico:'📊',  label:'Statistiques', group:'Stats'},
  bingo:      {ico:'🎯',  label:'Bingo',        group:'Stats'},
};

function MaintenanceScreen({msg}){
  return CE('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#f0f4f8',fontFamily:"'Segoe UI',sans-serif",textAlign:'center',gap:12}},
    CE('div',{style:{background:'#fff',borderRadius:14,padding:'40px 48px',boxShadow:'0 4px 24px rgba(30,58,138,.10)',maxWidth:420,width:'90%'}},
      CE('div',{style:{fontSize:52,marginBottom:12}},'🔧'),
      CE('div',{style:{fontSize:22,fontWeight:800,color:'#1e3a8a',marginBottom:8}},'Maintenance en cours'),
      CE('div',{style:{fontSize:13,color:'#718096',lineHeight:1.6,marginBottom:20}},msg||"L'application est temporairement indisponible. Merci de votre patience."),
      CE('div',{style:{display:'inline-block',background:'#fef9c3',color:'#92400e',fontSize:12,fontWeight:700,padding:'4px 14px',borderRadius:20,border:'1px solid #fcd34d'}},'⏳ Mise à jour en cours'),
      CE('div',{style:{fontSize:12,color:'#a0aec0',marginTop:16}},'Contactez l\'administrateur pour plus d\'infos.')
    )
  );
}

// ── VueAccueilStatic — dropdown CONUM fixe (landing) ─────────
function VueAccueilStatic({onChoix}){
  const CONUM_STATIC = [...CONSEILLERS_DEFAULT];
  const[choix,setChoix]=React.useState('');
  return CE('div',{className:'accueil-wrap'},
    CE('div',{className:'accueil-card'},
      CE('div',{className:'accueil-logo'},'🖥️'),
      CE('div',{className:'accueil-title'},'Ateliers Inclusion Numérique — NextStep'),
      CE('div',{className:'accueil-sub'},'Conseil Départemental du Lot-et-Garonne'),
      CE('label',{className:'accueil-label'},'Qui êtes-vous ?'),
      CE('select',{className:'accueil-select',value:choix,onChange:e=>setChoix(e.target.value)},
        CE('option',{value:''},'— Sélectionner votre nom —'),
        CONUM_STATIC.map(c=>CE('option',{key:c,value:c},c))
      ),
      CE('button',{className:'accueil-btn',disabled:!choix,onClick:()=>onChoix(choix)},'📋 Accéder à mes ateliers'),
      CE('button',{className:'accueil-skip',onClick:()=>onChoix(null)},'Voir tous les ateliers')
    )
  );
}

// Miroir JS de defaultPwd() côté GAS — formule publique (cd47+prénom), pas un
// secret : sert uniquement à détecter côté client qu'un conum utilise encore
// son mot de passe de création, pour déclencher le changement obligatoire.
function defaultPwdIndex(nom){
  var p=(nom||'').split(' ')[0]||nom||'';
  p=p.toLowerCase().replace(/[àâä]/g,'a').replace(/[éèêë]/g,'e').replace(/[îï]/g,'i').replace(/[ôö]/g,'o').replace(/[ùûü]/g,'u').replace(/ç/g,'c');
  return 'cd47'+p;
}

// ── VueLoginIndex — gate mot de passe par conum (identification, avant l'accueil) ─
// Porté depuis ATELIERS_NEWGEN app.js (validé en production là-bas). Seul le
// titre et CONSEILLERS_DEFAULT diffèrent — logique inchangée.
function VueLoginIndex({conseillers,onSuccess}){
  const MAX_FAILS=3, LOCK_MS=5*60*1000;
  const base=conseillers&&conseillers.length?conseillers:CONSEILLERS_DEFAULT;

  const[conseiller,setConseiller]=React.useState(base[0]||'');
  const[pwd,setPwd]=React.useState('');
  const[show,setShow]=React.useState(false);
  const[err,setErr]=React.useState('');
  const[loading,setLoading]=React.useState(false);
  const[failCount,setFailCount]=React.useState(0);
  const[lockUntil,setLockUntil]=React.useState(0);
  const[countdown,setCountdown]=React.useState(0);

  // Mot de passe par défaut détecté à la connexion → changement obligatoire
  // avant d'entrer, tant que pendingRes n'est pas encore transmis à onSuccess.
  const[mustChangePwd,setMustChangePwd]=React.useState(false);
  const[pendingRes,setPendingRes]=React.useState(null);
  const[newPwd,setNewPwd]=React.useState('');
  const[newPwd2,setNewPwd2]=React.useState('');
  const[newPwdErr,setNewPwdErr]=React.useState('');
  const[changingPwd,setChangingPwd]=React.useState(false);
  const[showNewPwd,setShowNewPwd]=React.useState(false);

  React.useEffect(()=>{ if(base.length) setConseiller(c=>base.includes(c)?c:base[0]); },[base.join(',')]);

  React.useEffect(()=>{
    if(!lockUntil||lockUntil<=Date.now())return;
    const tick=()=>{
      const left=lockUntil-Date.now();
      if(left<=0){setCountdown(0);setLockUntil(0);setFailCount(0);}
      else setCountdown(Math.ceil(left/1000));
    };
    tick();
    const id=setInterval(tick,1000);
    return()=>clearInterval(id);
  },[lockUntil]);

  const isLocked=lockUntil>Date.now()||countdown>0;

  async function handleSubmit(){
    if(!pwd.trim()||isLocked)return;
    setLoading(true);setErr('');
    try{
      const res=await apiFetch('checkPassword',{conseiller,password:pwd,userAgent:navigator.userAgent,source:'index.html'});
      if(res.ok){
        setFailCount(0);setLockUntil(0);
        if(pwd.trim()===defaultPwdIndex(conseiller)){
          setPendingRes(res);
          setMustChangePwd(true);
        }else{
          onSuccess(conseiller,res);
        }
      }else{
        const nf=failCount+1;
        setFailCount(nf);
        const raison=res.error||'Mot de passe incorrect';
        if(nf>=MAX_FAILS){
          setLockUntil(Date.now()+LOCK_MS);
          setErr('🔒 Trop de tentatives — accès bloqué 5 minutes.');
        }else{
          setErr(`${raison} (${nf}/${MAX_FAILS} tentative${nf>1?'s':''})`);
        }
      }
    }catch(e){setErr('Erreur réseau : '+e.message);}
    finally{setLoading(false);}
  }

  async function handleChangePwd(){
    if(!pwdPolicyOk(newPwd)){setNewPwdErr('❌ Règle du mot de passe non respectée.');return;}
    if(newPwd!==newPwd2){setNewPwdErr('Les mots de passe ne correspondent pas');return;}
    setChangingPwd(true);setNewPwdErr('');
    try{
      const res2=await apiFetch('selfSetPassword',{password:newPwd,token:pendingRes.token});
      if(res2&&res2.ok){
        onSuccess(conseiller,pendingRes);
      }else{
        const msg=(res2&&res2.error)||'Erreur';
        if(/token/i.test(msg)){
          // Le token obtenu à la connexion n'est plus valide (session expirée
          // entre-temps) — impossible de continuer avec ce token, on renvoie
          // vers l'écran de connexion plutôt que de laisser réessayer dans le
          // vide avec un token mort.
          setMustChangePwd(false);setPendingRes(null);setPwd('');setNewPwd('');setNewPwd2('');
          setErr('Session expirée pendant le changement de mot de passe — merci de vous reconnecter.');
        }else{
          setNewPwdErr(msg);
        }
      }
    }catch(e){setNewPwdErr('Erreur réseau : '+e.message);}
    finally{setChangingPwd(false);}
  }

  const mins=Math.floor(countdown/60), secs=String(countdown%60).padStart(2,'0');

  return CE('div',{className:'accueil-wrap'},
    CE('div',{className:'accueil-card'},
      CE('div',{className:'accueil-logo'},'🖥️'),
      CE('div',{className:'accueil-title'},'Ateliers Inclusion Numérique — NextStep'),
      CE('div',{className:'accueil-sub'},'Conseil Départemental du Lot-et-Garonne'),
      isLocked
        ? CE('div',{style:{textAlign:'center',padding:'28px 0'}},
            CE('div',{style:{fontSize:44,marginBottom:10}},'🔒'),
            CE('div',{style:{fontSize:15,fontWeight:700,color:'#c53030',marginBottom:6}},'Accès temporairement bloqué'),
            CE('div',{style:{fontSize:28,fontWeight:800,color:'#1a202c',fontVariantNumeric:'tabular-nums'}},mins+'m'+secs+'s'),
            CE('div',{style:{fontSize:12,color:'#9ca3af',marginTop:4}},'Trop de tentatives incorrectes')
          )
        : loading
        ? CE(AttenteGAS,{titre:'Connexion en cours…'})
        : mustChangePwd&&changingPwd
        ? CE(AttenteGAS,{titre:'Enregistrement du nouveau mot de passe…'})
        : mustChangePwd
        ? CE(React.Fragment,null,
            CE('div',{style:{textAlign:'center',fontSize:32,marginBottom:8}},'🔑'),
            CE('div',{style:{fontSize:14,fontWeight:700,color:'#1a202c',textAlign:'center',marginBottom:4}},'Mot de passe par défaut détecté'),
            CE('div',{style:{fontSize:12,color:'#718096',textAlign:'center',marginBottom:4}},'Choisissez un nouveau mot de passe personnel pour continuer.'),
            CE('div',{style:{fontSize:11,color:'#a0aec0',textAlign:'center',marginBottom:12}},'12 caractères min. avec majuscule, minuscule, chiffre et caractère spécial.'),
            CE('div',{style:{position:'relative',margin:'0 0 10px'}},
              CE('input',{
                type:showNewPwd?'text':'password',placeholder:'Nouveau mot de passe',value:newPwd,
                onChange:e=>setNewPwd(e.target.value),
                style:{width:'100%',padding:'10px 40px 10px 14px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box'}
              }),
              CE('button',{onClick:()=>setShowNewPwd(s=>!s),style:{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#718096',padding:0}},showNewPwd?'🙈':'👁️')
            ),
            CE('div',{style:{position:'relative',margin:'0 0 10px'}},
              CE('input',{
                type:showNewPwd?'text':'password',placeholder:'Confirmer',value:newPwd2,
                onChange:e=>setNewPwd2(e.target.value),
                onKeyDown:e=>e.key==='Enter'&&handleChangePwd(),
                style:{width:'100%',padding:'10px 40px 10px 14px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box'}
              }),
              CE('button',{onClick:()=>setShowNewPwd(s=>!s),style:{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#718096',padding:0}},showNewPwd?'🙈':'👁️')
            ),
            newPwdErr&&CE('p',{style:{color:'#c53030',fontSize:13,marginBottom:8}},newPwdErr),
            CE('button',{className:'accueil-btn',disabled:changingPwd||!newPwd||!newPwd2,onClick:handleChangePwd},changingPwd?'Enregistrement…':'✅ Valider et continuer')
          )
        : CE(React.Fragment,null,
            CE('label',{className:'accueil-label'},'Qui êtes-vous ?'),
            CE('select',{className:'accueil-select',value:conseiller,onChange:e=>setConseiller(e.target.value)},
              base.map(c=>CE('option',{key:c,value:c},c))
            ),
            CE('div',{style:{position:'relative',margin:'10px 0'}},
              CE('input',{
                type:show?'text':'password',placeholder:'Mot de passe',value:pwd,
                onChange:e=>setPwd(e.target.value),
                onKeyDown:e=>e.key==='Enter'&&handleSubmit(),
                style:{width:'100%',padding:'10px 40px 10px 14px',border:'1px solid #e2e8f0',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box'}
              }),
              CE('button',{onClick:()=>setShow(s=>!s),style:{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#718096',padding:0}},show?'🙈':'👁️')
            ),
            err&&CE('p',{style:{color:'#c53030',fontSize:13,marginBottom:8}},err),
            CE('button',{className:'accueil-btn',disabled:loading||!pwd.trim(),onClick:handleSubmit},loading?'Vérification…':'🔓 Connexion')
          )
    )
  );
}

function App(){
  const[authed,setAuthed]          = React.useState(()=>!!window.authToken.get());
  const[view,setView]              = React.useState('accueil');
  const[entries,setEntries]        = React.useState([]);
  const[loading,setLoading]        = React.useState(true);
  const[error,setError]            = React.useState(null);
  const[maintenance,setMaintenance]= React.useState(null); // null=checking, false=off, {msg}=on
  const[newEntries,setNewEntries]   = React.useState([]);
  const[seenIds,setSeenIds]        = React.useState(new Set());
  const[filtreConseiller,setFiltreConseiller] = React.useState(null);
  const[editingId,setEditingId]    = React.useState(null);
  const[prefillData,setPrefillData] = React.useState(null);
  const[annee,setAnneeState]       = React.useState(()=>localStorage.getItem(lsKey('f_annee'))||String(new Date().getFullYear()));
  const[visibility,setVisibility]   = React.useState({saisie:true,historique:true,dashboard:true,carte:true,bingo:true,calendrier:false,agenda:false,roadmap:false,gestion_ordi:true});
  const[lists,setLists]            = React.useState({
    statuts:[...STATUTS_DEFAULT],conseillers:[...CONSEILLERS_DEFAULT],
    publics:[...PUBLICS_DEFAULT],materiels:[...MATERIELS_DEFAULT]
  });
  const[lastSync,setLastSync]      = React.useState(null);
  const[online,setOnline]          = React.useState(navigator.onLine);
  const[showPicker,setShowPicker]   = React.useState(false);
  const[inactifsSet,setInactifsSet] = React.useState(new Set());
  const[materielsMasques,setMaterielsMasques] = React.useState([]);
  // Liste du menu déroulant de connexion. Elle sortait de lists.conseillers,
  // donc du getAll complet : c'est ce qui obligeait l'appel le plus lourd de
  // l'application à partir AVANT la connexion, en concurrence avec
  // checkPassword. La feuille Comptes porte déjà le nom et l'état actif de
  // chacun — même correctif que sur admin.html (voir admin_app.js), qui
  // relevait que « le getAll qui servait à récupérer lists.conseillers
  // coûtait ~20 s pour la même information ».
  const[loginConseillers,setLoginConseillers]=React.useState(CONSEILLERS_DEFAULT);

  // SEUL appel lancé avant la connexion. Mesuré à 1,8-2,2 s quand il part
  // seul (Journal client, 18/09/2026) — contre des HTTP 404 à 15-34 s quand
  // il partait dans la rafale getComptes + getConfig + getAll.
  React.useEffect(()=>{
    apiFetch('getComptes').then(res=>{
      if(!res.ok||!res.comptes) return;
      setInactifsSet(new Set(res.comptes.filter(c=>c.actif==='NON').map(c=>c.conseiller)));
      const actifs=res.comptes.filter(c=>c.actif!=='NON').map(c=>c.conseiller).filter(Boolean);
      if(actifs.length>0) setLoginConseillers(actifs);
    }).catch(()=>{});
  },[]);
  const[sidebarPinned,setSidebarPinned] = React.useState(()=>localStorage.getItem(lsKey('sidebar_pinned'))==='1');

  // Un token peut déjà être présent en sessionStorage au chargement (login
  // précédent dans cet onglet) — sessionStorage survit à un simple
  // rechargement. Dans ce cas authed démarre déjà à true et VueLoginIndex ne
  // s'affiche jamais : sans ce useEffect on retombait sur l'ancien écran
  // "Qui êtes-vous ?" (VueAccueilStatic) au lieu de rester identifié.
  React.useEffect(()=>{
    if(authed&&!filtreConseiller){
      const stored=sessionStorage.getItem('gs_conseiller');
      if(stored) handleChoixConseiller(stored);
    }
  },[]);

  // Ref pour l'event delegation sur les vues avec filtre conseiller
  const viewRef = React.useRef(null);

  // ── Helpers ───────────────────────────────────────────────────
  function setAnnee(v){ localStorage.setItem(lsKey('f_annee'),v); setAnneeState(v); }
  function resetConseiller(){ setFiltreConseiller(null); }
  function togglePin(){ setSidebarPinned(p=>{ const n=!p; localStorage.setItem(lsKey('sidebar_pinned'),n?'1':'0'); return n; }); }
  function handleLogout(){
    if(!window.confirm('Se déconnecter ?'))return;
    window.authToken.clear();
    sessionStorage.removeItem('gs_conseiller');
    setAuthed(false);
    setFiltreConseiller(null);
    setShowPicker(false);
    setView('accueil');
  }

  // ── Sync couleur depuis les selects internes (shared.js) ──────
  // VueHistorique/VueCalendrier gèrent leur propre state interne.
  // On écoute les change events via event delegation : quand la valeur
  // d'un select correspond à un conseiller connu, on met à jour l'identité.
  React.useEffect(()=>{
    if(!viewRef.current) return;
    const handler = e => {
      if(e.target.tagName !== 'SELECT') return;
      // Ne pas intercepter les selects du formulaire de saisie
      if(e.target.closest&&e.target.closest('.sf-wrap, .sf-section, [data-saisie]')) return;
      const val = e.target.value;
      if(lists.conseillers.includes(val)){
        setFiltreConseiller(val);
      }
    };
    const el = viewRef.current;
    el.addEventListener('change', handler);
    return ()=> el.removeEventListener('change', handler);
  }, [view, lists.conseillers]);

  // ── Chargement ──────────────────────────────────────────────
  // useCache=true : accepte un résultat déjà en cache client (premier
  // chargement). Sinon on force un appel réseau — après une écriture, un
  // rafraîchissement manuel ou la synchro auto, les données doivent être
  // fraîches. Le force:true inconditionnel d'avant annulait le cache de
  // fetchAll à chaque fois, y compris au tout premier affichage.
  async function loadData(attempt=1, silent=false, useCache=false){
    if(!silent) setLoading(true);
    setError(null);
    try{
      // fetchAll porte seul les tentatives (voir GAS_MAX_TENTATIVES).
      const data=await fetchAll(annee,{force:!useCache});
      // Mode maintenance : le serveur le signale dans cette réponse même,
      // sans payload d'ateliers. MaintenanceScreen prend alors le relais.
      if(data.maintenance){
        setMaintenance({msg:data.msg||''});
        setLoading(false);
        return;
      }
      setMaintenance(false);
      const incoming=data.entries||[];
      setEntries(incoming);
      if(data.lists){
        const l=data.lists;
        const nl={
          statuts:(Array.isArray(l.statuts)&&l.statuts.length)?l.statuts:[...STATUTS_DEFAULT],
          conseillers:(Array.isArray(l.conseillers)&&l.conseillers.length)?l.conseillers:[...CONSEILLERS_DEFAULT],
          publics:(Array.isArray(l.publics)&&l.publics.length)?l.publics:[...PUBLICS_DEFAULT],
          materiels:(Array.isArray(l.materiels)&&l.materiels.length)?l.materiels:[...MATERIELS_DEFAULT]
        };
        setLists(nl);STATUTS=[...nl.statuts];CONSEILLERS=[...nl.conseillers];PUBLICS=[...nl.publics];MATERIELS=[...nl.materiels];
      }
      if(data.visibility)setVisibility(v=>({...v,...data.visibility}));
      if(data.conseiller_colors)applyColors(data.conseiller_colors);
      if(Array.isArray(data.materiels_masques))setMaterielsMasques(data.materiels_masques);
      if(data.stockOrdinateurs)STOCK_ORDINATEURS=parseInt(data.stockOrdinateurs)||STOCK_ORDINATEURS;
      setLastSync(new Date());
      setSeenIds(prev=>{
        if(prev.size===0)return new Set(incoming.map(e=>e._id));
        const nouvs=incoming.filter(e=>!prev.has(e._id));
        if(nouvs.length>0)setNewEntries(n=>[...nouvs,...n]);
        return new Set(incoming.map(e=>e._id));
      });
      setLoading(false);
    }catch(err){
      // fetchAll a déjà épuisé ses tentatives : on affiche, sans relancer.
      setError('Impossible de charger : '+err.message);
      setLoading(false);
    }
  }


  // ── Application locale après écriture (au lieu d'un rechargement complet) ──
  // Chaque saveEntry/delete était suivi d'un getAll complet. Deux appels en
  // série dont le second tombait systématiquement dans son pire cas : côté
  // GAS, toute écriture purge le cache de réponse, donc le rechargement qui
  // suit immédiatement relit forcément tout le classeur.
  //
  // Relevé du 18/09/2026 (Journal client) : un cycle d'enregistrement
  // contenait un « getAll ok en 11,8 s » juste après le saveEntry ; un autre
  // en contenait quatre (404 en 26,5 s, 33,3 s, 27,3 s, 9,4 s puis ok en
  // 2,3 s), soit l'essentiel des 3 min 30 observées.
  //
  // L'entrée écrite est déjà connue du client : on l'applique en local et on
  // ne redemande rien. Seul _n (numéro de ligne) est attribué côté serveur —
  // il est purement cosmétique (colonne N° de l'export, libellé de la modale
  // de suppression) et le mode lot crée déjà des entrées avec _n:''. La
  // resynchro différée ci-dessous le récupère, avec les écritures des
  // collègues.
  const resyncRef = React.useRef(null);
  function planifierResync(){
    if(resyncRef.current) clearTimeout(resyncRef.current);
    // Différé, et non enchaîné : c'est tout l'intérêt. Repartir tout de suite
    // remettrait le getAll en concurrence avec le saveEntry qui vient de
    // finir — exactement la rafale qu'on cherche à supprimer. Le délai est
    // remis à zéro à chaque écriture, donc une série de saisies ne déclenche
    // qu'une seule resynchro, une fois l'utilisateur au repos.
    resyncRef.current = setTimeout(()=>{ resyncRef.current=null; loadData(1,true); }, 30000);
  }
  React.useEffect(()=>()=>{ if(resyncRef.current) clearTimeout(resyncRef.current); },[]);

  function appliquerEntreeLocale(entry){
    if(!entry||!entry._id) return;
    setEntries(prev=>{
      const i=prev.findIndex(e=>e._id===entry._id);
      if(i===-1) return [...prev, entry];
      const copie=prev.slice();
      copie[i]={...prev[i], ...entry};
      return copie;
    });
    planifierResync();
  }
  function retirerEntreeLocale(id){
    if(!id) return;
    setEntries(prev=>prev.filter(e=>e._id!==id));
    planifierResync();
  }
  // shared.js (VueSaisie, panneaux d'Historique et de Calendrier) appelle ces
  // deux points d'entrée après une écriture réussie.
  React.useEffect(()=>{
    window.__entreeSauvegardee = appliquerEntreeLocale;
    window.__entreeSupprimee   = retirerEntreeLocale;
    return()=>{ window.__entreeSauvegardee=null; window.__entreeSupprimee=null; };
  },[]);

  const isFirstLoad=React.useRef(true);

  React.useEffect(()=>{
    const on=()=>setOnline(true);
    const off=()=>setOnline(false);
    window.addEventListener('online',on);
    window.addEventListener('offline',off);
    return()=>{ window.removeEventListener('online',on); window.removeEventListener('offline',off); };
  },[]);

  React.useEffect(()=>{
    if(!showPicker)return;
    const close=()=>setShowPicker(false);
    document.addEventListener('mousedown',close);
    return()=>document.removeEventListener('mousedown',close);
  },[showPicker]);

  React.useEffect(()=>{loadCommunes47().catch(()=>{});},[]);

  // L'appel getConfig dédié qui vivait ici est supprimé. Il ne servait qu'à
  // lire le drapeau maintenance, que getAll rapporte déjà : le GAS répond
  // {ok:false, maintenance:true, msg} à tout appelant non-admin quand le mode
  // est actif (voir _getAllFrais). C'était donc un aller-retour de plus à
  // chaque connexion, pour une information qui arrivait de toute façon — et
  // un appel qui, avec la file d'attente de gasUnAppel, retardait le getAll
  // dont l'utilisateur attend réellement le résultat.
  // Correctif porté d'ATELIERS_NEWGEN, qui l'avait supprimé de son côté.
  // La détection se fait maintenant dans loadData.
  React.useEffect(()=>{
    if(!authed) return;
    if(isFirstLoad.current){isFirstLoad.current=false;loadData(1,false,true);}
    else{setSeenIds(new Set());loadData();}
  },[annee,authed]);

  // Une erreur affichée signifie que la lecture précédente n'a pas abouti —
  // très probablement parce que la livraison Apps Script traverse une de ses
  // fenêtres de panne. Relancer dedans toutes les 10 min ne fait qu'ajouter
  // des appels morts pendant que l'utilisateur a déjà le bouton Réessayer
  // sous les yeux. Lu via une ref : la fonction passée à setInterval est
  // créée une fois et ne verrait jamais la valeur à jour de `error`.
  const errorRef = React.useRef(null);
  React.useEffect(()=>{ errorRef.current = error; },[error]);

  // Synchro de fond. Passée de 5 à 10 min et suspendue quand l'onglet n'est
  // pas visible : plusieurs onglets ouverts en permanence sur les postes de
  // l'équipe, chacun avec son propre minuteur, c'est autant d'appels qui
  // partent pendant qu'un collègue enregistre un atelier.
  React.useEffect(()=>{
    if(!authed) return;
    const id=setInterval(()=>{
      if(document.hidden) return;
      if(errorRef.current) return;
      loadData(1,true);
    },10*60*1000);
    return()=>clearInterval(id);
  },[annee,authed]);

  React.useEffect(()=>{
    const label=view==='accueil'?'Accueil':VIEW_META_F[view]?.label||view;
    document.title=`${label} — Ateliers Inclusion Numérique`;
  },[view]);

  // ── Handlers ──────────────────────────────────────────────────
  // logAccesIndex supprimé. Il journalisait dans Logs_Connexion, la feuille
  // qu'alimente déjà logLogin à chaque connexion : sur le chemin du login,
  // c'était un doublon pur, et il repartait en plus à chaque restauration de
  // session (donc à chaque rechargement de page) et à chaque changement de
  // conseiller.
  //
  // Son coût a changé de nature avec la file d'attente de gasUnAppel : un
  // appel « fire-and-forget » ne bloquait rien visuellement tant que tout
  // partait en parallèle, mais il occupe désormais un créneau de la file et
  // retarde d'autant les appels dont l'utilisateur attend le résultat.
  //
  // La traçabilité des connexions reste assurée par logLogin. Ce qui est
  // perdu : la trace des changements de conseiller en cours de session, et
  // celle des restaurations de session. Le paramètre skipLog n'a plus d'objet.
  function handleChoixConseiller(nom, skipLog){
    setFiltreConseiller(nom);
    setShowPicker(false);
    setView(visibility.historique?'historique':visibility.calendrier?'calendrier':visibility.saisie?'saisie':'dashboard');
    if(nom){
      sessionStorage.setItem('gs_conseiller', nom);
    }
  }
  function handleEdit(id){setEditingId(id);setPrefillData(null);setView('saisie');}
  function handleSaved(){setView('historique');}
  async function handleDelete(id){
    try{const res=await apiFetch('delete',{_id:id});if(!suppressionAboutie(res))throw new Error(res.error);showToast('✅ Atelier supprimé');retirerEntreeLocale(id);}
    catch(err){showToast('❌ '+err.message,false);}
  }
  function handleDuplicate(entry){
    const{_id,_n,date,horaire,ampm,inscrits,presents,remarques,...rest}=entry;
    setPrefillData({...rest});setEditingId(null);setView('saisie');
  }

  const conseillerActifs = lists.conseillers.filter(c=>!inactifsSet.has(c));

  // ── Vue Accueil ───────────────────────────────────────────────
  // maintenance===null (getAll pas encore revenu) est traité comme "pas en
  // maintenance" : on affiche la landing tout de suite, sans attendre. Seul
  // un getAll rapportant maintenance:true bascule sur MaintenanceScreen.
  if(maintenance && maintenance!==false) return CE(MaintenanceScreen,{msg:maintenance.msg});

  if(!authed){
    return CE(VueLoginIndex,{
      conseillers:loginConseillers,
      onSuccess:(nom,res)=>{ window.onLoginSuccess(nom,res); setAuthed(true); handleChoixConseiller(nom, true); }
    });
  }

  if(view==='accueil'){
    const now=new Date();
    const moisKey=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    // Mois précédent pour la tendance
    const prevDate=new Date(now.getFullYear(),now.getMonth()-1,1);
    const prevKey=`${prevDate.getFullYear()}-${String(prevDate.getMonth()+1).padStart(2,'0')}`;
    const statsMois={};const statsPrev={};const statsRealises={};const statsAnnules={};
    entries.forEach(e=>{
      if(!e.conseiller) return;
      if(e.date&&e.date.startsWith(moisKey)){
        statsMois[e.conseiller]=(statsMois[e.conseiller]||0)+1;
        if(e.statut==='Réalisé') statsRealises[e.conseiller]=(statsRealises[e.conseiller]||0)+1;
        if(e.statut==='Annulé')  statsAnnules[e.conseiller]=(statsAnnules[e.conseiller]||0)+1;
      }
      if(e.date&&e.date.startsWith(prevKey)) statsPrev[e.conseiller]=(statsPrev[e.conseiller]||0)+1;
    });

    return CE('div',null,
      CE('nav',{style:{background:NAV_DEFAULT_COLOR}},
        CE('span',{className:'logo'},'🖥️ Ateliers Inclusion Numérique'),
        loading&&CE('span',{style:{fontSize:11,color:'rgba(255,255,255,.6)',marginLeft:8,display:'flex',alignItems:'center',gap:5}},
          CE('span',{className:'spinner',style:{borderTopColor:'rgba(255,255,255,.8)',borderColor:'rgba(255,255,255,.2)'}}),
          'Chargement…'),
        CE('button',{
          onClick:handleLogout, title:'Déconnexion',
          style:{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#fff',padding:'2px 6px'}
        },'🚪')
      ),
      CE('div',{className:'main'},
        error
          ? CE('div',{className:'error-box'},CE('strong',null,'❌ Impossible de charger'),CE('span',null,error),CE('button',{className:'btn btn-primary',onClick:()=>loadData()},'🔄 Réessayer'))
          : CE('div',null,
              // Le seul retour visuel était un « Chargement… » de 11 px dans la
              // barre du haut : la landing semblait figée pendant les ~20 s du
              // getAll. AttenteGAS dit où on en est, avec un compteur.
              loading&&CE(AttenteGAS,null),
              !loading&&entries.length>0&&CE('div',{className:'accueil-stats'},
                lists.conseillers.map(c=>{
                  const n=statsMois[c]||0;
                  const prev=statsPrev[c]||0;
                  const diff=n-prev;
                  const trendIco=diff>0?'↑':diff<0?'↓':'→';
                  const trendColor=diff>0?'#16a34a':diff<0?'#dc2626':'#9ca3af';
                  const color=conseillerColor(c);
                  const realises=statsRealises[c]||0;
                  const annules=statsAnnules[c]||0;
                  const base=n-annules;
                  const taux=base>0?Math.round(realises/base*100):null;
                  const tauxColor=taux===null?'#9ca3af':taux>=75?'#16a34a':taux>=50?'#d97706':'#dc2626';
                  return CE('div',{key:c,className:'accueil-stat-chip',style:{background:color+'12',border:`1px solid ${color}30`,color}},
                    CE('span',{style:{fontWeight:700}},c.split(' ')[0]),
                    CE('span',{className:'accueil-stat-count',style:{background:color}},n),
                    CE('span',{style:{fontSize:10,color:'#9ca3af'}},'ce mois'),
                    taux!==null&&CE('span',{style:{fontSize:10,fontWeight:700,color:tauxColor}},taux+'%'),
                    prev>0&&CE('span',{className:'accueil-stat-trend',style:{color:trendColor}},`${trendIco}${Math.abs(diff)}`)
                  );
                })
              ),
              CE(VueAccueilStatic,{onChoix:handleChoixConseiller})
            )
      ),
      CE('div',{id:'toast',className:'toast',style:{opacity:0}})
    );
  }

  // ── Vue principale avec sidebar ───────────────────────────────
  const accentColor = filtreConseiller ? conseillerColor(filtreConseiller) : NAV_DEFAULT_COLOR;

  const meta = VIEW_META_F[view]||{ico:'📄',label:view,group:''};

  // Date courante pour la topbar
  const dateLabel = new Date().toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'long'});

  // Keyboard nav helper
  const sideBtn=(v,ico,lbl,visible=true)=>visible&&CE('button',{
    key:v,
    className:'sidebar-btn'+(view===v?' active':''),
    title:lbl,
    onClick:()=>setView(v),
    tabIndex:0,
    onKeyDown:e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); setView(v); } },
    'aria-label':lbl,
    'aria-current':view===v?'page':undefined
  }, CE('span',{className:'sidebar-btn-ico','aria-hidden':'true'},ico), CE('span',{className:'sidebar-btn-lbl'},lbl));

  return CE('div',{className:'app-shell'},

    CE('aside',{
      className:'sidebar'+(sidebarPinned?' pinned':''),
      style:{background:accentColor},
      role:'navigation',
      'aria-label':'Menu principal'
    },
      CE('button',{
        className:'sidebar-pin-btn',
        title:sidebarPinned?'Désépingler la sidebar':'Épingler la sidebar',
        onClick:togglePin,
        'aria-pressed':sidebarPinned,
        'aria-label':sidebarPinned?'Désépingler':'Épingler'
      }, sidebarPinned?'📌':'📍'),
      CE('div',{className:'sidebar-logo','aria-hidden':'true'},'🖥️'),
      entries.length>0&&CE('span',{className:'sidebar-count'},entries.length),

      CE('div',{className:'sidebar-sep'}),
      CE('span',{className:'sidebar-group-label'},'Action'),
      sideBtn('saisie','✏️','Nouveau',visibility.saisie),

      CE('div',{className:'sidebar-sep'}),
      CE('span',{className:'sidebar-group-label'},'Voir'),
      sideBtn('historique','📋','Historique',visibility.historique),
      sideBtn('agenda','🗓️','Agenda',visibility.agenda),
      sideBtn('calendrier','📅','Calendrier',visibility.calendrier),
      sideBtn('carte','🗺️','Carte',visibility.carte),
      sideBtn('roadmap','🛣️','Roadmap',visibility.roadmap),
      sideBtn('gestion_ordi','🖥️','Gestion ordi',visibility.gestion_ordi),

      CE('div',{className:'sidebar-sep'}),
      CE('span',{className:'sidebar-group-label'},'Stats'),
      sideBtn('dashboard','📊','Dashboard',visibility.dashboard),
      sideBtn('bingo','🎯','Bingo',visibility.bingo),

      CE('div',{className:'sidebar-bottom'},
        CE(ChoixAnnees,{className:'sidebar-year',value:annee,onChange:setAnnee,title:'Années chargées'}),
        newEntries.length>0&&CE('button',{
          className:'sidebar-notif-btn',
          title:`${newEntries.length} nouveaux ateliers`,
          onClick:()=>{setView('historique');window._filterNewEntries&&window._filterNewEntries(newEntries.map(e=>e._id));setNewEntries([]);}
        }, CE('span',null,'🔔'), CE('span',null,newEntries.length)),
        CE('button',{
          className:'sidebar-accueil-btn', title:'Retour accueil',
          onClick:()=>{ resetConseiller(); setView('accueil'); }
        }, CE('span',null,'↩'), CE('span',{className:'sidebar-accueil-lbl'},'Accueil')),
        CE('button',{
          className:'sidebar-accueil-btn', title:'Déconnexion',
          onClick:handleLogout
        }, CE('span',null,'🚪'), CE('span',{className:'sidebar-accueil-lbl'},'Déconnexion'))
      )
    ),

    CE('div',{className:'app-content'},
      CE('div',{className:'app-topbar'},
        CE('span',{style:{fontSize:16},'aria-hidden':'true'},meta.ico),
        CE('span',{className:'app-topbar-title'},meta.label),
        meta.group&&CE('span',{className:'app-topbar-sub'},'— '+meta.group),
        CE('span',{className:'app-topbar-date','aria-label':'Date du jour'},'📅 '+dateLabel),
        CE('div',{className:'app-topbar-right'},
          !online&&CE('span',{className:'offline-badge'},'📡 Hors ligne'),
          !loading&&lastSync&&CE('span',{className:'topbar-sync-info',title:'Sync auto toutes les 5 min'},
            '🔄 ',lastSync.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})
          ),
          loading&&CE('span',{style:{fontSize:11,color:'#9ca3af',display:'flex',alignItems:'center',gap:4}},
            CE('span',{className:'spinner',style:{borderTopColor:'#1e3a8a',borderColor:'#e2e8f0'}}), 'Chargement…'),
          // Contrôles repris de la sidebar. En mobile (≤640px) la sidebar
          // devient la barre de navigation du bas et .sidebar-bottom y est
          // masqué (app.css) : l'année, le retour accueil et la déconnexion
          // n'étaient atteignables par aucun autre chemin. Ces trois-là ne
          // s'affichent qu'en mobile, via .topbar-mobile-only — le desktop
          // garde la sidebar strictement inchangée.
          CE(ChoixAnnees,{className:'topbar-mobile-only topbar-mobile-year',value:annee,onChange:setAnnee,title:'Années chargées'}),
          CE('button',{
            className:'topbar-mobile-only topbar-mobile-btn',
            onClick:()=>{ resetConseiller(); setView('accueil'); },
            title:'Retour accueil',
            'aria-label':'Retour accueil'
          },'↩'),
          CE('button',{
            className:'topbar-mobile-only topbar-mobile-btn',
            onClick:handleLogout,
            title:'Déconnexion',
            'aria-label':'Déconnexion'
          },'🚪'),
          filtreConseiller&&CE('div',{style:{position:'relative'},onMouseDown:e=>e.stopPropagation()},
            CE('button',{
              className:'app-topbar-conseiller',
              style:{background:accentColor},
              onClick:()=>setShowPicker(p=>!p),
              title:'Changer de conseiller'
            },
              filtreConseiller,
              CE('span',{style:{fontSize:10,opacity:.75}},' ▾')
            ),
            showPicker&&CE('div',{className:'conseiller-picker'},
              conseillerActifs.map(c=>CE('div',{
                key:c,
                className:'conseiller-picker-item'+(c===filtreConseiller?' active':''),
                onClick:()=>handleChoixConseiller(c)
              },
                CE('span',{className:'conseiller-picker-dot',style:{background:conseillerColor(c)}}),
                c,
                c===filtreConseiller&&CE('span',{style:{marginLeft:'auto',fontSize:11,color:'#9ca3af'}},'✓')
              ))
            )
          )
        )
      ),

      CE('div',{className:'app-main'},
        error&&CE('div',{className:'error-box'},CE('strong',null,'❌ Impossible de charger'),CE('span',null,error),CE('button',{className:'btn btn-primary',onClick:()=>loadData()},'🔄 Réessayer')),
        loading&&!error&&CE('div',null,
          CE(AttenteGAS,null),
          [1,2,3].map(i=>CE('div',{key:i,className:'skeleton skeleton-card'}))
        ),
        // viewRef sur le wrapper — capte les change events des selects internes
        !loading&&!error&&CE('div',{ref:viewRef,className:'view-anim',key:view+'_'+(filtreConseiller||'all')},
          view==='saisie'&&visibility.saisie&&CE(VueSaisie,{entries,onSaved:handleSaved,onNewEntry:e=>{setNewEntries(n=>[e,...n]);setSeenIds(s=>{const ns=new Set(s);ns.add(e._id);return ns;});},lists,editingId,onClearEdit:()=>setEditingId(null),prefillData,onClearPrefill:()=>setPrefillData(null),accentColor:conseillerColor(filtreConseiller||''),materielsMasques}),
          view==='historique'&&visibility.historique&&CE(VueHistorique,{entries,onEdit:handleEdit,onDelete:handleDelete,onRefresh:()=>loadData(),onDuplicate:handleDuplicate,initConseiller:filtreConseiller,onResetConseiller:()=>{},canDelete:true}),
          view==='agenda'&&visibility.agenda&&CE(VueAgendaSemaine,{entries,onEdit:handleEdit,onDelete:handleDelete,onDuplicate:handleDuplicate,canDelete:true,initConseiller:filtreConseiller,accentColor}),
          view==='calendrier'&&visibility.calendrier&&CE(VueCalendrier,{entries,onEdit:handleEdit,onDelete:handleDelete,onRefresh:()=>loadData(),onDuplicate:handleDuplicate,initConseiller:filtreConseiller,onResetConseiller:()=>{},canDelete:true}),
          view==='dashboard'&&visibility.dashboard&&CE(VueDashboardTabs,{entries,conseillers:lists.conseillers}),
          view==='carte'&&visibility.carte&&CE(VueCarte,{entries,active:view==='carte'}),
          view==='roadmap'&&visibility.roadmap&&CE(VueRoadmap,{entries,annee:anneeReference(annee),conseillers:lists.conseillers}),
          view==='gestion_ordi'&&visibility.gestion_ordi&&CE(VueGestionOrdi,{entries,onEdit:handleEdit}),
          view==='bingo'&&visibility.bingo&&CE(VueBingo,{entries})
        )
      )
    ),

    CE('div',{id:'toast',className:'toast',style:{opacity:0}})
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(CE(App));
