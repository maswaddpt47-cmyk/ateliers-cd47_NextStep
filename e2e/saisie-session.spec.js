// Parcours réels des deux pages, avec API et géocodage fictifs exclusivement.
// Une navigation ne perd ni la saisie ni les identifiants d'un cycle à reprendre.
const {test,expect}=require('@playwright/test');

const NOM='Alice Martin';
const JOUR='2026-10-26';
const TEMOIN={_id:'atelier-temoin',_n:1,date:JOUR,horaire:'14:00',ampm:'PM',
  duree:90,statut:'Planifié',conseiller:NOM,co_animateur:'',
  commune:'AGEN (47000)',lieu:'Salle témoin',thematique:'Atelier témoin',
  inscrits:4,presents:'',materiel:[],orienteur:'Partenaire fictif',public:'Adultes',
  residence:'',remarques:'',nb_ordinateurs:'',date_prelevement_materiel:'',date_retour_materiel:''};
const VISIBILITE={saisie:true,historique:true,dashboard:true,agenda:true,
  calendrier:true,planning:true,carte:true,bingo:true,gestion_ordi:true};

async function preparer(page){
  const etat={dialogues:[],accepter:false,ecritures:[],erreurs:[],partiel:false};
  page.on('pageerror',e=>etat.erreurs.push(e.message));
  page.on('console',message=>{
    if(message.type()==='error'&&!/Failed to load resource|net::ERR_|favicon|404/.test(message.text()))
      etat.erreurs.push(message.text());
  });
  page.on('dialog',async dialogue=>{
    etat.dialogues.push({type:dialogue.type(),message:dialogue.message()});
    if(etat.accepter)await dialogue.accept();else await dialogue.dismiss();
  });
  await page.clock.setFixedTime(new Date('2026-10-25T10:00:00Z'));
  await page.route('**/*',async route=>{
    const request=route.request(),url=new URL(request.url());
    if(url.hostname==='127.0.0.1'||url.hostname==='localhost')return route.continue();
    if(url.hostname==='geo.api.gouv.fr')return route.fulfill({status:200,
      contentType:'application/json',body:JSON.stringify([{nom:'AGEN',codesPostaux:['47000']}])});
    if(url.hostname!=='ateliers-numeriques.alwaysdata.net')return route.abort();
    const action=url.searchParams.get('action');
    const params=new URLSearchParams(request.postData()||'');
    let rep={ok:true};
    if(action==='getComptes')rep={ok:true,comptes:[{conseiller:NOM,role:'admin',actif:'OUI'}]};
    else if(action==='checkPassword')rep={ok:true,role:'admin',conseiller:NOM,token:'a'.repeat(64)};
    else if(action==='getAll')rep={ok:true,entries:[TEMOIN],
      lists:{statuts:['Planifié','Réalisé','Annulé','Reporté','Non réalisé'],
        conseillers:[NOM],publics:['Adultes'],materiels:['Ordinateur']},
      visibility:VISIBILITE,config:{},conseillers_inactifs:[],conseiller_colors:{},
      colors:{},emails:{},materiels_masques:[],stockOrdinateurs:10};
    else if(action==='getVisibility')rep={ok:true,visibility:VISIBILITE};
    else if(action==='getConfig')rep={ok:true,config:{},maintenance:false};
    else if(action==='getTickets')rep={ok:true,tickets:[],moi:NOM};
    else if(action==='getLogs')rep={ok:true,logs:[]};
    else if(action==='saveEntry'){
      etat.ecritures.push({action,entry:JSON.parse(params.get('entry'))});
    }else if(action==='saveMany'){
      const entries=JSON.parse(params.get('entries'));
      etat.ecritures.push({action,entries});
      if(etat.partiel){
        etat.partiel=false;
        rep={ok:false,error:'Erreurs batch: [{"idx":1,"error":"Échec simulé"}]'};
      }
    }
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rep)});
  });
  return etat;
}

async function connecter(page,fichier){
  if(fichier)await page.goto('/'+fichier);
  await expect(page.locator('input[type="password"]').first()).toBeVisible();
  await page.locator('select').first().selectOption(NOM);
  await page.locator('input[type="password"]').first().fill('mot-de-passe-fictif');
  await page.getByRole('button',{name:/Connexion/}).click();
  const acces=page.getByText('Accéder à mes ateliers',{exact:true});
  // Les deux applications accèdent normalement au profil choisi au login.
  // L'ancien écran de choix reste cependant un parcours valide de l'Index.
  if(await acces.isVisible().catch(()=>false)){
    await page.locator('select.accueil-select').selectOption(NOM);
    await acces.click();
  }
  // L'Admin NextStep expose le titre du bouton ; son nom accessible inclut
  // aussi l'icône, contrairement à l'Index qui fournit un aria-label.
  await expect(page.getByTitle('Nouveau',{exact:true})).toBeVisible();
}

const formulaire=page=>page.locator('[data-saisie="1"]');
const lieu=page=>formulaire(page).getByPlaceholder('Salle, médiathèque, établissement…');
const remarques=page=>formulaire(page).getByPlaceholder('Notes libres');
async function quitterMenu(page){
  const viewport=page.viewportSize();
  await page.mouse.move(viewport.width-10,100);
}

async function nav(page,nom){
  await page.getByTitle(nom,{exact:true}).click();
  // La sidebar s'élargit au survol et recouvre alors le bord du formulaire.
  // Comme un utilisateur qui revient vers le contenu, on quitte son survol.
  await quitterMenu(page);
}

async function deconnecter(page){
  await quitterMenu(page);
  const boutons=page.getByTitle('Déconnexion',{exact:true});
  const accessible=()=>boutons.evaluateAll(elements=>elements.findIndex(el=>{
    const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
    if(!r.width||!r.height||x<0||x>=innerWidth||y<0||y>=innerHeight)return false;
    const devant=document.elementFromPoint(x,y);
    return devant===el||el.contains(devant);
  }));
  let index=-1;
  // Le retrait du survol rend normalement le pied du menu atteignable.
  // Si la hauteur du desktop ne le permet pas, le contrôle mobile de la
  // topbar fournit le même parcours réel, sans forcer un élément hors écran.
  try{await expect.poll(accessible,{timeout:1000}).toBeGreaterThanOrEqual(0);index=await accessible();}catch(_){}
  if(index<0){
    await page.setViewportSize({width:390,height:800});
    await quitterMenu(page);
    await expect.poll(accessible).toBeGreaterThanOrEqual(0);
    index=await accessible();
  }
  await boutons.nth(index).click();
}

async function mesurer(page){
  for(const width of [390,1280]){
    await page.setViewportSize({width,height:800});
    const dimensions=await page.evaluate(()=>({viewport:innerWidth,
      document:document.documentElement.scrollWidth}));
    expect(dimensions.document,JSON.stringify(dimensions)).toBeLessThanOrEqual(width+1);
  }
}

async function valeurs(champs,attendues){
  await expect.poll(()=>champs.evaluateAll(elements=>elements.map(el=>el.value))).toEqual(attendues);
}

async function ouvrirEdition(page){
  await nav(page,'Historique');
  await page.getByText('Atelier témoin',{exact:true}).filter({visible:true}).first().click();
  await page.getByRole('button',{name:'Éditer complet',exact:true}).click();
}

for(const fichier of ['index.html','admin.html']){
  test(fichier+' — saisie conservée, abandons confirmés, succès et déconnexion',async({page})=>{
    const etat=await preparer(page);
    await connecter(page,fichier);
    await nav(page,'Nouveau');
    await expect(formulaire(page)).toBeVisible();
    await formulaire(page).locator('input[type="date"]').first().fill('2026-11-03');
    await lieu(page).fill('Salle du brouillon');
    await remarques(page).fill('Contenu conservé pendant la consultation');
    await formulaire(page).getByRole('button',{name:/Saisie One Shot/}).click();
    await expect(lieu(page)).toHaveValue('Salle du brouillon');
    await mesurer(page);

    await nav(page,'Agenda');
    await expect(formulaire(page)).toBeHidden();
    await nav(page,'Nouveau');
    await expect(lieu(page)).toHaveValue('Salle du brouillon');
    await expect(remarques(page)).toHaveValue('Contenu conservé pendant la consultation');
    await expect(formulaire(page).locator('input[type="date"]').first()).toHaveValue('2026-11-03');
    expect(etat.dialogues).toHaveLength(0);

    await formulaire(page).getByRole('button',{name:/Réinitialiser/}).click();
    await expect(lieu(page)).toHaveValue('Salle du brouillon');
    expect(etat.dialogues).toHaveLength(1);
    etat.accepter=true;
    await formulaire(page).getByRole('button',{name:/Réinitialiser/}).click();
    await expect(lieu(page)).toHaveValue('');
    await expect(formulaire(page).locator('input[type="date"]').first()).toHaveValue('');

    await lieu(page).fill('Brouillon à préserver');
    etat.accepter=false;
    await ouvrirEdition(page);
    await nav(page,'Nouveau');
    await expect(lieu(page)).toHaveValue('Brouillon à préserver');
    const apresRefus=etat.dialogues.length;
    etat.accepter=true;
    await ouvrirEdition(page);
    await expect(lieu(page)).toHaveValue(TEMOIN.lieu);
    expect(etat.dialogues).toHaveLength(apresRefus+1);
    await lieu(page).fill('Salle corrigée');
    await formulaire(page).getByRole('button',{name:/Modifier l.atelier/}).click();
    await expect.poll(()=>etat.ecritures.filter(e=>e.action==='saveEntry').length).toBe(1);
    await expect(formulaire(page)).toBeHidden();
    await nav(page,'Nouveau');
    await expect(lieu(page)).toHaveValue('');
    await expect(formulaire(page).locator('input[type="date"]').first()).toHaveValue('');

    await lieu(page).fill('Ne doit pas survivre à la déconnexion');
    etat.accepter=false;
    await deconnecter(page);
    await expect(lieu(page)).toHaveValue('Ne doit pas survivre à la déconnexion');
    etat.accepter=true;
    await deconnecter(page);
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(formulaire(page)).toHaveCount(0);
    await connecter(page);
    await nav(page,'Nouveau');
    await expect(lieu(page)).toHaveValue('');
    expect(etat.erreurs).toEqual([]);
  });

  test(fichier+' — cycle conservé et reprise partielle avec les mêmes identifiants',async({page})=>{
    const etat=await preparer(page);
    await connecter(page,fichier);
    await nav(page,'Nouveau');
    await formulaire(page).getByRole('button',{name:/Saisie par cycle/}).click();
    await lieu(page).fill('Salle du cycle');
    await formulaire(page).getByPlaceholder("Nom de l'orienteur").fill('Partenaire fictif');
    await formulaire(page).getByPlaceholder('Code postal ou commune…').fill('AGEN');
    await formulaire(page).locator('.combo-item').filter({hasText:'AGEN'}).first().click();
    await formulaire(page).locator('select').filter({has:page.locator('option[value="'+NOM+'"]')}).first().selectOption(NOM);
    await formulaire(page).locator('select').filter({has:page.locator('option[value="Adultes"]')}).first().selectOption('Adultes');
    await formulaire(page).locator('input[type="date"]').nth(0).fill('2026-11-03');
    await formulaire(page).locator('input[type="time"]').nth(0).fill('09:00');
    await formulaire(page).getByPlaceholder('Thème de la séance').nth(0).fill('Séance A');
    await formulaire(page).locator('input[type="date"]').nth(1).fill('2026-11-10');
    await formulaire(page).locator('input[type="time"]').nth(1).fill('09:00');
    await formulaire(page).getByPlaceholder('Thème de la séance').nth(1).fill('Séance B');
    await formulaire(page).getByRole('button',{name:'Dupliquer cette séance',exact:true}).first().click();
    await formulaire(page).locator('input[type="time"]').nth(1).fill('10:30');
    const dates=['2026-11-03','2026-11-03','2026-11-10'];
    await valeurs(formulaire(page).locator('input[type="date"]'),dates);
    await formulaire(page).getByRole('button',{name:/Saisie par cycle/}).click();
    await valeurs(formulaire(page).locator('input[type="date"]'),dates);
    await mesurer(page);

    await nav(page,'Agenda');
    await nav(page,'Nouveau');
    await expect(lieu(page)).toHaveValue('Salle du cycle');
    await valeurs(formulaire(page).locator('input[type="date"]'),dates);
    await valeurs(formulaire(page).locator('input[type="time"]'),['09:00','10:30','09:00']);
    expect(etat.dialogues).toHaveLength(0);
    await formulaire(page).getByRole('button',{name:/Saisie One Shot/}).click();
    await valeurs(formulaire(page).locator('input[type="date"]'),dates);
    expect(etat.dialogues).toHaveLength(1);

    etat.accepter=true;
    etat.partiel=true;
    await formulaire(page).getByRole('button',{name:/Créer 3 atelier/}).click();
    await expect.poll(()=>etat.ecritures.filter(e=>e.action==='saveMany').length).toBe(1);
    await valeurs(formulaire(page).locator('input[type="date"]'),['2026-11-03']);
    const premier=etat.ecritures.find(e=>e.action==='saveMany').entries;
    await nav(page,'Agenda');
    await nav(page,'Nouveau');
    await expect(lieu(page)).toHaveValue('Salle du cycle');
    await valeurs(formulaire(page).locator('input[type="time"]'),['10:30']);
    await formulaire(page).getByRole('button',{name:/Créer 1 atelier/}).click();
    await expect.poll(()=>etat.ecritures.filter(e=>e.action==='saveMany').length).toBe(2);
    const reprise=etat.ecritures.filter(e=>e.action==='saveMany')[1].entries;
    expect(reprise.map(e=>e._id)).toEqual([premier[1]._id]);
    await expect(formulaire(page)).toBeHidden();
    await nav(page,'Nouveau');
    await expect(lieu(page)).toHaveValue('');
    await valeurs(formulaire(page).locator('input[type="date"]'),['','']);
    await nav(page,'Calendrier');
    await page.getByRole('button',{name:'📥 Import ICS',exact:true}).click();
    await expect(formulaire(page).getByText('Choisir le fichier .ics',{exact:true})).toBeVisible();
    expect(etat.erreurs).toEqual([]);
  });
}
