---
title: "Web Workers & Service Workers"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-workers"
description: "Off-main-thread execution and offline caching strategies."
---

# Web Workers & Service Workers

## Web Workers — off-main-thread computation

Run CPU-heavy code without blocking the UI thread. No DOM access.

```js
// worker.js
self.onmessage = function(e) {
  const result = heavyComputation(e.data); // runs off main thread
  self.postMessage(result);
};

// main.js
const worker = new Worker('./worker.js');
worker.postMessage(largeDataset);
worker.onmessage = (e) => console.log('Result:', e.data);
worker.terminate(); // clean up when done
```

**Use for:** image processing, large data parsing, cryptography, sorting huge arrays.

## Service Workers — offline and cache control

A proxy between your app and the network. Intercepts fetch requests.

```js
// service-worker.js
const CACHE = 'v1';
const ASSETS = ['/', '/index.html', '/app.js', '/style.css'];

// Install — cache static assets
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// main.js — register
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

## Comparison

| | Web Worker | Service Worker |
|---|---|---|
| Purpose | Heavy computation | Network interception, caching |
| DOM access | ❌ | ❌ |
| Lifetime | Tab lifetime | Background, survives tab close |
| Scope | One page | Origin-wide |

> ⚠️ **Warning:** Cached service worker files can get stuck. Always update the cache name version string when deploying new assets, and handle the `activate` event to delete old caches.
