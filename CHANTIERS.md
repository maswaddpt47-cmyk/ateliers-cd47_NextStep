# Chantiers en cours — Ateliers CD47 NextStep

État au **26/10/2026**. NextStep (équipe) et NEWGEN (utilisateur) parlent à
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

**Écartées** (date — piste — raison)
- 03/10/2026 — lien d'abonnement agenda pour les partenaires — « pour l'instant » (utilisateur).
- 03/10/2026 — tri des onglets d'après les compteurs d'usage — « pour l'instant ».
- 03/10/2026 — aide « Premiers pas » pour un nouvel arrivant — « pour l'instant ».
