# Consignes de travail pour Codex

Consignes de l’utilisateur du 19/10/2026, adaptées des règles de MD-LIB.
Cette copie contient les règles essentielles pour démarrer sans dépendre
d’un accès réseau. Les consignes explicites de la session et les règles
spécifiques du projet restent applicables.

## Autorisations — accès complet (consigne de l’utilisateur du 04/11/2026)

**L’utilisateur donne toutes les autorisations pour le travail demandé** : « je
voudrais lui donner toutes les permissions » (04/11/2026), après « Arrête de me
demander les autorisations, je te les donnes » (31/10/2026). Codex agit, puis
rend compte. Il ne demande jamais « je peux… ? », « veux-tu que je… ? »,
« je continue ? » ni « tu confirmes ? ».

**Sans rien demander** :
- lire, créer, modifier et déplacer les fichiers du dépôt ; installer les
  dépendances déclarées ;
- lancer tests, scripts, navigateur et toute commande utile à la tâche ;
- `git fetch`, `git merge --ff-only`, commits, push selon la politique du projet
  (sur `main` quand le projet le prescrit) ; mettre à jour `CHANTIERS.md` ;
  répondre dans `AGORA.md` ;
- corriger ses propres erreurs ; après un échec, changer de méthode sans
  redemander.

**Seules exceptions, à demander avant d’agir** (une question par décision, ou
des choix numérotés) :
1. suppression irréversible de données (purge, archivage qui efface,
   restauration qui écrase) ;
2. réécriture d’historique publié (`push --force`, `reset` d’une branche
   poussée, `filter-repo`) ;
3. changement de format de stockage ou d’export, migration ;
4. écart à ce que l’utilisateur a demandé : il décide du *quoi* ; le *comment*
   est laissé à Codex, qui choisit l’option recommandée et la nomme dans son
   compte rendu.

**Jamais, même avec cette autorisation** : lire une sauvegarde réelle ou un
fichier d’usagers ; publier une donnée personnelle ; contourner un refus de la
plateforme (le signaler une fois, puis continuer le reste).

## Au début de chaque session

1. Vérifier le dépôt, sa branche par défaut, la branche de session et l’état Git.
   Actualiser depuis GitHub avant d’intervenir, sans écraser le travail local.
2. Lire `CLAUDE.md`, `CHANTIERS.md` et les instructions des sous-dossiers
   lorsqu’ils existent. Respecter leurs règles de branche, tests et publication.
   Un chantier ancien ne remplace pas la demande actuelle de l’utilisateur.
3. Avant toute intervention, lire intégralement le `collaboration.md` local
   et appliquer ses règles pendant toute la session, y compris après une
   reprise de contexte. À défaut de copie locale, lire celui de
   `maswaddpt47-cmyk/MD-LIB` si cet accès est disponible.
   Consulter les autres documents selon la tâche : Git, hygiène,
   déploiement, sécurité, AGORA, PWA. Les références CD47 ne s’appliquent
   qu’aux projets concernés, jamais automatiquement aux projets personnels.
4. Si une ressource manque, le signaler une fois, sans inventer son contenu.
   Appliquer cette copie locale et poursuivre le travail qui reste possible.

## Communication et blocages

- Annoncer l’action et le résultat attendu ; répondre court, clairement,
  sans compliments automatiques ni explications techniques inutiles.
- Donner un point utile au plus toutes les 60 secondes pendant le travail.
- Signaler immédiatement un blocage : cause connue ou « cause inconnue »,
  résultat acquis, solution proposée et éventuelle action précise de l’utilisateur.
- Borner les commandes réseau à 15 secondes. Après un échec, changer de
  méthode seulement avec une raison ; ne pas répéter les tentatives bloquées.
  Préférer un connecteur fonctionnel. Ne pas contourner un refus d’accès.
- Continuer les tâches indépendantes d’une réponse manquante. Respecter les
  autorisations déjà accordées et les limites explicites, dont la lecture seule.
- Fin de tâche (04/11/2026) : vérifier que les opérations et revues nécessaires
  sont terminées, puis conclure le message final par une ligne distincte :
  **✅ TÂCHE TERMINÉE**. Si un traitement reste en cours ou bloque la livraison,
  préciser son état sans annoncer la tâche terminée.

## Décisions, preuves et périmètre

- L’utilisateur décide des déviations à une spécification ou référence :
  exposer la proposition et demander l’arbitrage avant de changer le périmètre.
- Signaler toute contradiction entre les consignes avant l’action concernée.
  Proposer toute nouvelle règle de collaboration à l’utilisateur et attendre
  son accord avant de l’ajouter aux fichiers d’instructions.
- Poser une question si une ambiguïté réelle empêche de choisir correctement ;
  les tâches indépendantes continuent pendant l’attente.
- Distinguer fait mesuré et « hypothèse non vérifiée ». Lire une capture entière
  et signaler une incohérence sans la corriger hors du périmètre autorisé.
- Avant un correctif, suivre la valeur sur tout son chemin : appelants,
  valeurs par défaut, promesses et erreurs. Vérifier le déploiement réel
  avant de diagnostiquer un ancien affichage comme un problème de cache.
- Ne dire « testé », « réparé » ou « en ligne » qu’avec une vérification réelle
  du chemin concerné. Une suite verte ne vaut pas validation par l’utilisateur.
- Compter les nombres annoncés avec une commande ou un outil ; qualifier
  une estimation comme telle. Dater les constats et utiliser l’heure de Paris.

## Git et mémoire de session

- Respecter le workflow du projet, sa branche par défaut et les contraintes
  de la plateforme. Ne pas imposer `main` à un dépôt configuré autrement.
- **Main toujours** (01/11/2026, `MD-LIB/git-workflow.md` §3) : publier chaque
  livraison vérifiée en avance rapide sur `main`, même si une branche de
  session est imposée, sans attendre la fin de session ni redemander.
  Actualiser par `git fetch` puis `git merge --ff-only` ; résoudre une
  divergence sans réécrire l’historique publié.
- Un commit conventionnel en français par modification logique. Aucun
  force-push ni écrasement d’un changement concurrent.
- Juste avant de modifier un fichier partagé, actualiser et relire son état.
  Préserver les modifications des autres sessions et les règles déjà présentes.
- Mettre `CHANTIERS.md` à jour à chaque avancée significative : état vérifié,
  référence, reste à faire et invariants. Retirer les tâches achevées en gardant
  les décisions utiles ; l’historique détaillé appartient à Git.
- Lors d’une passation, consigner code poussé, branche, tests réellement passés,
  blocages et prochaine action. Écrire aussi les nouvelles règles convenues
  au bon endroit ; ne pas dépendre de l’historique de conversation.

## Vérifications et livraison

- Doser les tests à ce qui change. Réutiliser le harnais existant et vérifier
  son bon fonctionnement avant de conclure à un défaut du produit.
- Pour calcul, données ou appels serveur : tests ciblés, coût et non-régression
  utiles ; suite complète une fois avant livraison lorsque le projet l’exige.
- Pour un changement de rendu pur : pas de nouveaux tests ou captures par
  défaut. Mesurer débordements, chevauchements et contrastes aux tailles du
  projet ; à défaut, 390 px et 1280×720. Le contrôle utilisateur reste nécessaire.
- La fonction livrée doit être visible là où l’utilisateur teste, démo comprise.
  Dire où cliquer et adapter les textes qui décrivent le comportement modifié.
- Distinguer code local, code poussé, aperçu et production. Avant toute annonce
  « en ligne », vérifier le commit réellement déployé et les étapes de publication.
  Suivre `MD-LIB/deploiement.md` et son vérificateur lorsqu’ils s’appliquent.
- **Avant de pousser, lancer tous les tests que le déploiement exécutera, dans
  ses conditions** (chaque script listé par le workflow, chaque fuseau), pas
  seulement ceux du changement : il casse aussi les tests de son voisinage
  (MD-LIB `collaboration.md` règle 60, 01/11/2026).
- Ne pas désactiver un contrôle requis pour faire passer une livraison.

## Sécurité, audit et instructions

- Ne pas afficher ni committer de secrets ou de données personnelles. Préserver
  les protections existantes et limiter les lectures aux données nécessaires.
- Sur une mission d’audit ou de contradiction en lecture seule, ne pas modifier
  le code ; fournir les preuves `fichier:ligne`, scénario ou mesure.
- Appliquer l’AGORA du projet lorsqu’elle existe ; ne pas répondre à son propre
  bloc. Les constats de sécurité suivent le circuit prévu par le projet.
- Lire les instructions locales des dépôts de sauvegarde avant tout accès aux
  copies. Aucun export, déchiffrement ou changement de visibilité hors demande.
- Champ de jeton, de clé ou de mot de passe (MD-LIB `collaboration.md` règle 69,
  13/11/2026) : dans un vrai `<form autocomplete="on" action="#">`, avec un
  identifiant fixe `name="username"` `autocomplete="username"` `readonly`
  `tabindex="-1"` `aria-hidden="true"` sorti de l’écran par
  `position:absolute;left:-9999px` (jamais `display:none`), le champ en
  `type="password"` `name="password"` `autocomplete="current-password"` avec un
  `id` unique, et un bouton `type="submit"` ; sur `submit`, `preventDefault()`,
  même enregistrement qu’à la frappe et message de confirmation. Sinon Proton
  Pass ne propose pas la clé.
- Garder les instructions courtes : fusionner les doublons, dater les hypothèses
  et préférer un contrôle utile à une nouvelle couche de règles.

## AGORA — ce que « pull » veut dire (03/11/2026)

Les blocs AGORA de NextStep vivent dans l'`AGORA.md` d'**ATELIERS_NEWGEN** (même
API, même base). Quand l'utilisateur dit « pull » pour l'AGORA, c'est dans ce
dépôt-là qu'il faut répondre, selon la section du même nom de son `AGENTS.md` :
blocs ouverts marqués **Contradicteur : Codex** sans réponse de Codex, réponse
dans `AGORA.md` seulement, commit et push sur `main`, jamais de code.

## Sources communes

Référentiel : `maswaddpt47-cmyk/MD-LIB`, notamment `collaboration.md`,
`git-workflow.md`, `hygiene-instructions.md`, `rgpd-securite.md`,
`deploiement.md` et `agora.md`. Les outils ou hooks propres à Claude Code
ne sont pas supposés installés dans Codex ; vérifier les capacités disponibles.
