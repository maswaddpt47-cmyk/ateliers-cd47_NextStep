# GAS_NEXTSTEP.js — copie de référence

### ⏳ v10.19.0 à déployer (préparée le 23/09/2026)

Vide le cache de l'appli quand on modifie le classeur **à la main**, y
compris quand on **supprime des lignes** (incident du 23/09/2026 : doublons
supprimés dans le classeur, encore affichés 10 min dans l'appli).

1. Coller `gas/GAS_NEXTSTEP.js` dans l'éditeur, **Déployer → Gérer les
   déploiements → ✏️ → Nouvelle version**.
2. Menu **Exécuter** → `installerTriggerChangement` → Exécuter (une seule
   fois ; Google demande d'autoriser l'accès au classeur, accepter).
3. Vérifier : supprimer une ligne de test dans le classeur, puis cliquer sur
   Sync dans l'appli — la ligne doit disparaître tout de suite.
4. Me dire « déployé ».

## ✅ v10.18.0 déployée le 23/09/2026 (08:40)

`testerSecuriteDoGet` tout en ✅. Contient v10.14.0 (prêt du stock
d'ordinateurs), v10.15.0 (verrou d'écriture serveur), v10.16.0 (`keepAlive`
allégé), v10.17.0 et v10.18.0 (`keepAlive` sans verrou, AG-004). Les sections
ci-dessous restent comme référence de ce que contient ce déploiement.

### Ce que le verrou corrige (et ce qu'il ne corrige pas)

| | Avant | Après |
|---|---|---|
| Deux `saveEntry` simultanés, même `_id` | peuvent créer **deux lignes** | une seule |
| Deux `delete` simultanés | le second peut supprimer **l'atelier voisin** (index décalé) | impossible |
| Latence de connexion | inchangée | **inchangée** |

Le verrou **n'accélère rien**. Le gain de latence viendra du chantier
suivant (portage du doublage de lecture), qui ne doit **pas** être fait tant
que ce déploiement n'est pas confirmé en ligne.

### v10.18.0 — `keepAlive` sans verrou de script

Les mails « Summary of failures » des 19, 20 et 21/09/2026 montrent trois
`keepAlive` bloqués **8 min 00 s** chacun, arrêtés par la plateforme. Avec
le verrou pris avant la lecture (v10.16.0), un tel blocage aurait refusé
toutes les écritures pendant 8 min une fois le verrou d'écriture en ligne.
L'anti-empilement passe désormais par un drapeau `CacheService` (360 s).
Ces mails continueront peut-être d'arriver : ils viennent de la plateforme,
pas du code.

### v10.16.0 — `keepAlive` allégé

Il relisait la feuille **entière toutes les 5 minutes, 24 h/24**, sans jamais
regarder si le cache était déjà chaud : ~288 lectures complètes par jour, la
quasi-totalité pour rien. NEWGEN portait déjà les deux garde-fous qui
manquaient ici. Après : ~144 au plus, et aucune quand une autre exécution
tourne.

⚠️ **Ce n'est pas un correctif prouvé des démarrages laborieux** signalés le
22/09/2026 — c'est une hypothèse. Il se justifie sur son propre coût. Pour
savoir s'il y était pour quelque chose : **Exécutions Apps Script**, lignes
`keepAlive`. Présentes toutes les 5 min et sous 3 s = il faisait déjà son
travail, chercher ailleurs.

### Marche à suivre (≈ 5 min)

1. Ouvrir <https://script.google.com> → projet Apps Script **NextStep**.
2. Tout sélectionner dans l'éditeur, coller le contenu complet de
   `gas/GAS_NEXTSTEP.js`.
3. **Déployer → Gérer les déploiements → ✏️ → Version : Nouvelle version →
   Déployer.** (Ne pas créer un *nouveau* déploiement : l'URL changerait et
   il faudrait modifier `GS_URL` dans `shared.js`.)
4. Menu **Exécuter** → choisir `ajouterColonnesPretMateriel` → Exécuter.
   (Migration v10.14.0, idempotente — sans risque si déjà faite.)
5. Menu **Exécuter** → choisir `testerSecuriteDoGet` → Exécuter, puis
   **Journal d'exécution** : vérifier que tout est en ✅.
6. Test réel : enregistrer un atelier depuis l'appli, puis en supprimer un.
   Les deux doivent répondre normalement.
7. Les jours suivants, dans **Exécutions** : une exécution `doGet`
   d'écriture qui dure **≈ 20 s** est un `waitLock` épuisé, donc une
   écriture refusée pour cause de verrou. C'est le seul compteur fiable de
   la contention (AG-004). Côté journal Admin, un refus serveur apparaît
   désormais avec le motif `serveur : …`.
8. Me dire « déployé » — je retire alors les bandeaux ⚠️ en tête du fichier
   et j'enchaîne sur le portage du doublage.

### Si ça se passe mal

Dans **Déployer → Gérer les déploiements**, le menu Version liste les
versions précédentes : en sélectionner une et redéployer revient en arrière
en 30 secondes, sans toucher à l'URL.

---

Ce fichier n'est **pas déployé automatiquement**. Google Apps Script n'a pas
d'API de push depuis ce dépôt ; le déploiement reste manuel :

1. Ouvrir le projet Apps Script NextStep (script.google.com).
2. Remplacer le contenu de l'éditeur par celui de `GAS_NEXTSTEP.js`.
3. Publier une nouvelle version (Déployer → Gérer les déploiements → Nouvelle version).
4. Vérifier que `testerSecuriteDoGet()` (dans le fichier) renvoie bien des ✅
   avant de considérer le déploiement validé.

L'intérêt de ce fichier n'est donc pas l'automatisation, mais d'avoir un
historique versionné et diffable — avant, les échanges se faisaient par
fichiers `.docx`, sans diff possible et avec des risques d'encodage
(espaces insécables introduites par Word, notamment).

**Après chaque déploiement réel confirmé**, mettre à jour ce fichier dans le
même commit que le changement frontend correspondant, pour qu'il reflète
toujours ce qui est censé tourner en production — pas un brouillon en
cours de test.

## Migrations manuelles ponctuelles

Certaines évolutions ajoutent des colonnes à la feuille `Ateliers_next_step`
et nécessitent de lancer une fonction une fois, depuis l'éditeur Apps Script
(menu Exécuter → choisir la fonction → Exécuter), après le déploiement de la
version qui l'introduit :

- **v10.14.0** — `ajouterColonnesPretMateriel()` : ajoute `nb_ordinateurs`,
  `date_prelevement_materiel`, `date_retour_materiel` en fin de feuille.
  Idempotente (relançable sans risque).

À la date du dernier commit touchant ce fichier, l'état exact du
déploiement réel (confirmé par l'utilisateur ou en attente de test) est
précisé dans le message de commit.
