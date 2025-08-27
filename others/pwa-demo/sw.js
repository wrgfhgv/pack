// 缓存版本
const CACHE_VERSION = 'v2';
// 需要缓存的静态资源
const CACHE_ASSETS = ['/', 'index.html', 'manifest.json', 'icon.png'];

// 安装阶段：缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(`my-pwa-${CACHE_VERSION}`)
      .then(cache => {
        cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting()), // 强制激活新的SW
  );
});

// 激活阶段：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== `my-pwa-${CACHE_VERSION}`)
            .map(name => caches.delete(name)),
        );
      })
      .then(() => self.clients.claim()), // 控制所有打开的页面
  );
});

// 拦截请求：优先使用缓存，无缓存则联网
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 缓存命中则返回缓存，否则发起网络请求
      return response || fetch(event.request);
    }),
  );
});
