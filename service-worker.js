const CACHE_NAME = 'todo-pwa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/script.js',
  '/quick-add.html',
  '/quick-add.js',
  '/manifest.webmanifest',
  '/icons/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())))
      .then(() => self.clients.claim())
  );
});

async function handleShareTarget(event) {
  try {
    const formData = await event.request.formData();
    const title = formData.get('title') || '';
    const text = formData.get('text') || '';
    const url = formData.get('url') || '';
    const combined = [title, text, url].filter(Boolean).join(' ').trim();
    const encoded = encodeURIComponent(combined || url || text || title || '');
    const targetUrl = `/quick-add.html?text=${encoded}`;

    event.waitUntil(self.clients.openWindow(targetUrl));

    return Response.redirect('/', 303);
  } catch (e) {
    return new Response('Share failed', { status: 500 });
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method === 'POST' && url.pathname === '/share-target') {
    event.respondWith(handleShareTarget(event));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return res;
      }).catch(() => cached))
    );
  }
});

