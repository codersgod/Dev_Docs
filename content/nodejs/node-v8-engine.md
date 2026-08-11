---
title: "V8 Engine & JIT"
category: "nodejs"
chapterId: "node-architecture"
slug: "node-v8-engine"
description: "JIT compilation, memory heap, call stack, and garbage collection."
---

# V8 Engine & JIT

## What is it?

Node.js runs JavaScript using the **V8 engine** (from Chrome). V8 converts JS into machine code using **JIT (Just-In-Time) compilation** so code runs much faster than pure interpretation.

## Core pieces

- **Call Stack**: Where function calls execute (one frame at a time).
- **Memory Heap**: Where objects, arrays, and closures are stored.
- **JIT Compiler**: Optimizes hot code paths while the program is running.
- **Garbage Collector**: Frees memory that is no longer reachable.

## Example

```js
function sum(a, b) {
  return a + b;
}

for (let i = 0; i < 1_000_000; i++) {
  sum(i, i + 1);
}
```

The repeated function call pattern helps V8 optimize this function over time.

## Why it matters in Node.js

- CPU-heavy loops can still block the event loop.
- Object allocation patterns affect memory usage and GC pauses.
- Stable data shapes help V8 optimize better.
