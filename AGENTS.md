# Consignes de travail pour Codex

Consignes de l’utilisateur du 19/10/2026, adaptées des règles de MD-LIB.
Cette copie contient les règles essentielles pour démarrer sans dépendre
d’un accès réseau. Les consignes explicites de la session et les règles
spécifiques du projet restent applicables.

## Au début de chaque session

1. Vérifier le dépôt, sa branche par défaut, la branche de session et l’état Git.
   Actualiser depuis GitHub avant d’intervenir, sans écraser le travail local.
2. Lire `CLAUDE.md`, `CHANTIERS.md` et les instructions des sous-dossiers
   lorsqu’ils existent. Respecter leurs règles de branche, tests et publication.
   Un chantier ancien ne remplace pas la demande actuelle de l’utilisateur.
3. Lire `collaboration.md` dans `maswaddpt47-cmyk/MD-LIB` si cet accès est
   disponible. Consulter les autres documents selon la tâche : Git, hygiène,
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

## Décisions, preuves et périmètre

- L’utilisateur décide des déviations à une spécification ou référence :
  exposer la proposition et demander l’arbitrage avant de changer le périmètre.
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
- Garder les instructions courtes : fusionner les doublons, dater les hypothèses
  et préférer un contrôle utile à une nouvelle couche de règles.

## Sources communes

Référentiel : `maswaddpt47-cmyk/MD-LIB`, notamment `collaboration.md`,
`git-workflow.md`, `hygiene-instructions.md`, `rgpd-securite.md`,
`deploiement.md` et `agora.md`. Les outils ou hooks propres à Claude Code
ne sont pas supposés installés dans Codex ; vérifier les capacités disponibles.
