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

## GAS — règles critiques

- Toutes les actions passent par `doGet` (GET uniquement, pas POST)
- `ContentService` n'a pas de `.setHeader()` — CORS automatique
- Paramètre mot de passe : `password` (pas `pwd`)
- Dates retournées : `yyyy-MM-dd` pour `date`, `HH:mm` pour `horaire`
