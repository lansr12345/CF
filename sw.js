const CACHE_NAME = 'carworld-v4';
const urlsToCache = [
  '/CF/',
  '/CF/index.html',
  '/CF/cars.html',
  '/CF/about.html',
  '/CF/contact.html',
  '/CF/faq.html',
  '/CF/terms.html',
  '/CF/stats.html',
  '/CF/car-details.html',
  '/CF/script.js',
  '/CF/responsive.css',
  '/CF/manifest.json',
  '/CF/icons/icon-72.png',
  '/CF/icons/icon-96.png',
  '/CF/icons/android-chrome-192x192.png',
  '/CF/icons/android-chrome-512x512.png'
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// تفعيل وحذف الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استراتيجية: من الكاش أولاً ثم الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
