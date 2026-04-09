const CACHE_NAME = 'carworld-v2';
const urlsToCache = [
  '/CF/',
  '/CF/index.html',
  '/CF/cars.html',
  '/CF/about.html',
  '/CF/contact.html',
  '/CF/faq.html',
  '/CF/terms.html',
  '/CF/stats.html',
  '/CF/script.js',
  '/CF/responsive.css',
  '/CF/manifest.json',
  '/CF/icons/android-chrome-192x192.png',
  '/CF/icons/android-chrome-512x512.png'
];

// تثبيت الـ Service Worker وتخزين الملفات الأساسية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // تفعيل الـ SW فوراً
  );
});

// حذف الكاش القديم عند تفعيل SW جديد
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
    }).then(() => self.clients.claim()) // يتحكم في الصفحات المفتوحة حالياً
  );
});

// استراتيجية: cache-first ثم network (للملفات الثابتة)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إرجاع الملف من الكاش إذا وُجد
        if (response) {
          return response;
        }
        // وإلا جلب من الشبكة وتخزين نسخة للاستخدام المستقبلي
        return fetch(event.request).then(networkResponse => {
          // نُخزّن فقط الردود الصالحة (status 200) من نفس النطاق
          if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
  );
});
