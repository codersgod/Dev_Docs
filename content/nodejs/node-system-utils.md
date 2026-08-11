---
title: "System & Utilities Modules"
category: "nodejs"
chapterId: "node-core-modules"
slug: "node-system-utils"
description: "path, url, os, and process — signals, exit codes, env vars."
---

# System & Utilities Modules

## What is it?

These built-in modules help with system-aware server code.

## Useful modules

- `path`: normalize and join file paths safely
- `url`: parse and build URLs
- `os`: CPU, memory, platform details
- `process`: args, env vars, PID, exit codes, signals

## Example

```js
import path from 'node:path';
import os from 'node:os';

console.log(path.join('logs', 'app.log'));
console.log(os.cpus().length);
console.log(process.env.NODE_ENV);
```

## Process signals

```js
process.on('SIGINT', () => {
  console.log('Graceful shutdown');
  process.exit(0);
});
```

## The path Module

**What it does:** Safely reformats file paths so your code runs flawlessly on Windows (uses `\`), Mac, and Linux (use `/`).
- `const path = require('path');`

**Methods breakdown:**
- `join()`: Glues path strings together using the host computer's correct slashes.
```js
path.join('users', 'admin', 'docs', 'file.txt'); => 'users/admin/docs/file.txt';
```
- `extname()` / `basename()` / `dirname()`: Extracts just the extension (`.js`), the file name (`index.html`), or parent folder location. 
```js
path.dirname('/users/admin/docs/file.txt'); => '/users/admin/docs'
```
- `parse()`: Breaks a path string down into a detailed object containing all its components.
```js
path.parse('/users/admin/docs/file.txt'); => { root: '/', dir: '/users/admin/docs', base: 'file.txt', ext: '.txt', name: 'file' }
```

## `process.cwd()`

**What it does:** Returns an absolute text path showing exactly where you launched your terminal application.

**Key Distinction:** Unlike `__dirname` (which points to where the file physically lives), `process.cwd()` points to the active folder directory where you typed the node startup command.

## Example of Core modules (fs, path, http, events, os, crypto)
```js
// HTTP: Creates a native web server to listen for browser requests
const http = require('http');
http.createServer((req, res) => res.end('Live API')).listen(3000);

// EVENTS: Sets up a custom listener system to trigger code when actions happen
const EventEmitter = require('events');
const emitter = new EventEmitter();
emitter.on('userLogin', (name) => console.log(`${name} logged in!`));
emitter.emit('userLogin', 'Alice');

// OS: Checks hardware specs of the computer hosting the app
const os = require('os');
console.log(`Available Memory: ${os.freemem() / 1024 / 1024} MB`);

// CRYPTO: Handles secure data hashing, encryption, and random token generation
const crypto = require('crypto');
const token = crypto.randomBytes(16).toString('hex');
console.log(token); // Output: Random secure string like 'a3f12...'
```