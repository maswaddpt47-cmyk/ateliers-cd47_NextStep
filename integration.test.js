// Détecte les conflits de redéclaration entre fichiers chargés en séquence dans le navigateur.
// Simule l'ordre de chargement : utils.js → shared.js → app.js / admin_app.js

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

function extractTopLevelConsts(src) {
  const names = [];
  // const X = ... ou const X, Y = ...
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
const shared = fs.readFileSync('./shared.js',     'utf8');
const app    = fs.readFileSync('./app.js',        'utf8');
const admin  = fs.readFileSync('./admin_app.js',  'utf8');

const utilsConsts  = extractTopLevelConsts(utils);
const sharedConsts = extractTopLevelConsts(shared);
const appConsts    = extractTopLevelConsts(app);
const adminConsts  = extractTopLevelConsts(admin);

// ── Conflits utils.js → shared.js ─────────────────────────────────────────────
describe('utils.js → shared.js : pas de redéclaration const/let', () => {
  it('aucune variable déclarée dans les deux fichiers', () => {
    const dups = findDuplicates(utilsConsts, sharedConsts);
    assert.deepEqual(dups, [],
      `Redéclarations détectées (SyntaxError navigateur) : ${dups.join(', ')}`);
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

// ── Syntaxe de chaque fichier ─────────────────────────────────────────────────
describe('syntaxe JS valide', () => {
  for (const [name, src] of [['utils.js', utils], ['shared.js', shared], ['app.js', app], ['admin_app.js', admin]]) {
    it(`${name} — pas d'erreur de syntaxe`, () => {
      assert.doesNotThrow(() => new Function(src), `Erreur de syntaxe dans ${name}`);
    });
  }
});
