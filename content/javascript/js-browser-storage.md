---
title: "Browser Storage"
category: "javascript"
chapterId: "js-browser-apis"
slug: "js-browser-storage"
description: "LocalStorage, SessionStorage, IndexedDB, and Cookies compared."
---

# Browser Storage

## The four options

### LocalStorage

```js
localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');       // 'dark'
localStorage.removeItem('theme');
localStorage.clear();
```
- Persists until explicitly cleared
- ~5MB, strings only — JSON.stringify for objects
- Synchronous — blocks main thread for large data

### SessionStorage

Same API as LocalStorage, but cleared when the tab closes.

```js
sessionStorage.setItem('draftPost', JSON.stringify(draft));
```

### IndexedDB

Async, NoSQL database in the browser. Suitable for large structured data.

```js
const db = await new Promise((resolve, reject) => {
  const req = indexedDB.open('my-app', 1);
  req.onupgradeneeded = (e) => e.target.result.createObjectStore('users', { keyPath: 'id' });
  req.onsuccess = (e) => resolve(e.target.result);
  req.onerror = reject;
});
```

(Use the `idb` library for a promise-based wrapper.)

### Cookies

```js
document.cookie = 'token=abc; Path=/; Max-Age=3600; Secure; SameSite=Strict';
```
- Sent with every HTTP request (use for auth tokens)
- ~4KB limit
- HttpOnly cookies cannot be read by JS — safer for sensitive data

## Comparison

| | LocalStorage | SessionStorage | IndexedDB | Cookie |
|---|---|---|---|---|
| Capacity | ~5MB | ~5MB | 50MB+ | ~4KB |
| Persistence | Until cleared | Tab close | Until cleared | Expiry date |
| Sent to server | ❌ | ❌ | ❌ | ✅ |
| Accessible in JS | ✅ | ✅ | ✅ | ✅ (if not HttpOnly) |
| Async | ❌ | ❌ | ✅ | ❌ |

> ⚠️ **Warning:** Never store JWT access tokens in LocalStorage — XSS can steal them. Use HttpOnly cookies for auth tokens. Use LocalStorage only for non-sensitive UI preferences.
