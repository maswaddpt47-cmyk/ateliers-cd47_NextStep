# Chantiers en cours — Ateliers CD47 NextStep

État au **20/09/2026**, commit de référence `c45e7f8`.
Fichier transitoire : à mettre à jour à chaque avancée, à supprimer quand tout
est soldé. Ce n'est pas de la documentation permanente (cf.
`MD-LIB/hygiene-instructions.md`).

---

## 1. Décision à trancher — la file d'attente sert-elle à quelque chose ?

`gasUnAppel` sérialise tous les appels GAS (`_gasQueue`, `shared.js`), sur une
hypothèse que le code lui-même déclare **non vérifiée** : que le nombre
d'appels simultanés ferait rater la redirection. Le commentaire prévoyait de
trancher avec le Journal des opérations — **ça n'a jamais été fait**.

| | NextStep | ATELIERS_NEWGEN |
|---|---|---|
| Stratégie | **file d'attente**, un appel en vol à la fois | lectures **doublées** à partir de 7 s |
| Statut | hypothèse non vérifiée | efficacité constatée (3 sauvetages le 18/09) |
| Mesure | **une seule, d'attribution incertaine** (ci-dessous) | 54 % de pertes le 19/09 |

**Relevé du 19/09/2026 (journal Admin, mobile, 11 appels)** — va dans le même
sens, mais ⚠️ **son attribution est incertaine** : la capture est antérieure à
la pastille NEXTSTEP / NEWGEN, l'URL y était tronquée et les deux applis
affichent 221 ateliers. À refaire proprement avant d'en tirer une conclusion.

| Heure | Appel | Résultat |
|---|---|---|
| 09:29:58 | `getAll #1` | ok 2,8 s |
| 09:30:10 | `getComptes #1` | **bloqué, abandonné à 12 s** |
| 09:30:12 | `checkPassword #1` | ok 1,9 s |
| 09:30:17 | `getComptes #2` | ok 5,3 s |
| 09:30:23 | `logLogin #1` | HTTP 404 en 6,3 s |
| 09:30:26 | `logLogin #2` | ok 1,7 s |

Deux enseignements : le plafond de 12 s est **prouvé en production**
(« abandonné après 12s » — avant, cette ligne aurait dit 35 s), les deux ratés
ont été rattrapés par les reprises **sans aucune erreur à l'écran**, et
surtout `getComptes #1` a échoué **alors qu'il était seul en vol** — la file
sérialisait, `getAll` était terminé depuis 12 s. Aucune rafale.

**Ce qui affaiblit l'hypothèse**, relevé sur NEWGEN le 18/09 à 22:10 : les
trois appels d'ouverture meurent dans la même seconde, puis leurs trois
doublons — tout aussi parallèles — réussissent dans la même seconde, en 6,5 s
chacun. Même degré de parallélisme, résultat opposé : la panne frappe par
fenêtres de temps, pas par nombre d'appels.

**Ce que la file coûte si l'hypothèse est fausse** : en fenêtre de panne, les
temps morts s'additionnent au lieu de se superposer (12 s puis 12 s, au lieu
de 12 s en parallèle). Le commentaire du code affirme « sérialiser n'allonge
rien ici » — vrai quand tout va bien, faux précisément quand ça va mal.

**Comment trancher.** Console (F12) sur l'Admin de chaque site, après quelques
jours d'usage. Le Journal porte désormais une pastille NEXTSTEP / NEWGEN : les
deux applis sont visuellement identiques et des mesures ont déjà été
attribuées au mauvais projet le 19/09.

```js
(() => {
  const L = JSON.parse(localStorage.getItem('adm_logs')||'[]').map(e=>e.msg).filter(m=>m&&m.startsWith('GAS '));
  const ko = L.filter(m=>/404|bloqué|réseau/.test(m)).length;
  const ok = L.filter(m=>/— ok en/.test(m)).map(m=>parseFloat(m.match(/ok en ([\d.]+)/)[1])).sort((a,b)=>a-b);
  console.log(`${location.pathname} | appels ${L.length} | échecs ${ko} (${Math.round(ko/L.length*100)}%) | médiane ${ok[Math.floor(ok.length/2)]}s`);
})()
```

⚠️ **Incompatibilité à connaître** : on ne peut pas porter le doublage de
NEWGEN sans retirer la file. Un doublon mis en file derrière son propre jumeau
ne partirait qu'après l'abandon de celui-ci — le mécanisme serait inopérant.

## 2. Chantier conditionnel — proxy pour supprimer la perte

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
- **`keepAlive` toutes les 5 min** au lieu d'horaire : le cache `getAll` vit
  600 s mais n'est réchauffé qu'une fois par heure, donc le premier accès de
  chaque matinée est froid par construction.

## 6. Portages restants entre les deux projets

**NEWGEN → NextStep** : `xlsx` chargé au clic (`chargerScriptUneFois`) plutôt
que bloquant dans le `<head>` ; `sandbox.test.js`.

**NextStep → NEWGEN** : ne rien lancer de lourd avant la connexion (NEWGEN
émet encore `getComptes` + `getAll(force:true)` au montage) ; premier
chargement sans `force:true`.

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
