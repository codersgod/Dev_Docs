---
title: "Blocking vs Non-Blocking"
category: "nodejs"
chapterId: "node-fundamentals"
slug: "node-blocking-nonblocking"
description: "Async execution avoids freezing the single-threaded event loop."
---

# Blocking vs Non-Blocking

## Blocking

A **blocking** operation freezes the single-threaded event loop. While it runs, **all other code and incoming requests must wait**.

```js
const fs = require('fs');

// Blocking — reads entire file before moving on
const data = fs.readFileSync('big-file.txt', 'utf8');
console.log(data);
console.log('This only prints after the file is fully read');
```

During `readFileSync`, the event loop is stuck (**Synchronous**). No other requests can be handled.

## Non-Blocking

A **non-blocking** operation hands the task to the background (libuv thread pool) and **returns immediately**, allowing the event loop to keep working.

```js
const fs = require('fs');

// Non-blocking — hands off to libuv, event loop stays free
fs.readFile('big-file.txt', 'utf8', (err, data) => {
  console.log(data); // called when ready
});

console.log('This prints immediately, before the file is read');
```
During `readFile`, the event loop is **not** stuck (**Asynchronous**). Other requests can be handled immediately.

## Side-by-side comparison

| | Blocking | Non-Blocking |
|---|---|---|
| Event loop | Frozen | Free |
| Other requests | Wait | Handled immediately |
| API style | `readFileSync` | `readFile` + callback / Promise |
| Use case | Simple scripts | Production servers |

## When is blocking acceptable?

- **Startup scripts** — reading a config file once before the server starts is fine.
- **CLI tools** — a single-user script has no concurrent requests to block.

Never use blocking I/O **inside a request handler** in a running server.

```js
// ❌ Blocks every incoming request while this one reads a file
app.get('/data', (req, res) => {
  const data = fs.readFileSync('file.txt'); // danger
  res.send(data);
});

// ✅ Event loop stays free
app.get('/data', async (req, res) => {
  const data = await fs.promises.readFile('file.txt');
  res.send(data);
});
```
## How node js handles blocking and non-blocking operations
```
[ Clients ] ---> [ Request ] ---> [ Event Queue ]
                                       │
                                 ( Sequential )
                                       ▼
                              [   Event Loop   ]  ◄─── (Main Thread)
                                ╱            ╲
                     (Simple / Non-Blocking)  (Complex / Blocking)
                              ╱                ╲
                             ▼                  ▼
                     [ Handled Immed. ]   [ Libuv Thread Pool ]
                             │                  │
                             │            (File I/O, Crypto, etc)
                             │                  │
                             ▼                  ▼
                     [ Send Response ] ◄── [ Callback Queue ]
```
