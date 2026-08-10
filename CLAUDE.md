# Règles de travail — Ateliers CD47 NextStep

## Règles de collaboration avec Claude

Extrait du guide de collaboration multi-projets, adapté pour ce dépôt.

### Côté Claude

**Patterns récurrents — priorité haute**
1. Ne jamais présenter une explication technique plausible comme un fait : marquer explicitement "hypothèse non vérifiée" dans le code, les commits et les messages, tant qu'aucune preuve (log, capture, test réel) ne la confirme.
2. Ne jamais déclarer "c'est réparé", "c'est en ligne" ou "testé" sans vérification réelle du chemin critique (déploiement GitHub Actions, rendu navigateur, test exécuté) — pas une lecture de code qui "devrait marcher".
3. Sur toute demande d'audit ou de correction d'un bug de calcul/latence, livrer un audit systématique (tous les points d'impact) avant la première correction, pas des trouvailles ponctuelles au fil des questions.
4. Signaler explicitement toute déviation d'une spec fournie ou toute décision de design prise seul, au moment où elle est prise — jamais en note après coup.
5. Poser une question de clarification dès qu'une demande est réellement ambiguë ou sous-spécifiée (contenu non précisé, "adapte" vs "applique", référence visuelle absente) plutôt que de trancher en silence ou produire un placeholder.
6. Sur tout appel Bash touchant un repo précis en contexte multi-repo, utiliser `cd /chemin/complet &&` systématiquement ; vérifier `git status`/`git log` et la cohérence CLAUDE.md vs instructions de session avant d'agir, pas après.
7. Toujours faire un `git pull` avant de lire ou modifier le moindre fichier, même si le repo semble à jour — l'oubli est une cause récurrente d'écrasement de travail. Respecter la politique de push définie ci-dessous (push direct sur `main`, sauf instruction de session explicite contraire) et signaler tout conflit entre les deux avant d'agir, pas après.
8. Après toute reprise de session ou résumé de contexte, relire l'état réel du fichier concerné avant de le modifier ou de le renvoyer — ne jamais présumer qu'un correctif précédent est encore en place.
9. Avant de pousser un changement visuel (CSS/layout), vérifier mentalement les interactions connues à risque (stacking context, overflow, position sticky/fixed) sur les zones sensibles existantes.

**Bonnes pratiques à maintenir**
10. Continuer à demander l'avis avant toute action à fort impact (déploiement, architecture, migration de données) et exécuter vite dès validation courte reçue.
11. Continuer à privilégier la preuve concrète (logs, captures, Network DevTools, console) sur la déduction théorique pour tout diagnostic.

### Côté utilisateur

**Patterns récurrents — priorité haute**
1. Donner le contexte temporel et les tentatives déjà faites dès le premier message ("ça marchait hier", "j'ai déjà testé X", "je pensais avoir réglé ça avec Y") plutôt qu'après coup.
2. Pour un bug visuel ou "bizarre", ajouter une ligne de description du symptôme précis (ou une capture annotée) plutôt qu'une formule vague.
3. Signaler explicitement en début de message tout changement d'état fait hors session (redéploiement, config, branche renommée, settings modifiés).
4. Pour les demandes ouvertes ("plus", "mieux", "améliore"), préciser le critère de succès attendu (différent de l'existant / même chose mais plus visible).
5. Donner un retour de validation réelle après test terrain, même court ("testé, ça marche" / "ça casse en fait") — sans ce signal, Claude ne peut recouper ses inférences.

**Bonnes pratiques à maintenir**
6. Continuer à valider court et vite sur le travail bien cadré ("ok", "la totale") — ça marche bien tant que la portée est claire.
7. Continuer à recadrer immédiatement dès qu'une mauvaise direction est repérée — c'est efficace et limite les dégâts.

## Branche de travail

Toujours committer et pousser directement sur `main`. Ne pas créer de branche intermédiaire.

## Avant toute intervention sur les fichiers

1. **Git pull** : toujours faire `git pull origin main` avant de lire ou modifier un fichier
2. **Commits séparés** : un commit par modification logique, avec préfixe :
   - `feat:` nouvelle fonctionnalité
   - `fix:` correction de bug
   - `refactor:` restructuration sans changement de comportement

## Architecture

- `shared.js` — composants React partagés (VueListes, VueHistorique, etc.)
- `app.js` — frontend conseillers
- `admin_app.js` — frontend admin
- `index.html` — page principale conseillers
- `admin.html` — page admin
- GAS backend — Google Apps Script (pas dans le repo), URL dans `shared.js` → `GS_URL`

## Tests unitaires — règle obligatoire

| Fichier | Ce qu'il teste | Runner |
|---|---|---|
| `utils.js` | Fonctions bas niveau (dates, texte, parsing, ICS) | `node --test utils.test.js` |
| `logic.js` | Logique métier (KPI, validation, filtres) | `node --test logic.test.js` |
| (pas de fichier source) | Format données → API GAS | `node --test contract.test.js` |

Ces fichiers sont chargés dans le navigateur ET testés sous Node. Une seule source de vérité.

Avant chaque commit touchant `utils.js`, `logic.js` ou le format des données :
1. Exécuter les trois runners
2. Corriger le code si un test échoue (jamais supprimer le test)
3. Commiter source + test ensemble si le test a dû être mis à jour

La CI bloque le déploiement si un test échoue.

## GAS — règles critiques

- Toutes les actions passent par `doGet` (GET uniquement, pas POST)
- `ContentService` n'a pas de `.setHeader()` — CORS automatique
- Paramètre mot de passe : `password` (pas `pwd`)
- Dates retournées : `yyyy-MM-dd` pour `date`, `HH:mm` pour `horaire`
