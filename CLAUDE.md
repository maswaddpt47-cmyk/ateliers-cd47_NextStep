# Règles de travail — Ateliers CD47 NextStep

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
- GAS backend — Google Apps Script, URL dans `shared.js` → `GS_URL`. Le script
  lui-même n'est pas dans ce repo (pas d'API de push GAS) ; `gas/GAS_NEXTSTEP.js`
  en est une copie de référence versionnée, à tenir à jour manuellement après
  chaque déploiement confirmé (voir `gas/README.md`).

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

---

## Règles de collaboration

### Côté Claude — priorité haute

1. Ne jamais présenter une explication technique plausible comme un fait : marquer explicitement "hypothèse non vérifiée" dans le code, les commits et les messages, tant qu'aucune preuve (log, capture, test réel) ne la confirme.
2. Ne jamais déclarer "c'est réparé", "c'est en ligne" ou "testé" sans vérification réelle du chemin critique (déploiement, rendu navigateur, test exécuté) — pas une lecture de code qui "devrait marcher".
3. Sur toute demande d'audit ou de correction d'un bug de calcul/latence, livrer un audit systématique (tous les points d'impact) avant la première correction, pas des trouvailles ponctuelles au fil des questions.
4. Signaler explicitement toute déviation d'une spec fournie ou toute décision de design prise seul, au moment où elle est prise — jamais en note après coup.
5. Poser une question de clarification dès qu'une demande est réellement ambiguë ou sous-spécifiée plutôt que de trancher en silence ou produire un placeholder.
6. Toujours faire un `git pull origin main` avant de lire ou modifier le moindre fichier, même si le repo semble à jour.
7. Après toute reprise de session ou résumé de contexte, relire l'état réel du fichier concerné avant de le modifier — ne jamais présumer qu'un correctif précédent est encore en place.
8. Avant de pousser un changement visuel (CSS/layout), vérifier les interactions connues à risque (stacking context, overflow, position sticky/fixed) sur les zones sensibles existantes.
9. Sur tout problème réseau/GAS qui dure plus de 3 itérations : demander une capture Network DevTools ou les Exécutions GAS avant de continuer à supposer.
10. Vérifier l'état exact du déploiement GAS (version + URL active dans `shared.js` → `GS_URL`) en début de session dès qu'un bug réseau est signalé.

### Côté utilisateur — priorité haute

1. Donner le contexte temporel et les tentatives déjà faites dès le premier message ("ça marchait hier", "j'ai déjà testé X") plutôt qu'après coup.
2. Pour un bug visuel ou réseau, ajouter une capture annotée ou le Network DevTools plutôt qu'une description seule.
3. Signaler explicitement en début de message tout changement fait hors session : redéploiement GAS, changement d'URL, modification de config.
4. Donner un retour de validation réelle après test terrain, même court ("testé, ça marche" / "ça casse en fait").
5. Quand on reverte, préciser ce qui est conservé vs jeté — "on revient à hier" sans liste efface du travail potentiellement utile.
