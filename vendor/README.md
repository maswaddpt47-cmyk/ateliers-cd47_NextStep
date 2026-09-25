# vendor/ — bibliothèques servies depuis ce dépôt

Pas de CDN : ces fichiers sont livrés par GitHub Pages avec le reste du site.

## Pourquoi

1. **Vie privée** — un CDN reçoit l'adresse IP de chaque agent et de chaque
   usager qui ouvre une page. Servir depuis notre propre origine supprime ce
   tiers. Point RGPD : c'est un sous-traitant en moins.
2. **Disponibilité** — une panne ou un blocage réseau du CDN ne casse plus la
   carte.
3. **Version figée** — le numéro est **dans le chemin**
   (`vendor/leaflet-1.9.4/`). Pas besoin de `?v=N` : changer de version change
   l'URL, donc le cache navigateur ne peut pas servir l'ancienne. C'est la
   même protection que la règle de cache-busting, obtenue autrement.

## Contenu

| Dossier | Version | Licence | Provenance |
|---|---|---|---|
| `leaflet-1.9.4/` | 1.9.4 | BSD 2-Clause (`LICENSE`) | paquet npm officiel `leaflet@1.9.4`, `dist/` |
| `react-18.3.1/` | 18.3.1 | MIT (`LICENSE`) | paquet npm officiel `react@18.3.1`, `umd/` |
| `react-dom-18.3.1/` | 18.3.1 | MIT (`LICENSE`) | paquet npm officiel `react-dom@18.3.1`, `umd/` |
| `echarts-5.4.3/` | 5.4.3 | Apache-2.0 (`LICENSE`) | paquet npm officiel `echarts@5.4.3`, `dist/` |
| `xlsx-0.18.5/` | 0.18.5 | Apache-2.0 (`LICENSE`) | paquet npm officiel `xlsx@0.18.5`, `dist/` |
| `html2canvas-1.4.1/` | 1.4.1 | MIT (`LICENSE`) | paquet npm officiel `html2canvas@1.4.1`, `dist/` |
| `jspdf-2.5.1/` | 2.5.1 | MIT (`LICENSE`) | paquet npm officiel `jspdf@2.5.1`, `dist/` |

Rapatriés le 25/09/2026 depuis cdnjs, qui restait le dernier tiers à recevoir
l'adresse IP des agents. Provenance : registre npm (`npm pack`, qui vérifie
l'empreinte sha512 publiée par le registre). La comparaison octet à octet
avec les fichiers cdnjs n'a pas pu être faite (cdnjs inaccessible depuis
l'environnement de la session) ; `react-18.3.1` est identique à celui des
`node_modules` utilisés par les tests.

## Mettre à jour

```bash
npm pack leaflet@X.Y.Z
tar xzf leaflet-X.Y.Z.tgz
mkdir -p vendor/leaflet-X.Y.Z/images
cp package/dist/leaflet.js package/dist/leaflet.css vendor/leaflet-X.Y.Z/
cp package/dist/images/* vendor/leaflet-X.Y.Z/images/
cp package/LICENSE vendor/leaflet-X.Y.Z/
```

Puis changer le chemin dans `index.html` **et** `admin.html`, supprimer
l'ancien dossier, et relancer les suites navigateur : elles interceptaient
autrefois l'URL cdnjs, elles chargent maintenant le vrai Leaflet local.
