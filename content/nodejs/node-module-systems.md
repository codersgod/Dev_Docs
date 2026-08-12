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
// Individual exports
const add = (a, b) => a + b;
const sub = (a, b) => a - b;

// Package them all together onto module.exports
module.exports = { add, sub, defaultName: 'SuperCalc'}; // Acts as your default value

// main.js
// Import everything as one object
const math = require('./math.js');

console.log(math.defaultName); // Output: SuperCalc
console.log(math.add(2, 3));   // Output: 5

// Alternative: Destructure individual items immediately
const { add, defaultName } = require('./math.js');

```

- `require()` is synchronous — returns the cached export object.
- Works in `.js` files when `"type"` is absent or `"commonjs"`.

## ECMAScript Modules (ESM)

The official JS standard. Static, asynchronous, tree-shakeable.

```js
// math.mjs
// Individual (named) exports
export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;

// Default export (Only ONE per file)
const calculatorName = 'SuperCalc';
export default calculatorName;

// main.mjs
import calcName, { add, sub } from './math.mjs';
console.log(calcName); // Output: SuperCalc
console.log(add(2, 3)); // Output: 5
console.log(sub(5, 3)); // Output: 2
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
