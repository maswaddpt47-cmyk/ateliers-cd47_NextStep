# Chantiers en cours — Ateliers CD47 NextStep

État au **25/11/2026, 18:50** (Paris), `main` `a547830` (NEWGEN `e65a450`), pages ✅ 17:45 UTC, `shared.js` v331 : **Archives des tickets** (formulaire Admin des tickets clos replié, « ▴ Tout replier », même changement que NEWGEN) et étape « Attendre l'artefact Pages » dans `deploy.yml` (suivi dans le `CHANTIERS.md` de NEWGEN). Précédent : état au **25/11/2026, 18:15** (passation), base `main` `976461c` (NEWGEN `9efefbc` ; MD-LIB `7dfba7a`). **En ligne ici, ✅ 17:05** : fil de discussion des tickets (commentaires de l'Admin et de l'auteur, sans changer le statut), structures partenaires co-animatrices, volet corrigé (choisir un conseiller ne ferme plus le volet), annonce Nouveautés 42 ; le fil des tickets a besoin de l'API de NEWGEN (déployée ✅ 17:01). Le reste du suivi est dans le `CHANTIERS.md` de NEWGEN (état précis de la publication des pages NEWGEN, règles à approuver). **Ancien en-tête du 23/11 ci-dessous.** État au **23/11/2026** (relu par « pull »), base `main` `3c25c10` (NEWGEN `9a2907c` ; MD-LIB `8fb44d5`). **Arrivé depuis le 21/11** : mémoire « déjà lu » au serveur pour Nouveautés, tickets et pastille des nouveaux ateliers (AG-066, revue Codex corrigée, ouvert) ; ateliers ouverts depuis les mails de rappel ; commit indiqué dans `version.json`. Suivi dans le `CHANTIERS.md` de NEWGEN. **20/11, en production** : liens Partage47 (AG-065, clos), volet en onglets Détail / Reporting, QR visible sur téléphone, liens `/public.php` refusés, liste « Validées » des Anomalies retirée, pastille des nouveaux ateliers retenue d'une visite à l'autre ; suivi détaillé dans le `CHANTIERS.md` de NEWGEN. Avant : **AG-063 clos le 19/11** : « Avis par
atelier » en graphes (période ou atelier), même code que NEWGEN ; règles dans le `CHANTIERS.md` de NEWGEN.
**AG-065 (19/11)** : liens Partage47 dans le volet Détail, même code que NEWGEN (suivi là-bas). Le 17/11 :
annonce AGORA « publiée dans <dépôt> » et relecteur de l'autre éditeur (Claude ↔ Codex) dans `CLAUDE.md` et `AGENTS.md`.
Arrivé le 16/11 :
catégories « Durée vide » et « Planifié, date passée » dans Anomalies (AG-061, clos) ; bandeau « nouvelle version » (jamais vu en vrai, non annoncé) ; durées vides remplies à 1 h 30 dans la base
commune (AG-062, 168 sur 339, tous conseillers, clos) ; l'API garde la durée en base quand une page ancienne l'envoie vide.
`scripts/check-chantiers.sh` alerte aussi au-delà de 30 Ko (MD-LIB 8ter). Parité vérifiée (5 écarts voulus).
Avant (15/11) : CI en parallèle ; (13/11) vacances scolaires (AG-057), connexions reconnues par les gestionnaires de mots
de passe (règle 69), Nouveautés 39 et 40, rendez-vous Outlook au téléphone (AG-058), mot de passe imposé aussi à l'Admin (AG-059/060).
Avant : page TS sans filtre « Ouvert à tous » (AG-053), tuile « Copie de nuit » (AG-052, clos).

**Clôture Codex — 21/11/2026** : repartir d'un `main` propre, actualisé par
`fetch` puis `merge --ff-only`, sans réappliquer d'anciens brouillons. Relire
`AGENTS.md`, les consignes communes et le `CHANTIERS.md` de NEWGEN.
AG-061/062/063/065 sont clos, sans nouveau réaudit. **AG-066** : réponse amendée
dans `ATELIERS_NEWGEN/AGORA.md` (21/11) après examen de la livraison NEWGEN
`7ba83ef` : secours local par compte, acquittement après chargement des tickets,
validation des dates à corriger. Au contrôle de `8164798`, le nouveau client
AG-066 n'est pas encore sur ce `main` : portage puis parité à vérifier.
Suite : l'auteur corrige les écarts et livre le portage, sans nouveau tour
automatique de revue (règle 58). Aucun code modifié ni test produit NextStep
relancé par cette clôture ; contrôles NEWGEN et limites dans AGORA.
Aucune nouvelle règle convenue non écrite (règle 32) ; règles 73 à 75 de MD-LIB
relues, déjà inscrites. La suite du bilan mensuel reste dans NEWGEN.

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
Passation à tenir à jour : retirer les tâches terminées en conservant les
invariants ; garder le fichier (`MD-LIB/collaboration.md`, règle 8ter).

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

Règle 22 de `MD-LIB/collaboration.md`. Ne pas reproposer une piste écartée sans fait nouveau.

**Proposées, en attente** : tenues dans `CHANTIERS.md` d'ATELIERS_NEWGEN (mêmes interfaces, même base).
CI accélérée **faite le 15/11/2026** (`e2e` en parallèle de `test`, ici et dans NEWGEN ; avant : 1 min 51 s, gain attendu ~15 s,
non mesuré) ; cache de Chromium non fait (12 s au mieux).

**Écartées** (date — piste — raison)
- 03/10/2026 — lien d'abonnement agenda pour les partenaires — « pour l'instant » (utilisateur).
- 03/10/2026 — tri des onglets d'après les compteurs d'usage — « pour l'instant ».
- 03/10/2026 — aide « Premiers pas » pour un nouvel arrivant — « pour l'instant ».

## Retest du 25/11/2026 — reprise de NextStep sur l'API et la base communes

Version testée : fb198587e501bf2a39b7ea06cf08f0913e2e1cae
Données : fictives
Verdict : partiel
Preuves :
- Diff ca0dded → fb19858 lu : aucun fichier d'import, d'export, de sauvegarde ou de stockage (0 sur `api/`, `scripts/`, `.sql`, copie, sauvegarde). Seuls changent le client (`shared.js` v331, `app.js`, `admin_app.js`, tests) et `deploy.yml` (étape « Attendre l'artefact Pages », permission `actions: read`). Restauration complète non rejouée : la chaîne de reprise n'est pas touchée ici.
- Tests à ce SHA : Node utils 171, logic 121, contract 14, reseau 14 ; navigateur 76 passés (dont `tickets-fil` et `structures`), 0 échec.
- Reprise commune : la restauration d'une base ancienne sous le code 6ebf0ad (API partagée) est prouvée dans le `CHANTIERS.md` de NEWGEN (14/14 sur données fictives). Les parcours de NextStep qui en dépendent (fil des tickets, structures partenaires) sont couverts par ses tests navigateur sur API simulée de forme complète (règle 74).
- Déploiement des pages relevé : run 544 ✅ (17:45 UTC, a547830, avec l'étape d'attente) ; fb19858 est un commit de documentation, sans déploiement attendu.
Limites :
- Pages github.io inaccessibles depuis cette session (proxy, 403) : accès Pages et CORS vers la production non éprouvés ; les parcours conseiller et admin n'ont pas été rejoués sur la production ni sur une base restaurée réelle (tests navigateur sur API simulée, pas sur l'API PHP restaurée).
- L'étape d'attente de l'artefact est non concluante : un déploiement ✅ ne prouve pas qu'elle ait servi (échecs intermittents par rafales).
- Bascule de reprise commune (Pages + API sur une même origine de secours) non essayée. Aucune « référence validée » : décision de l'utilisateur.

## Retest du 25/11/2026 (2ᵉ passage) — reprise de NextStep sur l'API et la base communes, version 238e3ac

Version testée : 238e3ac32a2ee407ad7b5cd6227f3ac3b1e13781
Données : fictives
Verdict : partiel
Preuves :
- Diff : depuis fb19858 (1er retest), seul `CHANTIERS.md` change (+15 lignes). Depuis ca0dded : client (`shared.js` v331, `app.js`, `admin_app.js`, tests) et `deploy.yml` ; aucun fichier d'import, d'export, de sauvegarde ou de stockage (0 sur `api/`, `scripts/`, `.sql`). Restauration complète non rejouée : la chaîne de reprise n'est pas touchée ici.
- Rejoué à ce SHA : Node utils 171, logic 121, contract 14, reseau 14 ; navigateur 76 passés, 0 échec.
- Reprise commune : restauration d'une base ancienne sous le code NEWGEN 39aee62 rejouée (14/14, voir le `CHANTIERS.md` de NEWGEN). Les parcours de NextStep qui en dépendent (fil des tickets, structures partenaires) sont couverts par ses tests navigateur sur API simulée de forme complète (règle 74).
Limites :
- `github.io` inaccessible depuis la session (proxy, 403) : accès Pages et CORS vers la production non éprouvés ; parcours conseiller et admin non rejoués sur l'API PHP restaurée (API simulée seulement) ni sur la production.
- Étape « Attendre l'artefact Pages » toujours non concluante ; bascule de reprise commune (Pages + API d'une origine de secours) non essayée.
- Aucune « référence validée » : décision de l'utilisateur.

## Retest du 26/11/2026 — reprise commune NEWGEN et NextStep en local

Version testée : 238e3ac32a2ee407ad7b5cd6227f3ac3b1e13781
Données : fictives
Verdict : partiel
Preuves :
- [V] Le 26/11/2026 vers 00 h 03 (Paris), base fictive créée avec NEWGEN `04095c1`, exportée par `mariadb-dump` puis restaurée dans une base MariaDB 10.11 neuve. Avant l'essai, la cible contenait le ticket fictif et la table `tickets_messages` était absente.
- [V] Chromium a ouvert NextStep `238e3ac` et utilisé l'API PHP NEWGEN `39aee62`, servie sur la même origine locale. Le parcours Admin a lu le ticket restauré et sa réponse d'avant sauvegarde, puis ajouté un commentaire. L'application a affiché le commentaire. Une requête MariaDB a confirmé une seule ligne correspondante dans la cible et l'absence de la table de messages dans la base source.
Limites :
- La reprise fonctionnelle commune est vérifiée en local pour ce parcours Admin. La récupération de la copie chiffrée hors site et la bascule sur l'hébergement de secours, dont CORS si les origines diffèrent, restent à vérifier. Les URL de test sont locales. La production et les références techniques sont conservées.

## Retest du 26/11/2026 — NextStep `4b50e37` sur l'API commune (D-016)

Version testée : 4b50e37fa1b194f1ef00a701560bb96164ca907e
Données : fictives
Verdict : partiel
Preuves :
- Diff `ca0dded` → `4b50e37` : le client envoie la structure partenaire séparément et lit le fil des tickets. Le déploiement Pages attend désormais la visibilité de son artefact, avec `actions: read`. Import, export et sauvegarde gardent leurs mécanismes existants. Depuis `238e3ac`, seul `CHANTIERS.md` évolue. L'étape d'attente est identique à celle éprouvée sur NEWGEN avec artefact visible au 3e appel et absent après 12 appels fictifs.
- Sur la même API PHP NEWGEN `067d0a8` et la même base MariaDB fictive, le conseiller NextStep a relu la structure enregistrée depuis NEWGEN et ajouté un commentaire au ticket historique. L'Admin NextStep a relu les trois messages, dont la réponse antérieure au fil et les ajouts effectués depuis les deux clients. Le statut est resté « En cours ». La base compte un atelier avec la structure, un ticket et trois messages distincts. Le contrôle de la base et des copies est consigné dans `ATELIERS_NEWGEN/CHANTIERS.md`.
- Pages Index et Admin répondent HTTP 200 en lecture seule. Les deux applications partagent l'origine `https://maswaddpt47-cmyk.github.io`. Avec cette origine Pages et l'origine API distincte, routées exclusivement vers localhost dans Chromium, les 10 requêtes observées ont reçu l'en-tête CORS attendu. La preuve d'accès HTTP porte sur les pages publiques actuelles.
Limites :
- Les droits de publication Pages du compte de secours et la bascule effective restent à vérifier. Si le secours utilise un autre hôte Pages, l'origine doit être autorisée par l'API et les deux clients doivent viser la bonne URL d'API avant l'essai. Première étape : vérifier les droits du compte de secours et les URL prévues, puis rejouer les parcours conseiller et Admin sur cet hébergement avec des données fictives.
