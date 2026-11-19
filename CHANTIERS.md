# Chantiers en cours — Ateliers CD47 NextStep

État au **19/11/2026**, base `main` `c87f5b2` (NEWGEN `05f6184` ; MD-LIB `fc1c76d`). **AG-063 clos le 19/11** : « Avis par
atelier » en graphes (période ou atelier), même code que NEWGEN ; règles dans le `CHANTIERS.md` de NEWGEN. Le 17/11 :
annonce AGORA « publiée dans <dépôt> » et relecteur de l'autre éditeur (Claude ↔ Codex) dans `CLAUDE.md` et `AGENTS.md`.
Arrivé le 16/11 :
catégories « Durée vide » et « Planifié, date passée » dans Anomalies (AG-061, clos) ; bandeau « nouvelle version » (jamais vu en vrai, non annoncé) ; durées vides remplies à 1 h 30 dans la base
commune (AG-062, 168 sur 339, tous conseillers, clos) ; l'API garde la durée en base quand une page ancienne l'envoie vide.
`scripts/check-chantiers.sh` alerte aussi au-delà de 30 Ko (MD-LIB 8ter). Parité vérifiée (5 écarts voulus).
Avant (15/11) : CI en parallèle ; (13/11) vacances scolaires (AG-057), connexions reconnues par les gestionnaires de mots
de passe (règle 69), Nouveautés 39 et 40, rendez-vous Outlook au téléphone (AG-058), mot de passe imposé aussi à l'Admin (AG-059/060).
Avant : page TS sans filtre « Ouvert à tous » (AG-053), tuile « Copie de nuit » (AG-052, clos).

**Passation Codex — 16/11/2026** : repartir d'un `main` propre, actualisé par
`fetch` puis `merge --ff-only`, sans réappliquer d'anciens brouillons. Relire
`AGENTS.md`, les consignes communes et le `CHANTIERS.md` de NEWGEN.
AG-061 et AG-062 sont clos ; leurs correctifs postérieurs aux réponses de Codex
n'ont pas été réaudités, sans nouveau tour automatique (règle 58).
Aucune nouvelle consigne à ajouter : concision, contrôles proportionnés et fin
**✅ TÂCHE TERMINÉE** sont déjà inscrits. La suite du bilan mensuel reste dans NEWGEN.

**Consignes communes** : lire `MD-LIB/collaboration.md` et les consignes locales.
L'annonce **✅ TÂCHE TERMINÉE** est déjà dans cet `AGENTS.md` et dans MD-LIB
(`9c4f349`, règle 18) ; une session déjà ouverte doit relire explicitement les
sources. Les autres projets se mettent à jour au prochain pull, sans propagation groupée.
**Suite** : reprendre `ATELIERS_NEWGEN/CHANTIERS.md` et son `AGORA.md` actualisés ;
les vérifications, limites et blocages communs y sont tenus. Aucun test produit
relancé pour cette passation documentaire.

NextStep (équipe) et NEWGEN (utilisateur) parlent à
la même API Alwaysdata et à la même base depuis la bascule du 25/09/2026 :
**les restes communs** (registres, audit trimestriel, sauvegardes,
sécurité, import Outlook à valider, rubrique Nouveautés) et les
décisions partagées (AG-002 sur le prêt multi-jours, interrupteur « login »,
déconnexion à 30 min) **sont tenus dans `ATELIERS_NEWGEN/CHANTIERS.md`**.
Ici, seulement ce qui est propre à NextStep.
Fichier transitoire : à mettre à jour à chaque avancée, à supprimer quand tout
est soldé. Ce n'est pas de la documentation permanente (cf.
`MD-LIB/hygiene-instructions.md`).

**Ménages des 26/09, 16/10 et 26/10/2026** : époque GAS (banc, doublage,
relevés de pertes, AG-003 à AG-008, bascule), récit des livraisons et doublons
du `CLAUDE.md` retirés — `git log -p CHANTIERS.md`.

---

## Reste ouvert

- **Bac à sable NextStep** (AG-033, en ligne le 27/10/2026) :
  `…alwaysdata.net/sandbox/nextstep/`, publié par `deploy-sandbox.yml` de NEWGEN
  (mode d'emploi : section « Branche de travail » du `CLAUDE.md`). Vérifications
  restantes : `ATELIERS_NEWGEN/CHANTIERS.md`.
- **Parité avec NEWGEN (AG-015)** : 5 écarts au 16/10/2026, tous voulus
  (dont l'Historique : chacun garde son design, décision du 26/09). Suivi et
  **ordre de push (NextStep d'abord)** : `CHANTIERS.md` d'ATELIERS_NEWGEN,
  section parité — le compte fait foi là-bas, pas ici.
- **Lisibilité des couleurs de la Frise du parc** : jamais vérifiée à l'œil.

## ⚠️ Pièges connus

- **« Ordinateurs prêtés » vidé au premier enregistrement** (signalé le
  23/09 sur les deux projets, non reproduit, cause inconnue). Hypothèse non
  vérifiée : molette de la souris sur le champ numérique encore actif. Si ça
  revient : demander si le champ affiche vide ou « 0 ».
- **Un affichage peut calculer juste sur une mauvaise valeur** : le champ
  Admin « Stock ordinateurs » a affiché la valeur saisie pendant que tout le
  calcul tournait sur 10 (22/09, époque GAS). Après toute modification du
  stock ou de la config, vérifier qu'une alerte de conflit cite bien le
  nouveau nombre — aucune suite ne le voit.

## Points à ne pas défaire

- **Bilan trimestriel (AG-032, `6ba579d`, validé à l'écran le 26/10/2026)** :
  mêmes définitions que NEWGEN — couverture affichée, avis sur tous les avis
  avec « Sans réponse », communes normalisées, année non chargée = message sans
  chiffre. Détail : `ATELIERS_NEWGEN/CHANTIERS.md` et son `AGORA.md`.
- **`_id` fourni par le client et gardé tant que l'envoi n'a pas réussi** :
  rejouer une écriture remplace, ne duplique pas. Le cycle enregistré en
  double du 23/09 (16 lignes au lieu de 8, chaque clic tirait de nouveaux
  `_id`) ne peut plus se reproduire.
- Déjà dans `CLAUDE.md` (« Couche d'appel ») et verrouillés par les tests :
  écritures jamais doublées (lectures muettes doublées à 7 s), plafonds,
  aucun appel superflu — le drapeau maintenance voyage dans `getAll`, et
  `e2e/appels.test.js` verrouille aussi l'écran de maintenance.
- **Synchro de fond suspendue** quand l'onglet est caché (`app.js:543`,
  `admin_app.js:469`) : relancer dans le vide n'ajoute que des appels.
- **Stockage navigateur préfixé** (`APP_NS = 'nextstep'`, `utils.js:317`) :
  l'origine `maswaddpt47-cmyk.github.io` est partagée avec NEWGEN et GDINV2,
  et `localStorage` n'est pas cloisonné par chemin.
- **Logique du matériel dans `logic.js` seul** (`periodePretMateriel`,
  `occupeCreneauMateriel`…), chargée avant `shared.js` par les deux pages
  (NEWGEN aussi depuis le lot 0 d'AG-015).

## Pistes d'amélioration

Règle 20 du `CLAUDE.md`. Ne pas reproposer une piste écartée sans fait nouveau.

**Proposées, en attente** : tenues dans `CHANTIERS.md` d'ATELIERS_NEWGEN
(mêmes interfaces, même base).
- 15/11/2026 — **CI plus rapide : faite le 15/11/2026** (`e2e` en parallèle de `test`, ici et
  dans NEWGEN ; mesuré avant : 1 min 51 s, dont `test` 15 s, `e2e` 75 s, `deploy` 20 s ; gain
  attendu ~15 s, à mesurer au prochain passage). Cache de Chromium non fait : 12 s au mieux.

**Écartées** (date — piste — raison)
- 03/10/2026 — lien d'abonnement agenda pour les partenaires — « pour l'instant » (utilisateur).
- 03/10/2026 — tri des onglets d'après les compteurs d'usage — « pour l'instant ».
- 03/10/2026 — aide « Premiers pas » pour un nouvel arrivant — « pour l'instant ».
