const fs=require('fs');
const assert=require('node:assert/strict');
const {test,expect}=require('@playwright/test');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const entries=Array.from({length:6},(_,i)=>({_id:'atelier-'+i,date:'2026-09-'+String(i+1).padStart(2,'0'),statut:'Réalisé',horaire:'09:30',thematique:'Thématique '+(i+1),commune:'Commune '+(i+1),orienteur:'Partenaire',conseiller:'Alice Martin',inscrits:8,presents:6,public:'Adultes'}));

// Le parcours exécute la bibliothèque et les composants réellement publiés,
// avec des données fictives ; aucun appel ne sort vers le serveur métier.
test('Analyse : comparaison annuelle et historique au clic à 390/1280 px', async ({browser})=>{
 const context=await browser.newContext();
 await context.route('**/*',route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><html lang="fr"><meta charset="UTF-8"><body><div id="root" class="main"></div></body></html>'}));
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.setFixedTime(new Date('2026-10-25T10:00:00Z'));
 await page.goto('http://analyse.test/');
 const style=await page.addStyleTag({path:path.join(ROOT,'app.css')});
 for(const file of ['vendor/react-18.3.1/react.production.min.js','vendor/react-dom-18.3.1/react-dom.production.min.js','vendor/echarts-5.4.3/echarts.min.js','utils.js','logic.js','shared.js'])await page.addScriptTag({path:path.join(ROOT,file)});
 await page.evaluate(entries=>{
  todayLocal=()=> '2026-10-25';window.__lignes=entries;window.__calls=[];window.__mode='empty';
  window.fetchAll=async(years,opts)=>{
   window.__calls.push({years,opts});
   if(window.__mode==='fail')throw Error('Échec simulé');
   return {ok:true,years:years.split(','),entries:window.__mode==='ready'?[{_id:'ancien',date:years.split(',')[0]+'-09-02',statut:'Réalisé',commune:'Commune 1',thematique:'Thématique 1',orienteur:'Partenaire',conseiller:'Alice Martin'}]:[]};
  };
  window.__root=ReactDOM.createRoot(document.getElementById('root'));
  window.__root.render(CE(VueGraphiques,{entries,anneesChargees:'2026,2027'}));
 },entries);
 const annual=page.locator('.card').filter({has:page.getByRole('heading',{name:'📊 Comparaison N / N−1',exact:true})});
 const seriesNames=()=>annual.locator('.ec-liquid-glass').evaluate(el=>echarts.getInstanceByDom(el)?.getOption()?.series?.map(s=>s.name)||[]);
 await page.getByRole('heading',{name:'📊 Comparaison N / N−1',exact:true}).waitFor();
 await page.getByRole('button',{name:'2026',exact:true}).click();
 assert.equal(await page.evaluate(()=>window.__calls.length),0,'aucun appel ajouté au démarrage');
 for(const sheet of ['app.css','admin.css']){
  await style.evaluate((el,css)=>el.textContent=css,fs.readFileSync(path.join(ROOT,sheet),'utf8'));
  for(const width of [390,1280])for(const theme of ['light','dark']){
   await page.setViewportSize({width,height:720});
   await page.evaluate(theme=>document.documentElement.setAttribute('data-theme',theme),theme);
   await page.waitForTimeout(100);
   const dimensions=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth,notes:[...document.querySelectorAll('.analyse-note')].map(e=>({color:getComputedStyle(e).color,background:getComputedStyle(e.closest('.card')||document.body).backgroundColor}))}));
   assert.ok(dimensions.page<=width+1,JSON.stringify(dimensions));
   for(const note of dimensions.notes){
    const lum=c=>{const a=c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*a[0]+.7152*a[1]+.0722*a[2];};
    const a=lum(note.color),b=lum(note.background),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    assert.ok(ratio>=4.5,JSON.stringify({sheet,theme,note,ratio}));
   }
   console.log(JSON.stringify({sheet,width,theme,dimensions}));
  }
 }
 await page.getByRole('button',{name:'2026',exact:true}).click();
 await page.getByRole('button',{name:'Charger 2025 pour comparer',exact:true}).click();
 await page.getByText('Historique 2025 indisponible',{exact:false}).waitFor();
 assert.equal(await page.evaluate(()=>window.__calls.length),1);
 await expect.poll(seriesNames).toEqual(['N · 2026']);
 await page.locator('input[type=date]').first().fill('2024-01-01');
 await page.locator('input[type=date]').nth(1).fill('2024-12-31');
 await expect(annual.getByText('Historique 2024 et 2023 non chargé.',{exact:true})).toBeVisible();
 await page.evaluate(()=>{window.__mode='fail';});
 await page.getByRole('button',{name:'Charger 2024 et 2023 pour comparer',exact:true}).click();
 await page.getByRole('alert').filter({hasText:'Impossible de charger'}).waitFor();
 await page.evaluate(()=>{window.__mode='ready';});
 await page.getByRole('button',{name:'Charger 2024 et 2023 pour comparer',exact:true}).click();
 await expect(page.getByRole('alert')).toHaveCount(0);
 const lastCall=await page.evaluate(()=>window.__calls.at(-1));
 assert.equal(lastCall.opts.force,true,'nouvel essai explicite sans cache défectueux');
 await page.evaluate(()=>window.__root.render(CE(VueGraphiques,{key:'nouvelle-analyse',entries:window.__lignes,anneesChargees:'2026,2027'})));
 await page.getByRole('button',{name:'2026',exact:true}).click();
 await page.getByRole('button',{name:'Charger 2025 pour comparer',exact:true}).click();
 await expect.poll(seriesNames).toEqual(['N · 2026','N−1 · 2025']);
 const previousSeptember=await annual.locator('.ec-liquid-glass').evaluate(el=>echarts.getInstanceByDom(el).getOption().series.find(s=>s.name==='N−1 · 2025').data[8]);
 assert.equal(previousSeptember,1);
 await page.evaluate(()=>window.__root.render(CE(VueGraphiques,{entries:[],anneesChargees:'2026,2027'})));
 await expect(annual.getByText('Aucun atelier enregistré en 2026 dans les données chargées.',{exact:true})).toBeVisible();
 await expect(annual.locator('.ec-liquid-glass')).toHaveCount(0);
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
 await page.evaluate(entries=>{
  todayLocal=()=> '2026-10-25';window.__lignes=entries;
  window.fetchAll=()=>new Promise(resolve=>{window.__resolveHistory=resolve;});
  window.__root=ReactDOM.createRoot(document.getElementById('root'));
  window.__root.render(CE(VueGraphiques,{entries,anneesChargees:'2026,2027'}));
 },entries);
 await page.getByRole('button',{name:'2026',exact:true}).click();
 await page.getByRole('button',{name:'Charger 2025 pour comparer',exact:true}).click();
 await page.evaluate(()=>window.__root.render(CE(VueGraphiques,{entries:window.__lignes.slice(),anneesChargees:'2026,2027'})));
 await expect(page.getByRole('button',{name:'Charger 2025 pour comparer',exact:true})).toBeEnabled();
 await page.evaluate(async()=>{
  window.__resolveHistory({ok:true,years:['2025'],entries:[{date:'2025-09-01',statut:'Réalisé'}]});
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
 });
 await expect(page.getByRole('button',{name:'Charger 2025 pour comparer',exact:true})).toBeVisible();
 const annual=page.locator('.card').filter({has:page.getByRole('heading',{name:'📊 Comparaison N / N−1',exact:true})});
 const names=await annual.locator('.ec-liquid-glass').evaluate(el=>echarts.getInstanceByDom(el).getOption().series.map(s=>s.name));
 assert.deepEqual(names,['N · 2026'],'la lecture périmée ne rétablit pas la série N−1');
 await context.close();
});
