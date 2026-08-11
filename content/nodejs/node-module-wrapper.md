---
title: "Module Wrapper Function"
category: "nodejs"
chapterId: "node-modules-tooling"
slug: "node-module-wrapper"
description: "The invisible function Node.js wraps every CommonJS file in before executing it."
---

# Module Wrapper Function

## What is it?

Before Node.js executes any CommonJS file, it wraps the entire code in an **invisible internal function**:

```js
(function(exports, require, module, __filename, __dirname) {
  // Your module code lives here
});
```

You never see this wrapper — Node applies it automatically at load time.

## Why does it exist?

### 1. Scope isolation

Without the wrapper, every `var` and `function` declaration in a file would leak into the **global scope**, causing naming collisions across modules.

```js
// Without wrapper — pollutes global
var secret = 'oops';  // global.secret now exists

// With wrapper — stays inside the function scope
var secret = 'safe';  // invisible outside this module
```

### 2. Injects 5 local variables

The wrapper function's **parameters** give every module access to five built-in variables without any `require()`:

| Variable | What it provides |
|---|---|
| `exports` | Shortcut reference to `module.exports` |
| `require` | Function to load other modules |
| `module` | The current module object (holds `module.exports`) |
| `__filename` | Absolute path of the current file |
| `__dirname` | Absolute path of the current file's directory |

```js
// You can use all five anywhere in a CJS module — they're injected
console.log(__filename); // /home/user/app/src/utils.js
console.log(__dirname);  // /home/user/app/src
```

## Proof it exists

```js
console.log(arguments.length); // 5 — the five injected parameters
```

Or inspect it:

```js
// wrapper function has a .toString() form Node exposes via:
const Module = require('module');
console.log(Module.wrapper);
// [
//   '(function(exports, require, module, __filename, __dirname) { ',
//   '\n});'
// ]
```

## ESM does not use this wrapper

ECMAScript Modules have their own static scope system. `__dirname` and `__filename` are **not available** in `.mjs` files — use `import.meta.url` instead:

```js
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
```
