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

## ESM — supported / CommonJS — not supported

```js
// ====== ESM (Supported) ======
// Filename: data.mjs (or set "type": "module" in package.json)

const response = await fetch('https://api.example.com/data');
const data = await response.json();

export { data }; 
// Note: Importers will automatically pause and wait until this resolves.


// ====== CommonJS (NOT Supported) ======
// Filename: data.js (Legacy format)

// ❌ This throws a SyntaxError: 'await' is only valid in async functions
const data = await fetch('https://api.example.com/data'); 


// ====== CommonJS Workaround ======
// Use an Asynchronous IIFE wrapper to make it work:

(async () => {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
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
- If you have a standard index.js file, you just need to add one line to your project's package.json file:

```json
"type": "module"
```

Once that is added, every standard .js file in your project automatically gains support for top-level await.
- A slow top-level await blocks all importers — keep startup logic fast.
