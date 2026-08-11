---
title: "Event Loop Phases"
category: "nodejs"
chapterId: "node-architecture"
slug: "node-event-loop-phases"
description: "Timers, Pending Callbacks, Poll, Check, and Close Callbacks in order."
---

# Event Loop Phases

## What is it?

The Node.js event loop processes queued callbacks in ordered phases.

## Main phases

1. **Timers**: `setTimeout`, `setInterval`
2. **Pending Callbacks**: deferred I/O callbacks
3. **Poll**: retrieves new I/O events and executes I/O callbacks
4. **Check**: `setImmediate` callbacks
5. **Close Callbacks**: e.g. socket close handlers

### Phase details

| Phase | What runs |
|---|---|
| **Timers** | `setTimeout()` and `setInterval()` callbacks whose scheduled clock countdown threshold has been reached. |
| **Pending Callbacks** | Handles delayed internet or network error messages that the server didn't have time to fix during the last lap (e.g. TCP errors) |
| **Idle, Prepare** | Internal Node.js housekeeping — not accessible to user code |
| **Poll** | Fetches new I/O events (checks data, files, network requests have finished loading) ; waits here if no timers are pending and no new requests have arrived |
| **Check** | `setImmediate()` callbacks, designed to execute immediately after the Poll phase wraps up. |
| **Close Callbacks** | Cleanup handlers and memory freeing scripts, like `socket.on('close', ...)` |

## Example

```js
const fs = require('fs');

console.log('1. Main Script');

setTimeout(() => {
  console.log('5. setTimeout');
}, 0);

setImmediate(() => {
  console.log('6. setImmediate');
});

fs.readFile(__filename, () => {
  console.log('7. fs.readFile');
  
  setImmediate(() => console.log('9. Inner setImmediate'));
  setTimeout(() => console.log('10. Inner setTimeout'), 0);
});

const server = require('net').createServer().listen(0);
server.close();
server.on('close', () => {
  console.log('8. server.close');
});

process.nextTick(() => {
  console.log('2. process.nextTick');
});

Promise.resolve().then(() => {
  console.log('3. Promise.then');
});

console.log('4. End of Main Script');

//OUTPUT (example run):
1. Main Script
4. End of Main Script
2. process.nextTick
3. Promise.then
5. setTimeout         (Note: 5 and 6 order can fluctuate in the main script)
6. setImmediate
7. fs.readFile
9. Inner setImmediate
10. Inner setTimeout
8. server.close
```
## Timer Priority - Delay-Based Execution Rules (0ms vs 1ms)
1. **In the Main Script Result**: Unpredictable. If your CPU is ultra-fast (< 1ms), setImmediate prints first.  If your CPU lags slightly (> 1ms), setTimeout prints first

2. **Inside an Asynchronous Callback (File, Network, I/O)** 
- Result setImmediate always wins 100% of the time. 
- Inside an I/O callback, setImmediate always wins because the event loop finishes the Poll phase and moves directly into the Check phase next, leaving the Timers phase for the very end of the cycle..

## Important note

Inside an I/O callback, `setImmediate` usually runs before `setTimeout(..., 0)`.
