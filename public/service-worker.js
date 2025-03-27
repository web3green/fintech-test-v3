
// Service Worker для контроля кеширования
// Версия: 1.0.0 (обновляйте версию при изменении логики)

// Уникальный идентификатор кеша
const CACHE_NAME = `app-cache-${new Date().toISOString()}`;

// Список ресурсов, которые мы хотим предварительно кешировать
const urlsToCache = [
  '/',
  '/index.html'
];

// Установка service worker и предварительное кеширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Кеширование файлов');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация нового service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Удаляем старые кеши
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Очистка старого кеша', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Активирован и контролирует страницу');
      return self.clients.claim();
    })
  );
});

// Стратегия перехвата и обработки запросов
self.addEventListener('fetch', event => {
  // Добавляем метку времени к URL для предотвращения кеширования
  const url = new URL(event.request.url);
  
  // Не изменяем запросы к API или другим доменам
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Добавляем параметр времени к GET запросам
  if (event.request.method === 'GET') {
    url.searchParams.set('_sw_cache', Date.now());
    
    // Создаем новый запрос с обновленным URL
    const noCacheRequest = new Request(url.toString(), {
      method: event.request.method,
      headers: event.request.headers,
      mode: event.request.mode,
      credentials: event.request.credentials,
      redirect: event.request.redirect
    });
    
    event.respondWith(
      fetch(noCacheRequest).catch(() => {
        // В случае ошибки сети, попробуем получить из кеша
        return caches.match(event.request);
      })
    );
  }
});

// Обработка сообщений от клиента
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        console.log('Service Worker: Все кеши очищены по запросу');
      })
    );
  }
});
