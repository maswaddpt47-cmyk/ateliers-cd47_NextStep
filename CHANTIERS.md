# Chantiers en cours — Ateliers CD47 NextStep

État au **26/09/2026**. NextStep (équipe) et NEWGEN (utilisateur) parlent à
la même API Alwaysdata et à la même base depuis la bascule du 25/09/2026 :
**les restes communs** (relève du journal le 30/09, audit trimestriel avant
le 01/10, classeurs Google fin octobre, sauvegardes, sécurité) et les
décisions partagées (AG-002 sur le prêt multi-jours, interrupteur « login »,
déconnexion à 30 min) **sont tenus dans `ATELIERS_NEWGEN/CHANTIERS.md`**.
Ici, seulement ce qui est propre à NextStep.
Fichier transitoire : à mettre à jour à chaque avancée, à supprimer quand tout
est soldé. Ce n'est pas de la documentation permanente (cf.
`MD-LIB/hygiene-instructions.md`).

**Ménage du 26/09/2026** : l'époque GAS (banc, doublage, relevés de pertes,
AG-003 à AG-008, ordre du jour de la bascule) a été retirée. Texte complet :
`git log -p CHANTIERS.md`, avant `807db21`.

---

## Reste ouvert

- **Alignement avec NEWGEN (parité AG-015)** : en cours, 16 écarts restants
  au 26/09/2026. Suivi, questions en attente et ordre de push (**NextStep
  d'abord**) : `CHANTIERS.md` d'ATELIERS_NEWGEN, chantier parité.
- **Lisibilité des couleurs de la Frise du parc** : jamais vérifiée à l'œil.
- `manifest-*.json` à retirer (plus de PWA depuis AG-012), une fois les
  dernières installations désinstallées ; `sw.js` de désinstallation reste
  publié sans date de fin.

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

- **`_id` fourni par le client et gardé tant que l'envoi n'a pas réussi** :
  rejouer une écriture remplace, ne duplique pas. Le cycle enregistré en
  double du 23/09 (16 lignes au lieu de 8, chaque clic tirait de nouveaux
  `_id`) ne peut plus se reproduire.
- **Les écritures ne sont jamais doublées** par la couche réseau ; les
  lectures muettes le sont au bout de 7 s. Verrouillé par `reseau.test.js`
  et `e2e/appels.test.js`.
- **Plafonds : 12 s lecture, 12 s écriture, 25 s `saveMany`.** Les rallonger
  n'a jamais récupéré une réponse (pire cas ~146 s avec un plafond de 35 s à
  4 tentatives). Verrouillé par `reseau.test.js`.
- **Aucun appel superflu au démarrage ni après une écriture** ; pas de
  `getConfig` dédié sur Index, le drapeau maintenance voyage dans `getAll`.
  `e2e/appels.test.js` verrouille l'appel supprimé **et** l'écran de
  maintenance qui s'affiche toujours.
- **Synchro de fond suspendue** quand l'onglet est caché (`app.js:543`,
  `admin_app.js:469`) : relancer dans le vide n'ajoute que des appels.
- **Stockage navigateur préfixé** (`APP_NS = 'nextstep'`, `utils.js:317`) :
  l'origine `maswaddpt47-cmyk.github.io` est partagée avec NEWGEN et GDINV2,
  et `localStorage` n'est pas cloisonné par chemin.
- **Logique du matériel dans `logic.js` seul** (`periodePretMateriel`,
  `occupeCreneauMateriel`…), chargée avant `shared.js` par les deux pages.
  NEWGEN l'a en double (`shared.js` + `logic.js`) : ne pas importer ce
  défaut ici.
