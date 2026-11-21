/* Service Worker لإشعارات منصة طالب — يدعم الموبايل والحاسوب */
const STATE_CACHE = 'talib-sw-state-v1';
const STATE_URL = '/__talib_sw_state__';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

async function saveState(state) {
  try {
    const cache = await caches.open(STATE_CACHE);
    await cache.put(
      STATE_URL,
      new Response(JSON.stringify(state), { headers: { 'Content-Type': 'application/json' } })
    );
  } catch (e) {}
}

async function loadState() {
  try {
    const cache = await caches.open(STATE_CACHE);
    const res = await cache.match(STATE_URL);
    if (!res) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SYNC_STATE' && data.state) {
    event.waitUntil(saveState(data.state));
  } else if (data.type === 'SHOW_NOTIFICATION' && data.title) {
    event.waitUntil(
      self.registration.showNotification(data.title, data.options || {})
    );
  }
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'talib-posts-sync') {
    event.waitUntil(checkPostsFromSW());
  }
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { title: 'منصة طالب — منشور جديد', body: event.data ? event.data.text() : '' };
  }
  const title = payload.title || 'منصة طالب';
  const options = payload.options || {
    body: payload.body || 'تم نشر منشور جديد في المجتمع',
    dir: 'rtl',
    lang: 'ar',
    data: { postId: payload.postId || '', url: './community.html#feed' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

async function checkPostsFromSW() {
  try {
    const st = await loadState();
    if (!st || !st.registered || !st.sheetId || !st.postSheet) return;
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of clients) {
      c.postMessage({ type: 'TRIGGER_POLL' });
    }
  } catch (e) {}
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const postId = data.postId || '';
  const targetUrl =
    data.url && !String(data.url).startsWith('#')
      ? data.url
      : postId
        ? './community.html?post=' + encodeURIComponent(postId) + '#feed'
        : './community.html#feed';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const communityClient = clients.find((c) => c.url && c.url.includes('community.html'));
      if (communityClient && 'focus' in communityClient) {
        return communityClient.focus().then(() => {
          communityClient.postMessage({ type: 'OPEN_POST', postId });
        });
      }
      if (clients.length && 'navigate' in clients[0]) {
        return clients[0].navigate(targetUrl).then((c) => c && c.focus && c.focus());
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
