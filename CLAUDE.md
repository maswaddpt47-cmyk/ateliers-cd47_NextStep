# Règles de travail — Ateliers CD47 NextStep

> **Travaux en cours, décisions en attente et mesures à faire :
> [`CHANTIERS.md`](CHANTIERS.md).** À lire en début de session — une session
> ne transmet rien à la suivante, seul ce qui est commité survit. À
> réactualiser **à chaque avancée**, pas en fin de session : une session peut
> s'interrompre sans préavis.
>
> Avant d'ajouter une règle ici, lire `MD-LIB/hygiene-instructions.md` : une
> contrainte formulable en test doit devenir un test, pas un paragraphe de
> plus. Un fichier d'instructions qui grossit est moins bien appliqué, pas
> mieux.

## Règles de collaboration avec Claude

Extrait du guide de collaboration multi-projets, adapté pour ce dépôt.

### Côté Claude — priorité haute

1. Ne jamais présenter une explication technique plausible comme un fait : marquer explicitement "hypothèse non vérifiée" dans le code, les commits et les messages, tant qu'aucune preuve (log, capture, test réel) ne la confirme.
2. Ne jamais déclarer "c'est réparé", "c'est en ligne" ou "testé" sans vérification réelle du chemin critique (déploiement GitHub Actions, rendu navigateur, test exécuté) — pas une lecture de code qui "devrait marcher".
3. Sur toute demande d'audit ou de correction d'un bug de calcul/latence, livrer un audit systématique (tous les points d'impact) avant la première correction, pas des trouvailles ponctuelles au fil des questions.
4. Signaler explicitement toute déviation d'une spec fournie ou toute décision de design prise seul, au moment où elle est prise — jamais en note après coup.
5. Poser une question de clarification dès qu'une demande est réellement ambiguë ou sous-spécifiée (contenu non précisé, "adapte" vs "applique", référence visuelle absente) plutôt que de trancher en silence ou produire un placeholder.
6. Sur tout appel Bash touchant un repo précis en contexte multi-repo, utiliser `cd /chemin/complet &&` systématiquement ; vérifier `git status`/`git log` et la cohérence CLAUDE.md vs instructions de session avant d'agir, pas après.
7. Toujours faire un `git pull origin main` avant de lire ou modifier le moindre fichier, même si le repo semble à jour — l'oubli est une cause récurrente d'écrasement de travail. Respecter la politique de push définie ci-dessous (push direct sur `main`, sauf instruction de session explicite contraire) et signaler tout conflit entre les deux avant d'agir, pas après.
8. Après toute reprise de session ou résumé de contexte, relire l'état réel du fichier concerné avant de le modifier ou de le renvoyer — ne jamais présumer qu'un correctif précédent est encore en place.
8bis. Utiliser des dates explicites (JJ/MM ou JJ/MM/AAAA) plutôt que des termes relatifs ("hier", "aujourd'hui", "la semaine dernière", "demain") : la perception du temps de Claude vient d'un contexte injecté en début de session, pas d'une horloge en temps réel — elle devient peu fiable sur une session qui s'étale sur plusieurs jours ou plusieurs reprises.
9. Avant de pousser un changement visuel (CSS/layout), vérifier mentalement les interactions connues à risque (stacking context, overflow, position sticky/fixed) sur les zones sensibles existantes.
10. Sur tout problème réseau/GAS qui dure plus de 3 itérations : demander une capture Network DevTools ou les Exécutions GAS avant de continuer à supposer.
11. Vérifier l'état exact du déploiement GAS (version + URL active dans `shared.js` → `GS_URL`) en début de session dès qu'un bug réseau est signalé.

14. **Doser les tests à leur valeur, pas à la prudence.** La suite Playwright coûte du temps et des jetons à chaque lancement : la lancer une seule fois, juste avant le commit, jamais à chaque étape intermédiaire. Les suites Node (`utils`, `logic`, `contract`, `reseau`), elles, tournent en quelques secondes — les lancer librement. Écrire un ou deux tests ciblés par correctif, pas quatre à six ; réserver la contre-preuve — celle qui rejoue l'implémentation fautive — aux pièges réellement subtils, ceux qu'on remettrait sans s'en apercevoir.
15. **Les tests ne trouvent pas les défauts de sens.** Ils vérifient des calculs et des états, pas ce qu'un écran est censé signifier : un affichage peut calculer juste et raconter faux. Un test écrit après coup empêche la régression, il ne découvre rien. Ne jamais présenter une suite verte comme une garantie que l'affichage est correct, ni s'en servir pour décharger l'utilisateur du contrôle visuel.
16. **Un harnais de vérification qui échoue est du gaspillage, pas de la prudence.** Avant de conclure à une anomalie, éliminer d'abord l'instrument : générateur de données mal distribué, page non chargée, mauvaise sélection. Réutiliser un harnais qui a déjà fonctionné plutôt que le réécrire à chaque fois.

17. **Le rendu se vérifie à ton œil, pas par un test.** Un changement de rendu pur (couleur, libellé, position, CSS, mise en page) ne justifie ni test ni capture : dire quoi regarder et laisser l'utilisateur confirmer coûte moins cher et voit mieux. La ligne de partage est **rendu / calcul**, pas visible / invisible — un calcul, un filtre ou un format de données garde son test ciblé, parce que l'œil ne contrôle que le cas affiché ce jour-là : une régression sur une combinaison de valeurs rare passera inaperçue. Playwright ne se lance que si le changement touche ce qu'il couvre vraiment (démarrage, appels GAS, chemin d'écriture, `sw.js`) ; pour le reste la CI au push suffit, comme le dit déjà la section Tests. Capture avant/après à la demande, pas par défaut.

**Bonnes pratiques à maintenir**

12. Continuer à demander l'avis avant toute action à fort impact (déploiement, architecture, migration de données) et exécuter vite dès validation courte reçue.
13. Continuer à privilégier la preuve concrète (logs, captures, Network DevTools, console) sur la déduction théorique pour tout diagnostic.

### Côté utilisateur — priorité haute

1. Donner le contexte temporel et les tentatives déjà faites dès le premier message ("ça marchait hier", "j'ai déjà testé X", "je pensais avoir réglé ça avec Y") plutôt qu'après coup.
2. Pour un bug visuel, "bizarre" ou réseau, ajouter une ligne de description du symptôme précis, une capture annotée ou le Network DevTools plutôt qu'une formule vague.
3. Signaler explicitement en début de message tout changement d'état fait hors session (redéploiement GAS, changement d'URL, config, branche renommée, settings modifiés).
4. Pour les demandes ouvertes ("plus", "mieux", "améliore"), préciser le critère de succès attendu (différent de l'existant / même chose mais plus visible).
5. Donner un retour de validation réelle après test terrain, même court ("testé, ça marche" / "ça casse en fait") — sans ce signal, Claude ne peut recouper ses inférences.
6. Quand on revient en arrière, préciser ce qui est conservé vs jeté — "on revient à hier" sans liste efface du travail potentiellement utile.

**Bonnes pratiques à maintenir**

7. Continuer à valider court et vite sur le travail bien cadré ("ok", "la totale") — ça marche bien tant que la portée est claire.
8. Continuer à recadrer immédiatement dès qu'une mauvaise direction est repérée — c'est efficace et limite les dégâts.

## Routine RGPD & sécurité des accès/données

Source canonique : `MD-LIB/rgpd-securite.md`. À vérifier en début de session
(dès qu'un fichier touchant à des données utilisateurs, accès, identifiants
ou config d'hébergement est lu/modifié) et avant de considérer un chantier
terminé (formulaire, export, nouvel appel API, stockage, authentification).

Checklist condensée :
- **RGPD** : minimisation des champs collectés, base légale de la collecte,
  durée de conservation/purge, droits des personnes (accès/rectification/
  suppression), sous-traitants et hébergement (GAS, CDN — hors UE ?), données
  sensibles, traçabilité des traitements.
- **Sécurité** : pas de secret/clé/token en clair dans le code ou poussé sur
  le repo, action sensible protégée par authentification réelle, échanges en
  HTTPS, pas de donnée sensible en localStorage/cookies sans nécessité, libs/
  CDN externes vérifiées, permissions par défaut minimales, logs sans données
  personnelles en clair.

Signaler tout point non garanti explicitement dans la réponse (`⚠️ RGPD/
sécurité : ...`), même sans qu'on le demande — immédiatement si critique
(secret exposé, donnée sensible non protégée), sinon en une ligne courte.

**Audit trimestriel :** en complément, un audit de sécurité approfondi
(`/security-review` sur `main` + checklist RGPD/sécurité complète sur tout
le repo) est prévu tous les trois mois. C'est une routine planifiée
(`create_trigger`, mode session neuve à chaque déclenchement — indépendante
de toute session de travail), avec notification push/email. Voir
`MD-LIB/rgpd-securite.md` pour le détail.

## Branche de travail

Toujours committer et pousser directement sur `main`. Ne pas créer de branche intermédiaire.

## Avant toute intervention sur les fichiers

1. **Git pull** : toujours faire `git pull origin main` avant de lire ou modifier un fichier
2. **Commits séparés** : un commit par modification logique, avec préfixe :
   - `feat:` nouvelle fonctionnalité
   - `fix:` correction de bug
   - `refactor:` restructuration sans changement de comportement
3. **Cache-busting obligatoire** : `index.html` et `admin.html` chargent
   `app.css`/`admin.css`, `utils.js`, `logic.js`, `shared.js`, `app.js`/
   `admin_app.js`(/`admin_config.js`) avec un paramètre `?v=N`. À chaque
   commit qui modifie le **contenu** d'un de ces fichiers, incrémenter son
   `?v=` dans **chaque** page HTML qui le charge — `shared.js` est partagé
   par les deux pages et doit être bumpé dans les deux, même si une seule a
   changé par ailleurs. Sans ce bump, le correctif n'atteint jamais les
   navigateurs qui ont déjà l'ancienne version en cache (confirmé en prod le
   16/09/2026 : un correctif resté sans effet sur un poste malgré un
   déploiement réussi ; `admin.html` a aussi été retrouvé bloqué sur des
   versions de `shared.js`/`admin_app.js` vieilles de plusieurs semaines).
   Vérifier ce point avant de conclure qu'un correctif ne marche pas.

## Plus de PWA — `sw.js` de désinstallation

Les pages ne sont **plus installables** depuis la bascule du 25/09/2026
(AG-012 d'ATELIERS_NEWGEN : en mode installé, sans barre d'adresse, aucun
rechargement forcé de `index.html`/`admin.html` n'était possible). Ni
manifeste, ni `apple-touch-icon`, ni enregistrement de service worker.

- **`sw.js` reste publié, sans date de fin** : il se désinscrit sur les
  appareils où l'ancien est installé. Ne pas le supprimer.
- **Jamais de désinscription depuis la page** : l'origine est partagée avec
  NEWGEN et GDINV2 (commentaire en tête de `sw.js`).
- Si une PWA revenait un jour : `MD-LIB/pwa-service-worker.md` (jamais de
  cache, jamais de `respondWith()`).

## Architecture

- `shared.js` — composants React partagés (VueListes, VueHistorique, etc.)
- `app.js` — frontend conseillers
- `admin_app.js` — frontend admin
- `index.html` — page principale conseillers
- `admin.html` — page admin
- Serveur — **API PHP + MySQL chez Alwaysdata depuis la bascule du
  25/09/2026** (`window.BACKEND_PHP`, `window.requeteServeur` dans
  `shared.js`). Le code de l'API vit dans **ATELIERS_NEWGEN** (`api/`,
  déployé par `deploy-api.yml`), pas ici : tout changement côté serveur se
  fait là-bas. `GS_URL` est neutralisée ; `gas/` n'est plus qu'une archive,
  et `e2e/appels.test.js` échoue si un appel à `script.google.com` revient.

## Tests

| Runner | Ce qu'il vérifie |
|---|---|
| `node --test utils.test.js` | `utils.js` — dates, texte, parsing, ICS |
| `node --test logic.test.js` | `logic.js` — KPI, validation, filtres |
| `node --test contract.test.js` | format des données envoyées à GAS |
| `node --test reseau.test.js` | plafonds, tentatives, budget — garde-fou contre le rallongement des timeouts |
| `npx playwright test --reporter=line` | `e2e/smoke.test.js` (les deux pages s'ouvrent, chaque onglet répond) et `e2e/appels.test.js` (nombre d'appels GAS émis, journal Admin multi-onglets) |

Playwright exige `npm ci` et un Chromium (préinstallé en local, sinon
`npx playwright install chromium`).

**Quand lancer quoi**

- `node --check` sur tout fichier touché : **systématique**. C'est lui qui
  attrape la casse au chargement qui laisse les deux pages blanches alors que
  les suites Node passent.
- `utils.js`, `logic.js` ou le format entry modifiés → les suites Node.
- Effets de démarrage d'`app.js`/`admin_app.js`, chemin d'écriture
  (`saveEntry` → application locale) ou `addLog` modifiés →
  **`e2e/appels.test.js`**. Chaque appel GAS rétabli au démarrage se paie sur
  le terrain : c'est ce fichier qui empêche de le réintroduire sans s'en
  apercevoir.
- Changement mineur (texte, style, élément UI sans logique) → la CI relance
  `e2e` à chaque push, inutile de le faire localement.

**Règles de décision**

- Test qui échoue après une correction de bug → corriger le code, pas le test.
- Test qui échoue après un changement intentionnel → mettre à jour test et
  code dans le même commit.
- Ne jamais supprimer ni désactiver un test pour faire passer un commit.
- **La CI bloque le déploiement si un test échoue.**

## GAS — règles critiques

> **Historique depuis la bascule du 25/09/2026** : le client ne parle plus
> au GAS. Les plafonds ci-dessous restent en vigueur (le client les
> applique aussi à l'API) ; le reste documente l'ancien serveur.

- Toutes les actions passent par `doGet` (GET uniquement, pas POST) — les
  Exécutions Apps Script listent donc uniquement `doGet` (et `keepAlive` pour
  le déclencheur horaire) comme nom de fonction, jamais `checkPassword`,
  `getAll`, etc. Pour retrouver un appel précis, comparer les horodatages
  avec le Journal client (`window.__gasLog`), pas filtrer par nom d'action.
- `ContentService` n'a pas de `.setHeader()` — CORS automatique
- Paramètre mot de passe : `password` (pas `pwd`)
- Dates retournées : `yyyy-MM-dd` pour `date`, `HH:mm` pour `horaire`

### Plafonds d'appel — ne jamais les rallonger

Le comportement de la livraison Apps Script est **bimodal**, pas « lent » :
une réponse livrée arrive en 1 à 3 s, une réponse perdue part en HTTP 404 ou
en blocage au bout de 20-35 s. Un 404 authentique revient en ~200 ms — un 404
au bout de 27 s veut dire que la réponse **ne viendra jamais**.

Conséquence, apprise deux fois (NEWGEN les 18/09/2026, puis NextStep le même
jour) : **rallonger un plafond côté client ne récupère aucune réponse, il ne
fait qu'allonger l'écran d'attente.** NEWGEN a relevé 84 s pour une connexion,
dont 51 d'attente pure sur des appels déjà morts ; NextStep a porté son pire
cas à ~146 s en passant un plafond de 35 s à 4 tentatives.

Plafonds actuels : **12 s en lecture, 12 s en écriture, 25 s pour `saveMany`**,
3 tentatives en lecture, 2 en écriture, budget total 45 s.
Verrouillés par `reseau.test.js` — si un test de ce fichier échoue, c'est
qu'on est en train de refaire l'erreur.

Rejouer une écriture est sûr : le client génère `_id` avant l'envoi et
`actionSaveEntry` retrouve la ligne par cet `_id` au lieu d'en créer une
seconde. En revanche une écriture n'est **jamais doublée**
(`GAS_ACTIONS_ECRITURE`, verrouillé par `reseau.test.js` et
`e2e/appels.test.js`). La sérialisation des écritures n'est garantissable
que **côté serveur** : c'est le verrou GAS (`_avecVerrouEcriture`, v10.15.0),
pas le client — la file d'attente client a été retirée le 23/09/2026, et elle
ne voyait de toute façon ni un second onglet ni un second conseiller.

### Limite connue — latence de livraison indépendante du temps d'exécution

Confirmé les 15-16/09/2026 (captures croisées Journal client + Exécutions
Apps Script, sur Index puis sur Admin) : des appels (`checkPassword`,
`getComptes`) mesurés à 23-25 s côté navigateur, alors que l'exécution
`doGet` correspondante (même horodatage) dure moins de 2 s côté serveur.
L'écart se situe dans l'acheminement de la réponse après exécution
(redirection `/exec`), pas dans le script — Google Workspace ne signalait
aucun incident sur Apps Script à ce moment-là. Ce n'est pas corrigible par
une modification du code GAS ou frontend : c'est une limite de fiabilité de
la couche de livraison des Web Apps Apps Script, à mitiger (retries côté
client, message d'attente) plutôt qu'à "réparer". Ne pas rouvrir un audit de
contention/appels redondants sans avoir d'abord recoupé Journal client vs
Exécutions sur le créneau concerné — si l'exécution serveur est rapide,
inutile de chercher la cause côté code.
