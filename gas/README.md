# GAS_NEXTSTEP.js — copie de référence

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

À la date du dernier commit touchant ce fichier, l'état exact du
déploiement réel (confirmé par l'utilisateur ou en attente de test) est
précisé dans le message de commit.
