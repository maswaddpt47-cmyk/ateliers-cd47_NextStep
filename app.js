// ── VueAgendaSemaine — Planning hebdo AM/PM ──────────────────
function VueAgendaSemaine({entries,onEdit,onDelete,onDuplicate,canDelete,initConseiller,accentColor}){
  const[weekOffset,setWeekOffset]=React.useState(0);
  const[filterConseiller,setFilterConseiller]=React.useState(initConseiller||'Tous');
  const[selectedEntry,setSelectedEntry]=React.useState(null);
  const[confirmDel,setConfirmDel]=React.useState(null);
  function getMondayOfWeek(offset){const t=new Date();const day=t.getDay();const diff=day===0?-6:1-day;const m=new Date(t);m.setDate(t.getDate()+diff+offset*7);m.setHours(0,0,0,0);return m;}
  const monday=getMondayOfWeek(weekOffset);
  const weekDays=Array.from({length:5},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return d;});
  const dk=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const firstDay=dk(weekDays[0]);const lastDay=dk(weekDays[4]);
  const conseillers=[...new Set(entries.map(e=>e.conseiller).filter(Boolean))].sort();
  const weekEntries=entries.filter(e=>e.date>=firstDay&&e.date<=lastDay);
  const filtered=filterConseiller==='Tous'?weekEntries:weekEntries.filter(e=>e.conseiller===filterConseiller);
  function isAM(e){if(e.ampm)return e.ampm==='AM';const h=e.horaire?parseInt(String(e.horaire).replace(/[Hh]/,':').split(':')[0])||9:9;return h<12;}
  const slots={};weekDays.forEach(d=>{const k=dk(d);slots[k]={AM:[],PM:[]};});
  filtered.forEach(e=>{if(slots[e.date])slots[e.date][isAM(e)?'AM':'PM'].push(e);});
  const MOIS_LONG=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  function fmtWeekLabel(){const d1=weekDays[0];const d5=weekDays[4];if(d1.getMonth()===d5.getMonth())return`${d1.getDate()} – ${d5.getDate()} ${MOIS_LONG[d5.getMonth()]} ${d5.getFullYear()}`;return`${d1.getDate()} ${MOIS_LONG[d1.getMonth()]} – ${d5.getDate()} ${MOIS_LONG[d5.getMonth()]} ${d5.getFullYear()}`;}
  const todayStr=todayLocal();
  const totalW=filtered.length;const planifies=filtered.filter(e=>e.statut==='Planifié').length;const realises=filtered.filter(e=>e.statut==='Réalisé').length;const retards=filtered.filter(e=>isRetard(e)).length;
  function renderCard(e){const color=conseillerColor(e.conseiller);const statColor=STATUT_COLORS[e.statut]||'#94a3b8';const retard=isRetard(e);return CE('div',{key:e._id,onClick:()=>setSelectedEntry(e),style:{background:'#fff',borderRadius:8,borderLeft:`4px solid ${color}`,padding:'6px 8px',marginBottom:4,cursor:'pointer',boxShadow:'0 1px 4px rgba(0,0,0,.09)',fontSize:11,outline:retard?`1.5px solid #fca5a5`:'none'}},CE('div',{style:{display:'flex',alignItems:'center',gap:4,marginBottom:2}},CE('span',{style:{width:6,height:6,borderRadius:'50%',background:statColor,flexShrink:0,display:'inline-block'}}),CE('span',{style:{fontWeight:700,color,fontSize:10,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},e.conseiller||'—')),CE('div',{style:{fontWeight:600,color:'#1a202c',lineHeight:1.25,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:1}},e.thematique||e.commune||'—'),e.commune&&e.thematique&&CE('div',{style:{color:'#718096',fontSize:10,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},e.commune),e.horaire&&CE('div',{style:{color:'#a0aec0',fontSize:10,marginTop:1}},e.horaire),retard&&CE('div',{style:{color:'#dc2626',fontSize:9,fontWeight:700,marginTop:2}},'⚠ À mettre à jour'));}
  function SidePanel(){if(!selectedEntry)return null;const e=selectedEntry;const color=conseillerColor(e.conseiller);return CE(React.Fragment,null,CE('div',{className:'side-panel-overlay',onClick:()=>setSelectedEntry(null)}),CE('div',{className:'side-panel open'},CE('div',{className:'side-panel-header'},CE('h3',{style:{fontSize:14}},e.thematique||e.commune||'Atelier'),CE('button',{onClick:()=>setSelectedEntry(null),style:{background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#718096',padding:0}},'✕')),CE('div',{className:'side-panel-body'},CE('div',{className:'sp-field'},CE('label',null,'Statut'),badgePill(e.statut,isRetard(e))),CE('div',{className:'sp-field'},CE('label',null,'Conseiller'),CE('div',{style:{fontWeight:700,color,fontSize:13}},e.conseiller||'—')),CE('div',{className:'sp-field'},CE('label',null,'Date & Créneau'),CE('div',{style:{fontWeight:600}},fmtDate(e.date)+(e.horaire?' — '+e.horaire:'')+(e.ampm?' ('+e.ampm+')':''))),CE('div',{className:'sp-field'},CE('label',null,'Commune'),CE('div',null,e.commune||'—')),CE('div',{className:'sp-field'},CE('label',null,'Thématique'),CE('div',null,e.thematique||'—')),e.orienteur&&CE('div',{className:'sp-field'},CE('label',null,'Orienteur'),CE('div',null,e.orienteur)),(e.inscrits||e.presents)&&CE('div',{className:'sp-field'},CE('label',null,'Participants'),CE('div',null,(e.presents||'—')+' présents / '+(e.inscrits||'—')+' inscrits')),e.remarques&&CE('div',{className:'sp-field'},CE('label',null,'Remarques'),CE('div',{style:{fontSize:12,color:'#4a5568',fontStyle:'italic',lineHeight:1.5}},e.remarques))),CE('div',{className:'side-panel-footer'},onEdit&&CE('button',{className:'btn btn-primary btn-sm',onClick:()=>{onEdit(e._id);setSelectedEntry(null);}},'✏️ Modifier'),onDuplicate&&CE('button',{className:'btn btn-secondary btn-sm',onClick:()=>{onDuplicate(e);setSelectedEntry(null);}},'📋 Dupliquer'),canDelete&&CE('button',{className:'btn btn-danger btn-sm',onClick:()=>{setConfirmDel({id:e._id,label:`${fmtDate(e.date)} — ${e.thematique||e.commune||e._id}`});setSelectedEntry(null);}},'🗑️ Supprimer'))));}
  return CE('div',null,CE('div',{className:'card'},CE('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:14,flexWrap:'wrap'}},CE('div',{style:{display:'flex',gap:4}},CE('button',{className:'btn btn-secondary btn-sm',onClick:()=>setWeekOffset(w=>w-1)},'← Préc.'),CE('button',{className:'btn btn-secondary btn-sm',onClick:()=>setWeekOffset(0),disabled:weekOffset===0,style:{opacity:weekOffset===0?.4:1}},'Auj.'),CE('button',{className:'btn btn-secondary btn-sm',onClick:()=>setWeekOffset(w=>w+1)},'Suiv. →')),CE('h2',{style:{margin:0,flex:1,textAlign:'center',fontSize:14,fontWeight:700,color:'#1a202c'}},'🗓️ Semaine du '+fmtWeekLabel()),CE('div',{style:{display:'flex',gap:5,flexWrap:'wrap'}},CE('span',{style:{fontSize:11,background:'#f1f5f9',borderRadius:20,padding:'3px 10px',color:'#475569'}},totalW+' atelier'+(totalW!==1?'s':'')),planifies>0&&CE('span',{style:{fontSize:11,background:'#dbeafe',borderRadius:20,padding:'3px 10px',color:'#1d4ed8'}},planifies+' planifié'+(planifies>1?'s':'')),realises>0&&CE('span',{style:{fontSize:11,background:'#dcfce7',borderRadius:20,padding:'3px 10px',color:'#166534'}},realises+' réalisé'+(realises>1?'s':'')),retards>0&&CE('span',{style:{fontSize:11,background:'#fee2e2',borderRadius:20,padding:'3px 10px',color:'#991b1b',fontWeight:700}},'⚠ '+retards+' retard'+(retards>1?'s':'')))),CE('div',{className:'chip-bar',style:{marginBottom:14}},CE('span',{className:'chip chip-all'+(filterConseiller==='Tous'?' active':''),onClick:()=>setFilterConseiller('Tous')},CE('span',{className:'chip-dot'}),'Tous'),conseillers.map(c=>CE('span',{key:c,className:'chip'+(filterConseiller===c?' active':''),style:{color:conseillerColor(c)},onClick:()=>setFilterConseiller(f=>f===c?'Tous':c)},CE('span',{className:'chip-dot',style:{background:conseillerColor(c)}}),c))),CE('div',{style:{overflowX:'auto'}},CE('table',{style:{width:'100%',borderCollapse:'separate',borderSpacing:'4px 0',tableLayout:'fixed',minWidth:580}},CE('thead',null,CE('tr',null,CE('th',{style:{width:36,border:'none',background:'transparent'}}),weekDays.map(d=>{const dkey=dk(d);const isToday=dkey===todayStr;const count=slots[dkey]?slots[dkey].AM.length+slots[dkey].PM.length:0;const acc=isToday?accentColor:'#6b7280';return CE('th',{key:dkey,style:{padding:'10px 6px 8px',textAlign:'center',border:'none',background:isToday?accentColor+'15':'#f8fafc',borderRadius:'12px 12px 0 0',fontWeight:400}},CE('div',{style:{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:acc}},JOURS[d.getDay()]),CE('div',{style:{fontSize:26,fontWeight:800,lineHeight:1.1,color:isToday?accentColor:'#1a202c',margin:'2px 0'}},d.getDate()),CE('div',{style:{fontSize:10,color:'#9ca3af',marginBottom:4}},MOIS[d.getMonth()]),count>0&&CE('span',{style:{display:'inline-block',background:isToday?accentColor:'#e2e8f0',color:isToday?'#fff':'#4a5568',borderRadius:20,fontSize:10,fontWeight:700,padding:'1px 8px'}},count));}))),CE('tbody',null,['AM','PM'].map((slot,si)=>CE('tr',{key:slot},CE('td',{style:{textAlign:'center',fontWeight:800,fontSize:11,color:slot==='AM'?'#2563eb':'#d97706',background:slot==='AM'?'#eff6ff':'#fffbeb',borderRadius:8,padding:'6px 2px',verticalAlign:'middle',width:36}},slot),weekDays.map(d=>{const dkey=dk(d);const isToday=dkey===todayStr;const items=slots[dkey]?slots[dkey][slot]:[];return CE('td',{key:dkey+slot,style:{verticalAlign:'top',padding:4,background:isToday?(slot==='AM'?accentColor+'12':accentColor+'08'):(slot==='AM'?'#f8fafc':'#fafafa'),borderBottom:si===0?`1px dashed ${isToday?accentColor+'40':'#e2e8f0'}`:'none',borderRadius:si===1?'0 0 10px 10px':'0',minHeight:70}},items.length>0?items.map(e=>renderCard(e)):CE('div',{style:{height:66,display:'flex',alignItems:'center',justifyContent:'center'}},CE('span',{style:{fontSize:14,color:'#e2e8f0'}},slot==='AM'?'☀️':'🌙')));}))))))),CE(SidePanel,null),confirmDel&&CE(ConfirmModal,{item:confirmDel,onConfirm:async()=>{if(onDelete)await onDelete(confirmDel.id);setConfirmDel(null);},onCancel:()=>setConfirmDel(null)}));
}

// ── App Frontend (conseillers) v10.0 ─────────────────────────
var VIEW_META_F = {
  saisie:     {ico:'✏️',  label:'Saisie',      group:'Action'},
  historique: {ico:'📋',  label:'Historique',   group:'Voir'},
  agenda:     {ico:'🗓️', label:'Agenda',        group:'Voir'},
  calendrier: {ico:'📅',  label:'Calendrier',   group:'Voir'},
  carte:      {ico:'🗺️', label:'Carte',        group:'Voir'},
  roadmap:    {ico:'🛣️', label:'Roadmap',      group:'Voir'},
  graphiques: {ico:'📊',  label:'Statistiques', group:'Stats'},
  bingo:      {ico:'🎯',  label:'Bingo',        group:'Stats'},
};

function App(){
  const[view,setView]              = React.useState('accueil');
  const[entries,setEntries]        = React.useState([]);
  const[loading,setLoading]        = React.useState(true);
  const[error,setError]            = React.useState(null);
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
      const val = e.target.value;
      if(lists.conseillers.includes(val)){
        // Conseiller sélectionné dans un filtre interne → sync identité

        setFiltreConseiller(val);
      } else if(!val || val === '' || val === 'all') {
        // Filtre remis à "Tous" → on efface l'identité courante
        // mais uniquement si c'est bien le select du filtre conseiller
        // (on ne veut pas réinitialiser sur le select mois ou commune)
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
              CE(VueAccueil,{conseillers:lists.conseillers,onChoix:handleChoixConseiller,loading})
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
      sideBtn('saisie','✏️','Saisie',visibility.saisie),

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
              lists.conseillers.map(c=>CE('div',{
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

// ════════════════════════════════════════════════════════════
// ── VueRoadmap — Timeline & Densité par conseiller ──────────
// ════════════════════════════════════════════════════════════
function VueRoadmap({entries,annee,conseillers}){
  const[filterConseiller,setFilterConseiller]=React.useState('Tous');
  const[filterStatut,setFilterStatut]=React.useState('Tous');
  const[hoveredItem,setHoveredItem]=React.useState(null);
  const[tooltipPos,setTooltipPos]=React.useState({x:0,y:0});
  const[viewMode,setViewMode]=React.useState('gantt');
  const[tooltip,setTooltip]=React.useState(null);
  const[dateFrom,setDateFrom]=React.useState(annee+'-01-01');
  const[dateTo,setDateTo]=React.useState(annee+'-12-31');

  // Resync période quand l'année sidebar change
  React.useEffect(()=>{setDateFrom(annee+'-01-01');setDateTo(annee+'-12-31');},[annee]);

  const MOIS_FR=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

  const STATUT_STYLE={
    'Réalisé':    {bg:'#16a34a',border:'#15803d',label:'✓'},
    'Planifié':   {bg:'#2563eb',border:'#1d4ed8',label:'◷'},
    'Annulé':     {bg:'#dc2626',border:'#b91c1c',label:'✕'},
    'Non réalisé':{bg:'#d97706',border:'#b45309',label:'!'},
    'Reporté':    {bg:'#9333ea',border:'#7e22ce',label:'↺'},
  };

  // Raccourcis de période
  const PRESETS=[
    {label:'Année',from:annee+'-01-01',to:annee+'-12-31'},
    {label:'T1',from:annee+'-01-01',to:annee+'-03-31'},
    {label:'T2',from:annee+'-04-01',to:annee+'-06-30'},
    {label:'T3',from:annee+'-07-01',to:annee+'-09-30'},
    {label:'T4',from:annee+'-10-01',to:annee+'-12-31'},
    {label:'S1',from:annee+'-01-01',to:annee+'-06-30'},
    {label:'S2',from:annee+'-07-01',to:annee+'-12-31'},
  ];
  const activePreset=PRESETS.find(p=>p.from===dateFrom&&p.to===dateTo)||null;

  // Validation : from <= to
  const dateError=dateFrom&&dateTo&&dateFrom>dateTo;

  const rangeEntries=React.useMemo(()=>entries.filter(e=>{
    if(!e.date)return false;
    const d=String(e.date).slice(0,10);
    return d>=dateFrom&&d<=dateTo;
  }),[entries,dateFrom,dateTo]);

  const filtered=React.useMemo(()=>rangeEntries.filter(e=>{
    if(filterConseiller!=='Tous'&&e.conseiller!==filterConseiller)return false;
    if(filterStatut!=='Tous'&&e.statut!==filterStatut)return false;
    return true;
  }),[rangeEntries,filterConseiller,filterStatut]);

  const kpis=React.useMemo(()=>{
    const total=filtered.length;
    const realises=filtered.filter(e=>e.statut==='Réalisé').length;
    const presents=filtered.reduce((s,e)=>s+(parseInt(e.presents)||0),0);
    const taux=total>0?Math.round(realises/total*100):0;
    return{total,realises,presents,taux};
  },[filtered]);

  // posPercent basé sur la période sélectionnée
  function posPercent(dateStr){
    try{
      const d=new Date(String(dateStr).slice(0,10)+'T00:00:00');
      const start=new Date(dateFrom+'T00:00:00');
      const end=new Date(dateTo+'T00:00:00');
      const span=end-start||1;
      return Math.max(0,Math.min(100,((d-start)/span)*100));
    }catch{return 0;}
  }

  // Marqueurs de mois dans la plage sélectionnée
  const monthMarkers=React.useMemo(()=>{
    const markers=[];
    const start=new Date(dateFrom+'T00:00:00');
    const end=new Date(dateTo+'T00:00:00');
    const cur=new Date(Date.UTC(start.getFullYear(),start.getMonth(),1));
    while(cur<=end){
      const label=MOIS_FR[cur.getMonth()]+(cur.getFullYear()!==parseInt(annee)?' '+String(cur.getFullYear()).slice(2):'');
      const ds=cur.getFullYear()+'-'+String(cur.getMonth()+1).padStart(2,'0')+'-01';
      markers.push({label,pos:posPercent(ds)});
      cur.setMonth(cur.getMonth()+1);
    }
    return markers;
  },[dateFrom,dateTo,annee]);

  const todayStr=new Date().toISOString().slice(0,10);
  const todayInRange=todayStr>=dateFrom&&todayStr<=dateTo;
  const todayPos=todayInRange?posPercent(todayStr):null;

  const displayedConseillers=filterConseiller==='Tous'
    ?(conseillers&&conseillers.length>0?conseillers:[...new Set(rangeEntries.map(e=>e.conseiller).filter(Boolean))])
    :[filterConseiller];

  function handleMouseMove(e){setTooltipPos({x:e.clientX,y:e.clientY});}

  return CE('div',{onMouseMove:handleMouseMove},

    // ── KPIs + Filtres ──────────────────────────────────────
    CE('div',{className:'card',style:{marginBottom:12}},

      // Titre + toggle vue
      CE('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10,marginBottom:14}},
        CE('h2',{style:{margin:0}},'🛣️ Roadmap '+annee),
        CE('div',{style:{display:'flex',background:'#f1f5f9',borderRadius:8,padding:3,gap:2}},
          [['gantt','📊 Timeline'],['densite','🔥 Densité']].map(([v,l])=>
            CE('button',{key:v,onClick:()=>setViewMode(v),style:{
              padding:'5px 14px',borderRadius:6,border:'none',cursor:'pointer',
              fontSize:12,fontWeight:600,
              background:viewMode===v?'#1e3a8a':'transparent',
              color:viewMode===v?'#fff':'#718096',transition:'all .2s'
            }},l)
          )
        )
      ),

      // ── Sélecteur de période ────────────────────────────────
      CE('div',{style:{
        display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',
        background:'#f8fafc',borderRadius:8,padding:'10px 14px',
        border:'1px solid '+(dateError?'#fca5a5':'#e2e8f0'),
        marginBottom:14
      }},
        CE('span',{style:{fontSize:11,fontWeight:700,color:'#4a5568',whiteSpace:'nowrap'}},'📅 Période'),
        // Raccourcis
        CE('div',{style:{display:'flex',gap:4,flexWrap:'wrap'}},
          PRESETS.map(p=>CE('button',{key:p.label,onClick:()=>{setDateFrom(p.from);setDateTo(p.to);},style:{
            padding:'3px 9px',borderRadius:6,cursor:'pointer',fontSize:11,fontWeight:600,
            border:'1.5px solid '+(activePreset&&activePreset.label===p.label?'#1e3a8a':'#e2e8f0'),
            background:activePreset&&activePreset.label===p.label?'#1e3a8a':'#fff',
            color:activePreset&&activePreset.label===p.label?'#fff':'#4a5568',
            transition:'all .15s'
          }},p.label))
        ),
        // Séparateur
        CE('div',{style:{width:1,height:24,background:'#e2e8f0',flexShrink:0}}),
        // Inputs date
        CE('div',{style:{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}},
          CE('input',{type:'date',value:dateFrom,
            onChange:e=>{setDateFrom(e.target.value);},
            style:{
              padding:'4px 8px',border:'1.5px solid '+(dateError?'#fca5a5':'#e2e8f0'),
              borderRadius:6,fontSize:12,color:'#1a202c',background:'#fff',cursor:'pointer',outline:'none'
            }
          }),
          CE('span',{style:{fontSize:12,color:'#9ca3af',fontWeight:600}},'→'),
          CE('input',{type:'date',value:dateTo,
            onChange:e=>{setDateTo(e.target.value);},
            style:{
              padding:'4px 8px',border:'1.5px solid '+(dateError?'#fca5a5':'#e2e8f0'),
              borderRadius:6,fontSize:12,color:'#1a202c',background:'#fff',cursor:'pointer',outline:'none'
            }
          }),
          dateError&&CE('span',{style:{fontSize:11,color:'#dc2626',fontWeight:600}},'⚠ Date de début > fin')
        )
      ),

      // KPIs
      CE('div',{style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}},
        [
          {label:'Ateliers',value:kpis.total,color:'#1e3a8a'},
          {label:'Réalisés',value:kpis.realises,color:'#16a34a'},
          {label:'Participants',value:kpis.presents,color:'#d97706'},
          {label:'Taux réalisation',value:kpis.taux+'%',color:kpis.taux>=75?'#16a34a':kpis.taux>=50?'#d97706':'#dc2626'},
        ].map((k,ki)=>CE('div',{key:k.label,style:{
          background:'#f8fafc',borderRadius:8,padding:'10px 14px',
          borderLeft:'3px solid '+k.color,animation:`fadeInUp .35s ease ${ki*0.08}s both`
        }},
          CE('div',{style:{fontSize:22,fontWeight:800,color:k.color}},k.value),
          CE('div',{style:{fontSize:11,color:'#718096',marginTop:2}},k.label)
        ))
      ),

      // Filtres conseiller + statut
      CE('div',{style:{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center'}},
        CE('div',{style:{display:'flex',gap:5,alignItems:'center',flexWrap:'wrap'}},
          CE('span',{style:{fontSize:11,color:'#9ca3af',fontWeight:600}},'Conseiller :'),
          ['Tous',...(conseillers||[])].map(c=>CE('button',{key:c,onClick:()=>setFilterConseiller(c),style:{
            padding:'3px 10px',borderRadius:20,cursor:'pointer',fontSize:11,
            fontWeight:filterConseiller===c?700:400,
            border:'1.5px solid '+(filterConseiller===c?conseillerColor(c)||'#1e3a8a':'#e2e8f0'),
            background:filterConseiller===c?(conseillerColor(c)||'#1e3a8a')+'18':'transparent',
            color:filterConseiller===c?conseillerColor(c)||'#1e3a8a':'#4a5568',
            transition:'all .15s'
          }},c==='Tous'?'Tous':c.split(' ')[0]))
        ),
        CE('div',{style:{display:'flex',gap:5,alignItems:'center',flexWrap:'wrap'}},
          CE('span',{style:{fontSize:11,color:'#9ca3af',fontWeight:600}},'Statut :'),
          ['Tous',...Object.keys(STATUT_STYLE)].map(s=>CE('button',{key:s,onClick:()=>setFilterStatut(s),style:{
            padding:'3px 10px',borderRadius:20,cursor:'pointer',fontSize:11,
            fontWeight:filterStatut===s?700:400,
            border:'1.5px solid '+(filterStatut===s?(STATUT_STYLE[s]?.bg||'#1e3a8a'):'#e2e8f0'),
            background:filterStatut===s?(STATUT_STYLE[s]?.bg||'#1e3a8a')+'18':'transparent',
            color:filterStatut===s?(STATUT_STYLE[s]?.bg||'#1e3a8a'):'#4a5568',
            transition:'all .15s'
          }},s))
        )
      )
    ),

    // ── GANTT ────────────────────────────────────────────────
    viewMode==='gantt'&&CE('div',{className:'card',style:{padding:0,overflow:'hidden'}},
      // En-tête mois
      CE('div',{style:{display:'flex',borderBottom:'1px solid #e2e8f0',background:'#f8fafc'}},
        CE('div',{style:{width:170,minWidth:170,padding:'8px 16px',fontSize:10,fontWeight:700,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'.08em',borderRight:'1px solid #e2e8f0'}},'Conseiller'),
        CE('div',{style:{flex:1,position:'relative',height:32}},
          monthMarkers.map((m,i)=>CE('div',{key:i,style:{
            position:'absolute',left:m.pos+'%',top:0,height:'100%',
            borderLeft:'1px dashed #e2e8f0',display:'flex',alignItems:'center',paddingLeft:5
          }},CE('span',{style:{fontSize:10,fontWeight:700,color:'#9ca3af',whiteSpace:'nowrap'}},m.label))),
          todayPos!==null&&CE('div',{style:{
            position:'absolute',left:todayPos+'%',top:0,height:'100%',
            borderLeft:'2px solid #dc2626',pointerEvents:'none'
          }},CE('span',{style:{
            position:'absolute',top:6,left:4,fontSize:9,color:'#dc2626',
            fontWeight:700,whiteSpace:'nowrap',background:'#fff',padding:'0 2px',borderRadius:2
          }},'Auj.'))
        )
      ),
      // Lignes conseillers
      displayedConseillers.map((conseiller,ci)=>{
        const col=conseillerColor(conseiller)||'#1e3a8a';
        const items=filtered.filter(e=>e.conseiller===conseiller);
        return CE('div',{key:conseiller,style:{
          display:'flex',background:ci%2===0?'#fff':'#fafbfc',
          borderBottom:'1px solid #f0f4f8',minHeight:58,animation:`fadeInUp .3s ease ${ci*0.06}s both`
        }},
          CE('div',{style:{
            width:170,minWidth:170,padding:'10px 16px',
            borderRight:'1px solid #e2e8f0',
            display:'flex',alignItems:'center',gap:8
          }},
            CE('div',{style:{width:8,height:8,borderRadius:'50%',background:col,flexShrink:0,boxShadow:'0 0 4px '+col+'88'}}),
            CE('div',null,
              CE('div',{style:{fontSize:12,fontWeight:700,color:'#1a202c',lineHeight:1.2}},conseiller.split(' ')[0]),
              CE('div',{style:{fontSize:10,color:'#9ca3af'}},conseiller.split(' ').slice(1).join(' '))
            ),
            CE('span',{style:{
              marginLeft:'auto',fontSize:10,fontWeight:700,
              background:col+'18',color:col,padding:'2px 7px',
              borderRadius:20,border:'1px solid '+col+'30'
            }},items.length)
          ),
          CE('div',{style:{flex:1,position:'relative',minHeight:58}},
            monthMarkers.map((m,i)=>CE('div',{key:i,style:{
              position:'absolute',left:m.pos+'%',top:0,height:'100%',
              borderLeft:'1px dashed #f0f4f8',pointerEvents:'none'
            }})),
            todayPos!==null&&CE('div',{style:{
              position:'absolute',left:todayPos+'%',top:0,height:'100%',
              borderLeft:'1px solid #dc262633',pointerEvents:'none'
            }}),
            items.map(item=>{
              const pos=posPercent(item.date);
              const st=STATUT_STYLE[item.statut]||{bg:'#9ca3af',border:'#6b7280',label:'?'};
              const isH=hoveredItem&&hoveredItem._id===item._id;
              return CE('div',{
                key:item._id||item.date+item.conseiller+Math.random(),
                onMouseEnter:()=>setHoveredItem(item),
                onMouseLeave:()=>setHoveredItem(null),
                style:{
                  position:'absolute',left:'calc('+pos+'% - 9px)',
                  top:'50%',transform:'translateY(-50%) scale('+(isH?1.35:1)+')',
                  width:18,height:18,borderRadius:5,
                  background:st.bg,border:'2px solid '+st.border,
                  cursor:'pointer',zIndex:isH?20:1,
                  boxShadow:isH?'0 0 10px '+st.bg+'88':'none',
                  transition:'transform .12s,box-shadow .12s',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:8,color:'#fff',fontWeight:700,userSelect:'none'
                }
              },st.label);
            })
          )
        );
      }),
      // Légende
      CE('div',{style:{display:'flex',gap:14,padding:'10px 16px',background:'#f8fafc',borderTop:'1px solid #e2e8f0',flexWrap:'wrap'}},
        Object.entries(STATUT_STYLE).map(([s,st])=>CE('div',{key:s,style:{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'#4a5568'}},
          CE('div',{style:{width:14,height:14,borderRadius:3,background:st.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:7,color:'#fff',fontWeight:700}},st.label),
          s
        )),
        filtered.length===0&&CE('span',{style:{fontSize:12,color:'#9ca3af',marginLeft:'auto'}},'Aucun atelier pour cette période')
      )
    ),

    // ── DENSITÉ ──────────────────────────────────────────────
    viewMode==='densite'&&(()=>{
      // Calcul des mois visibles dans la plage dateFrom → dateTo
      const visibleMonths=[];
      const cur=new Date(dateFrom+'T00:00:00');
      const endD=new Date(dateTo+'T00:00:00');
      // On démarre au 1er du mois de dateFrom
      cur.setDate(1);
      while(cur<=endD){
        visibleMonths.push({
          year:cur.getFullYear(),
          month:cur.getMonth()+1, // 1-12
          label:MOIS_FR[cur.getMonth()]+(cur.getFullYear()!==parseInt(annee)?' '+String(cur.getFullYear()).slice(2):'')
        });
        cur.setMonth(cur.getMonth()+1);
      }

      // max global sur tous conseillers/mois pour harmoniser les barres
      const allCounts=displayedConseillers.flatMap(conseiller=>{
        const items=filtered.filter(e=>e.conseiller===conseiller);
        return visibleMonths.map(({year,month})=>
          items.filter(e=>{
            const d=String(e.date||'');
            return parseInt(d.slice(0,4))===year&&parseInt(d.slice(5,7))===month;
          }).length
        );
      });
      const globalMax=Math.max(...allCounts,1);

      return CE('div',{className:'card'},
        CE('div',{style:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:8}},
          CE('h3',{style:{margin:0,fontSize:14,color:'#1a202c'}},'Ateliers par mois & conseiller'),
          CE('div',{style:{display:'flex',gap:12,fontSize:11,color:'#9ca3af'}},
            CE('span',null,'▪ Clair = planifiés/autres'),
            CE('span',null,'▪ Plein = réalisés')
          )
        ),
        visibleMonths.length===0
          ?CE('p',{style:{color:'#9ca3af',fontSize:13}},'Aucune période sélectionnée.')
          :CE('div',{style:{overflowX:'auto'}},
            CE('table',{style:{width:'100%',borderCollapse:'collapse',minWidth:Math.max(400,visibleMonths.length*52+140)}},
              CE('thead',null,CE('tr',null,
                CE('th',{style:{width:140,minWidth:140,textAlign:'left',padding:'6px 10px',fontSize:11,fontWeight:700,color:'#9ca3af',borderBottom:'2px solid #e2e8f0'}},'Conseiller'),
                visibleMonths.map(({label},i)=>CE('th',{key:i,style:{textAlign:'center',padding:'6px 8px',fontSize:11,fontWeight:700,color:'#9ca3af',borderBottom:'2px solid #e2e8f0',whiteSpace:'nowrap'}},label))
              )),
              CE('tbody',null,
                displayedConseillers.map(conseiller=>{
                  const col=conseillerColor(conseiller)||'#1e3a8a';
                  const items=filtered.filter(e=>e.conseiller===conseiller);
                  const byMonth=visibleMonths.map(({year,month})=>{
                    const inMonth=items.filter(e=>{
                      const d=String(e.date||'');
                      return parseInt(d.slice(0,4))===year&&parseInt(d.slice(5,7))===month;
                    });
                    return{count:inMonth.length,realises:inMonth.filter(e=>e.statut==='Réalisé').length};
                  });
                  return CE('tr',{key:conseiller},
                    CE('td',{style:{padding:'8px 10px',borderBottom:'1px solid #f0f4f8',whiteSpace:'nowrap'}},
                      CE('div',{style:{display:'flex',alignItems:'center',gap:6}},
                        CE('div',{style:{width:8,height:8,borderRadius:'50%',background:col,flexShrink:0}}),
                        CE('span',{style:{fontSize:12,fontWeight:700,color:'#1a202c'}},conseiller.split(' ')[0])
                      )
                    ),
                    byMonth.map((m,mi)=>{
                      const mLabel=visibleMonths[mi].label;
                      const planifies=m.count-m.realises;
                      return CE('td',{key:mi,style:{
                        padding:'8px 4px',borderBottom:'1px solid #f0f4f8',
                        verticalAlign:'bottom',textAlign:'center',position:'relative',cursor:m.count>0?'pointer':'default'
                      },
                      onMouseEnter:m.count>0?e=>{const r=e.currentTarget.getBoundingClientRect();setTooltip({conseiller,mois:mLabel,total:m.count,realises:m.realises,planifies,col,x:r.left+r.width/2,y:r.top});}:null,
                      onMouseLeave:()=>setTooltip(null)
                      },
                        CE('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:2}},
                          CE('div',{style:{
                            width:26,background:col+'28',borderRadius:'4px 4px 0 0',
                            height:Math.max(4,Math.round(m.count/globalMax*52))+'px',
                            position:'relative',overflow:'hidden'
                          }},
                            CE('div',{style:{
                              position:'absolute',bottom:0,left:0,right:0,
                              height:(m.count>0?Math.round(m.realises/m.count*100):0)+'%',
                              background:col,borderRadius:'4px 4px 0 0'
                            }})
                          ),
                          m.count>0&&CE('span',{style:{fontSize:10,fontWeight:700,color:col}},m.count)
                        )
                      );
                    })
                  );
                })
              )
            )
          ),
        tooltip&&CE('div',{style:{
          position:'fixed',zIndex:9999,
          left:Math.min(tooltip.x,window.innerWidth-160)+'px',
          top:(tooltip.y-88)+'px',
          transform:'translateX(-50%)',
          background:'#1a202c',color:'#fff',
          borderRadius:10,padding:'10px 14px',
          fontSize:12,pointerEvents:'none',
          boxShadow:'0 4px 20px rgba(0,0,0,.3)',
          minWidth:140,lineHeight:1.7
        }},
          CE('div',{style:{fontWeight:700,color:tooltip.col,marginBottom:4}},tooltip.conseiller.split(' ')[0]+' — '+tooltip.mois),
          CE('div',null,React.createElement(React.Fragment,null,'📦 Total : ',CE('strong',null,tooltip.total))),
          CE('div',null,React.createElement(React.Fragment,null,'✅ Réalisés : ',CE('strong',{style:{color:'#4ade80'}},tooltip.realises))),
          CE('div',null,React.createElement(React.Fragment,null,'📅 Planifiés : ',CE('strong',{style:{color:'#93c5fd'}},tooltip.planifies)))
        )
      );
    })(),

    // ── Tooltip opaque ───────────────────────────────────────
    hoveredItem&&CE('div',{style:{
      position:'fixed',
      left:Math.min(tooltipPos.x+16,window.innerWidth-255)+'px',
      top:(tooltipPos.y+18)+'px',
      background:'#1a202c',
      border:'1px solid #2d3748',
      borderRadius:10,padding:'12px 16px',
      boxShadow:'0 8px 24px rgba(0,0,0,.6)',
      zIndex:9999,minWidth:230,
      pointerEvents:'none',color:'#e2e8f0',
    }},
      CE('div',{style:{fontWeight:700,fontSize:13,color:'#fff',marginBottom:8,paddingBottom:8,borderBottom:'1px solid #2d3748'}},
        hoveredItem.thematique||'—'),
      CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px 10px',marginBottom:10}},
        [
          ['📅',String(hoveredItem.date||'—').slice(0,10)],
          ['📍',hoveredItem.commune||'—'],
          ['🏢',hoveredItem.lieu||'—'],
          ['👤',(hoveredItem.conseiller||'—').split(' ')[0]],
          ['📋',(hoveredItem.inscrits||'—')+' inscrits'],
          ['✅',(hoveredItem.presents||'—')+' présents'],
        ].map(([ico,val])=>CE('div',{key:ico,style:{fontSize:11,display:'flex',gap:4,alignItems:'center'}},
          CE('span',null,ico),
          CE('span',{style:{color:'#cbd5e1',fontWeight:600}},String(val))
        ))
      ),
      CE('div',{style:{
        display:'inline-block',padding:'3px 10px',borderRadius:20,
        background:(STATUT_STYLE[hoveredItem.statut]||{bg:'#6b7280'}).bg,
        color:'#fff',fontSize:11,fontWeight:700
      }},
        (STATUT_STYLE[hoveredItem.statut]||{label:'?'}).label+' '+(hoveredItem.statut||'—')
      )
    )
  );
}


function VueDashboard({entries}){
  if(!window.echarts)return CE('div',{className:'card'},CE('p',{style:{color:'#718096',textAlign:'center',padding:'40px 0'}},'⚠️ ECharts non chargé.'));

  const[periodeIdx,setPeriodeIdx]=React.useState(0); // défaut : tout
  const[selectedMonths,setSelectedMonths]=React.useState([]); // mois sélectionnés (1-12)
  const MOIS_LABELS=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  function toggleMonth(m){ setSelectedMonths(s=>s.includes(m)?s.filter(x=>x!==m):[...s,m]); }
  const now=new Date();
  const todayStr=now.toISOString().slice(0,10);
  const todayYM=now.toISOString().slice(0,7);

  function getDateFrom(idx){
    if(idx===0)return '';
    const d=new Date(now);
    if(idx===1){d.setDate(1);return d.toISOString().slice(0,10);}
    if(idx===2){d.setMonth(d.getMonth()-3);return d.toISOString().slice(0,10);}
    if(idx===3){d.setMonth(d.getMonth()-6);return d.toISOString().slice(0,10);}
    if(idx===4){d.setFullYear(d.getFullYear()-1);return d.toISOString().slice(0,10);}
    return '';
  }
  const dateFrom=getDateFrom(periodeIdx);
  const filtered=React.useMemo(()=>{
    let r=dateFrom?entries.filter(e=>e.date&&e.date>=dateFrom):entries;
    if(selectedMonths.length>0) r=r.filter(e=>e.date&&selectedMonths.includes(parseInt(e.date.slice(5,7))));
    return r;
  },[entries,dateFrom,selectedMonths]);

  // Période précédente (même durée) pour tendances
  const prevFiltered=React.useMemo(()=>{
    if(periodeIdx===0)return[];
    const df=new Date(dateFrom);const prevTo=new Date(dateFrom);prevTo.setDate(prevTo.getDate()-1);
    const prevFrom=new Date(df);
    if(periodeIdx===1)prevFrom.setMonth(prevFrom.getMonth()-1);
    if(periodeIdx===2)prevFrom.setMonth(prevFrom.getMonth()-3);
    if(periodeIdx===3)prevFrom.setMonth(prevFrom.getMonth()-6);
    if(periodeIdx===4)prevFrom.setFullYear(prevFrom.getFullYear()-1);
    const pf=prevFrom.toISOString().slice(0,10);const pt=prevTo.toISOString().slice(0,10);
    return entries.filter(e=>e.date&&e.date>=pf&&e.date<=pt);
  },[entries,periodeIdx,dateFrom]);

  function mkTrend(curr,prev){
    if(periodeIdx===0||prev===0)return undefined;
    return Math.round((curr-prev)/prev*100);
  }

  // KPIs
  const realises=filtered.filter(e=>e.statut==='Réalisé');
  const annules=filtered.filter(e=>e.statut==='Annulé');
  const planifies=filtered.filter(e=>e.statut==='Planifié'&&e.date>=todayStr);
  const presents=realises.reduce((s,e)=>s+(parseInt(e.presents)||0),0);
  const inscrits=realises.reduce((s,e)=>s+(parseInt(e.inscrits)||0),0);
  const txPresence=inscrits>0?Math.round(presents/inscrits*100):0;
  const txAnnul=filtered.length>0?Math.round(annules.length/filtered.length*100):0;
  const prevR=prevFiltered.filter(e=>e.statut==='Réalisé');
  const prevPresents=prevR.reduce((s,e)=>s+(parseInt(e.presents)||0),0);

  // Statuts donut
  const STATUS_COLORS={'Réalisé':'#16a34a','Planifié':'#2563eb','Annulé':'#dc2626','Non réalisé':'#d97706','Reporté':'#9683EC'};
  const byStat={};filtered.forEach(e=>{byStat[e.statut]=(byStat[e.statut]||0)+1;});
  const dataStat=Object.entries(byStat).map(([label,value])=>({label,value}));

  // Activité mensuelle empilée
  const byMoisAct={};filtered.forEach(e=>{
    const m=e.date?e.date.slice(0,7):'?';
    if(m==='?')return;
    if(!byMoisAct[m])byMoisAct[m]={realises:0,annules:0,planifies:0};
    if(e.statut==='Réalisé')byMoisAct[m].realises++;
    else if(e.statut==='Annulé')byMoisAct[m].annules++;
    else if(e.statut==='Planifié')byMoisAct[m].planifies++;
  });

  // Top communes
  const byCommune={};realises.forEach(e=>{byCommune[e.commune]=(byCommune[e.commune]||0)+1;});
  const topCommunes=Object.entries(byCommune).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([label,value])=>({label,value}));

  // Thématiques
  const byTheme={};realises.forEach(e=>{const t=e.thematique||'Autre';byTheme[t]=(byTheme[t]||0)+1;});
  const dataTheme=Object.entries(byTheme).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([label,value])=>({label,value}));

  // Public
  const byPublic={};realises.forEach(e=>{const p=e.public||'Autres';byPublic[p]=(byPublic[p]||0)+1;});
  const dataPublic=Object.entries(byPublic).sort((a,b)=>b[1]-a[1]).map(([label,value])=>({label,value}));

  const PERIODES=[{l:'Tout'},{l:'Ce mois'},{l:'3 mois'},{l:'6 mois'},{l:'12 mois'}];
  const accent='#1e3a8a';

  return CE('div',null,

    // ── Barre période ──
    CE('div',{className:'card',style:{marginBottom:12,padding:'12px 16px'}},
      CE('div',{style:{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}},
        CE('span',{style:{fontSize:12,fontWeight:700,color:'#718096'}},'Période :'),
        PERIODES.map((p,i)=>CE('button',{key:i,onClick:()=>setPeriodeIdx(i),style:{
          padding:'4px 13px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',
          border:`1.5px solid ${periodeIdx===i?accent:'#e2e8f0'}`,
          background:periodeIdx===i?accent:'#fff',
          color:periodeIdx===i?'#fff':'#718096',transition:'all .15s'
        }},p.l)),
        CE('span',{style:{marginLeft:'auto',fontSize:11,color:'#9ca3af'}},filtered.length+' ateliers · '+now.toLocaleDateString('fr-FR'))
      ),
      CE('div',{style:{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginTop:8,paddingTop:8,borderTop:'1px solid #f1f5f9'}},
        CE('span',{style:{fontSize:12,fontWeight:700,color:'#718096'}},'Mois :'),
        MOIS_LABELS.map((m,i)=>{const mo=i+1;return CE('button',{key:mo,onClick:()=>toggleMonth(mo),style:{
          padding:'3px 10px',borderRadius:20,fontSize:11,fontWeight:600,cursor:'pointer',
          border:`1.5px solid ${selectedMonths.includes(mo)?accent:'#e2e8f0'}`,
          background:selectedMonths.includes(mo)?accent:'#fff',
          color:selectedMonths.includes(mo)?'#fff':'#718096',transition:'all .15s'
        }},m);}),
        selectedMonths.length>0&&CE('button',{onClick:()=>setSelectedMonths([]),style:{
          padding:'3px 10px',borderRadius:20,fontSize:11,cursor:'pointer',
          border:'1.5px solid #fca5a5',background:'#fff',color:'#ef4444',fontWeight:600
        }},'✕ Effacer')
      )
    ),

    // ── KPIs ──
    CE('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginBottom:16}},
      CE(KpiCard,{val:realises.length,lbl:'Ateliers réalisés',icon:'✅',color:'#16a34a',bgColor:'#f0fdf4',trend:mkTrend(realises.length,prevR.length)}),
      CE(KpiCard,{val:planifies.length,lbl:'Planifiés à venir',icon:'📅',color:'#2563eb',bgColor:'#eff6ff'}),
      CE(KpiCard,{val:presents,lbl:'Participants présents',icon:'👥',color:'#7c3aed',bgColor:'#faf5ff',trend:mkTrend(presents,prevPresents)}),
      CE(KpiCard,{val:inscrits,lbl:'Inscrits total',icon:'📝',color:'#0891b2',bgColor:'#ecfeff'}),
      CE(KpiCard,{val:txPresence+'%',lbl:'Taux de présence',icon:'🎯',
        color:txPresence>=70?'#16a34a':txPresence>=50?'#d97706':'#dc2626',
        bgColor:txPresence>=70?'#f0fdf4':txPresence>=50?'#fffbeb':'#fef2f2'}),
      CE(KpiCard,{val:txAnnul+'%',lbl:'Taux d\'annulation',icon:'❌',
        color:txAnnul<=10?'#16a34a':txAnnul<=20?'#d97706':'#dc2626',
        bgColor:txAnnul<=10?'#f0fdf4':txAnnul<=20?'#fffbeb':'#fef2f2'})
    ),

    // ── Ligne 1 : Activité mensuelle + Donut statuts ──
    CE('div',{style:{display:'grid',gridTemplateColumns:'2fr 1fr',gap:16,marginBottom:16}},
      CE('div',{className:'card'},
        CE('h2',null,'📈 Activité mensuelle'),
        CE(StackedActivityChart,{data:byMoisAct})
      ),
      CE('div',{className:'card'},
        CE('h2',null,'🔵 Répartition statuts'),
        CE(DonutChart,{data:dataStat,colors:dataStat.map(d=>STATUS_COLORS[d.label]||'#718096'),height:220})
      )
    ),

    // ── Ligne 2 : Par conseiller (pleine largeur) ──
    CE('div',{className:'card',style:{marginBottom:16}},
      CE('h2',null,'👤 Performance par conseiller'),
      CE(ConseillerBarChart,{entries:filtered})
    ),

    // ── Ligne 3 : Communes + Thématiques ──
    CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}},
      CE('div',{className:'card'},
        CE('h2',null,'📍 Top communes (réalisés)'),
        CE(BarChart,{data:topCommunes,colors:['#1e3a8a','#2563eb','#3b82f6','#60a5fa','#93c5fd']})
      ),
      CE('div',{className:'card'},
        CE('h2',null,'📚 Par thématique'),
        CE(BarChart,{data:dataTheme,colors:['#7c3aed','#8b5cf6','#a78bfa','#c4b5fd']})
      )
    ),

    // ── Ligne 4 : Public + AM/PM ──
    CE('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}},
      CE('div',{className:'card'},
        CE('h2',null,'🧑‍🤝‍🧑 Par type de public'),
        CE(BarChart,{data:dataPublic,colors:['#DB2777','#ec4899','#f472b6','#fbcfe8']})
      ),
      CE('div',{className:'card'},
        CE('h2',null,'🌅 Matin vs Après-midi'),
        CE(DonutChart,{
          data:[
            {label:'Matin (AM)',value:filtered.filter(e=>e.ampm==='AM'||(!e.ampm&&e.horaire&&parseInt(e.horaire)<12)).length},
            {label:'Après-midi (PM)',value:filtered.filter(e=>e.ampm==='PM'||(!e.ampm&&e.horaire&&parseInt(e.horaire)>=12)).length}
          ],
          colors:['#f97316','#0891b2'],height:200
        })
      )
    )
  );
}


// ── VueDashboardTabs — Dashboard unifié (3 onglets) ──────────
function VueDashboardTabs({entries, conseillers}){
  const[tab,setTab]=React.useState('dashboard');
  const TABS=[
    {id:'dashboard', ico:'🚀', label:'Synthèse'},
    {id:'graphiques', ico:'📊', label:'Graphiques'},
    {id:'powerbi',    ico:'🗺️', label:'Territoire'},
  ];
  return CE('div',null,
    CE('div',{style:{display:'flex',borderBottom:'2px solid #e5e7eb',marginBottom:16,gap:4}},
      TABS.map(t=>CE('button',{
        key:t.id,
        onClick:()=>setTab(t.id),
        style:{
          padding:'8px 18px',border:'none',background:'none',cursor:'pointer',
          fontSize:13,fontWeight:tab===t.id?700:400,fontFamily:'inherit',
          color:tab===t.id?'var(--accent,#0ea5e9)':'#6b7280',
          borderBottom:tab===t.id?'3px solid var(--accent,#0ea5e9)':'3px solid transparent',
          marginBottom:-2,transition:'all .15s'
        }
      }, t.ico+' '+t.label))
    ),
    tab==='dashboard'  && CE(VueDashboard,{entries}),
    tab==='graphiques' && CE(VueGraphiques,{entries}),
    tab==='powerbi'    && CE(VuePowerBI,{entries,conseillers})
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(CE(App));