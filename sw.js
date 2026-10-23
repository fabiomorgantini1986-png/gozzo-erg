// Gozzo Erg – copia dell'app sul telefono per aprirla anche senza rete.
// Con la rete scarica sempre la versione aggiornata; senza rete usa la copia salvata.
const CACHE = 'gozzo-erg-v1';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html'])));
  self.skipWaiting();
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // tocca solo le pagine dell'app; l'archivio Google passa sempre dalla rete
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); }
        return r;
      })
      .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('./')))
  );
});
