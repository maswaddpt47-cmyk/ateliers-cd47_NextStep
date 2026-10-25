const fs=require('fs');
const assert=require('node:assert/strict');
const {test,expect}=require('@playwright/test');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const team=['Alice Martin','Bob Dupont','Chloé Durand','Diane Petit'];
const entries=Array.from({length:6},(_,i)=>({_id:'atelier-'+i,date:'2026-09-'+String(i+1).padStart(2,'0'),statut:'Réalisé',horaire:'09:30',thematique:'Thématique '+(i+1),commune:'Commune '+(i+1),orienteur:i<4?'Partenaire territorial au nom long':'',conseiller:team[0],co_animateur:i===0?team[1]:'',inscrits:8,presents:6,public:'Adultes'}));
entries.push({_id:'hors',date:'2026-09-12',statut:'Réalisé',thematique:'<img src=x onerror=alert(1)>',commune:'Autre commune',orienteur:'Autre partenaire',conseiller:'Intervenant extérieur',inscrits:4,presents:4});

// Le parcours exécute la bibliothèque et les composants réellement publiés,
// avec des données fictives ; aucun appel ne sort vers le serveur métier.
test('Analyse : populations, historique au clic et tableaux à 390/1280 px', async ({browser})=>{
   const context=await browser.newContext();
   await context.route('**/*',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html lang="fr"><meta charset="UTF-8"><body><div id="root" class="main"></div></body></html>'}));
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.clock.setFixedTime(new Date('2026-10-25T10:00:00Z'));
 await page.goto('http://analyse.test/');
   const dir=ROOT;
   for(const file of ['vendor/react-18.3.1/react.production.min.js','vendor/react-dom-18.3.1/react-dom.production.min.js','vendor/echarts-5.4.3/echarts.min.js','utils.js','logic.js','shared.js'])await page.addScriptTag({path:dir+'/'+file});
   await page.evaluate(({entries,team})=>{
    todayLocal=()=> '2026-10-25';window.__lignes=entries;window.__team=team;window.__calls=[];window.__mode='empty';
    window.fetchAll=async(years,opts)=>{window.__calls.push({years,opts});if(window.__mode==='fail')throw Error('Échec simulé');return {ok:true,years:years.split(','),entries:window.__mode==='ready'?[{_id:'ancien',date:'2025-09-02',statut:'Réalisé',commune:'Commune 1',thematique:'Thématique 1',orienteur:'Partenaire ancien',conseiller:team[0]}]:[]};};
    window.__root=ReactDOM.createRoot(document.getElementById('root'));
    window.__root.render(CE(VueGraphiques,{entries,conseillers:team,anneesChargees:'2026,2027'}));
   },{entries,team});
   await page.getByRole('heading',{name:'🔀 Partenaires par conseiller',exact:true}).waitFor();
   await page.getByRole('button',{name:'2026',exact:true}).click();
   assert.equal(await page.getByRole('region',{name:'Thématiques par commune',exact:true}).locator('tbody tr').count(),7);
   const partners=page.getByRole('region',{name:'Partenaires par conseiller',exact:true});
   for(const name of team)assert.equal(await partners.getByRole('columnheader',{name,exact:true}).count(),1);
   assert.equal(await page.locator('.analyse-matrice img').count(),0);
   assert.equal(await page.evaluate(()=>window.__calls.length),0,'aucun appel ajouté au démarrage');
   for(const width of [390,1280])for(const theme of ['light','dark']){
    await page.setViewportSize({width,height:720});
    await page.evaluate(theme=>document.documentElement.setAttribute('data-theme',theme),theme);
    await page.waitForTimeout(100);
    const dimensions=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth,tables:[...document.querySelectorAll('.analyse-matrice')].map(e=>({width:e.clientWidth,scroll:e.scrollWidth})),notes:[...document.querySelectorAll('.analyse-note')].map(e=>({color:getComputedStyle(e).color,background:getComputedStyle(e.closest('.card')||document.body).backgroundColor}))}));
    assert.ok(dimensions.page<=width+1,JSON.stringify(dimensions));
    console.log(JSON.stringify({width,theme,dimensions}));
   }
   await page.getByRole('button',{name:'2026',exact:true}).click();
   await page.getByRole('button',{name:'Charger 2025 pour comparer',exact:true}).click();
   await page.getByText('Historique 2025 indisponible',{exact:false}).waitFor();
   assert.equal(await page.evaluate(()=>window.__calls.length),1);
   const annual=await page.locator('.card').filter({has:page.getByRole('heading',{name:'📊 Comparaison N / N−1',exact:true})}).locator('.ec-liquid-glass').evaluate(el=>echarts.getInstanceByDom(el).getOption().series.map(s=>s.name));
   assert.deepEqual(annual,['N · 2026'],'aucune série artificielle pour 2025 vide');
   await page.locator('input[type=date]').first().fill('2024-01-01');
   await page.locator('input[type=date]').nth(1).fill('2024-12-31');
   await page.getByText('Années non chargées pour cette période : 2024.',{exact:false}).waitFor();
   await page.evaluate(()=>{window.__mode='fail';});
   await page.getByRole('button',{name:'Charger 2024 et 2023 pour comparer',exact:true}).click();
   await page.getByRole('alert').filter({hasText:'Impossible de charger'}).waitFor();
   await page.evaluate(()=>{window.__mode='ready';});
   await page.getByRole('button',{name:'Charger 2024 et 2023 pour comparer',exact:true}).click();
   await page.waitForTimeout(80);
   await expect(page.getByRole('alert')).toHaveCount(0);
   const lastCall=await page.evaluate(()=>window.__calls.at(-1));
   assert.equal(lastCall.opts.force,true,'nouvel essai explicite sans cache défectueux');
   await page.evaluate(()=>window.__root.render(CE(VueGraphiques,{key:'nouvelle-analyse',entries:window.__lignes,conseillers:window.__team,anneesChargees:'2026,2027'})));
   await page.getByRole('button',{name:'2026',exact:true}).click();
   await page.getByRole('button',{name:'Charger 2025 pour comparer',exact:true}).click();
   await page.waitForTimeout(80);
   await page.locator('input[type=date]').first().fill('2025-01-01');
   await page.locator('input[type=date]').nth(1).fill('2025-12-31');
   await page.getByRole('region',{name:'Partenaires par conseiller',exact:true}).getByRole('rowheader',{name:'Partenaire ancien',exact:true}).waitFor();
   await page.evaluate(()=>window.__root.render(CE(VueGraphiques,{entries:[],conseillers:window.__team,anneesChargees:'2026,2027'})));
   await page.getByRole('region',{name:'Partenaires par conseiller',exact:true}).waitFor();
   const emptyTable=page.getByRole('region',{name:'Partenaires par conseiller',exact:true});
   await expect(emptyTable.locator('tbody tr')).toHaveCount(0);
   for(const name of team)assert.equal(await emptyTable.getByRole('columnheader',{name,exact:true}).count(),1);
   assert.deepEqual(await emptyTable.locator('tfoot td').allTextContents(),['0','0','0','0','0']);
   assert.deepEqual(errors,[],'Analyse sans erreur JavaScript');

   await context.close();
});

// Une actualisation des ateliers invalide aussi les lectures déjà en vol.
test('Analyse : une ancienne lecture ne réintroduit pas un historique invalidé', async ({browser})=>{
 const context=await browser.newContext();
 await context.route('**/*',r=>r.fulfill({status:200,contentType:'text/html',body:'<html><body><div id="root"></div></body></html>'}));
 const page=await context.newPage();
 await page.clock.setFixedTime(new Date('2026-10-25T10:00:00Z'));
 await page.goto('http://analyse.test/');
 for(const file of ['vendor/react-18.3.1/react.production.min.js','vendor/react-dom-18.3.1/react-dom.production.min.js','vendor/echarts-5.4.3/echarts.min.js','utils.js','logic.js','shared.js'])await page.addScriptTag({path:path.join(ROOT,file)});
 await page.evaluate(({entries,team})=>{
  todayLocal=()=> '2026-10-25';window.__lignes=entries;window.__team=team;
  window.fetchAll=()=>new Promise(resolve=>{window.__resolveHistory=resolve;});
  window.__root=ReactDOM.createRoot(document.getElementById('root'));
  window.__root.render(CE(VueGraphiques,{entries,conseillers:team,anneesChargees:'2026,2027'}));
 },{entries,team});
 await page.getByRole('button',{name:'2026',exact:true}).click();
   await page.getByRole('button',{name:'Charger 2025 pour comparer',exact:true}).click();
 await page.evaluate(()=>window.__root.render(CE(VueGraphiques,{entries:window.__lignes.slice(),conseillers:window.__team,anneesChargees:'2026,2027'})));
 await expect(page.getByRole('button',{name:'Charger 2025 pour comparer',exact:true})).toBeEnabled();
 await page.evaluate(()=>window.__resolveHistory({ok:true,years:['2025'],entries:[{date:'2025-09-01',statut:'Réalisé',orienteur:'Lecture périmée',conseiller:'Alice Martin'}]}));
 await page.waitForTimeout(80);
 await expect(page.getByRole('button',{name:'Charger 2025 pour comparer',exact:true})).toBeVisible();
 await expect(page.getByText('Lecture périmée',{exact:true})).toHaveCount(0);
 await context.close();
});
