---
title: "Event Loop Overview"
category: "nodejs"
chapterId: "node-fundamentals"
slug: "node-event-loop-overview"
description: "The 6 phases of the event loop and microtask queues between each phase."
---

# Event Loop Overview

## What is the Event Loop?

The event loop is the core mechanism that enables Node.js to perform non-blocking I/O on a single thread. It continuously checks for pending work and executes callbacks in a defined order.

## The 6 phases

```
   ┌──────────────────────────┐
┌─>│  1. Timers               │  setTimeout / setInterval callbacks
│  └──────────────┬───────────┘
│                 │ ← microtasks flush here
│  ┌──────────────▼───────────┐
│  │  2. Pending Callbacks    │  I/O error callbacks from previous tick
│  └──────────────┬───────────┘
│                 │ ← microtasks flush here
│  ┌──────────────▼───────────┐
│  │  3. Idle, Prepare        │  Internal engine use only
│  └──────────────┬───────────┘
│                 │ ← microtasks flush here
│  ┌──────────────▼───────────┐
│  │  4. Poll                 │  Retrieve new I/O events; blocks here
│  └──────────────┬───────────┘  if no timers are scheduled
│                 │ ← microtasks flush here
│  ┌──────────────▼───────────┐
│  │  5. Check                │  setImmediate() callbacks
│  └──────────────┬───────────┘
│                 │ ← microtasks flush here
│  ┌──────────────▼───────────┐
│  │  6. Close Callbacks      │  socket.on('close', ...) etc.
└──└──────────────────────────┘
```

## Microtasks — between every phase

Before moving to the next phase, Node.js drains two high-priority queues:

1. **`process.nextTick()`** — runs first, always before Promises
2. **Promise callbacks** (`then`, `catch`, `async/await`) — runs second

```js
setTimeout(() => console.log('1 - Timer'), 0);
Promise.resolve().then(() => console.log('2 - Promise'));
process.nextTick(() => console.log('3 - nextTick'));

// Output:
// 3 - nextTick
// 2 - Promise
// 1 - Timer
```

Microtasks always finish before the event loop advances to the next phase.
