---
title: "Async / Await"
category: "javascript"
chapterId: "js-async-runtime"
slug: "js-async-await"
description: "Sequential vs parallel execution, under-the-hood mechanics, and async error handling."
---

# Async / Await

## What is it?

`async/await` is **syntax built on top of Promises**. It makes async code look and behave like synchronous code — easier to read and maintain.

- `async` before a function means it **always returns a Promise**.
- `await` can only be used inside an `async` function. It **pauses execution at that line** until the Promise settles.

---

## How it works

```js
async function loadUser(id) {
  const res = await fetch(`/api/users/${id}`);
  const user = await res.json();
  return user; // automatically wrapped in a Promise
}
```

---

## Under the hood — not actually blocking

When the engine hits `await`:
1. It **pauses the function** and saves its execution context.
2. It **steps out** to run other code on the Call Stack.
3. Once the awaited Promise resolves, it **schedules the remainder** of the function into the **Microtask Queue**.

So `await` does not freeze the browser — it just yields control until the value is ready.

---

## Error handling — try/catch instead of .catch()

```js
async function loadUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed:', err.message);
    return null;
  }
}
```

---

## Sequential vs Parallel — the most common interview pitfall

### Sequential (slow — the waterfall effect)

```js
// Each await waits for the previous to finish — total: 4s
const user     = await fetchUser();     // 2s
const products = await fetchProducts(); // 2s (didn't start until user finished!)
```

### Parallel (fast — the correct approach)

If the two calls are **independent**, run them concurrently:

```js
// Both start at the same time — total: 2s
const [user, products] = await Promise.all([fetchUser(), fetchProducts()]);
```

> **Rule:** If task B does not depend on the result of task A, never `await` them one after the other. Use `Promise.all`.

---

## Top-level await (ES2022)

```js
// In ES Modules only (type="module")
const config = await fetch('/config.json').then(r => r.json());
```

---

## Senior pitfalls

### Sequential bottleneck (Waterfall Effect)

Overusing `await` in sequence makes independent tasks run one-by-one instead of concurrently — a major performance bug.

```js
// ❌ Slow — 4 seconds total
const a = await fetchA(); // 2s
const b = await fetchB(); // 2s

// ✅ Fast — 2 seconds total
const [a, b] = await Promise.all([fetchA(), fetchB()]);
```

### Await inside a loop

`await` in a `for...of` loop runs iterations **sequentially** — each one waits for the previous.

```js
// ❌ Sequential — slow
for (const id of ids) {
  const user = await fetchUser(id);
}

// ✅ Parallel — all requests fire at once
const users = await Promise.all(ids.map(id => fetchUser(id)));
```

### Async functions always return a Promise — easy to forget

```js
async function getUser() { return { name: 'Alice' }; }

const result = getUser(); // NOT { name: 'Alice' } — it's a Promise!
const user = await getUser(); // { name: 'Alice' } ✅
```

> ⚠️ **Warning:** Using `await` in a `for...of` loop runs iterations sequentially. Use `Promise.all(array.map(...))` when iterations are independent.