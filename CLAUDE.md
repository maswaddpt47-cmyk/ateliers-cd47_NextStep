# Règles de travail — Ateliers CD47 NextStep

> **Travaux en cours, décisions en attente et mesures à faire :
> [`CHANTIERS.md`](CHANTIERS.md).** À lire en début de session — une session
> ne transmet rien à la suivante, seul ce qui est commité survit. À
> réactualiser **à chaque avancée**, pas en fin de session : une session peut
> s'interrompre sans préavis. Une tâche finie s'en **retire** (son récit va
> dans `git log`) ; `scripts/check-chantiers.sh`, lancé au démarrage de
> session, signale quand le ménage est dû (> 300 lignes, en-tête de plus de
> 7 jours, tâches ✅ ou barrées).
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
10. Sur tout problème réseau qui dure plus de 3 itérations : demander une capture Network DevTools ou le journal Admin avant de continuer à supposer.
11. Dès qu'un bug réseau ou serveur est signalé, vérifier d'abord que le dernier `deploy-api.yml` d'ATELIERS_NEWGEN a réussi et à quelle heure.

14. **Doser les tests à leur valeur, pas à la prudence.** La suite Playwright coûte du temps et des jetons à chaque lancement : la lancer une seule fois, juste avant le commit, jamais à chaque étape intermédiaire. Les suites Node (`utils`, `logic`, `contract`, `reseau`), elles, tournent en quelques secondes — les lancer librement. Écrire un ou deux tests ciblés par correctif, pas quatre à six ; réserver la contre-preuve — celle qui rejoue l'implémentation fautive — aux pièges réellement subtils, ceux qu'on remettrait sans s'en apercevoir.
15. **Les tests ne trouvent pas les défauts de sens.** Ils vérifient des calculs et des états, pas ce qu'un écran est censé signifier : un affichage peut calculer juste et raconter faux. Un test écrit après coup empêche la régression, il ne découvre rien. Ne jamais présenter une suite verte comme une garantie que l'affichage est correct, ni s'en servir pour décharger l'utilisateur du contrôle visuel.
16. **Un harnais de vérification qui échoue est du gaspillage, pas de la prudence.** Avant de conclure à une anomalie, éliminer d'abord l'instrument : générateur de données mal distribué, page non chargée, mauvaise sélection. Réutiliser un harnais qui a déjà fonctionné plutôt que le réécrire à chaque fois.

17. **Le rendu se vérifie à ton œil, pas par un test.** Un changement de rendu pur (couleur, libellé, position, CSS, mise en page) ne justifie ni test ni capture : dire quoi regarder et laisser l'utilisateur confirmer coûte moins cher et voit mieux. La ligne de partage est **rendu / calcul**, pas visible / invisible — un calcul, un filtre ou un format de données garde son test ciblé, parce que l'œil ne contrôle que le cas affiché ce jour-là : une régression sur une combinaison de valeurs rare passera inaperçue. Playwright ne se lance que si le changement touche ce qu'il couvre vraiment (démarrage, appels serveur, chemin d'écriture, `sw.js`) ; pour le reste la CI au push suffit, comme le dit déjà la section Tests. Capture avant/après à la demande, pas par défaut.

18. **Toute modification des interfaces se fait sur NEWGEN *et* NextStep** (demande de l'utilisateur, 26/09/2026) : les deux applis partagent la même API et la même base depuis la bascule du 25/09/2026. Un changement fait sur une seule est l'exception, annoncée comme telle au moment du choix. En fin de livraison, dire en une ligne ce qui est en ligne sur chacune (commit, `?v=`) pour que l'utilisateur sache quoi recharger. Un changement qui modifie la façon de travailler de l'équipe (bouton, écran, comportement) ajoute aussi une entrée à `NOUVEAUTES` (`shared.js`), rédigée pour l'équipe, avec un `id` suivant : la rubrique Nouveautés remplace les mails d'annonce (demande du 01/10/2026). **Seulement après que l'utilisateur a testé et validé le changement** (demande du 02/10/2026) : jamais au moment du push. **Annonce réservée à l'Admin (`admin: true`) : toujours demander d'abord s'il faut l'intégrer** (demande du 07/10/2026), texte proposé — jamais d'office. Les annonces déjà publiées (30 à 32) restent. Pas les correctifs invisibles.

19. **Pas de compliment, un constat.** Ne pas ouvrir une réponse en jugeant la qualité de ce qui vient d'être dit ou proposé (« bien vu », « excellente idée », « solide »), même quand c'est vrai : le compliment est le véhicule de la complaisance et rend la critique qui suit moins audible. Ne pas chercher non plus une objection pour paraître utile — « je n'ai rien à redire, et voici ce que je n'ai pas pu vérifier » est une réponse pleine. Établie le 27/09/2026 après 12 verdicts « amendé » d'affilée dans l'`AGORA.md` de NEWGEN, sans un seul « confirmé » ni « contredit ».

20. **Pistes d'amélioration à moments fixés** (MD-LIB `collaboration.md`, règle 22, 03/10/2026). À la fin d'une fonctionnalité livrée et validée, et sur toute demande de revue de l'interface : au plus 3 pistes, classées par utilité, non développées. Chercher **dans** l'outil (écran confus, saisie en double, clics inutiles) **et autour** : ce que les utilisateurs font encore à côté (tableur, mail, papier), ce que la hiérarchie redemande — l'angle qu'on rate en ne lisant que le code. S'appuyer sur des faits (compteurs d'usage, remontées, `CHANTIERS.md`), pas une impression. Consigner chaque piste dans la section « Pistes » de `CHANTIERS.md` : *proposées, en attente*, ou *écartées* avec date et raison ; une piste écartée ne se repropose pas sans fait nouveau.

**Bonnes pratiques à maintenir**

12. Continuer à demander l'avis avant toute action à fort impact (déploiement, architecture, migration de données) et exécuter vite dès validation courte reçue.
13. Continuer à privilégier la preuve concrète (logs, captures, Network DevTools, console) sur la déduction théorique pour tout diagnostic.

### Côté utilisateur — priorité haute

1. Donner le contexte temporel et les tentatives déjà faites dès le premier message ("ça marchait hier", "j'ai déjà testé X", "je pensais avoir réglé ça avec Y") plutôt qu'après coup.
2. Pour un bug visuel, "bizarre" ou réseau, ajouter une ligne de description du symptôme précis, une capture annotée ou le Network DevTools plutôt qu'une formule vague.
3. Signaler explicitement en début de message tout changement d'état fait hors session (déploiement de l'API, changement d'URL, config, branche renommée, settings modifiés).
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
  suppression), sous-traitants et hébergement (hébergeur, CDN — hors UE ?), données
  sensibles, traçabilité des traitements.
- **Sécurité** : pas de secret/clé/token en clair dans le code ou poussé sur
  le repo, action sensible protégée par authentification réelle, échanges en
  HTTPS, pas de donnée sensible en localStorage/cookies sans nécessité, libs/
  CDN externes vérifiées, permissions par défaut minimales, logs sans données
  personnelles en clair.
- **Captures d'écran** (charte IA du CD47 §4, 06/10/2026) : celles envoyées à
  Claude se font dans le bac à sable (données fictives) ou recadrées. Une
  capture qui montre des données réelles (noms d'agents, remarques de
  stagiaires) se signale en une ligne : rappel d'habitude, pas alerte RGPD.
- **Références CD47** : consignes IA → `MD-LIB/charte-ia-cd47.md` ; durées
  de conservation et purges (tableau de gestion, visa des Archives
  départementales, versions V0.x/V1) → `MD-LIB/archivage-cd47.md`.

Signaler tout point non garanti explicitement dans la réponse (`⚠️ RGPD/
sécurité : ...`), même sans qu'on le demande — immédiatement si critique
(secret exposé, donnée sensible non protégée), sinon en une ligne courte.

**Audit trimestriel :** en complément, un audit de sécurité approfondi
(`/security-review` sur `main` + checklist RGPD/sécurité complète sur tout
le repo) est prévu tous les trois mois. C'est une routine planifiée
(`create_trigger`, mode session neuve à chaque déclenchement — indépendante
de toute session de travail), avec notification push/email. Voir
`MD-LIB/rgpd-securite.md` pour le détail.
**Audit Codex** (OpenAI, MD-LIB `agora.md` §12) : le même jour, et après tout
changement structurant de sécurité (connexion, page publique, hébergement),
avec la consigne de `ateliers-backups/documents/sources/consigne-audit-codex.md`
(ligne « Ce dépôt ne contient que l'interface » en tête) ; chaque point vérifié
dans le code. Contradiction d'une proposition : `AGORA.md` d'ATELIERS_NEWGEN
(blocs de sécurité : Codex).

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
  25/09/2026** (`window.requeteServeur` dans `shared.js`). Le code de l'API
  vit dans **ATELIERS_NEWGEN** (`api/`, déployé par `deploy-api.yml`), pas
  ici : tout changement côté serveur se fait là-bas. L'ancien code Google
  Apps Script est retiré (30/09/2026) ; version qui tournait en ligne :
  `git show b8b96c7:gas/`. `e2e/appels.test.js` échoue si un appel à
  `script.google.com` revient.

## Tests

| Runner | Ce qu'il vérifie |
|---|---|
| `node --test utils.test.js` | `utils.js` — dates, texte, parsing, ICS |
| `node --test logic.test.js` | `logic.js` — KPI, validation, filtres |
| `node --test contract.test.js` | format des données envoyées à l'API |
| `node --test reseau.test.js` | plafonds, tentatives, budget — garde-fou contre le rallongement des timeouts |
| `npx playwright test --reporter=line` | `e2e/smoke.test.js` (les deux pages s'ouvrent, chaque onglet répond) , `e2e/appels.test.js` (nombre d'appels émis, journal Admin multi-onglets) et `e2e/avis-admin.test.js` (Admin : suppression d'un avis) |

Playwright exige `npm ci` et un Chromium (préinstallé en local, sinon
`npx playwright install chromium`).

**Quand lancer quoi**

- `node --check` sur tout fichier touché : **systématique**. C'est lui qui
  attrape la casse au chargement qui laisse les deux pages blanches alors que
  les suites Node passent.
- `utils.js`, `logic.js` ou le format entry modifiés → les suites Node.
- Effets de démarrage d'`app.js`/`admin_app.js`, chemin d'écriture
  (`saveEntry` → application locale) ou `addLog` modifiés →
  **`e2e/appels.test.js`**. Chaque appel rétabli au démarrage se paie sur
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

## Couche d'appel — règles héritées de l'époque Google, toujours valables

Google Apps Script est coupé depuis le 25/09/2026. Les mesures qui fondent
ces règles (pertes de livraison, doublage) sont dans l'historique git de
`CHANTIERS.md`. Les noms `GAS_*`, `gasAppel`, `__gasLog` sont restés dans le
code : ils désignent la couche d'appel, plus Google.

- **Ne jamais rallonger les plafonds** : 12 s en lecture et en écriture, 25 s
  pour `saveMany`, 3 tentatives en lecture, 2 en écriture, budget total 45 s.
  Attendre ne récupère aucune réponse perdue, ça allonge l'écran d'attente
  (~146 s de pire cas relevés ici le 18/09/2026). Verrouillé par
  `reseau.test.js`.
- **Une écriture n'est jamais doublée** (`GAS_ACTIONS_ECRITURE`, verrouillé
  par `reseau.test.js` et `e2e/appels.test.js`). La rejouer est sûr : l'`_id`
  vient du client et l'API remplace la ligne existante.
- **Aucun appel superflu au démarrage ni après une écriture** : vérifier que
  l'info ne voyage pas déjà dans `getAll` ; les écritures s'appliquent
  localement. `e2e/appels.test.js` échoue si un appel supprimé réapparaît.
