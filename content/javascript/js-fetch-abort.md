---
title: "Fetch & AbortController"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-fetch-abort"
description: "Resilient data fetching, timeouts, cancellation, and WebSockets."
---

# Fetch & AbortController

## Basic Fetch

```js
const res = await fetch('/api/users');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const users = await res.json();
```

## AbortController — cancel a request

```js
const controller = new AbortController();

// Cancel after 5s timeout
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch('/api/data', { signal: controller.signal });
  const data = await res.json();
  clearTimeout(timeout);
  return data;
} catch (err) {
  if (err.name === 'AbortError') console.log('Request was cancelled');
  else throw err;
}
```

## Cancel on component unmount (React)

```js
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(err => { if (err.name !== 'AbortError') setError(err); });

  return () => controller.abort(); // cancel on unmount
}, []);
```

## WebSockets — persistent bidirectional connection

```js
const ws = new WebSocket('wss://api.example.com/live');

ws.onopen    = () => ws.send(JSON.stringify({ type: 'subscribe', channel: 'prices' }));
ws.onmessage = (e) => console.log('Received:', JSON.parse(e.data));
ws.onerror   = (e) => console.error('WS error:', e);
ws.onclose   = () => console.log('Disconnected');

// Send data
ws.send(JSON.stringify({ type: 'ping' }));

// Close cleanly
ws.close();
```

> ⚠️ **Warning:** Always cancel in-flight fetch requests when the user navigates away or a new search starts. Without AbortController, stale responses can overwrite fresh data (race condition).
