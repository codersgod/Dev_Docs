---
title: "Data Types"
category: "javascript"
chapterId: "js-core-fundamentals"
slug: "js-data-types"
description: "Primitives vs reference types, typeof, and type coercion."
---

# Data Types

## What is it?

JavaScript has two categories of types: **primitive** (stored by value) and **reference** (stored by address in memory).

**Primitive types** — 7 total:
`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`

**Reference types**: `object`, `array`, `function` (all objects under the hood)

## When does it matter?

Primitives are copied when assigned. Reference types share the same memory address — mutating one variable affects all references pointing to it.

## How to use it

```js
// Primitives — copied by value
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 — unchanged

// Reference — shared by address
let obj1 = { name: 'Alice' };
let obj2 = obj1;
obj2.name = 'Bob';
console.log(obj1.name); // 'Bob' — both point to same object
```

## typeof gotchas

```js
typeof 'hello'     // 'string'
typeof 42          // 'number'
typeof true        // 'boolean'
typeof undefined   // 'undefined'
typeof null        // 'object' ← famous JS bug, not a real object
typeof []          // 'object' ← use Array.isArray() instead
typeof function(){} // 'function'
typeof Symbol()    // 'symbol'
typeof 9007199254740993n // 'bigint'
```

## Type coercion

JS silently converts types in operations:

```js
'5' + 1   // '51'  — number coerced to string (+ concatenates)
'5' - 1   // 4     — string coerced to number (- only does math)
true + 1  // 2     — true is 1
null + 1  // 1     — null is 0
[] + {}   // '[object Object]'
```

> ⚠️ **Warning:** Always use `===` over `==` to avoid implicit coercion surprises.
