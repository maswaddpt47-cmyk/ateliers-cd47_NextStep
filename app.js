// ── App Frontend (conseillers) v10.0 ─────────────────────────
var VIEW_META_F = {
  saisie:     {ico:'✏️',  label:'Nouveau',      group:'Action'},
  historique: {ico:'📋',  label:'Historique',   group:'Voir'},
  agenda:     {ico:'🗓️', label:'Agenda',        group:'Voir'},
  calendrier: {ico:'📅',  label:'Calendrier',   group:'Voir'},
  carte:      {ico:'🗺️', label:'Carte',        group:'Voir'},
  roadmap:    {ico:'🛣️', label:'Roadmap',      group:'Voir'},
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

function App(){
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
  const[annee,setAnneeState]       = React.useState(()=>localStorage.getItem('f_annee')||String(new Date().getFullYear()));
  const[visibility,setVisibility]   = React.useState({saisie:true,historique:true,dashboard:true,carte:true,bingo:true,calendrier:false,agenda:false,roadmap:false});
  const[lists,setLists]            = React.useState({
    statuts:[...STATUTS_DEFAULT],conseillers:[...CONSEILLERS_DEFAULT],
    publics:[...PUBLICS_DEFAULT],materiels:[...MATERIELS_DEFAULT]
  });
  const[lastSync,setLastSync]      = React.useState(null);
  const[online,setOnline]          = React.useState(navigator.onLine);
  const[showPicker,setShowPicker]   = React.useState(false);
  const[inactifsSet,setInactifsSet] = React.useState(new Set());
  React.useEffect(()=>{apiFetch('getComptes').then(res=>{if(res.ok&&res.comptes){setInactifsSet(new Set(res.comptes.filter(c=>c.actif==='NON').map(c=>c.conseiller)));}}).catch(()=>{});},[]);
  const[sidebarPinned,setSidebarPinned] = React.useState(()=>localStorage.getItem('sidebar_pinned')==='1');

  // Ref pour l'event delegation sur les vues avec filtre conseiller
  const viewRef = React.useRef(null);

  // ── Helpers ───────────────────────────────────────────────────
  function setAnnee(v){ localStorage.setItem('f_annee',v); setAnneeState(v); }
  function resetConseiller(){ setFiltreConseiller(null); }
  function togglePin(){ setSidebarPinned(p=>{ const n=!p; localStorage.setItem('sidebar_pinned',n?'1':'0'); return n; }); }

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

  // ── Chargement v10.0 — timeout adaptatif mobile/desktop ─────
  async function loadData(attempt=1, silent=false){
    if(!silent) setLoading(true);
    setError(null);
    try{
      const isMobile=/Android|iPhone|iPad/i.test(navigator.userAgent);
      const timeouts=isMobile?[20000,25000,30000]:[8000,10000,12000];
      const timeoutMs=timeouts[attempt-1]||timeouts[timeouts.length-1];
      const res=await Promise.race([
        fetch(`${GS_URL}?action=getAll&year=${annee}`),
        new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),timeoutMs))
      ]);
      const data=await res.json();
      if(!data.ok)throw new Error(data.error||'Erreur serveur');
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
      setLastSync(new Date());
      setSeenIds(prev=>{
        if(prev.size===0)return new Set(incoming.map(e=>e._id));
        const nouvs=incoming.filter(e=>!prev.has(e._id));
        if(nouvs.length>0)setNewEntries(n=>[...nouvs,...n]);
        return new Set(incoming.map(e=>e._id));
      });
      setLoading(false);
    }catch(err){
      if(err.message==='timeout'&&attempt<3){
        const isMobile=/Android|iPhone|iPad/i.test(navigator.userAgent);
        setTimeout(()=>loadData(attempt+1,silent),isMobile?[3000,6000][attempt-1]:2000);
      }else{
        setError(attempt>1?'Google Sheets ne répond pas après 3 tentatives.':'Impossible de charger : '+err.message);
        setLoading(false);
      }
    }
  }

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

  // Check maintenance
  React.useEffect(()=>{
    apiFetch('getConfig').then(res=>{
      if(res.ok&&res.config){
        const active=res.config['maintenance']==='true'||res.config['maintenance']===true||res.config['maintenance']==='TRUE';
        const msg=res.config['maintenance_msg']||'';
        setMaintenance(active?{msg}:false);
      } else setMaintenance(false);
    }).catch(()=>setMaintenance(false));
  },[]);

  React.useEffect(()=>{
    if(isFirstLoad.current){isFirstLoad.current=false;loadData();}
    else{setSeenIds(new Set());loadData();}
  },[annee]);

  React.useEffect(()=>{
    const id=setInterval(()=>loadData(1,true),5*60*1000);
    return()=>clearInterval(id);
  },[annee]);

  React.useEffect(()=>{
    const label=view==='accueil'?'Accueil':VIEW_META_F[view]?.label||view;
    document.title=`${label} — Ateliers Inclusion Numérique`;
  },[view]);

  // ── Handlers ──────────────────────────────────────────────────
  function handleChoixConseiller(nom){
    setFiltreConseiller(nom);
    setShowPicker(false);
    setView(visibility.historique?'historique':visibility.calendrier?'calendrier':visibility.saisie?'saisie':'dashboard');
  }
  function handleEdit(id){setEditingId(id);setPrefillData(null);setView('saisie');}
  function handleSaved(){loadData();setView('historique');}
  async function handleDelete(id){
    try{const res=await apiFetch('delete',{_id:id});if(!res.ok)throw new Error(res.error);showToast('✅ Atelier supprimé');loadData();}
    catch(err){showToast('❌ '+err.message,false);}
  }
  function handleDuplicate(entry){
    const{_id,_n,date,horaire,ampm,inscrits,presents,remarques,...rest}=entry;
    setPrefillData({...rest});setEditingId(null);setView('saisie');
  }

  // ── Vue Accueil ───────────────────────────────────────────────
  if(maintenance===null) return CE('div',{style:{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#f0f4f8'}},CE('div',{style:{fontSize:13,color:'#718096'}},'Chargement…'));
  if(maintenance!==false) return CE(MaintenanceScreen,{msg:maintenance.msg});

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
          'Chargement…')
      ),
      CE('div',{className:'main'},
        error
          ? CE('div',{className:'error-box'},CE('strong',null,'❌ Impossible de charger'),CE('span',null,error),CE('button',{className:'btn btn-primary',onClick:loadData},'🔄 Réessayer'))
          : CE('div',null,
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
              CE(VueAccueil,{conseillers:conseillerActifs,onChoix:handleChoixConseiller,loading})
            )
      ),
      CE('div',{id:'toast',className:'toast',style:{opacity:0}})
    );
  }

  const conseillerActifs = lists.conseillers.filter(c=>!inactifsSet.has(c));

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

      CE('div',{className:'sidebar-sep'}),
      CE('span',{className:'sidebar-group-label'},'Stats'),
      sideBtn('dashboard','📊','Dashboard',visibility.dashboard),
      sideBtn('bingo','🎯','Bingo',visibility.bingo),

      CE('div',{className:'sidebar-bottom'},
        CE('select',{className:'sidebar-year',value:annee,onChange:e=>setAnnee(e.target.value),title:'Année chargée'},
          [String(new Date().getFullYear()-1),String(new Date().getFullYear()),String(new Date().getFullYear()+1)].map(y=>CE('option',{key:y,value:y},y))
        ),
        newEntries.length>0&&CE('button',{
          className:'sidebar-notif-btn',
          title:`${newEntries.length} nouveaux ateliers`,
          onClick:()=>{setView('historique');window._filterNewEntries&&window._filterNewEntries(newEntries.map(e=>e._id));setNewEntries([]);}
        }, CE('span',null,'🔔'), CE('span',null,newEntries.length)),
        CE('button',{
          className:'sidebar-accueil-btn', title:'Retour accueil',
          onClick:()=>{ resetConseiller(); setView('accueil'); }
        }, CE('span',null,'↩'), CE('span',{className:'sidebar-accueil-lbl'},'Accueil'))
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
        error&&CE('div',{className:'error-box'},CE('strong',null,'❌ Impossible de charger'),CE('span',null,error),CE('button',{className:'btn btn-primary',onClick:loadData},'🔄 Réessayer')),
        loading&&!error&&CE('div',null,
          [1,2,3].map(i=>CE('div',{key:i,className:'skeleton skeleton-card'}))
        ),
        // viewRef sur le wrapper — capte les change events des selects internes
        !loading&&!error&&CE('div',{ref:viewRef,className:'view-anim',key:view+'_'+(filtreConseiller||'all')},
          view==='saisie'&&visibility.saisie&&CE(VueSaisie,{entries,onSaved:handleSaved,onNewEntry:e=>{setNewEntries(n=>[e,...n]);setSeenIds(s=>{const ns=new Set(s);ns.add(e._id);return ns;});},lists,editingId,onClearEdit:()=>setEditingId(null),prefillData,onClearPrefill:()=>setPrefillData(null),accentColor:conseillerColor(filtreConseiller||'')}),
          view==='historique'&&visibility.historique&&CE(VueHistorique,{entries,onEdit:handleEdit,onDelete:handleDelete,onRefresh:loadData,onDuplicate:handleDuplicate,initConseiller:filtreConseiller,onResetConseiller:()=>{},canDelete:true}),
          view==='agenda'&&visibility.agenda&&CE(VueAgendaSemaine,{entries,onEdit:handleEdit,onDelete:handleDelete,onDuplicate:handleDuplicate,canDelete:true,initConseiller:filtreConseiller,accentColor}),
          view==='calendrier'&&visibility.calendrier&&CE(VueCalendrier,{entries,onEdit:handleEdit,onDelete:handleDelete,onRefresh:loadData,onDuplicate:handleDuplicate,initConseiller:filtreConseiller,onResetConseiller:()=>{},canDelete:true}),
          view==='dashboard'&&visibility.dashboard&&CE(VueDashboardTabs,{entries,conseillers:lists.conseillers}),
          view==='carte'&&visibility.carte&&CE(VueCarte,{entries,active:view==='carte'}),
          view==='roadmap'&&visibility.roadmap&&CE(VueRoadmap,{entries,annee,conseillers:lists.conseillers}),
          view==='bingo'&&visibility.bingo&&CE(VueBingo,{entries})
        )
      )
    ),

    CE('div',{id:'toast',className:'toast',style:{opacity:0}})
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(CE(App));