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

Règles communes de collaboration : MD-LIB/collaboration.md, chargé automatiquement par MD-LIB/CLAUDE.md (04/11/2026). Ici, seulement ce qui est propre au projet.

- **Réseau et serveur** : sur un problème réseau qui dure plus de 3 itérations, demander une capture Network DevTools ou le **journal Admin** ; dès qu'un bug réseau ou serveur est signalé, vérifier d'abord que le dernier `deploy-api.yml` **d'ATELIERS_NEWGEN** a réussi et à quelle heure.
- **Coût des tests** : la suite Playwright une seule fois, juste avant le commit ; les suites Node (`utils`, `logic`, `contract`, `reseau`) tournent en quelques secondes (section Tests : laquelle se déclenche sur quoi).
- **Tailles de référence du rendu** : 390 px (téléphone) et 1280x720.
- **Toute modification des interfaces se fait sur NEWGEN *et* NextStep** (demande de l'utilisateur, 26/09/2026) : les deux applis partagent la même API et la même base depuis la bascule du 25/09/2026. Un changement fait sur une seule est l'exception, annoncée comme telle au moment du choix. En fin de livraison, dire en une ligne ce qui est en ligne sur chacune (commit, `?v=`) pour que l'utilisateur sache quoi recharger. **Nouveautés — choix de l'utilisateur (25/10/2026).** Après test et validation d'une évolution, proposer les changements significatifs pour l'équipe avec un texte court, puis demander lesquels l'utilisateur souhaite annoncer. **Attendre son accord explicite sur les sujets et le texte avant publication.** Validation du fonctionnement (« tout est OK ») et choix des annonces sont deux étapes distinctes. Une annonce retenue est ajoutée à `NOUVEAUTES` (`shared.js`) dans les deux applications avec l'`id` suivant ; cette rubrique remplace les mails d'annonce. **Jamais d'annonce réservée à l'Admin** (`admin: true`) : l'utilisateur est le seul Admin, elle n'apprendrait rien à personne (décision du 26/10/2026). **Avant d'en écrire une, relire `NOUVEAUTES`** : un sujet déjà annoncé se met à jour dans son entrée, pas dans une nouvelle (02/10/2026 : dépêche 16 publiée puis retirée, la Corbeille était annoncée depuis le 25/09 par la 9) ; un `id` publié puis retiré n'est jamais réutilisé (la pastille ne compte que les `id` au-delà du dernier vu). Les annonces déjà publiées (30 à 32) restent. Pas les correctifs invisibles.

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
(blocs de sécurité : Codex). **Tout changement qui touche un calcul ou un
chiffre affiché ouvre un bloc dans cette AGORA, systématiquement, avant la
correction (critère 7, contradicteur Codex, 26/10/2026).**
Un bloc ouvert s'annonce **sur une ligne à part en tête du message, 🔴 et en
gras** : `🔴 **⚖️ AGORA : critère N — <sujet>. Bloc AG-00N commité (AGORA de
NEWGEN). → Dis « pull » à Codex.**` (MD-LIB `agora.md` §4, 04/11/2026).

## Branche de travail

Toujours committer et pousser directement sur `main`. Ne pas créer de branche intermédiaire.
**Jamais par `sandbox` sauf demande explicite de l'utilisateur** (rappelé le 04/11/2026 : un détour par le bac à sable non demandé a coûté un déploiement et un tour).
Seule exception : la branche `sandbox`, que `deploy-sandbox.yml` d'ATELIERS_NEWGEN
publie dans le bac à sable (`…alwaysdata.net/sandbox/nextstep/`, AG-033,
27/10/2026) ; elle part de `main` et y revient après l'essai de l'utilisateur.
Le bac à sable suit `main` (décision du 27/10/2026) : chaque push de code sur
`main` de NEWGEN le republie avec le `main` d'ici. Un push de code ici **sans**
push NEWGEN derrière : lancer « Déploiement du bac à sable » de NEWGEN à la main
(ce dépôt n'a pas de clé SSH). Essai avant `main` : pousser `sandbox` ici, puis
`sandbox` de NEWGEN.

**Avant d'écrire « en ligne »** : `MD-LIB/outils/attendre-deploiement.sh` (hook
automatique après un push, sinon à lancer à la main) doit avoir dit ✅.

## Avant toute intervention sur les fichiers

1. **Mettre à jour** avant de lire ou modifier un fichier : `git fetch origin main` puis
   `git merge --ff-only origin/main`, **jamais `git pull`** sur `main` (MD-LIB règle 63, 04/11/2026)
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
