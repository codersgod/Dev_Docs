---
title: "Top-Level Await"
category: "nodejs"
chapterId: "node-async-control"
slug: "node-top-level-await"
description: "Usage constraints in ESM vs CommonJS modules."
---

# Top-Level Await

## What is it?

`await` used directly at the module's top level — outside any `async` function.

## ESM — supported

```js
// data.mjs  (or "type": "module" in package.json)
const response = await fetch('https://api.example.com/data');
const data = await response.json();
export { data };
```

The module pauses loading until the awaited value resolves. Importers automatically wait.

## CommonJS — not supported

```js
// ❌ This throws in CJS
const data = await fetch('...');
```

Workaround: wrap in an IIFE:

```js
(async () => {
  const data = await fetch('...');
  console.log(data);
})();
```

## Practical use cases

- Loading config files before the app starts.
- Connecting to a database at startup.
- Seeding initial data conditionally.

```js
// startup.mjs
const config = await loadConfig('./config.json');
const db = await connectDB(config.dbUrl);

export { db };
```

## Key rules

- Only works in `.mjs` files or when `"type": "module"` is set in `package.json`.
- A slow top-level await blocks all importers — keep startup logic fast.
