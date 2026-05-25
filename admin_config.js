// ── Export Calendrier — injecté dans VueAdmin ──────────────────────────────
(function(){

  // ── Helpers generateCalendrier ─────────────────────────────────────────
  const MONTH_NAMES_FR_CAL={1:'JANVIER',2:'FÉVRIER',3:'MARS',4:'AVRIL',5:'MAI',6:'JUIN',7:'JUILLET',8:'AOÛT',9:'SEPTEMBRE',10:'OCTOBRE',11:'NOVEMBRE',12:'DÉCEMBRE'};
  const DAY_FR_CAL=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  const STATUT_COLORS_CAL={'Réalisé':'70AD47','Annulé':'FF5050','Planifié':'9683EC','Non réalisé':'FFC000','Reporté':'ED7D31'};
  const STATUT_SYMBOLS_CAL={'Réalisé':'R','Annulé':'A','Planifié':'P','Non réalisé':'NR','Reporté':'RP'};

  function isAMCal(h){try{return parseInt(String(h).replace('H',':').split(':')[0])<12;}catch{return true;}}
  function getWorkingDaysCal(year,month){const days=[];const d=new Date(Date.UTC(year,month-1,1));while(d.getUTCMonth()===month-1){if(d.getUTCDay()!==0&&d.getUTCDay()!==6)days.push(new Date(d));d.setUTCDate(d.getUTCDate()+1);}return days;}
  function dateKeyCal(d){return`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;}
  function argbOfCal(hex){return'FF'+hex.toUpperCase();}

  function cellStyleCal(bold=false,bgHex=null,fgHex='000000',sz=8){
    const s={font:{bold,sz,color:{rgb:fgHex}},alignment:{horizontal:'center',vertical:'center',wrapText:true},border:{top:{style:'thin',color:{rgb:'AAAAAA'}},bottom:{style:'thin',color:{rgb:'AAAAAA'}},left:{style:'thin',color:{rgb:'AAAAAA'}},right:{style:'thin',color:{rgb:'AAAAAA'}}}};
    if(bgHex)s.fill={fgColor:{rgb:argbOfCal(bgHex)},patternType:'solid'};return s;
  }
  function cellStyleLeftCal(bold=false,bgHex=null,fgHex='000000',sz=8){
    const s={font:{bold,sz,color:{rgb:fgHex}},alignment:{horizontal:'left',vertical:'center'},border:{top:{style:'thin',color:{rgb:'AAAAAA'}},bottom:{style:'thin',color:{rgb:'AAAAAA'}},left:{style:'thin',color:{rgb:'AAAAAA'}},right:{style:'thin',color:{rgb:'AAAAAA'}}}};
    if(bgHex)s.fill={fgColor:{rgb:argbOfCal(bgHex)},patternType:'solid'};return s;
  }

  window.generateCalendrier=function(df,year,months,conseillers,logFn){
    const wb=XLSX.utils.book_new();
    for(const month of months){
      const monthName=MONTH_NAMES_FR_CAL[month];
      const workingDays=getWorkingDaysCal(year,month);
      const dfMonth=df.filter(r=>r.date.getUTCFullYear()===year&&r.date.getUTCMonth()+1===month);
      const aoa=[];const merges=[];const styles={};
      let currentRow=0;
      function S(r,c,style){styles[`${r},${c}`]=style;}
      function W(r,c,v,style){while(aoa.length<=r)aoa.push([]);while(aoa[r].length<=c)aoa[r].push(null);aoa[r][c]=v;if(style)S(r,c,style);}
      const DATE_START_COL=2;

      for(const conseiller of conseillers){
        const consNorm=conseiller.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        const dfCons=dfMonth.filter(r=>{const rn=(r.conseiller||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');return rn===consNorm;});
        const recapCounts={};
        for(const row of dfCons){const am=row.ampm?row.ampm==='AM':isAMCal(row.horaire);const dk=dateKeyCal(row.date)+(am?'_AM':'_PM');recapCounts[dk]=(recapCounts[dk]||0)+1;}
        function normOrg(s){return String(s||'—').trim().replace(/\s+/g,' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
        const seenOrgsKeys=[];const seenOrgs=[];
        for(const row of dfCons){const raw=String(row.orienteur||'—').trim().replace(/\s+/g,' ');const key=normOrg(raw);if(!seenOrgsKeys.includes(key)){seenOrgsKeys.push(key);seenOrgs.push(raw);}}
        const nDataRows=Math.max(1,seenOrgs.length);
        const orgSessions={};
        for(const row of dfCons){const key=normOrg(row.orienteur||'—');if(!orgSessions[key])orgSessions[key]=[];orgSessions[key].push(row);}

        // Titre
        const titleRow=currentRow;
        const titleLastCol=DATE_START_COL+workingDays.length*2-1;
        const titleStyle={font:{bold:true,sz:26,name:'Calibri',color:{rgb:'FFFFFF'}},fill:{fgColor:{rgb:'FF8DB4E2'},patternType:'solid'},alignment:{horizontal:'center',vertical:'center'}};
        W(titleRow,0,`PLANNING ATELIERS — ${conseiller.toUpperCase()}`,titleStyle);
        for(let c=1;c<=titleLastCol;c++)W(titleRow,c,null,titleStyle);
        merges.push({s:{r:titleRow,c:0},e:{r:titleRow,c:titleLastCol}});currentRow++;

        // Sous-titre mois
        const subRow=currentRow;
        const subStyle={font:{bold:true,sz:18,name:'Calibri',color:{rgb:'16365C'}},fill:{fgColor:{rgb:'FFC5D9F1'},patternType:'solid'},alignment:{horizontal:'center',vertical:'center'}};
        W(subRow,0,`${monthName} ${year}`,subStyle);
        for(let c=1;c<=titleLastCol;c++)W(subRow,c,null,subStyle);
        merges.push({s:{r:subRow,c:0},e:{r:subRow,c:titleLastCol}});currentRow++;

        // En-tête jours
        const hrow=currentRow;
        W(hrow,0,'CoNum',cellStyleCal(true,'1F4E79','FFFFFF',9));
        W(hrow,1,'Organisme',cellStyleCal(true,'1F4E79','FFFFFF',9));
        for(let di=0;di<workingDays.length;di++){const day=workingDays[di];const colAM=DATE_START_COL+di*2;const label=`${DAY_FR_CAL[day.getDay()]} ${String(day.getDate()).padStart(2,'0')}`;W(hrow,colAM,label,cellStyleCal(true,'2E75B6','FFFFFF',8));W(hrow,colAM+1,null,cellStyleCal(true,'2E75B6','FFFFFF',8));merges.push({s:{r:hrow,c:colAM},e:{r:hrow,c:colAM+1}});}
        currentRow++;

        // AM/PM
        const srow=currentRow;
        W(srow,0,null,cellStyleCal(false,null,'000000',8));W(srow,1,null,cellStyleCal(false,null,'000000',8));
        for(let di=0;di<workingDays.length;di++){const colAM=DATE_START_COL+di*2;W(srow,colAM,'AM',cellStyleCal(true,'BDD7EE','1F3864',8));W(srow,colAM+1,'PM',cellStyleCal(true,'9DC3E6','1F3864',8));}
        currentRow++;

        // Lignes données
        for(let oi=0;oi<nDataRows;oi++){
          const rn=currentRow+oi;const org=seenOrgs[oi]||'';
          W(rn,0,conseiller,cellStyleCal(false,null,'000000',8));W(rn,1,org,cellStyleLeftCal(false,null,'000000',8));
          const creneau={};
          for(const sess of(orgSessions[normOrg(org)]||[])){const am=sess.ampm?sess.ampm==='AM':isAMCal(sess.horaire);const ck=dateKeyCal(sess.date)+(am?'_AM':'_PM');if(!creneau[ck])creneau[ck]=[];creneau[ck].push(sess);}
          for(let di=0;di<workingDays.length;di++){
            const day=workingDays[di];const dk=dateKeyCal(day);const colAM=DATE_START_COL+di*2;
            for(const[suffix,col]of[['_AM',colAM],['_PM',colAM+1]]){
              const ck=dk+suffix;
              if(creneau[ck]){const list=creneau[ck];if(list.length===1){const s=list[0].statut;W(rn,col,STATUT_SYMBOLS_CAL[s]||(s?s.slice(0,2):'?'),cellStyleCal(true,STATUT_COLORS_CAL[s]||'D9D9D9','000000',8));}else{W(rn,col,`⚠×${list.length}`,cellStyleCal(true,'7B2FBE','FFFFFF',7));if(logFn)logFn(`⚠ Conflit ${conseiller} | ${org} | ${dk} ${suffix.slice(1)} (${list.length} sessions)`,'err');}}
              else W(rn,col,null,cellStyleCal(false));
            }
          }
        }

        // Recap
        const recapRow=currentRow+nDataRows;
        W(recapRow,0,conseiller,cellStyleLeftCal(true,'D6E4F0','1F3864',8));
        W(recapRow,1,`RECAP ${monthName}`,cellStyleLeftCal(true,'D6E4F0','1F3864',8));
        for(let di=0;di<workingDays.length;di++){const dk=dateKeyCal(workingDays[di]);const colAM=DATE_START_COL+di*2;for(const[isAMSlot,col]of[[true,colAM],[false,colAM+1]]){const count=recapCounts[dk+(isAMSlot?'_AM':'_PM')]||0;W(recapRow,col,count>0?count:null,cellStyleCal(true,'D6E4F0','1F3864',9));}}

        // Légende
        const legendRow=recapRow+1;
        let tP=0,tA=0,tR=0,tRP=0,tNR=0,tAlert=0;
        for(const row of dfCons){const s=(row.statut||'').trim();if(s==='Planifié')tP++;else if(s==='Annulé')tA++;else if(s==='Réalisé')tR++;else if(s==='Reporté')tRP++;else if(s==='Non réalisé')tNR++;}
        for(let ri=titleRow;ri<=recapRow;ri++){if(!aoa[ri])continue;for(const cell of aoa[ri]){if(typeof cell==='string'&&cell.startsWith('⚠'))tAlert++;}}
        const lastLegendCol=DATE_START_COL+workingDays.length*2-1;const totalCols=lastLegendCol+1;
        const segments=[{label:`P | Prévus : ${tP}`,bg:'9683EC',fg:'FFFFFF'},{label:`A | Annulés : ${tA}`,bg:'FF5050',fg:'FFFFFF'},{label:`R | Réalisés : ${tR}`,bg:'70AD47',fg:'FFFFFF'},{label:`RP | Reportés : ${tRP}`,bg:'ED7D31',fg:'FFFFFF'},{label:`NR | Non réalisés : ${tNR}`,bg:'FFC000',fg:'7F4000'},{label:`⚠ | Alertes : ${tAlert}`,bg:'7B2FBE',fg:'FFFFFF'}];
        const nSeg=segments.length;const baseWidth=Math.floor(totalCols/nSeg);const remainder=totalCols-baseWidth*nSeg;
        const bThin=col=>({style:'thin',color:{rgb:col}});
        let colCursor=0;
        for(let si=0;si<nSeg;si++){const seg=segments[si];const width=baseWidth+(si<remainder?1:0);const colS=colCursor;const colE=colCursor+width-1;const segStyle={font:{name:'Calibri',sz:10,bold:true,color:{rgb:seg.fg}},fill:{fgColor:{rgb:'FF'+seg.bg},patternType:'solid'},alignment:{horizontal:'center',vertical:'center',wrapText:false},border:{top:bThin('999999'),bottom:bThin('999999'),left:bThin('CCCCCC'),right:bThin('CCCCCC')}};W(legendRow,colS,seg.label,segStyle);for(let c=colS+1;c<=colE;c++)W(legendRow,c,null,segStyle);if(colS<colE)merges.push({s:{r:legendRow,c:colS},e:{r:legendRow,c:colE}});colCursor+=width;}

        currentRow=legendRow+2;

        // Mention MàJ (dernier conseiller)
        const consNormCheck=conseiller.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        if(consNormCheck===conseillers[conseillers.length-1].trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')){
          const today=new Date();const dd=String(today.getDate()).padStart(2,'0');const mm=String(today.getMonth()+1).padStart(2,'0');const yyyy=today.getFullYear();
          W(currentRow,0,`mise a jour : ${dd}/${mm}/${yyyy}`,{font:{name:'Calibri',sz:9,italic:true,color:{rgb:'6B7280'}},alignment:{horizontal:'left',vertical:'center'}});
          currentRow+=2;
        }
      }

      // Largeurs colonnes
      const colInfo=[{wch:18},{wch:36}];
      for(let di=0;di<workingDays.length;di++)colInfo.push({wch:5},{wch:5});
      const ws=XLSX.utils.aoa_to_sheet(aoa);ws['!merges']=merges;ws['!cols']=colInfo;
      for(const[key,style]of Object.entries(styles)){const[r,c]=key.split(',').map(Number);const cellAddr=XLSX.utils.encode_cell({r,c});if(!ws[cellAddr])ws[cellAddr]={t:'s',v:''};ws[cellAddr].s=style;}
      XLSX.utils.book_append_sheet(wb,ws,`Planning ${String(month).padStart(2,'0')}-${year}`);
    }
    return wb;
  };

})();