# Chantiers en cours — Ateliers CD47 NextStep

État au **20/09/2026**, commit de référence `c2f2b86`.
Fichier transitoire : à mettre à jour à chaque avancée, à supprimer quand tout
est soldé. Ce n'est pas de la documentation permanente (cf.
`MD-LIB/hygiene-instructions.md`).

---

## 1. Décision à trancher — la file d'attente sert-elle à quelque chose ?

`gasUnAppel` sérialise tous les appels GAS (`_gasQueue`, `shared.js`), sur une
hypothèse que le code lui-même déclare **non vérifiée** : que le nombre
d'appels simultanés ferait rater la redirection. Le commentaire prévoyait de
trancher avec le Journal des opérations — **ça n'a jamais été fait**.

| | NextStep | ATELIERS_NEWGEN |
|---|---|---|
| Stratégie | **file d'attente**, un appel en vol à la fois | lectures **doublées** à partir de 7 s |
| Statut | hypothèse non vérifiée | efficacité constatée (3 sauvetages le 18/09) |
| Mesure | **aucune à ce jour** | 54 % de pertes le 19/09 |

**Ce qui affaiblit l'hypothèse**, relevé sur NEWGEN le 18/09 à 22:10 : les
trois appels d'ouverture meurent dans la même seconde, puis leurs trois
doublons — tout aussi parallèles — réussissent dans la même seconde, en 6,5 s
chacun. Même degré de parallélisme, résultat opposé : la panne frappe par
fenêtres de temps, pas par nombre d'appels.

**Ce que la file coûte si l'hypothèse est fausse** : en fenêtre de panne, les
temps morts s'additionnent au lieu de se superposer (12 s puis 12 s, au lieu
de 12 s en parallèle). Le commentaire du code affirme « sérialiser n'allonge
rien ici » — vrai quand tout va bien, faux précisément quand ça va mal.

**Comment trancher.** Console (F12) sur l'Admin de chaque site, après quelques
jours d'usage. Le Journal porte désormais une pastille NEXTSTEP / NEWGEN : les
deux applis sont visuellement identiques et des mesures ont déjà été
attribuées au mauvais projet le 19/09.

```js
(() => {
  const L = JSON.parse(localStorage.getItem('adm_logs')||'[]').map(e=>e.msg).filter(m=>m&&m.startsWith('GAS '));
  const ko = L.filter(m=>/404|bloqué|réseau/.test(m)).length;
  const ok = L.filter(m=>/— ok en/.test(m)).map(m=>parseFloat(m.match(/ok en ([\d.]+)/)[1])).sort((a,b)=>a-b);
  console.log(`${location.pathname} | appels ${L.length} | échecs ${ko} (${Math.round(ko/L.length*100)}%) | médiane ${ok[Math.floor(ok.length/2)]}s`);
})()
```

⚠️ **Incompatibilité à connaître** : on ne peut pas porter le doublage de
NEWGEN sans retirer la file. Un doublon mis en file derrière son propre jumeau
ne partirait qu'après l'abandon de celui-ci — le mécanisme serait inopérant.

## 2. Chantier conditionnel — proxy pour supprimer la perte

Si la mesure confirme un taux de pertes élevé des deux côtés, la couche de
reprise a atteint sa limite et le sujet devient : appeler GAS **côté serveur**
pour que la redirection `/exec → googleusercontent` soit suivie depuis un
datacenter plutôt que depuis un mobile.

Bloqué par la même question que sur NEWGEN : hébergement PHP/HTTPS
disponible ? Aucune trace dans les repos (recherche du 20/09/2026), les dépôts
sont publics et sur GitHub Pages. Alternative : Cloudflare Workers, avec la
réserve RGPD d'un sous-traitant américain supplémentaire.

## 3. ⚠️ Sécurité — endpoints accessibles sans token

Même situation que sur NEWGEN, à vérifier ici dans `gas/GAS_NEXTSTEP.js` :
`getAll`, `getComptes` et `getConfig` accessibles sans token, avec l'URL
`/exec` en clair dans `shared.js` d'un dépôt public. Chantier séparé,
impliquant un redéploiement GAS manuel.

---

## Points à ne pas défaire

- **Plafonds : 12 s lecture, 12 s écriture, 25 s `saveMany`.** Les rallonger
  ne récupère aucune réponse perdue. Le pire cas de ce projet a atteint ~146 s
  en passant un plafond de 35 s à 4 tentatives. Verrouillé par
  `reseau.test.js`.
- **Aucun appel GAS superflu au démarrage ni après une écriture.** Verrouillé
  par `e2e/appels.test.js`.
- **Les écritures restent séquentielles et jamais doublées** (deux `appendRow`
  concurrents = atelier en double).
- **`sw.js` ne met rien en cache et n'intercepte rien.** Voir la section PWA
  du `CLAUDE.md`.
