# Règles de travail — Ateliers CD47 NextStep

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
