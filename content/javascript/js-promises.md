---
title: "Promises"
category: "javascript"
chapterId: "js-async-runtime"
slug: "js-promises"
description: "States, chaining, combinators, and memory behaviour."
---

# Promises

## What is it?

A **Promise** is a JavaScript object representing the eventual completion or failure of an async operation. Think of it as a **placeholder for a value that is not available yet**.

Promises are **immutable once settled** — their state cannot change after resolving or rejecting.

---

## The 3 States

| State | Meaning | Triggers |
|---|---|---|
| `pending` | Operation still running | — |
| `fulfilled` | Completed successfully | `.then()` |
| `rejected` | Failed with an error | `.catch()` |

---

## Basic usage

```js
const fetchUser = (id) => new Promise((resolve, reject) => {
  if (id > 0) resolve({ id, name: 'Alice' });
  else reject(new Error('Invalid ID'));
});

fetchUser(1)
  .then(user => console.log(user.name))  // 'Alice'
  .catch(err => console.error(err))
  .finally(() => console.log('done'));   // always runs regardless of outcome
```

---

## Built-in Promise methods

### Instance methods (on a Promise object)

| Method | What it does |
|---|---|
| `.then(onFulfilled, onRejected)` | Handles success (and optionally rejection) |
| `.catch(onRejected)` | Handles rejection — shorthand for `.then(null, fn)` |
| `.finally(onFinally)` | Runs regardless of outcome — useful for cleanup |

### Chaining

```js
fetch('/api/users/1')
  .then(res => res.json())
  .then(user => fetch(`/api/posts?userId=${user.id}`))
  .then(res => res.json())
  .then(posts => console.log(posts))
  .catch(err => console.error(err)); // catches any error in the entire chain
```

---

## Static combinators

```js
const p1 = fetch('/api/a').then(r => r.json());
const p2 = fetch('/api/b').then(r => r.json());
const p3 = fetch('/api/c').then(r => r.json());

Promise.all([p1, p2, p3]);         // wait for all — fails fast on first rejection
Promise.allSettled([p1, p2, p3]);  // wait for all — never rejects, reports each outcome
Promise.race([p1, p2, p3]);        // first to settle wins (resolved or rejected)
Promise.any([p1, p2, p3]);         // first to FULFILL wins — rejects only if ALL fail
```

| Method | Resolves when | Rejects when |
|---|---|---|
| `Promise.all` | All fulfill | Any one rejects — fails fast |
| `Promise.allSettled` | All settle (any outcome) | Never |
| `Promise.race` | First to settle | First to reject |
| `Promise.any` | First to fulfill | All reject |

### allSettled result shape

```js
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.error(r.reason);
});
```

### Other static methods

| Method | What it does |
|---|---|
| `Promise.resolve(value)` | Returns an already-fulfilled Promise |
| `Promise.reject(reason)` | Returns an already-rejected Promise |

---

## How Promises use memory

Promises execute their resolution handlers via the **Microtask Queue** — not the Macrotask Queue. This means `.then()` callbacks run before any `setTimeout` callbacks, ensuring fast resolution without blocking the main thread.

Promises also retain references to their resolve/reject callbacks and any closure variables **until they settle**. A Promise stuck in `pending` indefinitely is a memory leak.

---

## Senior pitfalls

### Unhandled rejections

If an async function rejects and there is no `.catch()` or `try/catch`, it triggers `unhandledrejection` in the browser — can crash parts of your UI or cause silent data corruption.

```js
// ❌ Unhandled rejection
fetch('/api/data').then(r => r.json()); // what if this fails?

// ✅ Always handle
fetch('/api/data')
  .then(r => r.json())
  .catch(err => console.error('Failed:', err));

// ✅ Global safety net for anything missed
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled:', e.reason);
});
```

### Memory leak from long-lived pending Promises

A Promise stuck in `pending` (e.g., waiting for a WebSocket event that never comes) keeps its closure variables alive — GC cannot clean them up.

```js
// ❌ Leaks if the WebSocket never fires
const p = new Promise(resolve => {
  socket.on('message', resolve); // pending forever if no message
});

// ✅ Force-reject stale promises with a timeout race
const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
]);
```

> ⚠️ **Warning:** Know the difference between `Promise.all` (fails fast if ONE rejects) and `Promise.allSettled` (waits for ALL, reports each outcome). This is a common senior interview question.