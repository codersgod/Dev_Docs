---
title: "Memory & References"
category: "javascript"
chapterId: "js-core-fundamentals"
slug: "js-memory-references"
description: "Pass by value vs pass by reference in memory allocation."
---

# Memory & References

## What is it?

**Stack** stores primitives — small, fixed-size values. **Heap** stores objects — dynamic, larger structures. This determines how variables behave when copied.

- **Pass by value**: a copy of the actual data is made (primitives)
- **Pass by reference**: a copy of the memory address is made (objects)

## How to use it

```js
// Pass by value — primitives
function addTen(n) {
  n += 10;
}
let num = 5;
addTen(num);
console.log(num); // 5 — unchanged, function got a copy

// Pass by reference — objects
function rename(person) {
  person.name = 'Bob';
}
let user = { name: 'Alice' };
rename(user);
console.log(user.name); // 'Bob' — same object in memory

// Reassigning the parameter does NOT affect the original
function replace(person) {
  person = { name: 'Charlie' }; // creates a new local reference
}
replace(user);
console.log(user.name); // 'Bob' — original untouched
```

## Comparing objects

```js
const a = { x: 1 };
const b = { x: 1 };
const c = a;

a === b // false — different references in memory
a === c // true  — same reference
```

> ⚠️ **Warning:** Mutating function arguments (objects/arrays) causes side effects that are hard to trace. Prefer returning new objects instead of modifying the input.
