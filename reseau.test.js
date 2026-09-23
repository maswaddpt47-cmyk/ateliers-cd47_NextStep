// Garde-fou sur la politique d'appel GAS de shared.js.
//
// Pourquoi ce fichier existe : rallonger les plafonds côté client est l'erreur
// qui a coûté le plus cher sur ATELIERS_NEWGEN, qui parle au même backend.
// Un plafond à 35 s transformait chaque livraison ratée en 35 s d'écran
// d'attente — 84 s relevés pour une seule connexion, dont 51 d'attente pure
// sur des appels déjà morts. NextStep a refait la même erreur le 18/09/2026
// (plafond 35 s porté à 4 tentatives, soit ~146 s de pire cas) avant que la
// comparaison avec NEWGEN ne la révèle.
//
// La mesure qui fonde ces valeurs : un 404 authentique revient en ~200 ms ;
// un 404 au bout de 27 s signifie que la réponse a été PERDUE, pas qu'elle
// tarde. Au-delà d'une dizaine de secondes, attendre ne sert plus à rien.
//
// Ces tests lisent le source plutôt que de l'exécuter : shared.js exige React
// au chargement et ne peut pas être requis sous Node.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

const SRC = fs.readFileSync(require('path').join(__dirname, 'shared.js'), 'utf8');

function constante(nom){
  const m = new RegExp(`const\\s+${nom}\\s*=\\s*(\\d+)`).exec(SRC);
  assert.ok(m, `constante ${nom} introuvable dans shared.js`);
  return parseInt(m[1], 10);
}

test('politique d\'appel GAS', async (t) => {
  await t.test('plafond de lecture court : au-delà, la réponse est perdue, pas en retard', () => {
    const v = constante('GAS_TIMEOUT_LECTURE_MS');
    assert.ok(v <= 15000, `GAS_TIMEOUT_LECTURE_MS=${v} : au-delà de 15 s on attend une réponse qui ne viendra pas`);
  });

  await t.test('plafond d\'écriture court — rejouer une écriture est sûr (idempotent par _id)', () => {
    const v = constante('GAS_TIMEOUT_ECRITURE_MS');
    assert.ok(v <= 15000, `GAS_TIMEOUT_ECRITURE_MS=${v} : trop long`);
  });

  await t.test('saveMany a droit à plus de temps : N entrées dans la même exécution', () => {
    const lot = constante('GAS_TIMEOUT_ECRITURE_LOT_MS');
    const simple = constante('GAS_TIMEOUT_ECRITURE_MS');
    assert.ok(lot > simple, 'le plafond du lot doit dépasser celui d\'une écriture simple');
    assert.ok(lot <= 30000, `GAS_TIMEOUT_ECRITURE_LOT_MS=${lot} : trop long`);
  });

  await t.test('le pire cas d\'une lecture reste sous le budget total', () => {
    const plafond = constante('GAS_TIMEOUT_LECTURE_MS');
    const n       = constante('GAS_TENTATIVES_LECTURE');
    const pause   = constante('GAS_PAUSE_LECTURE_MS');
    const budget  = constante('GAS_BUDGET_TOTAL_MS');
    const pire    = n * plafond + (n - 1) * pause;
    assert.ok(pire <= budget + plafond,
      `pire cas lecture = ${pire/1000}s, au-delà du budget de ${budget/1000}s — ` +
      `c'est exactement la dérive que ce test existe pour attraper`);
  });

  await t.test('un budget total borné existe : un bouton Réessayer vaut mieux qu\'un écran qui tourne', () => {
    const v = constante('GAS_BUDGET_TOTAL_MS');
    assert.ok(v > 0 && v <= 60000, `GAS_BUDGET_TOTAL_MS=${v} : hors bornes`);
  });

  await t.test('les écritures sont moins retentées que les lectures', () => {
    assert.ok(constante('GAS_TENTATIVES_ECRITURE') <= constante('GAS_TENTATIVES_LECTURE'));
  });

  await t.test('checkPassword n\'est pas classé en écriture — il ne doit jamais être doublé', () => {
    // Il incrémente un compteur d'échecs (5 = blocage 15 min). Le jour où une
    // lecture doublée sera portée depuis NEWGEN, le classer ici par erreur
    // ferait compter double un mot de passe mal tapé.
    const m = /const GAS_ACTIONS_ECRITURE = new Set\(\[([\s\S]*?)\]\)/.exec(SRC);
    assert.ok(m, 'GAS_ACTIONS_ECRITURE introuvable');
    assert.ok(!/checkPassword/.test(m[1]), 'checkPassword ne doit pas figurer dans GAS_ACTIONS_ECRITURE');
  });

  await t.test('les actions d\'écriture connues sont bien déclarées', () => {
    const m = /const GAS_ACTIONS_ECRITURE = new Set\(\[([\s\S]*?)\]\)/.exec(SRC);
    for(const a of ['saveEntry','saveMany','delete'])
      assert.ok(m[1].includes(`'${a}'`), `${a} doit être déclarée comme écriture`);
  });

  // ── Doublage des lectures (porté de NEWGEN le 23/09/2026) ──────────────
  await t.test('la file d\'attente a disparu : un appel mort ne bloque plus les suivants', () => {
    // Tranché le 22/09/2026 (banc, 249 salves, McNemar χ² = 10,32) : la file
    // laissait 18 % des connexions échouer, le doublage 4 %.
    assert.ok(!/let _gasQueue/.test(SRC), '_gasQueue ne doit pas revenir sans une mesure au moins équivalente');
  });

  await t.test('le doublon part avant l\'abandon du premier appel', () => {
    const hedge = constante('GAS_HEDGE_MS');
    assert.ok(hedge >= 3000, `GAS_HEDGE_MS=${hedge} : une réponse saine prend 1-3 s, doubler plus tôt double tout`);
    assert.ok(hedge < constante('GAS_TIMEOUT_LECTURE_MS'), 'un doublon lancé après le plafond ne sert à rien');
  });

  await t.test('jamais de doublage d\'une écriture ni de checkPassword', () => {
    // Deux appendRow concurrents = atelier en double ; checkPassword doublé =
    // mot de passe mal tapé compté deux fois (blocage à 5).
    assert.ok(/const doubler\s*=\s*!ecriture && !GAS_SANS_DOUBLON\.has\(action\)/.test(SRC),
      'la décision de doubler doit exclure les écritures et GAS_SANS_DOUBLON');
    const m = /const GAS_SANS_DOUBLON = new Set\(\[([^\]]*)\]\)/.exec(SRC);
    assert.ok(m && m[1].includes("'checkPassword'"), 'checkPassword doit figurer dans GAS_SANS_DOUBLON');
  });

  await t.test('aucun plafond de 25 s ou 35 s ne subsiste', () => {
    assert.ok(!/GAS_TIMEOUT_MS/.test(SRC), 'GAS_TIMEOUT_MS (35 s/25 s) doit avoir disparu');
  });
});
