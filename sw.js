  const CACHE_NAME = 'carworld-cache-v1';
const urlsToCache = [
    '/CF/',
    '/CF/index.html',
    '/CF/icons/icon-192.png',
    '/CF/icons/icon-512.png'
];

// تثبيت الـ Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
});

// تخزين الملفات أول بأول
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
});
