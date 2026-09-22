# Chantiers en cours — Ateliers CD47 NextStep

État au **21/09/2026**, commit de référence `368a041`.
Fichier transitoire : à mettre à jour à chaque avancée, à supprimer quand tout
est soldé. Ce n'est pas de la documentation permanente (cf.
`MD-LIB/hygiene-instructions.md`).

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

### 🔴 À FAIRE EN PREMIER — déployer le verrou GAS (préparé le 22/09/2026)

Le code est **écrit et poussé, pas déployé** : Apps Script n'a pas d'API de
push, le déploiement est manuel. `actionSaveEntry`, `actionSaveMany` et
`actionDelete` des deux copies sont enveloppés dans
`LockService.getScriptLock().waitLock(20 s)` / `releaseLock()` en `finally`
(`_avecVerrouEcriture`). Marche à suivre pas à pas : **`gas/README.md`**,
section « EN ATTENTE DE DÉPLOIEMENT ».

Un bandeau ⚠️ en tête de chaque copie GAS signale la divergence avec la
production. **Le retirer seulement quand l'utilisateur confirme « déployé ».**

⚖️ Le verrou lui-même fait l'objet d'**AG-004** (contention avec `keepAlive`,
délai de 20 s) — ouvert pour surveillance, pas bloquant.

### Relevé NextStep du 22/09/2026 — l'angle mort n° 1 d'AG-003 se referme

44 appels, 11:31 -> 20:27, usage réel (pas d'alternance contrôlée) :
**20 perdus, 45 %**, médiane des réponses livrées 3,5 s, p90 9,0 s, **221 s
passées à attendre des réponses mortes**. Le banc relevait 30-38 % sur le
backend NEWGEN : **NextStep n'est pas meilleur, il est au moins aussi
touché.** C'est l'indice qui manquait au bloc AG-003 (« rien ne prouve que le
déploiement NextStep se comporte pareil ») — un indice, pas une mesure
appariée.

**La file d'attente est visible dans le journal.** Le timestamp de `logGas`
(`shared.js:580`) est l'heure de **fin** ; en reconstruisant `fin - durée`,
chaque appel démarre pile quand le précédent s'arrête. Connexion de 20:27 :
getComptes#1 (12 s mort) -> checkPassword#1 (404 à 9,8 s) -> checkPassword#2
(12 s mort) -> checkPassword#3 (passé) -> logLogin#1 (12 s mort) -> logLogin#2.
**Plus d'une minute pour se connecter, en file indienne.** Séquence de
11:49:43 -> 11:51:23 : 100 s, dont 48 d'attente pure.

⚠️ **Le portage ne touchera que 13 des 20 pertes.** Vérifié dans
`ATELIERS_NEWGEN/shared.js:880-886` : `doubler = !ecriture &&
!GAS_SANS_DOUBLON.has(action)`.

| Doublées après portage | Jamais doublées, par conception |
|---|---|
| getAll 5, getComptes 3, getConfig 4, getVisibility 1 — **13** | saveEntry 3, checkPassword 2, setConfig 1, logLogin 1 — **7** |

**Conséquence à annoncer avant le portage, pas après : enregistrer un atelier
ne sera pas plus rapide.** Le gain porte sur l'ouverture et la navigation. Le
second gain vient du retrait de la file (les appels courent en parallèle au
lieu de s'enfiler), pas du doublage.

⚠️ **12:19 — un enregistrement a abandonné pour de bon** : `saveEntry #1` et
`#2` morts à 12 s chacun, les deux tentatives d'écriture épuisées, erreur
rendue à l'usager. Or un `saveEntry` dont la réponse est perdue **a quand même
écrit sa ligne** (documenté vérifié en prod le 18/09). L'atelier est donc très
probablement dans le classeur malgré l'échec affiché. **À vérifier : atelier
en double ou re-saisi autour du 22/09 12:19 ?**

Deux détails : les six fenêtres de panne (11:31, 11:38, 11:40, 11:49, 12:18,
20:27) tuent **tout** ce qu'elles contiennent et rien en dehors — la panne
frappe par créneau, pas par appel, comme sur NEWGEN. Et les deux
`Failed to fetch` de 11:40:56 (6,6 s puis 0,1 s) ne sont **pas** des pertes
GAS : coupure réseau côté poste, à ne pas compter avec le reste.

### Puis seulement : porter le doublage

**Ne pas porter tant que le déploiement du verrou n'est pas confirmé en
ligne.** Ensuite : porter `gasLectureDoublee` sur NextStep, retirer
`_gasQueue`, mettre à jour `reseau.test.js` dans le même commit.

⚠️ **Le verrou n'accélère rien** — c'est de la sécurité des données. Le gain de
latence attendu (26 s → 12 s en médiane) vient du portage, et reste une
**inférence** : le banc a mesuré le backend NEWGEN, pas celui de NextStep. À
confirmer sur le terrain après le portage.

⚠️ **Incompatibilité à ne pas oublier au moment du portage** : on ne peut pas
porter le doublage sans retirer la file. Un doublon mis en file derrière son
propre jumeau ne partirait qu'après l'abandon de celui-ci — le mécanisme
serait inopérant.

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

## Points à ne pas défaire

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
- **Les écritures restent séquentielles et jamais doublées** (deux `appendRow`
  concurrents = atelier en double).
- **`sw.js` ne met rien en cache et n'intercepte rien.** Voir la section PWA
  du `CLAUDE.md`.
- **Pas de `getConfig` sur index** : le drapeau maintenance voyage dans
  `getAll`. `e2e/appels.test.js` verrouille les deux faces — l'appel supprimé,
  et l'écran de maintenance qui s'affiche toujours.
- **Synchro de fond suspendue** quand l'onglet est caché ou qu'une erreur est
  déjà affichée : relancer dans une fenêtre de panne n'ajoute que des appels
  morts.
