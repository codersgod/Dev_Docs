---
title: "process Object"
category: "nodejs"
chapterId: "node-runtime-env"
slug: "node-process-object"
description: "Global access to env vars, CLI args, memory stats, and lifecycle hooks."
---

# process Object

## What is it?

`process` is a globally accessible object — no `require` needed. It provides programmatic control over the currently running Node.js process and acts as a bridge to the host operating system.

## Environment variables

```js
console.log(process.env.NODE_ENV);   // 'production'
console.log(process.env.PORT);       // '3000' (always a string)

const port = Number(process.env.PORT) || 3000;
```

## Command-line arguments

```bash
node app.js --port=3000 --debug
```

```js
console.log(process.argv);
// [
//   '/usr/local/bin/node',  // process.argv[0] — node executable
//   '/app/app.js',          // process.argv[1] — script path
//   '--port=3000',          // process.argv[2] — first user arg
//   '--debug'               // process.argv[3]
// ]
```

## Memory usage

```js
const mem = process.memoryUsage();
console.log(mem);
// {
//   rss: 30 MB,          — total process memory (Resident Set Size)
//   heapTotal: 10 MB,    — total V8 heap allocated
//   heapUsed: 6 MB,      — V8 heap in use
//   external: 1 MB,      — C++ objects bound to JS objects
//   arrayBuffers: 0 MB   — off-heap buffers
// }
```

## System info

```js
process.platform   // 'linux', 'darwin', 'win32'
process.arch       // 'x64', 'arm64'
process.version    // 'v20.11.0'
process.pid        // 12345
process.cwd()      // '/home/user/my-app'  (current working directory)
```

## Lifecycle hooks

```js
// Runs before any event loop phase (highest priority)
process.nextTick(() => console.log('next tick'));

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
  console.log('Shutting down...');
  db.close();
  process.exit(0);
});

// Last resort — catch unhandled errors
process.on('uncaughtException', (err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
```

## Exit codes

```js
process.exit(0);   // 0 = success
process.exit(1);   // 1 = general error (any non-zero = failure)
```
