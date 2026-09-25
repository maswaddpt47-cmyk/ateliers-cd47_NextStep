# Chantiers en cours — Ateliers CD47 NextStep

État au **22/09/2026**, commit de référence `13c0acb`.
Fichier transitoire : à mettre à jour à chaque avancée, à supprimer quand tout
est soldé. Ce n'est pas de la documentation permanente (cf.
`MD-LIB/hygiene-instructions.md`).

---

## ✅ 25/09/2026 — Bascule faite et contrôlée (avancée au matin)

En ligne à 10:12 (`a75fb91`), contrôlée par l'utilisateur vers 10:25 (Admin,
Index, atelier de test, maintenance levée). GAS NextStep coupé (accès
« Seulement moi »), déclencheur `envoyerAlertesRetard` supprimé, import
verrouillé. Détail : `ATELIERS_NEWGEN/CHANTIERS.md`. Le bloc ci-dessous est
l'ordre du jour tel qu'il avait été préparé.

## 🚀 24/09/2026 — Bascule vers l'API Alwaysdata prête, fixée au 25/09/2026 à 15 h 30 (mail envoyé à l'équipe le 24/09)

Branche `claude/architecture-refonte-migration-wqlanb`, **non fusionnée** :
`deploy.yml` ne part que de `main`, la production reste sur le GAS tant que
la fusion n'est pas faite. Contenu : code du labo NextStep d'ATELIERS_NEWGEN
(API en POST, mot de passe oublié, déconnexion auto d'Index à 30 min,
panneau latéral fixe, annonce de nouvelle version, plus de PWA), espace de
noms de stockage `nextstep` inchangé. Tests e2e adaptés, 33 verts.

**Ordre du jour J** (détail : `ATELIERS_NEWGEN/CHANTIERS.md`) :
1. GAS NextStep en maintenance ; export xlsx frais du classeur.
2. Page d'import de l'API : Analyser, puis Importer.
3. Fusion de la branche dans `main` (déploiement 2-3 min), vérification.
4. Désactiver le déclencheur GAS `envoyerAlertesRetard` (sinon rappels en
   double / sur données figées).
5. Verrouiller l'import (sinon un second import écraserait les saisies
   faites après la bascule).

---

## 🧭 23/09/2026 — Refonte d'architecture en réflexion : NextStep à geler

Réflexion en cours, rien n'est décidé. **Détail complet et questions
ouvertes : `ATELIERS_NEWGEN/CHANTIERS.md`, section « Refonte
d'architecture ».** Piste proposée : NEWGEN reprend la relève (c'était son
rôle), GAS remplacé par PHP+MySQL chez un hébergeur français déployé par
push GitHub. **NextStep reste la production jusqu'à la bascule : c'est son
classeur qui sera copié**, et le code convergé serait publié **à son URL**
pour ne pas casser les PWA installées de l'équipe (à confirmer).

---

## 1. Tranché le 22/09/2026 — les lectures doublées l'emportent

**La question ouverte depuis le 18/09 est close.** Série du banc : 249 salves,
backend NEWGEN, 07h26→17h15, les deux stratégies en alternance sur le même
backend et le même poste.

| | file d'attente | lectures doublées |
|---|---|---|
| Salves incomplètes | **23/125 — 18,4 %** | **5/124 — 4,0 %** |
| Durée médiane | 26,0 s | 11,9 s |
| Salves > 30 s | 45 % | 15 % |
| Salves > 60 s | **10 %** | **0 %** |
| Appels par salve | 4,3 | 5,4 |

**Test apparié sur 124 paires consécutives** (celui qu'exige
`banc/README.md`) : McNemar χ² = **10,32**, significatif à 1 % — 23 paires où
seule la file échoue contre 5 où seul le doublage échoue. Différence de durée
appariée : **+11,8 s pour la file**, IC95 [+7,8 ; +15,9], la file perdant dans
73 % des paires.

### ⚖️ AG-003 tranché le 22/09/2026 — le verrou GAS d'abord, le portage après

Verdict de la session contradictrice : **amendé**. Ce qu'elle a établi, code à
l'appui, et qu'il ne faut pas réapprendre :

- **`_gasQueue` n'a jamais protégé les écritures.** Son commentaire la présente
  comme le test d'une hypothèse de *latence* (commit `f44f239`, « perf:
  sérialiser les appels GAS »). La retirer ne retire aucune garantie voulue.
- **Elle ne sérialise que le client, et seulement jusqu'à l'abandon** : elle
  repart à l'abandon du navigateur, pas à la fin du script — or un `saveEntry`
  parti en 404 a bien écrit sa ligne. Et elle ne voit ni un second onglet, ni
  un second conseiller.
- **Côté serveur, aucun verrou n'existait**, dans aucun des deux scripts.
  L'invariant « écritures séquentielles » des deux `CLAUDE.md` **n'est
  garantissable que côté GAS**, jamais côté client — à reformuler dans les
  deux fichiers au prochain passage.
- **Risque le plus grave, absent du bloc initial** : un `delete` concurrent
  d'une autre écriture décale les lignes du classeur → l'autre exécution
  **supprime ou écrase l'atelier voisin**. Présent aujourd'hui en production
  dans les deux projets, file ou pas. C'est ce qui justifie le verrou, pas la
  latence.

**Décision de l'utilisateur** : option recommandée — verrou d'abord.

### 🐞 Bug silencieux en production jusqu'au déploiement — champ « Stock ordinateurs »

Constaté le 22/09/2026, en répondant à « le stock fonctionne déjà sans
déploiement, non ? ». **Il en a toutes les apparences, et c'est le piège.**

L'écriture des trois champs (`nb_ordinateurs`, `date_prelevement_materiel`,
`date_retour_materiel`) marche sans déploiement : `actionSaveEntry` de
NextStep écrit **n'importe quelle colonne** dont le nom correspond à une clé
de l'entrée (`d[h]`), sans liste fermée — contrairement à NEWGEN.

**En revanche le champ Admin « Stock ordinateurs » est décoratif :**

| Action | Réalité |
|---|---|
| Saisir 14 et enregistrer | sauvé dans Config, et la **session en cours** utilise 14 (`admin_app.js:1294`) |
| Recharger | le champ **réaffiche 14** (`admin_app.js:1272`, lecture de la config) |
| Calcul des conflits / Frise | **utilise 10** (`logic.js:168`) |

La bascule ne se fait que par `data.stockOrdinateurs` (`app.js:350`,
`admin_app.js:343`), que **seule v10.14.0 produit** (`gas/GAS_NEXTSTEP.js:351`,
`:412`) — non déployée. Le champ affiche donc la bonne valeur pendant que tout
le calcul tourne sur 10.

C'est le cas typique de la règle « les tests ne trouvent pas les défauts de
sens » : tout calcule juste, sur la mauvaise valeur. Aucune suite ne pouvait
le voir. **Résolu par le déploiement du 23/09/2026, vérifié en ligne par
l'utilisateur. Section à retirer au prochain passage.** Vérification faite (changer le
stock, recharger, vérifier qu'une alerte de conflit mentionne bien le nouveau
nombre).

### ✅ Verrou GAS déployé le 23/09/2026 à 08:40 — v10.18.0

Confirmé par l'utilisateur : tests de sécurité, enregistrement et suppression
ok, champ « Stock ordinateurs » ok. Migration `ajouterColonnesPretMateriel`
sans objet (colonnes déjà présentes). **Le portage du doublage est
débloqué.**

⚖️ **AG-004 tranché le 22/09/2026 — version à déployer : v10.18.0** (toute
copie plus ancienne est périmée). Les mails « Summary of failures » montraient
3 `keepAlive` bloqués **8 min** les 19 et 20/09. `keepAlive` tenait le verrou
de script pendant sa lecture : une fois le verrou d'écriture en ligne, un tel
blocage aurait refusé toutes les écritures pendant 8 min. Il n'y touche plus
(drapeau `CacheService`). Les refus serveur apparaissent désormais dans le
journal Admin avec le motif `serveur : …`. **Après déploiement, surveiller
les `doGet` d'écriture d'environ 20 s dans les Exécutions** : ce sont des
écritures refusées faute de verrou. Détail : `ATELIERS_NEWGEN/AGORA.md`, AG-004.

### Relevé NextStep du 22/09/2026 — l'angle mort n° 1 d'AG-003 se referme

44 appels, 11:31 -> 20:27, usage réel (pas d'alternance contrôlée) :
**20 perdus, 45 %**, médiane des réponses livrées 3,5 s, p90 9,0 s, **221 s
passées à attendre des réponses mortes**. Le banc relevait 30-38 % sur le
backend NEWGEN : **NextStep n'est pas meilleur, il est au moins aussi
touché.** C'est l'indice qui manquait au bloc AG-003 (« rien ne prouve que le
déploiement NextStep se comporte pareil ») — un indice, pas une mesure
appariée.

**La file d'attente : un seul indice, pas une preuve** (amendé par AG-005).
⚠️ `t0` est pris **dans** `_gasUnAppelBrut` (`shared.js:623`), donc **après**
la sortie de file : `fin - durée` donne le départ du `fetch`, pas le moment où
l'appelant a demandé l'appel. **Le temps passé en file n'est journalisé nulle
part** — les 221 s d'attente sont un minimum, pas le total subi. Le meilleur
indice reste le `getAll` de 12:19:31 : rien ne le relance après un `saveEntry`
raté (`shared.js:1574-1581`), il vient de la synchro de fond, et il démarre
pile à la fin de `saveEntry#2`. Les autres enchaînements s'expliquent sans la
file (boucle de reprise de `gasAppel`, `logLogin` après succès).
Reconstruction du journal : Le timestamp de `logGas`
(`shared.js:580`) est l'heure de **fin** ; en reconstruisant `fin - durée`,
chaque appel démarre pile quand le précédent s'arrête. Connexion de 20:27 :
getComptes#1 (12 s mort) -> checkPassword#1 (404 à 9,8 s) -> checkPassword#2
(12 s mort) -> checkPassword#3 (passé) -> logLogin#1 (12 s mort) -> logLogin#2.
**Plus d'une minute pour se connecter, en file indienne.** Séquence de
11:49:43 -> 11:51:23 : 100 s, dont 48 d'attente pure.

⚠️ **13 des 20 pertes sont *exposées* au doublage — exposées, pas sauvées.**
Un doublon ne rattrape une perte que s'il part hors de la panne. Si la panne
dure plus que l'écart de doublage (7 s), le jumeau meurt aussi. Combien sont
réellement sauvées : inconnu, ça dépend de la durée des pannes, justement ce
qu'on ne sait pas trancher. Vérifié dans
`ATELIERS_NEWGEN/shared.js:880-886` : `doubler = !ecriture &&
!GAS_SANS_DOUBLON.has(action)`.

| Doublées après portage | Jamais doublées, par conception |
|---|---|
| getAll 5, getComptes 3, getConfig 4, getVisibility 1 — **13** | saveEntry 3, checkPassword 2, setConfig 1, logLogin 1 — **7** |

**Nuance, corrigée le 22/09/2026 (AG-005) — la première version de cette note
disait « enregistrer un atelier ne sera pas plus rapide », c'était faux.**
L'écriture ne gagne pas le *doublage*, mais elle gagne le *retrait de la
file* : `_gasQueue` sérialise **tous** les appels, donc une écriture mise en
file derrière une lecture morte attend 12 s avant même de partir. Visible dans
le relevé : `getAll#1` de 12:19:31 démarre exactement quand `saveEntry#2`
s'achève. Gain non chiffré.

⚠️ **12:19 — un enregistrement a abandonné pour de bon** : `saveEntry #1` et
`#2` morts à 12 s chacun, les deux tentatives d'écriture épuisées, erreur
rendue à l'usager. Or un `saveEntry` dont la réponse est perdue **a quand même
écrit sa ligne** (documenté vérifié en prod le 18/09). L'atelier est donc très
probablement dans le classeur malgré l'échec affiché. **À vérifier, reformulé par AG-005** : l'`_id` est généré une seule fois avant
la boucle de reprise (`shared.js:1573`), donc #1 et #2 portent le même et
`actionSaveEntry` remplace — **pas de doublon d'`_id` possible**. Le vrai risque
c'est l'usager qui voit « ❌ » et **re-saisit** : nouveau formulaire, nouvel
`_id`. Chercher deux ateliers identiques (date, lieu, conseiller) avec deux
`_id` différents autour du 22/09 12:19.

⚠️ **Retiré le 22/09/2026 (AG-005)** : cette note affirmait d'abord que les
six créneaux d'échec « tuent tout ce qu'ils contiennent et rien en dehors ».
**Non soutenu** — le résumé ne donnait que les 20 échecs, pas les 24 réussites
avec leurs horodatages. Et la reconstruction fournit un contre-exemple : entre
`getComptes#1` (fin 11:38:17) et `getComptes#2` (départ 11:38:29), 12 s que
rien n'explique sinon un appel **réussi à l'intérieur du créneau**. La forme
« par fenêtres » vient du relevé NEWGEN du 18/09, elle a été plaquée ici.

⚠️ **Base de comparaison non commune** (AG-005) : les 45 % ci-dessus sont par
**appel, reprises comprises** — un appel qui meurt puis réussit au rejeu
compte une perte *et* une réussite. Les 18,4 %/4,0 % du banc sont par
**salve**, en alternance contrôlée. **Ne pas les mettre côte à côte pour
décider.** L'angle mort n° 1 d'AG-003 n'est donc pas refermé, seulement
entamé.

Les deux `Failed to fetch` de 11:40:56 (6,6 s puis 0,1 s) ne sont **pas** des
pertes GAS : coupure réseau côté poste, à ne pas compter avec le reste.

### ⚠️ 22/09/2026 au soir — le doublage sauve moins que prévu

Premier relevé NEWGEN avec le compteur de sauvetages : **8 doublons partis,
2 seulement ont sauvé la lecture (25 %)**, contre 42 % annoncés par le banc du
matin. ⚠️ **La raison que j'avais donnée est retirée (AG-006)** : j'avais écrit que
les deux fenêtres de panne duraient « 39 s et 50 s en continu ». Non soutenu —
le résumé ne donne que les échecs, et la première ligne du journal (11:36:53)
est une **réussite tombant en plein dans la fenêtre** que je déclarais morte.
La perte semble se décider **par appel**, pas par créneau. Pourquoi 6 doublons
sur 8 sont morts reste donc **inexpliqué**.

**AG-006 tranché le 22/09/2026 — deux sessions, même conclusion : le portage
n'est PAS remis en cause.**
- 25 % et 42 % n'avaient pas le même dénominateur (le banc comptait les
  doublons annulés, la production ne les journalisait pas). Corrigé côté
  NEWGEN.
- Le taux de sauvetage suit ≈ 1 − pertes ambiantes : 75 % de pertes donnent
  25 % de sauvetages sans que la stratégie ait changé.
- 2/8 ne contredit pas 42 % (Wilson 95 % = [7 % ; 59 %]).
- **La décision du portage repose sur le McNemar apparié (χ² = 10,32), pas sur
  le 42 %.** Ce relevé observe une seule stratégie, il ne peut rien trancher.

⚠️ **Ce qui était faux, c'est la promesse chiffrée, pas le portage.**
« 26 s -> 12 s en médiane » vaut **au régime du banc (30-38 % de pertes)**. À
75 %, aucune stratégie côté client ne tient 12 s — le levier est le proxy
(§2). Ne pas réannoncer ce chiffre à l'équipe sans le conditionner au régime.

✅ **Et ce relevé plaide POUR le retrait de `_gasQueue`** : plus le taux de
pertes monte, plus la file coûte cher, chaque appel mort bloquant les suivants
12 s. Mesure à suivre après portage : le **taux de connexions ressenties en
échec** (seuil 15 %, §2), pas le taux de sauvetage.

Détail complet : `CHANTIERS.md` de ATELIERS_NEWGEN.

### ✅ Doublage porté le 23/09/2026 — `_gasQueue` retirée

`gasLectureDoublee` portée de NEWGEN : une lecture muette au bout de
`GAS_HEDGE_MS` (7 s) est doublée, la première réponse gagne, l'autre est
annulée (journalisée « annulé », hors pertes). `checkPassword` et toutes les
écritures ne sont jamais doublés. Verrouillé par `reseau.test.js` (source)
et `e2e/appels.test.js` (navigateur : lecture muette sauvée en < 10 s par
`#1b`, écriture muette jamais doublée). Le résumé « Copier pour Claude »
compte désormais les doublons annulés et les lectures sauvées.

**À mesurer sur le terrain** : le **taux de connexions ressenties en échec**
(seuil 15 %, §2), pas le taux de sauvetage. Le gain 26 s → 12 s en médiane
reste une **inférence** (banc mesuré sur le backend NEWGEN, régime 30-38 %
de pertes) — ne pas l'annoncer à l'équipe sans ce conditionnement.

## ✅ 23/09/2026 — années multiples et vérification après réponse perdue

Livré côté appli (les deux projets), **GAS v10.21.0 déployé le 23/09/2026**.
**Validé sur le terrain le 23/09/2026** par l'utilisateur : nouveau cycle de
7 ateliers enregistré correctement, sans doublon (projet non précisé). Reste
à observer : un cas réel de réponse perdue affichant « confirmé dans le
classeur ».
- **Sélecteur d'années à cases à cocher** (`ChoixAnnees`, `shared.js`) :
  plusieurs années chargées en **un seul** `getAll?years=` (AG-007,
  `ATELIERS_NEWGEN/AGORA.md`). `f_annee` stocke « 2026,2027 », l'ancien
  format se relit tel quel. Roadmap et Admin prennent la plus récente
  (choix de design à valider par l'utilisateur).
- **Réponse d'enregistrement perdue** → l'appli demande `verifierIds` avant
  d'annoncer un échec (idée de l'utilisateur). Sans le GAS déployé :
  comportement d'avant (message « recliquez, sans doublon »).
- Tests : `e2e/appels.test.js` de NextStep (cas 8 et 9).
- **AG-007 tranché le 23/09/2026** (amendé par la session B, décision de
  l'utilisateur) : avertissement si le GAS en ligne ignore `years=` ;
  Roadmap/Admin sur l'année **en cours** si elle est cochée ; `keepAlive`
  réchauffe N+1 à partir de septembre (dans la version GAS à déployer).

## 🔴 23/09/2026 — cycle enregistré en double, et divergence entre les deux projets

**Incident** : cycle de 8 ateliers sur NextStep, réponse de `saveMany` perdue,
toast rouge, second clic → **16 lignes**. Chaque clic tirait de nouveaux
`_id`. **Corrigé côté appli, les deux projets** : `_id` gardés tant que
l'envoi n'a pas réussi, toast « recliquez, cela ne créera pas de doublon »
(test `e2e/appels.test.js` de NextStep, contre-preuve faite). Doublons
supprimés à la main par l'utilisateur.

**Divergence** : l'appli a continué d'afficher les doublons supprimés, parce
que NextStep n'avait **jamais reçu** l'`onEdit` ajouté à NEWGEN en v11.29. Et
`onEdit` ne voit de toute façon pas une suppression de lignes. **Déployé le
23/09/2026** : NextStep v10.19.0, NEWGEN v11.38. **Vérifié en ligne par
l'utilisateur le 23/09/2026** : `installerTriggerChangement` lancé dans les
deux projets, une ligne supprimée à la main disparaît de l'appli après un
Sync.

**Inventaire GAS du 23/09/2026** (fonctions présentes d'un seul côté) : hors
simples différences de nom, seuls `onEdit` et `invaliderCacheGetAll`
manquaient à NextStep. Restent propres à NEWGEN, sans équivalent NextStep :
`installerTrigger`/`verifierTrigger` (alerte retards), `backupGAS`,
`ajouterColonneAutre`. **Aucun garde-fou n'empêche la prochaine divergence** :
c'est la piste `gas-client.js` / test de parité (NextStep §6), à rouvrir.

## 🐞 23/09/2026 — « Ordinateurs prêtés » vidé au premier enregistrement : non reproduit

Signalé par l'utilisateur sur les deux projets (PC, nouvel atelier, champs
remplis dans l'ordre, nombre tapé au clavier, seul ce champ vidé). **Au
second essai du même jour, les deux projets enregistrent du premier coup**,
avec et sans dates de prêt. Non reproduit en navigateur automatisé non plus
(ordre exact de l'utilisateur, avec et sans dates). Cause inconnue.
**Hypothèse non vérifiée** : molette de la souris sur le champ numérique
encore actif (Chrome modifie alors la valeur). À rouvrir si ça revient :
demander si le champ affiche vide ou « 0 ».

## ⚠️ Origine commune — les deux applis partagent leur `localStorage`

Découvert le 21/09/2026. GitHub Pages sert les deux projets depuis la **même
origine** (`maswaddpt47-cmyk.github.io`), et `localStorage` est cloisonné par
origine, **pas par chemin**. Les deux applis utilisaient les mêmes clés.

**Ce que ça invalide** : toutes les mesures de journal antérieures au
21/09/2026 mélangent les deux projets. Le §1 attend « une mesure NextStep
fiable » — on sait maintenant qu'aucune ne pouvait l'être, et que la pastille
NEXTSTEP/NEWGEN ajoutée le 19/09 ne pouvait pas le révéler : elle nomme
l'appli qui **affiche** la liste, pas celle qui a **émis** l'appel. C'est
l'explication de l'attribution contestée des captures du 19/09.

**Corrigé** : le journal est cloisonné (`adm_logs_nextstep` /
`adm_logs_newgen`). Les lignes écrites sous l'ancienne clé `adm_logs` ne sont
pas reprises — elles mélangent les deux projets, elles ne sont pas
exploitables. Elles restent dans le navigateur tant qu'on ne vide pas les
données du site.

**Reste à faire** : les préférences sont toujours partagées —
`adm_conseiller`, `adm_dark`, `adm_sidebar_pinned`, `f_annee`, `cal_moisDeb`,
`cal_moisFin`, `sidebar_pinned`. Se connecter sur une appli change donc le
conseiller sélectionné ou le thème de l'autre. Jamais signalé comme un bug à
ce jour, mais c'est la même cause. Correction : préfixer ces clés comme pour
le journal, en migrant l'existant pour ne pas réinitialiser les préférences
des conseillers.

## 2. Chantier conditionnel — proxy pour supprimer la perte

**Recoupement client/serveur du 22/09/2026, 13h46-13h52** — le premier sur
NextStep depuis le 16/09, et le premier avec un journal cloisonné, donc
attribuable sans doute possible.

| Journal client | Exécution Apps Script |
|---|---|
| 13:51:44 `getAll #1` — bloqué à 13,0 s | 13:51:45 `doGet` — **0,577 s**, Terminée |
| 13:51:58 `getAll #2` — bloqué à 13,0 s | 13:51:59 `doGet` — **0,567 s**, Terminée |
| 13:52:28 `getAll #1` — bloqué à 12,8 s | 13:52:29 `doGet` — **0,797 s**, Terminée |

Les 18 exécutions du créneau aboutissent toutes en moins de 3 s. **Le script
fait son travail, la réponse ne parvient jamais au navigateur.** Relevé
d'ensemble : 13 pertes sur 33 appels (39 %), 161 s d'attente sur des réponses
mortes, 55 % de pertes sur la tranche de 13h.

Ce créneau élimine trois causes envisagées sur le moment, à ne pas réexaminer
sans élément nouveau :
- **une édition manuelle du classeur** faite juste avant (un recalcul ou une
  contention allongerait l'exécution, or elle reste sous 3 s) ;
- **le quota Apps Script**, que le banc consommait au même moment sur l'autre
  backend — un quota épuisé ferait échouer les exécutions, elles aboutissent
  toutes ;
- **le changement de conseiller dans Historique**, qui n'émet aucun appel
  réseau (aucun `useEffect` ne dépend de `adminConseiller`).

C'est l'argument le plus net dont on dispose pour le proxy : rien côté client
ni côté script ne peut récupérer une réponse perdue après exécution.

**Mais l'urgence est retombée le 22/09** : la série du banc donne 30-38 % de
pertes par appel — dans la fourchette qui justifiait le proxy — et seulement
**4 % d'échecs ressentis** une fois les lectures doublées, sous le seuil des
15 % en dessous duquel il n'y a rien à construire. Le doublage d'abord (§1),
le proxy ensuite et sans urgence : ce qui resterait à gagner, c'est la
latence, pas la fiabilité.


Si la mesure confirme un taux de pertes élevé des deux côtés, la couche de
reprise a atteint sa limite et le sujet devient : appeler GAS **côté serveur**
pour que la redirection `/exec → googleusercontent` soit suivie depuis un
datacenter plutôt que depuis un mobile.

Bloqué par la même question que sur NEWGEN : hébergement PHP/HTTPS
disponible ? Aucune trace dans les repos (recherche du 20/09/2026), les dépôts
sont publics et sur GitHub Pages. Alternative : Cloudflare Workers, avec la
réserve RGPD d'un sous-traitant américain supplémentaire.

## 3. ⚠️ Sécurité — endpoints accessibles sans token

Même situation que sur NEWGEN, à vérifier ici dans `gas/GAS_NEXTSTEP.js` :
`getAll`, `getComptes` et `getConfig` accessibles sans token, avec l'URL
`/exec` en clair dans `shared.js` d'un dépôt public. Chantier séparé,
impliquant un redéploiement GAS manuel.

## 4. ⚠️ PWA — le rechargement forcé n'existe plus, et le HTML n'est pas versionné

**Non vérifié à ce jour.** Depuis le 19/09/2026 les deux pages sont
installables. En mode installé (`display: standalone`) il n'y a plus de barre
d'adresse, donc **plus de Ctrl+F5**. Or le `?v=N` protège les scripts et les
styles, **pas `index.html` lui-même** : un HTML resté en cache continue de
référencer les anciennes versions, sans recours simple pour l'utilisateur.

Toutes les vérifications de déploiement faites jusqu'ici reposaient sur
« les `?v=` s'en chargent » — vrai en navigateur, plus forcément en PWA
installée.

La mesure a été tentée le 20/09/2026 depuis l'environnement de session, mais
le proxy réseau y refuse `maswaddpt47-cmyk.github.io` (403 sur CONNECT). À
faire depuis un poste ayant accès :

```bash
curl -sS -I https://maswaddpt47-cmyk.github.io/ateliers-cd47_NextStep/index.html | grep -i cache-control
```

Un `max-age` de quelques minutes et le problème se résorbe seul ; un `max-age`
long demande une stratégie **avant** que l'équipe n'installe massivement.
Sortie de secours en attendant : désinstaller/réinstaller, ou vider les
données du site. Après un déploiement important, s'assurer qu'au moins une
personne en mode PWA reçoit le correctif sans manipulation.

## 5. Côté Google Apps Script — déploiement manuel requis

Aucun n'est bloquant, tous supposent un accès à l'éditeur Apps Script.

- **Fuite de tokens `PropertiesService`** — *ce n'est pas de la performance,
  c'est une panne annoncée.* `_generateToken` écrit `token_<uuid>` sans purge
  globale ; la suppression n'a lieu que si un token expiré est rejoué. Au
  plafond de 500 Ko, `setProperty` lève une exception et **plus personne ne
  peut se connecter**. Vérification en une ligne dans l'éditeur :
  ```js
  Logger.log(Object.keys(PropertiesService.getScriptProperties().getProperties()).length)
  ```
  Au-delà de ~2000, prévoir une purge + déclencheur quotidien.
- **`actionSaveMany` en un seul passage.** Aujourd'hui N × (lecture des
  en-têtes + `getLastRow` + `appendRow` + log + purge de cache). Lourd sur une
  saisie en lot de 8-10 séances, et aucun correctif frontend ne l'atteint.

## 6. Portages restants entre les deux projets

**NEWGEN → NextStep** : `xlsx` chargé au clic (`chargerScriptUneFois`) plutôt
que bloquant dans le `<head>` ; `sandbox.test.js`.

**NextStep → NEWGEN** : ne rien lancer de lourd avant la connexion (NEWGEN
émet encore `getComptes` + `getAll(force:true)` au montage) ; premier
chargement sans `force:true`.

⚠️ **Vu sur NEWGEN le 21/09/2026** : là-bas, la logique du stock matériel
est dupliquée entre `logic.js` (testé) et `shared.js` (servi aux pages).
NextStep n'a pas ce défaut — `shared.js` consomme `logic.js` — mais c'est
l'illustration concrète du risque que la piste ci-dessous vise à supprimer.

**Piste de fond** : extraire la couche d'appel GAS dans un `gas-client.js`
copié à l'identique dans les deux dépôts, avec un test qui échoue si les
copies divergent. La divergence s'est déjà payée deux fois le 18/09/2026 — un
correctif réinventé d'un côté, une erreur déjà apprise réintroduite de
l'autre. Pas de build, pas de package.

## 7. Autres vérifications terrain PWA en attente (19/09/2026)

En complément du §4 (cache HTML) — deux points encore jamais vérifiés en
dehors des tests automatisés, qui ne peuvent pas les couvrir :

- **Installabilité** : confirmer sur un Android réel que "Installer
  l'application" apparaît bien pour `index.html` et `admin.html`, pas
  seulement "Créer un raccourci".
- **Lisibilité des couleurs de la Frise du parc** : les barres de
  `FriseMateriel` (`shared.js`) sont colorées par conum depuis le 19/09 —
  pas de vérification visuelle du contraste texte/fond pour chaque
  conseiller existant.

---

## ⚖️ AG-008 tranché le 23/09/2026 — mon mécanisme ne tenait pas, le gaspillage si

J'avais contesté l'amendement 2 d'AG-007 (`keepAlive` prépare N+1 dès
septembre) au motif qu'il double le travail d'une fonction qu'AG-004 sait
arrêtée par la plateforme à 8 min. **Réfuté, et vérifié par moi-même :**
`keepAlive` v10.11.3 — celui qui tournait pendant les trois incidents —
relisait la feuille à **chaque** passage sans jamais sauter (`git show
a942c75`, l. 1038-1046) : 288 lectures/jour. Aujourd'hui, déclencheur 300 s
contre TTL 600 s (`gas/GAS_NEXTSTEP.js:305`), une passe sur deux relit et
N + N+1 expirent ensemble : 144 × 2 = **288. Le même chiffre.** Et depuis
AG-004, `keepAlive` ne prend plus le verrou : un passage bloqué coûte un cache
froid, **plus aucune écriture refusée**.

**Ce qui restait vrai, corrigé en v10.22.0 (NON DÉPLOYÉ)** : N+1 était
préparée tout le temps dès septembre, **même si personne ne la cochait**. Elle
ne l'est plus que si un `getAll?years=` l'a demandée dans les 6 h (drapeau
`CacheService`). Pire défaillance : un poste paie une lecture froide — le
comportement d'avant v10.20.0. Jamais pire.

**Bloc sorti d'`AGORA.md`** : il n'y avait plus rien à trancher — proposition
réfutée, amendement implémenté, et ce qui reste est une **mesure**, pas une
décision. Le verdict allant contre son auteur, le fermer n'était pas un
conflit d'intérêts.

**30 secondes pour avancer** : un `keepAlive` du 23/09 après-midi dans les
Exécutions journalise déjà la durée de chaque préparation
(`gas/GAS_NEXTSTEP.js:1284`). Un nouveau mail « Summary of failures » après le
23/09 serait l'indice attendu.

⚠️ **Piste écartée** : « les grosses réponses se perdent davantage ». Aucun
gradient au 22/09 — `getAll` (~110 Ko) 42 %, `getConfig` 67 %, `logLogin` 33 %.

## 🔒 AG-002 tranché le 23/09/2026 — la journée entière reste la règle sur un prêt multi-jours

**Décision de l'utilisateur : laisser tel quel**, aucune fausse alerte
constatée sur le terrain.

**Comportement à ne pas « corriger » sans raison** (`logic.js` et `shared.js`,
`occupeCreneauMateriel`) :
- prêt d'**un seul jour** → seule la demi-journée de l'atelier est réservée
  (Cynthia le matin et Eva l'après-midi ne se gênent pas) ;
- prêt sur **plusieurs jours** → journées entières, du prélèvement à la veille
  du retour (le retour se fait le matin, il ne réserve rien).

**La raison est une donnée qui n'existe pas, pas un choix de design.**
`date_prelevement_materiel` et `date_retour_materiel` sont des **dates sans
heure** ; le champ `ampm` appartient à l'atelier, pas au prélèvement. Sur un
prêt multi-jours, **rien dans la saisie ne dit si le matériel part le matin ou
l'après-midi**. Affiner supposerait d'ajouter deux champs au formulaire, pour
toute l'équipe — chantier réel, non justifié à ce jour.

**Le sens du compromis est volontaire** : on sur-réserve plutôt que de
sous-réserver. Une alerte de trop coûte une vérification ; une alerte
manquante coûte un conseiller qui arrive sans matériel.

**Quand rouvrir** : si une alerte de conflit se déclenche sur un créneau où le
matériel était en réalité libre. Pas avant.

## Points à ne pas défaire

- **`keepAlive` ne prend jamais le verrou de script** (AG-004, 22/09/2026).
  La plateforme peut le bloquer 8 min (mails des 19-20/09). S'il tenait le
  verrou, les écritures seraient refusées pendant tout ce temps. Le drapeau
  `CacheService` qui le remplace n'est pas atomique, et c'est voulu : au pire,
  deux lectures en double.
- ⚠️ **Hypothèse non vérifiée, antérieure à AG-004** : une lecture complète
  (`keepAlive` ou `getAll` sur cache froid) qui se termine juste après une
  écriture remet en cache des données d'avant l'écriture, pour 10 min au
  plus. Le verrou de `keepAlive` ne fermait ce cas qu'en partie : `doGet`
  n'en a jamais pris pour lire. À surveiller si un atelier enregistré
  « disparaît » puis revient.

- **Les lectures sont doublées, pas sérialisées** (tranché le 22/09/2026,
  mesure de 249 salves, McNemar χ² = 10,32). La file d'attente laissait 18 %
  des connexions échouer et 10 % dépasser 60 s ; le doublage tombe à 4 % et
  aucune. Le parallélisme coûte bien 7,5 points de pertes supplémentaires —
  l'hypothèse de NextStep n'était pas fausse — mais le doublon en rattrape
  42 %, ce qui l'efface largement. Ne pas revenir à la sérialisation sans une
  mesure au moins équivalente.
- **Les pertes ne dépendent pas de l'heure.** Sur une journée complète et un
  journal cloisonné, elles sont réparties de 07h à 17h sans pic de midi.
  L'idée que l'infrastructure Apps Script saturerait aux heures ouvrées, née
  d'un relevé partiel le 21/09, est **réfutée** — ne pas la réintroduire.

- **Plafonds : 12 s lecture, 12 s écriture, 25 s `saveMany`.** Les rallonger
  ne récupère aucune réponse perdue. Le pire cas de ce projet a atteint ~146 s
  en passant un plafond de 35 s à 4 tentatives. Verrouillé par
  `reseau.test.js`.
- **Aucun appel GAS superflu au démarrage ni après une écriture.** Verrouillé
  par `e2e/appels.test.js`.
- **Les écritures ne sont jamais doublées** (deux `appendRow` concurrents =
  atelier en double). Leur sérialisation est assurée côté serveur par le
  verrou GAS, plus par le client (file retirée le 23/09/2026).
- **`sw.js` ne met rien en cache et n'intercepte rien.** Voir la section PWA
  du `CLAUDE.md`.
- **Pas de `getConfig` sur index** : le drapeau maintenance voyage dans
  `getAll`. `e2e/appels.test.js` verrouille les deux faces — l'appel supprimé,
  et l'écran de maintenance qui s'affiche toujours.
- **Synchro de fond suspendue** quand l'onglet est caché ou qu'une erreur est
  déjà affichée : relancer dans une fenêtre de panne n'ajoute que des appels
  morts.
