// Service worker minimal — sert uniquement à rendre le site installable en PWA
// sur Android (certaines versions de Chrome exigent un service worker
// enregistré, avec un handler 'fetch' présent, pour proposer
// "Installer l'application" plutôt que le simple raccourci navigateur).
//
// Il ne met VOLONTAIREMENT rien en cache et n'intercepte VOLONTAIREMENT
// aucune requête (pas d'event.respondWith) :
// 1. Le site a un système de cache-busting explicite (`?v=N` sur
//    app.css/utils.js/shared.js/app.js/..., voir CLAUDE.md) qui a déjà causé
//    un incident en production (correctif invisible sur des postes avec
//    l'ancienne version en cache, 16/09/2026). Un SW qui mettrait les
//    fichiers en cache-first recréerait ce problème, en pire.
// 2. Un SW qui répond lui-même à une requête (respondWith(fetch(...)))
//    la ré-émet depuis le contexte du service worker, hors de portée du
//    mock réseau des tests e2e (page.route() sur **/script.google.com/**
//    dans e2e/smoke.test.js) — confirmé en local le 19/09/2026 : avec
//    respondWith, les 22 tests du smoke test échouaient tous à la
//    connexion (checkPassword mocké jamais reçu) ; sans respondWith,
//    les 22 passent. Ne pas ajouter respondWith() ici sans revalider
//    toute la suite e2e.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Ne rien faire : laisser le navigateur traiter la requête normalement.
});
