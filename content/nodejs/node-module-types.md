---
title: "Core vs Local vs Third-Party Modules"
category: "nodejs"
chapterId: "node-modules-tooling"
slug: "node-module-types"
description: "The three tiers of Node.js modules — built-in, project files, and npm packages."
---

# Core vs Local vs Third-Party Modules

## The three tiers

Node.js resolves modules in a strict order based on the string passed to `require()` or `import`.

### 1. Core Modules

Built into the Node.js runtime itself — pre-compiled C++ binaries. No installation needed, available anywhere.

```js
const fs      = require('fs');       // file system
const path    = require('path');     // path manipulation
const http    = require('http');     // HTTP server
const crypto  = require('crypto');   // encryption / hashing
const os      = require('os');       // system info
const events  = require('events');   // EventEmitter
```

- Resolved **first** — before looking at `node_modules`.
- Prefix with `node:` to be explicit (recommended):

```js
import { readFile } from 'node:fs/promises';
```

### 2. Local Modules

Files you write within your project. Identified by a relative path starting with `./` or `../`.

```js
const utils    = require('./utils');          // same directory
const config   = require('../config/app');    // parent directory
const { db }   = require('./lib/database');
```

Node.js tries these extensions in order: `.js` → `.json` → `.node` → `index.js`.

### 3. Third-Party Modules

Installed from the npm registry into `node_modules`. Referenced by package name — no path prefix.

```bash
npm install express lodash zod
```

```js
const express = require('express');
const _       = require('lodash');
const { z }   = require('zod');
```

Node.js walks up the directory tree searching for `node_modules/` until it finds the package or reaches the root.

## Resolution order summary

```
require('x')
  1. Is 'x' a core module?  → return it immediately
  2. Does 'x' start with ./ or ../? → load local file
  3. Otherwise → search node_modules/ up the tree
```

## Comparison

| | Core | Local | Third-Party |
|---|---|---|---|
| Source | Node.js binary | Your code | npm registry |
| Install required | No | No | Yes (`npm install`) |
| Path prefix | None | `./` or `../` | None |
| Versioned | Node.js version | Git | `package.json` |
