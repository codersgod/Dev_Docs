---
title: "Module Caching"
category: "nodejs"
chapterId: "node-modules-tooling"
slug: "node-module-caching"
description: "Loaded modules are cached in require.cache — acting like a singleton."
---

# Module Caching

## How it works

The first time you `require()` a module:

1. Node.js reads the file from disk.
2. Wraps and compiles it through V8.
3. Executes the module code.
4. Stores the result in **`require.cache`**.

Every subsequent `require()` for the same file **returns the cached export object** — no re-reading, no re-execution.

```js
// counter.js
let count = 0;
exports.increment = () => ++count;
exports.getCount  = () => count;
```

```js
// main.js
const a = require('./counter');
const b = require('./counter'); // same cached instance

a.increment();
a.increment();

console.log(b.getCount()); // 2 — b and a are the same object
```

`a === b` is `true`. This is the **singleton pattern** — one shared instance for the entire process.

## Inspecting the cache

```js
console.log(require.cache);
// {
//   '/app/counter.js': Module { id, filename, loaded, exports, ... },
//   '/app/node_modules/lodash/lodash.js': Module { ... },
//   ...
// }
```

## Clearing the cache (testing / hot-reload)

```js
delete require.cache[require.resolve('./counter')];
const fresh = require('./counter'); // re-loaded from disk
```

Useful in tests when you need a fresh module state between test cases.

## Implications

- **Side effects run once** — if a module logs or connects to a DB on load, it only happens on the first `require()`.
- **Shared state** — any mutable state inside a module is shared across all files that import it.
- **Memory** — modules stay in `require.cache` for the lifetime of the process.

## ESM caching

ESM also caches modules, but the cache is managed by the engine's module graph — you cannot manually clear it at runtime.
