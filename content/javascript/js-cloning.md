---
title: "Deep vs Shallow Clone"
category: "javascript"
chapterId: "js-memory-performance"
slug: "js-cloning"
description: "structuredClone(), JSON fallback, and recursive deep copy."
---

# Deep vs Shallow Clone

## What is it?

- **Shallow clone** — copies top-level properties. Nested objects still share the same reference.
- **Deep clone** — fully copies the entire structure. No shared references.

## Shallow clone methods

```js
const original = { a: 1, nested: { b: 2 } };

const spread = { ...original };
const assign = Object.assign({}, original);

spread.nested.b = 99;
console.log(original.nested.b); // 99 — nested is still shared!
```

## Deep clone — structuredClone() (modern, recommended)

```js
const original = { a: 1, nested: { b: 2 }, arr: [1, 2, 3] };
const clone = structuredClone(original);

clone.nested.b = 99;
console.log(original.nested.b); // 2 — fully independent
```

Supports: objects, arrays, Date, Map, Set, RegExp, ArrayBuffer.  
Does NOT support: functions, DOM nodes, class instances with methods.

## JSON fallback (limited)

```js
const clone = JSON.parse(JSON.stringify(original));
// ❌ Loses: undefined, functions, Date, Map, Set, circular refs
```

## Manual recursive deep clone (for custom types)

```js
function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(deepClone);
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, deepClone(v)])
  );
}
```

> ⚠️ **Warning:** `structuredClone` throws on functions and DOM nodes. Check what you're cloning — the JSON trick silently drops unsupported values.
