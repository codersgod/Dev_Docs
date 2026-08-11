---
title: "Module Systems"
category: "nodejs"
chapterId: "node-modules-tooling"
slug: "node-module-systems"
description: "CommonJS (require/module.exports) vs ECMAScript Modules (import/export)."
---

# Module Systems
- **CommonJS**: Works like a paused book. Node stops everything, reads the imported file completely, and only then moves to the next line of code.
- **ESM**: Works like a map layout. Node looks at the whole import structure first, figures out how everything connects, and then runs the code without freezing the system.

## CommonJS (CJS)

The original Node.js module system. Synchronous, runtime-evaluated.

```js
// math.js
function add(a, b) { return a + b; }
module.exports = { add };

// main.js
const { add } = require('./math');
console.log(add(2, 3)); // 5
```

- `require()` is synchronous — returns the cached export object.
- Works in `.js` files when `"type"` is absent or `"commonjs"`.

## ECMAScript Modules (ESM)

The official JS standard. Static, asynchronous, tree-shakeable.

```js
// math.mjs
export function add(a, b) { return a + b; }

// main.mjs
import { add } from './math.mjs';
console.log(add(2, 3)); // 5
```

- Use `.mjs` extension or set `"type": "module"` in `package.json`.
- Supports top-level `await`.
- Imports are live bindings, not copies.

## Key differences

| Feature | CJS | ESM |
|---|---|---|
| Syntax | `require` / `exports` | `import` / `export` |
| Timing | Synchronous | Asynchronous |
| Top-level await | No | Yes |
| Tree-shaking | No | Yes |
| `__dirname` / `__filename` | Available | Use `import.meta.url` |

```js
// ESM equivalent of __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
```
