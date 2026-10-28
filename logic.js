// logic.js — fonctions pures métier, testées sous Node.js (logic.test.js).
// Chargé par index.html et admin.html depuis le 26/09/2026 (AG-015, lot 0),
// entre utils.js et shared.js : les pages exécutent ce que les tests testent.
// Avant, les pages exécutaient des copies placées dans shared.js, et ce
// fichier avait divergé d'elles sans que rien ne le montre.
// Identique dans NEWGEN et NextStep (parité, AG-015). Le 26/09/2026, les
// fonctions que seuls les tests appelaient (computeKpi, applyFilters,
// validateLotRow, normalizeMateriel…) en sont sorties : elles avaient divergé
// entre les deux dépôts sans qu'aucune page ne les exécute.

if (typeof require !== 'undefined') {
  var {addJoursIso, matIncludes, normalizeDate, minutesHoraire} = require('./utils.js');
  // Constantes (const) d'utils.js : un « var » du même nom ferait échouer le
  // chargement de ce fichier dans les pages (redéclaration). Nom distinct.
  var LOGIC_UTILS = require('./utils.js');
}
// En contexte navigateur, addJoursIso et matIncludes sont déjà des globals (utils.js chargé avant)

// ── Matériel ──────────────────────────────────────────────────

// Retire de la liste des cases à cocher du formulaire les matériels masqués
// (config 'materiels_caches', Admin → Listes → toggle par matériel) — sans
// les retirer de la liste de référence (`materiels`, celle qui persiste pour
// les ateliers déjà enregistrés). Un matériel masqué mais déjà sélectionné
// (édition d'un atelier existant) reste affiché pour ne pas le désélectionner
// silencieusement.
function filterMaterielsVisibles(materiels,caches,selectionnes){
  return (materiels||[]).filter(m=>!matIncludes(caches,m)||matIncludes(selectionnes,m));
}

// ── Conflits matériel ─────────────────────────────────────────

// Miroir de findMobileClassConflicts (shared.js) : Classe mobile est un
// matériel physique unique, ne peut pas être à deux endroits le même jour.
// entries[].materiel est attendu en tableau (forme en mémoire côté navigateur,
// avant la conversion pipe-string faite juste avant l'envoi à GAS).
function findMobileClassConflicts(entries) {
  const parCreneau = {};
  entries.forEach(e => {
    if (e.statut === 'Annulé') return;
    if (!e.date) return;
    if (!matIncludes(e.materiel,'Classe mobile')) return;
    // Demi-journées touchées par l'horaire réel (AG-022) : 11:00–12:30
    // occupe le matin ET l'après-midi.
    demisAtelier(e).forEach(d => {
      const k = e.date + '|' + d;
      (parCreneau[k] = parCreneau[k] || []).push(e);
    });
  });
  // Un seul groupe par DATE, portant la ou les demi-journées en conflit.
  // Sans ce regroupement, un atelier sans ampm — qui compte dans les deux
  // demi-journées — produirait deux fois le même conflit à l'écran.
  const parDate = {};
  Object.keys(parCreneau).sort().forEach(k => {
    const items = parCreneau[k];
    if (new Set(items.map(e => e.conseiller)).size < 2) return;
    const date = k.split('|')[0];
    (parDate[date] = parDate[date] || []).push({ demi: k.split('|')[1], items });
  });
  return Object.keys(parDate).sort().map(date => {
    const parts = parDate[date];
    const vus = new Set(), entriesBloc = [];
    parts.forEach(p => p.items.forEach(e => { if (!vus.has(e)) { vus.add(e); entriesBloc.push(e); } }));
    return { date, demi: parts.map(p => p.demi).join('+'), entries: entriesBloc };
  });
}

// Miroir de findOrdinateursConflicts (shared.js). Contrairement à
// findMobileClassConflicts (même jour uniquement, matériel considéré comme
// unique/indivisible), ici la quantité (nb_ordinateurs, saisie manuelle) et
// la date de retour (date_retour_materiel) forment une période de prêt :
// deux ateliers à des dates différentes peuvent quand même se disputer le
// stock si le premier n'a pas rendu le matériel avant que le second en ait
// besoin. On étale chaque atelier sur les jours qu'il occupe (date →
// date_retour_materiel inclus, ou juste date si pas de retour renseigné),
// on cumule les quantités par jour, puis on fusionne les jours consécutifs
// en conflit en un seul bloc (date de début → date de fin) — pour ne pas
// répéter les mêmes conseillers sur chaque jour d'un même chevauchement de
// plusieurs jours. Chaque conseiller d'un bloc est en conflit avec tous les
// autres conseillers du même bloc.
// let (pas const) : écrasée par la config GAS (stockOrdinateurs renvoyé par
// getAll) dans loadData, et modifiable depuis le panneau Admin. shared.js —
// la copie réellement servie aux pages — l'a toujours déclarée en let ;
// ce const-ci n'avait aucun effet tant que logic.js n'était chargé que par
// les tests, mais aurait fait échouer la mise à jour en silence le jour où
// une page l'aurait référencé (22/09/2026).
let STOCK_ORDINATEURS = 10;
// Cumul du jour à partir d'une liste d'items {conseiller, qte} — au max par
// conseiller, pas en somme : un même conseiller qui enchaîne deux ateliers
// dos-à-dos (retour du premier = prélèvement du second, sans repasser par
// le local) n'a physiquement qu'un seul jeu d'ordinateurs en main ce
// jour-là, jamais deux fois sa quantité. La contention réelle du stock ne
// vient que de conseillers DIFFÉRENTS qui en ont besoin en même temps.
function totalJourParConseiller(items) {
  const parConseiller = {};
  (items || []).forEach(x => { parConseiller[x.conseiller] = Math.max(parConseiller[x.conseiller] || 0, x.qte); });
  return Object.values(parConseiller).reduce((s, q) => s + q, 0);
}
// Jour de semaine ISO (0=dimanche...6=samedi), indépendant du fuseau (parse
// manuel plutôt que new Date(dateIso) qui interprète 'YYYY-MM-DD' en UTC).
function estWeekend(dateIso) {
  const [y, m, j] = dateIso.split('-').map(Number);
  const jourSemaine = new Date(y, m - 1, j).getDay();
  return jourSemaine === 0 || jourSemaine === 6;
}
// Jour ouvré précédent/suivant le plus proche (saute samedi/dimanche) — sert
// de valeur par défaut au prélèvement/retour matériel quand le champ n'est
// pas renseigné : le retrait/dépôt du matériel a lieu un jour ouvré, jamais
// le week-end. Ex. atelier un lundi → prélèvement par défaut le vendredi.
function veilleOuvree(dateIso) {
  let d = addJoursIso(dateIso, -1);
  while (estWeekend(d)) d = addJoursIso(d, -1);
  return d;
}
function lendemainOuvre(dateIso) {
  let d = addJoursIso(dateIso, 1);
  while (estWeekend(d)) d = addJoursIso(d, 1);
  return d;
}
// Demi-journée d'un atelier : 'AM', 'PM', ou null quand on ne peut pas
// trancher. Le champ ampm est obligatoire à la saisie depuis longtemps, mais
// les entrées importées ou antérieures peuvent ne pas l'avoir : on retombe
// alors sur l'horaire (même repli que le dashboard, shared.js), puis sur null
// — et null réserve la journée entière, jamais l'inverse : mieux vaut une
// alerte de trop qu'un conflit matériel non signalé.
function demiJourneeAtelier(e) {
  const v = String((e && e.ampm) || '').trim().toUpperCase();
  if (v === 'AM' || v === 'PM') return v;
  const h = parseInt((e && e.horaire) || '', 10);
  if (!isNaN(h) && h >= 0 && h <= 23) return h < 12 ? 'AM' : 'PM';
  return null;
}

// Période réelle d'indisponibilité du matériel pour un atelier : du
// prélèvement (peut précéder la date de l'atelier — ex. retrait le mardi
// pour un atelier le vendredi) au retour.
// Repli quand un champ n'est pas renseigné : **la date de l'atelier**, des
// deux côtés. Le matériel est alors pris et rendu le jour même — c'est le
// fonctionnement réel confirmé par l'utilisateur le 22/09/2026. Ce repli
// remplace celui de la veille/lendemain ouvrés (19/09/2026), qui était une
// hypothèse : il étendait chaque atelier sans dates saisies à trois jours et
// fabriquait des chevauchements qui n'existent pas sur le terrain.
function periodePretMateriel(e) {
  const debut = e.date_prelevement_materiel
    ? ((e.date_prelevement_materiel < e.date) ? e.date_prelevement_materiel : e.date)
    : e.date;
  const fin = e.date_retour_materiel
    ? ((e.date_retour_materiel > e.date) ? e.date_retour_materiel : e.date)
    : e.date;
  return { debut, fin };
}

// Le retour du matériel a lieu le matin (confirmé le 21/09/2026) : le jour du
// retour, les machines sont de nouveau disponibles pour un autre conseiller
// qui les prélève le même jour. L'occupation va donc de `debut` INCLUS à
// `fin` EXCLU — sauf pour un prêt d'une seule journée, qui occupe bien ce
// jour-là, sinon il disparaîtrait du cumul.
function finOccupationMateriel(debut, fin) {
  return fin > debut ? addJoursIso(fin, -1) : fin;
}

// ── Créneau horaire d'un atelier (AG-022, 04/10/2026) ────────────────────
// Décision de l'utilisateur du 04/10/2026, qui affine celle du 22/09 (la
// demi-journée comme unité) : le stock d'ordinateurs se compte à l'heure
// près, sur [début, fin + 30 min) ; la Classe mobile, matériel unique, garde
// la demi-journée, mais un atelier occupe toutes celles que son horaire
// touche (11:00–12:30 : matin et après-midi). Minutes depuis minuit.
const MARGE_MATERIEL_MIN = 30;
const MIDI_MIN = 720, JOUR_MIN = 1440;
// { de, a } d'un atelier : son horaire et sa durée (1 h 30 si absente) ;
// sans horaire, la demi-journée enregistrée (ateliers anciens) ; sinon null,
// la journée entière — mieux vaut une alerte de trop qu'un conflit manqué.
function creneauAtelier(e) {
  const de = minutesHoraire(e && e.horaire);
  if (de !== null) {
    const defaut = typeof LOGIC_UTILS !== 'undefined' ? LOGIC_UTILS.DUREE_DEFAUT : DUREE_DEFAUT;
    return { de, a: Math.min(JOUR_MIN, de + (parseInt(e.duree, 10) || defaut)), heure: true };
  }
  const v = String((e && e.ampm) || '').trim().toUpperCase();
  if (v === 'AM') return { de: 0, a: MIDI_MIN };
  if (v === 'PM') return { de: MIDI_MIN, a: JOUR_MIN };
  return null;
}
// Demi-journées que l'atelier touche, sans la marge : ['AM'], ['PM'] ou les deux.
function demisAtelier(e) {
  const c = creneauAtelier(e);
  if (!c) return ['AM', 'PM'];
  const d = [];
  if (c.de < MIDI_MIN) d.push('AM');
  if (c.a > MIDI_MIN) d.push('PM');
  return d.length ? d : ['AM', 'PM'];
}
function hhmm(min) { return String(Math.floor(min / 60)).padStart(2, '0') + ':' + String(min % 60).padStart(2, '0'); }

// Occupation d'une demi-journée, pour l'affichage du Gantt (totaux matin /
// après-midi). Un prêt de plus d'un jour immobilise le matériel en continu.
function occupeCreneauMateriel(p, jour, demi) {
  if (jour < p.debut || jour > finOccupationMateriel(p.debut, p.fin)) return false;
  if (p.debut === p.fin && p.demis) return p.demis.includes(demi);
  if (p.debut === p.fin && p.demi) return demi === p.demi;
  return true;
}

// Minutes occupées par un prêt un jour donné : son créneau + la marge pour un
// prêt d'une seule journée ; la journée entière pour un prêt de plusieurs
// jours ou un atelier sans heure ni demi-journée.
function intervalleJourMateriel(p, jour) {
  if (jour < p.debut || jour > finOccupationMateriel(p.debut, p.fin)) return null;
  // Marge seulement sur une heure réelle : une demi-journée enregistrée sans
  // horaire (ateliers anciens) rend le matériel à midi, comme avant.
  if (p.debut === p.fin && p.creneau) return { de: p.creneau.de, a: Math.min(JOUR_MIN, p.creneau.a + (p.creneau.heure ? MARGE_MATERIEL_MIN : 0)) };
  return { de: 0, a: JOUR_MIN };
}

// Une journée à l'heure près (AG-022) : ordinateurs demandés au même moment
// (au max par conseiller, totalJourParConseiller). Rend la pointe, la plage
// où le stock est dépassé ({de, a} en minutes, ou null) et les prêts présents
// pendant ce dépassement.
function analyseJourMateriel(prets, jour, stock) {
  const actifs = [];
  (prets || []).forEach(p => { const iv = intervalleJourMateriel(p, jour); if (iv) actifs.push({ p, iv }); });
  const bornes = [...new Set([0, JOUR_MIN].concat(...actifs.map(x => [x.iv.de, x.iv.a])))].sort((x, y) => x - y);
  let pointe = 0, de = null, a = null;
  const enConflit = new Set();
  for (let i = 0; i < bornes.length - 1; i++) {
    const t = bornes[i];
    const ici = actifs.filter(x => x.iv.de <= t && x.iv.a > t);
    const total = totalJourParConseiller(ici.map(x => x.p));
    if (total > pointe) pointe = total;
    if (total > stock) {
      if (de === null) de = t;
      a = bornes[i + 1];
      ici.forEach(x => enConflit.add(x.p));
    }
  }
  return { pointe, depassement: de === null ? null : { de, a }, enConflit };
}

function findOrdinateursConflicts(entries, stock = STOCK_ORDINATEURS) {
  const parJour = {};
  (entries || []).forEach(e => {
    if (e.statut === 'Annulé') return;
    if (!e.date) return;
    if (!matIncludes(e.materiel,'Classe mobile')) return;
    // Classe mobile cochée sans quantité renseignée (entrées historiques
    // antérieures au champ obligatoire, ou import) → on suppose 1 ordinateur
    // plutôt que d'exclure l'entrée : sinon elle disparaît silencieusement
    // de la frise/Gantt alors qu'elle réserve bien la Classe mobile ce
    // jour-là (même principe que ATELIERS_NEWGEN, confirmé en prod le
    // 18/09/2026 — conseillers manquants dans le Gantt malgré des conflits).
    const qte = parseInt(e.nb_ordinateurs) || 1;
    const { debut, fin } = periodePretMateriel(e);
    const pret = { _id: e._id, conseiller: e.conseiller, qte,
      commune: e.commune || '', lieu: e.lieu || '',
      dateDebut: debut, dateFin: fin, demi: demiJourneeAtelier(e), demis: demisAtelier(e), creneau: creneauAtelier(e), debut, fin };
    // Garde-fou : une date de prélèvement/retour saisie à la main peut être
    // erronée (année oubliée, inversion jour/mois...) — on plafonne à 90
    // jours pour ne jamais boucler indéfiniment sur une période aberrante.
    const finOcc = finOccupationMateriel(debut, fin);
    let d = debut, garde = 0;
    while (d <= finOcc && garde < 90) {
      (parJour[d] = parJour[d] || []).push(pret);
      d = addJoursIso(d, 1);
      garde++;
    }
  });

  // Un JOUR est en conflit dès qu'à un instant le stock est dépassé (AG-022).
  // Le bloc porte la pointe et la plage horaire du dépassement (de, a, en
  // minutes) : « 11 demandés de 11:00 à 13:00 » se corrige autrement que
  // « toute la journée ». `demi` (demi-journées touchées par la plage) reste
  // fourni pour les écrans.
  const joursConflit = [];
  Object.keys(parJour).sort().forEach(date => {
    const an = analyseJourMateriel(parJour[date], date, stock);
    if (!an.depassement) return;
    const { de, a } = an.depassement;
    const demi = [de < MIDI_MIN ? 'AM' : null, a > MIDI_MIN ? 'PM' : null].filter(Boolean).join('+');
    joursConflit.push({ date, entries: [...an.enConflit], total: an.pointe, demi, de, a });
  });

  const blocs = [];
  joursConflit.forEach(g => {
    const dernier = blocs[blocs.length - 1];
    if (dernier && addJoursIso(dernier.dateFin, 1) === g.date && dernier.de === g.de && dernier.a === g.a) {
      dernier.dateFin = g.date;
      dernier.total = Math.max(dernier.total, g.total);
      g.entries.forEach(e => { if (!dernier._vus.has(e)) { dernier._vus.add(e); dernier.entries.push(e); } });
    } else {
      blocs.push({ date: g.date, dateFin: g.date, total: g.total, demi: g.demi, de: g.de, a: g.a, entries: [...g.entries], _vus: new Set(g.entries) });
    }
  });
  return blocs.map(({ _vus, ...b }) => b);
}

// Liste tous les prêts Classe mobile (période prélèvement → retour), pas
// seulement les jours en conflit (findOrdinateursConflicts ne renvoie que
// ça) — sert à la frise/Gantt où on veut voir tous les prêts pour repérer
// les chevauchements visuellement, pas uniquement ceux déjà détectés en
// dépassement de stock.
function getPretsMateriel(entries) {
  return (entries || [])
    .filter(e => e.statut !== 'Annulé' && e.date
      && matIncludes(e.materiel,'Classe mobile'))
    .map(e => {
      const { debut, fin } = periodePretMateriel(e);
      return {
        _id: e._id, conseiller: e.conseiller, qte: parseInt(e.nb_ordinateurs) || 1,
        commune: e.commune || '', lieu: e.lieu || '', thematique: e.thematique || '',
        dateAtelier: e.date, debut, fin, demi: demiJourneeAtelier(e), demis: demisAtelier(e), creneau: creneauAtelier(e),
      };
    })
    .sort((a, b) => a.debut < b.debut ? -1 : a.debut > b.debut ? 1 : 0);
}

// Cumul des ordinateurs réservés pour chaque DEMI-JOURNÉE de `jours` :
// { '2026-09-30': { AM: 10, PM: 11 } }. C'est le détail que la frise montre
// en infobulle et sur lequel se décide la couleur de la case.
function totauxParDemiJourneeMateriel(prets, jours) {
  const totaux = {};
  (jours || []).forEach(j => {
    totaux[j] = {
      AM: totalJourParConseiller((prets || []).filter(p => occupeCreneauMateriel(p, j, 'AM'))),
      PM: totalJourParConseiller((prets || []).filter(p => occupeCreneauMateriel(p, j, 'PM'))),
    };
  });
  return totaux;
}

// Cumul par jour = le maximum des deux demi-journées. C'est ce que la case de
// la frise affiche : la pointe de la journée, celle qui décide du dépassement.
// Sommer les deux compterait deux fois un prêt qui court toute la journée.
function totauxParJourMateriel(prets, jours) {
  const detail = totauxParDemiJourneeMateriel(prets, jours);
  const totaux = {};
  Object.keys(detail).forEach(j => { totaux[j] = Math.max(detail[j].AM, detail[j].PM); });
  return totaux;
}

// Un conflit (issu de findMobileClassConflicts ou findOrdinateursConflicts)
// devient "historique" une fois sa période entièrement passée — plus rien à
// arbitrer une fois que l'atelier a eu lieu. dateFin est absent sur un
// conflit Classe mobile (toujours un seul jour) : on retombe sur date.
function estConflitPasse(conflit, today) {
  return (conflit.dateFin || conflit.date) < today;
}

// ── Bilan trimestriel (CR « option 1 », module D, 04/10/2026) ─────────────

// Premier et dernier jour du trimestre t (1 à 4) de l'année a.
function bornesTrimestre(a, t) {
  const mm = n => String(n).padStart(2, '0');
  const fin = new Date(Date.UTC(a, t * 3, 0)).getUTCDate();
  return [`${a}-${mm(t * 3 - 2)}-01`, `${a}-${mm(t * 3)}-${mm(fin)}`];
}

// Trimestre de la date du jour (AAAA-MM-JJ) : celui présenté par défaut depuis
// le 26/10/2026 (choix de l'utilisateur ; avant, le dernier trimestre terminé).
function trimestreCourant(today) {
  return {annee: parseInt(today.slice(0, 4), 10), t: Math.floor((parseInt(today.slice(5, 7), 10) - 1) / 3) + 1};
}

// Dernier trimestre terminé à la date du jour (AAAA-MM-JJ).
function trimestrePrecedent(today) {
  const a = parseInt(today.slice(0, 4), 10), t = Math.floor((parseInt(today.slice(5, 7), 10) - 1) / 3) + 1;
  return t === 1 ? {annee: a - 1, t: 4} : {annee: a, t: t - 1};
}

// Chiffres du bilan d'une période [debut, fin] (mois ou trimestre, AG-037) :
// programmation sur tous les statuts, tout le reste sur les seuls ateliers
// « Réalisé » (choix de l'utilisateur du 28/10/2026).
// avis : lignes de l'action bilanAvis (une par avis, sans remarque).
// aujourdhui (AAAA-MM-JJ, défaut : date du jour) : « Planifié » à mettre à
// jour = date passée seulement, une période en cours ayant des ateliers à venir.
function bilanPeriode(entries, debut, fin, avis, aujourdhui) {
  // Navigateur : constantes globales d'utils.js (const, absentes de window).
  const CHOIX = typeof LOGIC_UTILS !== 'undefined' ? LOGIC_UTILS.BILAN_CHOIX : BILAN_CHOIX;
  const MULTIPLES = typeof LOGIC_UTILS !== 'undefined' ? LOGIC_UTILS.BILAN_MULTIPLES : BILAN_MULTIPLES;
  const DUREE_DEF = typeof LOGIC_UTILS !== 'undefined' ? LOGIC_UTILS.DUREE_DEFAUT : DUREE_DEFAUT;
  const normCom = typeof LOGIC_UTILS !== 'undefined' ? LOGIC_UTILS.normalizeCommune : normalizeCommune;
  const compter = (o, k) => { if (k !== null && k !== undefined && k !== '') o[k] = (o[k] || 0) + 1; };
  const moyenne = l => l.length ? Math.round(l.reduce((x, y) => x + y, 0) / l.length * 10) / 10 : null;
  const num = v => (v === '' || v === null || v === undefined || isNaN(parseInt(v, 10))) ? null : parseInt(v, 10);
  const auj = aujourdhui || new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const tout = (entries || []).filter(e => { const d = normalizeDate(e.date); return d && d >= debut && d <= fin; });
  // AG-038 (28/10/2026) : bilan à date = ateliers d'avant aujourd'hui, et ceux
  // du jour qui ne sont plus « Planifié » ; le reste est « À venir », jamais
  // compté dans la programmation ni dans le taux de réalisation.
  const estAVenir = e => { const d = normalizeDate(e.date); return d > auj || (d === auj && e.statut === 'Planifié'); };
  const periode = tout.filter(e => !estAVenir(e));
  const prevus = tout.filter(estAVenir);
  const realises = periode.filter(e => e.statut === 'Réalisé');
  const statuts = {};
  periode.forEach(e => compter(statuts, e.statut || 'Sans statut'));
  // Taux de présence : seulement les ateliers où inscrits et présents sont saisis.
  const avecPresence = realises.filter(e => num(e.inscrits) > 0 && num(e.presents) !== null);
  const sommeInscrits = avecPresence.reduce((x, e) => x + num(e.inscrits), 0);
  // Décisions de l'utilisateur du 26/10/2026 (AG-032) : participations sur les
  // seuls ateliers où les présents sont saisis (couverture affichée) ; durée
  // vide comptée DUREE_DEFAUT (1 h 30), comme ailleurs dans l'appli ; communes
  // comptées après normalizeCommune (« AGEN (47000) » = « Agen »).
  const presentsSaisis = realises.filter(e => num(e.presents) !== null);
  const activite = {
    realises: realises.length, statuts,
    planifiesPasses: periode.filter(e => e.statut === 'Planifié' && normalizeDate(e.date) < auj).length,
    presents: presentsSaisis.reduce((x, e) => x + num(e.presents), 0),
    presentsSaisis: presentsSaisis.length,
    tauxPresence: sommeInscrits ? Math.round(avecPresence.reduce((x, e) => x + num(e.presents), 0) / sommeInscrits * 100) : null,
    heures: Math.round(realises.reduce((x, e) => x + (num(e.duree) || DUREE_DEF), 0) / 60 * 10) / 10,
    dureesParDefaut: realises.filter(e => !num(e.duree)).length,
    communes: new Set(realises.map(e => normCom(e.commune)).filter(Boolean)).size,
    // AG-037 : ce que le bilan mensuel affichait, sur la même population.
    programmes: periode.length,
    tauxRealisation: periode.length ? Math.round(realises.length / periode.length * 100) : null,
    inscrits: realises.reduce((x, e) => x + (num(e.inscrits) || 0), 0),
    // Base du taux de présence : ateliers, inscrits et présents retenus.
    presence: {ateliers: avecPresence.length, inscrits: sommeInscrits,
      presents: avecPresence.reduce((x, e) => x + num(e.presents), 0)},
  };
  const fiches = {remplies: 0, autres: []};
  Object.keys(CHOIX).forEach(k => { fiches[k] = {}; });
  realises.forEach(e => {
    const b = e.fiche_bilan;
    if (!b || typeof b !== 'object' || !Object.keys(b).length) return;
    fiches.remplies++;
    Object.keys(CHOIX).forEach(k => {
      (MULTIPLES.includes(k) ? (Array.isArray(b[k]) ? b[k] : []) : [b[k]]).forEach(v => compter(fiches[k], v));
    });
    if (b.difficultes_autre) fiches.autres.push(b.difficultes_autre);
  });
  const ids = new Set(realises.map(e => e._id));
  const lignes = (avis || []).filter(v => ids.has(v.atelier_id));
  const av = {n: lignes.length, ateliers: new Set(lignes.map(v => v.atelier_id)).size,
    attentes: moyenne(lignes.map(v => v.attentes).filter(x => x)), clarte: moyenne(lignes.map(v => v.clarte).filter(x => x))};
  // Base des pourcentages = tous les avis (AG-032) : les non-réponses sont
  // comptées à part, pour que la répartition fasse 100 %.
  av.sansReponse = {};
  ['rythme', 'aise', 'autonomie'].forEach(k => {
    av[k] = {}; lignes.forEach(v => compter(av[k], v[k]));
    av.sansReponse[k] = lignes.filter(v => v[k] === null || v[k] === undefined || v[k] === '').length;
  });
  // Sujets : plusieurs choix par avis (AG-035, 27/10/2026), chacun compté une
  // fois ; même base (tous les avis), donc un total au-delà de 100 %. Un avis
  // d'avant le 27/10 porte une valeur seule.
  const sujetsDe = v => Array.isArray(v.sujet) ? v.sujet : (v.sujet ? [v.sujet] : []);
  av.sujet = {}; lignes.forEach(v => new Set(sujetsDe(v)).forEach(x => compter(av.sujet, x)));
  av.sansReponse.sujet = lignes.filter(v => !sujetsDe(v).length).length;
  // Sans prototype : une thématique nommée « constructor » ou « toString »
  // n'atteint plus les méthodes d'Object (AG-032).
  const themes = Object.create(null);
  realises.forEach(e => {
    const t = e.thematique || 'Sans thématique';
    const x = themes[t] || (themes[t] = {theme: t, ateliers: 0, presents: 0, avis: 0, notes: []});
    x.ateliers++; x.presents += num(e.presents) || 0;   // présents saisis ; un vide n'ajoute rien
  });
  lignes.forEach(v => {
    const e = realises.find(r => r._id === v.atelier_id);
    if (!e) return;
    const x = themes[e.thematique || 'Sans thématique'];
    x.avis++; if (v.attentes) x.notes.push(v.attentes);
  });
  const parTheme = Object.values(themes)
    .map(x => ({theme: x.theme, ateliers: x.ateliers, presents: x.presents, avis: x.avis, attentes: moyenne(x.notes)}))
    .sort((a, b) => b.ateliers - a.ateliers || a.theme.localeCompare(b.theme));
  // Ventilations (AG-037). Un atelier co-animé compte pour ses deux
  // animateurs (D1) : les lignes par conseiller ne s'additionnent pas.
  const groupe = (liste, cle, champ) => {
    const o = Object.create(null);
    liste.forEach(e => { const k = cle(e); if (!k) return;
      const x = o[k] || (o[k] = {[champ]: k, ateliers: 0, presents: 0, presentsSaisis: 0});
      x.ateliers++; if (num(e.presents) !== null) { x.presents += num(e.presents); x.presentsSaisis++; } });
    return Object.values(o).sort((a, b) => b.ateliers - a.ateliers || String(a[champ]).localeCompare(String(b[champ])));
  };
  const parOrienteur = groupe(realises, e => e.orienteur, 'orienteur');
  const parCommune = groupe(realises, e => normCom(e.commune), 'commune');
  const noms = [...new Set(periode.flatMap(e => [e.conseiller, e.co_animateur]).filter(Boolean))];
  const parConseiller = noms.map(c => {
    const l = periode.filter(e => e.conseiller === c || e.co_animateur === c);
    const r = l.filter(e => e.statut === 'Réalisé'), ps = r.filter(e => num(e.presents) !== null);
    return {conseiller: c, programmes: l.length, realises: r.length, annules: l.filter(e => e.statut === 'Annulé').length,
      presents: ps.reduce((x, e) => x + num(e.presents), 0), presentsSaisis: ps.length,
      tauxRealisation: l.length ? Math.round(r.length / l.length * 100) : null};
  }).sort((a, b) => b.programmes - a.programmes || a.conseiller.localeCompare(b.conseiller));
  // Par mois de la période (bornes incluses, année explicite), à venir compris.
  const parMois = [];
  for (let m = debut.slice(0, 7); m <= fin.slice(0, 7);) {
    const l = tout.filter(e => normalizeDate(e.date).slice(0, 7) === m);
    const r = l.filter(e => e.statut === 'Réalisé'), ps = r.filter(e => num(e.presents) !== null);
    const st = {}; l.forEach(e => compter(st, e.statut || 'Sans statut'));
    parMois.push({mois: m, statuts: st, presents: ps.reduce((x, e) => x + num(e.presents), 0), presentsSaisis: ps.length});
    const [a, mm] = m.split('-').map(Number);
    m = mm === 12 ? `${a + 1}-01` : `${a}-${String(mm + 1).padStart(2, '0')}`;
  }
  // À venir (AG-038) : faits saisis seulement, aucune estimation ; pas d'inscrits
  // (nombre préréglé dans le formulaire, sans nom : retiré le 28/10/2026).
  const stAVenir = {};
  prevus.forEach(e => compter(stAVenir, e.statut || 'Sans statut'));
  const planifies = prevus.filter(e => e.statut === 'Planifié');
  const compteSimple = (cle, champ) => { const o = Object.create(null);
    planifies.forEach(e => { const k = cle(e); if (k) o[k] = (o[k] || 0) + 1; });
    return Object.keys(o).map(k => ({[champ]: k, ateliers: o[k]})).sort((a, b) => b.ateliers - a.ateliers || String(a[champ]).localeCompare(String(b[champ]))); };
  const aVenir = {ateliers: prevus.length, statuts: stAVenir, planifies: planifies.length,
    parConseiller: [...new Set(planifies.flatMap(e => [e.conseiller, e.co_animateur]).filter(Boolean))]
      .map(c => ({conseiller: c, ateliers: planifies.filter(e => e.conseiller === c || e.co_animateur === c).length}))
      .sort((a, b) => b.ateliers - a.ateliers || a.conseiller.localeCompare(b.conseiller)),
    parTheme: compteSimple(e => e.thematique || 'Sans thématique', 'theme'),
    parCommune: compteSimple(e => normCom(e.commune), 'commune')};
  return {debut, fin, aujourdhui: auj, activite, fiches, avis: av, parTheme, parOrienteur, parCommune, parConseiller, parMois, aVenir};
}
// Ancien nom, encore appelé par les écrans pendant la fusion (AG-037, Codex).
const bilanTrimestriel = bilanPeriode;


// ── Créneaux libres (11/10/2026) ──────────────────────────────
// Demi-journées (matin / après-midi) sans atelier pour un conseiller, sur les
// jours de la semaine choisis. Occupé = animateur ou co-animateur d'un atelier
// non annulé ni reporté sur cette demi-journée (AM/PM de l'atelier, d'après
// demiJourneeAtelier) ; un atelier sans horaire ni AM/PM occupe la journée.
// Ne connaît que les ateliers saisis : ni congés ni réunions Outlook.
// o = { conseiller, du, au (AAAA-MM-JJ, inclus), jours: [1..5] (0 = dimanche),
//       moments: ['AM','PM'], estFerie: iso => libellé | '',
//       bloques: ['AAAA-MM-JJ|AM', …] (rendez-vous Outlook, 12/10/2026) }
// Rend [{ date, demi }] dans l'ordre chronologique.
function creneauxLibres(entries, o) {
  const occ = new Set(o.bloques || []);
  (entries || []).forEach(e => {
    if (!e || (e.conseiller !== o.conseiller && e.co_animateur !== o.conseiller)) return;
    if (e.statut === 'Annulé' || e.statut === 'Reporté') return;
    const d = normalizeDate(e.date);
    if (!d) return;
    const demi = demiJourneeAtelier(e);
    if (demi) occ.add(d + '|' + demi);
    else { occ.add(d + '|AM'); occ.add(d + '|PM'); }
  });
  const res = [];
  if (!o.du || !o.au || o.du > o.au) return res;
  for (let d = o.du, n = 0; d <= o.au && n < 400; d = addJoursIso(d, 1), n++) {
    const [y, m, j] = d.split('-').map(Number);
    if (!(o.jours || []).includes(new Date(y, m - 1, j).getDay())) continue;
    if (o.estFerie && o.estFerie(d)) continue;
    (o.moments || ['AM', 'PM']).forEach(demi => { if (!occ.has(d + '|' + demi)) res.push({ date: d, demi }); });
  }
  return res;
}

// Ce qui occupe chaque demi-journée (20/10/2026), affiché à côté des créneaux
// libres : « Matin libre — après-midi : La Régie ». Mêmes règles que
// creneauxLibres. Libellé : orienteur (le partenaire), sinon lieu, commune,
// thématique ; plusieurs ateliers joints par « + ». Bloqué par Outlook seul :
// « Outlook » (l'import ne garde pas les titres).
// Rend { 'AAAA-MM-JJ|AM': libellé, … }.
function creneauxPris(entries, o) {
  const pris = {};
  (o.bloques || []).forEach(k => { pris[k] = 'Outlook'; });
  const vus = {};
  (entries || []).forEach(e => {
    if (!e || (e.conseiller !== o.conseiller && e.co_animateur !== o.conseiller)) return;
    if (e.statut === 'Annulé' || e.statut === 'Reporté') return;
    const d = normalizeDate(e.date);
    if (!d || (o.du && d < o.du) || (o.au && d > o.au)) return;
    const lib = String(e.orienteur || e.lieu || e.commune || e.thematique || 'Atelier').trim();
    const demi = demiJourneeAtelier(e);
    (demi ? [demi] : ['AM', 'PM']).forEach(dm => {
      const k = d + '|' + dm;
      const l = vus[k] || (vus[k] = []);
      if (!l.includes(lib)) l.push(lib);
    });
  });
  Object.keys(vus).forEach(k => { pris[k] = vus[k].join(' + '); });
  return pris;
}

// ── Contrôles de saisie (12/10/2026) ──────────────────────────
// Demi-journée d'un atelier en cours de saisie : l'heure tapée prime sur
// l'AM/PM enregistré (encore l'ancien pendant la frappe). null = inconnue.
function demiSaisie(x) {
  const m = minutesHoraire(x && x.horaire);
  if (m != null) return m < 720 ? 'AM' : 'PM';
  return demiJourneeAtelier(x);
}
// Ateliers du même conseiller (animateur ou co-animateur, dans un sens ou
// dans l'autre) sur la même demi-journée, hors annulés, reportés et l'atelier
// lui-même. Demi-journée inconnue d'un côté : toute la journée compte.
function conflitsConseiller(entries, cand) {
  const gens = [cand.conseiller, cand.co_animateur].filter(Boolean);
  if (!cand.date || !gens.length) return [];
  const dc = demiSaisie(cand);
  return (entries || []).filter(e => {
    if (!e || e._id === cand._id || e.statut === 'Annulé' || e.statut === 'Reporté') return false;
    if (normalizeDate(e.date) !== cand.date) return false;
    if (!gens.includes(e.conseiller) && !gens.includes(e.co_animateur)) return false;
    const de = demiSaisie(e);
    return !dc || !de || dc === de;
  });
}

// ── Cycle : la 1re séance donne le ton (13/10/2026) ──────────
// Durée : celle de la 1re ligne est recopiée sur les lignes qui avaient encore
// son ancienne valeur. Horaire, par demi-journée (cycles alternés, 13/10) :
// la 1re ligne du matin donne l'horaire des matins, la 1re de l'après-midi
// celui des après-midis ; la 1re ligne du cycle donne aussi le sien aux lignes
// sans demi-journée choisie. Seules suivent les lignes vides ou encore égales
// à l'ancienne valeur : une ligne modifiée à la main garde la sienne.
// Demi-journée d'une ligne : bouton ☀️/🌙 (ou créneau de Disponibilités),
// sinon celle de son horaire. Rend les lignes mises à jour.
function demiLigne(x) {
  return (x && (x.creneau || ampmDepuisHoraire(x.horaire))) || '';
}
function propagerPremiereLigne(rows, id, k, v) {
  rows = rows || [];
  const i = rows.findIndex(x => x.id === id);
  if (i < 0) return rows;
  const x = rows[i];
  const maj = y => {
    const a = k === 'horaire' ? ampmDepuisHoraire(v) : '';
    return { ...y, [k]: v, ...(a ? { ampm: a } : {}) };
  };
  if (k === 'duree') {
    return rows.map((y, j) => j === i || (i === 0 && j > 0 && String(y.duree) === String(x.duree)) ? maj(y) : y);
  }
  if (k !== 'horaire') return rows.map(y => y.id === id ? maj(y) : y);
  const d = ampmDepuisHoraire(v) || demiLigne(x);
  const refDemi = !!d && !rows.slice(0, i).some(z => demiLigne(z) === d);
  return rows.map((y, j) => {
    if (j === i) return maj(y);
    if (j < i || (y.horaire && y.horaire !== x.horaire)) return y;
    const suit = (refDemi && y.creneau === d) || (i === 0 && !y.creneau);
    return suit ? maj(y) : y;
  });
}
// Bouton ☀️/🌙 d'une ligne : elle passe sur cette demi-journée et prend
// l'horaire de la 1re ligne qui en a un dans cette demi-journée (vide sinon).
// Un horaire déjà dans la bonne demi-journée est gardé.
function basculerDemiLigne(rows, id, demi) {
  rows = rows || [];
  const ref = rows.find(z => z.id !== id && z.horaire && ampmDepuisHoraire(z.horaire) === demi);
  return rows.map(y => {
    if (y.id !== id) return y;
    const garde = y.horaire && ampmDepuisHoraire(y.horaire) === demi;
    return { ...y, creneau: demi, ampm: demi, horaire: garde ? y.horaire : (ref ? ref.horaire : '') };
  });
}

// ── Analyse : comparaison annuelle ─────────────────────────────────────
function _analyseDateValide(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T12:00:00Z');
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
function _analyseAujourdhui(value) {
  if (value) return value;
  return typeof LOGIC_UTILS !== 'undefined' ? LOGIC_UTILS.todayLocal() : todayLocal();
}
function _analyseAnneePrecedente(date, year) {
  const month = date.slice(5, 7), day = date.slice(8, 10);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return String(year).padStart(4, '0') + '-' + month + '-' + (month === '02' && day === '29' && !leap ? '28' : day);
}
// Les années chargées viennent de l'appel getAll, jamais des seules lignes.
// hasData/records décrivent toute l'année (tous statuts), pas la période :
// zéro en mars est connu même si les seuls ateliers de l'année sont en avril.
// monthly = null hors période, année non chargée ou sans historique enregistré.
function comparaisonAnnuelle(entries, options = {}) {
  const year = Number(options.year), previousYear = year - 1;
  const from = options.from || '', to = options.to || '';
  const today = _analyseAujourdhui(options.today);
  const loaded = new Set((Array.isArray(options.loadedYears) ? options.loadedYears : String(options.loadedYears || '').split(',')).map(Number));
  const make = y => ({ from: '', to: '', monthly: Array(12).fill(null), total: 0, loaded: loaded.has(y), hasData: false, records: 0 });
  const result = { year, previousYear, current: make(year), previous: make(previousYear), status: 'invalid-range' };
  if (!Number.isInteger(year) || year < 1000 || year > 9999 || !_analyseDateValide(today) ||
      (from && !_analyseDateValide(from)) || (to && !_analyseDateValide(to)) ||
      (from && to && (from > to || from.slice(0, 4) !== to.slice(0, 4)))) return result;

  const valid = (entries || []).filter(e => e && _analyseDateValide(e.date));
  for (const [y, bucket] of [[year, result.current], [previousYear, result.previous]]) {
    bucket.records = valid.filter(e => Number(e.date.slice(0, 4)) === y).length;
    bucket.hasData = bucket.records > 0;
  }
  const yearStart = year + '-01-01', yearEnd = year + '-12-31';
  const start = from && from > yearStart ? from : yearStart;
  let end = to && to < yearEnd ? to : yearEnd;
  const yesterday = new Date(today + 'T12:00:00Z');
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const lastPastDay = yesterday.toISOString().slice(0, 10);
  if (end > lastPastDay) end = lastPastDay;
  if (start > end) { result.status = 'outside'; return result; }
  result.current.from = start; result.current.to = end;
  result.previous.from = _analyseAnneePrecedente(start, previousYear);
  result.previous.to = _analyseAnneePrecedente(end, previousYear);

  for (const bucket of [result.current, result.previous]) {
    if (!bucket.loaded || !bucket.hasData) continue;
    const firstMonth = Number(bucket.from.slice(5, 7)) - 1, lastMonth = Number(bucket.to.slice(5, 7)) - 1;
    for (let m = firstMonth; m <= lastMonth; m++) bucket.monthly[m] = 0;
    valid.forEach(e => {
      if (e.statut !== 'Réalisé' || e.date >= today || e.date < bucket.from || e.date > bucket.to) return;
      bucket.monthly[Number(e.date.slice(5, 7)) - 1]++;
      bucket.total++;
    });
  }
  result.status = !result.current.loaded || !result.previous.loaded ? 'unloaded'
    : !result.current.hasData || !result.previous.hasData ? 'empty' : 'ready';
  return result;
}

if (typeof module !== 'undefined') {
  module.exports = {
    comparaisonAnnuelle,
    filterMaterielsVisibles,
    findMobileClassConflicts,
    demiJourneeAtelier, finOccupationMateriel, occupeCreneauMateriel,
    totauxParDemiJourneeMateriel,
    STOCK_ORDINATEURS, totalJourParConseiller, findOrdinateursConflicts, periodePretMateriel,
    getPretsMateriel, totauxParJourMateriel,
    estConflitPasse,
    estWeekend, veilleOuvree, lendemainOuvre,
    creneauAtelier, demisAtelier, analyseJourMateriel, MARGE_MATERIEL_MIN, hhmm,
    bornesTrimestre, trimestreCourant, trimestrePrecedent, bilanTrimestriel, bilanPeriode,
    creneauxLibres, creneauxPris, demiSaisie, conflitsConseiller, propagerPremiereLigne, basculerDemiLigne, demiLigne,
  };
}
