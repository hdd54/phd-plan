const CACHE = 'planbook-v1';
const STATIC_URLS = ['manifest.json','icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.map(k => { if(k !== CACHE) return caches.delete(k); })))
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // HTML: NetworkFirst — always get latest when online
  if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/phd-plan/')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  // Static assets: CacheFirst
  if (url.pathname.endsWith('.svg') || url.pathname.endsWith('.json')) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
    return;
  }
  // Everything else (API, fonts): NetworkOnly, no cache
  e.respondWith(fetch(e.request).catch(() => new Response(' Offline', {status: 503})));
});
