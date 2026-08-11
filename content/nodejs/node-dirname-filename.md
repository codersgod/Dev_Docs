---
title: "__dirname & __filename"
category: "nodejs"
chapterId: "node-modules-tooling"
slug: "node-dirname-filename"
description: "File path utilities injected by the module wrapper into every CommonJS module."
---

# __dirname & __filename

## What they are

Both are **string variables injected** by the CommonJS module wrapper function. They are available in every `.js` CJS module without any `require()`.

| Variable | Contains |
|---|---|
| `__filename` | Absolute path of the **current file** |
| `__dirname` | Absolute path of the **directory** containing the current file |

```js
// /home/user/app/src/utils.js

console.log(__filename); // /home/user/app/src/utils.js
console.log(__dirname);  // /home/user/app/src
```

## Common uses

### Build reliable cross-platform paths

```js
const path = require('path');

// Safe path join — works on Windows and Linux
const configPath = path.join(__dirname, '..', 'config', 'app.json');
// → /home/user/app/config/app.json
```

### Read files relative to the current module

```js
const fs = require('fs');
const path = require('path');

// Always relative to THIS file, not the cwd where node was launched
const template = fs.readFileSync(
  path.join(__dirname, 'templates', 'email.html'),
  'utf8'
);
```

### Serve static files in Express

```js
import express from 'express';
const app = express();

app.use('/static', express.static(path.join(__dirname, 'public')));
```

## Why not use relative paths directly?

A relative path like `'./config.json'` resolves relative to `process.cwd()` — **where the `node` command was run**, not where the file is. This breaks when you run the app from a different directory.

```js
// ❌ Breaks if you run: node src/app.js from the project root
fs.readFileSync('./config.json');

// ✅ Always works regardless of launch directory
fs.readFileSync(path.join(__dirname, 'config.json'));
```

## ESM equivalent

`__dirname` and `__filename` do **not exist** in ESM (`.mjs`) files. Use `import.meta.url`:

```js
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
```
