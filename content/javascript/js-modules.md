---
title: "Modules"
category: "javascript"
chapterId: "js-oop-patterns"
slug: "js-modules"
description: "CommonJS (require) vs ES Modules (import/export) differences."
---

# Modules

## What is it?

Modules let you split code into reusable files with explicit imports and exports.

## CommonJS (CJS) — Node.js default

```js
// math.js
function add(a, b) { return a + b; }
module.exports = { add };

// app.js
const { add } = require('./math');
console.log(add(2, 3)); // 5
```

## ES Modules (ESM) — browser and modern Node.js

```js
// math.js
export function add(a, b) { return a + b; }
export const PI = 3.14;
export default class Calculator {} // one default per file

// app.js
import Calculator, { add, PI } from './math.js';
import * as Math from './math.js'; // namespace import
```

## Key differences

| | CommonJS | ES Modules |
|---|---|---|
| Syntax | `require` / `module.exports` | `import` / `export` |
| Loading | Dynamic, synchronous | Static, asynchronous |
| Tree-shaking | ❌ No | ✅ Yes |
| Top-level await | ❌ No | ✅ Yes |
| `this` at top level | `module.exports` | `undefined` |
| File extension | `.js` | `.mjs` or `type: "module"` |

## Dynamic import (lazy loading)

```js
// Load a module on demand
const { add } = await import('./math.js');
```

> ⚠️ **Warning:** You cannot use `import` inside a CommonJS file or `require` inside an ESM file. Pick one system per project — modern projects should use ESM.
