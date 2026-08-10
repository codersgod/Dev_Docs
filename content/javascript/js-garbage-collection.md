---
title: "Garbage Collection"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-garbage-collection"
description: "Mark-and-sweep, memory leaks, and profiling."
---

# Garbage Collection

## What is it?

JS automatically frees memory that is no longer reachable — this is **garbage collection**. The main algorithm is **mark-and-sweep**: the GC starts from the root (global object), marks all reachable objects, then sweeps (frees) everything unmarked.

## Common memory leaks

```js
// 1. Forgotten timers — keeps callback + closure alive forever
const data = fetchLargeData();
setInterval(() => process(data), 1000);
// Fix: store the id and clearInterval when done

// 2. Detached DOM nodes — removed from DOM but still referenced in JS
let el = document.getElementById('modal');
document.body.removeChild(el);
// el still holds reference — not garbage collected
el = null; // Fix: explicitly clear the reference

// 3. Global variables — never GC'd
function leaky() {
  oops = 'this becomes global'; // forgot var/let/const
}

// 4. Closures holding large data
function process() {
  const hugeArray = new Array(1e6).fill('data');
  return () => hugeArray[0]; // entire array stays in memory
}
```

## WeakMap / WeakSet for GC-friendly caches

```js
const cache = new WeakMap();

function process(element) {
  if (cache.has(element)) return cache.get(element);
  const result = heavyComputation(element);
  cache.set(element, result); // GC'd when element is removed from DOM
  return result;
}
```

## Profiling in Chrome DevTools

1. Open DevTools → **Memory** tab
2. Take a **Heap Snapshot**
3. Perform the action you suspect leaks
4. Take another snapshot
5. Compare — look for objects that grew unexpectedly

> ⚠️ **Warning:** `WeakMap` / `WeakSet` keys must be objects. They allow GC to collect entries when no other reference to the key exists.
