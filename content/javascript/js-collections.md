---
title: "Map, Set, WeakMap, WeakSet"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-collections"
description: "Advanced collections and weak reference garbage collection."
---

# Map, Set, WeakMap, WeakSet

## Map — key-value store (any type as key)

```js
const map = new Map();
map.set('name', 'Alice');
map.set(42, 'answer');
map.set({ id: 1 }, 'user object key'); // object as key — impossible with plain obj

map.get('name');   // 'Alice'
map.has(42);       // true
map.size;          // 3
map.delete(42);

// Iteration (preserves insertion order)
for (const [key, value] of map) {
  console.log(key, value);
}
```

## Set — unique values only

```js
const set = new Set([1, 2, 3, 2, 1]);
console.log([...set]); // [1, 2, 3] — duplicates removed

set.add(4);
set.has(3); // true
set.delete(1);
set.size;   // 3

// Remove duplicates from array
const unique = [...new Set([1, 1, 2, 2, 3])]; // [1, 2, 3]
```

## WeakMap and WeakSet

Hold **weak references** — the key/value can be garbage collected when no other reference exists. Not iterable, no `size` property.

```js
let element = document.getElementById('btn');
const metadata = new WeakMap();
metadata.set(element, { clicks: 0 });

// When element is removed from DOM and dereferenced:
element = null;
// WeakMap entry is automatically garbage collected
```

## When to use which

| | Key type | GC-friendly | Iterable |
|---|---|---|---|
| `Map` | Any | No | ✅ Yes |
| `Set` | — | No | ✅ Yes |
| `WeakMap` | Objects only | ✅ Yes | ❌ No |
| `WeakSet` | Objects only | ✅ Yes | ❌ No |

> ⚠️ **Warning:** Use `WeakMap` for caching DOM-related data. Once the DOM node is removed, the cache entry is automatically freed — no manual cleanup needed.
