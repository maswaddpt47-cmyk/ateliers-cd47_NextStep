// Détecte les conflits de redéclaration entre fichiers chargés en séquence dans le navigateur.
// Ordre de chargement : utils.js → logic.js → shared.js → app.js / admin_app.js

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

function extractTopLevelConsts(src) {
  const names = [];
  for (const m of src.matchAll(/^(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)/gm)) {
    names.push(m[1]);
  }
  return names;
}

function findDuplicates(listA, listB) {
  const setA = new Set(listA);
  return listB.filter(n => setA.has(n));
}

const utils  = fs.readFileSync('./utils.js',      'utf8');
const logic  = fs.readFileSync('./logic.js',      'utf8');
const shared = fs.readFileSync('./shared.js',     'utf8');
const app    = fs.readFileSync('./app.js',        'utf8');
const admin  = fs.readFileSync('./admin_app.js',  'utf8');

const utilsConsts  = extractTopLevelConsts(utils);
const logicConsts  = extractTopLevelConsts(logic);
const sharedConsts = extractTopLevelConsts(shared);
const appConsts    = extractTopLevelConsts(app);
const adminConsts  = extractTopLevelConsts(admin);

// ── Conflits utils.js → logic.js ──────────────────────────────────────────────
describe('utils.js → logic.js : pas de redéclaration const/let', () => {
  it('aucune variable déclarée dans les deux fichiers', () => {
    const dups = findDuplicates(utilsConsts, logicConsts);
    assert.deepEqual(dups, [],
      `Redéclarations détectées : ${dups.join(', ')}`);
  });
});

// ── Conflits utils.js → shared.js ─────────────────────────────────────────────
describe('utils.js → shared.js : pas de redéclaration const/let', () => {
  it('aucune variable déclarée dans les deux fichiers', () => {
    const dups = findDuplicates(utilsConsts, sharedConsts);
    assert.deepEqual(dups, [],
      `Redéclarations détectées (SyntaxError navigateur) : ${dups.join(', ')}`);
  });
});

// ── Conflits logic.js → shared.js ─────────────────────────────────────────────
describe('logic.js → shared.js : pas de redéclaration const/let', () => {
  it('aucune variable déclarée dans les deux fichiers', () => {
    const dups = findDuplicates(logicConsts, sharedConsts);
    assert.deepEqual(dups, [],
      `Redéclarations détectées : ${dups.join(', ')}`);
  });
});

// ── Conflits utils.js → app.js ────────────────────────────────────────────────
describe('utils.js → app.js : pas de redéclaration const/let', () => {
  it('aucune variable déclarée dans les deux fichiers', () => {
    const dups = findDuplicates(utilsConsts, appConsts);
    assert.deepEqual(dups, [],
      `Redéclarations détectées : ${dups.join(', ')}`);
  });
});

// ── Conflits utils.js → admin_app.js ─────────────────────────────────────────
describe('utils.js → admin_app.js : pas de redéclaration const/let', () => {
  it('aucune variable déclarée dans les deux fichiers', () => {
    const dups = findDuplicates(utilsConsts, adminConsts);
    assert.deepEqual(dups, [],
      `Redéclarations détectées : ${dups.join(', ')}`);
  });
});

// ── Conflits logic.js → app.js ────────────────────────────────────────────────
describe('logic.js → app.js : pas de redéclaration const/let', () => {
  it('aucune variable déclarée dans les deux fichiers', () => {
    const dups = findDuplicates(logicConsts, appConsts);
    assert.deepEqual(dups, [],
      `Redéclarations détectées : ${dups.join(', ')}`);
  });
});

// ── Conflits logic.js → admin_app.js ─────────────────────────────────────────
describe('logic.js → admin_app.js : pas de redéclaration const/let', () => {
  it('aucune variable déclarée dans les deux fichiers', () => {
    const dups = findDuplicates(logicConsts, adminConsts);
    assert.deepEqual(dups, [],
      `Redéclarations détectées : ${dups.join(', ')}`);
  });
});

// ── Concurrence GAS : un seul point d'appel à getAll ─────────────────────────
// Plusieurs getAll simultanés au chargement gaspillent des exécutions GAS
// pour la même donnée et font expirer les timeouts ensemble en cas de lenteur.
// Tous les appels doivent passer par fetchAll() (shared.js), qui garantit un
// seul appel réseau en vol par année.
describe('getAll — un seul appel réseau (single-flight)', () => {
  it('shared.js définit window.fetchAll', () => {
    assert.match(shared, /window\.fetchAll\s*=/,
      'fetchAll manquant dans shared.js');
  });

  for (const [name, src] of [['app.js', app], ['admin_app.js', admin]]) {
    it(`${name} — aucun fetch("action=getAll") direct`, () => {
      const hits = src.split('\n')
        .map((l, i) => [i + 1, l])
        .filter(([, l]) => /action=getAll/.test(l));
      assert.deepEqual(hits.map(([n]) => n), [],
        `fetch getAll direct ligne(s) ${hits.map(([n]) => n).join(', ')} — utiliser fetchAll()`);
    });
  }

  it('admin_app.js — loadData attendu après authentification', () => {
    assert.match(admin, /if\(!auth\)\s*return;/,
      'les effets de chargement doivent être gardés par auth : sinon loadData ' +
      'épuise ses 3 tentatives pendant l\'écran de login et l\'erreur s\'affiche ' +
      'après une connexion réussie');
  });
});

// ── Syntaxe de chaque fichier ─────────────────────────────────────────────────
describe('syntaxe JS valide', () => {
  for (const [name, src] of [['utils.js', utils], ['logic.js', logic], ['shared.js', shared], ['app.js', app], ['admin_app.js', admin]]) {
    it(`${name} — pas d'erreur de syntaxe`, () => {
      assert.doesNotThrow(() => new Function(src), `Erreur de syntaxe dans ${name}`);
    });
  }
});
