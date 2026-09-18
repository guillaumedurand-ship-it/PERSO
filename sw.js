const CACHE_NAME = 'gevraisiere-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/gevraisiere.html',
  '/checkout-quizz.html',
  '/tourism.html',
  '/chat-mode.html',
  '/checkout-options.html',
  '/histoire.html',
  '/manifest.webmanifest',
  '/new-index.png',
  '/garden-weather.js',
  '/hero-image.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Fallback if offline and not in cache, though basic assets should be.
        });

        return cachedResponse || fetchPromise;
      })
  );
});
