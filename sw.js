// Service worker de DÉSINSTALLATION — ne pas supprimer ce fichier.
//
// Les pages ne sont plus installables en PWA depuis le 24/09/2026 (AG-012,
// décision de l'utilisateur : l'usage nomade passe par le navigateur). Les
// pages n'enregistrent plus aucun service worker ; mais un appareil où
// l'ancien sw.js est déjà installé revérifie ce fichier en naviguant dans sa
// portée. Il reçoit alors celui-ci, qui s'active et se désinscrit aussitôt.
//
// À garder publié SANS DATE DE FIN : on ne saura jamais quand le dernier
// appareil est repassé, et un 404 à la vérification ne garantit pas la
// désinscription (réponse B d'AG-012, point 4).
//
// ⚠️ Ne JAMAIS remplacer ceci par une désinscription depuis la page
// (navigator.serviceWorker.getRegistrations() puis unregister() sur chacune) :
// NEWGEN, NextStep et GDINV2 partagent l'origine maswaddpt47-cmyk.github.io,
// la page désinscrirait aussi les service workers des autres applis.
// self.registration ne vise que la portée de CE fichier.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => { self.registration.unregister(); });
