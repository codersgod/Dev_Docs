---
title: "Error Propagation"
category: "nodejs"
chapterId: "node-async-control"
slug: "node-error-propagation"
description: "Sync try/catch vs async promise rejections and event-based errors."
---

# Error Propagation

## Synchronous errors — try/catch

```js
try {
  JSON.parse('bad json');
} catch (err) {
  console.error('Caught sync error:', err.message);
}
```

## Async errors — Promises

Unhandled promise rejections crash the process in modern Node.js.

```js
async function run() {
  try {
    await fetchData();
  } catch (err) {
    console.error('Async error:', err.message);
  }
}
```

Alternatively, handle globally as a last resort:

```js
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
```

## Event-based errors

`EventEmitter` emits `'error'` events. If nothing listens, it throws.

```js
const emitter = new EventEmitter();

emitter.on('error', (err) => {
  console.error('Emitter error:', err.message);
});

emitter.emit('error', new Error('something went wrong'));
```

## Error-first callbacks

The Node.js convention for callback-based APIs:

```js
function readConfig(path, callback) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) return callback(err);
    callback(null, JSON.parse(data));
  });
}
```

## Key rules

- Always attach an `'error'` listener to `EventEmitter` instances.
- Never swallow errors with empty `catch` blocks.
- Use `process.on('uncaughtException')` only for cleanup, not recovery.
